import { init, decodeRgbExr } from 'exrs';
import { HDRRenderer, DEFAULT_PARAMS } from './renderer';
import { ColorWheel, computeHistogram, drawHistogram, drawParade } from './widgets';
import './style.css';
// ── Clip catalog (28 clips) ──────────────────────────────
const CLIPS = [
    { id: 'dandelion_girl_sunset', label: 'Dandelion Girl Sunset', frames: 97 },
    { id: 'airport_silhouettes_sunset', label: 'Airport Silhouettes Sunset', frames: 121 },
    { id: 'ballerina_arch_spotlight', label: 'Ballerina Arch Spotlight', frames: 121 },
    { id: 'ballerina_window_light', label: 'Ballerina Window Light', frames: 121 },
    { id: 'ballerina_window_reach', label: 'Ballerina Window Reach', frames: 121 },
    { id: 'big_ben_tower', label: 'Big Ben Tower', frames: 75 },
    { id: 'boy_cozy_room_moody', label: 'Boy Cozy Room Moody', frames: 121 },
    { id: 'carousel_night_glow', label: 'Carousel Night Glow', frames: 121 },
    { id: 'cathedral_dome_light', label: 'Cathedral Dome Light', frames: 121 },
    { id: 'cattle_meadow_backlit', label: 'Cattle Meadow Backlit', frames: 121 },
    { id: 'city_highway_night', label: 'City Highway Night', frames: 121 },
    { id: 'city_rooftops_aerial', label: 'City Rooftops Aerial', frames: 121 },
    { id: 'city_roundabout_night', label: 'City Roundabout Night', frames: 121 },
    { id: 'dancer_blue_studio', label: 'Dancer Blue Studio', frames: 121 },
    { id: 'driver_golden_hour_car', label: 'Driver Golden Hour Car', frames: 121 },
    { id: 'dusk_field_clouds', label: 'Dusk Field Clouds', frames: 121 },
    { id: 'forest_stream_golden', label: 'Forest Stream Golden', frames: 121 },
    { id: 'girls_bokeh_picnic', label: 'Girls Bokeh Picnic', frames: 57 },
    { id: 'golden_street_tower', label: 'Golden Street Tower', frames: 121 },
    { id: 'greek_alley_flowers', label: 'Greek Alley Flowers', frames: 121 },
    { id: 'horse_pasture_silhouette', label: 'Horse Pasture Silhouette', frames: 121 },
    { id: 'lakeside_arches_vista', label: 'Lakeside Arches Vista', frames: 121 },
    { id: 'misty_mountains_sunrise', label: 'Misty Mountains Sunrise', frames: 121 },
    { id: 'mountain_road_canyon', label: 'Mountain Road Canyon', frames: 121 },
    { id: 'mountain_sunrise_portrait', label: 'Mountain Sunrise Portrait', frames: 121 },
    { id: 'neon_dancer_club', label: 'Neon Dancer Club', frames: 121 },
    { id: 'night_vendor_cart', label: 'Night Vendor Cart', frames: 121 },
    { id: 'river_cascade_sunlit', label: 'River Cascade Sunlit', frames: 121 },
];
// ── State ────────────────────────────────────────────────
let renderer;
let rgbData = null;
let imgW = 0, imgH = 0;
let params = structuredClone(DEFAULT_PARAMS);
let currentClip = CLIPS[0];
let currentFrame = Math.floor(currentClip.frames / 2);
let loading = false;
let wheels;
let scopeCtx;
let scopeMode = 'histogram';
let histRafId = 0;
let lastHistPixels = null;
// SDR compare
let compareOn = false;
let wipePos = 0.5;
const $ = (s) => document.querySelector(s);
// ── Embed mode (for ComfyUI_Gear and other hosts) ───────
// Activated by `?embed=1`. Hides clip picker + timeline, waits for the
// host to push EXR bytes via postMessage instead of loading a default clip.
// Emits `gear:params_changed` on every grade update; accepts
// `gear:load_exr` and `gear:set_params` inbound.
const EMBED = typeof location !== 'undefined'
    && new URLSearchParams(location.search).has('embed');
let applyingRemoteParams = false;
function postToHost(msg) {
    if (!EMBED || window.parent === window)
        return;
    window.parent.postMessage(msg, '*');
}
// ── Boot ─────────────────────────────────────────────────
async function boot() {
    if (EMBED)
        document.body.classList.add('embed-mode');
    await init();
    renderer = new HDRRenderer($('#canvas'));
    scopeCtx = $('#scope-canvas').getContext('2d');
    const wc = $('#wheels-container');
    const lift = new ColorWheel(wc, 'Lift', 0.45, 0);
    const gamma = new ColorWheel(wc, 'Gamma', 0.50, 1);
    const gain = new ColorWheel(wc, 'Gain', 0.30, 1);
    const offset = new ColorWheel(wc, 'Offset', 0.20, 0);
    wheels = { lift, gamma, gain, offset };
    lift.onUpdate = () => { params.lift = lift.values; renderAndHist(); };
    gamma.onUpdate = () => { params.gamma = gamma.values; renderAndHist(); };
    gain.onUpdate = () => { params.gain = gain.values; renderAndHist(); };
    offset.onUpdate = () => { params.offset = offset.values; renderAndHist(); };
    wireToolbar();
    if (!EMBED)
        wireTimeline(); // embed mode wires the scrubber lazily in setupSequence()
    wirePanel();
    wireScopeTabs();
    wirePanelToggle();
    wirePanelResize();
    wireCompare();
    wireZoomPan($('#canvas'));
    wirePixelInspector($('#canvas'));
    if (EMBED) {
        wireEmbedHost();
        $('.loading').textContent = 'Waiting for image from host…';
        postToHost({ type: 'gear:ready' });
    }
    else {
        await loadFrame(currentClip.id, currentFrame);
    }
}
// ── Embed: inbound postMessage + param sync ──────────────
function wireEmbedHost() {
    window.addEventListener('message', async (ev) => {
        const msg = ev.data;
        if (!msg || typeof msg !== 'object')
            return;
        if (msg.type === 'gear:load_exr' && msg.buffer instanceof ArrayBuffer) {
            await loadExrBuffer(new Uint8Array(msg.buffer));
        }
        else if (msg.type === 'gear:load_exr_sequence' && Array.isArray(msg.urls)) {
            await setupSequence(msg.urls, msg.sdrUrls);
        }
        else if (msg.type === 'gear:load_sdr' && msg.buffer instanceof ArrayBuffer) {
            await loadSDRBuffer(new Uint8Array(msg.buffer), msg.mime || 'image/png');
        }
        else if (msg.type === 'gear:set_params' && msg.params) {
            applyParamsToUI(msg.params, msg.wheels);
        }
        else if (msg.type === 'gear:reset') {
            resetAll();
        }
    });
}
// ── Embed: batch / sequence navigation ──────────────────
// When the host passes multiple EXRs (a ComfyUI batch of N images),
// re-enable the bottom timeline as a frame scrubber that decodes on
// demand from the provided URLs. Single-image loads skip this and use
// `gear:load_exr` with a direct buffer transfer.
let sequenceUrls = [];
let sequenceSdrUrls = null;
let currentSeqIndex = 0;
let seqLoadToken = 0; // cancels in-flight decodes when user scrubs fast
async function setupSequence(urls, sdrUrls) {
    sequenceUrls = urls;
    sequenceSdrUrls = (sdrUrls && Array.isArray(sdrUrls) && sdrUrls.length) ? sdrUrls : null;
    currentSeqIndex = 0;
    if (!urls.length)
        return;
    if (urls.length === 1) {
        // Degenerate "sequence" of 1: keep timeline hidden, fetch + load directly.
        await loadSequenceFrame(0);
        return;
    }
    document.body.classList.add('embed-seq'); // CSS re-enables .timeline
    const fs = $('#frame-slider');
    fs.min = '0';
    fs.max = String(urls.length - 1);
    fs.step = '1';
    fs.value = '0';
    $('#tl-start').textContent = '0';
    $('#tl-end').textContent = String(urls.length - 1);
    $('#frame-num').textContent = '0';
    fs.oninput = () => {
        currentSeqIndex = +fs.value;
        $('#frame-num').textContent = String(currentSeqIndex);
    };
    fs.onchange = () => {
        loadSequenceFrame(+fs.value);
    };
    await loadSequenceFrame(0);
}
async function loadSequenceFrame(i) {
    const url = sequenceUrls[i];
    if (!url)
        return;
    const token = ++seqLoadToken;
    const ov = $('.loading');
    ov.classList.remove('hidden');
    ov.textContent = 'Fetching…';
    try {
        const resp = await fetch(url);
        if (!resp.ok)
            throw new Error(`HTTP ${resp.status}`);
        const buf = new Uint8Array(await resp.arrayBuffer());
        if (token !== seqLoadToken)
            return; // superseded by a newer scrub
        currentSeqIndex = i;
        await loadExrBuffer(buf);
        // If host provided per-frame SDR, swap it in too so A|B compare works
        // across the whole sequence.
        if (sequenceSdrUrls && sequenceSdrUrls[i]) {
            try {
                const sdrResp = await fetch(sequenceSdrUrls[i]);
                if (sdrResp.ok && token === seqLoadToken) {
                    const sdrBytes = new Uint8Array(await sdrResp.arrayBuffer());
                    await loadSDRBuffer(sdrBytes, 'image/png');
                }
            }
            catch { /* SDR is best-effort */ }
        }
    }
    catch (e) {
        ov.textContent = `Error: ${e.message}`;
    }
}
async function loadSDRBuffer(bytes, mime) {
    const blob = new Blob([bytes.slice().buffer], { type: mime });
    const url = URL.createObjectURL(blob);
    try {
        const img = new Image();
        await new Promise((resolve, reject) => {
            img.onload = () => resolve();
            img.onerror = () => reject(new Error('SDR image decode failed'));
            img.src = url;
        });
        renderer.uploadSDR(img);
        const sx = imgW / img.naturalWidth;
        const sy = imgH / img.naturalHeight;
        const ox = (1 - sx) / 2;
        const oy = (1 - sy) / 2;
        renderer.sdrCrop = [sx, sy, ox, oy];
        requestAnimationFrame(() => renderAndHist());
    }
    finally {
        URL.revokeObjectURL(url);
    }
}
async function loadExrBuffer(bytes) {
    const ov = $('.loading');
    ov.classList.remove('hidden');
    ov.textContent = 'Decoding…';
    await new Promise(r => setTimeout(r, 0));
    try {
        const t0 = performance.now();
        const dec = decodeRgbExr(bytes);
        const dt = (performance.now() - t0).toFixed(0);
        rgbData = dec.interleavedRgbPixels;
        imgW = dec.width;
        imgH = dec.height;
        renderer.uploadImage(rgbData, imgW, imgH);
        resetView($('#canvas')); // each new image starts fit-to-viewport
        // Render inside rAF so the GL draw lands in the next compositor pass.
        // Without this, the draw happens in a macrotask that the compositor
        // may skip — the canvas stays black until *some* subsequent event
        // (e.g. a slider move) forces a re-render in a compositor-synced frame.
        requestAnimationFrame(() => renderAndHist());
        $('#info-res').textContent = `${imgW}×${imgH}`;
        $('#info-decode').textContent = `${dt} ms`;
        ov.classList.add('hidden');
    }
    catch (e) {
        ov.textContent = `Error: ${e.message}`;
    }
}
/**
 * Apply a params object to UI controls without re-emitting params_changed
 * back to the host. Tolerant: only keys present in `p` are applied.
 *
 * If `wheelStates` is provided, restore exact wheel dot + master position;
 * otherwise fall back to lossy rgb-only restoration via setValues().
 */
function applyParamsToUI(p, wheelStates) {
    applyingRemoteParams = true;
    try {
        if (p.exposure != null) {
            params.exposure = p.exposure;
            $('#sl-exposure').value = String(p.exposure);
            $('#tb-ev').value = p.exposure.toFixed(2);
            $('#ev-reset').classList.toggle('show', Math.abs(p.exposure) > 0.001);
        }
        if (p.toneMapping != null) {
            params.toneMapping = p.toneMapping;
            $('#tm-select').value = String(p.toneMapping);
        }
        const scalarMap = [
            ['softClip', '#sl-softclip'],
            ['contrast', '#sl-contrast'],
            ['pivot', '#sl-pivot'],
            ['shadows', '#sl-shadows'],
            ['highlights', '#sl-highlights'],
            ['temperature', '#sl-temperature'],
            ['tint', '#sl-tint'],
            ['saturation', '#sl-saturation'],
            ['vibrance', '#sl-vibrance'],
            ['hueShift', '#sl-hueshift'],
        ];
        for (const [key, sel] of scalarMap) {
            const v = p[key];
            if (v == null)
                continue;
            params[key] = v;
            setSlider(sel, v);
        }
        // Prefer full wheel state (exact restoration) over rgb-only (lossy).
        if (wheelStates?.lift)
            wheels.lift.setState(wheelStates.lift);
        else if (p.lift)
            wheels.lift.setValues([...p.lift]);
        if (wheelStates?.gamma)
            wheels.gamma.setState(wheelStates.gamma);
        else if (p.gamma)
            wheels.gamma.setValues([...p.gamma]);
        if (wheelStates?.gain)
            wheels.gain.setState(wheelStates.gain);
        else if (p.gain)
            wheels.gain.setValues([...p.gain]);
        if (wheelStates?.offset)
            wheels.offset.setState(wheelStates.offset);
        else if (p.offset)
            wheels.offset.setValues([...p.offset]);
        // Sync params.* to whatever the wheels now produce (setState recomputes).
        params.lift = wheels.lift.values;
        params.gamma = wheels.gamma.values;
        params.gain = wheels.gain.values;
        params.offset = wheels.offset.values;
        if (p.falseColor != null) {
            params.falseColor = !!p.falseColor;
            $('#fc-check').checked = params.falseColor;
            $('.fc-legend').classList.toggle('show', params.falseColor);
        }
        requestAnimationFrame(() => renderAndHist());
    }
    finally {
        applyingRemoteParams = false;
    }
}
// ── EXR loading ──────────────────────────────────────────
// In dev: /clips/ is served by Vite middleware from ../clips/.
// In prod: Vite injects VITE_CLIP_BASE_URL (e.g. HuggingFace dataset URL).
const CLIP_BASE = (import.meta.env.VITE_CLIP_BASE_URL ?? '/clips').replace(/\/$/, '');
function frameUrl(clip, frame) {
    return `${CLIP_BASE}/${clip}/hdr_exr/frame_${String(frame).padStart(5, '0')}.exr`;
}
function sdrUrl(clip, frame) {
    return `${CLIP_BASE}/${clip}/sdr_png/frame_${String(frame).padStart(5, '0')}.png`;
}
async function loadFrame(clip, frame) {
    if (loading)
        return;
    loading = true;
    const ov = $('.loading');
    ov.classList.remove('hidden');
    ov.textContent = 'Loading EXR\u2026';
    try {
        const resp = await fetch(frameUrl(clip, frame));
        if (!resp.ok)
            throw new Error(`HTTP ${resp.status}`);
        const buf = new Uint8Array(await resp.arrayBuffer());
        ov.textContent = 'Decoding\u2026';
        await new Promise(r => setTimeout(r, 0));
        const t0 = performance.now();
        const dec = decodeRgbExr(buf);
        const dt = (performance.now() - t0).toFixed(0);
        rgbData = dec.interleavedRgbPixels;
        imgW = dec.width;
        imgH = dec.height;
        renderer.uploadImage(rgbData, imgW, imgH);
        resetView($('#canvas')); // standalone clip browser also fits each new frame
        renderAndHist();
        $('#info-res').textContent = `${imgW}\u00d7${imgH}`;
        $('#info-decode').textContent = `${dt} ms`;
        // load SDR counterpart if compare is on
        if (compareOn)
            loadSDR(clip, frame);
    }
    catch (e) {
        ov.textContent = `Error: ${e.message}`;
        loading = false;
        return;
    }
    ov.classList.add('hidden');
    loading = false;
}
// ── .cube LUT parser ─────────────────────────────────────
function parseCube(text) {
    const lines = text.split(/\r?\n/);
    let size = 0;
    const values = [];
    for (const line of lines) {
        const t = line.trim();
        if (!t || t.startsWith('#') || t.startsWith('TITLE') || t.startsWith('DOMAIN'))
            continue;
        if (t.startsWith('LUT_3D_SIZE')) {
            size = parseInt(t.split(/\s+/)[1], 10);
            continue;
        }
        if (t.startsWith('LUT_1D_SIZE'))
            return null; // 1D LUTs not supported
        const parts = t.split(/\s+/);
        if (parts.length >= 3) {
            const r = parseFloat(parts[0]), g = parseFloat(parts[1]), b = parseFloat(parts[2]);
            if (!isNaN(r)) {
                values.push(r, g, b);
            }
        }
    }
    if (size < 2 || values.length !== size * size * size * 3)
        return null;
    return { size, data: new Float32Array(values) };
}
function loadSDR(clip, frame) {
    const img = new Image();
    img.onload = () => {
        renderer.uploadSDR(img);
        // Compute crop mapping: HDR UVs [0,1] → center crop of SDR
        const sx = imgW / img.naturalWidth; // e.g. 1920/1920=1 or 1024/1080=0.948
        const sy = imgH / img.naturalHeight; // e.g. 1024/1080=0.948 or 1920/1920=1
        const ox = (1 - sx) / 2;
        const oy = (1 - sy) / 2;
        renderer.sdrCrop = [sx, sy, ox, oy];
        renderAndHist();
    };
    img.src = sdrUrl(clip, frame);
}
// ── Render + scope ───────────────────────────────────────
function getWheelStates() {
    return {
        lift: wheels.lift.getState(),
        gamma: wheels.gamma.getState(),
        gain: wheels.gain.getState(),
        offset: wheels.offset.getState(),
    };
}
function renderAndHist() {
    if (!rgbData)
        return;
    renderer.render(params);
    if (EMBED && !applyingRemoteParams) {
        postToHost({
            type: 'gear:params_changed',
            params: structuredClone(params),
            wheels: getWheelStates(),
        });
    }
    if (histRafId)
        return;
    histRafId = requestAnimationFrame(() => {
        histRafId = 0;
        if (!rgbData)
            return;
        lastHistPixels = renderer.readHistogramPixels(params);
        renderer.render(params);
        drawScope();
    });
}
function drawScope() {
    if (!lastHistPixels)
        return;
    const c = scopeCtx.canvas;
    if (scopeMode === 'parade') {
        drawParade(scopeCtx, lastHistPixels, 320, 180, c.width, c.height);
    }
    else {
        const [rH, gH, bH] = computeHistogram(lastHistPixels);
        drawHistogram(scopeCtx, rH, gH, bH, c.width, c.height);
    }
}
// ══════════════════════════════════════════════════════════
//  UI wiring
// ══════════════════════════════════════════════════════════
function wireToolbar() {
    // Thumbnail clip picker — only built in standalone mode. Embed mode has
    // no clip catalog, and even hidden <img src=...> elements would issue
    // (failing) HTTP requests for thumbnails the host doesn't serve.
    if (!EMBED) {
        const trigger = $('#clip-trigger');
        const triggerThumb = $('#clip-trigger-thumb');
        const triggerName = $('#clip-trigger-name');
        const popup = $('#clip-popup');
        const grid = $('#clip-grid');
        const thumbUrl = (id) => `${CLIP_BASE}/${id}/thumbnail.jpg`;
        function updateTrigger() {
            triggerThumb.src = thumbUrl(currentClip.id);
            triggerName.textContent = currentClip.label;
        }
        function selectClip(i) {
            currentClip = CLIPS[i];
            const fs = $('#frame-slider');
            fs.max = String(currentClip.frames - 1);
            $('#tl-end').textContent = String(currentClip.frames - 1);
            currentFrame = Math.min(currentFrame, currentClip.frames - 1);
            fs.value = String(currentFrame);
            $('#frame-num').textContent = String(currentFrame);
            updateTrigger();
            grid.querySelectorAll('.clip-item').forEach((el, idx) => {
                el.classList.toggle('active', idx === i);
            });
            popup.classList.remove('open');
            loadFrame(currentClip.id, currentFrame);
        }
        CLIPS.forEach((c, i) => {
            const item = document.createElement('div');
            item.className = 'clip-item' + (i === 0 ? ' active' : '');
            item.innerHTML =
                `<img class="clip-item-thumb" src="${thumbUrl(c.id)}" loading="lazy" alt=""/>` +
                    `<div class="clip-item-name">${c.label}</div>`;
            item.addEventListener('click', () => selectClip(i));
            grid.appendChild(item);
        });
        updateTrigger();
        trigger.addEventListener('click', (e) => {
            e.stopPropagation();
            popup.classList.toggle('open');
        });
        document.addEventListener('click', (e) => {
            if (!popup.contains(e.target) && e.target !== trigger) {
                popup.classList.remove('open');
            }
        });
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape')
                popup.classList.remove('open');
        });
    }
    // EV slider + number input + reset
    const evSlider = $('#sl-exposure');
    const evNum = $('#tb-ev');
    const evReset = $('#ev-reset');
    function setEV(val) {
        val = Math.max(-6, Math.min(6, val));
        params.exposure = val;
        evSlider.value = String(val);
        evNum.value = val.toFixed(2);
        evReset.classList.toggle('show', Math.abs(val) > 0.001);
        renderAndHist();
    }
    evSlider.addEventListener('input', () => setEV(+evSlider.value));
    evNum.addEventListener('change', () => setEV(parseFloat(evNum.value) || 0));
    evNum.addEventListener('keydown', (e) => { if (e.key === 'Enter')
        evNum.blur(); });
    evReset.addEventListener('click', () => setEV(0));
    // tone mapping
    const tmSel = $('#tm-select');
    tmSel.value = String(params.toneMapping);
    tmSel.addEventListener('change', () => { params.toneMapping = +tmSel.value; renderAndHist(); });
    // LUT loader
    const lutBtn = $('#btn-lut');
    const lutFile = $('#lut-file');
    const lutName = $('#lut-name');
    lutBtn.addEventListener('click', () => {
        if (renderer.lutEnabled) {
            // Toggle off
            renderer.clearLUT();
            lutBtn.classList.remove('active');
            lutName.textContent = '';
            renderAndHist();
        }
        else {
            lutFile.click();
        }
    });
    lutFile.addEventListener('change', () => {
        const file = lutFile.files?.[0];
        if (!file)
            return;
        const reader = new FileReader();
        reader.onload = () => {
            const result = parseCube(reader.result);
            if (!result) {
                alert('Could not parse .cube file (only 3D LUTs supported)');
                return;
            }
            renderer.uploadLUT(result.data, result.size);
            lutBtn.classList.add('active');
            lutName.textContent = file.name.replace('.cube', '');
            renderAndHist();
        };
        reader.readAsText(file);
        lutFile.value = ''; // allow re-selecting same file
    });
}
function wireTimeline() {
    const fs = $('#frame-slider');
    fs.max = String(currentClip.frames - 1);
    fs.value = String(currentFrame);
    $('#frame-num').textContent = String(currentFrame);
    $('#tl-end').textContent = String(currentClip.frames - 1);
    fs.addEventListener('input', () => {
        currentFrame = +fs.value;
        $('#frame-num').textContent = String(currentFrame);
    });
    fs.addEventListener('change', () => {
        currentFrame = +fs.value;
        loadFrame(currentClip.id, currentFrame);
    });
}
function wirePanel() {
    bindSlider('#sl-softclip', 'softClip', v => v.toFixed(2));
    bindSlider('#sl-contrast', 'contrast', v => v.toFixed(2));
    bindSlider('#sl-pivot', 'pivot', v => v.toFixed(2));
    bindSlider('#sl-shadows', 'shadows', v => v.toFixed(2));
    bindSlider('#sl-highlights', 'highlights', v => v.toFixed(2));
    bindSlider('#sl-temperature', 'temperature', v => v.toFixed(2));
    bindSlider('#sl-tint', 'tint', v => v.toFixed(2));
    bindSlider('#sl-saturation', 'saturation', v => v.toFixed(2));
    bindSlider('#sl-vibrance', 'vibrance', v => v.toFixed(2));
    bindSlider('#sl-hueshift', 'hueShift', v => `${v.toFixed(0)}\u00b0`);
    $('#fc-check').addEventListener('change', (e) => {
        params.falseColor = e.target.checked;
        $('.fc-legend').classList.toggle('show', params.falseColor);
        renderAndHist();
    });
    $('#btn-reset').addEventListener('click', resetAll);
}
function wireScopeTabs() {
    document.querySelectorAll('.scope-tab').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.scope-tab').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            scopeMode = btn.dataset.mode;
            drawScope();
        });
    });
}
function wirePanelToggle() {
    const wrap = $('#panel-wrap');
    const btn = $('#btn-panel');
    function toggle() {
        wrap.classList.toggle('hidden');
        btn.classList.toggle('active', !wrap.classList.contains('hidden'));
    }
    btn.addEventListener('click', toggle);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Tab' && !e.ctrlKey && !e.altKey && document.activeElement?.tagName !== 'INPUT') {
            e.preventDefault();
            toggle();
        }
    });
    btn.classList.add('active');
}
function wirePanelResize() {
    const wrap = $('#panel-wrap');
    const handle = $('#panel-resize');
    let dragging = false;
    handle.addEventListener('pointerdown', (e) => {
        dragging = true;
        handle.setPointerCapture(e.pointerId);
        document.body.style.cursor = 'col-resize';
        document.body.style.userSelect = 'none';
    });
    window.addEventListener('pointermove', (e) => {
        if (!dragging)
            return;
        wrap.style.width = Math.max(260, Math.min(600, document.documentElement.clientWidth - e.clientX)) + 'px';
    });
    window.addEventListener('pointerup', () => {
        if (!dragging)
            return;
        dragging = false;
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
    });
}
// ── SDR Compare (wipe) ───────────────────────────────────
function wireCompare() {
    const btn = $('#btn-compare');
    const wipeLine = $('#wipe-line');
    const lblL = $('#wipe-label-l');
    const lblR = $('#wipe-label-r');
    const canvas = $('#canvas');
    function toggleCompare() {
        compareOn = !compareOn;
        renderer.compareOn = compareOn;
        btn.classList.toggle('active', compareOn);
        wipeLine.classList.toggle('active', compareOn);
        lblL.classList.toggle('active', compareOn);
        lblR.classList.toggle('active', compareOn);
        if (compareOn)
            loadSDR(currentClip.id, currentFrame);
        renderAndHist();
        updateWipeUI();
    }
    btn.addEventListener('click', toggleCompare);
    window.addEventListener('keydown', (e) => {
        if (e.key === 'c' && !e.ctrlKey && document.activeElement?.tagName !== 'INPUT')
            toggleCompare();
    });
    // wipe drag — on the canvas itself (not just the thin line)
    let wipeDrag = false;
    wipeLine.addEventListener('pointerdown', (e) => {
        wipeDrag = true;
        wipeLine.setPointerCapture(e.pointerId);
    });
    canvas.addEventListener('pointerdown', (e) => {
        if (!compareOn || e.ctrlKey)
            return;
        wipeDrag = true;
        const rect = canvas.getBoundingClientRect();
        wipePos = Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / rect.width));
        renderer.wipePos = wipePos;
        renderAndHist();
        updateWipeUI();
    });
    window.addEventListener('pointermove', (e) => {
        if (!wipeDrag || !compareOn)
            return;
        const rect = canvas.getBoundingClientRect();
        wipePos = Math.max(0.02, Math.min(0.98, (e.clientX - rect.left) / rect.width));
        renderer.wipePos = wipePos;
        renderAndHist();
        updateWipeUI();
    });
    window.addEventListener('pointerup', () => { wipeDrag = false; });
}
function updateWipeUI() {
    const wipeLine = $('#wipe-line');
    const lblL = $('#wipe-label-l');
    const lblR = $('#wipe-label-r');
    // Position CSS wipe line over the canvas area
    const canvas = $('#canvas');
    const rect = canvas.getBoundingClientRect();
    const viewport = canvas.closest('.viewport');
    const vRect = viewport.getBoundingClientRect();
    const lineX = rect.left - vRect.left + rect.width * wipePos;
    wipeLine.style.left = lineX + 'px';
    lblL.style.left = (rect.left - vRect.left + rect.width * wipePos * 0.5) + 'px';
    lblR.style.left = (rect.left - vRect.left + rect.width * (wipePos + (1 - wipePos) * 0.5)) + 'px';
}
// ── Pixel inspector ──────────────────────────────────────
// ── Zoom + Pan (CSS transform) ───────────────────────────
//   Wheel               — zoom in/out, centered on cursor
//   Middle-drag         — pan (always)
//   Left-drag           — pan (only when compare wipe is OFF; otherwise
//                         left-drag drives the wipe line)
//   Double-click / 0/F  — reset to fit
//
// CSS-transform-based so the canvas itself grows beyond its fit-to-
// viewport size at zoom > 1 (viewport has overflow:hidden). Pan and
// pixel inspection both use getBoundingClientRect, which returns the
// post-transform rect — no manual inverse math needed.
let viewZoom = 1;
let viewPanX = 0; // CSS pixels
let viewPanY = 0;
function applyView(canvas) {
    canvas.style.transformOrigin = '50% 50%';
    canvas.style.transform = `translate(${viewPanX}px, ${viewPanY}px) scale(${viewZoom})`;
    // Wipe overlay positions reference the canvas's bounding rect, which
    // is post-transform — keep them in sync after every change.
    if (compareOn)
        updateWipeUI();
}
function resetView(canvas) {
    viewZoom = 1;
    viewPanX = 0;
    viewPanY = 0;
    applyView(canvas);
}
function wireZoomPan(canvas) {
    let panning = false;
    let startX = 0, startY = 0, startPanX = 0, startPanY = 0;
    canvas.addEventListener('wheel', (e) => {
        if (!rgbData)
            return;
        e.preventDefault();
        // Cursor's image-UV BEFORE zoom — held constant after.
        const rect = canvas.getBoundingClientRect();
        const ux = (e.clientX - rect.left) / rect.width;
        const uy = (e.clientY - rect.top) / rect.height;
        const oldZ = viewZoom;
        const factor = Math.exp(-e.deltaY * 0.0015);
        const newZ = Math.max(0.1, Math.min(64, oldZ * factor));
        if (newZ === oldZ)
            return;
        // After zoom alone (with transform-origin: center), the rect grows
        // around its own center. We then translate so the cursor lands on
        // the same image-UV.
        const newW = rect.width * (newZ / oldZ);
        const newH = rect.height * (newZ / oldZ);
        const newLeftIfNoPanChange = rect.left + rect.width / 2 - newW / 2;
        const newTopIfNoPanChange = rect.top + rect.height / 2 - newH / 2;
        viewPanX += (e.clientX - ux * newW) - newLeftIfNoPanChange;
        viewPanY += (e.clientY - uy * newH) - newTopIfNoPanChange;
        viewZoom = newZ;
        applyView(canvas);
    }, { passive: false });
    canvas.addEventListener('pointerdown', (e) => {
        if (!rgbData)
            return;
        if (e.ctrlKey)
            return; // Ctrl+click = probe
        if (e.button === 0 && compareOn)
            return; // wipe owns left-drag
        if (e.button !== 0 && e.button !== 1)
            return;
        e.preventDefault();
        panning = true;
        canvas.setPointerCapture(e.pointerId);
        startX = e.clientX;
        startY = e.clientY;
        startPanX = viewPanX;
        startPanY = viewPanY;
        canvas.style.cursor = 'grabbing';
    });
    canvas.addEventListener('pointermove', (e) => {
        if (!panning)
            return;
        // Pan in screen pixels — drag direction matches image direction.
        viewPanX = startPanX + (e.clientX - startX);
        viewPanY = startPanY + (e.clientY - startY);
        applyView(canvas);
    });
    const endPan = () => {
        if (!panning)
            return;
        panning = false;
        canvas.style.cursor = '';
    };
    canvas.addEventListener('pointerup', endPan);
    canvas.addEventListener('pointercancel', endPan);
    canvas.addEventListener('dblclick', (e) => {
        if (compareOn || e.ctrlKey)
            return;
        resetView(canvas);
    });
    window.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'SELECT')
            return;
        if (e.key === '0' || e.key === 'f' || e.key === 'F')
            resetView(canvas);
    });
}
function wirePixelInspector(canvas) {
    canvas.addEventListener('mousemove', (e) => {
        if (!rgbData)
            return;
        const rect = canvas.getBoundingClientRect();
        const px = Math.floor((e.clientX - rect.left) * imgW / rect.width);
        const py = Math.floor((e.clientY - rect.top) * imgH / rect.height);
        if (px < 0 || py < 0 || px >= imgW || py >= imgH)
            return;
        const idx = (py * imgW + px) * 3;
        const r = rgbData[idx], g = rgbData[idx + 1], b = rgbData[idx + 2];
        $('#px-coord').textContent = `(${px}, ${py})`;
        $('#px-rgb').textContent = `R:${fmtF(r)} G:${fmtF(g)} B:${fmtF(b)}`;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        $('#px-lum').textContent = `L:${fmtF(lum)}`;
        $('#px-swatch').style.background = `rgb(${cl(r) * 255 | 0},${cl(g) * 255 | 0},${cl(b) * 255 | 0})`;
    });
    canvas.addEventListener('mouseleave', () => {
        $('#px-coord').textContent = '';
        $('#px-rgb').textContent = '';
        $('#px-lum').textContent = '';
    });
    // Ctrl+click probe
    const probe = $('#probe');
    const probeLbl = probe.querySelector('.probe-label');
    const viewport = canvas.closest('.viewport');
    canvas.addEventListener('click', (e) => {
        if (!e.ctrlKey || !rgbData) {
            probe.classList.remove('show');
            return;
        }
        const cRect = canvas.getBoundingClientRect();
        const px = Math.floor((e.clientX - cRect.left) * imgW / cRect.width);
        const py = Math.floor((e.clientY - cRect.top) * imgH / cRect.height);
        if (px < 0 || py < 0 || px >= imgW || py >= imgH)
            return;
        const idx = (py * imgW + px) * 3;
        const r = rgbData[idx], g = rgbData[idx + 1], b = rgbData[idx + 2];
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        const ev = lum > 1e-6 ? Math.log2(lum / 0.18) : -Infinity;
        const evStr = ev > -20 ? `${ev >= 0 ? '+' : ''}${ev.toFixed(1)} EV` : '\u2212\u221e EV';
        const vRect = viewport.getBoundingClientRect();
        const probeX = e.clientX - vRect.left, probeY = e.clientY - vRect.top;
        probe.style.left = probeX + 'px';
        probe.style.top = probeY + 'px';
        if (probeX > vRect.width * 0.65) {
            probeLbl.style.left = 'auto';
            probeLbl.style.right = '14px';
        }
        else {
            probeLbl.style.left = '14px';
            probeLbl.style.right = 'auto';
        }
        probeLbl.innerHTML =
            `<span style="color:var(--dim)">(${px}, ${py})</span>` +
                `<span class="pr">R: ${fmtF(r)}</span><span class="pg">G: ${fmtF(g)}</span>` +
                `<span class="pb">B: ${fmtF(b)}</span><span class="pl">L: ${fmtF(lum)}</span>` +
                `<span class="pev">${evStr}</span>`;
        probe.classList.add('show');
    });
    window.addEventListener('keydown', (e) => { if (e.key === 'Escape')
        probe.classList.remove('show'); });
}
function bindSlider(sel, key, fmt) {
    const slider = $(sel);
    const labelRow = slider.closest('.slider-row').querySelector('.label-row');
    const oldVal = labelRow.querySelector('.val');
    const defaultVal = DEFAULT_PARAMS[key];
    const numInput = document.createElement('input');
    numInput.type = 'number';
    numInput.className = 'val-input';
    numInput.step = slider.step;
    numInput.min = slider.min;
    numInput.max = slider.max;
    oldVal.replaceWith(numInput);
    const rst = document.createElement('button');
    rst.className = 'sl-reset';
    rst.innerHTML = '&#x21ba;';
    rst.title = `Reset to ${fmt(defaultVal)}`;
    labelRow.insertBefore(rst, numInput);
    function syncAll(val) {
        params[key] = val;
        slider.value = String(val);
        numInput.value = fmt(val).replace('°', '');
        rst.classList.toggle('show', Math.abs(val - defaultVal) > 0.001);
        renderAndHist();
    }
    syncAll(params[key]);
    slider.addEventListener('input', () => syncAll(+slider.value));
    numInput.addEventListener('change', () => {
        let v = parseFloat(numInput.value);
        if (isNaN(v))
            v = defaultVal;
        syncAll(Math.max(+slider.min, Math.min(+slider.max, v)));
    });
    numInput.addEventListener('keydown', (e) => { if (e.key === 'Enter')
        numInput.blur(); });
    rst.addEventListener('click', () => syncAll(defaultVal));
}
function setSlider(sel, value) {
    $(sel).value = String(value);
    $(sel).dispatchEvent(new Event('input'));
}
function resetAll() {
    params = structuredClone(DEFAULT_PARAMS);
    // toolbar
    $('#sl-exposure').value = '0';
    $('#tb-ev').value = '0.00';
    $('#ev-reset').classList.remove('show');
    $('#tm-select').value = String(params.toneMapping);
    // panel sliders
    setSlider('#sl-softclip', params.softClip);
    setSlider('#sl-contrast', params.contrast);
    setSlider('#sl-pivot', params.pivot);
    setSlider('#sl-shadows', params.shadows);
    setSlider('#sl-highlights', params.highlights);
    setSlider('#sl-temperature', params.temperature);
    setSlider('#sl-tint', params.tint);
    setSlider('#sl-saturation', params.saturation);
    setSlider('#sl-vibrance', params.vibrance);
    setSlider('#sl-hueshift', params.hueShift);
    wheels.lift.reset();
    wheels.gamma.reset();
    wheels.gain.reset();
    wheels.offset.reset();
    $('#fc-check').checked = false;
    $('.fc-legend').classList.remove('show');
    renderAndHist();
}
function fmtF(v) { return Math.abs(v) >= 10 ? v.toFixed(2) : v.toFixed(4); }
function cl(v) { return Math.max(0, Math.min(1, v)); }
boot().catch(console.error);
//# sourceMappingURL=main.js.map