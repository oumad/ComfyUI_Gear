"""Load EXR node — read linear HDR EXR file(s) into an IMAGE batch.

Values are passed through UNCHANGED (scene-linear, can exceed 1.0). Feed into
Gear · ACEScct Encode (or LogC3/LogC4 equivalents) before a [0,1] pipeline.
Supports a single file or a glob pattern for sequences (frame-sorted).
"""
import glob as globlib
import os

import numpy as np
import torch

from ..gear import exr_io


class GearLoadEXR:
    """Read .exr (single file or glob like /path/frame_*.exr) -> linear IMAGE batch.

    Outputs
    - image: (N, H, W, 3) float32, scene-linear, values NOT clamped to [0,1].
    - frame_count: number of frames loaded.

    Notes
    - Non-finite values are sanitized (NaN->0, +inf->1e6, -inf->0).
    - `max_frames` caps sequence length (0 = no cap).
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "path": ("STRING", {"default": "/path/to/frames_*.exr"}),
                "max_frames": ("INT", {"default": 0, "min": 0, "max": 4096}),
            }
        }

    RETURN_TYPES = ("IMAGE", "INT")
    RETURN_NAMES = ("image", "frame_count")
    FUNCTION = "run"
    CATEGORY = "Gear/HDR"

    def run(self, path, max_frames):
        files = sorted(globlib.glob(path)) if any(c in path for c in "*?[") else [path]
        files = [f for f in files if os.path.isfile(f)]
        if not files:
            raise FileNotFoundError(f"no EXR files match: {path}")
        if max_frames > 0:
            files = files[:max_frames]

        frames = []
        for f in files:
            rgb = exr_io.read_exr(f)
            rgb = np.nan_to_num(rgb, nan=0.0, posinf=1e6, neginf=0.0)
            frames.append(torch.from_numpy(np.ascontiguousarray(rgb)))
        batch = torch.stack(frames, dim=0)
        print(f"[Gear/HDR] loaded {len(files)} EXR frame(s) {tuple(batch.shape)} "
              f"range [{batch.min():.4f}, {batch.max():.2f}]")
        return (batch, len(files))


NODE_CLASS_MAPPINGS = {"GearLoadEXR": GearLoadEXR}
NODE_DISPLAY_NAME_MAPPINGS = {"GearLoadEXR": "Gear · Load EXR (linear)"}
