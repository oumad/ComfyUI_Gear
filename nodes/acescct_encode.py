"""ACEScct Encode node — compress HDR into the ACEScct [0,1] domain.

The forward direction of Gear · ACEScct Decode: use it to feed HDR content
(e.g. a linear EXR from Gear · Load EXR) into a pipeline that expects
ACEScct-encoded input — such as HDR-to-HDR conditioning of the ACEScct LoRAs.

`input_space` handles the source correctly before the curve:
  - linear_acescg : already ACEScg/AP1 scene-linear — curve only (canonical).
  - linear_rec709 : scene-linear with Rec.709/sRGB primaries (e.g. Poly Haven,
                    Blender default) — 709->AP1 matrix, then curve.
  - srgb_display  : display-referred sRGB [0,1] (ordinary PNG/JPG) — sRGB EOTF
                    -> linear 709 -> AP1 -> curve.
"""
import torch

from ..gear import acescct
from ..gear.aces_mats import REC709_TO_AP1, apply_matrix, srgb_eotf


class GearACEScctEncode:
    """Linear HDR -> ACEScct [0,1] (with optional primaries/EOTF handling).

    Inputs
    - image: IMAGE, values may exceed 1.0 for linear inputs.
    - input_space: see module docstring.
    - exposure_ev: pre-encode exposure shift in stops (linear *= 2^ev).

    Output
    - image: ACEScct-encoded IMAGE in [0,1] (values above ~222.86 linear clip
      at code 1.0). This is what the ACEScct LoRA pipelines expect as input.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                "input_space": (["linear_acescg", "linear_rec709", "srgb_display"],),
                "exposure_ev": ("FLOAT", {"default": 0.0, "min": -8.0, "max": 8.0, "step": 0.25}),
            }
        }

    RETURN_TYPES = ("IMAGE",)
    RETURN_NAMES = ("image",)
    FUNCTION = "run"
    CATEGORY = "Gear/HDR"

    def run(self, image, input_space, exposure_ev):
        x = image.float()
        if input_space == "srgb_display":
            x = srgb_eotf(x)
            x = apply_matrix(x, REC709_TO_AP1)
        elif input_space == "linear_rec709":
            x = apply_matrix(x, REC709_TO_AP1)
        # linear_acescg: pass-through
        x = torch.clamp(x, min=0.0)
        if exposure_ev != 0.0:
            x = x * (2.0 ** float(exposure_ev))
        ct = acescct.compress(x)  # linear -> ACEScct [0,1]
        print(f"[Gear/HDR] ACEScct encode: in range [{image.min():.4f},{image.max():.2f}] "
              f"({input_space}, EV{exposure_ev:+.2f}) -> ct [{ct.min():.4f},{ct.max():.4f}]")
        return (ct,)


NODE_CLASS_MAPPINGS = {"GearACEScctEncode": GearACEScctEncode}
NODE_DISPLAY_NAME_MAPPINGS = {"GearACEScctEncode": "Gear · ACEScct Encode"}
