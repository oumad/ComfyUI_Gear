(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))r(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&r(a)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function r(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();const ke="modulepreload",Oe=function(n,t){return new URL(n,t).href},ve={},ne=function(t,e,r){let i=Promise.resolve();if(e&&e.length>0){let a=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(g=>({status:"fulfilled",value:g}),g=>({status:"rejected",reason:g}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),f=c?.nonce||c?.getAttribute("nonce");i=a(e.map(u=>{if(u=Oe(u,r),u in ve)return;ve[u]=!0;const h=u.endsWith(".css"),g=h?'[rel="stylesheet"]':"";if(!!r)for(let p=o.length-1;p>=0;p--){const d=o[p];if(d.href===u&&(!h||d.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${g}`))return;const w=document.createElement("link");if(w.rel=h?"stylesheet":ke,h||(w.as="script"),w.crossOrigin="",w.href=u,f&&w.setAttribute("nonce",f),document.head.appendChild(w),h)return new Promise((p,d)=>{w.addEventListener("load",p),w.addEventListener("error",()=>d(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return i.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})};let b;const ye=typeof TextDecoder<"u"?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof TextDecoder<"u"&&ye.decode();let W=null;function V(){return(W===null||W.byteLength===0)&&(W=new Uint8Array(b.memory.buffer)),W}function ie(n,t){return n=n>>>0,ye.decode(V().subarray(n,n+t))}let N=0;const Y=typeof TextEncoder<"u"?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},Ge=typeof Y.encodeInto=="function"?function(n,t){return Y.encodeInto(n,t)}:function(n,t){const e=Y.encode(n);return t.set(e),{read:n.length,written:e.length}};function be(n,t,e){if(e===void 0){const o=Y.encode(n),c=t(o.length,1)>>>0;return V().subarray(c,c+o.length).set(o),N=o.length,c}let r=n.length,i=t(r,1)>>>0;const s=V();let a=0;for(;a<r;a++){const o=n.charCodeAt(a);if(o>127)break;s[i+a]=o}if(a!==r){a!==0&&(n=n.slice(a)),i=e(i,r,r=a+n.length*3,1)>>>0;const o=V().subarray(i+a,i+r),c=Ge(n,o);a+=c.written,i=e(i,r,a,1)>>>0}return N=a,i}let k=null;function H(){return(k===null||k.buffer.detached===!0||k.buffer.detached===void 0&&k.buffer!==b.memory.buffer)&&(k=new DataView(b.memory.buffer)),k}function Ne(n){return n==null}let X=null;function We(){return(X===null||X.byteLength===0)&&(X=new Float32Array(b.memory.buffer)),X}function Xe(n,t){return n=n>>>0,We().subarray(n/4,n/4+t)}function Ve(n){const t=b.__wbindgen_export_3.get(n);return b.__externref_table_dealloc(n),t}function He(n,t){const e=t(n.length*1,1)>>>0;return V().set(n,e/1),N=n.length,e}function $e(n){const t=He(n,b.__wbindgen_malloc),e=N,r=b.readExrRgb(t,e);if(r[2])throw Ve(r[1]);return fe.__wrap(r[0])}typeof FinalizationRegistry>"u"||new FinalizationRegistry(n=>b.__wbg_exrdecoder_free(n>>>0,1));typeof FinalizationRegistry>"u"||new FinalizationRegistry(n=>b.__wbg_exrencoder_free(n>>>0,1));const we=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(n=>b.__wbg_exrsimpleimage_free(n>>>0,1));class fe{static __wrap(t){t=t>>>0;const e=Object.create(fe.prototype);return e.__wbg_ptr=t,we.register(e,e.__wbg_ptr,e),e}__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,we.unregister(this),t}free(){const t=this.__destroy_into_raw();b.__wbg_exrsimpleimage_free(t,0)}get data(){const t=b.exrsimpleimage_data(this.__wbg_ptr);var e=Xe(t[0],t[1]).slice();return b.__wbindgen_free(t[0],t[1]*4,4),e}get width(){return b.exrsimpleimage_width(this.__wbg_ptr)>>>0}get height(){return b.exrsimpleimage_height(this.__wbg_ptr)>>>0}}async function qe(n,t){if(typeof Response=="function"&&n instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(n,t)}catch(r){if(n.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",r);else throw r}const e=await n.arrayBuffer();return await WebAssembly.instantiate(e,t)}else{const e=await WebAssembly.instantiate(n,t);return e instanceof WebAssembly.Instance?{instance:e,module:n}:e}}function Te(){const n={};return n.wbg={},n.wbg.__wbg_error_7534b8e9a36f1ab4=function(t,e){let r,i;try{r=t,i=e,console.error(ie(t,e))}finally{b.__wbindgen_free(r,i,1)}},n.wbg.__wbg_new_8a6f238a6ece86ea=function(){return new Error},n.wbg.__wbg_stack_0ed75d68575b0f3c=function(t,e){const r=e.stack,i=be(r,b.__wbindgen_malloc,b.__wbindgen_realloc),s=N;H().setInt32(t+4,s,!0),H().setInt32(t+0,i,!0)},n.wbg.__wbindgen_init_externref_table=function(){const t=b.__wbindgen_export_3,e=t.grow(4);t.set(0,void 0),t.set(e+0,void 0),t.set(e+1,null),t.set(e+2,!0),t.set(e+3,!1)},n.wbg.__wbindgen_string_get=function(t,e){const r=e,i=typeof r=="string"?r:void 0;var s=Ne(i)?0:be(i,b.__wbindgen_malloc,b.__wbindgen_realloc),a=N;H().setInt32(t+4,a,!0),H().setInt32(t+0,s,!0)},n.wbg.__wbindgen_string_new=function(t,e){return ie(t,e)},n.wbg.__wbindgen_throw=function(t,e){throw new Error(ie(t,e))},n}function Re(n,t){return b=n.exports,Le.__wbindgen_wasm_module=t,k=null,X=null,W=null,b.__wbindgen_start(),b}function ze(n){if(b!==void 0)return b;typeof n<"u"&&(Object.getPrototypeOf(n)===Object.prototype?{module:n}=n:console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));const t=Te();n instanceof WebAssembly.Module||(n=new WebAssembly.Module(n));const e=new WebAssembly.Instance(n,t);return Re(e,n)}async function Le(n){if(b!==void 0)return b;typeof n<"u"&&(Object.getPrototypeOf(n)===Object.prototype?{module_or_path:n}=n:console.warn("using deprecated parameters for the initialization function; pass a single object instead")),typeof n>"u"&&(n=new URL(""+new URL("exrs_raw_wasm_bindgen_bg-DvcqSi-p.wasm",import.meta.url).href,import.meta.url));const t=Te();(typeof n=="string"||typeof Request=="function"&&n instanceof Request||typeof URL=="function"&&n instanceof URL)&&(n=fetch(n));const{instance:e,module:r}=await qe(await n,t);return Re(e,r)}let j=!1;async function Ke(){if(!j)try{await Le(),j=!0}catch(n){try{const t=await ne(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),e=await ne(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),{createRequire:r}=await ne(async()=>{const{createRequire:c}=await import("./__vite-browser-external-BIHI7g3E.js");return{createRequire:c}},[],import.meta.url),i=r(import.meta.url),s=e.dirname(i.resolve("exrs-raw-wasm-bindgen/package.json")),a=e.resolve(s,"exrs_raw_wasm_bindgen_bg.wasm"),o=t.readFileSync(a);ze({module:o}),j=!0}catch{throw console.error("Failed to initialize EXRS WASM in both browser and Node environments"),n}}}function Ye(){if(!j)throw new Error("EXRS WASM module not initialized. Call init() first.")}function Ce(n){Ye();const t=$e(n);try{return{width:t.width,height:t.height,interleavedRgbPixels:t.data}}finally{t.free()}}const de={exposure:0,toneMapping:2,softClip:0,temperature:0,tint:0,lift:[0,0,0],gamma:[1,1,1],gain:[1,1,1],offset:[0,0,0],contrast:1,pivot:.18,shadows:0,highlights:0,saturation:1,vibrance:0,hueShift:0,falseColor:!1},je=`#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,Ze=`#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform sampler2D uTexSDR;
uniform float uExposure;
uniform int   uToneMap;
uniform float uSoftClip;
uniform float uTemperature;
uniform float uTint;
uniform vec3  uLift, uGamma, uGain, uOffset;
uniform float uContrast, uPivot;
uniform float uShadows, uHighlights;
uniform float uSaturation, uVibrance, uHueShift;
uniform bool  uFalseColor;
uniform bool  uCompareOn;
uniform float uWipePos;
uniform vec4  uSDRCrop;
uniform highp sampler3D uLUT3D;
uniform bool  uLUTEnabled;
uniform float uLUTSize;      // e.g. 33.0
uniform float uZoom;         // 1 = fit, >1 = zoom in
uniform vec2  uPan;          // image-UV offset (positive pans content right/down)

in  vec2 vUv;
out vec4 oColor;

const vec3 LUMA = vec3(0.2126, 0.7152, 0.0722);

// ─────────────────────────────────────────────────────────
//  sRGB OETF
// ─────────────────────────────────────────────────────────
vec3 linearToSRGB(vec3 c){
  vec3 lo = c * 12.92;
  vec3 hi = 1.055 * pow(c, vec3(1.0/2.4)) - 0.055;
  return mix(lo, hi, step(vec3(0.0031308), c));
}

// sRGB EOTF (decode SDR PNG from display-referred → linear)
vec3 sRGBToLinear(vec3 c){
  vec3 lo = c / 12.92;
  vec3 hi = pow((c + 0.055) / 1.055, vec3(2.4));
  return mix(lo, hi, step(vec3(0.04045), c));
}

// ─────────────────────────────────────────────────────────
//  Tone mappers
// ─────────────────────────────────────────────────────────

// -- Reinhard (luminance-preserving) ----------------------
vec3 reinhard(vec3 c){
  float Lin  = dot(c, LUMA);
  float Lout = Lin / (1.0 + Lin);
  return c * (Lout / max(Lin, 1e-6));
}

// -- ACES Fitted (Stephen Hill / MJP) ---------------------
//    Full sRGB → AP1 → RRT+ODT curve → sRGB round-trip.
//    The AP1 transform keeps channels decorrelated from hue,
//    so bright saturated colors converge to white instead of
//    clipping per-channel (fixes the "burned edges" problem).

const mat3 ACESInputMat = mat3(
  0.59719, 0.07600, 0.02840,
  0.35458, 0.90834, 0.13383,
  0.04823, 0.01566, 0.83777
);
const mat3 ACESOutputMat = mat3(
   1.60475, -0.10208, -0.00327,
  -0.53108,  1.10813, -0.07276,
  -0.07367, -0.00605,  1.07602
);

vec3 RRTAndODTFit(vec3 v){
  vec3 a = v * (v + 0.0245786) - 0.000090537;
  vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;
  return a / b;
}

vec3 acesFitted(vec3 c){
  c = ACESInputMat * max(c, 0.0);  // sRGB → AP1
  c = RRTAndODTFit(c);              // fitted RRT+ODT curve
  c = ACESOutputMat * c;            // AP1 → sRGB
  return clamp(c, 0.0, 1.0);
}

// -- AgX (full pipeline with outset) ----------------------
const mat3 AgXInsetMat = mat3(
  0.842479062253094,  0.0423282422610123, 0.0423756549057051,
  0.0784335999999992, 0.878468636469772,  0.0784336,
  0.0792237451477643, 0.0791661274605434, 0.879142973793104
);
const mat3 AgXOutsetMat = mat3(
   1.19687900512017,   -0.0528968517574562, -0.0529716355144438,
  -0.0980208811401368,  1.15190312990417,   -0.0980434501171241,
  -0.0990297440797205, -0.0989611768448433,  1.15107367264116
);

vec3 agxContrastApprox(vec3 x){
  vec3 x2=x*x; vec3 x4=x2*x2;
  return 15.5*x4*x2 - 40.14*x4*x + 31.96*x4
       - 6.868*x2*x + 0.4298*x2 + 0.1191*x - 0.00232;
}

vec3 agx(vec3 v){
  v = AgXInsetMat * max(v, vec3(1e-10));
  v = clamp(log2(v), -12.47393, 4.026069);
  v = (v + 12.47393) / (4.026069 + 12.47393);
  v = agxContrastApprox(v);
  v = AgXOutsetMat * v;             // outset back to sRGB primaries
  return clamp(v, 0.0, 1.0);
}

// -- Hable / Uncharted 2 ---------------------------------
vec3 hableCurve(vec3 x){
  const float A=0.15, B=0.50, C=0.10, D=0.20, E=0.02, F=0.30;
  return ((x*(A*x+C*B)+D*E) / (x*(A*x+B)+D*F)) - E/F;
}
vec3 hableFilmic(vec3 x){
  return hableCurve(x * 2.0) / hableCurve(vec3(11.2));
}

// ─────────────────────────────────────────────────────────
//  HSV
// ─────────────────────────────────────────────────────────
vec3 rgb2hsv(vec3 c){
  vec4 K = vec4(0.0, -1.0/3.0, 2.0/3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));
  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0*d+e)), d/(q.x+e), q.x);
}
vec3 hsv2rgb(vec3 c){
  vec4 K = vec4(1.0, 2.0/3.0, 1.0/3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
}

// ─────────────────────────────────────────────────────────
//  False-color
// ─────────────────────────────────────────────────────────
vec3 falseColorMap(float L){
  if(L < 0.0)   return vec3(0,0,.25);
  if(L < 0.01)  return mix(vec3(0,0,.25),  vec3(0,0,1),   L/.01);
  if(L < 0.09)  return mix(vec3(0,0,1),    vec3(0,.7,1),  (L-.01)/.08);
  if(L < 0.18)  return mix(vec3(0,.7,1),   vec3(0,.5,0),  (L-.09)/.09);
  if(L < 0.5)   return mix(vec3(0,.5,0),   vec3(0,1,0),   (L-.18)/.32);
  if(L < 1.0)   return mix(vec3(0,1,0),    vec3(1,1,0),   (L-.5)/.5);
  if(L < 2.0)   return mix(vec3(1,1,0),    vec3(1,.5,0),  (L-1.)/1.);
  if(L < 8.0)   return mix(vec3(1,.5,0),   vec3(1,0,0),   (L-2.)/6.);
  if(L < 32.0)  return mix(vec3(1,0,0),    vec3(1,0,1),   (L-8.)/24.);
  return vec3(1,0,1);
}

// ─────────────────────────────────────────────────────────
//  Soft clip (DJV / exrdisplay exponential shoulder)
// ─────────────────────────────────────────────────────────
float softClipCh(float v, float t, float k){
  return v > t ? t + (1.0 - exp(-(v - t) / k)) * k : v;
}
vec3 softClip(vec3 c, float knee){
  if(knee <= 0.0) return c;
  float t = 1.0 - knee;
  return vec3(softClipCh(c.r, t, knee),
              softClipCh(c.g, t, knee),
              softClipCh(c.b, t, knee));
}

// ─────────────────────────────────────────────────────────
//  ACEScct grading space (matches DaVinci Resolve)
//  Grading in log space reveals SDR quantization and gives
//  perceptually uniform control across the tonal range.
// ─────────────────────────────────────────────────────────
const mat3 sRGB_to_AP1 = mat3(
  0.61319, 0.07012, 0.02058,
  0.33951, 0.91637, 0.10961,
  0.04737, 0.01345, 0.86981
);
const mat3 AP1_to_sRGB = mat3(
   1.70505, -0.13026, -0.02400,
  -0.62179,  1.14080, -0.12897,
  -0.08326, -0.01055,  1.15297
);

float cctEncode(float x){
  return x <= 0.0078125
    ? 10.5402377416545 * x + 0.0729055341958355
    : (log2(x) + 9.72) / 17.52;
}
vec3 toCCT(vec3 c){
  return vec3(cctEncode(c.r), cctEncode(c.g), cctEncode(c.b));
}

float cctDecode(float x){
  return x <= 0.155251141552511
    ? (x - 0.0729055341958355) / 10.5402377416545
    : exp2(x * 17.52 - 9.72);
}
vec3 fromCCT(vec3 c){
  return vec3(cctDecode(c.r), cctDecode(c.g), cctDecode(c.b));
}

// ─────────────────────────────────────────────────────────
//  3D LUT (trilinear interpolated by GPU hardware)
// ─────────────────────────────────────────────────────────
vec3 applyLUT(vec3 c){
  // Tetrahedral-quality via hardware trilinear on 3D texture.
  // Half-texel offset for correct sampling at cube boundaries.
  float s = uLUTSize;
  vec3 scaled = clamp(c, 0.0, 1.0) * ((s - 1.0) / s) + 0.5 / s;
  return texture(uLUT3D, scaled).rgb;
}

// ─────────────────────────────────────────────────────────
//  Dither — breaks 8-bit quantization banding
// ─────────────────────────────────────────────────────────
vec3 dither(vec2 fc){
  vec3 n;
  n.r = fract(sin(dot(fc, vec2(12.9898, 78.233)))  * 43758.5453);
  n.g = fract(sin(dot(fc, vec2(39.3460, 11.135)))  * 43758.5453);
  n.b = fract(sin(dot(fc, vec2(73.1560, 52.235)))  * 43758.5453);
  return (n - 0.5) / 255.0;
}

// ═════════════════════════════════════════════════════════
//  MAIN
// ═════════════════════════════════════════════════════════
void main(){
  // Wipe line is in screen UV space — stays fixed regardless of zoom/pan.
  if(uCompareOn && abs(vUv.x - uWipePos) < 0.002){
    oColor = vec4(vec3(0.9), 1.0);
    return;
  }

  // Map screen UV → image UV through zoom/pan (zoom=1, pan=0 is identity).
  vec2 imgUv = (vUv - vec2(0.5)) / uZoom + vec2(0.5) + uPan;

  // Outside the image after zoom/pan: neutral background.
  if(any(lessThan(imgUv, vec2(0.0))) || any(greaterThan(imgUv, vec2(1.0)))){
    oColor = vec4(0.05, 0.05, 0.05, 1.0);
    return;
  }

  // Select source: SDR (left of wipe) or HDR (right). Both sample at imgUv
  // so zoom/pan stay aligned across the wipe.
  vec3 c;
  if(uCompareOn && vUv.x < uWipePos){
    vec2 sdrUv = imgUv * uSDRCrop.xy + uSDRCrop.zw;
    c = sRGBToLinear(texture(uTexSDR, sdrUv).rgb);
  } else {
    c = texture(uTex, imgUv).rgb;
  }

  // 1. Exposure
  c *= exp2(uExposure);

  // False-color bypass
  if(uFalseColor){
    oColor = vec4(falseColorMap(dot(c, LUMA)), 1.0);
    return;
  }

  // 2. White balance (in linear, before log encoding)
  c.r *= 1.0 + uTemperature * 0.45;
  c.b *= 1.0 - uTemperature * 0.45;
  c.g *= 1.0 + uTint * 0.35;

  // ── Enter ACEScct grading space ────────────────────────
  // Matches DaVinci Resolve: sRGB linear → AP1 → ACEScct log
  // Grading in log space gives perceptually uniform control
  // and reveals 8-bit SDR quantization vs smooth HDR.
  vec3 ap1 = sRGB_to_AP1 * max(c, 0.0);
  vec3 cct = toCCT(ap1);

  // 3. Lift / Gamma / Gain / Offset (in ACEScct log space)
  cct += uOffset;
  float luma = dot(cct, vec3(0.2722, 0.6741, 0.0537));
  cct += uLift * clamp(1.0 - luma * 2.0, 0.0, 1.0);
  cct *= uGain;
  cct = pow(max(cct, 0.0), 1.0 / max(uGamma, vec3(0.01)));

  // 4. Contrast around pivot (in log space, pivot ~0.42 = mid-gray)
  float logPivot = cctEncode(uPivot);
  cct = (cct - logPivot) * uContrast + logPivot;

  // 5. Shadows / Highlights (in log space — more uniform response)
  luma = dot(cct, vec3(0.2722, 0.6741, 0.0537));
  float sW = 1.0 / (1.0 + exp(12.0 * (luma - 0.3)));
  float hW = 1.0 / (1.0 + exp(-12.0 * (luma - 0.6)));
  cct += uShadows * sW * 0.15;
  cct += uHighlights * hW * 0.15;

  // 6. Vibrance (in log space)
  if(abs(uVibrance) > 0.001){
    luma = dot(cct, vec3(0.2722, 0.6741, 0.0537));
    float chroma = max(cct.r, max(cct.g, cct.b)) - min(cct.r, min(cct.g, cct.b));
    float boost  = (1.0 - chroma * 2.0) * uVibrance;
    cct = mix(vec3(luma), cct, 1.0 + boost);
  }

  // 7. Saturation (in log space)
  luma = dot(cct, vec3(0.2722, 0.6741, 0.0537));
  cct = mix(vec3(luma), cct, uSaturation);

  // ── Exit ACEScct → back to linear sRGB ─────────────────
  ap1 = fromCCT(max(cct, 0.0));
  c = AP1_to_sRGB * ap1;
  c = max(c, 0.0);

  // 8. Hue shift (in linear sRGB)
  if(abs(uHueShift) > 0.1){
    vec3 hsv = rgb2hsv(c);
    hsv.x = fract(hsv.x + uHueShift / 360.0);
    c = hsv2rgb(hsv);
  }

  // 9. Tone map
  c = max(c, 0.0);
  if      (uToneMap == 1) c = reinhard(c);
  else if (uToneMap == 2) c = acesFitted(c);
  else if (uToneMap == 3) c = agx(c);
  else if (uToneMap == 4) c = hableFilmic(c);

  // 10. Soft clip
  c = softClip(c, uSoftClip);

  // 11. sRGB OETF
  c = linearToSRGB(clamp(c, 0.0, 1.0));

  // 12. 3D LUT (in sRGB display space — LUTs from Resolve expect gamma-encoded input)
  if(uLUTEnabled) c = applyLUT(c);

  // 13. Dither
  c += dither(gl_FragCoord.xy);

  oColor = vec4(c, 1.0);
}`;function xe(n,t,e){const r=n.createShader(t);if(n.shaderSource(r,e),n.compileShader(r),!n.getShaderParameter(r,n.COMPILE_STATUS))throw new Error(`Shader compile:
`+n.getShaderInfoLog(r));return r}function Je(n,t,e){const r=n.createProgram();if(n.attachShader(r,t),n.attachShader(r,e),n.linkProgram(r),!n.getProgramParameter(r,n.LINK_STATUS))throw new Error(`Program link:
`+n.getProgramInfoLog(r));return r}const Qe=["uTex","uTexSDR","uExposure","uToneMap","uSoftClip","uTemperature","uTint","uLift","uGamma","uGain","uOffset","uContrast","uPivot","uShadows","uHighlights","uSaturation","uVibrance","uHueShift","uFalseColor","uCompareOn","uWipePos","uSDRCrop","uLUT3D","uLUTEnabled","uLUTSize","uZoom","uPan"],$=320,q=180;class et{constructor(t){this.canvas=t,this.imageWidth=0,this.imageHeight=0,this.compareOn=!1,this.wipePos=.5,this.sdrCrop=[1,1,0,0],this.lutEnabled=!1,this.zoom=1,this.pan=[0,0],this.lutSize=33;const e=t.getContext("webgl2",{antialias:!1,premultipliedAlpha:!1});if(!e)throw new Error("WebGL2 not supported");this.gl=e;const r=xe(e,e.VERTEX_SHADER,je),i=xe(e,e.FRAGMENT_SHADER,Ze);this.prog=Je(e,r,i),this.u={};for(const a of Qe)this.u[a]=e.getUniformLocation(this.prog,a);this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);const s=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.tex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.tex),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.texSDR=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.lutTex=e.createTexture(),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),this.histFBO=e.createFramebuffer(),this.histRBO=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this.histRBO),e.renderbufferStorage(e.RENDERBUFFER,e.RGBA8,$,q),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,this.histRBO),e.bindFramebuffer(e.FRAMEBUFFER,null)}uploadImage(t,e,r){this.imageWidth=e,this.imageHeight=r,this.resetView();const i=e*r,s=new Float32Array(i*4);for(let o=0;o<i;o++)s[o*4]=t[o*3],s[o*4+1]=t[o*3+1],s[o*4+2]=t[o*3+2],s[o*4+3]=1;const a=this.gl;a.bindTexture(a.TEXTURE_2D,this.tex),a.texImage2D(a.TEXTURE_2D,0,a.RGBA16F,e,r,0,a.RGBA,a.FLOAT,s),this.canvas.width=e,this.canvas.height=r}uploadLUT(t,e){const r=this.gl;this.lutSize=e;const i=new Float32Array(e*e*e*4);for(let s=0;s<e*e*e;s++)i[s*4]=t[s*3],i[s*4+1]=t[s*3+1],i[s*4+2]=t[s*3+2],i[s*4+3]=1;r.bindTexture(r.TEXTURE_3D,this.lutTex),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.texImage3D(r.TEXTURE_3D,0,r.RGBA16F,e,e,e,0,r.RGBA,r.FLOAT,i),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!0),this.lutEnabled=!0}clearLUT(){this.lutEnabled=!1}uploadSDR(t){const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texSDR),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,t),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL)}setUniforms(t){const e=this.gl;e.useProgram(this.prog),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.tex),e.uniform1i(this.u.uTex,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.uniform1i(this.u.uTexSDR,1),e.uniform1i(this.u.uCompareOn,this.compareOn?1:0),e.uniform1f(this.u.uWipePos,this.wipePos),e.uniform4f(this.u.uSDRCrop,this.sdrCrop[0],this.sdrCrop[1],this.sdrCrop[2],this.sdrCrop[3]),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.uniform1i(this.u.uLUT3D,2),e.uniform1i(this.u.uLUTEnabled,this.lutEnabled?1:0),e.uniform1f(this.u.uLUTSize,this.lutSize),e.uniform1f(this.u.uExposure,t.exposure),e.uniform1i(this.u.uToneMap,t.toneMapping),e.uniform1f(this.u.uSoftClip,t.softClip),e.uniform1f(this.u.uTemperature,t.temperature),e.uniform1f(this.u.uTint,t.tint),e.uniform3f(this.u.uLift,t.lift[0],t.lift[1],t.lift[2]),e.uniform3f(this.u.uGamma,t.gamma[0],t.gamma[1],t.gamma[2]),e.uniform3f(this.u.uGain,t.gain[0],t.gain[1],t.gain[2]),e.uniform3f(this.u.uOffset,t.offset[0],t.offset[1],t.offset[2]),e.uniform1f(this.u.uContrast,t.contrast),e.uniform1f(this.u.uPivot,t.pivot),e.uniform1f(this.u.uShadows,t.shadows),e.uniform1f(this.u.uHighlights,t.highlights),e.uniform1f(this.u.uSaturation,t.saturation),e.uniform1f(this.u.uVibrance,t.vibrance),e.uniform1f(this.u.uHueShift,t.hueShift),e.uniform1i(this.u.uFalseColor,t.falseColor?1:0),e.uniform1f(this.u.uZoom,this.zoom),e.uniform2f(this.u.uPan,this.pan[0],this.pan[1]),e.bindVertexArray(this.vao)}resetView(){this.zoom=1,this.pan=[0,0]}canvasToImagePixel(t,e,r){const i=(e-t.left)/t.width,s=(r-t.top)/t.height,a=(i-.5)/this.zoom+.5+this.pan[0],o=(s-.5)/this.zoom+.5+this.pan[1];return a<0||o<0||a>1||o>1?null:[Math.floor(a*this.imageWidth),Math.floor(o*this.imageHeight)]}render(t){const e=this.gl;this.setUniforms(t),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.canvas.width,this.canvas.height),e.drawArrays(e.TRIANGLE_STRIP,0,4)}readHistogramPixels(t){const e=this.gl;this.setUniforms(t),e.uniform1f(this.u.uZoom,1),e.uniform2f(this.u.uPan,0,0),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.viewport(0,0,$,q),e.drawArrays(e.TRIANGLE_STRIP,0,4);const r=new Uint8Array($*q*4);return e.readPixels(0,0,$,q,e.RGBA,e.UNSIGNED_BYTE,r),e.bindFramebuffer(e.FRAMEBUFFER,null),r}destroy(){const t=this.gl;t.deleteProgram(this.prog),t.deleteTexture(this.tex),t.deleteFramebuffer(this.histFBO),t.deleteRenderbuffer(this.histRBO)}}function Ee(n,t,e){const r=Math.floor(n*6),i=n*6-r,s=e*(1-t),a=e*(1-i*t),o=e*(1-(1-i)*t);switch(r%6){case 0:return[e,o,s];case 1:return[a,e,s];case 2:return[s,e,o];case 3:return[s,a,e];case 4:return[o,s,e];default:return[e,s,a]}}const F=160,A=70,_e=6;class z{constructor(t,e,r,i){this.label=e,this.sensitivity=r,this.center=i,this.dx=0,this.dy=0,this.master=0,this.dragging=!1,this.rgbEls=[null,null,null],this.onUpdate=()=>{},this.values=[i,i,i];const s=document.createElement("div");s.className="wheel-cell";const a=document.createElement("div");a.className="wheel-title";const o=document.createElement("span");o.textContent=e,a.appendChild(o),this.rstBtn=document.createElement("button"),this.rstBtn.className="wheel-reset",this.rstBtn.innerHTML="&#x21ba;",this.rstBtn.title="Reset "+e,this.rstBtn.addEventListener("click",()=>this.reset()),a.appendChild(this.rstBtn),s.appendChild(a),this.cvs=document.createElement("canvas"),this.cvs.width=F,this.cvs.height=F,this.cvs.className="wheel-cvs",s.appendChild(this.cvs);const c=document.createElement("div");c.className="wheel-master-row",this.masterInput=document.createElement("input"),this.masterInput.type="range",this.masterInput.min="-0.5",this.masterInput.max="0.5",this.masterInput.step="0.005",this.masterInput.value="0",this.masterInput.className="wheel-master-sl",this.masterValEl=document.createElement("span"),this.masterValEl.className="wheel-master-val",this.masterValEl.textContent="0.00",c.appendChild(this.masterInput),c.appendChild(this.masterValEl),s.appendChild(c);const f=document.createElement("div");f.className="wheel-rgb-row";const u=["r","g","b"];for(let h=0;h<3;h++){const g=document.createElement("span");g.className=`wheel-rgb ${u[h]}`,g.textContent=i.toFixed(2),f.appendChild(g),this.rgbEls[h]=g}s.appendChild(f),t.appendChild(s),this.el=s,this.ctx=this.cvs.getContext("2d"),this.bg=this.createBg(),this.draw(),this.masterInput.addEventListener("input",()=>{this.master=+this.masterInput.value,this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.onUpdate()}),this.cvs.addEventListener("pointerdown",h=>this.onDown(h)),window.addEventListener("pointermove",h=>this.onMove(h)),window.addEventListener("pointerup",()=>this.onUp()),this.cvs.addEventListener("dblclick",()=>this.reset())}updateRgbReadout(){for(let t=0;t<3;t++)this.rgbEls[t].textContent=this.values[t].toFixed(2)}syncResetBtn(){const t=Math.abs(this.dx)>.5||Math.abs(this.dy)>.5||Math.abs(this.master)>.001;this.rstBtn.classList.toggle("show",t)}reset(){this.dx=0,this.dy=0,this.master=0,this.masterInput.value="0",this.masterValEl.textContent="0.00",this.computeValues(),this.draw(),this.onUpdate()}setValues(t){const e=(t[0]+t[1]+t[2])/3-this.center;this.master=Math.max(-.5,Math.min(.5,e)),this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.dx=0,this.dy=0,this.values=t,this.draw()}getState(){return{dx:this.dx,dy:this.dy,master:this.master}}setState(t){this.dx=t.dx??0,this.dy=t.dy??0,this.master=t.master??0,this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.draw()}onDown(t){this.dragging=!0,this.cvs.setPointerCapture(t.pointerId),this.updateDot(t)}onMove(t){this.dragging&&this.updateDot(t)}onUp(){this.dragging=!1}updateDot(t){const e=this.cvs.getBoundingClientRect(),r=F/e.width,i=F/2;let s=(t.clientX-e.left)*r-i,a=(t.clientY-e.top)*r-i;const o=Math.sqrt(s*s+a*a);o>A&&(s*=A/o,a*=A/o),this.dx=s,this.dy=a,this.computeValues(),this.draw(),this.onUpdate()}computeValues(){this.syncResetBtn();const t=Math.sqrt(this.dx*this.dx+this.dy*this.dy)/A;if(t<.01){this.values=[this.center+this.master,this.center+this.master,this.center+this.master],this.updateRgbReadout();return}const e=Math.pow(t,1.8);let r=-Math.atan2(this.dx,-this.dy)/(2*Math.PI);r<0&&(r+=1);const[i,s,a]=Ee(r,1,1),o=(i+s+a)/3,c=e*this.sensitivity;this.values=[this.center+(i-o)*c*3+this.master,this.center+(s-o)*c*3+this.master,this.center+(a-o)*c*3+this.master],this.updateRgbReadout()}createBg(){const t=F,e=new ImageData(t,t),r=t/2;for(let i=0;i<t;i++)for(let s=0;s<t;s++){const a=(s-r)/A,o=(i-r)/A,c=Math.sqrt(a*a+o*o);if(c>1.05)continue;const f=c>1?0:c>.92?1:c<.05?.6:.85;let u=-Math.atan2(a,-o)/(2*Math.PI);u<0&&(u+=1);const h=Math.min(c,1)*.65,g=.2+Math.min(c,1)*.15,[_,w,p]=Ee(u,h,g),d=(i*t+s)*4;e.data[d]=Math.round(_*255),e.data[d+1]=Math.round(w*255),e.data[d+2]=Math.round(p*255),e.data[d+3]=Math.round(f*255)}return e}draw(){const t=this.ctx,e=F/2;t.clearRect(0,0,F,F),t.putImageData(this.bg,0,0),t.beginPath(),t.arc(e,e,A+1,0,Math.PI*2),t.strokeStyle="rgba(255,255,255,0.12)",t.lineWidth=1,t.stroke(),t.strokeStyle="rgba(255,255,255,0.08)",t.beginPath(),t.moveTo(e-A,e),t.lineTo(e+A,e),t.moveTo(e,e-A),t.lineTo(e,e+A),t.stroke();const r=e+this.dx,i=e+this.dy;t.beginPath(),t.arc(r,i,_e,0,Math.PI*2),t.fillStyle="#fff",t.fill(),t.strokeStyle="rgba(0,0,0,0.6)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(r,i,_e-2,0,Math.PI*2),t.fillStyle="rgba(255,255,255,0.3)",t.fill()}}function tt(n){const t=new Uint32Array(256),e=new Uint32Array(256),r=new Uint32Array(256);for(let i=0;i<n.length;i+=4)t[n[i]]++,e[n[i+1]]++,r[n[i+2]]++;return[t,e,r]}function nt(n,t,e,r,i,s){n.clearRect(0,0,i,s),n.fillStyle="#111113",n.fillRect(0,0,i,s);let a=1;for(let u=2;u<254;u++)a=Math.max(a,t[u],e[u],r[u]);const o=Math.log(a+1),c=[[t,"rgba(220, 60, 60, 0.55)"],[e,"rgba(60, 200, 80, 0.55)"],[r,"rgba(60, 120, 220, 0.55)"]],f=i/256;for(const[u,h]of c){n.fillStyle=h,n.beginPath(),n.moveTo(0,s);for(let g=0;g<256;g++){const _=u[g]>0?Math.log(u[g]+1)/o*(s-2):0;n.lineTo(g*f,s-_)}n.lineTo(i,s),n.closePath(),n.fill()}n.strokeStyle="rgba(255,255,255,0.08)",n.lineWidth=1,n.strokeRect(.5,.5,i-1,s-1)}function it(n,t,e,r,i,s){n.clearRect(0,0,i,s),n.fillStyle="#111113",n.fillRect(0,0,i,s);const a=Math.floor(i/3),o=2,c=new Float32Array(a*s),f=new Float32Array(a*s),u=new Float32Array(a*s);for(let p=0;p<t.length;p+=4){const d=(p>>2)%e,y=Math.min(Math.floor(d*a/e),a-1),S=s-1-Math.min(Math.floor(t[p]*(s-1)/255),s-1),O=s-1-Math.min(Math.floor(t[p+1]*(s-1)/255),s-1),te=s-1-Math.min(Math.floor(t[p+2]*(s-1)/255),s-1);c[S*a+y]++,f[O*a+y]++,u[te*a+y]++}let h=1;for(let p=0;p<c.length;p++)h=Math.max(h,c[p],f[p],u[p]);const g=Math.log(h+1),_=n.createImageData(i,s),w=_.data;for(let p=0;p<s;p++)for(let d=0;d<a;d++){const y=p*a+d,S=c[y]>0?Math.log(c[y]+1)/g:0,O=(p*i+d)*4;w[O]=Math.min(S*400,255)|0,w[O+3]=255;const te=f[y]>0?Math.log(f[y]+1)/g:0,ge=(p*i+d+a+o)*4;d+a+o<i&&(w[ge+1]=Math.min(te*400,255)|0,w[ge+3]=255);const Ie=u[y]>0?Math.log(u[y]+1)/g:0,pe=(p*i+d+(a+o)*2)*4;d+(a+o)*2<i&&(w[pe+2]=Math.min(Ie*400,255)|0,w[pe+3]=255)}n.putImageData(_,0,0),n.font="9px sans-serif",n.fillStyle="rgba(255,80,80,0.5)",n.fillText("R",3,10),n.fillStyle="rgba(80,220,80,0.5)",n.fillText("G",a+o+3,10),n.fillStyle="rgba(80,140,255,0.5)",n.fillText("B",(a+o)*2+3,10),n.strokeStyle="rgba(255,255,255,0.08)",n.lineWidth=1,n.strokeRect(.5,.5,i-1,s-1)}const le=[{id:"dandelion_girl_sunset",label:"Dandelion Girl Sunset",frames:97},{id:"airport_silhouettes_sunset",label:"Airport Silhouettes Sunset",frames:121},{id:"ballerina_arch_spotlight",label:"Ballerina Arch Spotlight",frames:121},{id:"ballerina_window_light",label:"Ballerina Window Light",frames:121},{id:"ballerina_window_reach",label:"Ballerina Window Reach",frames:121},{id:"big_ben_tower",label:"Big Ben Tower",frames:75},{id:"boy_cozy_room_moody",label:"Boy Cozy Room Moody",frames:121},{id:"carousel_night_glow",label:"Carousel Night Glow",frames:121},{id:"cathedral_dome_light",label:"Cathedral Dome Light",frames:121},{id:"cattle_meadow_backlit",label:"Cattle Meadow Backlit",frames:121},{id:"city_highway_night",label:"City Highway Night",frames:121},{id:"city_rooftops_aerial",label:"City Rooftops Aerial",frames:121},{id:"city_roundabout_night",label:"City Roundabout Night",frames:121},{id:"dancer_blue_studio",label:"Dancer Blue Studio",frames:121},{id:"driver_golden_hour_car",label:"Driver Golden Hour Car",frames:121},{id:"dusk_field_clouds",label:"Dusk Field Clouds",frames:121},{id:"forest_stream_golden",label:"Forest Stream Golden",frames:121},{id:"girls_bokeh_picnic",label:"Girls Bokeh Picnic",frames:57},{id:"golden_street_tower",label:"Golden Street Tower",frames:121},{id:"greek_alley_flowers",label:"Greek Alley Flowers",frames:121},{id:"horse_pasture_silhouette",label:"Horse Pasture Silhouette",frames:121},{id:"lakeside_arches_vista",label:"Lakeside Arches Vista",frames:121},{id:"misty_mountains_sunrise",label:"Misty Mountains Sunrise",frames:121},{id:"mountain_road_canyon",label:"Mountain Road Canyon",frames:121},{id:"mountain_sunrise_portrait",label:"Mountain Sunrise Portrait",frames:121},{id:"neon_dancer_club",label:"Neon Dancer Club",frames:121},{id:"night_vendor_cart",label:"Night Vendor Cart",frames:121},{id:"river_cascade_sunlit",label:"River Cascade Sunlit",frames:121}];let v,T=null,U=0,I=0,m=structuredClone(de),L=le[0],C=Math.floor(L.frames/2),K=!1,E,Z,Se="histogram",re=0,J=null,R=!1,B=.5;const l=n=>document.querySelector(n),G=typeof location<"u"&&new URLSearchParams(location.search).has("embed");let ue=!1;function Ae(n){!G||window.parent===window||window.parent.postMessage(n,"*")}async function rt(){G&&document.body.classList.add("embed-mode"),await Ke(),v=new et(l("#canvas")),Z=l("#scope-canvas").getContext("2d");const n=l("#wheels-container"),t=new z(n,"Lift",.45,0),e=new z(n,"Gamma",.5,1),r=new z(n,"Gain",.3,1),i=new z(n,"Offset",.2,0);E={lift:t,gamma:e,gain:r,offset:i},t.onUpdate=()=>{m.lift=t.values,x()},e.onUpdate=()=>{m.gamma=e.values,x()},r.onUpdate=()=>{m.gain=r.values,x()},i.onUpdate=()=>{m.offset=i.values,x()},dt(),G||mt(),ht(),gt(),pt(),vt(),bt(),wt(l("#canvas")),xt(l("#canvas")),G?(st(),l(".loading").textContent="Waiting for image from host…",Ae({type:"gear:ready"})):await he(L.id,C)}function st(){window.addEventListener("message",async n=>{const t=n.data;!t||typeof t!="object"||(t.type==="gear:load_exr"&&t.buffer instanceof ArrayBuffer?await Ue(new Uint8Array(t.buffer)):t.type==="gear:load_exr_sequence"&&Array.isArray(t.urls)?await at(t.urls,t.sdrUrls):t.type==="gear:load_sdr"&&t.buffer instanceof ArrayBuffer?await Me(new Uint8Array(t.buffer),t.mime||"image/png"):t.type==="gear:set_params"&&t.params?ot(t.params,t.wheels):t.type==="gear:reset"&&Be())})}let Pe=[],Q=null,ee=0,se=0;async function at(n,t){if(Pe=n,Q=t&&Array.isArray(t)&&t.length?t:null,ee=0,!n.length)return;if(n.length===1){await ae(0);return}document.body.classList.add("embed-seq");const e=l("#frame-slider");e.min="0",e.max=String(n.length-1),e.step="1",e.value="0",l("#tl-start").textContent="0",l("#tl-end").textContent=String(n.length-1),l("#frame-num").textContent="0",e.oninput=()=>{ee=+e.value,l("#frame-num").textContent=String(ee)},e.onchange=()=>{ae(+e.value)},await ae(0)}async function ae(n){const t=Pe[n];if(!t)return;const e=++se,r=l(".loading");r.classList.remove("hidden"),r.textContent="Fetching…";try{const i=await fetch(t);if(!i.ok)throw new Error(`HTTP ${i.status}`);const s=new Uint8Array(await i.arrayBuffer());if(e!==se)return;if(ee=n,await Ue(s),Q&&Q[n])try{const a=await fetch(Q[n]);if(a.ok&&e===se){const o=new Uint8Array(await a.arrayBuffer());await Me(o,"image/png")}}catch{}}catch(i){r.textContent=`Error: ${i.message}`}}async function Me(n,t){const e=new Blob([n.slice().buffer],{type:t}),r=URL.createObjectURL(e);try{const i=new Image;await new Promise((f,u)=>{i.onload=()=>f(),i.onerror=()=>u(new Error("SDR image decode failed")),i.src=r}),v.uploadSDR(i);const s=U/i.naturalWidth,a=I/i.naturalHeight,o=(1-s)/2,c=(1-a)/2;v.sdrCrop=[s,a,o,c],requestAnimationFrame(()=>x())}finally{URL.revokeObjectURL(r)}}async function Ue(n){const t=l(".loading");t.classList.remove("hidden"),t.textContent="Decoding…",await new Promise(e=>setTimeout(e,0));try{const e=performance.now(),r=Ce(n),i=(performance.now()-e).toFixed(0);T=r.interleavedRgbPixels,U=r.width,I=r.height,v.uploadImage(T,U,I),requestAnimationFrame(()=>x()),l("#info-res").textContent=`${U}×${I}`,l("#info-decode").textContent=`${i} ms`,t.classList.add("hidden")}catch(e){t.textContent=`Error: ${e.message}`}}function ot(n,t){ue=!0;try{n.exposure!=null&&(m.exposure=n.exposure,l("#sl-exposure").value=String(n.exposure),l("#tb-ev").value=n.exposure.toFixed(2),l("#ev-reset").classList.toggle("show",Math.abs(n.exposure)>.001)),n.toneMapping!=null&&(m.toneMapping=n.toneMapping,l("#tm-select").value=String(n.toneMapping));const e=[["softClip","#sl-softclip"],["contrast","#sl-contrast"],["pivot","#sl-pivot"],["shadows","#sl-shadows"],["highlights","#sl-highlights"],["temperature","#sl-temperature"],["tint","#sl-tint"],["saturation","#sl-saturation"],["vibrance","#sl-vibrance"],["hueShift","#sl-hueshift"]];for(const[r,i]of e){const s=n[r];s!=null&&(m[r]=s,P(i,s))}t?.lift?E.lift.setState(t.lift):n.lift&&E.lift.setValues([...n.lift]),t?.gamma?E.gamma.setState(t.gamma):n.gamma&&E.gamma.setValues([...n.gamma]),t?.gain?E.gain.setState(t.gain):n.gain&&E.gain.setValues([...n.gain]),t?.offset?E.offset.setState(t.offset):n.offset&&E.offset.setValues([...n.offset]),m.lift=E.lift.values,m.gamma=E.gamma.values,m.gain=E.gain.values,m.offset=E.offset.values,n.falseColor!=null&&(m.falseColor=!!n.falseColor,l("#fc-check").checked=m.falseColor,l(".fc-legend").classList.toggle("show",m.falseColor)),requestAnimationFrame(()=>x())}finally{ue=!1}}const me="/clips".replace(/\/$/,"");function ct(n,t){return`${me}/${n}/hdr_exr/frame_${String(t).padStart(5,"0")}.exr`}function lt(n,t){return`${me}/${n}/sdr_png/frame_${String(t).padStart(5,"0")}.png`}async function he(n,t){if(K)return;K=!0;const e=l(".loading");e.classList.remove("hidden"),e.textContent="Loading EXR…";try{const r=await fetch(ct(n,t));if(!r.ok)throw new Error(`HTTP ${r.status}`);const i=new Uint8Array(await r.arrayBuffer());e.textContent="Decoding…",await new Promise(c=>setTimeout(c,0));const s=performance.now(),a=Ce(i),o=(performance.now()-s).toFixed(0);T=a.interleavedRgbPixels,U=a.width,I=a.height,v.uploadImage(T,U,I),x(),l("#info-res").textContent=`${U}×${I}`,l("#info-decode").textContent=`${o} ms`,R&&Fe(n,t)}catch(r){e.textContent=`Error: ${r.message}`,K=!1;return}e.classList.add("hidden"),K=!1}function ut(n){const t=n.split(/\r?\n/);let e=0;const r=[];for(const i of t){const s=i.trim();if(!s||s.startsWith("#")||s.startsWith("TITLE")||s.startsWith("DOMAIN"))continue;if(s.startsWith("LUT_3D_SIZE")){e=parseInt(s.split(/\s+/)[1],10);continue}if(s.startsWith("LUT_1D_SIZE"))return null;const a=s.split(/\s+/);if(a.length>=3){const o=parseFloat(a[0]),c=parseFloat(a[1]),f=parseFloat(a[2]);isNaN(o)||r.push(o,c,f)}}return e<2||r.length!==e*e*e*3?null:{size:e,data:new Float32Array(r)}}function Fe(n,t){const e=new Image;e.onload=()=>{v.uploadSDR(e);const r=U/e.naturalWidth,i=I/e.naturalHeight,s=(1-r)/2,a=(1-i)/2;v.sdrCrop=[r,i,s,a],x()},e.src=lt(n,t)}function ft(){return{lift:E.lift.getState(),gamma:E.gamma.getState(),gain:E.gain.getState(),offset:E.offset.getState()}}function x(){T&&(v.render(m),G&&!ue&&Ae({type:"gear:params_changed",params:structuredClone(m),wheels:ft()}),!re&&(re=requestAnimationFrame(()=>{re=0,T&&(J=v.readHistogramPixels(m),v.render(m),De())})))}function De(){if(!J)return;const n=Z.canvas;if(Se==="parade")it(Z,J,320,180,n.width,n.height);else{const[t,e,r]=tt(J);nt(Z,t,e,r,n.width,n.height)}}function dt(){if(!G){let c=function(){h.src=p(L.id),g.textContent=L.label},f=function(d){L=le[d];const y=l("#frame-slider");y.max=String(L.frames-1),l("#tl-end").textContent=String(L.frames-1),C=Math.min(C,L.frames-1),y.value=String(C),l("#frame-num").textContent=String(C),c(),w.querySelectorAll(".clip-item").forEach((S,O)=>{S.classList.toggle("active",O===d)}),_.classList.remove("open"),he(L.id,C)};const u=l("#clip-trigger"),h=l("#clip-trigger-thumb"),g=l("#clip-trigger-name"),_=l("#clip-popup"),w=l("#clip-grid"),p=d=>`${me}/${d}/thumbnail.jpg`;le.forEach((d,y)=>{const S=document.createElement("div");S.className="clip-item"+(y===0?" active":""),S.innerHTML=`<img class="clip-item-thumb" src="${p(d.id)}" loading="lazy" alt=""/><div class="clip-item-name">${d.label}</div>`,S.addEventListener("click",()=>f(y)),w.appendChild(S)}),c(),u.addEventListener("click",d=>{d.stopPropagation(),_.classList.toggle("open")}),document.addEventListener("click",d=>{!_.contains(d.target)&&d.target!==u&&_.classList.remove("open")}),window.addEventListener("keydown",d=>{d.key==="Escape"&&_.classList.remove("open")})}const n=l("#sl-exposure"),t=l("#tb-ev"),e=l("#ev-reset");function r(c){c=Math.max(-6,Math.min(6,c)),m.exposure=c,n.value=String(c),t.value=c.toFixed(2),e.classList.toggle("show",Math.abs(c)>.001),x()}n.addEventListener("input",()=>r(+n.value)),t.addEventListener("change",()=>r(parseFloat(t.value)||0)),t.addEventListener("keydown",c=>{c.key==="Enter"&&t.blur()}),e.addEventListener("click",()=>r(0));const i=l("#tm-select");i.value=String(m.toneMapping),i.addEventListener("change",()=>{m.toneMapping=+i.value,x()});const s=l("#btn-lut"),a=l("#lut-file"),o=l("#lut-name");s.addEventListener("click",()=>{v.lutEnabled?(v.clearLUT(),s.classList.remove("active"),o.textContent="",x()):a.click()}),a.addEventListener("change",()=>{const c=a.files?.[0];if(!c)return;const f=new FileReader;f.onload=()=>{const u=ut(f.result);if(!u){alert("Could not parse .cube file (only 3D LUTs supported)");return}v.uploadLUT(u.data,u.size),s.classList.add("active"),o.textContent=c.name.replace(".cube",""),x()},f.readAsText(c),a.value=""})}function mt(){const n=l("#frame-slider");n.max=String(L.frames-1),n.value=String(C),l("#frame-num").textContent=String(C),l("#tl-end").textContent=String(L.frames-1),n.addEventListener("input",()=>{C=+n.value,l("#frame-num").textContent=String(C)}),n.addEventListener("change",()=>{C=+n.value,he(L.id,C)})}function ht(){M("#sl-softclip","softClip",n=>n.toFixed(2)),M("#sl-contrast","contrast",n=>n.toFixed(2)),M("#sl-pivot","pivot",n=>n.toFixed(2)),M("#sl-shadows","shadows",n=>n.toFixed(2)),M("#sl-highlights","highlights",n=>n.toFixed(2)),M("#sl-temperature","temperature",n=>n.toFixed(2)),M("#sl-tint","tint",n=>n.toFixed(2)),M("#sl-saturation","saturation",n=>n.toFixed(2)),M("#sl-vibrance","vibrance",n=>n.toFixed(2)),M("#sl-hueshift","hueShift",n=>`${n.toFixed(0)}°`),l("#fc-check").addEventListener("change",n=>{m.falseColor=n.target.checked,l(".fc-legend").classList.toggle("show",m.falseColor),x()}),l("#btn-reset").addEventListener("click",Be)}function gt(){document.querySelectorAll(".scope-tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".scope-tab").forEach(t=>t.classList.remove("active")),n.classList.add("active"),Se=n.dataset.mode,De()})})}function pt(){const n=l("#panel-wrap"),t=l("#btn-panel");function e(){n.classList.toggle("hidden"),t.classList.toggle("active",!n.classList.contains("hidden"))}t.addEventListener("click",e),window.addEventListener("keydown",r=>{r.key==="Tab"&&!r.ctrlKey&&!r.altKey&&document.activeElement?.tagName!=="INPUT"&&(r.preventDefault(),e())}),t.classList.add("active")}function vt(){const n=l("#panel-wrap"),t=l("#panel-resize");let e=!1;t.addEventListener("pointerdown",r=>{e=!0,t.setPointerCapture(r.pointerId),document.body.style.cursor="col-resize",document.body.style.userSelect="none"}),window.addEventListener("pointermove",r=>{e&&(n.style.width=Math.max(260,Math.min(600,document.documentElement.clientWidth-r.clientX))+"px")}),window.addEventListener("pointerup",()=>{e&&(e=!1,document.body.style.cursor="",document.body.style.userSelect="")})}function bt(){const n=l("#btn-compare"),t=l("#wipe-line"),e=l("#wipe-label-l"),r=l("#wipe-label-r"),i=l("#canvas");function s(){R=!R,v.compareOn=R,n.classList.toggle("active",R),t.classList.toggle("active",R),e.classList.toggle("active",R),r.classList.toggle("active",R),R&&Fe(L.id,C),x(),oe()}n.addEventListener("click",s),window.addEventListener("keydown",o=>{o.key==="c"&&!o.ctrlKey&&document.activeElement?.tagName!=="INPUT"&&s()});let a=!1;t.addEventListener("pointerdown",o=>{a=!0,t.setPointerCapture(o.pointerId)}),i.addEventListener("pointerdown",o=>{if(!R||o.ctrlKey)return;a=!0;const c=i.getBoundingClientRect();B=Math.max(.02,Math.min(.98,(o.clientX-c.left)/c.width)),v.wipePos=B,x(),oe()}),window.addEventListener("pointermove",o=>{if(!a||!R)return;const c=i.getBoundingClientRect();B=Math.max(.02,Math.min(.98,(o.clientX-c.left)/c.width)),v.wipePos=B,x(),oe()}),window.addEventListener("pointerup",()=>{a=!1})}function oe(){const n=l("#wipe-line"),t=l("#wipe-label-l"),e=l("#wipe-label-r"),r=l("#canvas"),i=r.getBoundingClientRect(),a=r.closest(".viewport").getBoundingClientRect(),o=i.left-a.left+i.width*B;n.style.left=o+"px",t.style.left=i.left-a.left+i.width*B*.5+"px",e.style.left=i.left-a.left+i.width*(B+(1-B)*.5)+"px"}function wt(n){let t=!1;const e={x:0,y:0,panX:0,panY:0};n.addEventListener("wheel",i=>{if(!T)return;i.preventDefault();const s=n.getBoundingClientRect(),a=(i.clientX-s.left)/s.width,o=(i.clientY-s.top)/s.height,c=v.zoom,f=Math.exp(-i.deltaY*.0015),u=Math.max(.1,Math.min(64,c*f)),h=(a-.5)*(1/c-1/u),g=(o-.5)*(1/c-1/u);v.zoom=u,v.pan=[v.pan[0]+h,v.pan[1]+g],x()},{passive:!1}),n.addEventListener("pointerdown",i=>{T&&(i.ctrlKey||i.button===0&&R||i.button!==0&&i.button!==1||(i.preventDefault(),t=!0,n.setPointerCapture(i.pointerId),e.x=i.clientX,e.y=i.clientY,e.panX=v.pan[0],e.panY=v.pan[1],n.style.cursor="grabbing"))}),n.addEventListener("pointermove",i=>{if(!t)return;const s=n.getBoundingClientRect(),a=(i.clientX-e.x)/s.width/v.zoom,o=(i.clientY-e.y)/s.height/v.zoom;v.pan=[e.panX-a,e.panY-o],x()});const r=()=>{t&&(t=!1,n.style.cursor="")};n.addEventListener("pointerup",r),n.addEventListener("pointercancel",r),n.addEventListener("dblclick",i=>{R||i.ctrlKey||(v.resetView(),x())}),window.addEventListener("keydown",i=>{document.activeElement?.tagName==="INPUT"||document.activeElement?.tagName==="SELECT"||(i.key==="0"||i.key==="f"||i.key==="F")&&(v.resetView(),x())})}function xt(n){n.addEventListener("mousemove",i=>{if(!T)return;const s=n.getBoundingClientRect(),a=v.canvasToImagePixel(s,i.clientX,i.clientY);if(!a){l("#px-coord").textContent="",l("#px-rgb").textContent="",l("#px-lum").textContent="";return}const[o,c]=a,f=(c*U+o)*3,u=T[f],h=T[f+1],g=T[f+2];l("#px-coord").textContent=`(${o}, ${c})`,l("#px-rgb").textContent=`R:${D(u)} G:${D(h)} B:${D(g)}`;const _=.2126*u+.7152*h+.0722*g;l("#px-lum").textContent=`L:${D(_)}`,l("#px-swatch").style.background=`rgb(${ce(u)*255|0},${ce(h)*255|0},${ce(g)*255|0})`}),n.addEventListener("mouseleave",()=>{l("#px-coord").textContent="",l("#px-rgb").textContent="",l("#px-lum").textContent=""});const t=l("#probe"),e=t.querySelector(".probe-label"),r=n.closest(".viewport");n.addEventListener("click",i=>{if(!i.ctrlKey||!T){t.classList.remove("show");return}const s=n.getBoundingClientRect(),a=v.canvasToImagePixel(s,i.clientX,i.clientY);if(!a)return;const[o,c]=a,f=(c*U+o)*3,u=T[f],h=T[f+1],g=T[f+2],_=.2126*u+.7152*h+.0722*g,w=_>1e-6?Math.log2(_/.18):-1/0,p=w>-20?`${w>=0?"+":""}${w.toFixed(1)} EV`:"−∞ EV",d=r.getBoundingClientRect(),y=i.clientX-d.left,S=i.clientY-d.top;t.style.left=y+"px",t.style.top=S+"px",y>d.width*.65?(e.style.left="auto",e.style.right="14px"):(e.style.left="14px",e.style.right="auto"),e.innerHTML=`<span style="color:var(--dim)">(${o}, ${c})</span><span class="pr">R: ${D(u)}</span><span class="pg">G: ${D(h)}</span><span class="pb">B: ${D(g)}</span><span class="pl">L: ${D(_)}</span><span class="pev">${p}</span>`,t.classList.add("show")}),window.addEventListener("keydown",i=>{i.key==="Escape"&&t.classList.remove("show")})}function M(n,t,e){const r=l(n),i=r.closest(".slider-row").querySelector(".label-row"),s=i.querySelector(".val"),a=de[t],o=document.createElement("input");o.type="number",o.className="val-input",o.step=r.step,o.min=r.min,o.max=r.max,s.replaceWith(o);const c=document.createElement("button");c.className="sl-reset",c.innerHTML="&#x21ba;",c.title=`Reset to ${e(a)}`,i.insertBefore(c,o);function f(u){m[t]=u,r.value=String(u),o.value=e(u).replace("°",""),c.classList.toggle("show",Math.abs(u-a)>.001),x()}f(m[t]),r.addEventListener("input",()=>f(+r.value)),o.addEventListener("change",()=>{let u=parseFloat(o.value);isNaN(u)&&(u=a),f(Math.max(+r.min,Math.min(+r.max,u)))}),o.addEventListener("keydown",u=>{u.key==="Enter"&&o.blur()}),c.addEventListener("click",()=>f(a))}function P(n,t){l(n).value=String(t),l(n).dispatchEvent(new Event("input"))}function Be(){m=structuredClone(de),l("#sl-exposure").value="0",l("#tb-ev").value="0.00",l("#ev-reset").classList.remove("show"),l("#tm-select").value=String(m.toneMapping),P("#sl-softclip",m.softClip),P("#sl-contrast",m.contrast),P("#sl-pivot",m.pivot),P("#sl-shadows",m.shadows),P("#sl-highlights",m.highlights),P("#sl-temperature",m.temperature),P("#sl-tint",m.tint),P("#sl-saturation",m.saturation),P("#sl-vibrance",m.vibrance),P("#sl-hueshift",m.hueShift),E.lift.reset(),E.gamma.reset(),E.gain.reset(),E.offset.reset(),l("#fc-check").checked=!1,l(".fc-legend").classList.remove("show"),x()}function D(n){return Math.abs(n)>=10?n.toFixed(2):n.toFixed(4)}function ce(n){return Math.max(0,Math.min(1,n))}rt().catch(console.error);
