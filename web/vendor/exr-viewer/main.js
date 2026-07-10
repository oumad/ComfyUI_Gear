import { init, decodeRgbExr } from 'exrs';
import { HDRRenderer, DEFAULT_PARAMS } from './renderer';
import { ColorWheel, computeHistogram, drawHistogram, drawParade } from './widgets';
import './style.css';
// ── Clip catalog ─────────────────────────────────────────
// Clean SDR→HDR encoding comparison: 15 scenes, each in three encodings
// (LogC3 = original 10k LoRA, LogC4 = v3, ACEScct = v6@5250), generated through
// the same single-stage pipeline (49 frames, same seed) so they're apples-to-apples.
// Grouped by scene; use the A|B "vs" dropdown to wipe any 2 (incl. SDR).
// ACEScg/AP1 variants (v7-line: rank32 v7 + all rank128) need AP1->Rec.709 for display.
// Rec.709-primary variants (acescct/v6, logc4/v3, logc3/orig) must NOT be converted.
const AP1_VARIANTS = ['v7', 'r128prod5k', 'r128adamw5k', 'r128prod', 'r128adamw', 'ichdri3k', 'ichdri7k', 'ichdri10k', 'full5k', 'full10k', 'cgi3k', 'cgi55', 'full7k', 't2vprod', 'nostraw', 'hdri'];
const isAP1 = (clip) => AP1_VARIANTS.includes(clip.split('__').pop() || '');
const CLIPS = [
    // Clean SDR->HDR encoding comparison: each scene in LogC3 / LogC4 / ACEScct.
    // A|B 'vs' dropdown wipes any 2 (incl. SDR). Same pipeline/seed/49f -> apples-to-apples.
    { id: 'dandelion_girl_sunset__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Dandelion sunset' },
    { id: 'dandelion_girl_sunset__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Dandelion sunset' },
    { id: 'dandelion_girl_sunset__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Dandelion sunset' },
    { id: 'carousel_night_glow__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Carousel night' },
    { id: 'carousel_night_glow__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Carousel night' },
    { id: 'carousel_night_glow__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Carousel night' },
    { id: 'city_highway_night__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'City highway night' },
    { id: 'city_highway_night__logc4', label: 'LogC4 (v3)', frames: 49, category: 'City highway night' },
    { id: 'city_highway_night__logc3', label: 'LogC3 (orig)', frames: 49, category: 'City highway night' },
    { id: 'ballerina_arch_spotlight__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Ballerina arch' },
    { id: 'ballerina_arch_spotlight__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Ballerina arch' },
    { id: 'ballerina_arch_spotlight__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Ballerina arch' },
    { id: 'ballerina_window_reach__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Ballerina window' },
    { id: 'ballerina_window_reach__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Ballerina window' },
    { id: 'ballerina_window_reach__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Ballerina window' },
    { id: 'boy_cozy_room_moody__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Boy cozy room' },
    { id: 'boy_cozy_room_moody__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Boy cozy room' },
    { id: 'boy_cozy_room_moody__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Boy cozy room' },
    { id: 'cathedral_dome_light__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Cathedral dome' },
    { id: 'cathedral_dome_light__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Cathedral dome' },
    { id: 'cathedral_dome_light__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Cathedral dome' },
    { id: 'driver_golden_hour_car__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Driver golden hour' },
    { id: 'driver_golden_hour_car__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Driver golden hour' },
    { id: 'driver_golden_hour_car__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Driver golden hour' },
    { id: 'dusk_field_clouds__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Dusk field' },
    { id: 'dusk_field_clouds__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Dusk field' },
    { id: 'dusk_field_clouds__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Dusk field' },
    { id: 'girls_bokeh_picnic__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Girls bokeh picnic' },
    { id: 'girls_bokeh_picnic__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Girls bokeh picnic' },
    { id: 'girls_bokeh_picnic__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Girls bokeh picnic' },
    { id: 'golden_street_tower__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Golden street tower' },
    { id: 'golden_street_tower__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Golden street tower' },
    { id: 'golden_street_tower__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Golden street tower' },
    { id: 'misty_mountains_sunrise__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Misty mountains' },
    { id: 'misty_mountains_sunrise__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Misty mountains' },
    { id: 'misty_mountains_sunrise__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Misty mountains' },
    { id: 'neon_dancer_club__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Neon dancer' },
    { id: 'neon_dancer_club__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Neon dancer' },
    { id: 'neon_dancer_club__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Neon dancer' },
    { id: 'night_vendor_cart__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Night vendor' },
    { id: 'night_vendor_cart__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Night vendor' },
    { id: 'night_vendor_cart__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Night vendor' },
    { id: 'river_cascade_sunlit__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'River cascade' },
    { id: 'river_cascade_sunlit__logc4', label: 'LogC4 (v3)', frames: 49, category: 'River cascade' },
    { id: 'river_cascade_sunlit__logc3', label: 'LogC3 (orig)', frames: 49, category: 'River cascade' },
    { id: 'airport_silhouettes_sunset__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Airport silhouettes' },
    { id: 'airport_silhouettes_sunset__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Airport silhouettes' },
    { id: 'airport_silhouettes_sunset__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Airport silhouettes' },
    { id: 'ballerina_window_light__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Ballerina window light' },
    { id: 'ballerina_window_light__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Ballerina window light' },
    { id: 'ballerina_window_light__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Ballerina window light' },
    { id: 'big_ben_tower__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Big Ben tower' },
    { id: 'big_ben_tower__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Big Ben tower' },
    { id: 'big_ben_tower__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Big Ben tower' },
    { id: 'cattle_meadow_backlit__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Cattle meadow' },
    { id: 'cattle_meadow_backlit__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Cattle meadow' },
    { id: 'cattle_meadow_backlit__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Cattle meadow' },
    { id: 'city_rooftops_aerial__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'City rooftops aerial' },
    { id: 'city_rooftops_aerial__logc4', label: 'LogC4 (v3)', frames: 49, category: 'City rooftops aerial' },
    { id: 'city_rooftops_aerial__logc3', label: 'LogC3 (orig)', frames: 49, category: 'City rooftops aerial' },
    { id: 'city_roundabout_night__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'City roundabout night' },
    { id: 'city_roundabout_night__logc4', label: 'LogC4 (v3)', frames: 49, category: 'City roundabout night' },
    { id: 'city_roundabout_night__logc3', label: 'LogC3 (orig)', frames: 49, category: 'City roundabout night' },
    { id: 'dancer_blue_studio__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Dancer blue studio' },
    { id: 'dancer_blue_studio__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Dancer blue studio' },
    { id: 'dancer_blue_studio__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Dancer blue studio' },
    { id: 'forest_stream_golden__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Forest stream golden' },
    { id: 'forest_stream_golden__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Forest stream golden' },
    { id: 'forest_stream_golden__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Forest stream golden' },
    { id: 'greek_alley_flowers__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Greek alley flowers' },
    { id: 'greek_alley_flowers__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Greek alley flowers' },
    { id: 'greek_alley_flowers__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Greek alley flowers' },
    { id: 'horse_pasture_silhouette__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Horse pasture' },
    { id: 'horse_pasture_silhouette__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Horse pasture' },
    { id: 'horse_pasture_silhouette__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Horse pasture' },
    { id: 'lakeside_arches_vista__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Lakeside arches' },
    { id: 'lakeside_arches_vista__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Lakeside arches' },
    { id: 'lakeside_arches_vista__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Lakeside arches' },
    { id: 'mountain_road_canyon__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Mountain road canyon' },
    { id: 'mountain_road_canyon__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Mountain road canyon' },
    { id: 'mountain_road_canyon__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Mountain road canyon' },
    { id: 'mountain_sunrise_portrait__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Mountain sunrise' },
    { id: 'mountain_sunrise_portrait__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Mountain sunrise' },
    { id: 'mountain_sunrise_portrait__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Mountain sunrise' },
    { id: 'sunlit_loft_windows__r128prod', label: 'ACEScct (Prodigy r128 @10k)', frames: 49, category: 'Sunlit loft' },
    { id: 'sunlit_loft_windows__logc4', label: 'LogC4 (v3)', frames: 49, category: 'Sunlit loft' },
    { id: 'sunlit_loft_windows__logc3', label: 'LogC3 (orig)', frames: 49, category: 'Sunlit loft' },
    // ===== Benchmark: ACEScct Prodigy r128 vs original LogC3 (ltx2.3-hdr-10k) =====
    { id: 'benchmark_red__r128prod', label: 'ACEScct Prodigy r128 @10k (prev top)', frames: 49, category: 'Benchmark: benchmark_red' },
    { id: 'benchmark_red__nostraw', label: 'ACEScct nostraw @10k (NEW)', frames: 49, category: 'Benchmark: benchmark_red' },
    { id: 'benchmark_red__hdri', label: 'ACEScct HDRI-only @10k', frames: 49, category: 'Benchmark: benchmark_red' },
    { id: 'benchmark_red__logc3', label: 'LogC3 orig', frames: 49, category: 'Benchmark: benchmark_red' },
    { id: 'vid__r128prod', label: 'ACEScct Prodigy r128 @10k (prev top)', frames: 49, category: 'Benchmark: vid' },
    { id: 'vid__nostraw', label: 'ACEScct nostraw @10k (NEW)', frames: 49, category: 'Benchmark: vid' },
    { id: 'vid__hdri', label: 'ACEScct HDRI-only @10k', frames: 49, category: 'Benchmark: vid' },
    { id: 'vid__logc3', label: 'LogC3 orig', frames: 49, category: 'Benchmark: vid' },
    { id: 'tire_dry__r128prod', label: 'ACEScct Prodigy r128 @10k (prev top)', frames: 49, category: 'Benchmark: tire dry' },
    { id: 'tire_dry__nostraw', label: 'ACEScct nostraw @10k (NEW)', frames: 49, category: 'Benchmark: tire dry' },
    { id: 'tire_dry__hdri', label: 'ACEScct HDRI-only @10k', frames: 49, category: 'Benchmark: tire dry' },
    { id: 'tire_dry__logc3', label: 'LogC3 orig', frames: 49, category: 'Benchmark: tire dry' },
    { id: 'tire_wet__r128prod', label: 'ACEScct Prodigy r128 @10k (prev top)', frames: 49, category: 'Benchmark: tire wet' },
    { id: 'tire_wet__nostraw', label: 'ACEScct nostraw @10k (NEW)', frames: 49, category: 'Benchmark: tire wet' },
    { id: 'tire_wet__hdri', label: 'ACEScct HDRI-only @10k', frames: 49, category: 'Benchmark: tire wet' },
    { id: 'tire_wet__logc3', label: 'LogC3 orig', frames: 49, category: 'Benchmark: tire wet' },
    // ===== t2v: text -> HDR (standard non-IC Prodigy LoRA, no input) =====
    { id: 'window_loft__t2vprod', label: 'sunlit loft (p99.9 217)', frames: 49, category: 't2v — text to HDR' },
    { id: 'coastal_goldenhour__t2vprod', label: 'coastal golden hour (p99.9 214)', frames: 49, category: 't2v — text to HDR' },
    { id: 'cathedral_light__t2vprod', label: 'cathedral light-shafts (p99.9 118)', frames: 49, category: 't2v — text to HDR' },
    { id: 'mountain_sunrise_t2v__t2vprod', label: 'mountain sunrise (p99.9 114)', frames: 49, category: 't2v — text to HDR' },
    { id: 'sunset_street__t2vprod', label: 'sunset street (p99.9 92)', frames: 49, category: 't2v — text to HDR' },
    { id: 'wet_highway_night__t2vprod', label: 'wet highway neon (p99.9 62)', frames: 49, category: 't2v — text to HDR' },
    { id: 'campfire_night__t2vprod', label: 'campfire night (p99.9 59)', frames: 49, category: 't2v — text to HDR' },
    { id: 'neon_night__t2vprod', label: 'neon night (p99.9 49)', frames: 49, category: 't2v — text to HDR' },
    { id: 'spotlit_dancer__t2vprod', label: 'spotlit dancer (p99.9 6, dark)', frames: 49, category: 't2v — text to HDR' },
    // ===== i2v: image -> HDR (float ACEScg EXR start frame) =====
    { id: 'i2v_chrome__t2vprod', label: 'chrome spheres, 562 src (p99.9 217)', frames: 49, category: 'i2v — image to HDR' },
    { id: 'i2v_neon__t2vprod', label: 'studio neon (p99.9 86)', frames: 49, category: 'i2v — image to HDR' },
    { id: 'i2v_market__t2vprod', label: 'medieval market (p99.9 24)', frames: 49, category: 'i2v — image to HDR' },
    { id: 'i2v_stilllife__t2vprod', label: 'still life, float-fixed (p99.9 18)', frames: 49, category: 'i2v — image to HDR' },
    { id: 'i2v_vehicles__t2vprod', label: 'enchanted vehicles (p99.9 6, dark)', frames: 49, category: 'i2v — image to HDR' },
];
// ── State ────────────────────────────────────────────────
let renderer;
let rgbData = null;
let imgW = 0, imgH = 0;
let params = structuredClone(DEFAULT_PARAMS);
let currentClip = CLIPS[0];
let currentFrame = Math.floor(currentClip.frames / 2);
let loading = false;
// Fit-to-viewport only on the very first image; afterwards keep the user's zoom/pan
// across clip switches and frame scrubs (all clips share the same resolution). 'F'/'0' re-fits.
let viewInitialized = false;
let wheels;
let scopeCtx;
let scopeMode = 'histogram';
let histRafId = 0;
let lastHistPixels = null;
// SDR compare
let compareOn = false;
let wipePos = 0.5;
// A|B compare source: null = SDR, otherwise a clip id (another LoRA's HDR output)
let compareBClip = null;
// Remember the chosen comparison ENCODING (the '__<enc>' suffix, e.g. 'acescct') so it
// persists across footage switches: picking a new scene keeps comparing vs that encoding
// of the new scene. null = compare vs SDR.
let compareEnc = null;
// Raw bytes of the currently displayed EXR, kept so the toolbar download
// button can save the original file (not a re-encode). Set in every load path.
let lastExrBytes = null;
let lastExrName = 'frame.exr';
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
    setupDownloadBtn();
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
        lastExrName = `frame_${String(i).padStart(5, '0')}.exr`;
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
        lastExrBytes = bytes;
        lastExrName = 'frame.exr'; // caller (sequence) may rename
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
        showExrDepth(bytes, rgbData, imgW, imgH);
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
// Read the channel pixel type straight from the EXR header, so the reported
// bit depth reflects the actual file rather than an assumption. exrs' decoder
// hands back only {width,height,pixels} and drops the pixel type, so we sniff
// the header ourselves. Returns null for non-EXR / unparseable input.
// pixelType per the OpenEXR spec: 0=UINT (32b), 1=HALF (16b), 2=FLOAT (32b).
function exrChannelDepth(bytes) {
    const dv = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);
    if (bytes.length < 8 || dv.getUint32(0, true) !== 20000630)
        return null; // bad magic
    let p = 8; // skip 4-byte magic + 4-byte version field
    const readStr = (limit) => {
        let s = '';
        while (p < limit && bytes[p] !== 0)
            s += String.fromCharCode(bytes[p++]);
        p++; // consume null terminator
        return s;
    };
    while (p < bytes.length) {
        const name = readStr(bytes.length);
        if (!name)
            break; // empty name = end of header
        const type = readStr(bytes.length);
        const size = dv.getInt32(p, true);
        p += 4;
        const end = p + size;
        if (name === 'channels' && type === 'chlist') {
            let maxType = -1, count = 0;
            while (p < end) {
                let cname = '';
                while (p < end && bytes[p] !== 0)
                    cname += String.fromCharCode(bytes[p++]);
                p++;
                if (!cname)
                    break; // empty name = end of channel list
                maxType = Math.max(maxType, dv.getInt32(p, true));
                p += 4;
                p += 4 + 8; // pLinear + 3 reserved, then xSampling + ySampling
                count++;
            }
            if (maxType < 0)
                return null;
            const bits = maxType === 1 ? 16 : 32;
            const label = maxType === 1 ? '16-bit half' : maxType === 2 ? '32-bit float' : '32-bit uint';
            const kind = maxType === 1 ? 'half-float' : maxType === 2 ? 'float' : 'uint';
            return { label, detail: `${bits}-bit ${kind} per channel · ${count}×${bits} = ${count * bits} bpp` };
        }
        p = end; // not the channels attr — skip its value
    }
    return null;
}
// Float32 → IEEE half-float bit pattern. Used to count how many of the
// container's 16-bit levels the signal actually occupies (its *effective*
// depth) — the bit pattern collapses sub-half noise and caps the count at the
// container, so the estimate can't exceed what the file can hold.
const _f32buf = new Float32Array(1);
const _i32buf = new Int32Array(_f32buf.buffer);
function f16bits(val) {
    _f32buf[0] = val;
    const x = _i32buf[0];
    const sign = (x >>> 16) & 0x8000;
    let exp = (x >>> 23) & 0xff;
    let mant = x & 0x007fffff;
    if (exp === 0xff)
        return sign | 0x7c00 | (mant ? 0x200 : 0); // inf / nan
    exp = exp - 127 + 15;
    if (exp >= 31)
        return sign | 0x7c00; // overflow → inf
    if (exp <= 0) { // subnormal / underflow
        if (exp < -10)
            return sign;
        mant = (mant | 0x00800000) >> (1 - exp);
        return sign | (mant >> 13);
    }
    return sign | (exp << 10) | (mant >> 13);
}
// Measure the tonal information the model actually produced, from the decoded
// linear buffer. "Effective bits" = log2(distinct half-levels occupied) — a
// pure tone curve over 8-bit input couldn't exceed 8; spatial synthesis pushes
// it toward the container ceiling. "stops" = how far highlights reach past SDR
// white (luminance 1.0), read off a robust p99.9 percentile.
function analyzeHdrDepth(rgb, n) {
    if (!rgb || n <= 0)
        return null;
    // Distinct-level counts are biased low under subsampling, so process every
    // pixel up to ~4M (these frames are ~2M → stride 1); only very large frames
    // get strided. This is a full-image pass — callers run it deferred.
    const stride = Math.max(1, Math.floor(n / 4000000));
    const pres = [new Uint8Array(65536), new Uint8Array(65536), new Uint8Array(65536)];
    const BINS = 256, LO = -12, HI = 12, SPAN = HI - LO; // log2-luminance histogram
    const BSCALE = BINS / SPAN;
    const lh = new Uint32Array(BINS);
    let lcount = 0;
    for (let i = 0; i < n; i += stride) {
        const o = i * 3;
        const r = rgb[o], g = rgb[o + 1], b = rgb[o + 2];
        pres[0][f16bits(r)] = 1;
        pres[1][f16bits(g)] = 1;
        pres[2][f16bits(b)] = 1;
        const lum = 0.2126 * r + 0.7152 * g + 0.0722 * b;
        if (lum > 0) {
            // cheap log2 via the float exponent + linear-interpolated mantissa
            // (≤0.086 error — well under one 0.094-stop bin); avoids Math.log2.
            _f32buf[0] = lum;
            const xb = _i32buf[0];
            const log2lum = (((xb >>> 23) & 0xff) - 127) + (xb & 0x7fffff) / 0x800000;
            let bi = ((log2lum - LO) * BSCALE) | 0;
            if (bi < 0)
                bi = 0;
            else if (bi >= BINS)
                bi = BINS - 1;
            lh[bi]++;
            lcount++;
        }
    }
    const count = (p) => { let c = 0; for (let i = 0; i < 65536; i++)
        c += p[i]; return c; };
    const d = [count(pres[0]), count(pres[1]), count(pres[2])].sort((a, b) => a - b);
    const distinct = d[1]; // median channel — conservative
    const effBits = Math.log2(Math.max(distinct, 1));
    let acc = 0;
    const thr = lcount * 0.999;
    let pbin = BINS - 1;
    for (let i = 0; i < BINS; i++) {
        acc += lh[i];
        if (acc >= thr) {
            pbin = i;
            break;
        }
    }
    const stops = Math.max(0, LO + ((pbin + 0.5) / BINS) * SPAN);
    return { effBits, bitsGained: effBits - 8, stops, distinct };
}
let _depthToken = 0;
function showExrDepth(bytes, rgb, w, h) {
    const d = exrChannelDepth(bytes);
    const el = $('#info-depth');
    if (!d) {
        el.textContent = '';
        el.title = '';
        return;
    }
    // Container label is free (header sniff) — show it immediately.
    el.textContent = d.label;
    el.title = d.detail;
    // The effective-depth estimate is a full-image pass (~70ms). Run it off the
    // decode path and cancel if a newer frame arrives, so scrubbing stays smooth
    // and only the frame the user lands on pays the cost.
    const tok = ++_depthToken;
    setTimeout(() => {
        if (tok !== _depthToken)
            return; // superseded by a newer frame
        const a = analyzeHdrDepth(rgb, w * h);
        if (tok !== _depthToken || !a)
            return;
        el.textContent = `${d.label} · ~${Math.round(a.effBits)}-bit effective`;
        el.title =
            `Container: ${d.detail}\n` +
                `Measured (live): 8-bit SDR in → ~${a.effBits.toFixed(1)}-bit out\n` +
                `+${a.bitsGained.toFixed(1)} bits tonal detail vs 8-bit · +${a.stops.toFixed(1)} stops over SDR white\n` +
                `${a.distinct.toLocaleString()} distinct levels/channel`;
    }, 50);
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
        lastExrBytes = buf;
        lastExrName = `${clip}_f${String(frame).padStart(5, '0')}.exr`;
        rgbData = dec.interleavedRgbPixels;
        imgW = dec.width;
        imgH = dec.height;
        renderer.ap1A = isAP1(clip); // v7-line (incl. rank128) = ACEScg (AP1) -> convert to Rec.709 for display
        renderer.uploadImage(rgbData, imgW, imgH);
        if (!viewInitialized) {
            resetView($('#canvas'));
            viewInitialized = true;
        }
        renderAndHist();
        $('#info-res').textContent = `${imgW}\u00d7${imgH}`;
        showExrDepth(buf, rgbData, imgW, imgH);
        $('#info-decode').textContent = `${dt} ms`;
        // load the B side (SDR or another LoRA) if compare is on
        refreshCompareB(clip, frame);
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
// Load another LoRA's HDR EXR (current frame) as the B side of the wipe.
async function loadCompareB(clip, frame) {
    try {
        const resp = await fetch(frameUrl(clip, frame));
        if (!resp.ok) {
            renderer.compareHDR = false;
            return;
        }
        const dec = decodeRgbExr(new Uint8Array(await resp.arrayBuffer()));
        renderer.ap1B = isAP1(clip); // v7-line (incl. rank128) = ACEScg (AP1) on the compare side too
        renderer.uploadHDRB(dec.interleavedRgbPixels, dec.width, dec.height);
        renderer.compareHDR = true;
        renderAndHist();
    }
    catch {
        renderer.compareHDR = false;
    }
}
// Refresh the B side for the current compare source (SDR or another LoRA).
function refreshCompareB(clip, frame) {
    if (!compareOn)
        return;
    if (compareBClip)
        loadCompareB(compareBClip, frame);
    else {
        renderer.compareHDR = false;
        renderer.ap1B = false;
        loadSDR(clip, frame);
    }
}
function loadSDR(clip, frame) {
    const img = new Image();
    // SDR is uploaded to a WebGL texture; a cross-origin image (prod clips come from
    // the HuggingFace dataset) must be CORS-approved or texImage2D throws SecurityError
    // and the SDR side renders black. HF sends ACAO:*, so anonymous CORS succeeds.
    // Harmless for same-origin dev (/clips/...).
    img.crossOrigin = 'anonymous';
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
            repopulateCompareSrc(); // refresh A|B "compare against" options for the new scene
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
        let prevCategory = null;
        CLIPS.forEach((c, i) => {
            // Category header — emitted once per category transition.
            if (c.category !== prevCategory) {
                const header = document.createElement('div');
                header.className = 'clip-category';
                header.textContent = c.category;
                grid.appendChild(header);
                prevCategory = c.category;
            }
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
        val = Math.max(-7, Math.min(7, val));
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
// A|B compare-source dropdown: pick "SDR" or another LoRA's output of the SAME scene.
function setupCompareSrc() {
    const btn = $('#btn-compare');
    const sel = document.createElement('select');
    sel.id = 'compare-src';
    sel.title = 'A|B: what to compare against (shown on the right of the wipe)';
    sel.style.cssText = 'margin-left:4px;max-width:210px;font-size:11px;vertical-align:middle;';
    btn.insertAdjacentElement('afterend', sel);
    sel.addEventListener('change', () => {
        compareBClip = sel.value === '__sdr' ? null : sel.value;
        compareEnc = compareBClip ? (compareBClip.split('__')[1] ?? null) : null;
        updateWipeLabels();
        refreshCompareB(currentClip.id, currentFrame);
        renderAndHist();
    });
    repopulateCompareSrc();
}
// Wipe labels reflect what's ACTUALLY on screen: left = the current clip (A),
// right = the compare target (B = SDR or another encoding).
function shortEncLabel(l) {
    return l.includes('—') ? l.split('—').pop().trim() : l;
}
function updateWipeLabels() {
    const lblL = document.querySelector('#wipe-label-l');
    const lblR = document.querySelector('#wipe-label-r');
    if (lblL)
        lblL.textContent = shortEncLabel(currentClip.label);
    if (lblR)
        lblR.textContent = compareBClip
            ? shortEncLabel(CLIPS.find(c => c.id === compareBClip)?.label ?? 'B')
            : 'SDR';
}
// ── Download current EXR ─────────────────────────────────
// Saves the original EXR bytes of the frame on screen (clip browser, sequence,
// or single embed push) — not a re-encode, so the float HDR is preserved.
function downloadCurrentExr() {
    if (!lastExrBytes)
        return;
    // Copy into a fresh ArrayBuffer so the Blob part is unambiguously an
    // ArrayBuffer (lastExrBytes may be a view into a larger/shared buffer).
    const ab = new ArrayBuffer(lastExrBytes.byteLength);
    new Uint8Array(ab).set(lastExrBytes);
    const blob = new Blob([ab], { type: 'image/x-exr' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = lastExrName;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 2000);
}
function setupDownloadBtn() {
    const btn = document.querySelector('#btn-download');
    if (btn)
        btn.addEventListener('click', downloadCurrentExr);
    window.addEventListener('keydown', (e) => {
        const tag = document.activeElement?.tagName;
        if (tag === 'INPUT' || tag === 'SELECT')
            return;
        if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
            e.preventDefault();
            downloadCurrentExr();
        }
    });
}
// Rebuild the dropdown options for the current scene's variants. Keeps the prior
// pick if it still applies, else falls back to SDR.
function repopulateCompareSrc() {
    const sel = document.querySelector('#compare-src');
    if (!sel)
        return;
    const base = currentClip.id.split('__')[0];
    const variants = CLIPS.filter(c => (c.id === base || c.id.startsWith(base + '__')) && c.id !== currentClip.id);
    // Show just the encoding tail (after the em-dash) so the dropdown reads "vs LogC4 (v3)".
    sel.innerHTML = '<option value="__sdr">vs SDR</option>'
        + variants.map(c => `<option value="${c.id}">vs ${shortEncLabel(c.label)}</option>`).join('');
    // Persist the comparison by ENCODING across footage switches: if we were comparing
    // vs <enc>, keep comparing vs the new scene's <enc> (falls back to SDR if that scene
    // lacks it, or if it would compare the clip against itself).
    let target = '__sdr';
    if (compareEnc) {
        const want = `${base}__${compareEnc}`;
        if (want !== currentClip.id && variants.some(c => c.id === want))
            target = want;
    }
    sel.value = target;
    compareBClip = target === '__sdr' ? null : target;
    updateWipeLabels();
}
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
        if (compareOn) {
            updateWipeLabels();
            refreshCompareB(currentClip.id, currentFrame);
        }
        else
            renderer.compareHDR = false;
        renderAndHist();
        updateWipeUI();
    }
    setupCompareSrc();
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