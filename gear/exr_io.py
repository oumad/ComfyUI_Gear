"""EXR I/O — backend-agnostic HDR read/write.

Prefers the official ``OpenEXR`` python bindings (>= 3.2, modern File API);
falls back to OpenCV when its build still ships the EXR codec
(opencv-python 4.x with OPENCV_IO_ENABLE_OPENEXR=1). The opencv-python 5.x
wheels dropped the EXR codec entirely, so the OpenEXR package is required
alongside them: ``pip install OpenEXR``.
"""
import os

# Must be set before cv2 queries the flag; harmless for 5.x / OpenEXR backend.
os.environ.setdefault("OPENCV_IO_ENABLE_OPENEXR", "1")

import numpy as np

_BACKEND = None

# float16 EXRs cannot represent magnitudes above half-max; clamp instead of inf
_HALF_MAX = 65504.0


def _backend() -> str:
    """Pick an EXR backend once per process: 'openexr' or 'cv2'."""
    global _BACKEND
    if _BACKEND is None:
        try:
            import OpenEXR
            if not hasattr(OpenEXR, "File"):
                raise ImportError("OpenEXR bindings too old (need >= 3.2)")
            _BACKEND = "openexr"
        except ImportError:
            import cv2
            if cv2.haveImageWriter("probe.exr"):
                _BACKEND = "cv2"
            else:
                raise RuntimeError(
                    "No EXR backend available: install the OpenEXR package "
                    "(pip install OpenEXR). opencv-python 5.x no longer "
                    "ships the EXR codec."
                ) from None
    return _BACKEND


def read_exr(path: str) -> np.ndarray:
    """Read an EXR into float32 RGB [H, W, 3], scene-linear, unclamped."""
    if _backend() == "openexr":
        import OpenEXR
        with OpenEXR.File(str(path)) as f:
            ch = {k: np.asarray(v.pixels) for k, v in f.channels().items()}
        if "RGBA" in ch:
            rgb = ch["RGBA"][:, :, :3]
        elif "RGB" in ch:
            rgb = ch["RGB"]
        elif all(k in ch for k in "RGB"):
            rgb = np.stack([ch["R"], ch["G"], ch["B"]], axis=-1)
        else:  # luminance or arbitrary single layer
            first = next(iter(ch.values()))
            rgb = np.stack([first] * 3, axis=-1) if first.ndim == 2 else first[:, :, :3]
        return rgb.astype(np.float32)

    import cv2
    bgr = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    if bgr is None:
        raise IOError(f"failed to read EXR: {path}")
    if bgr.ndim == 2:
        bgr = np.stack([bgr] * 3, axis=-1)
    return bgr[:, :, :3][:, :, ::-1].astype(np.float32)


def write_exr(path: str, rgb: np.ndarray) -> None:
    """Write an RGB HDR array to a float16 ZIP-compressed EXR.

    rgb: float32 [H, W, 3] in RGB order. Values above 1.0 are preserved
    (clamped only at the float16 representable limit).
    """
    rgb = np.nan_to_num(rgb, nan=0.0, posinf=_HALF_MAX, neginf=-_HALF_MAX)
    rgb = np.clip(rgb, -_HALF_MAX, _HALF_MAX)

    if _backend() == "openexr":
        import OpenEXR
        header = {"compression": OpenEXR.ZIP_COMPRESSION,
                  "type": OpenEXR.scanlineimage}
        channels = {"RGB": np.ascontiguousarray(rgb, dtype=np.float16)}
        with OpenEXR.File(header, channels) as f:
            f.write(str(path))
        return

    import cv2
    bgr = rgb[:, :, ::-1].copy()
    cv2.imwrite(
        str(path),
        bgr,
        [cv2.IMWRITE_EXR_TYPE, cv2.IMWRITE_EXR_TYPE_HALF,
         cv2.IMWRITE_EXR_COMPRESSION, cv2.IMWRITE_EXR_COMPRESSION_ZIP],
    )
