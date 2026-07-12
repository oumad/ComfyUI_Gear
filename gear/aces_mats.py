"""Primaries matrices for ACES workflows (no OCIO dependency).

REC709_TO_AP1: Linear Rec.709/sRGB primaries (D65) -> ACEScg/AP1 (D60, Bradford
CAT). Lossless containment (709 gamut is inside AP1). Standard ACES matrix.
AP1_TO_REC709 is its inverse (may produce out-of-gamut negatives for saturated
AP1 colors — clamp at display time only).
"""
import torch

REC709_TO_AP1 = [
    [0.61309732, 0.33952285, 0.04737928],
    [0.07019422, 0.91635557, 0.01345021],
    [0.02061591, 0.10956983, 0.86981426],
]

AP1_TO_REC709 = [
    [ 1.70505099, -0.62179212, -0.08325887],
    [-0.13025642,  1.14080474, -0.01054832],
    [-0.02400336, -0.12896898,  1.15297234],
]


def apply_matrix(rgb: torch.Tensor, mat) -> torch.Tensor:
    """rgb: (..., 3) tensor. Returns same shape, matrix applied per-pixel."""
    m = torch.tensor(mat, dtype=rgb.dtype, device=rgb.device)
    return torch.einsum("...c,rc->...r", rgb, m)


def srgb_eotf(display: torch.Tensor) -> torch.Tensor:
    """sRGB display [0,1] -> linear Rec.709 (piecewise sRGB EOTF)."""
    d = torch.clamp(display, 0.0, 1.0)
    return torch.where(d <= 0.04045, d / 12.92, torch.pow((d + 0.055) / 1.055, 2.4))
