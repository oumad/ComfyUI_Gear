"""ACEScct encode / decode (AMPAS S-2016-001).

ACEScct is an ACES *log* encoding with a linear shadow toe ("ct" = with toe),
so grading lifts/offsets behave in deep shadows instead of exploding to wild
negatives. Used here as a pure per-channel transfer curve on scene-linear RGB
(the AP1 primary matrix is deliberately NOT applied -- same convention as the
LogC3/LogC4 curves in this package).

Maps linear [~-0.0069, ~222.86] -> [0, 1]. Above ~222.86 linear the curve clips
at code 1.0. Places 0.18 linear at ACEScct=0.4135 (vs LogC4's 0.278), so far
more of [0,1] is dedicated to shadows/midtones -> better deep-shadow precision.

Use this decoder when the upstream LoRA was trained with ACEScct targets
(the ACEScct Prodigy r128 family). Mismatched curve = wrong linear output.

Reference values (linear -> ACEScct):
   0.0    -> 0.0729   (bounded toe, not a hard floor)
   0.18   -> 0.4135   (mid-gray)
   1.0    -> 0.5547
   222.86 -> 1.0      (ceiling)

Reference: HDR_diffusion/scripts/logc3.py (ACEScct variant)
"""
import torch


# ACEScct curve constants (AMPAS S-2016-001)
_A_LIN = 10.5402377416545      # toe slope
_B_LIN = 0.0729055341958355    # ct at linear 0
_X_BRK = 0.0078125             # linear breakpoint (toe -> log)
_Y_BRK = 0.155251141552511     # ct breakpoint
_LOG_M = 17.52                 # log denominator
_LOG_B = 9.72                  # log offset


def decompress(ct01: torch.Tensor) -> torch.Tensor:
    """[0, 1] ACEScct-compressed -> scene-linear HDR (ceiling ~222.86)."""
    ct = torch.clamp(ct01, 0.0, 1.0)
    lin_from_log = torch.pow(2.0, ct * _LOG_M - _LOG_B)
    lin_from_lin = (ct - _B_LIN) / _A_LIN
    return torch.where(ct > _Y_BRK, lin_from_log, lin_from_lin)


def compress(linear: torch.Tensor) -> torch.Tensor:
    """scene-linear HDR -> [0, 1] ACEScct-compressed."""
    x = torch.clamp(linear, min=0.0)
    log_part = (torch.log2(torch.clamp(x, min=1e-12)) + _LOG_B) / _LOG_M
    lin_part = _A_LIN * x + _B_LIN
    return torch.clamp(torch.where(x > _X_BRK, log_part, lin_part), 0.0, 1.0)
