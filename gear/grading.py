"""Torch port of exr-viewer's WebGL grading pipeline.

Source of truth:
  D:/AI/Lightricks/HDR_demo/Project_page/exr-viewer/src/renderer.ts
  (main() fragment shader + matrices + tone mappers)

Section headers below mirror renderer.ts 1:1. When updating, diff the
two files section-by-section and propagate only the deltas.

Pipeline (all scene-linear Rec.709 in, display-referred sRGB out):
  Exposure -> White-balance -> [ACEScct] -> LGGO -> Contrast ->
  Shadows/Highlights -> Vibrance -> Saturation -> [linear] -> Hue Shift ->
  Tone Map -> Soft Clip -> sRGB OETF
"""
from dataclasses import dataclass, field
from typing import Optional, Tuple

import torch


@dataclass
class RenderParams:
    exposure: float = 0.0
    tone_mapping: int = 2          # 0 none, 1 Reinhard, 2 ACES Fitted, 3 AgX, 4 Hable
    soft_clip: float = 0.0
    temperature: float = 0.0
    tint: float = 0.0
    lift: Tuple[float, float, float] = (0.0, 0.0, 0.0)
    gamma: Tuple[float, float, float] = (1.0, 1.0, 1.0)
    gain: Tuple[float, float, float] = (1.0, 1.0, 1.0)
    offset: Tuple[float, float, float] = (0.0, 0.0, 0.0)
    contrast: float = 1.0
    pivot: float = 0.18
    shadows: float = 0.0
    highlights: float = 0.0
    saturation: float = 1.0
    vibrance: float = 0.0
    hue_shift: float = 0.0
    false_color: bool = False


DEFAULT_PARAMS = RenderParams()


# ─────────────────────────────────────────────────────────
#  sRGB OETF / EOTF
# ─────────────────────────────────────────────────────────
def linear_to_srgb(c: torch.Tensor) -> torch.Tensor:
    lo = c * 12.92
    hi = 1.055 * torch.pow(c.clamp(min=1e-10), 1.0 / 2.4) - 0.055
    return torch.where(c < 0.0031308, lo, hi)


def srgb_to_linear(c: torch.Tensor) -> torch.Tensor:
    lo = c / 12.92
    hi = torch.pow(((c + 0.055) / 1.055).clamp(min=1e-10), 2.4)
    return torch.where(c < 0.04045, lo, hi)


# ─────────────────────────────────────────────────────────
#  Matrices (row-major in renderer.ts' GLSL mat3 layout — transposed here
#  because GLSL mat3(a,b,c,d,e,f,g,h,i) is column-major-constructed, so
#  rows of `sRGB_to_AP1` below equal the GLSL columns.)
# ─────────────────────────────────────────────────────────
_ACES_INPUT = torch.tensor([
    [0.59719, 0.35458, 0.04823],
    [0.07600, 0.90834, 0.01566],
    [0.02840, 0.13383, 0.83777],
])
_ACES_OUTPUT = torch.tensor([
    [ 1.60475, -0.53108, -0.07367],
    [-0.10208,  1.10813, -0.00605],
    [-0.00327, -0.07276,  1.07602],
])
_AGX_INSET = torch.tensor([
    [0.842479062253094,  0.0784335999999992, 0.0792237451477643],
    [0.0423282422610123, 0.878468636469772,  0.0791661274605434],
    [0.0423756549057051, 0.0784336,          0.879142973793104],
])
_AGX_OUTSET = torch.tensor([
    [ 1.19687900512017,   -0.0980208811401368, -0.0990297440797205],
    [-0.0528968517574562,  1.15190312990417,   -0.0989611768448433],
    [-0.0529716355144438, -0.0980434501171241,  1.15107367264116],
])
_SRGB_TO_AP1 = torch.tensor([
    [0.61319, 0.33951, 0.04737],
    [0.07012, 0.91637, 0.01345],
    [0.02058, 0.10961, 0.86981],
])
_AP1_TO_SRGB = torch.tensor([
    [ 1.70505, -0.62179, -0.08326],
    [-0.13026,  1.14080, -0.01055],
    [-0.02400, -0.12897,  1.15297],
])


def _mm(m: torch.Tensor, c: torch.Tensor) -> torch.Tensor:
    """Apply 3x3 color matrix to tensor shaped [..., 3]."""
    m = m.to(device=c.device, dtype=c.dtype)
    return torch.einsum("ij,...j->...i", m, c)


_LUMA = (0.2126, 0.7152, 0.0722)
_AP1_LUMA = (0.2722, 0.6741, 0.0537)


def _luma(c: torch.Tensor, w=_LUMA) -> torch.Tensor:
    w_t = torch.tensor(w, device=c.device, dtype=c.dtype)
    return (c * w_t).sum(dim=-1, keepdim=True)


# ─────────────────────────────────────────────────────────
#  Tone mappers
# ─────────────────────────────────────────────────────────
def _reinhard(c: torch.Tensor) -> torch.Tensor:
    Lin = _luma(c)
    Lout = Lin / (1.0 + Lin)
    return c * (Lout / Lin.clamp(min=1e-6))


def _rrt_odt_fit(v: torch.Tensor) -> torch.Tensor:
    a = v * (v + 0.0245786) - 0.000090537
    b = v * (0.983729 * v + 0.4329510) + 0.238081
    return a / b


def _aces_fitted(c: torch.Tensor) -> torch.Tensor:
    c = _mm(_ACES_INPUT, c.clamp(min=0.0))
    c = _rrt_odt_fit(c)
    c = _mm(_ACES_OUTPUT, c)
    return c.clamp(0.0, 1.0)


def _agx_contrast_approx(x: torch.Tensor) -> torch.Tensor:
    x2 = x * x
    x4 = x2 * x2
    return (15.5 * x4 * x2 - 40.14 * x4 * x + 31.96 * x4
            - 6.868 * x2 * x + 0.4298 * x2 + 0.1191 * x - 0.00232)


def _agx(v: torch.Tensor) -> torch.Tensor:
    v = _mm(_AGX_INSET, v.clamp(min=1e-10))
    v = torch.log2(v).clamp(-12.47393, 4.026069)
    v = (v + 12.47393) / (4.026069 + 12.47393)
    v = _agx_contrast_approx(v)
    v = _mm(_AGX_OUTSET, v)
    return v.clamp(0.0, 1.0)


def _hable_curve(x: torch.Tensor) -> torch.Tensor:
    A, B, C, D, E, F = 0.15, 0.50, 0.10, 0.20, 0.02, 0.30
    return ((x * (A * x + C * B) + D * E) / (x * (A * x + B) + D * F)) - E / F


def _hable_filmic(x: torch.Tensor) -> torch.Tensor:
    white = _hable_curve(torch.tensor(11.2, device=x.device, dtype=x.dtype))
    return _hable_curve(x * 2.0) / white


# ─────────────────────────────────────────────────────────
#  HSV (for hue shift)
# ─────────────────────────────────────────────────────────
def _rgb_to_hsv(c: torch.Tensor) -> torch.Tensor:
    r, g, b = c[..., 0], c[..., 1], c[..., 2]
    mx, _ = c.max(dim=-1)
    mn, _ = c.min(dim=-1)
    d = mx - mn
    eps = 1e-10
    s = d / (mx + eps)
    # hue
    h = torch.zeros_like(mx)
    rc = (mx - r) / (d + eps)
    gc = (mx - g) / (d + eps)
    bc = (mx - b) / (d + eps)
    h_r = (bc - gc)
    h_g = 2.0 + (rc - bc)
    h_b = 4.0 + (gc - rc)
    h = torch.where(mx == r, h_r, torch.where(mx == g, h_g, h_b))
    h = (h / 6.0) % 1.0
    return torch.stack([h, s, mx], dim=-1)


def _hsv_to_rgb(c: torch.Tensor) -> torch.Tensor:
    h, s, v = c[..., 0], c[..., 1], c[..., 2]
    i = (h * 6.0).floor()
    f = h * 6.0 - i
    p = v * (1.0 - s)
    q = v * (1.0 - s * f)
    t = v * (1.0 - s * (1.0 - f))
    i = i.long() % 6
    r = torch.where(i == 0, v, torch.where(i == 1, q, torch.where(i == 2, p, torch.where(i == 3, p, torch.where(i == 4, t, v)))))
    g = torch.where(i == 0, t, torch.where(i == 1, v, torch.where(i == 2, v, torch.where(i == 3, q, torch.where(i == 4, p, p)))))
    b = torch.where(i == 0, p, torch.where(i == 1, p, torch.where(i == 2, t, torch.where(i == 3, v, torch.where(i == 4, v, q)))))
    return torch.stack([r, g, b], dim=-1)


# ─────────────────────────────────────────────────────────
#  False-color
# ─────────────────────────────────────────────────────────
_FC_STOPS = [
    (-1e30, (0.0, 0.0, 0.25)),
    (0.0,   (0.0, 0.0, 0.25)),
    (0.01,  (0.0, 0.0, 1.0)),
    (0.09,  (0.0, 0.7, 1.0)),
    (0.18,  (0.0, 0.5, 0.0)),
    (0.5,   (0.0, 1.0, 0.0)),
    (1.0,   (1.0, 1.0, 0.0)),
    (2.0,   (1.0, 0.5, 0.0)),
    (8.0,   (1.0, 0.0, 0.0)),
    (32.0,  (1.0, 0.0, 1.0)),
]


def _false_color_map(L: torch.Tensor) -> torch.Tensor:
    out = torch.zeros(*L.shape, 3, device=L.device, dtype=L.dtype)
    for (l0, c0), (l1, c1) in zip(_FC_STOPS[:-1], _FC_STOPS[1:]):
        mask = (L >= l0) & (L < l1)
        if not mask.any():
            continue
        t = ((L - l0) / max(l1 - l0, 1e-30)).clamp(0.0, 1.0)
        c0_t = torch.tensor(c0, device=L.device, dtype=L.dtype)
        c1_t = torch.tensor(c1, device=L.device, dtype=L.dtype)
        col = c0_t + (c1_t - c0_t) * t.unsqueeze(-1)
        out = torch.where(mask.unsqueeze(-1), col, out)
    # clamp to final color above last stop
    last = torch.tensor(_FC_STOPS[-1][1], device=L.device, dtype=L.dtype)
    out = torch.where((L >= _FC_STOPS[-1][0]).unsqueeze(-1), last.expand_as(out), out)
    return out


# ─────────────────────────────────────────────────────────
#  Soft clip (DJV / exrdisplay exponential shoulder)
# ─────────────────────────────────────────────────────────
def _soft_clip(c: torch.Tensor, knee: float) -> torch.Tensor:
    if knee <= 0.0:
        return c
    t = 1.0 - knee
    over = c > t
    shoulder = t + (1.0 - torch.exp(-(c - t) / knee)) * knee
    return torch.where(over, shoulder, c)


# ─────────────────────────────────────────────────────────
#  ACEScct grading space
# ─────────────────────────────────────────────────────────
def _cct_encode(x: torch.Tensor) -> torch.Tensor:
    lo = 10.5402377416545 * x + 0.0729055341958355
    hi = (torch.log2(x.clamp(min=1e-10)) + 9.72) / 17.52
    return torch.where(x <= 0.0078125, lo, hi)


def _cct_decode(x: torch.Tensor) -> torch.Tensor:
    lo = (x - 0.0729055341958355) / 10.5402377416545
    hi = torch.exp2(x * 17.52 - 9.72)
    return torch.where(x <= 0.155251141552511, lo, hi)


# ═════════════════════════════════════════════════════════
#  MAIN — mirrors renderer.ts main()
# ═════════════════════════════════════════════════════════
def grade(image: torch.Tensor, p: RenderParams, is_srgb_input: bool = False) -> torch.Tensor:
    """Apply the exr-viewer grading pipeline.

    image: [..., 3] float tensor. When is_srgb_input=True, input is decoded
           from sRGB to linear first (used for SDR compare).
    Returns display-referred sRGB in [0, 1].
    """
    c = image.to(dtype=torch.float32)
    if is_srgb_input:
        c = srgb_to_linear(c.clamp(0.0, 1.0))

    # 1. Exposure
    c = c * (2.0 ** p.exposure)

    # False-color bypass
    if p.false_color:
        L = _luma(c).squeeze(-1)
        return _false_color_map(L)

    # 2. White balance (linear)
    wb = torch.tensor([
        1.0 + p.temperature * 0.45,
        1.0 + p.tint * 0.35,
        1.0 - p.temperature * 0.45,
    ], device=c.device, dtype=c.dtype)
    c = c * wb

    # ── Enter ACEScct grading space ────────────────────────
    ap1 = _mm(_SRGB_TO_AP1, c.clamp(min=0.0))
    cct = _cct_encode(ap1)

    # 3. LGGO (ACEScct log space)
    offset = torch.tensor(p.offset, device=c.device, dtype=c.dtype)
    lift   = torch.tensor(p.lift,   device=c.device, dtype=c.dtype)
    gain   = torch.tensor(p.gain,   device=c.device, dtype=c.dtype)
    gamma  = torch.tensor(p.gamma,  device=c.device, dtype=c.dtype).clamp(min=0.01)
    cct = cct + offset
    luma_cct = _luma(cct, _AP1_LUMA)
    cct = cct + lift * (1.0 - luma_cct * 2.0).clamp(0.0, 1.0)
    cct = cct * gain
    cct = torch.pow(cct.clamp(min=0.0), 1.0 / gamma)

    # 4. Contrast around pivot (log space)
    log_pivot = _cct_encode(torch.tensor(p.pivot, device=c.device, dtype=c.dtype))
    cct = (cct - log_pivot) * p.contrast + log_pivot

    # 5. Shadows / Highlights (log space)
    luma_cct = _luma(cct, _AP1_LUMA)
    sW = 1.0 / (1.0 + torch.exp(12.0 * (luma_cct - 0.3)))
    hW = 1.0 / (1.0 + torch.exp(-12.0 * (luma_cct - 0.6)))
    cct = cct + p.shadows    * sW * 0.15
    cct = cct + p.highlights * hW * 0.15

    # 6. Vibrance (log space)
    if abs(p.vibrance) > 0.001:
        luma_cct = _luma(cct, _AP1_LUMA).squeeze(-1)
        chroma = cct.max(dim=-1).values - cct.min(dim=-1).values
        boost = (1.0 - chroma * 2.0) * p.vibrance
        cct = luma_cct.unsqueeze(-1) + (cct - luma_cct.unsqueeze(-1)) * (1.0 + boost).unsqueeze(-1)

    # 7. Saturation (log space)
    luma_cct = _luma(cct, _AP1_LUMA)
    cct = luma_cct + (cct - luma_cct) * p.saturation

    # ── Exit ACEScct → linear sRGB ─────────────────────────
    ap1 = _cct_decode(cct.clamp(min=0.0))
    c = _mm(_AP1_TO_SRGB, ap1).clamp(min=0.0)

    # 8. Hue shift (linear sRGB)
    if abs(p.hue_shift) > 0.1:
        hsv = _rgb_to_hsv(c)
        hsv = torch.stack([
            (hsv[..., 0] + p.hue_shift / 360.0) % 1.0,
            hsv[..., 1],
            hsv[..., 2],
        ], dim=-1)
        c = _hsv_to_rgb(hsv)

    # 9. Tone map
    c = c.clamp(min=0.0)
    if   p.tone_mapping == 1: c = _reinhard(c)
    elif p.tone_mapping == 2: c = _aces_fitted(c)
    elif p.tone_mapping == 3: c = _agx(c)
    elif p.tone_mapping == 4: c = _hable_filmic(c)

    # 10. Soft clip
    c = _soft_clip(c, p.soft_clip)

    # 11. sRGB OETF
    return linear_to_srgb(c.clamp(0.0, 1.0))


def grade_linear(image: torch.Tensor, p: RenderParams, is_srgb_input: bool = False) -> torch.Tensor:
    """Same as grade() but stops after the linear-sRGB hue-shift stage (pre-tonemap).
    Returns scene-linear, pre-tonemap HDR — suitable for saving as EXR.
    """
    c = image.to(dtype=torch.float32)
    if is_srgb_input:
        c = srgb_to_linear(c.clamp(0.0, 1.0))

    c = c * (2.0 ** p.exposure)

    if p.false_color:
        # false color is inherently display-referred; caller should use grade() for that
        L = _luma(c).squeeze(-1)
        return _false_color_map(L)

    wb = torch.tensor([
        1.0 + p.temperature * 0.45,
        1.0 + p.tint * 0.35,
        1.0 - p.temperature * 0.45,
    ], device=c.device, dtype=c.dtype)
    c = c * wb

    ap1 = _mm(_SRGB_TO_AP1, c.clamp(min=0.0))
    cct = _cct_encode(ap1)

    offset = torch.tensor(p.offset, device=c.device, dtype=c.dtype)
    lift   = torch.tensor(p.lift,   device=c.device, dtype=c.dtype)
    gain   = torch.tensor(p.gain,   device=c.device, dtype=c.dtype)
    gamma  = torch.tensor(p.gamma,  device=c.device, dtype=c.dtype).clamp(min=0.01)
    cct = cct + offset
    luma_cct = _luma(cct, _AP1_LUMA)
    cct = cct + lift * (1.0 - luma_cct * 2.0).clamp(0.0, 1.0)
    cct = cct * gain
    cct = torch.pow(cct.clamp(min=0.0), 1.0 / gamma)

    log_pivot = _cct_encode(torch.tensor(p.pivot, device=c.device, dtype=c.dtype))
    cct = (cct - log_pivot) * p.contrast + log_pivot

    luma_cct = _luma(cct, _AP1_LUMA)
    sW = 1.0 / (1.0 + torch.exp(12.0 * (luma_cct - 0.3)))
    hW = 1.0 / (1.0 + torch.exp(-12.0 * (luma_cct - 0.6)))
    cct = cct + p.shadows    * sW * 0.15
    cct = cct + p.highlights * hW * 0.15

    if abs(p.vibrance) > 0.001:
        luma_cct = _luma(cct, _AP1_LUMA).squeeze(-1)
        chroma = cct.max(dim=-1).values - cct.min(dim=-1).values
        boost = (1.0 - chroma * 2.0) * p.vibrance
        cct = luma_cct.unsqueeze(-1) + (cct - luma_cct.unsqueeze(-1)) * (1.0 + boost).unsqueeze(-1)

    luma_cct = _luma(cct, _AP1_LUMA)
    cct = luma_cct + (cct - luma_cct) * p.saturation

    ap1 = _cct_decode(cct.clamp(min=0.0))
    c = _mm(_AP1_TO_SRGB, ap1).clamp(min=0.0)

    if abs(p.hue_shift) > 0.1:
        hsv = _rgb_to_hsv(c)
        hsv = torch.stack([
            (hsv[..., 0] + p.hue_shift / 360.0) % 1.0,
            hsv[..., 1],
            hsv[..., 2],
        ], dim=-1)
        c = _hsv_to_rgb(hsv)

    return c.clamp(min=0.0)
