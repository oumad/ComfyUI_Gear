// ComfyUI frontend extension for Gear Color Grade.
//
// Node UX: one button ("Open grade panel") on the node body. Clicking it
// pops up a modal with the exr-viewer SPA iframe, same pattern as
// ComfyUI's built-in mask editor.
//
// Persistence model:
//   - Scalar grade params (exposure, gains, etc.) live in ComfyUI widgets.
//     Hidden on the node body, but still serialized with the workflow and
//     sent to the Python backend on Run.
//   - Color-wheel dot/master positions live in node.properties.gear_wheels.
//     They're pure UI state — the wheel rgb values already flow through
//     the regular widgets — but storing wheel coords lets us restore the
//     exact dot position on reopen (setValues(rgb) alone is lossy).
//   - Changes in the modal are ephemeral until Save. Save commits both
//     widget values AND wheel state. Cancel/Close/Escape discard.

import { app } from "/scripts/app.js";
import { api } from "/scripts/api.js";

const EXT_BASE = "/extensions/ComfyUI_Gear";
const IFRAME_SRC = `${EXT_BASE}/vendor/exr-viewer/index.html?embed=1`;

// ── Widget <-> RenderParams mapping ─────────────────────────────────────
const TONE_MAPS = ["None", "Reinhard", "ACES Fitted", "AgX", "Hable"];
const GRADING_WIDGET_NAMES = [
  "exposure", "tone_map", "soft_clip", "temperature", "tint",
  "lift_r", "lift_g", "lift_b",
  "gamma_r", "gamma_g", "gamma_b",
  "gain_r", "gain_g", "gain_b",
  "offset_r", "offset_g", "offset_b",
  "contrast", "pivot", "shadows", "highlights",
  "saturation", "vibrance", "hue_shift", "false_color",
];

function widgetsToParams(node) {
  const get = (n) => node.widgets.find((w) => w.name === n)?.value;
  return {
    exposure: get("exposure") ?? 0,
    toneMapping: Math.max(0, TONE_MAPS.indexOf(get("tone_map") ?? "ACES Fitted")),
    softClip: get("soft_clip") ?? 0,
    temperature: get("temperature") ?? 0,
    tint: get("tint") ?? 0,
    lift:   [get("lift_r")   ?? 0, get("lift_g")   ?? 0, get("lift_b")   ?? 0],
    gamma:  [get("gamma_r")  ?? 1, get("gamma_g")  ?? 1, get("gamma_b")  ?? 1],
    gain:   [get("gain_r")   ?? 1, get("gain_g")   ?? 1, get("gain_b")   ?? 1],
    offset: [get("offset_r") ?? 0, get("offset_g") ?? 0, get("offset_b") ?? 0],
    contrast:   get("contrast")   ?? 1,
    pivot:      get("pivot")      ?? 0.18,
    shadows:    get("shadows")    ?? 0,
    highlights: get("highlights") ?? 0,
    saturation: get("saturation") ?? 1,
    vibrance:   get("vibrance")   ?? 0,
    hueShift:   get("hue_shift")  ?? 0,
    falseColor: !!get("false_color"),
  };
}

function paramsToWidgets(node, p) {
  const set = (name, v) => {
    const w = node.widgets.find((x) => x.name === name);
    if (w && v !== undefined) w.value = v;
  };
  if (p.exposure != null)    set("exposure", p.exposure);
  if (p.toneMapping != null) set("tone_map", TONE_MAPS[p.toneMapping] ?? "ACES Fitted");
  if (p.softClip != null)    set("soft_clip", p.softClip);
  if (p.temperature != null) set("temperature", p.temperature);
  if (p.tint != null)        set("tint", p.tint);
  if (p.lift)   { set("lift_r", p.lift[0]);   set("lift_g", p.lift[1]);   set("lift_b", p.lift[2]); }
  if (p.gamma)  { set("gamma_r", p.gamma[0]); set("gamma_g", p.gamma[1]); set("gamma_b", p.gamma[2]); }
  if (p.gain)   { set("gain_r", p.gain[0]);   set("gain_g", p.gain[1]);   set("gain_b", p.gain[2]); }
  if (p.offset) { set("offset_r", p.offset[0]); set("offset_g", p.offset[1]); set("offset_b", p.offset[2]); }
  if (p.contrast != null)    set("contrast", p.contrast);
  if (p.pivot != null)       set("pivot", p.pivot);
  if (p.shadows != null)     set("shadows", p.shadows);
  if (p.highlights != null)  set("highlights", p.highlights);
  if (p.saturation != null)  set("saturation", p.saturation);
  if (p.vibrance != null)    set("vibrance", p.vibrance);
  if (p.hueShift != null)    set("hue_shift", p.hueShift);
  if (p.falseColor != null)  set("false_color", !!p.falseColor);
  node.setDirtyCanvas?.(true, true);
}

// ── Hide grading widgets from the node body ─────────────────────────────
function hideGradingWidgets(node) {
  for (const w of node.widgets || []) {
    if (!GRADING_WIDGET_NAMES.includes(w.name)) continue;
    w.type = "hidden";
    w.computeSize = () => [0, -4];
  }
}

// ── Cache latest EXR/SDR payloads keyed by emitting node id ─────────────
// The grade node now saves its own input as preview EXRs (one per batch
// item) and SDR references when connected, so we look up by *this* node's
// id — no walking upstream graph links. Each grade node is self-contained:
// whatever IMAGE arrived at it on the last Run is what the panel sees.
const lastExrsByNodeId = new Map();  // id -> Array<{filename, subfolder, type}>
const lastSdrsByNodeId = new Map();  // id -> Array<...>

api.addEventListener("executed", (e) => {
  const output = e.detail?.output;
  const nodeId = e.detail?.node;
  if (nodeId == null || !output) return;
  if (output.gear_exr?.length) {
    lastExrsByNodeId.set(String(nodeId), output.gear_exr);
  }
  if (output.gear_sdr?.length) {
    lastSdrsByNodeId.set(String(nodeId), output.gear_sdr);
  }
});

function findInputExrs(node) {
  return lastExrsByNodeId.get(String(node.id)) || [];
}
function findInputSdrs(node) {
  return lastSdrsByNodeId.get(String(node.id)) || [];
}

// ── Modal (iframe-based, shared singleton per page) ─────────────────────
let modalRoot = null;
let iframeEl = null;
let currentNode = null;
let snapshotParams = null;
let snapshotWheels = null;
let workingParams = null;
let workingWheels = null;

function buildModal() {
  const overlay = document.createElement("div");
  overlay.style.cssText = [
    "position:fixed", "inset:0",
    "background:rgba(0,0,0,0.6)", "backdrop-filter:blur(4px)",
    "z-index:10000", "display:none",
    "align-items:center", "justify-content:center",
  ].join(";");

  const shell = document.createElement("div");
  shell.style.cssText = [
    "position:relative",
    "width:min(95vw,1600px)", "height:min(92vh,950px)",
    "background:#111", "border:1px solid #333",
    "border-radius:8px", "overflow:hidden",
    "box-shadow:0 20px 60px rgba(0,0,0,0.6)",
    "display:flex", "flex-direction:column",
  ].join(";");

  const bar = document.createElement("div");
  bar.style.cssText = [
    "display:flex", "align-items:center", "gap:10px",
    "padding:8px 12px", "background:#1a1a1a",
    "border-bottom:1px solid #2a2a2a",
    "font:12px/1.2 ui-sans-serif,system-ui,sans-serif",
    "color:#ccc", "flex:0 0 auto",
  ].join(";");

  const title = document.createElement("span");
  title.textContent = "Gear · Color Grade";
  title.style.cssText = "font-weight:600;letter-spacing:.02em;";

  const spacer = document.createElement("span");
  spacer.style.cssText = "flex:1";

  const status = document.createElement("span");
  status.style.cssText = "font:11px ui-monospace,monospace;color:#888;";

  const btnStyle = [
    "display:inline-flex", "align-items:center", "gap:6px",
    "padding:6px 14px", "border-radius:4px",
    "font:600 12px ui-sans-serif,system-ui,sans-serif",
    "cursor:pointer", "border:1px solid transparent",
    "transition:filter 0.1s",
  ].join(";");

  const cancelBtn = document.createElement("button");
  cancelBtn.innerHTML = "&#10005; Cancel";
  cancelBtn.style.cssText = btnStyle + ";background:#2a2a2a;color:#ddd;border-color:#3a3a3a;";
  cancelBtn.onmouseover = () => (cancelBtn.style.filter = "brightness(1.2)");
  cancelBtn.onmouseout  = () => (cancelBtn.style.filter = "");
  cancelBtn.onclick = cancelModal;

  const saveBtn = document.createElement("button");
  saveBtn.innerHTML = "&#10003; Save";
  saveBtn.style.cssText = btnStyle + ";background:#2d7ef7;color:#fff;";
  saveBtn.onmouseover = () => (saveBtn.style.filter = "brightness(1.1)");
  saveBtn.onmouseout  = () => (saveBtn.style.filter = "");
  saveBtn.onclick = saveModal;

  bar.append(title, spacer, status, cancelBtn, saveBtn);

  const iframe = document.createElement("iframe");
  iframe.style.cssText = "flex:1;width:100%;border:0;background:#000;";

  shell.append(bar, iframe);
  overlay.appendChild(shell);

  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) cancelModal();
  });
  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape" || overlay.style.display !== "flex") return;
    cancelModal();
  });

  document.body.appendChild(overlay);
  modalRoot = { overlay, status };
  iframeEl = iframe;
  return modalRoot;
}

function setStatus(msg) {
  if (modalRoot) modalRoot.status.textContent = msg;
}

function openModalFor(node) {
  if (!modalRoot) buildModal();
  currentNode = node;
  snapshotParams = widgetsToParams(node);
  snapshotWheels = node.properties?.gear_wheels
    ? JSON.parse(JSON.stringify(node.properties.gear_wheels))
    : null;
  workingParams = { ...snapshotParams };
  workingWheels = snapshotWheels ? JSON.parse(JSON.stringify(snapshotWheels)) : null;
  modalRoot.overlay.style.display = "flex";
  setStatus("Loading viewer…");
  iframeEl.src = IFRAME_SRC;
}

function closeModal() {
  if (!modalRoot) return;
  modalRoot.overlay.style.display = "none";
  iframeEl.src = "about:blank";
  currentNode = null;
  snapshotParams = null;
  snapshotWheels = null;
  workingParams = null;
  workingWheels = null;
}

function saveModal() {
  if (currentNode && workingParams) {
    paramsToWidgets(currentNode, workingParams);
    currentNode.properties = currentNode.properties || {};
    currentNode.properties.gear_wheels = workingWheels || null;
  }
  closeModal();
}

function cancelModal() {
  closeModal();
}

// ── Iframe init: push params + source image(s) ──────────────────────────
async function onIframeReady() {
  if (!currentNode || !iframeEl?.contentWindow) return;
  const win = iframeEl.contentWindow;

  win.postMessage(
    { type: "gear:set_params", params: snapshotParams, wheels: snapshotWheels },
    "*"
  );

  const exrs = findInputExrs(currentNode);
  const sdrs = findInputSdrs(currentNode);
  if (!exrs.length) {
    setStatus("Run graph once to populate the preview image.");
    return;
  }

  try {
    if (exrs.length === 1) {
      setStatus("Fetching EXR…");
      const buf = await fetchBytes("/api/view?" + viewQs(exrs[0]));
      win.postMessage({ type: "gear:load_exr", buffer: buf }, "*", [buf]);
      if (sdrs.length) {
        const sdrBuf = await fetchBytes("/api/view?" + viewQs(sdrs[0]));
        win.postMessage(
          { type: "gear:load_sdr", buffer: sdrBuf, mime: "image/png" },
          "*",
          [sdrBuf],
        );
      }
      setStatus(sdrs.length ? "EXR + SDR loaded." : "EXR loaded.");
    } else {
      setStatus(`Loading batch (${exrs.length} frames)…`);
      const urls = exrs.map((e) => "/api/view?" + viewQs(e));
      const sdrUrls = sdrs.length
        ? sdrs.map((s) => "/api/view?" + viewQs(s))
        : null;
      win.postMessage({ type: "gear:load_exr_sequence", urls, sdrUrls }, "*");
      setStatus(
        sdrUrls
          ? `${exrs.length} frames + ${sdrs.length} SDR loaded.`
          : `${exrs.length} frames loaded.`,
      );
    }
  } catch (err) {
    console.error("[Gear] source load failed", err);
    setStatus(`Load failed: ${err.message}`);
  }
}

function viewQs(info) {
  return new URLSearchParams({
    filename: info.filename,
    subfolder: info.subfolder || "",
    type: info.type || "output",
  }).toString();
}

async function fetchBytes(url) {
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`HTTP ${resp.status} on ${url}`);
  return resp.arrayBuffer();
}

window.addEventListener("message", (ev) => {
  if (!iframeEl || ev.source !== iframeEl.contentWindow) return;
  const msg = ev.data;
  if (!msg || typeof msg !== "object") return;

  if (msg.type === "gear:ready") {
    onIframeReady();
  } else if (msg.type === "gear:params_changed") {
    workingParams = msg.params;
    if (msg.wheels) workingWheels = msg.wheels;
  }
});

// ── Extension registration ──────────────────────────────────────────────
app.registerExtension({
  name: "gear.color_grade",
  async beforeRegisterNodeDef(nodeType, nodeData) {
    if (nodeData.name !== "GearColorGrade") return;

    const origOnNodeCreated = nodeType.prototype.onNodeCreated;
    nodeType.prototype.onNodeCreated = function () {
      origOnNodeCreated?.apply(this, arguments);
      hideGradingWidgets(this);
      const btn = this.addWidget("button", "Open grade panel", null, () => openModalFor(this));
      btn.serialize = false;
    };
  },
});
