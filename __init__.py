"""ComfyUI_Gear — VFX-oriented nodes for ComfyUI.

Current nodes:
  Gear · LogC3 Decode + Save EXR   — inverse LogC3 + float16 EXR writer
  Gear · Color Grade (exr-viewer)  — ACEScct grading pipeline w/ a live
                                     WebGL panel (color wheels, scopes,
                                     A|B compare, batch frame scrubber)

More VFX-oriented nodes will be added over time. See README.md for the
extension story (one node per file in `nodes/`, library code in `gear/`).
"""
from .nodes import NODE_CLASS_MAPPINGS, NODE_DISPLAY_NAME_MAPPINGS

__version__ = "0.1.2"
WEB_DIRECTORY = "./web"

__all__ = [
    "NODE_CLASS_MAPPINGS",
    "NODE_DISPLAY_NAME_MAPPINGS",
    "WEB_DIRECTORY",
    "__version__",
]
