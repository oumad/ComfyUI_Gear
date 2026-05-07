"""exr-viewer-style color grading node (ACEScct pipeline)."""
import os

import numpy as np
import torch
from PIL import Image

import folder_paths

from ..gear import exr_io
from ..gear.grading import RenderParams, grade, grade_linear


TONE_MAPS = ["None", "Reinhard", "ACES Fitted", "AgX", "Hable"]


def _to_png(tensor_hwc: torch.Tensor) -> Image.Image:
    """[H, W, 3] float in [0, 1] → 8-bit PIL image."""
    arr = (tensor_hwc.detach().cpu().clamp(0, 1).numpy() * 255).astype(np.uint8)
    return Image.fromarray(arr, "RGB")


class GearColorGrade:
    """exr-viewer grading pipeline, ported 1:1 from renderer.ts.

    UX: the node body shows a single "Open grade panel" button. Clicking it
    opens a modal containing the full exr-viewer UI (color wheels, scopes,
    wipe compare) in an iframe. Grade is persisted to the node's hidden
    widgets on Save and baked into the backend IMAGE outputs on Run.

    Inputs
    - hdr_linear: scene-linear HDR image (values can exceed 1.0). Typically
      the `hdr_linear` output of Gear LogC3 Decode.
    - sdr_reference (optional): display-referred SDR image to use with the
      panel's A|B wipe compare. Any standard IMAGE tensor works (e.g. the
      `tonemapped_preview` output of LogC3 Decode, or a LoadImage node).

    Outputs
    - graded_display: display-referred sRGB (post tone-map + OETF), 0..1.
    - graded_linear: scene-linear HDR after grading, pre-tonemap.
    """

    @classmethod
    def INPUT_TYPES(cls):
        f = lambda d, mn, mx, step=0.01: ("FLOAT", {"default": d, "min": mn, "max": mx, "step": step})
        return {
            "required": {
                "hdr_linear":  ("IMAGE",),
                "exposure":    f(0.0, -10.0, 10.0, 0.1),
                "tone_map":    (TONE_MAPS, {"default": "ACES Fitted"}),
                "soft_clip":   f(0.0,   0.0, 1.0),
                "temperature": f(0.0,  -1.0, 1.0),
                "tint":        f(0.0,  -1.0, 1.0),

                "lift_r":   f(0.0, -1.0, 1.0),
                "lift_g":   f(0.0, -1.0, 1.0),
                "lift_b":   f(0.0, -1.0, 1.0),
                "gamma_r":  f(1.0,  0.1, 4.0),
                "gamma_g":  f(1.0,  0.1, 4.0),
                "gamma_b":  f(1.0,  0.1, 4.0),
                "gain_r":   f(1.0,  0.0, 4.0),
                "gain_g":   f(1.0,  0.0, 4.0),
                "gain_b":   f(1.0,  0.0, 4.0),
                "offset_r": f(0.0, -1.0, 1.0),
                "offset_g": f(0.0, -1.0, 1.0),
                "offset_b": f(0.0, -1.0, 1.0),

                "contrast":   f(1.0, 0.0, 4.0),
                "pivot":      f(0.18, 0.001, 1.0, 0.001),
                "shadows":    f(0.0, -2.0, 2.0),
                "highlights": f(0.0, -2.0, 2.0),
                "saturation": f(1.0,  0.0, 3.0),
                "vibrance":   f(0.0, -2.0, 2.0),
                "hue_shift":  f(0.0, -180.0, 180.0, 1.0),
                "false_color": ("BOOLEAN", {"default": False}),
            },
            "optional": {
                "sdr_reference": ("IMAGE",),
            },
        }

    RETURN_TYPES = ("IMAGE", "IMAGE")
    RETURN_NAMES = ("graded_display", "graded_linear")
    FUNCTION = "run"
    OUTPUT_NODE = True
    CATEGORY = "Gear/HDR"

    @classmethod
    def IS_CHANGED(cls, **kwargs):
        # The frontend grade panel needs the input EXR on disk in temp/
        # to drive its live preview, but ComfyUI wipes temp/ on every
        # server start. If we let this node cache, a restart leaves the
        # panel pointing at a deleted filename (404 in /api/view).
        # Forcing re-execution every run is cheap (small grade pipeline
        # + one EXR write) and keeps the preview file in lock-step with
        # whatever the panel will try to fetch.
        return os.urandom(8).hex()

    def run(self, hdr_linear, exposure, tone_map, soft_clip, temperature, tint,
            lift_r, lift_g, lift_b, gamma_r, gamma_g, gamma_b,
            gain_r, gain_g, gain_b, offset_r, offset_g, offset_b,
            contrast, pivot, shadows, highlights, saturation, vibrance,
            hue_shift, false_color, sdr_reference=None):

        p = RenderParams(
            exposure=exposure,
            tone_mapping=TONE_MAPS.index(tone_map),
            soft_clip=soft_clip,
            temperature=temperature, tint=tint,
            lift=(lift_r, lift_g, lift_b),
            gamma=(gamma_r, gamma_g, gamma_b),
            gain=(gain_r, gain_g, gain_b),
            offset=(offset_r, offset_g, offset_b),
            contrast=contrast, pivot=pivot,
            shadows=shadows, highlights=highlights,
            saturation=saturation, vibrance=vibrance,
            hue_shift=hue_shift, false_color=false_color,
        )

        hdr = hdr_linear[..., :3]
        graded_display = grade(hdr, p).clamp(0.0, 1.0)
        graded_lin = grade_linear(hdr, p)

        # Write three flavours of preview to temp dir per batch item:
        #   - EXR of the *input* hdr (drives the live grade panel)
        #   - PNG of graded output  (node body thumbnail)
        #   - PNG of sdr reference  (drives the panel's A|B compare)
        # Saving the input here makes the node self-contained — no walking
        # upstream graph links to find the source EXR. Whatever IMAGE
        # arrives is exactly what the panel sees.
        out_dir = folder_paths.get_temp_directory()
        os.makedirs(out_dir, exist_ok=True)
        full_dir, fname, counter, subfolder, _ = folder_paths.get_save_image_path(
            "gear_grade", out_dir, int(hdr.shape[2]), int(hdr.shape[1])
        )

        exr_previews = []
        graded_previews = []
        sdr_previews = []

        for i in range(hdr.shape[0]):
            stem = f"{fname}_{counter + i:05}_"
            exr_name = f"{stem}.exr"
            png_name = f"{stem}.png"
            exr_io.write_exr(
                os.path.join(full_dir, exr_name),
                hdr[i].detach().cpu().numpy().astype(np.float32),
            )
            _to_png(graded_display[i]).save(os.path.join(full_dir, png_name), compress_level=4)
            exr_previews.append({"filename": exr_name, "subfolder": subfolder, "type": "temp"})
            graded_previews.append({"filename": png_name, "subfolder": subfolder, "type": "temp"})

        if sdr_reference is not None:
            sdr = sdr_reference[..., :3]
            n_sdr = min(sdr.shape[0], hdr.shape[0])
            for i in range(n_sdr):
                sdr_name = f"{fname}_sdr_{counter + i:05}_.png"
                _to_png(sdr[i]).save(os.path.join(full_dir, sdr_name), compress_level=4)
                sdr_previews.append({"filename": sdr_name, "subfolder": subfolder, "type": "temp"})

        return {
            "ui": {
                "images": graded_previews,
                "gear_exr": exr_previews,
                "gear_sdr": sdr_previews,
            },
            "result": (graded_display, graded_lin),
        }


NODE_CLASS_MAPPINGS = {"GearColorGrade": GearColorGrade}
NODE_DISPLAY_NAME_MAPPINGS = {"GearColorGrade": "Gear · Color Grade (exr-viewer)"}
