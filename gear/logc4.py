"""ARRI LogC4 encode / decode.

LogC4 is the wider-headroom successor to LogC3 used by the ALEXA 35 era. Maps
linear [-0.018, ~469.8] -> [0, 1]. Compared to LogC3 (EI 800):
  - LogC3 ceiling: ~55.2 linear (≈8.3 stops above 0.18 mid-gray)
  - LogC4 ceiling: ~469.8 linear (≈11.3 stops above 0.18 mid-gray)

Use this decoder when the upstream LoRA was trained with LogC4 targets
(naming convention: `v10_logc4_*`, `klein*_v10_logc4_*`). Mismatched curve =
wrong linear output.

Reference: HDR_diffusion/scripts/logc4.py
"""
import math

import torch


# ARRI LogC4 curve constants (white paper)
_A = (2.0 ** 18 - 16) / 117.45                     # ~2231.8263
_B = (1023.0 - 95.0) / 1023.0                      # ~0.9071358
_C = 95.0 / 1023.0                                  # ~0.0928641
_S = (7.0 * math.log(2.0) * 2.0 ** (7.0 - 14.0 * (95.0 / 1023.0) / ((1023.0 - 95.0) / 1023.0))) / (
    ((2.0 ** 18 - 16) / 117.45) * ((1023.0 - 95.0) / 1023.0)
)
_T = (2.0 ** (14.0 * (-(95.0 / 1023.0) / ((1023.0 - 95.0) / 1023.0)) + 6.0) - 64.0) / (
    (2.0 ** 18 - 16) / 117.45
)


def decompress(logc01: torch.Tensor) -> torch.Tensor:
    """[0, 1] LogC4-compressed -> [≈-0.018, ~469.8] scene-linear HDR."""
    logc = torch.clamp(logc01, 0.0, 1.0)
    exp_arg = 14.0 * (logc - _C) / _B + 6.0
    lin_from_log = (torch.pow(2.0, exp_arg) - 64.0) / _A
    lin_from_lin = (logc - _C) * _S + _T
    return torch.where(logc >= _C, lin_from_log, lin_from_lin)


def compress(linear: torch.Tensor) -> torch.Tensor:
    """[≈-0.018, ~469.8] scene-linear HDR -> [0, 1] LogC4-compressed."""
    lin = torch.clamp(linear, min=_T)
    log_arg = _A * lin + 64.0
    log_arg = torch.clamp(log_arg, min=1e-12)
    log_from_log = (torch.log2(log_arg) - 6.0) / 14.0 * _B + _C
    log_from_lin = (lin - _T) / _S + _C
    # Boundary at x = T (lin == T -> log_arg == 2^(6 - 14*C/B) -> log_part == C)
    return torch.where(lin > _T, log_from_log, log_from_lin).clamp(0.0, 1.0)
