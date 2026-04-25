// ──────────────────────────────────────────────────────────
// WebGL2 HDR Renderer — professional display pipeline
//
// Grading (all scene-linear Rec.709):
//   Exposure → White-balance → Lift/Gamma/Gain/Offset →
//   Contrast → Shadows/Highlights → Vibrance → Saturation →
//   Hue Shift → Tone Map → Soft Clip → Dither → sRGB OETF
//
// Tone mappers:
//   0  None (pass-through to soft clip / clamp)
//   1  Reinhard (luminance-preserving)
//   2  ACES Fitted (Stephen Hill — AP1 round-trip)
//   3  AgX (full inset+outset)
//   4  Hable / Uncharted 2
// ──────────────────────────────────────────────────────────
export const DEFAULT_PARAMS = {
    exposure: 0, toneMapping: 2, softClip: 0,
    temperature: 0, tint: 0,
    lift: [0, 0, 0], gamma: [1, 1, 1], gain: [1, 1, 1], offset: [0, 0, 0],
    contrast: 1, pivot: 0.18, shadows: 0, highlights: 0,
    saturation: 1, vibrance: 0, hueShift: 0, falseColor: false,
};
// ── Shaders ──────────────────────────────────────────────
const VERT = /* glsl */ `#version 300 es
layout(location=0) in vec2 aPos;
out vec2 vUv;
void main(){
  vUv = aPos * 0.5 + 0.5;
  gl_Position = vec4(aPos, 0.0, 1.0);
}`;
const FRAG = /* glsl */ `#version 300 es
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
}`;
// ── GL helpers ───────────────────────────────────────────
function compile(gl, type, src) {
    const s = gl.createShader(type);
    gl.shaderSource(s, src);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
        throw new Error('Shader compile:\n' + gl.getShaderInfoLog(s));
    return s;
}
function linkProg(gl, vs, fs) {
    const p = gl.createProgram();
    gl.attachShader(p, vs);
    gl.attachShader(p, fs);
    gl.linkProgram(p);
    if (!gl.getProgramParameter(p, gl.LINK_STATUS))
        throw new Error('Program link:\n' + gl.getProgramInfoLog(p));
    return p;
}
const U_NAMES = [
    'uTex', 'uTexSDR', 'uExposure', 'uToneMap', 'uSoftClip',
    'uTemperature', 'uTint',
    'uLift', 'uGamma', 'uGain', 'uOffset',
    'uContrast', 'uPivot', 'uShadows', 'uHighlights',
    'uSaturation', 'uVibrance', 'uHueShift', 'uFalseColor',
    'uCompareOn', 'uWipePos', 'uSDRCrop',
    'uLUT3D', 'uLUTEnabled', 'uLUTSize',
];
const HIST_W = 320, HIST_H = 180;
export class HDRRenderer {
    constructor(canvas) {
        this.canvas = canvas;
        this.imageWidth = 0;
        this.imageHeight = 0;
        this.compareOn = false;
        this.wipePos = 0.5;
        this.sdrCrop = [1, 1, 0, 0];
        this.lutEnabled = false;
        this.lutSize = 33; // scaleX, scaleY, offsetX, offsetY
        const gl = canvas.getContext('webgl2', { antialias: false, premultipliedAlpha: false });
        if (!gl)
            throw new Error('WebGL2 not supported');
        this.gl = gl;
        const vs = compile(gl, gl.VERTEX_SHADER, VERT);
        const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG);
        this.prog = linkProg(gl, vs, fs);
        this.u = {};
        for (const n of U_NAMES)
            this.u[n] = gl.getUniformLocation(this.prog, n);
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        const buf = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
        gl.enableVertexAttribArray(0);
        gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
        gl.bindVertexArray(null);
        // HDR texture (float)
        this.tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // SDR texture (8-bit, for compare mode)
        this.texSDR = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texSDR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        // 3D LUT texture
        this.lutTex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_3D, this.lutTex);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_3D, gl.TEXTURE_WRAP_R, gl.CLAMP_TO_EDGE);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
        this.histFBO = gl.createFramebuffer();
        this.histRBO = gl.createRenderbuffer();
        gl.bindRenderbuffer(gl.RENDERBUFFER, this.histRBO);
        gl.renderbufferStorage(gl.RENDERBUFFER, gl.RGBA8, HIST_W, HIST_H);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.histFBO);
        gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.RENDERBUFFER, this.histRBO);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    }
    uploadImage(rgb, w, h) {
        this.imageWidth = w;
        this.imageHeight = h;
        const px = w * h;
        const rgba = new Float32Array(px * 4);
        for (let i = 0; i < px; i++) {
            rgba[i * 4] = rgb[i * 3];
            rgba[i * 4 + 1] = rgb[i * 3 + 1];
            rgba[i * 4 + 2] = rgb[i * 3 + 2];
            rgba[i * 4 + 3] = 1;
        }
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA16F, w, h, 0, gl.RGBA, gl.FLOAT, rgba);
        this.canvas.width = w;
        this.canvas.height = h;
    }
    /** Upload a parsed 3D LUT. data is Float32Array of size³×3 RGB triplets. */
    uploadLUT(data, size) {
        const gl = this.gl;
        this.lutSize = size;
        // Expand RGB→RGBA (WebGL2 TEXTURE_3D needs RGBA for float)
        const rgba = new Float32Array(size * size * size * 4);
        for (let i = 0; i < size * size * size; i++) {
            rgba[i * 4] = data[i * 3];
            rgba[i * 4 + 1] = data[i * 3 + 1];
            rgba[i * 4 + 2] = data[i * 3 + 2];
            rgba[i * 4 + 3] = 1.0;
        }
        gl.bindTexture(gl.TEXTURE_3D, this.lutTex);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false); // critical: don't flip LUT slices
        gl.texImage3D(gl.TEXTURE_3D, 0, gl.RGBA16F, size, size, size, 0, gl.RGBA, gl.FLOAT, rgba);
        gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true); // restore for EXR/SDR textures
        this.lutEnabled = true;
    }
    clearLUT() {
        this.lutEnabled = false;
    }
    /** Upload an SDR PNG for compare mode. */
    uploadSDR(img) {
        const gl = this.gl;
        gl.bindTexture(gl.TEXTURE_2D, this.texSDR);
        // Disable browser color-management / ICC conversion — we want raw sRGB bytes
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.NONE);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, false);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8, gl.RGBA, gl.UNSIGNED_BYTE, img);
        // Restore defaults
        gl.pixelStorei(gl.UNPACK_COLORSPACE_CONVERSION_WEBGL, gl.BROWSER_DEFAULT_WEBGL);
    }
    setUniforms(p) {
        const gl = this.gl;
        gl.useProgram(this.prog);
        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, this.tex);
        gl.uniform1i(this.u.uTex, 0);
        gl.activeTexture(gl.TEXTURE1);
        gl.bindTexture(gl.TEXTURE_2D, this.texSDR);
        gl.uniform1i(this.u.uTexSDR, 1);
        gl.uniform1i(this.u.uCompareOn, this.compareOn ? 1 : 0);
        gl.uniform1f(this.u.uWipePos, this.wipePos);
        gl.uniform4f(this.u.uSDRCrop, this.sdrCrop[0], this.sdrCrop[1], this.sdrCrop[2], this.sdrCrop[3]);
        gl.activeTexture(gl.TEXTURE2);
        gl.bindTexture(gl.TEXTURE_3D, this.lutTex);
        gl.uniform1i(this.u.uLUT3D, 2);
        gl.uniform1i(this.u.uLUTEnabled, this.lutEnabled ? 1 : 0);
        gl.uniform1f(this.u.uLUTSize, this.lutSize);
        gl.uniform1f(this.u.uExposure, p.exposure);
        gl.uniform1i(this.u.uToneMap, p.toneMapping);
        gl.uniform1f(this.u.uSoftClip, p.softClip);
        gl.uniform1f(this.u.uTemperature, p.temperature);
        gl.uniform1f(this.u.uTint, p.tint);
        gl.uniform3f(this.u.uLift, p.lift[0], p.lift[1], p.lift[2]);
        gl.uniform3f(this.u.uGamma, p.gamma[0], p.gamma[1], p.gamma[2]);
        gl.uniform3f(this.u.uGain, p.gain[0], p.gain[1], p.gain[2]);
        gl.uniform3f(this.u.uOffset, p.offset[0], p.offset[1], p.offset[2]);
        gl.uniform1f(this.u.uContrast, p.contrast);
        gl.uniform1f(this.u.uPivot, p.pivot);
        gl.uniform1f(this.u.uShadows, p.shadows);
        gl.uniform1f(this.u.uHighlights, p.highlights);
        gl.uniform1f(this.u.uSaturation, p.saturation);
        gl.uniform1f(this.u.uVibrance, p.vibrance);
        gl.uniform1f(this.u.uHueShift, p.hueShift);
        gl.uniform1i(this.u.uFalseColor, p.falseColor ? 1 : 0);
        gl.bindVertexArray(this.vao);
    }
    render(p) {
        const gl = this.gl;
        this.setUniforms(p);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        gl.viewport(0, 0, this.canvas.width, this.canvas.height);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    }
    readHistogramPixels(p) {
        const gl = this.gl;
        this.setUniforms(p);
        gl.bindFramebuffer(gl.FRAMEBUFFER, this.histFBO);
        gl.viewport(0, 0, HIST_W, HIST_H);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        const buf = new Uint8Array(HIST_W * HIST_H * 4);
        gl.readPixels(0, 0, HIST_W, HIST_H, gl.RGBA, gl.UNSIGNED_BYTE, buf);
        gl.bindFramebuffer(gl.FRAMEBUFFER, null);
        return buf;
    }
    destroy() {
        const gl = this.gl;
        gl.deleteProgram(this.prog);
        gl.deleteTexture(this.tex);
        gl.deleteFramebuffer(this.histFBO);
        gl.deleteRenderbuffer(this.histRBO);
    }
}
//# sourceMappingURL=renderer.js.map