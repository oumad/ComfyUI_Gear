(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const o of i)if(o.type==="childList")for(const s of o.addedNodes)s.tagName==="LINK"&&s.rel==="modulepreload"&&n(s)}).observe(document,{childList:!0,subtree:!0});function e(i){const o={};return i.integrity&&(o.integrity=i.integrity),i.referrerPolicy&&(o.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?o.credentials="include":i.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function n(i){if(i.ep)return;i.ep=!0;const o=e(i);fetch(i.href,o)}})();const st="modulepreload",lt=function(r,t){return new URL(r,t).href},Ie={},he=function(t,e,n){let i=Promise.resolve();if(e&&e.length>0){let s=function(d){return Promise.all(d.map(f=>Promise.resolve(f).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),u=l?.nonce||l?.getAttribute("nonce");i=s(e.map(d=>{if(d=lt(d,n),d in Ie)return;Ie[d]=!0;const f=d.endsWith(".css"),p=f?'[rel="stylesheet"]':"";if(!!n)for(let g=a.length-1;g>=0;g--){const _=a[g];if(_.href===d&&(!f||_.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${d}"]${p}`))return;const b=document.createElement("link");if(b.rel=f?"stylesheet":st,f||(b.as="script"),b.crossOrigin="",b.href=d,u&&b.setAttribute("nonce",u),document.head.appendChild(b),f)return new Promise((g,_)=>{b.addEventListener("load",g),b.addEventListener("error",()=>_(new Error(`Unable to preload CSS for ${d}`)))})}))}function o(s){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=s,window.dispatchEvent(a),!a.defaultPrevented)throw s}return i.then(s=>{for(const a of s||[])a.status==="rejected"&&o(a.reason);return t().catch(o)})};let v;const Ve=typeof TextDecoder<"u"?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof TextDecoder<"u"&&Ve.decode();let q=null;function K(){return(q===null||q.byteLength===0)&&(q=new Uint8Array(v.memory.buffer)),q}function pe(r,t){return r=r>>>0,Ve.decode(K().subarray(r,r+t))}let X=0;const oe=typeof TextEncoder<"u"?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},ct=typeof oe.encodeInto=="function"?function(r,t){return oe.encodeInto(r,t)}:function(r,t){const e=oe.encode(r);return t.set(e),{read:r.length,written:e.length}};function Oe(r,t,e){if(e===void 0){const a=oe.encode(r),l=t(a.length,1)>>>0;return K().subarray(l,l+a.length).set(a),X=a.length,l}let n=r.length,i=t(n,1)>>>0;const o=K();let s=0;for(;s<n;s++){const a=r.charCodeAt(s);if(a>127)break;o[i+s]=a}if(s!==n){s!==0&&(r=r.slice(s)),i=e(i,n,n=s+r.length*3,1)>>>0;const a=K().subarray(i+s,i+n),l=ct(r,a);s+=l.written,i=e(i,n,s,1)>>>0}return X=s,i}let H=null;function ee(){return(H===null||H.buffer.detached===!0||H.buffer.detached===void 0&&H.buffer!==v.memory.buffer)&&(H=new DataView(v.memory.buffer)),H}function dt(r){return r==null}let z=null;function ut(){return(z===null||z.byteLength===0)&&(z=new Float32Array(v.memory.buffer)),z}function ft(r,t){return r=r>>>0,ut().subarray(r/4,r/4+t)}function gt(r){const t=v.__wbindgen_export_3.get(r);return v.__externref_table_dealloc(r),t}function mt(r,t){const e=t(r.length*1,1)>>>0;return K().set(r,e/1),X=r.length,e}function ht(r){const t=mt(r,v.__wbindgen_malloc),e=X,n=v.readExrRgb(t,e);if(n[2])throw gt(n[1]);return Le.__wrap(n[0])}typeof FinalizationRegistry>"u"||new FinalizationRegistry(r=>v.__wbg_exrdecoder_free(r>>>0,1));typeof FinalizationRegistry>"u"||new FinalizationRegistry(r=>v.__wbg_exrencoder_free(r>>>0,1));const Ne=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(r=>v.__wbg_exrsimpleimage_free(r>>>0,1));class Le{static __wrap(t){t=t>>>0;const e=Object.create(Le.prototype);return e.__wbg_ptr=t,Ne.register(e,e.__wbg_ptr,e),e}__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,Ne.unregister(this),t}free(){const t=this.__destroy_into_raw();v.__wbg_exrsimpleimage_free(t,0)}get data(){const t=v.exrsimpleimage_data(this.__wbg_ptr);var e=ft(t[0],t[1]).slice();return v.__wbindgen_free(t[0],t[1]*4,4),e}get width(){return v.exrsimpleimage_width(this.__wbg_ptr)>>>0}get height(){return v.exrsimpleimage_height(this.__wbg_ptr)>>>0}}async function pt(r,t){if(typeof Response=="function"&&r instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(r,t)}catch(n){if(r.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",n);else throw n}const e=await r.arrayBuffer();return await WebAssembly.instantiate(e,t)}else{const e=await WebAssembly.instantiate(r,t);return e instanceof WebAssembly.Instance?{instance:e,module:r}:e}}function qe(){const r={};return r.wbg={},r.wbg.__wbg_error_7534b8e9a36f1ab4=function(t,e){let n,i;try{n=t,i=e,console.error(pe(t,e))}finally{v.__wbindgen_free(n,i,1)}},r.wbg.__wbg_new_8a6f238a6ece86ea=function(){return new Error},r.wbg.__wbg_stack_0ed75d68575b0f3c=function(t,e){const n=e.stack,i=Oe(n,v.__wbindgen_malloc,v.__wbindgen_realloc),o=X;ee().setInt32(t+4,o,!0),ee().setInt32(t+0,i,!0)},r.wbg.__wbindgen_init_externref_table=function(){const t=v.__wbindgen_export_3,e=t.grow(4);t.set(0,void 0),t.set(e+0,void 0),t.set(e+1,null),t.set(e+2,!0),t.set(e+3,!1)},r.wbg.__wbindgen_string_get=function(t,e){const n=e,i=typeof n=="string"?n:void 0;var o=dt(i)?0:Oe(i,v.__wbindgen_malloc,v.__wbindgen_realloc),s=X;ee().setInt32(t+4,s,!0),ee().setInt32(t+0,o,!0)},r.wbg.__wbindgen_string_new=function(t,e){return pe(t,e)},r.wbg.__wbindgen_throw=function(t,e){throw new Error(pe(t,e))},r}function ze(r,t){return v=r.exports,Ke.__wbindgen_wasm_module=t,H=null,z=null,q=null,v.__wbindgen_start(),v}function _t(r){if(v!==void 0)return v;typeof r<"u"&&(Object.getPrototypeOf(r)===Object.prototype?{module:r}=r:console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));const t=qe();r instanceof WebAssembly.Module||(r=new WebAssembly.Module(r));const e=new WebAssembly.Instance(r,t);return ze(e,r)}async function Ke(r){if(v!==void 0)return v;typeof r<"u"&&(Object.getPrototypeOf(r)===Object.prototype?{module_or_path:r}=r:console.warn("using deprecated parameters for the initialization function; pass a single object instead")),typeof r>"u"&&(r=new URL(""+new URL("exrs_raw_wasm_bindgen_bg-DvcqSi-p.wasm",import.meta.url).href,import.meta.url));const t=qe();(typeof r=="string"||typeof Request=="function"&&r instanceof Request||typeof URL=="function"&&r instanceof URL)&&(r=fetch(r));const{instance:e,module:n}=await pt(await r,t);return ze(e,n)}let ae=!1;async function bt(){if(!ae)try{await Ke(),ae=!0}catch(r){try{const t=await he(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),e=await he(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),{createRequire:n}=await he(async()=>{const{createRequire:l}=await import("./__vite-browser-external-BIHI7g3E.js");return{createRequire:l}},[],import.meta.url),i=n(import.meta.url),o=e.dirname(i.resolve("exrs-raw-wasm-bindgen/package.json")),s=e.resolve(o,"exrs_raw_wasm_bindgen_bg.wasm"),a=t.readFileSync(s);_t({module:a}),ae=!0}catch{throw console.error("Failed to initialize EXRS WASM in both browser and Node environments"),r}}}function vt(){if(!ae)throw new Error("EXRS WASM module not initialized. Call init() first.")}function Ae(r){vt();const t=ht(r);try{return{width:t.width,height:t.height,interleavedRgbPixels:t.data}}finally{t.free()}}const Se={exposure:0,toneMapping:2,softClip:0,temperature:0,tint:0,lift:[0,0,0],gamma:[1,1,1],gain:[1,1,1],offset:[0,0,0],contrast:1,pivot:.18,shadows:0,highlights:0,saturation:1,vibrance:0,hueShift:0,falseColor:!1},yt=`#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,wt=`#version 300 es
precision highp float;

uniform sampler2D uTex;
uniform sampler2D uTexSDR;
uniform sampler2D uTexB;
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
uniform bool  uCompareHDR;
uniform float uWipePos;
uniform vec4  uSDRCrop;
// Per-side color-space flags: v7 outputs ACEScg (AP1) primaries; convert to Rec.709
// for display. Other clips are already Rec.709-ish, so the flag is off for them.
uniform bool  uAP1A;   // current clip (A)
uniform bool  uAP1B;   // compare clip (B)
// ACEScg (AP1, D60) -> linear Rec.709 (D65, Bradford CAT). Columns (GLSL is column-major).
const mat3 AP1_TO_709 = mat3(
   1.70505, -0.13026, -0.02400,
  -0.62179,  1.14080, -0.12897,
  -0.08326, -0.01055,  1.15297
);
uniform highp sampler3D uLUT3D;
uniform bool  uLUTEnabled;
uniform float uLUTSize;      // e.g. 33.0

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
  // Wipe line (drawn before anything else)
  if(uCompareOn && abs(vUv.x - uWipePos) < 0.002){
    oColor = vec4(vec3(0.9), 1.0);
    return;
  }

  // Select source: current clip A (LEFT of wipe) or compare B (RIGHT).
  // B is on the right to match the "vs" dropdown, which lives on the right of the UI.
  // Zoom/pan are applied at the DOM layer (CSS transform on the canvas)
  // so the shader stays simple and the image overflows the viewport at
  // zoom > 1 instead of being constrained to its original footprint.
  vec3 c;
  if(uCompareOn && vUv.x > uWipePos){
    if(uCompareHDR){
      // B is another HDR output (e.g. a different LoRA): already linear, run the
      // identical exposure/tonemap pipeline as A for a fair side-by-side.
      c = texture(uTexB, vUv).rgb;
      if(uAP1B) c = AP1_TO_709 * c;
    } else {
      // Remap UVs to sample the center crop of the larger SDR texture
      vec2 sdrUv = vUv * uSDRCrop.xy + uSDRCrop.zw;
      c = sRGBToLinear(texture(uTexSDR, sdrUv).rgb);
    }
  } else {
    c = texture(uTex, vUv).rgb;
    if(uAP1A) c = AP1_TO_709 * c;
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
}`;function Ge(r,t,e){const n=r.createShader(t);if(r.shaderSource(n,e),r.compileShader(n),!r.getShaderParameter(n,r.COMPILE_STATUS))throw new Error(`Shader compile:
`+r.getShaderInfoLog(n));return n}function Et(r,t,e){const n=r.createProgram();if(r.attachShader(n,t),r.attachShader(n,e),r.linkProgram(n),!r.getProgramParameter(n,r.LINK_STATUS))throw new Error(`Program link:
`+r.getProgramInfoLog(n));return n}const xt=["uTex","uTexSDR","uExposure","uToneMap","uSoftClip","uTemperature","uTint","uLift","uGamma","uGain","uOffset","uContrast","uPivot","uShadows","uHighlights","uSaturation","uVibrance","uHueShift","uFalseColor","uCompareOn","uCompareHDR","uWipePos","uSDRCrop","uTexB","uAP1A","uAP1B","uLUT3D","uLUTEnabled","uLUTSize"],te=320,re=180;class Ct{constructor(t){this.canvas=t,this.imageWidth=0,this.imageHeight=0,this.compareOn=!1,this.compareHDR=!1,this.ap1A=!1,this.ap1B=!1,this.wipePos=.5,this.sdrCrop=[1,1,0,0],this.lutEnabled=!1,this.lutSize=33;const e=t.getContext("webgl2",{antialias:!1,premultipliedAlpha:!1});if(!e)throw new Error("WebGL2 not supported");this.gl=e;const n=Ge(e,e.VERTEX_SHADER,yt),i=Ge(e,e.FRAGMENT_SHADER,wt);this.prog=Et(e,n,i),this.u={};for(const s of xt)this.u[s]=e.getUniformLocation(this.prog,s);this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);const o=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,o),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.tex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.tex),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.texSDR=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.texB=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texB),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.lutTex=e.createTexture(),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),this.histFBO=e.createFramebuffer(),this.histRBO=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this.histRBO),e.renderbufferStorage(e.RENDERBUFFER,e.RGBA8,te,re),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,this.histRBO),e.bindFramebuffer(e.FRAMEBUFFER,null)}uploadImage(t,e,n){this.imageWidth=e,this.imageHeight=n;const i=e*n,o=new Float32Array(i*4);for(let a=0;a<i;a++)o[a*4]=t[a*3],o[a*4+1]=t[a*3+1],o[a*4+2]=t[a*3+2],o[a*4+3]=1;const s=this.gl;s.bindTexture(s.TEXTURE_2D,this.tex),s.texImage2D(s.TEXTURE_2D,0,s.RGBA16F,e,n,0,s.RGBA,s.FLOAT,o),this.canvas.width=e,this.canvas.height=n}uploadLUT(t,e){const n=this.gl;this.lutSize=e;const i=new Float32Array(e*e*e*4);for(let o=0;o<e*e*e;o++)i[o*4]=t[o*3],i[o*4+1]=t[o*3+1],i[o*4+2]=t[o*3+2],i[o*4+3]=1;n.bindTexture(n.TEXTURE_3D,this.lutTex),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!1),n.texImage3D(n.TEXTURE_3D,0,n.RGBA16F,e,e,e,0,n.RGBA,n.FLOAT,i),n.pixelStorei(n.UNPACK_FLIP_Y_WEBGL,!0),this.lutEnabled=!0}clearLUT(){this.lutEnabled=!1}uploadHDRB(t,e,n){const i=e*n,o=new Float32Array(i*4);for(let a=0;a<i;a++)o[a*4]=t[a*3],o[a*4+1]=t[a*3+1],o[a*4+2]=t[a*3+2],o[a*4+3]=1;const s=this.gl;s.bindTexture(s.TEXTURE_2D,this.texB),s.texImage2D(s.TEXTURE_2D,0,s.RGBA16F,e,n,0,s.RGBA,s.FLOAT,o)}uploadSDR(t){const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texSDR),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,t),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL)}setUniforms(t){const e=this.gl;e.useProgram(this.prog),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.tex),e.uniform1i(this.u.uTex,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.uniform1i(this.u.uTexSDR,1),e.uniform1i(this.u.uCompareOn,this.compareOn?1:0),e.uniform1f(this.u.uWipePos,this.wipePos),e.uniform4f(this.u.uSDRCrop,this.sdrCrop[0],this.sdrCrop[1],this.sdrCrop[2],this.sdrCrop[3]),e.activeTexture(e.TEXTURE3),e.bindTexture(e.TEXTURE_2D,this.texB),e.uniform1i(this.u.uTexB,3),e.uniform1i(this.u.uCompareHDR,this.compareHDR?1:0),e.uniform1i(this.u.uAP1A,this.ap1A?1:0),e.uniform1i(this.u.uAP1B,this.ap1B?1:0),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.uniform1i(this.u.uLUT3D,2),e.uniform1i(this.u.uLUTEnabled,this.lutEnabled?1:0),e.uniform1f(this.u.uLUTSize,this.lutSize),e.uniform1f(this.u.uExposure,t.exposure),e.uniform1i(this.u.uToneMap,t.toneMapping),e.uniform1f(this.u.uSoftClip,t.softClip),e.uniform1f(this.u.uTemperature,t.temperature),e.uniform1f(this.u.uTint,t.tint),e.uniform3f(this.u.uLift,t.lift[0],t.lift[1],t.lift[2]),e.uniform3f(this.u.uGamma,t.gamma[0],t.gamma[1],t.gamma[2]),e.uniform3f(this.u.uGain,t.gain[0],t.gain[1],t.gain[2]),e.uniform3f(this.u.uOffset,t.offset[0],t.offset[1],t.offset[2]),e.uniform1f(this.u.uContrast,t.contrast),e.uniform1f(this.u.uPivot,t.pivot),e.uniform1f(this.u.uShadows,t.shadows),e.uniform1f(this.u.uHighlights,t.highlights),e.uniform1f(this.u.uSaturation,t.saturation),e.uniform1f(this.u.uVibrance,t.vibrance),e.uniform1f(this.u.uHueShift,t.hueShift),e.uniform1i(this.u.uFalseColor,t.falseColor?1:0),e.bindVertexArray(this.vao)}render(t){const e=this.gl;this.setUniforms(t),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.canvas.width,this.canvas.height),e.drawArrays(e.TRIANGLE_STRIP,0,4)}readHistogramPixels(t){const e=this.gl;this.setUniforms(t),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.viewport(0,0,te,re),e.drawArrays(e.TRIANGLE_STRIP,0,4);const n=new Uint8Array(te*re*4);return e.readPixels(0,0,te,re,e.RGBA,e.UNSIGNED_BYTE,n),e.bindFramebuffer(e.FRAMEBUFFER,null),n}destroy(){const t=this.gl;t.deleteProgram(this.prog),t.deleteTexture(this.tex),t.deleteFramebuffer(this.histFBO),t.deleteRenderbuffer(this.histRBO)}}function He(r,t,e){const n=Math.floor(r*6),i=r*6-n,o=e*(1-t),s=e*(1-i*t),a=e*(1-(1-i)*t);switch(n%6){case 0:return[e,a,o];case 1:return[s,e,o];case 2:return[o,e,a];case 3:return[o,s,e];case 4:return[a,o,e];default:return[e,o,s]}}const I=160,B=70,We=6;class ne{constructor(t,e,n,i){this.label=e,this.sensitivity=n,this.center=i,this.dx=0,this.dy=0,this.master=0,this.dragging=!1,this.rgbEls=[null,null,null],this.onUpdate=()=>{},this.values=[i,i,i];const o=document.createElement("div");o.className="wheel-cell";const s=document.createElement("div");s.className="wheel-title";const a=document.createElement("span");a.textContent=e,s.appendChild(a),this.rstBtn=document.createElement("button"),this.rstBtn.className="wheel-reset",this.rstBtn.innerHTML="&#x21ba;",this.rstBtn.title="Reset "+e,this.rstBtn.addEventListener("click",()=>this.reset()),s.appendChild(this.rstBtn),o.appendChild(s),this.cvs=document.createElement("canvas"),this.cvs.width=I,this.cvs.height=I,this.cvs.className="wheel-cvs",o.appendChild(this.cvs);const l=document.createElement("div");l.className="wheel-master-row",this.masterInput=document.createElement("input"),this.masterInput.type="range",this.masterInput.min="-0.5",this.masterInput.max="0.5",this.masterInput.step="0.005",this.masterInput.value="0",this.masterInput.className="wheel-master-sl",this.masterValEl=document.createElement("span"),this.masterValEl.className="wheel-master-val",this.masterValEl.textContent="0.00",l.appendChild(this.masterInput),l.appendChild(this.masterValEl),o.appendChild(l);const u=document.createElement("div");u.className="wheel-rgb-row";const d=["r","g","b"];for(let f=0;f<3;f++){const p=document.createElement("span");p.className=`wheel-rgb ${d[f]}`,p.textContent=i.toFixed(2),u.appendChild(p),this.rgbEls[f]=p}o.appendChild(u),t.appendChild(o),this.el=o,this.ctx=this.cvs.getContext("2d"),this.bg=this.createBg(),this.draw(),this.masterInput.addEventListener("input",()=>{this.master=+this.masterInput.value,this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.onUpdate()}),this.cvs.addEventListener("pointerdown",f=>this.onDown(f)),window.addEventListener("pointermove",f=>this.onMove(f)),window.addEventListener("pointerup",()=>this.onUp()),this.cvs.addEventListener("dblclick",()=>this.reset())}updateRgbReadout(){for(let t=0;t<3;t++)this.rgbEls[t].textContent=this.values[t].toFixed(2)}syncResetBtn(){const t=Math.abs(this.dx)>.5||Math.abs(this.dy)>.5||Math.abs(this.master)>.001;this.rstBtn.classList.toggle("show",t)}reset(){this.dx=0,this.dy=0,this.master=0,this.masterInput.value="0",this.masterValEl.textContent="0.00",this.computeValues(),this.draw(),this.onUpdate()}setValues(t){const e=(t[0]+t[1]+t[2])/3-this.center;this.master=Math.max(-.5,Math.min(.5,e)),this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.dx=0,this.dy=0,this.values=t,this.draw()}getState(){return{dx:this.dx,dy:this.dy,master:this.master}}setState(t){this.dx=t.dx??0,this.dy=t.dy??0,this.master=t.master??0,this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.draw()}onDown(t){this.dragging=!0,this.cvs.setPointerCapture(t.pointerId),this.updateDot(t)}onMove(t){this.dragging&&this.updateDot(t)}onUp(){this.dragging=!1}updateDot(t){const e=this.cvs.getBoundingClientRect(),n=I/e.width,i=I/2;let o=(t.clientX-e.left)*n-i,s=(t.clientY-e.top)*n-i;const a=Math.sqrt(o*o+s*s);a>B&&(o*=B/a,s*=B/a),this.dx=o,this.dy=s,this.computeValues(),this.draw(),this.onUpdate()}computeValues(){this.syncResetBtn();const t=Math.sqrt(this.dx*this.dx+this.dy*this.dy)/B;if(t<.01){this.values=[this.center+this.master,this.center+this.master,this.center+this.master],this.updateRgbReadout();return}const e=Math.pow(t,1.8);let n=-Math.atan2(this.dx,-this.dy)/(2*Math.PI);n<0&&(n+=1);const[i,o,s]=He(n,1,1),a=(i+o+s)/3,l=e*this.sensitivity;this.values=[this.center+(i-a)*l*3+this.master,this.center+(o-a)*l*3+this.master,this.center+(s-a)*l*3+this.master],this.updateRgbReadout()}createBg(){const t=I,e=new ImageData(t,t),n=t/2;for(let i=0;i<t;i++)for(let o=0;o<t;o++){const s=(o-n)/B,a=(i-n)/B,l=Math.sqrt(s*s+a*a);if(l>1.05)continue;const u=l>1?0:l>.92?1:l<.05?.6:.85;let d=-Math.atan2(s,-a)/(2*Math.PI);d<0&&(d+=1);const f=Math.min(l,1)*.65,p=.2+Math.min(l,1)*.15,[y,b,g]=He(d,f,p),_=(i*t+o)*4;e.data[_]=Math.round(y*255),e.data[_+1]=Math.round(b*255),e.data[_+2]=Math.round(g*255),e.data[_+3]=Math.round(u*255)}return e}draw(){const t=this.ctx,e=I/2;t.clearRect(0,0,I,I),t.putImageData(this.bg,0,0),t.beginPath(),t.arc(e,e,B+1,0,Math.PI*2),t.strokeStyle="rgba(255,255,255,0.12)",t.lineWidth=1,t.stroke(),t.strokeStyle="rgba(255,255,255,0.08)",t.beginPath(),t.moveTo(e-B,e),t.lineTo(e+B,e),t.moveTo(e,e-B),t.lineTo(e,e+B),t.stroke();const n=e+this.dx,i=e+this.dy;t.beginPath(),t.arc(n,i,We,0,Math.PI*2),t.fillStyle="#fff",t.fill(),t.strokeStyle="rgba(0,0,0,0.6)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(n,i,We-2,0,Math.PI*2),t.fillStyle="rgba(255,255,255,0.3)",t.fill()}}function Rt(r){const t=new Uint32Array(256),e=new Uint32Array(256),n=new Uint32Array(256);for(let i=0;i<r.length;i+=4)t[r[i]]++,e[r[i+1]]++,n[r[i+2]]++;return[t,e,n]}function Tt(r,t,e,n,i,o){r.clearRect(0,0,i,o),r.fillStyle="#111113",r.fillRect(0,0,i,o);let s=1;for(let d=2;d<254;d++)s=Math.max(s,t[d],e[d],n[d]);const a=Math.log(s+1),l=[[t,"rgba(220, 60, 60, 0.55)"],[e,"rgba(60, 200, 80, 0.55)"],[n,"rgba(60, 120, 220, 0.55)"]],u=i/256;for(const[d,f]of l){r.fillStyle=f,r.beginPath(),r.moveTo(0,o);for(let p=0;p<256;p++){const y=d[p]>0?Math.log(d[p]+1)/a*(o-2):0;r.lineTo(p*u,o-y)}r.lineTo(i,o),r.closePath(),r.fill()}r.strokeStyle="rgba(255,255,255,0.08)",r.lineWidth=1,r.strokeRect(.5,.5,i-1,o-1)}function Lt(r,t,e,n,i,o){r.clearRect(0,0,i,o),r.fillStyle="#111113",r.fillRect(0,0,i,o);const s=Math.floor(i/3),a=2,l=new Float32Array(s*o),u=new Float32Array(s*o),d=new Float32Array(s*o);for(let g=0;g<t.length;g+=4){const _=(g>>2)%e,h=Math.min(Math.floor(_*s/e),s-1),k=o-1-Math.min(Math.floor(t[g]*(o-1)/255),o-1),E=o-1-Math.min(Math.floor(t[g+1]*(o-1)/255),o-1),R=o-1-Math.min(Math.floor(t[g+2]*(o-1)/255),o-1);l[k*s+h]++,u[E*s+h]++,d[R*s+h]++}let f=1;for(let g=0;g<l.length;g++)f=Math.max(f,l[g],u[g],d[g]);const p=Math.log(f+1),y=r.createImageData(i,o),b=y.data;for(let g=0;g<o;g++)for(let _=0;_<s;_++){const h=g*s+_,k=l[h]>0?Math.log(l[h]+1)/p:0,E=(g*i+_)*4;b[E]=Math.min(k*400,255)|0,b[E+3]=255;const R=u[h]>0?Math.log(u[h]+1)/p:0,F=(g*i+_+s+a)*4;_+s+a<i&&(b[F+1]=Math.min(R*400,255)|0,b[F+3]=255);const Q=d[h]>0?Math.log(d[h]+1)/p:0,$=(g*i+_+(s+a)*2)*4;_+(s+a)*2<i&&(b[$+2]=Math.min(Q*400,255)|0,b[$+3]=255)}r.putImageData(y,0,0),r.font="9px sans-serif",r.fillStyle="rgba(255,80,80,0.5)",r.fillText("R",3,10),r.fillStyle="rgba(80,220,80,0.5)",r.fillText("G",s+a+3,10),r.fillStyle="rgba(80,140,255,0.5)",r.fillText("B",(s+a)*2+3,10),r.strokeStyle="rgba(255,255,255,0.08)",r.lineWidth=1,r.strokeRect(.5,.5,i-1,o-1)}const At=["v7","r128prod5k","r128adamw5k","r128prod","r128adamw","ichdri3k","ichdri7k","ichdri10k","full5k","full10k","cgi3k","cgi55","full7k","t2vprod","nostraw","hdri"],Ye=r=>At.includes(r.split("__").pop()||""),J=[{id:"dandelion_girl_sunset__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Dandelion sunset"},{id:"dandelion_girl_sunset__logc4",label:"LogC4 (v3)",frames:49,category:"Dandelion sunset"},{id:"dandelion_girl_sunset__logc3",label:"LogC3 (orig)",frames:49,category:"Dandelion sunset"},{id:"carousel_night_glow__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Carousel night"},{id:"carousel_night_glow__logc4",label:"LogC4 (v3)",frames:49,category:"Carousel night"},{id:"carousel_night_glow__logc3",label:"LogC3 (orig)",frames:49,category:"Carousel night"},{id:"city_highway_night__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"City highway night"},{id:"city_highway_night__logc4",label:"LogC4 (v3)",frames:49,category:"City highway night"},{id:"city_highway_night__logc3",label:"LogC3 (orig)",frames:49,category:"City highway night"},{id:"ballerina_arch_spotlight__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Ballerina arch"},{id:"ballerina_arch_spotlight__logc4",label:"LogC4 (v3)",frames:49,category:"Ballerina arch"},{id:"ballerina_arch_spotlight__logc3",label:"LogC3 (orig)",frames:49,category:"Ballerina arch"},{id:"ballerina_window_reach__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Ballerina window"},{id:"ballerina_window_reach__logc4",label:"LogC4 (v3)",frames:49,category:"Ballerina window"},{id:"ballerina_window_reach__logc3",label:"LogC3 (orig)",frames:49,category:"Ballerina window"},{id:"boy_cozy_room_moody__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Boy cozy room"},{id:"boy_cozy_room_moody__logc4",label:"LogC4 (v3)",frames:49,category:"Boy cozy room"},{id:"boy_cozy_room_moody__logc3",label:"LogC3 (orig)",frames:49,category:"Boy cozy room"},{id:"cathedral_dome_light__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Cathedral dome"},{id:"cathedral_dome_light__logc4",label:"LogC4 (v3)",frames:49,category:"Cathedral dome"},{id:"cathedral_dome_light__logc3",label:"LogC3 (orig)",frames:49,category:"Cathedral dome"},{id:"driver_golden_hour_car__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Driver golden hour"},{id:"driver_golden_hour_car__logc4",label:"LogC4 (v3)",frames:49,category:"Driver golden hour"},{id:"driver_golden_hour_car__logc3",label:"LogC3 (orig)",frames:49,category:"Driver golden hour"},{id:"dusk_field_clouds__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Dusk field"},{id:"dusk_field_clouds__logc4",label:"LogC4 (v3)",frames:49,category:"Dusk field"},{id:"dusk_field_clouds__logc3",label:"LogC3 (orig)",frames:49,category:"Dusk field"},{id:"girls_bokeh_picnic__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Girls bokeh picnic"},{id:"girls_bokeh_picnic__logc4",label:"LogC4 (v3)",frames:49,category:"Girls bokeh picnic"},{id:"girls_bokeh_picnic__logc3",label:"LogC3 (orig)",frames:49,category:"Girls bokeh picnic"},{id:"golden_street_tower__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Golden street tower"},{id:"golden_street_tower__logc4",label:"LogC4 (v3)",frames:49,category:"Golden street tower"},{id:"golden_street_tower__logc3",label:"LogC3 (orig)",frames:49,category:"Golden street tower"},{id:"misty_mountains_sunrise__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Misty mountains"},{id:"misty_mountains_sunrise__logc4",label:"LogC4 (v3)",frames:49,category:"Misty mountains"},{id:"misty_mountains_sunrise__logc3",label:"LogC3 (orig)",frames:49,category:"Misty mountains"},{id:"neon_dancer_club__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Neon dancer"},{id:"neon_dancer_club__logc4",label:"LogC4 (v3)",frames:49,category:"Neon dancer"},{id:"neon_dancer_club__logc3",label:"LogC3 (orig)",frames:49,category:"Neon dancer"},{id:"night_vendor_cart__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Night vendor"},{id:"night_vendor_cart__logc4",label:"LogC4 (v3)",frames:49,category:"Night vendor"},{id:"night_vendor_cart__logc3",label:"LogC3 (orig)",frames:49,category:"Night vendor"},{id:"river_cascade_sunlit__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"River cascade"},{id:"river_cascade_sunlit__logc4",label:"LogC4 (v3)",frames:49,category:"River cascade"},{id:"river_cascade_sunlit__logc3",label:"LogC3 (orig)",frames:49,category:"River cascade"},{id:"airport_silhouettes_sunset__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Airport silhouettes"},{id:"airport_silhouettes_sunset__logc4",label:"LogC4 (v3)",frames:49,category:"Airport silhouettes"},{id:"airport_silhouettes_sunset__logc3",label:"LogC3 (orig)",frames:49,category:"Airport silhouettes"},{id:"ballerina_window_light__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Ballerina window light"},{id:"ballerina_window_light__logc4",label:"LogC4 (v3)",frames:49,category:"Ballerina window light"},{id:"ballerina_window_light__logc3",label:"LogC3 (orig)",frames:49,category:"Ballerina window light"},{id:"big_ben_tower__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Big Ben tower"},{id:"big_ben_tower__logc4",label:"LogC4 (v3)",frames:49,category:"Big Ben tower"},{id:"big_ben_tower__logc3",label:"LogC3 (orig)",frames:49,category:"Big Ben tower"},{id:"cattle_meadow_backlit__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Cattle meadow"},{id:"cattle_meadow_backlit__logc4",label:"LogC4 (v3)",frames:49,category:"Cattle meadow"},{id:"cattle_meadow_backlit__logc3",label:"LogC3 (orig)",frames:49,category:"Cattle meadow"},{id:"city_rooftops_aerial__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"City rooftops aerial"},{id:"city_rooftops_aerial__logc4",label:"LogC4 (v3)",frames:49,category:"City rooftops aerial"},{id:"city_rooftops_aerial__logc3",label:"LogC3 (orig)",frames:49,category:"City rooftops aerial"},{id:"city_roundabout_night__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"City roundabout night"},{id:"city_roundabout_night__logc4",label:"LogC4 (v3)",frames:49,category:"City roundabout night"},{id:"city_roundabout_night__logc3",label:"LogC3 (orig)",frames:49,category:"City roundabout night"},{id:"dancer_blue_studio__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Dancer blue studio"},{id:"dancer_blue_studio__logc4",label:"LogC4 (v3)",frames:49,category:"Dancer blue studio"},{id:"dancer_blue_studio__logc3",label:"LogC3 (orig)",frames:49,category:"Dancer blue studio"},{id:"forest_stream_golden__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Forest stream golden"},{id:"forest_stream_golden__logc4",label:"LogC4 (v3)",frames:49,category:"Forest stream golden"},{id:"forest_stream_golden__logc3",label:"LogC3 (orig)",frames:49,category:"Forest stream golden"},{id:"greek_alley_flowers__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Greek alley flowers"},{id:"greek_alley_flowers__logc4",label:"LogC4 (v3)",frames:49,category:"Greek alley flowers"},{id:"greek_alley_flowers__logc3",label:"LogC3 (orig)",frames:49,category:"Greek alley flowers"},{id:"horse_pasture_silhouette__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Horse pasture"},{id:"horse_pasture_silhouette__logc4",label:"LogC4 (v3)",frames:49,category:"Horse pasture"},{id:"horse_pasture_silhouette__logc3",label:"LogC3 (orig)",frames:49,category:"Horse pasture"},{id:"lakeside_arches_vista__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Lakeside arches"},{id:"lakeside_arches_vista__logc4",label:"LogC4 (v3)",frames:49,category:"Lakeside arches"},{id:"lakeside_arches_vista__logc3",label:"LogC3 (orig)",frames:49,category:"Lakeside arches"},{id:"mountain_road_canyon__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Mountain road canyon"},{id:"mountain_road_canyon__logc4",label:"LogC4 (v3)",frames:49,category:"Mountain road canyon"},{id:"mountain_road_canyon__logc3",label:"LogC3 (orig)",frames:49,category:"Mountain road canyon"},{id:"mountain_sunrise_portrait__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Mountain sunrise"},{id:"mountain_sunrise_portrait__logc4",label:"LogC4 (v3)",frames:49,category:"Mountain sunrise"},{id:"mountain_sunrise_portrait__logc3",label:"LogC3 (orig)",frames:49,category:"Mountain sunrise"},{id:"sunlit_loft_windows__r128prod",label:"ACEScct (Prodigy r128 @10k)",frames:49,category:"Sunlit loft"},{id:"sunlit_loft_windows__logc4",label:"LogC4 (v3)",frames:49,category:"Sunlit loft"},{id:"sunlit_loft_windows__logc3",label:"LogC3 (orig)",frames:49,category:"Sunlit loft"},{id:"benchmark_red__r128prod",label:"ACEScct Prodigy r128 @10k (prev top)",frames:49,category:"Benchmark: benchmark_red"},{id:"benchmark_red__nostraw",label:"ACEScct nostraw @10k (NEW)",frames:49,category:"Benchmark: benchmark_red"},{id:"benchmark_red__hdri",label:"ACEScct HDRI-only @10k",frames:49,category:"Benchmark: benchmark_red"},{id:"benchmark_red__logc3",label:"LogC3 orig",frames:49,category:"Benchmark: benchmark_red"},{id:"vid__r128prod",label:"ACEScct Prodigy r128 @10k (prev top)",frames:49,category:"Benchmark: vid"},{id:"vid__nostraw",label:"ACEScct nostraw @10k (NEW)",frames:49,category:"Benchmark: vid"},{id:"vid__hdri",label:"ACEScct HDRI-only @10k",frames:49,category:"Benchmark: vid"},{id:"vid__logc3",label:"LogC3 orig",frames:49,category:"Benchmark: vid"},{id:"tire_dry__r128prod",label:"ACEScct Prodigy r128 @10k (prev top)",frames:49,category:"Benchmark: tire dry"},{id:"tire_dry__nostraw",label:"ACEScct nostraw @10k (NEW)",frames:49,category:"Benchmark: tire dry"},{id:"tire_dry__hdri",label:"ACEScct HDRI-only @10k",frames:49,category:"Benchmark: tire dry"},{id:"tire_dry__logc3",label:"LogC3 orig",frames:49,category:"Benchmark: tire dry"},{id:"tire_wet__r128prod",label:"ACEScct Prodigy r128 @10k (prev top)",frames:49,category:"Benchmark: tire wet"},{id:"tire_wet__nostraw",label:"ACEScct nostraw @10k (NEW)",frames:49,category:"Benchmark: tire wet"},{id:"tire_wet__hdri",label:"ACEScct HDRI-only @10k",frames:49,category:"Benchmark: tire wet"},{id:"tire_wet__logc3",label:"LogC3 orig",frames:49,category:"Benchmark: tire wet"},{id:"window_loft__t2vprod",label:"sunlit loft (p99.9 217)",frames:49,category:"t2v — text to HDR"},{id:"coastal_goldenhour__t2vprod",label:"coastal golden hour (p99.9 214)",frames:49,category:"t2v — text to HDR"},{id:"cathedral_light__t2vprod",label:"cathedral light-shafts (p99.9 118)",frames:49,category:"t2v — text to HDR"},{id:"mountain_sunrise_t2v__t2vprod",label:"mountain sunrise (p99.9 114)",frames:49,category:"t2v — text to HDR"},{id:"sunset_street__t2vprod",label:"sunset street (p99.9 92)",frames:49,category:"t2v — text to HDR"},{id:"wet_highway_night__t2vprod",label:"wet highway neon (p99.9 62)",frames:49,category:"t2v — text to HDR"},{id:"campfire_night__t2vprod",label:"campfire night (p99.9 59)",frames:49,category:"t2v — text to HDR"},{id:"neon_night__t2vprod",label:"neon night (p99.9 49)",frames:49,category:"t2v — text to HDR"},{id:"spotlit_dancer__t2vprod",label:"spotlit dancer (p99.9 6, dark)",frames:49,category:"t2v — text to HDR"},{id:"i2v_chrome__t2vprod",label:"chrome spheres, 562 src (p99.9 217)",frames:49,category:"i2v — image to HDR"},{id:"i2v_neon__t2vprod",label:"studio neon (p99.9 86)",frames:49,category:"i2v — image to HDR"},{id:"i2v_market__t2vprod",label:"medieval market (p99.9 24)",frames:49,category:"i2v — image to HDR"},{id:"i2v_stilllife__t2vprod",label:"still life, float-fixed (p99.9 18)",frames:49,category:"i2v — image to HDR"},{id:"i2v_vehicles__t2vprod",label:"enchanted vehicles (p99.9 6, dark)",frames:49,category:"i2v — image to HDR"}];let w,T=null,A=0,D=0,m=structuredClone(Se),L=J[0],P=Math.floor(L.frames/2),ie=!1,Xe=!1,x,se,je="histogram",_e=0,le=null,S=!1,N=.5,G=null,xe=null,Y=null,me="frame.exr";const c=r=>document.querySelector(r),W=typeof location<"u"&&new URLSearchParams(location.search).has("embed");let Ce=!1;function Ze(r){!W||window.parent===window||window.parent.postMessage(r,"*")}async function St(){W&&document.body.classList.add("embed-mode"),await bt(),w=new Ct(c("#canvas")),se=c("#scope-canvas").getContext("2d");const r=c("#wheels-container"),t=new ne(r,"Lift",.45,0),e=new ne(r,"Gamma",.5,1),n=new ne(r,"Gain",.3,1),i=new ne(r,"Offset",.2,0);x={lift:t,gamma:e,gain:n,offset:i},t.onUpdate=()=>{m.lift=t.values,C()},e.onUpdate=()=>{m.gamma=e.values,C()},n.onUpdate=()=>{m.gain=n.values,C()},i.onUpdate=()=>{m.offset=i.values,C()},Gt(),zt(),W||Ht(),Wt(),Xt(),$t(),Vt(),Kt(),Yt(c("#canvas")),jt(c("#canvas")),W?(Pt(),c(".loading").textContent="Waiting for image from host…",Ze({type:"gear:ready"})):await ke(L.id,P)}function Pt(){window.addEventListener("message",async r=>{const t=r.data;!t||typeof t!="object"||(t.type==="gear:load_exr"&&t.buffer instanceof ArrayBuffer?await et(new Uint8Array(t.buffer)):t.type==="gear:load_exr_sequence"&&Array.isArray(t.urls)?await Dt(t.urls,t.sdrUrls):t.type==="gear:load_sdr"&&t.buffer instanceof ArrayBuffer?await Qe(new Uint8Array(t.buffer),t.mime||"image/png"):t.type==="gear:set_params"&&t.params?kt(t.params,t.wheels):t.type==="gear:reset"&&at())})}let Je=[],ce=null,de=0,be=0;async function Dt(r,t){if(Je=r,ce=t&&Array.isArray(t)&&t.length?t:null,de=0,!r.length)return;if(r.length===1){await ve(0);return}document.body.classList.add("embed-seq");const e=c("#frame-slider");e.min="0",e.max=String(r.length-1),e.step="1",e.value="0",c("#tl-start").textContent="0",c("#tl-end").textContent=String(r.length-1),c("#frame-num").textContent="0",e.oninput=()=>{de=+e.value,c("#frame-num").textContent=String(de)},e.onchange=()=>{ve(+e.value)},await ve(0)}async function ve(r){const t=Je[r];if(!t)return;const e=++be,n=c(".loading");n.classList.remove("hidden"),n.textContent="Fetching…";try{const i=await fetch(t);if(!i.ok)throw new Error(`HTTP ${i.status}`);const o=new Uint8Array(await i.arrayBuffer());if(e!==be)return;if(de=r,await et(o),me=`frame_${String(r).padStart(5,"0")}.exr`,ce&&ce[r])try{const s=await fetch(ce[r]);if(s.ok&&e===be){const a=new Uint8Array(await s.arrayBuffer());await Qe(a,"image/png")}}catch{}}catch(i){n.textContent=`Error: ${i.message}`}}async function Qe(r,t){const e=new Blob([r.slice().buffer],{type:t}),n=URL.createObjectURL(e);try{const i=new Image;await new Promise((u,d)=>{i.onload=()=>u(),i.onerror=()=>d(new Error("SDR image decode failed")),i.src=n}),w.uploadSDR(i);const o=A/i.naturalWidth,s=D/i.naturalHeight,a=(1-o)/2,l=(1-s)/2;w.sdrCrop=[o,s,a,l],requestAnimationFrame(()=>C())}finally{URL.revokeObjectURL(n)}}async function et(r){const t=c(".loading");t.classList.remove("hidden"),t.textContent="Decoding…",await new Promise(e=>setTimeout(e,0));try{const e=performance.now(),n=Ae(r),i=(performance.now()-e).toFixed(0);Y=r,me="frame.exr",T=n.interleavedRgbPixels,A=n.width,D=n.height,w.uploadImage(T,A,D),ge(c("#canvas")),requestAnimationFrame(()=>C()),c("#info-res").textContent=`${A}×${D}`,rt(r,T,A,D),c("#info-decode").textContent=`${i} ms`,t.classList.add("hidden")}catch(e){t.textContent=`Error: ${e.message}`}}function kt(r,t){Ce=!0;try{r.exposure!=null&&(m.exposure=r.exposure,c("#sl-exposure").value=String(r.exposure),c("#tb-ev").value=r.exposure.toFixed(2),c("#ev-reset").classList.toggle("show",Math.abs(r.exposure)>.001)),r.toneMapping!=null&&(m.toneMapping=r.toneMapping,c("#tm-select").value=String(r.toneMapping));const e=[["softClip","#sl-softclip"],["contrast","#sl-contrast"],["pivot","#sl-pivot"],["shadows","#sl-shadows"],["highlights","#sl-highlights"],["temperature","#sl-temperature"],["tint","#sl-tint"],["saturation","#sl-saturation"],["vibrance","#sl-vibrance"],["hueShift","#sl-hueshift"]];for(const[n,i]of e){const o=r[n];o!=null&&(m[n]=o,U(i,o))}t?.lift?x.lift.setState(t.lift):r.lift&&x.lift.setValues([...r.lift]),t?.gamma?x.gamma.setState(t.gamma):r.gamma&&x.gamma.setValues([...r.gamma]),t?.gain?x.gain.setState(t.gain):r.gain&&x.gain.setValues([...r.gain]),t?.offset?x.offset.setState(t.offset):r.offset&&x.offset.setValues([...r.offset]),m.lift=x.lift.values,m.gamma=x.gamma.values,m.gain=x.gain.values,m.offset=x.offset.values,r.falseColor!=null&&(m.falseColor=!!r.falseColor,c("#fc-check").checked=m.falseColor,c(".fc-legend").classList.toggle("show",m.falseColor)),requestAnimationFrame(()=>C())}finally{Ce=!1}}function Bt(r){const t=new DataView(r.buffer,r.byteOffset,r.byteLength);if(r.length<8||t.getUint32(0,!0)!==20000630)return null;let e=8;const n=i=>{let o="";for(;e<i&&r[e]!==0;)o+=String.fromCharCode(r[e++]);return e++,o};for(;e<r.length;){const i=n(r.length);if(!i)break;const o=n(r.length),s=t.getInt32(e,!0);e+=4;const a=e+s;if(i==="channels"&&o==="chlist"){let l=-1,u=0;for(;e<a;){let y="";for(;e<a&&r[e]!==0;)y+=String.fromCharCode(r[e++]);if(e++,!y)break;l=Math.max(l,t.getInt32(e,!0)),e+=4,e+=12,u++}if(l<0)return null;const d=l===1?16:32;return{label:l===1?"16-bit half":l===2?"32-bit float":"32-bit uint",detail:`${d}-bit ${l===1?"half-float":l===2?"float":"uint"} per channel · ${u}×${d} = ${u*d} bpp`}}e=a}return null}const Pe=new Float32Array(1),tt=new Int32Array(Pe.buffer);function ye(r){Pe[0]=r;const t=tt[0],e=t>>>16&32768;let n=t>>>23&255,i=t&8388607;return n===255?e|31744|(i?512:0):(n=n-127+15,n>=31?e|31744:n<=0?n<-10?e:(i=(i|8388608)>>1-n,e|i>>13):e|n<<10|i>>13)}function Ut(r,t){if(!r||t<=0)return null;const e=Math.max(1,Math.floor(t/4e6)),n=[new Uint8Array(65536),new Uint8Array(65536),new Uint8Array(65536)],i=256,o=-12,s=12,a=s-o,l=i/a,u=new Uint32Array(i);let d=0;for(let E=0;E<t;E+=e){const R=E*3,F=r[R],Q=r[R+1],$=r[R+2];n[0][ye(F)]=1,n[1][ye(Q)]=1,n[2][ye($)]=1;const Me=.2126*F+.7152*Q+.0722*$;if(Me>0){Pe[0]=Me;const Fe=tt[0];let V=((Fe>>>23&255)-127+(Fe&8388607)/8388608-o)*l|0;V<0?V=0:V>=i&&(V=i-1),u[V]++,d++}}const f=E=>{let R=0;for(let F=0;F<65536;F++)R+=E[F];return R},y=[f(n[0]),f(n[1]),f(n[2])].sort((E,R)=>E-R)[1],b=Math.log2(Math.max(y,1));let g=0;const _=d*.999;let h=i-1;for(let E=0;E<i;E++)if(g+=u[E],g>=_){h=E;break}const k=Math.max(0,o+(h+.5)/i*a);return{effBits:b,bitsGained:b-8,stops:k,distinct:y}}let we=0;function rt(r,t,e,n){const i=Bt(r),o=c("#info-depth");if(!i){o.textContent="",o.title="";return}o.textContent=i.label,o.title=i.detail;const s=++we;setTimeout(()=>{if(s!==we)return;const a=Ut(t,e*n);s!==we||!a||(o.textContent=`${i.label} · ~${Math.round(a.effBits)}-bit effective`,o.title=`Container: ${i.detail}
Measured (live): 8-bit SDR in → ~${a.effBits.toFixed(1)}-bit out
+${a.bitsGained.toFixed(1)} bits tonal detail vs 8-bit · +${a.stops.toFixed(1)} stops over SDR white
${a.distinct.toLocaleString()} distinct levels/channel`)},50)}const De="/clips".replace(/\/$/,"");function nt(r,t){return`${De}/${r}/hdr_exr/frame_${String(t).padStart(5,"0")}.exr`}function Mt(r,t){return`${De}/${r}/sdr_png/frame_${String(t).padStart(5,"0")}.png`}async function ke(r,t){if(ie)return;ie=!0;const e=c(".loading");e.classList.remove("hidden"),e.textContent="Loading EXR…";try{const n=await fetch(nt(r,t));if(!n.ok)throw new Error(`HTTP ${n.status}`);const i=new Uint8Array(await n.arrayBuffer());e.textContent="Decoding…",await new Promise(l=>setTimeout(l,0));const o=performance.now(),s=Ae(i),a=(performance.now()-o).toFixed(0);Y=i,me=`${r}_f${String(t).padStart(5,"0")}.exr`,T=s.interleavedRgbPixels,A=s.width,D=s.height,w.ap1A=Ye(r),w.uploadImage(T,A,D),Xe||(ge(c("#canvas")),Xe=!0),C(),c("#info-res").textContent=`${A}×${D}`,rt(i,T,A,D),c("#info-decode").textContent=`${a} ms`,Be(r,t)}catch(n){e.textContent=`Error: ${n.message}`,ie=!1;return}e.classList.add("hidden"),ie=!1}function Ft(r){const t=r.split(/\r?\n/);let e=0;const n=[];for(const i of t){const o=i.trim();if(!o||o.startsWith("#")||o.startsWith("TITLE")||o.startsWith("DOMAIN"))continue;if(o.startsWith("LUT_3D_SIZE")){e=parseInt(o.split(/\s+/)[1],10);continue}if(o.startsWith("LUT_1D_SIZE"))return null;const s=o.split(/\s+/);if(s.length>=3){const a=parseFloat(s[0]),l=parseFloat(s[1]),u=parseFloat(s[2]);isNaN(a)||n.push(a,l,u)}}return e<2||n.length!==e*e*e*3?null:{size:e,data:new Float32Array(n)}}async function It(r,t){try{const e=await fetch(nt(r,t));if(!e.ok){w.compareHDR=!1;return}const n=Ae(new Uint8Array(await e.arrayBuffer()));w.ap1B=Ye(r),w.uploadHDRB(n.interleavedRgbPixels,n.width,n.height),w.compareHDR=!0,C()}catch{w.compareHDR=!1}}function Be(r,t){S&&(G?It(G,t):(w.compareHDR=!1,w.ap1B=!1,Ot(r,t)))}function Ot(r,t){const e=new Image;e.crossOrigin="anonymous",e.onload=()=>{w.uploadSDR(e);const n=A/e.naturalWidth,i=D/e.naturalHeight,o=(1-n)/2,s=(1-i)/2;w.sdrCrop=[n,i,o,s],C()},e.src=Mt(r,t)}function Nt(){return{lift:x.lift.getState(),gamma:x.gamma.getState(),gain:x.gain.getState(),offset:x.offset.getState()}}function C(){T&&(w.render(m),W&&!Ce&&Ze({type:"gear:params_changed",params:structuredClone(m),wheels:Nt()}),!_e&&(_e=requestAnimationFrame(()=>{_e=0,T&&(le=w.readHistogramPixels(m),w.render(m),it())})))}function it(){if(!le)return;const r=se.canvas;if(je==="parade")Lt(se,le,320,180,r.width,r.height);else{const[t,e,n]=Rt(le);Tt(se,t,e,n,r.width,r.height)}}function Gt(){if(!W){let l=function(){f.src=g(L.id),p.textContent=L.label},u=function(h){L=J[h],ot();const k=c("#frame-slider");k.max=String(L.frames-1),c("#tl-end").textContent=String(L.frames-1),P=Math.min(P,L.frames-1),k.value=String(P),c("#frame-num").textContent=String(P),l(),b.querySelectorAll(".clip-item").forEach((E,R)=>{E.classList.toggle("active",R===h)}),y.classList.remove("open"),ke(L.id,P)};const d=c("#clip-trigger"),f=c("#clip-trigger-thumb"),p=c("#clip-trigger-name"),y=c("#clip-popup"),b=c("#clip-grid"),g=h=>`${De}/${h}/thumbnail.jpg`;let _=null;J.forEach((h,k)=>{if(h.category!==_){const R=document.createElement("div");R.className="clip-category",R.textContent=h.category,b.appendChild(R),_=h.category}const E=document.createElement("div");E.className="clip-item"+(k===0?" active":""),E.innerHTML=`<img class="clip-item-thumb" src="${g(h.id)}" loading="lazy" alt=""/><div class="clip-item-name">${h.label}</div>`,E.addEventListener("click",()=>u(k)),b.appendChild(E)}),l(),d.addEventListener("click",h=>{h.stopPropagation(),y.classList.toggle("open")}),document.addEventListener("click",h=>{!y.contains(h.target)&&h.target!==d&&y.classList.remove("open")}),window.addEventListener("keydown",h=>{h.key==="Escape"&&y.classList.remove("open")})}const r=c("#sl-exposure"),t=c("#tb-ev"),e=c("#ev-reset");function n(l){l=Math.max(-7,Math.min(7,l)),m.exposure=l,r.value=String(l),t.value=l.toFixed(2),e.classList.toggle("show",Math.abs(l)>.001),C()}r.addEventListener("input",()=>n(+r.value)),t.addEventListener("change",()=>n(parseFloat(t.value)||0)),t.addEventListener("keydown",l=>{l.key==="Enter"&&t.blur()}),e.addEventListener("click",()=>n(0));const i=c("#tm-select");i.value=String(m.toneMapping),i.addEventListener("change",()=>{m.toneMapping=+i.value,C()});const o=c("#btn-lut"),s=c("#lut-file"),a=c("#lut-name");o.addEventListener("click",()=>{w.lutEnabled?(w.clearLUT(),o.classList.remove("active"),a.textContent="",C()):s.click()}),s.addEventListener("change",()=>{const l=s.files?.[0];if(!l)return;const u=new FileReader;u.onload=()=>{const d=Ft(u.result);if(!d){alert("Could not parse .cube file (only 3D LUTs supported)");return}w.uploadLUT(d.data,d.size),o.classList.add("active"),a.textContent=l.name.replace(".cube",""),C()},u.readAsText(l),s.value=""})}function Ht(){const r=c("#frame-slider");r.max=String(L.frames-1),r.value=String(P),c("#frame-num").textContent=String(P),c("#tl-end").textContent=String(L.frames-1),r.addEventListener("input",()=>{P=+r.value,c("#frame-num").textContent=String(P)}),r.addEventListener("change",()=>{P=+r.value,ke(L.id,P)})}function Wt(){M("#sl-softclip","softClip",r=>r.toFixed(2)),M("#sl-contrast","contrast",r=>r.toFixed(2)),M("#sl-pivot","pivot",r=>r.toFixed(2)),M("#sl-shadows","shadows",r=>r.toFixed(2)),M("#sl-highlights","highlights",r=>r.toFixed(2)),M("#sl-temperature","temperature",r=>r.toFixed(2)),M("#sl-tint","tint",r=>r.toFixed(2)),M("#sl-saturation","saturation",r=>r.toFixed(2)),M("#sl-vibrance","vibrance",r=>r.toFixed(2)),M("#sl-hueshift","hueShift",r=>`${r.toFixed(0)}°`),c("#fc-check").addEventListener("change",r=>{m.falseColor=r.target.checked,c(".fc-legend").classList.toggle("show",m.falseColor),C()}),c("#btn-reset").addEventListener("click",at)}function Xt(){document.querySelectorAll(".scope-tab").forEach(r=>{r.addEventListener("click",()=>{document.querySelectorAll(".scope-tab").forEach(t=>t.classList.remove("active")),r.classList.add("active"),je=r.dataset.mode,it()})})}function $t(){const r=c("#panel-wrap"),t=c("#btn-panel");function e(){r.classList.toggle("hidden"),t.classList.toggle("active",!r.classList.contains("hidden"))}t.addEventListener("click",e),window.addEventListener("keydown",n=>{n.key==="Tab"&&!n.ctrlKey&&!n.altKey&&document.activeElement?.tagName!=="INPUT"&&(n.preventDefault(),e())}),t.classList.add("active")}function Vt(){const r=c("#panel-wrap"),t=c("#panel-resize");let e=!1;t.addEventListener("pointerdown",n=>{e=!0,t.setPointerCapture(n.pointerId),document.body.style.cursor="col-resize",document.body.style.userSelect="none"}),window.addEventListener("pointermove",n=>{e&&(r.style.width=Math.max(260,Math.min(600,document.documentElement.clientWidth-n.clientX))+"px")}),window.addEventListener("pointerup",()=>{e&&(e=!1,document.body.style.cursor="",document.body.style.userSelect="")})}function qt(){const r=c("#btn-compare"),t=document.createElement("select");t.id="compare-src",t.title="A|B: what to compare against (shown on the right of the wipe)",t.style.cssText="margin-left:4px;max-width:210px;font-size:11px;vertical-align:middle;",r.insertAdjacentElement("afterend",t),t.addEventListener("change",()=>{G=t.value==="__sdr"?null:t.value,xe=G?G.split("__")[1]??null:null,Ue(),Be(L.id,P),C()}),ot()}function Re(r){return r.includes("—")?r.split("—").pop().trim():r}function Ue(){const r=document.querySelector("#wipe-label-l"),t=document.querySelector("#wipe-label-r");r&&(r.textContent=Re(L.label)),t&&(t.textContent=G?Re(J.find(e=>e.id===G)?.label??"B"):"SDR")}function $e(){if(!Y)return;const r=new ArrayBuffer(Y.byteLength);new Uint8Array(r).set(Y);const t=new Blob([r],{type:"image/x-exr"}),e=URL.createObjectURL(t),n=document.createElement("a");n.href=e,n.download=me,document.body.appendChild(n),n.click(),n.remove(),setTimeout(()=>URL.revokeObjectURL(e),2e3)}function zt(){const r=document.querySelector("#btn-download");r&&r.addEventListener("click",$e),window.addEventListener("keydown",t=>{const e=document.activeElement?.tagName;e==="INPUT"||e==="SELECT"||t.key==="d"&&!t.ctrlKey&&!t.metaKey&&(t.preventDefault(),$e())})}function ot(){const r=document.querySelector("#compare-src");if(!r)return;const t=L.id.split("__")[0],e=J.filter(i=>(i.id===t||i.id.startsWith(t+"__"))&&i.id!==L.id);r.innerHTML='<option value="__sdr">vs SDR</option>'+e.map(i=>`<option value="${i.id}">vs ${Re(i.label)}</option>`).join("");let n="__sdr";if(xe){const i=`${t}__${xe}`;i!==L.id&&e.some(o=>o.id===i)&&(n=i)}r.value=n,G=n==="__sdr"?null:n,Ue()}function Kt(){const r=c("#btn-compare"),t=c("#wipe-line"),e=c("#wipe-label-l"),n=c("#wipe-label-r"),i=c("#canvas");function o(){S=!S,w.compareOn=S,r.classList.toggle("active",S),t.classList.toggle("active",S),e.classList.toggle("active",S),n.classList.toggle("active",S),S?(Ue(),Be(L.id,P)):w.compareHDR=!1,C(),ue()}qt(),r.addEventListener("click",o),window.addEventListener("keydown",a=>{a.key==="c"&&!a.ctrlKey&&document.activeElement?.tagName!=="INPUT"&&o()});let s=!1;t.addEventListener("pointerdown",a=>{s=!0,t.setPointerCapture(a.pointerId)}),i.addEventListener("pointerdown",a=>{if(!S||a.ctrlKey)return;s=!0;const l=i.getBoundingClientRect();N=Math.max(.02,Math.min(.98,(a.clientX-l.left)/l.width)),w.wipePos=N,C(),ue()}),window.addEventListener("pointermove",a=>{if(!s||!S)return;const l=i.getBoundingClientRect();N=Math.max(.02,Math.min(.98,(a.clientX-l.left)/l.width)),w.wipePos=N,C(),ue()}),window.addEventListener("pointerup",()=>{s=!1})}function ue(){const r=c("#wipe-line"),t=c("#wipe-label-l"),e=c("#wipe-label-r"),n=c("#canvas"),i=n.getBoundingClientRect(),s=n.closest(".viewport").getBoundingClientRect(),a=i.left-s.left+i.width*N;r.style.left=a+"px",t.style.left=i.left-s.left+i.width*N*.5+"px",e.style.left=i.left-s.left+i.width*(N+(1-N)*.5)+"px"}let fe=1,j=0,Z=0;function Te(r){r.style.transformOrigin="50% 50%",r.style.transform=`translate(${j}px, ${Z}px) scale(${fe})`,S&&ue()}function ge(r){fe=1,j=0,Z=0,Te(r)}function Yt(r){let t=!1,e=0,n=0,i=0,o=0;r.addEventListener("wheel",a=>{if(!T)return;a.preventDefault();const l=r.getBoundingClientRect(),u=(a.clientX-l.left)/l.width,d=(a.clientY-l.top)/l.height,f=fe,p=Math.exp(-a.deltaY*.0015),y=Math.max(.1,Math.min(64,f*p));if(y===f)return;const b=l.width*(y/f),g=l.height*(y/f),_=l.left+l.width/2-b/2,h=l.top+l.height/2-g/2;j+=a.clientX-u*b-_,Z+=a.clientY-d*g-h,fe=y,Te(r)},{passive:!1}),r.addEventListener("pointerdown",a=>{T&&(a.ctrlKey||a.button===0&&S||a.button!==0&&a.button!==1||(a.preventDefault(),t=!0,r.setPointerCapture(a.pointerId),e=a.clientX,n=a.clientY,i=j,o=Z,r.style.cursor="grabbing"))}),r.addEventListener("pointermove",a=>{t&&(j=i+(a.clientX-e),Z=o+(a.clientY-n),Te(r))});const s=()=>{t&&(t=!1,r.style.cursor="")};r.addEventListener("pointerup",s),r.addEventListener("pointercancel",s),r.addEventListener("dblclick",a=>{S||a.ctrlKey||ge(r)}),window.addEventListener("keydown",a=>{const l=document.activeElement?.tagName;l==="INPUT"||l==="SELECT"||(a.key==="0"||a.key==="f"||a.key==="F")&&ge(r)})}function jt(r){r.addEventListener("mousemove",i=>{if(!T)return;const o=r.getBoundingClientRect(),s=Math.floor((i.clientX-o.left)*A/o.width),a=Math.floor((i.clientY-o.top)*D/o.height);if(s<0||a<0||s>=A||a>=D)return;const l=(a*A+s)*3,u=T[l],d=T[l+1],f=T[l+2];c("#px-coord").textContent=`(${s}, ${a})`,c("#px-rgb").textContent=`R:${O(u)} G:${O(d)} B:${O(f)}`;const p=.2126*u+.7152*d+.0722*f;c("#px-lum").textContent=`L:${O(p)}`,c("#px-swatch").style.background=`rgb(${Ee(u)*255|0},${Ee(d)*255|0},${Ee(f)*255|0})`}),r.addEventListener("mouseleave",()=>{c("#px-coord").textContent="",c("#px-rgb").textContent="",c("#px-lum").textContent=""});const t=c("#probe"),e=t.querySelector(".probe-label"),n=r.closest(".viewport");r.addEventListener("click",i=>{if(!i.ctrlKey||!T){t.classList.remove("show");return}const o=r.getBoundingClientRect(),s=Math.floor((i.clientX-o.left)*A/o.width),a=Math.floor((i.clientY-o.top)*D/o.height);if(s<0||a<0||s>=A||a>=D)return;const l=(a*A+s)*3,u=T[l],d=T[l+1],f=T[l+2],p=.2126*u+.7152*d+.0722*f,y=p>1e-6?Math.log2(p/.18):-1/0,b=y>-20?`${y>=0?"+":""}${y.toFixed(1)} EV`:"−∞ EV",g=n.getBoundingClientRect(),_=i.clientX-g.left,h=i.clientY-g.top;t.style.left=_+"px",t.style.top=h+"px",_>g.width*.65?(e.style.left="auto",e.style.right="14px"):(e.style.left="14px",e.style.right="auto"),e.innerHTML=`<span style="color:var(--dim)">(${s}, ${a})</span><span class="pr">R: ${O(u)}</span><span class="pg">G: ${O(d)}</span><span class="pb">B: ${O(f)}</span><span class="pl">L: ${O(p)}</span><span class="pev">${b}</span>`,t.classList.add("show")}),window.addEventListener("keydown",i=>{i.key==="Escape"&&t.classList.remove("show")})}function M(r,t,e){const n=c(r),i=n.closest(".slider-row").querySelector(".label-row"),o=i.querySelector(".val"),s=Se[t],a=document.createElement("input");a.type="number",a.className="val-input",a.step=n.step,a.min=n.min,a.max=n.max,o.replaceWith(a);const l=document.createElement("button");l.className="sl-reset",l.innerHTML="&#x21ba;",l.title=`Reset to ${e(s)}`,i.insertBefore(l,a);function u(d){m[t]=d,n.value=String(d),a.value=e(d).replace("°",""),l.classList.toggle("show",Math.abs(d-s)>.001),C()}u(m[t]),n.addEventListener("input",()=>u(+n.value)),a.addEventListener("change",()=>{let d=parseFloat(a.value);isNaN(d)&&(d=s),u(Math.max(+n.min,Math.min(+n.max,d)))}),a.addEventListener("keydown",d=>{d.key==="Enter"&&a.blur()}),l.addEventListener("click",()=>u(s))}function U(r,t){c(r).value=String(t),c(r).dispatchEvent(new Event("input"))}function at(){m=structuredClone(Se),c("#sl-exposure").value="0",c("#tb-ev").value="0.00",c("#ev-reset").classList.remove("show"),c("#tm-select").value=String(m.toneMapping),U("#sl-softclip",m.softClip),U("#sl-contrast",m.contrast),U("#sl-pivot",m.pivot),U("#sl-shadows",m.shadows),U("#sl-highlights",m.highlights),U("#sl-temperature",m.temperature),U("#sl-tint",m.tint),U("#sl-saturation",m.saturation),U("#sl-vibrance",m.vibrance),U("#sl-hueshift",m.hueShift),x.lift.reset(),x.gamma.reset(),x.gain.reset(),x.offset.reset(),c("#fc-check").checked=!1,c(".fc-legend").classList.remove("show"),C()}function O(r){return Math.abs(r)>=10?r.toFixed(2):r.toFixed(4)}function Ee(r){return Math.max(0,Math.min(1,r))}St().catch(console.error);
