"""Node aggregation. Add new nodes as modules and extend the two dicts."""
from .color_grade import (
    NODE_CLASS_MAPPINGS as _grade_cls,
    NODE_DISPLAY_NAME_MAPPINGS as _grade_disp,
)
from .logc3_decode import (
    NODE_CLASS_MAPPINGS as _logc3_cls,
    NODE_DISPLAY_NAME_MAPPINGS as _logc3_disp,
)
from .logc4_decode import (
    NODE_CLASS_MAPPINGS as _logc4_cls,
    NODE_DISPLAY_NAME_MAPPINGS as _logc4_disp,
)
from .acescct_decode import (
    NODE_CLASS_MAPPINGS as _acescct_cls,
    NODE_DISPLAY_NAME_MAPPINGS as _acescct_disp,
)
from .acescct_encode import (
    NODE_CLASS_MAPPINGS as _acescct_enc_cls,
    NODE_DISPLAY_NAME_MAPPINGS as _acescct_enc_disp,
)
from .load_exr import (
    NODE_CLASS_MAPPINGS as _loadexr_cls,
    NODE_DISPLAY_NAME_MAPPINGS as _loadexr_disp,
)

NODE_CLASS_MAPPINGS = {**_logc3_cls, **_logc4_cls, **_acescct_cls,
                       **_acescct_enc_cls, **_loadexr_cls, **_grade_cls}
NODE_DISPLAY_NAME_MAPPINGS = {**_logc3_disp, **_logc4_disp, **_acescct_disp,
                              **_acescct_enc_disp, **_loadexr_disp, **_grade_disp}

__all__ = ["NODE_CLASS_MAPPINGS", "NODE_DISPLAY_NAME_MAPPINGS"]
