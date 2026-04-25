(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const s of r)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function e(r){const s={};return r.integrity&&(s.integrity=r.integrity),r.referrerPolicy&&(s.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?s.credentials="include":r.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function i(r){if(r.ep)return;r.ep=!0;const s=e(r);fetch(r.href,s)}})();const Xe="modulepreload",Ve=function(n,t){return new URL(n,t).href},_e={},oe=function(t,e,i){let r=Promise.resolve();if(e&&e.length>0){let o=function(u){return Promise.all(u.map(h=>Promise.resolve(h).then(p=>({status:"fulfilled",value:p}),p=>({status:"rejected",reason:p}))))};const a=document.getElementsByTagName("link"),l=document.querySelector("meta[property=csp-nonce]"),d=l?.nonce||l?.getAttribute("nonce");r=o(e.map(u=>{if(u=Ve(u,i),u in _e)return;_e[u]=!0;const h=u.endsWith(".css"),p=h?'[rel="stylesheet"]':"";if(!!i)for(let m=a.length-1;m>=0;m--){const f=a[m];if(f.href===u&&(!h||f.rel==="stylesheet"))return}else if(document.querySelector(`link[href="${u}"]${p}`))return;const b=document.createElement("link");if(b.rel=h?"stylesheet":Xe,h||(b.as="script"),b.crossOrigin="",b.href=u,d&&b.setAttribute("nonce",d),document.head.appendChild(b),h)return new Promise((m,f)=>{b.addEventListener("load",m),b.addEventListener("error",()=>f(new Error(`Unable to preload CSS for ${u}`)))})}))}function s(o){const a=new Event("vite:preloadError",{cancelable:!0});if(a.payload=o,window.dispatchEvent(a),!a.defaultPrevented)throw o}return r.then(o=>{for(const a of o||[])a.status==="rejected"&&s(a.reason);return t().catch(s)})};let v;const Ce=typeof TextDecoder<"u"?new TextDecoder("utf-8",{ignoreBOM:!0,fatal:!0}):{decode:()=>{throw Error("TextDecoder not available")}};typeof TextDecoder<"u"&&Ce.decode();let W=null;function V(){return(W===null||W.byteLength===0)&&(W=new Uint8Array(v.memory.buffer)),W}function le(n,t){return n=n>>>0,Ce.decode(V().subarray(n,n+t))}let G=0;const Z=typeof TextEncoder<"u"?new TextEncoder("utf-8"):{encode:()=>{throw Error("TextEncoder not available")}},He=typeof Z.encodeInto=="function"?function(n,t){return Z.encodeInto(n,t)}:function(n,t){const e=Z.encode(n);return t.set(e),{read:n.length,written:e.length}};function ye(n,t,e){if(e===void 0){const a=Z.encode(n),l=t(a.length,1)>>>0;return V().subarray(l,l+a.length).set(a),G=a.length,l}let i=n.length,r=t(i,1)>>>0;const s=V();let o=0;for(;o<i;o++){const a=n.charCodeAt(o);if(a>127)break;s[r+o]=a}if(o!==i){o!==0&&(n=n.slice(o)),r=e(r,i,i=o+n.length*3,1)>>>0;const a=V().subarray(r+o,r+i),l=He(n,a);o+=l.written,r=e(r,i,o,1)>>>0}return G=o,r}let k=null;function q(){return(k===null||k.buffer.detached===!0||k.buffer.detached===void 0&&k.buffer!==v.memory.buffer)&&(k=new DataView(v.memory.buffer)),k}function $e(n){return n==null}let X=null;function qe(){return(X===null||X.byteLength===0)&&(X=new Float32Array(v.memory.buffer)),X}function ze(n,t){return n=n>>>0,qe().subarray(n/4,n/4+t)}function Ke(n){const t=v.__wbindgen_export_3.get(n);return v.__externref_table_dealloc(n),t}function Ye(n,t){const e=t(n.length*1,1)>>>0;return V().set(n,e/1),G=n.length,e}function je(n){const t=Ye(n,v.__wbindgen_malloc),e=G,i=v.readExrRgb(t,e);if(i[2])throw Ke(i[1]);return pe.__wrap(i[0])}typeof FinalizationRegistry>"u"||new FinalizationRegistry(n=>v.__wbg_exrdecoder_free(n>>>0,1));typeof FinalizationRegistry>"u"||new FinalizationRegistry(n=>v.__wbg_exrencoder_free(n>>>0,1));const Re=typeof FinalizationRegistry>"u"?{register:()=>{},unregister:()=>{}}:new FinalizationRegistry(n=>v.__wbg_exrsimpleimage_free(n>>>0,1));class pe{static __wrap(t){t=t>>>0;const e=Object.create(pe.prototype);return e.__wbg_ptr=t,Re.register(e,e.__wbg_ptr,e),e}__destroy_into_raw(){const t=this.__wbg_ptr;return this.__wbg_ptr=0,Re.unregister(this),t}free(){const t=this.__destroy_into_raw();v.__wbg_exrsimpleimage_free(t,0)}get data(){const t=v.exrsimpleimage_data(this.__wbg_ptr);var e=ze(t[0],t[1]).slice();return v.__wbindgen_free(t[0],t[1]*4,4),e}get width(){return v.exrsimpleimage_width(this.__wbg_ptr)>>>0}get height(){return v.exrsimpleimage_height(this.__wbg_ptr)>>>0}}async function Ze(n,t){if(typeof Response=="function"&&n instanceof Response){if(typeof WebAssembly.instantiateStreaming=="function")try{return await WebAssembly.instantiateStreaming(n,t)}catch(i){if(n.headers.get("Content-Type")!="application/wasm")console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve Wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n",i);else throw i}const e=await n.arrayBuffer();return await WebAssembly.instantiate(e,t)}else{const e=await WebAssembly.instantiate(n,t);return e instanceof WebAssembly.Instance?{instance:e,module:n}:e}}function Ae(){const n={};return n.wbg={},n.wbg.__wbg_error_7534b8e9a36f1ab4=function(t,e){let i,r;try{i=t,r=e,console.error(le(t,e))}finally{v.__wbindgen_free(i,r,1)}},n.wbg.__wbg_new_8a6f238a6ece86ea=function(){return new Error},n.wbg.__wbg_stack_0ed75d68575b0f3c=function(t,e){const i=e.stack,r=ye(i,v.__wbindgen_malloc,v.__wbindgen_realloc),s=G;q().setInt32(t+4,s,!0),q().setInt32(t+0,r,!0)},n.wbg.__wbindgen_init_externref_table=function(){const t=v.__wbindgen_export_3,e=t.grow(4);t.set(0,void 0),t.set(e+0,void 0),t.set(e+1,null),t.set(e+2,!0),t.set(e+3,!1)},n.wbg.__wbindgen_string_get=function(t,e){const i=e,r=typeof i=="string"?i:void 0;var s=$e(r)?0:ye(r,v.__wbindgen_malloc,v.__wbindgen_realloc),o=G;q().setInt32(t+4,o,!0),q().setInt32(t+0,s,!0)},n.wbg.__wbindgen_string_new=function(t,e){return le(t,e)},n.wbg.__wbindgen_throw=function(t,e){throw new Error(le(t,e))},n}function Pe(n,t){return v=n.exports,Me.__wbindgen_wasm_module=t,k=null,X=null,W=null,v.__wbindgen_start(),v}function Je(n){if(v!==void 0)return v;typeof n<"u"&&(Object.getPrototypeOf(n)===Object.prototype?{module:n}=n:console.warn("using deprecated parameters for `initSync()`; pass a single object instead"));const t=Ae();n instanceof WebAssembly.Module||(n=new WebAssembly.Module(n));const e=new WebAssembly.Instance(n,t);return Pe(e,n)}async function Me(n){if(v!==void 0)return v;typeof n<"u"&&(Object.getPrototypeOf(n)===Object.prototype?{module_or_path:n}=n:console.warn("using deprecated parameters for the initialization function; pass a single object instead")),typeof n>"u"&&(n=new URL(""+new URL("exrs_raw_wasm_bindgen_bg-DvcqSi-p.wasm",import.meta.url).href,import.meta.url));const t=Ae();(typeof n=="string"||typeof Request=="function"&&n instanceof Request||typeof URL=="function"&&n instanceof URL)&&(n=fetch(n));const{instance:e,module:i}=await Ze(await n,t);return Pe(e,i)}let J=!1;async function Qe(){if(!J)try{await Me(),J=!0}catch(n){try{const t=await oe(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),e=await oe(()=>import("./__vite-browser-external-BIHI7g3E.js"),[],import.meta.url),{createRequire:i}=await oe(async()=>{const{createRequire:l}=await import("./__vite-browser-external-BIHI7g3E.js");return{createRequire:l}},[],import.meta.url),r=i(import.meta.url),s=e.dirname(r.resolve("exrs-raw-wasm-bindgen/package.json")),o=e.resolve(s,"exrs_raw_wasm_bindgen_bg.wasm"),a=t.readFileSync(o);Je({module:a}),J=!0}catch{throw console.error("Failed to initialize EXRS WASM in both browser and Node environments"),n}}}function et(){if(!J)throw new Error("EXRS WASM module not initialized. Call init() first.")}function Ue(n){et();const t=je(n);try{return{width:t.width,height:t.height,interleavedRgbPixels:t.data}}finally{t.free()}}const ve={exposure:0,toneMapping:2,softClip:0,temperature:0,tint:0,lift:[0,0,0],gamma:[1,1,1],gain:[1,1,1],offset:[0,0,0],contrast:1,pivot:.18,shadows:0,highlights:0,saturation:1,vibrance:0,hueShift:0,falseColor:!1},tt=`#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`,nt=`#version 300 es
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

  // Select source: SDR (left of wipe) or HDR (right).
  // Zoom/pan are applied at the DOM layer (CSS transform on the canvas)
  // so the shader stays simple and the image overflows the viewport at
  // zoom > 1 instead of being constrained to its original footprint.
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
}`;function Te(n,t,e){const i=n.createShader(t);if(n.shaderSource(i,e),n.compileShader(i),!n.getShaderParameter(i,n.COMPILE_STATUS))throw new Error(`Shader compile:
`+n.getShaderInfoLog(i));return i}function it(n,t,e){const i=n.createProgram();if(n.attachShader(i,t),n.attachShader(i,e),n.linkProgram(i),!n.getProgramParameter(i,n.LINK_STATUS))throw new Error(`Program link:
`+n.getProgramInfoLog(i));return i}const rt=["uTex","uTexSDR","uExposure","uToneMap","uSoftClip","uTemperature","uTint","uLift","uGamma","uGain","uOffset","uContrast","uPivot","uShadows","uHighlights","uSaturation","uVibrance","uHueShift","uFalseColor","uCompareOn","uWipePos","uSDRCrop","uLUT3D","uLUTEnabled","uLUTSize"],z=320,K=180;class st{constructor(t){this.canvas=t,this.imageWidth=0,this.imageHeight=0,this.compareOn=!1,this.wipePos=.5,this.sdrCrop=[1,1,0,0],this.lutEnabled=!1,this.lutSize=33;const e=t.getContext("webgl2",{antialias:!1,premultipliedAlpha:!1});if(!e)throw new Error("WebGL2 not supported");this.gl=e;const i=Te(e,e.VERTEX_SHADER,tt),r=Te(e,e.FRAGMENT_SHADER,nt);this.prog=it(e,i,r),this.u={};for(const o of rt)this.u[o]=e.getUniformLocation(this.prog,o);this.vao=e.createVertexArray(),e.bindVertexArray(this.vao);const s=e.createBuffer();e.bindBuffer(e.ARRAY_BUFFER,s),e.bufferData(e.ARRAY_BUFFER,new Float32Array([-1,-1,1,-1,-1,1,1,1]),e.STATIC_DRAW),e.enableVertexAttribArray(0),e.vertexAttribPointer(0,2,e.FLOAT,!1,0,0),e.bindVertexArray(null),this.tex=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.tex),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.texSDR=e.createTexture(),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),this.lutTex=e.createTexture(),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_3D,e.TEXTURE_WRAP_R,e.CLAMP_TO_EDGE),e.pixelStorei(e.UNPACK_FLIP_Y_WEBGL,!0),this.histFBO=e.createFramebuffer(),this.histRBO=e.createRenderbuffer(),e.bindRenderbuffer(e.RENDERBUFFER,this.histRBO),e.renderbufferStorage(e.RENDERBUFFER,e.RGBA8,z,K),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.framebufferRenderbuffer(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.RENDERBUFFER,this.histRBO),e.bindFramebuffer(e.FRAMEBUFFER,null)}uploadImage(t,e,i){this.imageWidth=e,this.imageHeight=i;const r=e*i,s=new Float32Array(r*4);for(let a=0;a<r;a++)s[a*4]=t[a*3],s[a*4+1]=t[a*3+1],s[a*4+2]=t[a*3+2],s[a*4+3]=1;const o=this.gl;o.bindTexture(o.TEXTURE_2D,this.tex),o.texImage2D(o.TEXTURE_2D,0,o.RGBA16F,e,i,0,o.RGBA,o.FLOAT,s),this.canvas.width=e,this.canvas.height=i}uploadLUT(t,e){const i=this.gl;this.lutSize=e;const r=new Float32Array(e*e*e*4);for(let s=0;s<e*e*e;s++)r[s*4]=t[s*3],r[s*4+1]=t[s*3+1],r[s*4+2]=t[s*3+2],r[s*4+3]=1;i.bindTexture(i.TEXTURE_3D,this.lutTex),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!1),i.texImage3D(i.TEXTURE_3D,0,i.RGBA16F,e,e,e,0,i.RGBA,i.FLOAT,r),i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,!0),this.lutEnabled=!0}clearLUT(){this.lutEnabled=!1}uploadSDR(t){const e=this.gl;e.bindTexture(e.TEXTURE_2D,this.texSDR),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.NONE),e.pixelStorei(e.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),e.texImage2D(e.TEXTURE_2D,0,e.RGBA8,e.RGBA,e.UNSIGNED_BYTE,t),e.pixelStorei(e.UNPACK_COLORSPACE_CONVERSION_WEBGL,e.BROWSER_DEFAULT_WEBGL)}setUniforms(t){const e=this.gl;e.useProgram(this.prog),e.activeTexture(e.TEXTURE0),e.bindTexture(e.TEXTURE_2D,this.tex),e.uniform1i(this.u.uTex,0),e.activeTexture(e.TEXTURE1),e.bindTexture(e.TEXTURE_2D,this.texSDR),e.uniform1i(this.u.uTexSDR,1),e.uniform1i(this.u.uCompareOn,this.compareOn?1:0),e.uniform1f(this.u.uWipePos,this.wipePos),e.uniform4f(this.u.uSDRCrop,this.sdrCrop[0],this.sdrCrop[1],this.sdrCrop[2],this.sdrCrop[3]),e.activeTexture(e.TEXTURE2),e.bindTexture(e.TEXTURE_3D,this.lutTex),e.uniform1i(this.u.uLUT3D,2),e.uniform1i(this.u.uLUTEnabled,this.lutEnabled?1:0),e.uniform1f(this.u.uLUTSize,this.lutSize),e.uniform1f(this.u.uExposure,t.exposure),e.uniform1i(this.u.uToneMap,t.toneMapping),e.uniform1f(this.u.uSoftClip,t.softClip),e.uniform1f(this.u.uTemperature,t.temperature),e.uniform1f(this.u.uTint,t.tint),e.uniform3f(this.u.uLift,t.lift[0],t.lift[1],t.lift[2]),e.uniform3f(this.u.uGamma,t.gamma[0],t.gamma[1],t.gamma[2]),e.uniform3f(this.u.uGain,t.gain[0],t.gain[1],t.gain[2]),e.uniform3f(this.u.uOffset,t.offset[0],t.offset[1],t.offset[2]),e.uniform1f(this.u.uContrast,t.contrast),e.uniform1f(this.u.uPivot,t.pivot),e.uniform1f(this.u.uShadows,t.shadows),e.uniform1f(this.u.uHighlights,t.highlights),e.uniform1f(this.u.uSaturation,t.saturation),e.uniform1f(this.u.uVibrance,t.vibrance),e.uniform1f(this.u.uHueShift,t.hueShift),e.uniform1i(this.u.uFalseColor,t.falseColor?1:0),e.bindVertexArray(this.vao)}render(t){const e=this.gl;this.setUniforms(t),e.bindFramebuffer(e.FRAMEBUFFER,null),e.viewport(0,0,this.canvas.width,this.canvas.height),e.drawArrays(e.TRIANGLE_STRIP,0,4)}readHistogramPixels(t){const e=this.gl;this.setUniforms(t),e.bindFramebuffer(e.FRAMEBUFFER,this.histFBO),e.viewport(0,0,z,K),e.drawArrays(e.TRIANGLE_STRIP,0,4);const i=new Uint8Array(z*K*4);return e.readPixels(0,0,z,K,e.RGBA,e.UNSIGNED_BYTE,i),e.bindFramebuffer(e.FRAMEBUFFER,null),i}destroy(){const t=this.gl;t.deleteProgram(this.prog),t.deleteTexture(this.tex),t.deleteFramebuffer(this.histFBO),t.deleteRenderbuffer(this.histRBO)}}function Le(n,t,e){const i=Math.floor(n*6),r=n*6-i,s=e*(1-t),o=e*(1-r*t),a=e*(1-(1-r)*t);switch(i%6){case 0:return[e,a,s];case 1:return[o,e,s];case 2:return[s,e,a];case 3:return[s,o,e];case 4:return[a,s,e];default:return[e,s,o]}}const D=160,P=70,Se=6;class Y{constructor(t,e,i,r){this.label=e,this.sensitivity=i,this.center=r,this.dx=0,this.dy=0,this.master=0,this.dragging=!1,this.rgbEls=[null,null,null],this.onUpdate=()=>{},this.values=[r,r,r];const s=document.createElement("div");s.className="wheel-cell";const o=document.createElement("div");o.className="wheel-title";const a=document.createElement("span");a.textContent=e,o.appendChild(a),this.rstBtn=document.createElement("button"),this.rstBtn.className="wheel-reset",this.rstBtn.innerHTML="&#x21ba;",this.rstBtn.title="Reset "+e,this.rstBtn.addEventListener("click",()=>this.reset()),o.appendChild(this.rstBtn),s.appendChild(o),this.cvs=document.createElement("canvas"),this.cvs.width=D,this.cvs.height=D,this.cvs.className="wheel-cvs",s.appendChild(this.cvs);const l=document.createElement("div");l.className="wheel-master-row",this.masterInput=document.createElement("input"),this.masterInput.type="range",this.masterInput.min="-0.5",this.masterInput.max="0.5",this.masterInput.step="0.005",this.masterInput.value="0",this.masterInput.className="wheel-master-sl",this.masterValEl=document.createElement("span"),this.masterValEl.className="wheel-master-val",this.masterValEl.textContent="0.00",l.appendChild(this.masterInput),l.appendChild(this.masterValEl),s.appendChild(l);const d=document.createElement("div");d.className="wheel-rgb-row";const u=["r","g","b"];for(let h=0;h<3;h++){const p=document.createElement("span");p.className=`wheel-rgb ${u[h]}`,p.textContent=r.toFixed(2),d.appendChild(p),this.rgbEls[h]=p}s.appendChild(d),t.appendChild(s),this.el=s,this.ctx=this.cvs.getContext("2d"),this.bg=this.createBg(),this.draw(),this.masterInput.addEventListener("input",()=>{this.master=+this.masterInput.value,this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.onUpdate()}),this.cvs.addEventListener("pointerdown",h=>this.onDown(h)),window.addEventListener("pointermove",h=>this.onMove(h)),window.addEventListener("pointerup",()=>this.onUp()),this.cvs.addEventListener("dblclick",()=>this.reset())}updateRgbReadout(){for(let t=0;t<3;t++)this.rgbEls[t].textContent=this.values[t].toFixed(2)}syncResetBtn(){const t=Math.abs(this.dx)>.5||Math.abs(this.dy)>.5||Math.abs(this.master)>.001;this.rstBtn.classList.toggle("show",t)}reset(){this.dx=0,this.dy=0,this.master=0,this.masterInput.value="0",this.masterValEl.textContent="0.00",this.computeValues(),this.draw(),this.onUpdate()}setValues(t){const e=(t[0]+t[1]+t[2])/3-this.center;this.master=Math.max(-.5,Math.min(.5,e)),this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.dx=0,this.dy=0,this.values=t,this.draw()}getState(){return{dx:this.dx,dy:this.dy,master:this.master}}setState(t){this.dx=t.dx??0,this.dy=t.dy??0,this.master=t.master??0,this.masterInput.value=String(this.master),this.masterValEl.textContent=this.master.toFixed(2),this.computeValues(),this.draw()}onDown(t){this.dragging=!0,this.cvs.setPointerCapture(t.pointerId),this.updateDot(t)}onMove(t){this.dragging&&this.updateDot(t)}onUp(){this.dragging=!1}updateDot(t){const e=this.cvs.getBoundingClientRect(),i=D/e.width,r=D/2;let s=(t.clientX-e.left)*i-r,o=(t.clientY-e.top)*i-r;const a=Math.sqrt(s*s+o*o);a>P&&(s*=P/a,o*=P/a),this.dx=s,this.dy=o,this.computeValues(),this.draw(),this.onUpdate()}computeValues(){this.syncResetBtn();const t=Math.sqrt(this.dx*this.dx+this.dy*this.dy)/P;if(t<.01){this.values=[this.center+this.master,this.center+this.master,this.center+this.master],this.updateRgbReadout();return}const e=Math.pow(t,1.8);let i=-Math.atan2(this.dx,-this.dy)/(2*Math.PI);i<0&&(i+=1);const[r,s,o]=Le(i,1,1),a=(r+s+o)/3,l=e*this.sensitivity;this.values=[this.center+(r-a)*l*3+this.master,this.center+(s-a)*l*3+this.master,this.center+(o-a)*l*3+this.master],this.updateRgbReadout()}createBg(){const t=D,e=new ImageData(t,t),i=t/2;for(let r=0;r<t;r++)for(let s=0;s<t;s++){const o=(s-i)/P,a=(r-i)/P,l=Math.sqrt(o*o+a*a);if(l>1.05)continue;const d=l>1?0:l>.92?1:l<.05?.6:.85;let u=-Math.atan2(o,-a)/(2*Math.PI);u<0&&(u+=1);const h=Math.min(l,1)*.65,p=.2+Math.min(l,1)*.15,[w,b,m]=Le(u,h,p),f=(r*t+s)*4;e.data[f]=Math.round(w*255),e.data[f+1]=Math.round(b*255),e.data[f+2]=Math.round(m*255),e.data[f+3]=Math.round(d*255)}return e}draw(){const t=this.ctx,e=D/2;t.clearRect(0,0,D,D),t.putImageData(this.bg,0,0),t.beginPath(),t.arc(e,e,P+1,0,Math.PI*2),t.strokeStyle="rgba(255,255,255,0.12)",t.lineWidth=1,t.stroke(),t.strokeStyle="rgba(255,255,255,0.08)",t.beginPath(),t.moveTo(e-P,e),t.lineTo(e+P,e),t.moveTo(e,e-P),t.lineTo(e,e+P),t.stroke();const i=e+this.dx,r=e+this.dy;t.beginPath(),t.arc(i,r,Se,0,Math.PI*2),t.fillStyle="#fff",t.fill(),t.strokeStyle="rgba(0,0,0,0.6)",t.lineWidth=1.5,t.stroke(),t.beginPath(),t.arc(i,r,Se-2,0,Math.PI*2),t.fillStyle="rgba(255,255,255,0.3)",t.fill()}}function at(n){const t=new Uint32Array(256),e=new Uint32Array(256),i=new Uint32Array(256);for(let r=0;r<n.length;r+=4)t[n[r]]++,e[n[r+1]]++,i[n[r+2]]++;return[t,e,i]}function ot(n,t,e,i,r,s){n.clearRect(0,0,r,s),n.fillStyle="#111113",n.fillRect(0,0,r,s);let o=1;for(let u=2;u<254;u++)o=Math.max(o,t[u],e[u],i[u]);const a=Math.log(o+1),l=[[t,"rgba(220, 60, 60, 0.55)"],[e,"rgba(60, 200, 80, 0.55)"],[i,"rgba(60, 120, 220, 0.55)"]],d=r/256;for(const[u,h]of l){n.fillStyle=h,n.beginPath(),n.moveTo(0,s);for(let p=0;p<256;p++){const w=u[p]>0?Math.log(u[p]+1)/a*(s-2):0;n.lineTo(p*d,s-w)}n.lineTo(r,s),n.closePath(),n.fill()}n.strokeStyle="rgba(255,255,255,0.08)",n.lineWidth=1,n.strokeRect(.5,.5,r-1,s-1)}function lt(n,t,e,i,r,s){n.clearRect(0,0,r,s),n.fillStyle="#111113",n.fillRect(0,0,r,s);const o=Math.floor(r/3),a=2,l=new Float32Array(o*s),d=new Float32Array(o*s),u=new Float32Array(o*s);for(let m=0;m<t.length;m+=4){const f=(m>>2)%e,x=Math.min(Math.floor(f*o/e),o-1),U=s-1-Math.min(Math.floor(t[m]*(s-1)/255),s-1),O=s-1-Math.min(Math.floor(t[m+1]*(s-1)/255),s-1),ae=s-1-Math.min(Math.floor(t[m+2]*(s-1)/255),s-1);l[U*o+x]++,d[O*o+x]++,u[ae*o+x]++}let h=1;for(let m=0;m<l.length;m++)h=Math.max(h,l[m],d[m],u[m]);const p=Math.log(h+1),w=n.createImageData(r,s),b=w.data;for(let m=0;m<s;m++)for(let f=0;f<o;f++){const x=m*o+f,U=l[x]>0?Math.log(l[x]+1)/p:0,O=(m*r+f)*4;b[O]=Math.min(U*400,255)|0,b[O+3]=255;const ae=d[x]>0?Math.log(d[x]+1)/p:0,Ee=(m*r+f+o+a)*4;f+o+a<r&&(b[Ee+1]=Math.min(ae*400,255)|0,b[Ee+3]=255);const We=u[x]>0?Math.log(u[x]+1)/p:0,xe=(m*r+f+(o+a)*2)*4;f+(o+a)*2<r&&(b[xe+2]=Math.min(We*400,255)|0,b[xe+3]=255)}n.putImageData(w,0,0),n.font="9px sans-serif",n.fillStyle="rgba(255,80,80,0.5)",n.fillText("R",3,10),n.fillStyle="rgba(80,220,80,0.5)",n.fillText("G",o+a+3,10),n.fillStyle="rgba(80,140,255,0.5)",n.fillText("B",(o+a)*2+3,10),n.strokeStyle="rgba(255,255,255,0.08)",n.lineWidth=1,n.strokeRect(.5,.5,r-1,s-1)}const he=[{id:"dandelion_girl_sunset",label:"Dandelion Girl Sunset",frames:97},{id:"airport_silhouettes_sunset",label:"Airport Silhouettes Sunset",frames:121},{id:"ballerina_arch_spotlight",label:"Ballerina Arch Spotlight",frames:121},{id:"ballerina_window_light",label:"Ballerina Window Light",frames:121},{id:"ballerina_window_reach",label:"Ballerina Window Reach",frames:121},{id:"big_ben_tower",label:"Big Ben Tower",frames:75},{id:"boy_cozy_room_moody",label:"Boy Cozy Room Moody",frames:121},{id:"carousel_night_glow",label:"Carousel Night Glow",frames:121},{id:"cathedral_dome_light",label:"Cathedral Dome Light",frames:121},{id:"cattle_meadow_backlit",label:"Cattle Meadow Backlit",frames:121},{id:"city_highway_night",label:"City Highway Night",frames:121},{id:"city_rooftops_aerial",label:"City Rooftops Aerial",frames:121},{id:"city_roundabout_night",label:"City Roundabout Night",frames:121},{id:"dancer_blue_studio",label:"Dancer Blue Studio",frames:121},{id:"driver_golden_hour_car",label:"Driver Golden Hour Car",frames:121},{id:"dusk_field_clouds",label:"Dusk Field Clouds",frames:121},{id:"forest_stream_golden",label:"Forest Stream Golden",frames:121},{id:"girls_bokeh_picnic",label:"Girls Bokeh Picnic",frames:57},{id:"golden_street_tower",label:"Golden Street Tower",frames:121},{id:"greek_alley_flowers",label:"Greek Alley Flowers",frames:121},{id:"horse_pasture_silhouette",label:"Horse Pasture Silhouette",frames:121},{id:"lakeside_arches_vista",label:"Lakeside Arches Vista",frames:121},{id:"misty_mountains_sunrise",label:"Misty Mountains Sunrise",frames:121},{id:"mountain_road_canyon",label:"Mountain Road Canyon",frames:121},{id:"mountain_sunrise_portrait",label:"Mountain Sunrise Portrait",frames:121},{id:"neon_dancer_club",label:"Neon Dancer Club",frames:121},{id:"night_vendor_cart",label:"Night Vendor Cart",frames:121},{id:"river_cascade_sunlit",label:"River Cascade Sunlit",frames:121}];let R,y=null,L=0,A=0,g=structuredClone(ve),S=he[0],C=Math.floor(S.frames/2),j=!1,E,Q,Fe="histogram",ce=0,ee=null,T=!1,I=.5;const c=n=>document.querySelector(n),N=typeof location<"u"&&new URLSearchParams(location.search).has("embed");let me=!1;function De(n){!N||window.parent===window||window.parent.postMessage(n,"*")}async function ct(){N&&document.body.classList.add("embed-mode"),await Qe(),R=new st(c("#canvas")),Q=c("#scope-canvas").getContext("2d");const n=c("#wheels-container"),t=new Y(n,"Lift",.45,0),e=new Y(n,"Gamma",.5,1),i=new Y(n,"Gain",.3,1),r=new Y(n,"Offset",.2,0);E={lift:t,gamma:e,gain:i,offset:r},t.onUpdate=()=>{g.lift=t.values,_()},e.onUpdate=()=>{g.gamma=e.values,_()},i.onUpdate=()=>{g.gain=i.values,_()},r.onUpdate=()=>{g.offset=r.values,_()},vt(),N||bt(),wt(),Et(),xt(),_t(),yt(),Rt(c("#canvas")),Tt(c("#canvas")),N?(ut(),c(".loading").textContent="Waiting for image from host…",De({type:"gear:ready"})):await we(S.id,C)}function ut(){window.addEventListener("message",async n=>{const t=n.data;!t||typeof t!="object"||(t.type==="gear:load_exr"&&t.buffer instanceof ArrayBuffer?await ke(new Uint8Array(t.buffer)):t.type==="gear:load_exr_sequence"&&Array.isArray(t.urls)?await ft(t.urls,t.sdrUrls):t.type==="gear:load_sdr"&&t.buffer instanceof ArrayBuffer?await Ie(new Uint8Array(t.buffer),t.mime||"image/png"):t.type==="gear:set_params"&&t.params?dt(t.params,t.wheels):t.type==="gear:reset"&&Ge())})}let Be=[],te=null,ne=0,ue=0;async function ft(n,t){if(Be=n,te=t&&Array.isArray(t)&&t.length?t:null,ne=0,!n.length)return;if(n.length===1){await fe(0);return}document.body.classList.add("embed-seq");const e=c("#frame-slider");e.min="0",e.max=String(n.length-1),e.step="1",e.value="0",c("#tl-start").textContent="0",c("#tl-end").textContent=String(n.length-1),c("#frame-num").textContent="0",e.oninput=()=>{ne=+e.value,c("#frame-num").textContent=String(ne)},e.onchange=()=>{fe(+e.value)},await fe(0)}async function fe(n){const t=Be[n];if(!t)return;const e=++ue,i=c(".loading");i.classList.remove("hidden"),i.textContent="Fetching…";try{const r=await fetch(t);if(!r.ok)throw new Error(`HTTP ${r.status}`);const s=new Uint8Array(await r.arrayBuffer());if(e!==ue)return;if(ne=n,await ke(s),te&&te[n])try{const o=await fetch(te[n]);if(o.ok&&e===ue){const a=new Uint8Array(await o.arrayBuffer());await Ie(a,"image/png")}}catch{}}catch(r){i.textContent=`Error: ${r.message}`}}async function Ie(n,t){const e=new Blob([n.slice().buffer],{type:t}),i=URL.createObjectURL(e);try{const r=new Image;await new Promise((d,u)=>{r.onload=()=>d(),r.onerror=()=>u(new Error("SDR image decode failed")),r.src=i}),R.uploadSDR(r);const s=L/r.naturalWidth,o=A/r.naturalHeight,a=(1-s)/2,l=(1-o)/2;R.sdrCrop=[s,o,a,l],requestAnimationFrame(()=>_())}finally{URL.revokeObjectURL(i)}}async function ke(n){const t=c(".loading");t.classList.remove("hidden"),t.textContent="Decoding…",await new Promise(e=>setTimeout(e,0));try{const e=performance.now(),i=Ue(n),r=(performance.now()-e).toFixed(0);y=i.interleavedRgbPixels,L=i.width,A=i.height,R.uploadImage(y,L,A),se(c("#canvas")),requestAnimationFrame(()=>_()),c("#info-res").textContent=`${L}×${A}`,c("#info-decode").textContent=`${r} ms`,t.classList.add("hidden")}catch(e){t.textContent=`Error: ${e.message}`}}function dt(n,t){me=!0;try{n.exposure!=null&&(g.exposure=n.exposure,c("#sl-exposure").value=String(n.exposure),c("#tb-ev").value=n.exposure.toFixed(2),c("#ev-reset").classList.toggle("show",Math.abs(n.exposure)>.001)),n.toneMapping!=null&&(g.toneMapping=n.toneMapping,c("#tm-select").value=String(n.toneMapping));const e=[["softClip","#sl-softclip"],["contrast","#sl-contrast"],["pivot","#sl-pivot"],["shadows","#sl-shadows"],["highlights","#sl-highlights"],["temperature","#sl-temperature"],["tint","#sl-tint"],["saturation","#sl-saturation"],["vibrance","#sl-vibrance"],["hueShift","#sl-hueshift"]];for(const[i,r]of e){const s=n[i];s!=null&&(g[i]=s,M(r,s))}t?.lift?E.lift.setState(t.lift):n.lift&&E.lift.setValues([...n.lift]),t?.gamma?E.gamma.setState(t.gamma):n.gamma&&E.gamma.setValues([...n.gamma]),t?.gain?E.gain.setState(t.gain):n.gain&&E.gain.setValues([...n.gain]),t?.offset?E.offset.setState(t.offset):n.offset&&E.offset.setValues([...n.offset]),g.lift=E.lift.values,g.gamma=E.gamma.values,g.gain=E.gain.values,g.offset=E.offset.values,n.falseColor!=null&&(g.falseColor=!!n.falseColor,c("#fc-check").checked=g.falseColor,c(".fc-legend").classList.toggle("show",g.falseColor)),requestAnimationFrame(()=>_())}finally{me=!1}}const be="/clips".replace(/\/$/,"");function ht(n,t){return`${be}/${n}/hdr_exr/frame_${String(t).padStart(5,"0")}.exr`}function mt(n,t){return`${be}/${n}/sdr_png/frame_${String(t).padStart(5,"0")}.png`}async function we(n,t){if(j)return;j=!0;const e=c(".loading");e.classList.remove("hidden"),e.textContent="Loading EXR…";try{const i=await fetch(ht(n,t));if(!i.ok)throw new Error(`HTTP ${i.status}`);const r=new Uint8Array(await i.arrayBuffer());e.textContent="Decoding…",await new Promise(l=>setTimeout(l,0));const s=performance.now(),o=Ue(r),a=(performance.now()-s).toFixed(0);y=o.interleavedRgbPixels,L=o.width,A=o.height,R.uploadImage(y,L,A),se(c("#canvas")),_(),c("#info-res").textContent=`${L}×${A}`,c("#info-decode").textContent=`${a} ms`,T&&Oe(n,t)}catch(i){e.textContent=`Error: ${i.message}`,j=!1;return}e.classList.add("hidden"),j=!1}function gt(n){const t=n.split(/\r?\n/);let e=0;const i=[];for(const r of t){const s=r.trim();if(!s||s.startsWith("#")||s.startsWith("TITLE")||s.startsWith("DOMAIN"))continue;if(s.startsWith("LUT_3D_SIZE")){e=parseInt(s.split(/\s+/)[1],10);continue}if(s.startsWith("LUT_1D_SIZE"))return null;const o=s.split(/\s+/);if(o.length>=3){const a=parseFloat(o[0]),l=parseFloat(o[1]),d=parseFloat(o[2]);isNaN(a)||i.push(a,l,d)}}return e<2||i.length!==e*e*e*3?null:{size:e,data:new Float32Array(i)}}function Oe(n,t){const e=new Image;e.onload=()=>{R.uploadSDR(e);const i=L/e.naturalWidth,r=A/e.naturalHeight,s=(1-i)/2,o=(1-r)/2;R.sdrCrop=[i,r,s,o],_()},e.src=mt(n,t)}function pt(){return{lift:E.lift.getState(),gamma:E.gamma.getState(),gain:E.gain.getState(),offset:E.offset.getState()}}function _(){y&&(R.render(g),N&&!me&&De({type:"gear:params_changed",params:structuredClone(g),wheels:pt()}),!ce&&(ce=requestAnimationFrame(()=>{ce=0,y&&(ee=R.readHistogramPixels(g),R.render(g),Ne())})))}function Ne(){if(!ee)return;const n=Q.canvas;if(Fe==="parade")lt(Q,ee,320,180,n.width,n.height);else{const[t,e,i]=at(ee);ot(Q,t,e,i,n.width,n.height)}}function vt(){if(!N){let l=function(){h.src=m(S.id),p.textContent=S.label},d=function(f){S=he[f];const x=c("#frame-slider");x.max=String(S.frames-1),c("#tl-end").textContent=String(S.frames-1),C=Math.min(C,S.frames-1),x.value=String(C),c("#frame-num").textContent=String(C),l(),b.querySelectorAll(".clip-item").forEach((U,O)=>{U.classList.toggle("active",O===f)}),w.classList.remove("open"),we(S.id,C)};const u=c("#clip-trigger"),h=c("#clip-trigger-thumb"),p=c("#clip-trigger-name"),w=c("#clip-popup"),b=c("#clip-grid"),m=f=>`${be}/${f}/thumbnail.jpg`;he.forEach((f,x)=>{const U=document.createElement("div");U.className="clip-item"+(x===0?" active":""),U.innerHTML=`<img class="clip-item-thumb" src="${m(f.id)}" loading="lazy" alt=""/><div class="clip-item-name">${f.label}</div>`,U.addEventListener("click",()=>d(x)),b.appendChild(U)}),l(),u.addEventListener("click",f=>{f.stopPropagation(),w.classList.toggle("open")}),document.addEventListener("click",f=>{!w.contains(f.target)&&f.target!==u&&w.classList.remove("open")}),window.addEventListener("keydown",f=>{f.key==="Escape"&&w.classList.remove("open")})}const n=c("#sl-exposure"),t=c("#tb-ev"),e=c("#ev-reset");function i(l){l=Math.max(-6,Math.min(6,l)),g.exposure=l,n.value=String(l),t.value=l.toFixed(2),e.classList.toggle("show",Math.abs(l)>.001),_()}n.addEventListener("input",()=>i(+n.value)),t.addEventListener("change",()=>i(parseFloat(t.value)||0)),t.addEventListener("keydown",l=>{l.key==="Enter"&&t.blur()}),e.addEventListener("click",()=>i(0));const r=c("#tm-select");r.value=String(g.toneMapping),r.addEventListener("change",()=>{g.toneMapping=+r.value,_()});const s=c("#btn-lut"),o=c("#lut-file"),a=c("#lut-name");s.addEventListener("click",()=>{R.lutEnabled?(R.clearLUT(),s.classList.remove("active"),a.textContent="",_()):o.click()}),o.addEventListener("change",()=>{const l=o.files?.[0];if(!l)return;const d=new FileReader;d.onload=()=>{const u=gt(d.result);if(!u){alert("Could not parse .cube file (only 3D LUTs supported)");return}R.uploadLUT(u.data,u.size),s.classList.add("active"),a.textContent=l.name.replace(".cube",""),_()},d.readAsText(l),o.value=""})}function bt(){const n=c("#frame-slider");n.max=String(S.frames-1),n.value=String(C),c("#frame-num").textContent=String(C),c("#tl-end").textContent=String(S.frames-1),n.addEventListener("input",()=>{C=+n.value,c("#frame-num").textContent=String(C)}),n.addEventListener("change",()=>{C=+n.value,we(S.id,C)})}function wt(){F("#sl-softclip","softClip",n=>n.toFixed(2)),F("#sl-contrast","contrast",n=>n.toFixed(2)),F("#sl-pivot","pivot",n=>n.toFixed(2)),F("#sl-shadows","shadows",n=>n.toFixed(2)),F("#sl-highlights","highlights",n=>n.toFixed(2)),F("#sl-temperature","temperature",n=>n.toFixed(2)),F("#sl-tint","tint",n=>n.toFixed(2)),F("#sl-saturation","saturation",n=>n.toFixed(2)),F("#sl-vibrance","vibrance",n=>n.toFixed(2)),F("#sl-hueshift","hueShift",n=>`${n.toFixed(0)}°`),c("#fc-check").addEventListener("change",n=>{g.falseColor=n.target.checked,c(".fc-legend").classList.toggle("show",g.falseColor),_()}),c("#btn-reset").addEventListener("click",Ge)}function Et(){document.querySelectorAll(".scope-tab").forEach(n=>{n.addEventListener("click",()=>{document.querySelectorAll(".scope-tab").forEach(t=>t.classList.remove("active")),n.classList.add("active"),Fe=n.dataset.mode,Ne()})})}function xt(){const n=c("#panel-wrap"),t=c("#btn-panel");function e(){n.classList.toggle("hidden"),t.classList.toggle("active",!n.classList.contains("hidden"))}t.addEventListener("click",e),window.addEventListener("keydown",i=>{i.key==="Tab"&&!i.ctrlKey&&!i.altKey&&document.activeElement?.tagName!=="INPUT"&&(i.preventDefault(),e())}),t.classList.add("active")}function _t(){const n=c("#panel-wrap"),t=c("#panel-resize");let e=!1;t.addEventListener("pointerdown",i=>{e=!0,t.setPointerCapture(i.pointerId),document.body.style.cursor="col-resize",document.body.style.userSelect="none"}),window.addEventListener("pointermove",i=>{e&&(n.style.width=Math.max(260,Math.min(600,document.documentElement.clientWidth-i.clientX))+"px")}),window.addEventListener("pointerup",()=>{e&&(e=!1,document.body.style.cursor="",document.body.style.userSelect="")})}function yt(){const n=c("#btn-compare"),t=c("#wipe-line"),e=c("#wipe-label-l"),i=c("#wipe-label-r"),r=c("#canvas");function s(){T=!T,R.compareOn=T,n.classList.toggle("active",T),t.classList.toggle("active",T),e.classList.toggle("active",T),i.classList.toggle("active",T),T&&Oe(S.id,C),_(),ie()}n.addEventListener("click",s),window.addEventListener("keydown",a=>{a.key==="c"&&!a.ctrlKey&&document.activeElement?.tagName!=="INPUT"&&s()});let o=!1;t.addEventListener("pointerdown",a=>{o=!0,t.setPointerCapture(a.pointerId)}),r.addEventListener("pointerdown",a=>{if(!T||a.ctrlKey)return;o=!0;const l=r.getBoundingClientRect();I=Math.max(.02,Math.min(.98,(a.clientX-l.left)/l.width)),R.wipePos=I,_(),ie()}),window.addEventListener("pointermove",a=>{if(!o||!T)return;const l=r.getBoundingClientRect();I=Math.max(.02,Math.min(.98,(a.clientX-l.left)/l.width)),R.wipePos=I,_(),ie()}),window.addEventListener("pointerup",()=>{o=!1})}function ie(){const n=c("#wipe-line"),t=c("#wipe-label-l"),e=c("#wipe-label-r"),i=c("#canvas"),r=i.getBoundingClientRect(),o=i.closest(".viewport").getBoundingClientRect(),a=r.left-o.left+r.width*I;n.style.left=a+"px",t.style.left=r.left-o.left+r.width*I*.5+"px",e.style.left=r.left-o.left+r.width*(I+(1-I)*.5)+"px"}let re=1,H=0,$=0;function ge(n){n.style.transformOrigin="50% 50%",n.style.transform=`translate(${H}px, ${$}px) scale(${re})`,T&&ie()}function se(n){re=1,H=0,$=0,ge(n)}function Rt(n){let t=!1,e=0,i=0,r=0,s=0;n.addEventListener("wheel",a=>{if(!y)return;a.preventDefault();const l=n.getBoundingClientRect(),d=(a.clientX-l.left)/l.width,u=(a.clientY-l.top)/l.height,h=re,p=Math.exp(-a.deltaY*.0015),w=Math.max(.1,Math.min(64,h*p));if(w===h)return;const b=l.width*(w/h),m=l.height*(w/h),f=l.left+l.width/2-b/2,x=l.top+l.height/2-m/2;H+=a.clientX-d*b-f,$+=a.clientY-u*m-x,re=w,ge(n)},{passive:!1}),n.addEventListener("pointerdown",a=>{y&&(a.ctrlKey||a.button===0&&T||a.button!==0&&a.button!==1||(a.preventDefault(),t=!0,n.setPointerCapture(a.pointerId),e=a.clientX,i=a.clientY,r=H,s=$,n.style.cursor="grabbing"))}),n.addEventListener("pointermove",a=>{t&&(H=r+(a.clientX-e),$=s+(a.clientY-i),ge(n))});const o=()=>{t&&(t=!1,n.style.cursor="")};n.addEventListener("pointerup",o),n.addEventListener("pointercancel",o),n.addEventListener("dblclick",a=>{T||a.ctrlKey||se(n)}),window.addEventListener("keydown",a=>{const l=document.activeElement?.tagName;l==="INPUT"||l==="SELECT"||(a.key==="0"||a.key==="f"||a.key==="F")&&se(n)})}function Tt(n){n.addEventListener("mousemove",r=>{if(!y)return;const s=n.getBoundingClientRect(),o=Math.floor((r.clientX-s.left)*L/s.width),a=Math.floor((r.clientY-s.top)*A/s.height);if(o<0||a<0||o>=L||a>=A)return;const l=(a*L+o)*3,d=y[l],u=y[l+1],h=y[l+2];c("#px-coord").textContent=`(${o}, ${a})`,c("#px-rgb").textContent=`R:${B(d)} G:${B(u)} B:${B(h)}`;const p=.2126*d+.7152*u+.0722*h;c("#px-lum").textContent=`L:${B(p)}`,c("#px-swatch").style.background=`rgb(${de(d)*255|0},${de(u)*255|0},${de(h)*255|0})`}),n.addEventListener("mouseleave",()=>{c("#px-coord").textContent="",c("#px-rgb").textContent="",c("#px-lum").textContent=""});const t=c("#probe"),e=t.querySelector(".probe-label"),i=n.closest(".viewport");n.addEventListener("click",r=>{if(!r.ctrlKey||!y){t.classList.remove("show");return}const s=n.getBoundingClientRect(),o=Math.floor((r.clientX-s.left)*L/s.width),a=Math.floor((r.clientY-s.top)*A/s.height);if(o<0||a<0||o>=L||a>=A)return;const l=(a*L+o)*3,d=y[l],u=y[l+1],h=y[l+2],p=.2126*d+.7152*u+.0722*h,w=p>1e-6?Math.log2(p/.18):-1/0,b=w>-20?`${w>=0?"+":""}${w.toFixed(1)} EV`:"−∞ EV",m=i.getBoundingClientRect(),f=r.clientX-m.left,x=r.clientY-m.top;t.style.left=f+"px",t.style.top=x+"px",f>m.width*.65?(e.style.left="auto",e.style.right="14px"):(e.style.left="14px",e.style.right="auto"),e.innerHTML=`<span style="color:var(--dim)">(${o}, ${a})</span><span class="pr">R: ${B(d)}</span><span class="pg">G: ${B(u)}</span><span class="pb">B: ${B(h)}</span><span class="pl">L: ${B(p)}</span><span class="pev">${b}</span>`,t.classList.add("show")}),window.addEventListener("keydown",r=>{r.key==="Escape"&&t.classList.remove("show")})}function F(n,t,e){const i=c(n),r=i.closest(".slider-row").querySelector(".label-row"),s=r.querySelector(".val"),o=ve[t],a=document.createElement("input");a.type="number",a.className="val-input",a.step=i.step,a.min=i.min,a.max=i.max,s.replaceWith(a);const l=document.createElement("button");l.className="sl-reset",l.innerHTML="&#x21ba;",l.title=`Reset to ${e(o)}`,r.insertBefore(l,a);function d(u){g[t]=u,i.value=String(u),a.value=e(u).replace("°",""),l.classList.toggle("show",Math.abs(u-o)>.001),_()}d(g[t]),i.addEventListener("input",()=>d(+i.value)),a.addEventListener("change",()=>{let u=parseFloat(a.value);isNaN(u)&&(u=o),d(Math.max(+i.min,Math.min(+i.max,u)))}),a.addEventListener("keydown",u=>{u.key==="Enter"&&a.blur()}),l.addEventListener("click",()=>d(o))}function M(n,t){c(n).value=String(t),c(n).dispatchEvent(new Event("input"))}function Ge(){g=structuredClone(ve),c("#sl-exposure").value="0",c("#tb-ev").value="0.00",c("#ev-reset").classList.remove("show"),c("#tm-select").value=String(g.toneMapping),M("#sl-softclip",g.softClip),M("#sl-contrast",g.contrast),M("#sl-pivot",g.pivot),M("#sl-shadows",g.shadows),M("#sl-highlights",g.highlights),M("#sl-temperature",g.temperature),M("#sl-tint",g.tint),M("#sl-saturation",g.saturation),M("#sl-vibrance",g.vibrance),M("#sl-hueshift",g.hueShift),E.lift.reset(),E.gamma.reset(),E.gain.reset(),E.offset.reset(),c("#fc-check").checked=!1,c(".fc-legend").classList.remove("show"),_()}function B(n){return Math.abs(n)>=10?n.toFixed(2):n.toFixed(4)}function de(n){return Math.max(0,Math.min(1,n))}ct().catch(console.error);
