(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const a of s.addedNodes)a.tagName==="LINK"&&a.rel==="modulepreload"&&i(a)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const ke="modulepreload",Oe=function(n,t){return new URL(n,t).href},ve={},ne=function(t,e,i){let r=Promise.resolve();if(e&&e.length>0){let a=function(u){return Promise.all(u.map(g=>Promise.resolve(g).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};const o=document.getElementsByTagName("link"),c=document.querySelector("meta[property=csp-nonce]"),d=c?.nonce||c?.getAttribute("nonce");r=a(e.map(u=>{if(u=Oe(u,i),u in ve)return;ve[u]=!0;const g=u.endsWith(".css"),p=g?'[rel="stylesheet"]':"";if(!!i)for(let m=o.length-1;m>=0;m--){const f=o[m];if(f.href===u&&(!g||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${p}`))return;const b=document.createElement("link");if(b.rel=g?"stylesheet":ke,g||(b.as="script"),b.crossOrigin="",b.href=u,d&&b.setAttribute("nonce",d),document.head.appendChild(b),g)return new Promise((m,f)=>{b.addEventListener("load",m),b.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(a){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=a,window.dispatchEvent(o),!o.defaultPrevented)throw a}return r.then(a=>{for(const o of a||[])o.status==="rejected"&&s(o.reason);return t().catch(s)})};let v;const ye=typeof TextDecoder<"u"?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof TextDecoder<"u"&&ye.decode();let W=null;function H(){return(W===null||W.byteLength===0)&&(W=new Uint8Array(v.memory.buffer)),W}function ie(n,t){return n=n>>>0,ye.decode(H().subarray(n,n+t))}let N=0;const j=typeof TextEncoder<"u"?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},Ge=typeof j.encodeInto=="function"?function(n,t){return j.encodeInto(n,t)}:function(n,t){const e=j.encode(n);return t.set(e),{read:n.length,written:e.length}};function be(n,t,e){if(e===void 0){const o=j.encode(n),c=t(o.length,1)>>>0;return H().subarray(c,c+o.length).set(o),N=o.length,c}let i=n.length,r=t(i,1)>>>0;const s=H();let a=0;for(;a<i;a++){const o=n.charCodeAt(a);if(o>127)break;s[r+a]=o}if(a!==i){a!==0&&(n=n.slice(a)),r=e(r,i,i=a+n.length*3,1)>>>0;const o=H().subarray(r+a,r+i),c=Ge(n,o);a+=c.written,r=e(r,i,a,1)>>>0}return N=a,r}let k=null;function V(){return(k===null||k.buffer.detached===!0||k.buffer.detached===void 0&&k.buffer!==v.memory.buffer)&&(k=new DataView(v.memory.buffer)),k}function Ne(n){return n==null}let X=null;function We(){return(X===null||X.byteLength===0)&&(X=new Float32Array(v.memory.buffer)),X}function Xe(n,t){return n=n>>>0,We().subarray(n/4,n/4+t)}function He(n){const t=v.__wbindgen_export_3.get(n);return v.__externref_table_dealloc(n),t}function Ve(n,t){const e=t(n.length*1,1)>>>0;return H().set(n,e/1),N=n.length,e}function $e(n){const t=Ve(n,v.__wbindgen_malloc),e=N,i=v.readExrRgb(t,e);if(i[2])throw He(i[1]);return fe.__wrap(i[0])}typeof FinalizationRegistry>"u"||new FinalizationRegistry(n=>v.__wbg_exrdecoder_free(n>>>0,1));typeof FinalizationRegistry>"u"||new FinalizationRegistry(n=>v.__wbg_exrencoder_free(n>>>0,1));const we=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(n=>v.__wbg_exrsimpleimage_free(n>>>0,1));class fe{static __wrap(t){t=t>>>0;const e=Object.create(fe.prototype);return e.__wbg_ptr=t,we.register(e,e.__wbg_ptr,e),e}__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,we.unregister(this),t}free(){const t=this.__destroy_into_raw();v.__wbg_exrsimpleimage_free(t,0)}get data(){const t=v.exrsimpleimage_data(this.__wbg_ptr);var e=Xe(t[0],t[1]).slice();return v.__wbindgen_free(t[0],t[1]*4,4),e}get width(){return v.exrsimpleimage_width(this.__wbg_ptr)>>>0}get height(){return v.exrsimpleimage_height(this.__wbg_ptr)>>>0}}async function qe(n,t){if(typeof Response=="function"&&n instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(n,t)}catch(i){if(n.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",i);else throw i}const e=await n.arrayBuffer();return await WebAssembly.instantiate(e,t)}else{const e=await WebAssembly.instantiate(n,t);return e instanceof WebAssembly.Instance?{instance:e,module:n}:e}}function Re(){const n={};return n.wbg={},n.wbg.__wbg_error_7534b8e9a36f1ab4=function(t,e){let i,r;try{i=t,r=e,console.error(ie(t,e))}finally{v.__wbindgen_free(i,r,1)}},n.wbg.__wbg_new_8a6f238a6ece86ea=function(){return new Error},n.wbg.__wbg_stack_0ed75d68575b0f3c=function(t,e){const i=e.stack,r=be(i,v.__wbindgen_malloc,v.__wbindgen_realloc),s=N;V().setInt32(t+4,s,!0),V().setInt32(t+0,r,!0)},n.wbg.__wbindgen_init_externref_table=function(){const t=v.__wbindgen_export_3,e=t.grow(4);t.set(0,void 0),t.set(e+0,void 0),t.set(e+1,null),t.set(e+2,!0),t.set(e+3,!1)},n.wbg.__wbindgen_string_get=function(t,e){const i=e,r=typeof i=="string"?i:void 0;var s=Ne(r)?0:be(r,v.__wbindgen_malloc,v.__wbindgen_realloc),a=N;V().setInt32(t+4,a,!0),V().setInt32(t+0,s,!0)},n.wbg.__wbindgen_string_new=function(t,e){return ie(t,e)},n.wbg.__wbindgen_throw=function(t,e){throw new Error(ie(t,e))},n}function Te(n,t){return v=n.exports,Le.__wbindgen_wasm_module=t,k=null,X=null,W=null,v.__wbindgen_start(),v}function ze(n){if(v!==void 0)return v;typeof n<"u"&&(Object.getPrototypeOf(n)===Object.prototype?{module:n}=n:console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));const t=Re();n instanceof WebAssembly.Module||(n=new WebAssembly.Module(n));const e=new WebAssembly.Instance(n,t);return Te(e,n)}async function Le(n){if(v!==void 0)return v;typeof n<"u"&&(Object.getPrototypeOf(n)===Object.prototype?{module_or_path:n}=n:console.warn("using deprecated parameters for the initialization function; pass a single object instead")),typeof n>"u"&&(n=new URL(""+new URL("exrs_raw_wasm_bindgen_bg-DvcqSi-p.wasm",import.meta.url).href,import.meta.url));const t=Re();(typeof n=="string"||typeof Request=="function"&&n instanceof Request||typeof URL=="function"&&n instanceof URL)&&(n=fetch(n));const{instance:e,module:i}=await qe(await n,t);return Te(e,i)}let Y=!1;async function Ke(){if(!Y)try{await Le(),Y=!0}catch(n){try{const t=await ne(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),e=await ne(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),{createRequire:i}=await ne(async()=>{const{createRequire:c}=await import("./__vite-browser-external-BIHI7g3E.js");return{createRequire:c}},[],import.meta.url),r=i(import.meta.url),s=e.dirname(r.resolve("exrs-raw-wasm-bindgen/package.json")),a=e.resolve(s,"exrs_raw_wasm_bindgen_bg.wasm"),o=t.readFileSync(a);ze({module:o}),Y=!0}catch{throw console.error("Failed to initialize EXRS WASM in both browser and Node environments"),n}}}function je(){if(!Y)throw new Error("EXRS WASM module not initialized. Call init() first.")}function Se(n){je();const t=$e(n);try{return{width:t.width,height:t.height,interleavedRgbPixels:t.data}}finally{t.free()}}const de={exposure:0,toneMapping:2,softClip:0,temperature:0,tint:0,lift:[0,0,0],gamma:[1,1,1],gain:[1,1,1],offset:[0,0,0],contrast:1,pivot:.18,shadows:0,highlights:0,saturation:1,vibrance:0,hueShift:0,falseColor:!1},Ye=`#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,Je=`#version 300 es
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

  // Select source: SDR (left of wipe) or HDR (right)
  vec3 c;
  if(uCompareOn && vUv.x < uWipePos){
    // Remap UVs to sample the center crop of the larger SDR texture
    vec2 sdrUv = vUv * uSDRCrop.xy + uSDRCrop.zw;
    c = sRGBToLinear(texture(uTexSDR, sdrUv).rgb);
  } else {
    c = texture(uTex, vUv).rgb;
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
}`;function Ee(n,t,e){const i=n.createShader(t);if(n.shaderSource(i,e),n.compileShader(i),!n.getShaderParameter(i,n.COMPILE_STATUS))throw new Error(`Shader compile:
`+n.getShaderInfoLog(i));return i}function Ze(n,t,e){const i=n.createProgram();if(n.attachShader(i,t),n.attachShader(i,e),n.linkProgram(i),!n.getProgramParameter(i,n.LINK_STATUS))throw new Error(`Program link:
`+n.getProgramInfoLog(i));return i}const Qe=["uTex","uTexSDR","uExposure","uToneMap","uSoftClip","uTemperature","uTint","uLift","uGamma","uGain","uOffset","uContrast","uPivot","uShadows","uHighlights","uSaturation","uVibrance","uHueShift","uFalseColor","uCompareOn","uWipePos","uSDRCrop","uLUT3D","uLUTEnabled","uLUTSize"],$=320,q=180;class et{constructor(t){this.canvas=t,this.imageWidth=0,this.imageHeight=0,this.compareOn=!1,this.wipePos=.5,this.sdrCrop=[1,1,0,0],this.lutEnabled=!1,this.lutSize=33;const e=t.getContext("webgl2",{antialias:!1,premultipliedAlpha:!1});if(!e)throw new Error("WebGL2 not supported");this.gl=e;const i=Ee(e,e.VERTEX_SHADER,Ye),r=Ee(e,e.FRAGMENT_SHADER,Je);this.prog=Ze(e,i,r),this.u={};for(const a of Qe)this.u[a]=e.getUniformLocation(this.prog,a);this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);const s=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.tex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.tex),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.texSDR=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.lutTex=e.createTexture(),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),this.histFBO=e.createFramebuffer(),this.histRBO=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this.histRBO),e.renderbufferStorage(e.RENDERBUFFER,e.RGBA8,$,q),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,this.histRBO),e.bindFramebuffer(e.FRAMEBUFFER,null)}uploadImage(t,e,i){this.imageWidth=e,this.imageHeight=i;const r=e*i,s=new Float32Array(r*4);for(let o=0;o<r;o++)s[o*4]=t[o*3],s[o*4+1]=t[o*3+1],s[o*4+2]=t[o*3+2],s[o*4+3]=1;const a=this.gl;a.bindTexture(a.TEXTURE_2D,this.tex),a.texImage2D(a.TEXTURE_2D,0,a.RGBA16F,e,i,0,a.RGBA,a.FLOAT,s),this.canvas.width=e,this.canvas.height=i}uploadLUT(t,e){const i=this.gl;this.lutSize=e;const r=new Float32Array(e*e*e*4);for(let s=0;s<e*e*e;s++)r[s*4]=t[s*3],r[s*4+1]=t[s*3+1],r[s*4+2]=t[s*3+2],r[s*4+3]=1;i.bindTexture(i.TEXTURE_3D,this.lutTex),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.texImage3D(i.TEXTURE_3D,0,i.RGBA16F,e,e,e,0,i.RGBA,i.FLOAT,r),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0),this.lutEnabled=!0}clearLUT(){this.lutEnabled=!1}uploadSDR(t){const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texSDR),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,t),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL)}setUniforms(t){const e=this.gl;e.useProgram(this.prog),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.tex),e.uniform1i(this.u.uTex,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.uniform1i(this.u.uTexSDR,1),e.uniform1i(this.u.uCompareOn,this.compareOn?1:0),e.uniform1f(this.u.uWipePos,this.wipePos),e.uniform4f(this.u.uSDRCrop,this.sdrCrop[0],this.sdrCrop[1],this.sdrCrop[2],this.sdrCrop[3]),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.uniform1i(this.u.uLUT3D,2),e.uniform1i(this.u.uLUTEnabled,this.lutEnabled?1:0),e.uniform1f(this.u.uLUTSize,this.lutSize),e.uniform1f(this.u.uExposure,t.exposure),e.uniform1i(this.u.uToneMap,t.toneMapping),e.uniform1f(this.u.uSoftClip,t.softClip),e.uniform1f(this.u.uTemperature,t.temperature),e.uniform1f(this.u.uTint,t.tint),e.uniform3f(this.u.uLift,t.lift[0],t.lift[1],t.lift[2]),e.uniform3f(this.u.uGamma,t.gamma[0],t.gamma[1],t.gamma[2]),e.uniform3f(this.u.uGain,t.gain[0],t.gain[1],t.gain[2]),e.uniform3f(this.u.uOffset,t.offset[0],t.offset[1],t.offset[2]),e.uniform1f(this.u.uContrast,t.contrast),e.uniform1f(this.u.uPivot,t.pivot),e.uniform1f(this.u.uShadows,t.shadows),e.uniform1f(this.u.uHighlights,t.highlights),e.uniform1f(this.u.uSaturation,t.saturation),e.uniform1f(this.u.uVibrance,t.vibrance),e.uniform1f(this.u.uHueShift,t.hueShift),e.uniform1i(this.u.uFalseColor,t.falseColor?1:0),e.bindVertexArray(this.vao)}render(t){const e=this.gl;this.setUniforms(t),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.canvas.width,this.canvas.height),e.drawArrays(e.TRIANGLE_STRIP,0,4)}readHistogramPixels(t){const e=this.gl;this.setUniforms(t),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.viewport(0,0,$,q),e.drawArrays(e.TRIANGLE_STRIP,0,4);const i=new Uint8Array($*q*4);return e.readPixels(0,0,$,q,e.RGBA,e.UNSIGNED_BYTE,i),e.bindFramebuffer(e.FRAMEBUFFER,null),i}destroy(){const t=this.gl;t.deleteProgram(this.prog),t.deleteTexture(this.tex),t.deleteFramebuffer(this.histFBO),t.deleteRenderbuffer(this.histRBO)}}function xe(n,t,e){const i=Math.floor(n*6),r=n*6-i,s=e*(1-t),a=e*(1-r*t),o=e*(1-(1-r)*t);switch(i%6){case 0:return[e,o,s];case 1:return[a,e,s];case 2:return[s,e,o];case 3:return[s,a,e];case 4:return[o,s,e];default:return[e,s,a]}}const D=160,A=70,_e=6;class z{constructor(t,e,i,r){this.label=e,this.sensitivity=i,this.center=r,this.dx=0,this.dy=0,this.master=0,this.dragging=!1,this.rgbEls=[null,null,null],this.onUpdate=()=>{},this.values=[r,r,r];const s=document.createElement("div");s.className="wheel-cell";const a=document.createElement("div");a.className="wheel-title";const o=document.createElement("span");o.textContent=e,a.appendChild(o),this.rstBtn=document.createElement("button"),this.rstBtn.className="wheel-reset",this.rstBtn.innerHTML="&#x21ba;",this.rstBtn.title="Reset "+e,this.rstBtn.addEventListener("click",()=>this.reset()),a.appendChild(this.rstBtn),s.appendChild(a),this.cvs=document.createElement("canvas"),this.cvs.width=D,this.cvs.height=D,this.cvs.className="wheel-cvs",s.appendChild(this.cvs);const c=document.createElement("div");c.className="wheel-master-row",this.masterInput=document.createElement("input"),this.masterInput.type="range",this.masterInput.min="-0.5",this.masterInput.max="0.5",this.masterInput.step="0.005",this.masterInput.value="0",this.masterInput.className="wheel-master-sl",this.masterValEl=document.createElement("span"),this.masterValEl.className="wheel-master-val",this.masterValEl.textContent="0.00",c.appendChild(this.masterInput),c.appendChild(this.masterValEl),s.appendChild(c);const d=document.createElement("div");d.className="wheel-rgb-row";const u=["r","g","b"];for(let g=0;g<3;g++){const p=document.createElement("span");p.className=`wheel-rgb ${u[g]}`,p.textContent=r.toFixed(2),d.appendChild(p),this.rgbEls[g]=p}s.appendChild(d),t.appendChild(s),this.el=s,this.ctx=this.cvs.getContext("2d"),this.bg=this.createBg(),this.draw(),this.masterInput.addEventListener("input",()=>{this.master=+this.masterInput.value,this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.onUpdate()}),this.cvs.addEventListener("pointerdown",g=>this.onDown(g)),window.addEventListener("pointermove",g=>this.onMove(g)),window.addEventListener("pointerup",()=>this.onUp()),this.cvs.addEventListener("dblclick",()=>this.reset())}updateRgbReadout(){for(let t=0;t<3;t++)this.rgbEls[t].textContent=this.values[t].toFixed(2)}syncResetBtn(){const t=Math.abs(this.dx)>.5||Math.abs(this.dy)>.5||Math.abs(this.master)>.001;this.rstBtn.classList.toggle("show",t)}reset(){this.dx=0,this.dy=0,this.master=0,this.masterInput.value="0",this.masterValEl.textContent="0.00",this.computeValues(),this.draw(),this.onUpdate()}setValues(t){const e=(t[0]+t[1]+t[2])/3-this.center;this.master=Math.max(-.5,Math.min(.5,e)),this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.dx=0,this.dy=0,this.values=t,this.draw()}getState(){return{dx:this.dx,dy:this.dy,master:this.master}}setState(t){this.dx=t.dx??0,this.dy=t.dy??0,this.master=t.master??0,this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.draw()}onDown(t){this.dragging=!0,this.cvs.setPointerCapture(t.pointerId),this.updateDot(t)}onMove(t){this.dragging&&this.updateDot(t)}onUp(){this.dragging=!1}updateDot(t){const e=this.cvs.getBoundingClientRect(),i=D/e.width,r=D/2;let s=(t.clientX-e.left)*i-r,a=(t.clientY-e.top)*i-r;const o=Math.sqrt(s*s+a*a);o>A&&(s*=A/o,a*=A/o),this.dx=s,this.dy=a,this.computeValues(),this.draw(),this.onUpdate()}computeValues(){this.syncResetBtn();const t=Math.sqrt(this.dx*this.dx+this.dy*this.dy)/A;if(t<.01){this.values=[this.center+this.master,this.center+this.master,this.center+this.master],this.updateRgbReadout();return}const e=Math.pow(t,1.8);let i=-Math.atan2(this.dx,-this.dy)/(2*Math.PI);i<0&&(i+=1);const[r,s,a]=xe(i,1,1),o=(r+s+a)/3,c=e*this.sensitivity;this.values=[this.center+(r-o)*c*3+this.master,this.center+(s-o)*c*3+this.master,this.center+(a-o)*c*3+this.master],this.updateRgbReadout()}createBg(){const t=D,e=new ImageData(t,t),i=t/2;for(let r=0;r<t;r++)for(let s=0;s<t;s++){const a=(s-i)/A,o=(r-i)/A,c=Math.sqrt(a*a+o*o);if(c>1.05)continue;const d=c>1?0:c>.92?1:c<.05?.6:.85;let u=-Math.atan2(a,-o)/(2*Math.PI);u<0&&(u+=1);const g=Math.min(c,1)*.65,p=.2+Math.min(c,1)*.15,[_,b,m]=xe(u,g,p),f=(r*t+s)*4;e.data[f]=Math.round(_*255),e.data[f+1]=Math.round(b*255),e.data[f+2]=Math.round(m*255),e.data[f+3]=Math.round(d*255)}return e}draw(){const t=this.ctx,e=D/2;t.clearRect(0,0,D,D),t.putImageData(this.bg,0,0),t.beginPath(),t.arc(e,e,A+1,0,Math.PI*2),t.strokeStyle="rgba(255,255,255,0.12)",t.lineWidth=1,t.stroke(),t.strokeStyle="rgba(255,255,255,0.08)",t.beginPath(),t.moveTo(e-A,e),t.lineTo(e+A,e),t.moveTo(e,e-A),t.lineTo(e,e+A),t.stroke();const i=e+this.dx,r=e+this.dy;t.beginPath(),t.arc(i,r,_e,0,Math.PI*2),t.fillStyle="#fff",t.fill(),t.strokeStyle="rgba(0,0,0,0.6)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(i,r,_e-2,0,Math.PI*2),t.fillStyle="rgba(255,255,255,0.3)",t.fill()}}function tt(n){const t=new Uint32Array(256),e=new Uint32Array(256),i=new Uint32Array(256);for(let r=0;r<n.length;r+=4)t[n[r]]++,e[n[r+1]]++,i[n[r+2]]++;return[t,e,i]}function nt(n,t,e,i,r,s){n.clearRect(0,0,r,s),n.fillStyle="#111113",n.fillRect(0,0,r,s);let a=1;for(let u=2;u<254;u++)a=Math.max(a,t[u],e[u],i[u]);const o=Math.log(a+1),c=[[t,"rgba(220, 60, 60, 0.55)"],[e,"rgba(60, 200, 80, 0.55)"],[i,"rgba(60, 120, 220, 0.55)"]],d=r/256;for(const[u,g]of c){n.fillStyle=g,n.beginPath(),n.moveTo(0,s);for(let p=0;p<256;p++){const _=u[p]>0?Math.log(u[p]+1)/o*(s-2):0;n.lineTo(p*d,s-_)}n.lineTo(r,s),n.closePath(),n.fill()}n.strokeStyle="rgba(255,255,255,0.08)",n.lineWidth=1,n.strokeRect(.5,.5,r-1,s-1)}function it(n,t,e,i,r,s){n.clearRect(0,0,r,s),n.fillStyle="#111113",n.fillRect(0,0,r,s);const a=Math.floor(r/3),o=2,c=new Float32Array(a*s),d=new Float32Array(a*s),u=new Float32Array(a*s);for(let m=0;m<t.length;m+=4){const f=(m>>2)%e,x=Math.min(Math.floor(f*a/e),a-1),U=s-1-Math.min(Math.floor(t[m]*(s-1)/255),s-1),O=s-1-Math.min(Math.floor(t[m+1]*(s-1)/255),s-1),te=s-1-Math.min(Math.floor(t[m+2]*(s-1)/255),s-1);c[U*a+x]++,d[O*a+x]++,u[te*a+x]++}let g=1;for(let m=0;m<c.length;m++)g=Math.max(g,c[m],d[m],u[m]);const p=Math.log(g+1),_=n.createImageData(r,s),b=_.data;for(let m=0;m<s;m++)for(let f=0;f<a;f++){const x=m*a+f,U=c[x]>0?Math.log(c[x]+1)/p:0,O=(m*r+f)*4;b[O]=Math.min(U*400,255)|0,b[O+3]=255;const te=d[x]>0?Math.log(d[x]+1)/p:0,ge=(m*r+f+a+o)*4;f+a+o<r&&(b[ge+1]=Math.min(te*400,255)|0,b[ge+3]=255);const Ie=u[x]>0?Math.log(u[x]+1)/p:0,pe=(m*r+f+(a+o)*2)*4;f+(a+o)*2<r&&(b[pe+2]=Math.min(Ie*400,255)|0,b[pe+3]=255)}n.putImageData(_,0,0),n.font="9px sans-serif",n.fillStyle="rgba(255,80,80,0.5)",n.fillText("R",3,10),n.fillStyle="rgba(80,220,80,0.5)",n.fillText("G",a+o+3,10),n.fillStyle="rgba(80,140,255,0.5)",n.fillText("B",(a+o)*2+3,10),n.strokeStyle="rgba(255,255,255,0.08)",n.lineWidth=1,n.strokeRect(.5,.5,r-1,s-1)}const le=[{id:"dandelion_girl_sunset",label:"Dandelion Girl Sunset",frames:97},{id:"airport_silhouettes_sunset",label:"Airport Silhouettes Sunset",frames:121},{id:"ballerina_arch_spotlight",label:"Ballerina Arch Spotlight",frames:121},{id:"ballerina_window_light",label:"Ballerina Window Light",frames:121},{id:"ballerina_window_reach",label:"Ballerina Window Reach",frames:121},{id:"big_ben_tower",label:"Big Ben Tower",frames:75},{id:"boy_cozy_room_moody",label:"Boy Cozy Room Moody",frames:121},{id:"carousel_night_glow",label:"Carousel Night Glow",frames:121},{id:"cathedral_dome_light",label:"Cathedral Dome Light",frames:121},{id:"cattle_meadow_backlit",label:"Cattle Meadow Backlit",frames:121},{id:"city_highway_night",label:"City Highway Night",frames:121},{id:"city_rooftops_aerial",label:"City Rooftops Aerial",frames:121},{id:"city_roundabout_night",label:"City Roundabout Night",frames:121},{id:"dancer_blue_studio",label:"Dancer Blue Studio",frames:121},{id:"driver_golden_hour_car",label:"Driver Golden Hour Car",frames:121},{id:"dusk_field_clouds",label:"Dusk Field Clouds",frames:121},{id:"forest_stream_golden",label:"Forest Stream Golden",frames:121},{id:"girls_bokeh_picnic",label:"Girls Bokeh Picnic",frames:57},{id:"golden_street_tower",label:"Golden Street Tower",frames:121},{id:"greek_alley_flowers",label:"Greek Alley Flowers",frames:121},{id:"horse_pasture_silhouette",label:"Horse Pasture Silhouette",frames:121},{id:"lakeside_arches_vista",label:"Lakeside Arches Vista",frames:121},{id:"misty_mountains_sunrise",label:"Misty Mountains Sunrise",frames:121},{id:"mountain_road_canyon",label:"Mountain Road Canyon",frames:121},{id:"mountain_sunrise_portrait",label:"Mountain Sunrise Portrait",frames:121},{id:"neon_dancer_club",label:"Neon Dancer Club",frames:121},{id:"night_vendor_cart",label:"Night Vendor Cart",frames:121},{id:"river_cascade_sunlit",label:"River Cascade Sunlit",frames:121}];let y,R=null,T=0,C=0,h=structuredClone(de),L=le[0],S=Math.floor(L.frames/2),K=!1,w,J,Ce="histogram",re=0,Z=null,M=!1,I=.5;const l=n=>document.querySelector(n),G=typeof location<"u"&&new URLSearchParams(location.search).has("embed");let ue=!1;function Ae(n){!G||window.parent===window||window.parent.postMessage(n,"*")}async function rt(){G&&document.body.classList.add("embed-mode"),await Ke(),y=new et(l("#canvas")),J=l("#scope-canvas").getContext("2d");const n=l("#wheels-container"),t=new z(n,"Lift",.45,0),e=new z(n,"Gamma",.5,1),i=new z(n,"Gain",.3,1),r=new z(n,"Offset",.2,0);w={lift:t,gamma:e,gain:i,offset:r},t.onUpdate=()=>{h.lift=t.values,E()},e.onUpdate=()=>{h.gamma=e.values,E()},i.onUpdate=()=>{h.gain=i.values,E()},r.onUpdate=()=>{h.offset=r.values,E()},dt(),G||ht(),mt(),gt(),pt(),vt(),bt(),wt(l("#canvas")),G?(st(),l(".loading").textContent="Waiting for image from host…",Ae({type:"gear:ready"})):await me(L.id,S)}function st(){window.addEventListener("message",async n=>{const t=n.data;!t||typeof t!="object"||(t.type==="gear:load_exr"&&t.buffer instanceof ArrayBuffer?await Ue(new Uint8Array(t.buffer)):t.type==="gear:load_exr_sequence"&&Array.isArray(t.urls)?await at(t.urls,t.sdrUrls):t.type==="gear:load_sdr"&&t.buffer instanceof ArrayBuffer?await Pe(new Uint8Array(t.buffer),t.mime||"image/png"):t.type==="gear:set_params"&&t.params?ot(t.params,t.wheels):t.type==="gear:reset"&&Be())})}let Me=[],Q=null,ee=0,se=0;async function at(n,t){if(Me=n,Q=t&&Array.isArray(t)&&t.length?t:null,ee=0,!n.length)return;if(n.length===1){await ae(0);return}document.body.classList.add("embed-seq");const e=l("#frame-slider");e.min="0",e.max=String(n.length-1),e.step="1",e.value="0",l("#tl-start").textContent="0",l("#tl-end").textContent=String(n.length-1),l("#frame-num").textContent="0",e.oninput=()=>{ee=+e.value,l("#frame-num").textContent=String(ee)},e.onchange=()=>{ae(+e.value)},await ae(0)}async function ae(n){const t=Me[n];if(!t)return;const e=++se,i=l(".loading");i.classList.remove("hidden"),i.textContent="Fetching…";try{const r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);const s=new Uint8Array(await r.arrayBuffer());if(e!==se)return;if(ee=n,await Ue(s),Q&&Q[n])try{const a=await fetch(Q[n]);if(a.ok&&e===se){const o=new Uint8Array(await a.arrayBuffer());await Pe(o,"image/png")}}catch{}}catch(r){i.textContent=`Error: ${r.message}`}}async function Pe(n,t){const e=new Blob([n.slice().buffer],{type:t}),i=URL.createObjectURL(e);try{const r=new Image;await new Promise((d,u)=>{r.onload=()=>d(),r.onerror=()=>u(new Error("SDR image decode failed")),r.src=i}),y.uploadSDR(r);const s=T/r.naturalWidth,a=C/r.naturalHeight,o=(1-s)/2,c=(1-a)/2;y.sdrCrop=[s,a,o,c],requestAnimationFrame(()=>E())}finally{URL.revokeObjectURL(i)}}async function Ue(n){const t=l(".loading");t.classList.remove("hidden"),t.textContent="Decoding…",await new Promise(e=>setTimeout(e,0));try{const e=performance.now(),i=Se(n),r=(performance.now()-e).toFixed(0);R=i.interleavedRgbPixels,T=i.width,C=i.height,y.uploadImage(R,T,C),requestAnimationFrame(()=>E()),l("#info-res").textContent=`${T}×${C}`,l("#info-decode").textContent=`${r} ms`,t.classList.add("hidden")}catch(e){t.textContent=`Error: ${e.message}`}}function ot(n,t){ue=!0;try{n.exposure!=null&&(h.exposure=n.exposure,l("#sl-exposure").value=String(n.exposure),l("#tb-ev").value=n.exposure.toFixed(2),l("#ev-reset").classList.toggle("show",Math.abs(n.exposure)>.001)),n.toneMapping!=null&&(h.toneMapping=n.toneMapping,l("#tm-select").value=String(n.toneMapping));const e=[["softClip","#sl-softclip"],["contrast","#sl-contrast"],["pivot","#sl-pivot"],["shadows","#sl-shadows"],["highlights","#sl-highlights"],["temperature","#sl-temperature"],["tint","#sl-tint"],["saturation","#sl-saturation"],["vibrance","#sl-vibrance"],["hueShift","#sl-hueshift"]];for(const[i,r]of e){const s=n[i];s!=null&&(h[i]=s,P(r,s))}t?.lift?w.lift.setState(t.lift):n.lift&&w.lift.setValues([...n.lift]),t?.gamma?w.gamma.setState(t.gamma):n.gamma&&w.gamma.setValues([...n.gamma]),t?.gain?w.gain.setState(t.gain):n.gain&&w.gain.setValues([...n.gain]),t?.offset?w.offset.setState(t.offset):n.offset&&w.offset.setValues([...n.offset]),h.lift=w.lift.values,h.gamma=w.gamma.values,h.gain=w.gain.values,h.offset=w.offset.values,n.falseColor!=null&&(h.falseColor=!!n.falseColor,l("#fc-check").checked=h.falseColor,l(".fc-legend").classList.toggle("show",h.falseColor)),requestAnimationFrame(()=>E())}finally{ue=!1}}const he="/clips".replace(/\/$/,"");function ct(n,t){return`${he}/${n}/hdr_exr/frame_${String(t).padStart(5,"0")}.exr`}function lt(n,t){return`${he}/${n}/sdr_png/frame_${String(t).padStart(5,"0")}.png`}async function me(n,t){if(K)return;K=!0;const e=l(".loading");e.classList.remove("hidden"),e.textContent="Loading EXR…";try{const i=await fetch(ct(n,t));if(!i.ok)throw new Error(`HTTP ${i.status}`);const r=new Uint8Array(await i.arrayBuffer());e.textContent="Decoding…",await new Promise(c=>setTimeout(c,0));const s=performance.now(),a=Se(r),o=(performance.now()-s).toFixed(0);R=a.interleavedRgbPixels,T=a.width,C=a.height,y.uploadImage(R,T,C),E(),l("#info-res").textContent=`${T}×${C}`,l("#info-decode").textContent=`${o} ms`,M&&Fe(n,t)}catch(i){e.textContent=`Error: ${i.message}`,K=!1;return}e.classList.add("hidden"),K=!1}function ut(n){const t=n.split(/\r?\n/);let e=0;const i=[];for(const r of t){const s=r.trim();if(!s||s.startsWith("#")||s.startsWith("TITLE")||s.startsWith("DOMAIN"))continue;if(s.startsWith("LUT_3D_SIZE")){e=parseInt(s.split(/\s+/)[1],10);continue}if(s.startsWith("LUT_1D_SIZE"))return null;const a=s.split(/\s+/);if(a.length>=3){const o=parseFloat(a[0]),c=parseFloat(a[1]),d=parseFloat(a[2]);isNaN(o)||i.push(o,c,d)}}return e<2||i.length!==e*e*e*3?null:{size:e,data:new Float32Array(i)}}function Fe(n,t){const e=new Image;e.onload=()=>{y.uploadSDR(e);const i=T/e.naturalWidth,r=C/e.naturalHeight,s=(1-i)/2,a=(1-r)/2;y.sdrCrop=[i,r,s,a],E()},e.src=lt(n,t)}function ft(){return{lift:w.lift.getState(),gamma:w.gamma.getState(),gain:w.gain.getState(),offset:w.offset.getState()}}function E(){R&&(y.render(h),G&&!ue&&Ae({type:"gear:params_changed",params:structuredClone(h),wheels:ft()}),!re&&(re=requestAnimationFrame(()=>{re=0,R&&(Z=y.readHistogramPixels(h),y.render(h),De())})))}function De(){if(!Z)return;const n=J.canvas;if(Ce==="parade")it(J,Z,320,180,n.width,n.height);else{const[t,e,i]=tt(Z);nt(J,t,e,i,n.width,n.height)}}function dt(){if(!G){let c=function(){g.src=m(L.id),p.textContent=L.label},d=function(f){L=le[f];const x=l("#frame-slider");x.max=String(L.frames-1),l("#tl-end").textContent=String(L.frames-1),S=Math.min(S,L.frames-1),x.value=String(S),l("#frame-num").textContent=String(S),c(),b.querySelectorAll(".clip-item").forEach((U,O)=>{U.classList.toggle("active",O===f)}),_.classList.remove("open"),me(L.id,S)};const u=l("#clip-trigger"),g=l("#clip-trigger-thumb"),p=l("#clip-trigger-name"),_=l("#clip-popup"),b=l("#clip-grid"),m=f=>`${he}/${f}/thumbnail.jpg`;le.forEach((f,x)=>{const U=document.createElement("div");U.className="clip-item"+(x===0?" active":""),U.innerHTML=`<img class="clip-item-thumb" src="${m(f.id)}" loading="lazy" alt=""/><div class="clip-item-name">${f.label}</div>`,U.addEventListener("click",()=>d(x)),b.appendChild(U)}),c(),u.addEventListener("click",f=>{f.stopPropagation(),_.classList.toggle("open")}),document.addEventListener("click",f=>{!_.contains(f.target)&&f.target!==u&&_.classList.remove("open")}),window.addEventListener("keydown",f=>{f.key==="Escape"&&_.classList.remove("open")})}const n=l("#sl-exposure"),t=l("#tb-ev"),e=l("#ev-reset");function i(c){c=Math.max(-6,Math.min(6,c)),h.exposure=c,n.value=String(c),t.value=c.toFixed(2),e.classList.toggle("show",Math.abs(c)>.001),E()}n.addEventListener("input",()=>i(+n.value)),t.addEventListener("change",()=>i(parseFloat(t.value)||0)),t.addEventListener("keydown",c=>{c.key==="Enter"&&t.blur()}),e.addEventListener("click",()=>i(0));const r=l("#tm-select");r.value=String(h.toneMapping),r.addEventListener("change",()=>{h.toneMapping=+r.value,E()});const s=l("#btn-lut"),a=l("#lut-file"),o=l("#lut-name");s.addEventListener("click",()=>{y.lutEnabled?(y.clearLUT(),s.classList.remove("active"),o.textContent="",E()):a.click()}),a.addEventListener("change",()=>{const c=a.files?.[0];if(!c)return;const d=new FileReader;d.onload=()=>{const u=ut(d.result);if(!u){alert("Could not parse .cube file (only 3D LUTs supported)");return}y.uploadLUT(u.data,u.size),s.classList.add("active"),o.textContent=c.name.replace(".cube",""),E()},d.readAsText(c),a.value=""})}function ht(){const n=l("#frame-slider");n.max=String(L.frames-1),n.value=String(S),l("#frame-num").textContent=String(S),l("#tl-end").textContent=String(L.frames-1),n.addEventListener("input",()=>{S=+n.value,l("#frame-num").textContent=String(S)}),n.addEventListener("change",()=>{S=+n.value,me(L.id,S)})}function mt(){F("#sl-softclip","softClip",n=>n.toFixed(2)),F("#sl-contrast","contrast",n=>n.toFixed(2)),F("#sl-pivot","pivot",n=>n.toFixed(2)),F("#sl-shadows","shadows",n=>n.toFixed(2)),F("#sl-highlights","highlights",n=>n.toFixed(2)),F("#sl-temperature","temperature",n=>n.toFixed(2)),F("#sl-tint","tint",n=>n.toFixed(2)),F("#sl-saturation","saturation",n=>n.toFixed(2)),F("#sl-vibrance","vibrance",n=>n.toFixed(2)),F("#sl-hueshift","hueShift",n=>`${n.toFixed(0)}°`),l("#fc-check").addEventListener("change",n=>{h.falseColor=n.target.checked,l(".fc-legend").classList.toggle("show",h.falseColor),E()}),l("#btn-reset").addEventListener("click",Be)}function gt(){document.querySelectorAll(".scope-tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".scope-tab").forEach(t=>t.classList.remove("active")),n.classList.add("active"),Ce=n.dataset.mode,De()})})}function pt(){const n=l("#panel-wrap"),t=l("#btn-panel");function e(){n.classList.toggle("hidden"),t.classList.toggle("active",!n.classList.contains("hidden"))}t.addEventListener("click",e),window.addEventListener("keydown",i=>{i.key==="Tab"&&!i.ctrlKey&&!i.altKey&&document.activeElement?.tagName!=="INPUT"&&(i.preventDefault(),e())}),t.classList.add("active")}function vt(){const n=l("#panel-wrap"),t=l("#panel-resize");let e=!1;t.addEventListener("pointerdown",i=>{e=!0,t.setPointerCapture(i.pointerId),document.body.style.cursor="col-resize",document.body.style.userSelect="none"}),window.addEventListener("pointermove",i=>{e&&(n.style.width=Math.max(260,Math.min(600,document.documentElement.clientWidth-i.clientX))+"px")}),window.addEventListener("pointerup",()=>{e&&(e=!1,document.body.style.cursor="",document.body.style.userSelect="")})}function bt(){const n=l("#btn-compare"),t=l("#wipe-line"),e=l("#wipe-label-l"),i=l("#wipe-label-r"),r=l("#canvas");function s(){M=!M,y.compareOn=M,n.classList.toggle("active",M),t.classList.toggle("active",M),e.classList.toggle("active",M),i.classList.toggle("active",M),M&&Fe(L.id,S),E(),oe()}n.addEventListener("click",s),window.addEventListener("keydown",o=>{o.key==="c"&&!o.ctrlKey&&document.activeElement?.tagName!=="INPUT"&&s()});let a=!1;t.addEventListener("pointerdown",o=>{a=!0,t.setPointerCapture(o.pointerId)}),r.addEventListener("pointerdown",o=>{if(!M||o.ctrlKey)return;a=!0;const c=r.getBoundingClientRect();I=Math.max(.02,Math.min(.98,(o.clientX-c.left)/c.width)),y.wipePos=I,E(),oe()}),window.addEventListener("pointermove",o=>{if(!a||!M)return;const c=r.getBoundingClientRect();I=Math.max(.02,Math.min(.98,(o.clientX-c.left)/c.width)),y.wipePos=I,E(),oe()}),window.addEventListener("pointerup",()=>{a=!1})}function oe(){const n=l("#wipe-line"),t=l("#wipe-label-l"),e=l("#wipe-label-r"),i=l("#canvas"),r=i.getBoundingClientRect(),a=i.closest(".viewport").getBoundingClientRect(),o=r.left-a.left+r.width*I;n.style.left=o+"px",t.style.left=r.left-a.left+r.width*I*.5+"px",e.style.left=r.left-a.left+r.width*(I+(1-I)*.5)+"px"}function wt(n){n.addEventListener("mousemove",r=>{if(!R)return;const s=n.getBoundingClientRect(),a=Math.floor((r.clientX-s.left)*T/s.width),o=Math.floor((r.clientY-s.top)*C/s.height);if(a<0||o<0||a>=T||o>=C)return;const c=(o*T+a)*3,d=R[c],u=R[c+1],g=R[c+2];l("#px-coord").textContent=`(${a}, ${o})`,l("#px-rgb").textContent=`R:${B(d)} G:${B(u)} B:${B(g)}`;const p=.2126*d+.7152*u+.0722*g;l("#px-lum").textContent=`L:${B(p)}`,l("#px-swatch").style.background=`rgb(${ce(d)*255|0},${ce(u)*255|0},${ce(g)*255|0})`}),n.addEventListener("mouseleave",()=>{l("#px-coord").textContent="",l("#px-rgb").textContent="",l("#px-lum").textContent=""});const t=l("#probe"),e=t.querySelector(".probe-label"),i=n.closest(".viewport");n.addEventListener("click",r=>{if(!r.ctrlKey||!R){t.classList.remove("show");return}const s=n.getBoundingClientRect(),a=Math.floor((r.clientX-s.left)*T/s.width),o=Math.floor((r.clientY-s.top)*C/s.height);if(a<0||o<0||a>=T||o>=C)return;const c=(o*T+a)*3,d=R[c],u=R[c+1],g=R[c+2],p=.2126*d+.7152*u+.0722*g,_=p>1e-6?Math.log2(p/.18):-1/0,b=_>-20?`${_>=0?"+":""}${_.toFixed(1)} EV`:"−∞ EV",m=i.getBoundingClientRect(),f=r.clientX-m.left,x=r.clientY-m.top;t.style.left=f+"px",t.style.top=x+"px",f>m.width*.65?(e.style.left="auto",e.style.right="14px"):(e.style.left="14px",e.style.right="auto"),e.innerHTML=`<span style="color:var(--dim)">(${a}, ${o})</span><span class="pr">R: ${B(d)}</span><span class="pg">G: ${B(u)}</span><span class="pb">B: ${B(g)}</span><span class="pl">L: ${B(p)}</span><span class="pev">${b}</span>`,t.classList.add("show")}),window.addEventListener("keydown",r=>{r.key==="Escape"&&t.classList.remove("show")})}function F(n,t,e){const i=l(n),r=i.closest(".slider-row").querySelector(".label-row"),s=r.querySelector(".val"),a=de[t],o=document.createElement("input");o.type="number",o.className="val-input",o.step=i.step,o.min=i.min,o.max=i.max,s.replaceWith(o);const c=document.createElement("button");c.className="sl-reset",c.innerHTML="&#x21ba;",c.title=`Reset to ${e(a)}`,r.insertBefore(c,o);function d(u){h[t]=u,i.value=String(u),o.value=e(u).replace("°",""),c.classList.toggle("show",Math.abs(u-a)>.001),E()}d(h[t]),i.addEventListener("input",()=>d(+i.value)),o.addEventListener("change",()=>{let u=parseFloat(o.value);isNaN(u)&&(u=a),d(Math.max(+i.min,Math.min(+i.max,u)))}),o.addEventListener("keydown",u=>{u.key==="Enter"&&o.blur()}),c.addEventListener("click",()=>d(a))}function P(n,t){l(n).value=String(t),l(n).dispatchEvent(new Event("input"))}function Be(){h=structuredClone(de),l("#sl-exposure").value="0",l("#tb-ev").value="0.00",l("#ev-reset").classList.remove("show"),l("#tm-select").value=String(h.toneMapping),P("#sl-softclip",h.softClip),P("#sl-contrast",h.contrast),P("#sl-pivot",h.pivot),P("#sl-shadows",h.shadows),P("#sl-highlights",h.highlights),P("#sl-temperature",h.temperature),P("#sl-tint",h.tint),P("#sl-saturation",h.saturation),P("#sl-vibrance",h.vibrance),P("#sl-hueshift",h.hueShift),w.lift.reset(),w.gamma.reset(),w.gain.reset(),w.offset.reset(),l("#fc-check").checked=!1,l(".fc-legend").classList.remove("show"),E()}function B(n){return Math.abs(n)>=10?n.toFixed(2):n.toFixed(4)}function ce(n){return Math.max(0,Math.min(1,n))}rt().catch(console.error);
