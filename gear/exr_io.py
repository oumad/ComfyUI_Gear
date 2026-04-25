"""EXR I/O — float16 writer via OpenCV's OpenEXR backend."""
import os

os.environ.setdefault("OPENCV_IO_ENABLE_OPENEXR", "1")

import cv2
import numpy as np


def write_exr(path: str, rgb: np.ndarray) -> None:
    """Write an RGB HDR array to a float16 ZIP-compressed EXR.

    rgb: float32 [H, W, 3] in RGB order. Values above 1.0 are preserved.
    """
    bgr = rgb[:, :, ::-1].copy()
    cv2.imwrite(
        path,
        bgr,
        [cv2.IMWRITE_EXR_TYPE, cv2.IMWRITE_EXR_TYPE_HALF,
         cv2.IMWRITE_EXR_COMPRESSION, cv2.IMWRITE_EXR_COMPRESSION_ZIP],
    )
