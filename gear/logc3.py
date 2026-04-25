"""ARRI LogC3 EI 800 encode / decode.

Matches the reference LogC3 curve used by the HDR LoRA training pipeline
(see HDR_diffusion/scripts/logc3.py). Keep parameters in sync if the LoRA
retrains at a different exposure index.
"""
import torch


# ARRI LogC3 EI 800 parameters
_A = 5.555556
_B = 0.052272
_C = 0.247190
_D = 0.385537
_E = 5.367655
_F = 0.092809
_CUT = 0.010591


def decompress(logc01: torch.Tensor) -> torch.Tensor:
    """[0, 1] LogC3-compressed -> [0, inf) scene-linear HDR."""
    logc = torch.clamp(logc01, 0.0, 1.0)
    cut_log = _E * _CUT + _F
    lin_from_log = (torch.pow(10.0, (logc - _D) / _C) - _B) / _A
    lin_from_lin = (logc - _F) / _E
    return torch.where(logc >= cut_log, lin_from_log, lin_from_lin)


def compress(linear: torch.Tensor) -> torch.Tensor:
    """[0, inf) scene-linear HDR -> [0, 1] LogC3-compressed."""
    lin = torch.clamp(linear, min=0.0)
    log_from_log = _C * torch.log10(_A * lin + _B) + _D
    log_from_lin = _E * lin + _F
    return torch.where(lin >= _CUT, log_from_log, log_from_lin).clamp(0.0, 1.0)
