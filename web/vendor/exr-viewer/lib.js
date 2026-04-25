// Public library entry for external consumers (e.g. ComfyUI_Gear).
// Re-exports the GPU renderer + a thin EXR-decoding convenience layer.
//
// The SPA (main.ts) is deliberately NOT referenced here — the library bundle
// contains only the reusable renderer + decoder, no UI.
export { HDRRenderer, DEFAULT_PARAMS } from './renderer';
import { init as exrsInit, decodeRgbExr } from 'exrs';
let _initPromise = null;
/**
 * Initialize the EXR decoder WASM. Safe to call multiple times.
 *
 * By default, `exrs` resolves its WASM via import.meta.url — which works when
 * this bundle is served from the same origin as the .wasm file. Consumers
 * hosting the WASM at a custom URL can set `globalThis.__EXRS_WASM_URL__`
 * before calling this, and a future exrs release will honor it; for now we
 * just delegate to the package's built-in resolver.
 */
export async function initExrs() {
    if (_initPromise)
        return _initPromise;
    _initPromise = exrsInit();
    return _initPromise;
}
/**
 * Decode an EXR byte buffer to an RGB Float32Array.
 * Returns { width, height, interleavedRgbPixels } — matches exrs' shape.
 */
export function decodeExrRgb(bytes) {
    return decodeRgbExr(bytes);
}
//# sourceMappingURL=lib.js.map