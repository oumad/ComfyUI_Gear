"""LogC3 Decode + Save EXR node."""
import os

import numpy as np
import torch

import folder_paths

from ..gear import exr_io, logc3


def _reinhard(hdr: torch.Tensor, gamma: float = 2.2) -> torch.Tensor:
    hdr = torch.clamp(hdr, min=0)
    return torch.clamp(torch.pow(hdr / (1.0 + hdr), 1.0 / gamma), 0.0, 1.0)


class GearLogC3DecodeSaveEXR:
    """Inverse LogC3 + write float16 EXR.

    Inputs
    - image: HDR LoRA raw output (LogC3 in [0,1]).
    - filename_prefix: supports ComfyUI tokens (%year%, %month%, %day%,
      %hour%, %minute%, %second%, %batch_num%). Counter is appended
      automatically so EXRs never overwrite existing files.

    Outputs
    - hdr_linear: scene-linear HDR (values can exceed 1.0). Feed this into
      Gear Color Grade or save via any downstream node.
    - tonemapped_preview: Reinhard tonemap at preview_ev for graph UI.
    - exr_paths: newline-joined absolute path(s) of saved EXR file(s);
      empty string if save_exr is False.

    UI payload also emits `gear_exr` with the saved paths so the downstream
    Gear Color Grade node's frontend can find the source EXR to preview live.
    """

    @classmethod
    def INPUT_TYPES(cls):
        return {
            "required": {
                "image": ("IMAGE",),
                "filename_prefix": ("STRING", {"default": "gear_hdr/%year%%month%%day%_%hour%%minute%%second%"}),
                "preview_ev": ("FLOAT", {"default": 0.0, "min": -8.0, "max": 8.0, "step": 0.5}),
                "save_exr": ("BOOLEAN", {"default": True}),
            }
        }

    RETURN_TYPES = ("IMAGE", "IMAGE", "STRING")
    RETURN_NAMES = ("hdr_linear", "tonemapped_preview", "exr_paths")
    FUNCTION = "run"
    OUTPUT_NODE = True
    CATEGORY = "Gear/HDR"

    def run(self, image, filename_prefix, preview_ev, save_exr):
        height, width = int(image.shape[1]), int(image.shape[2])

        linears = []
        previews = []
        saved_paths = []
        saved_rel = []  # relative to output dir, for UI payload

        full_output_folder = filename = subfolder = None
        counter = 1
        output_dir = folder_paths.get_output_directory()
        if save_exr:
            full_output_folder, filename, counter, subfolder, _ = folder_paths.get_save_image_path(
                filename_prefix, output_dir, width, height
            )

        for i in range(image.shape[0]):
            img = image[i]
            hdr = logc3.decompress(img)
            linears.append(hdr)

            if save_exr:
                hdr_cpu = hdr.detach().cpu().numpy().astype(np.float32)
                filename_with_batch = filename.replace("%batch_num%", str(i))
                out_name = f"{filename_with_batch}_{counter:05}_.exr"
                out_path = os.path.join(full_output_folder, out_name)
                exr_io.write_exr(out_path, hdr_cpu)
                saved_paths.append(out_path)
                saved_rel.append({"filename": out_name, "subfolder": subfolder, "type": "output"})
                counter += 1

            previews.append(_reinhard(hdr * (2.0 ** float(preview_ev))))

        if saved_paths:
            print(f"[Gear/HDR] saved {len(saved_paths)} EXR(s): {saved_paths[0]}"
                  + (" ..." if len(saved_paths) > 1 else ""))

        hdr_stack = torch.stack(linears, dim=0)
        preview_stack = torch.stack(previews, dim=0)
        paths_str = "\n".join(saved_paths)
        # `gear_exr` is consumed by the frontend extension for the live
        # grading preview; `images` renders thumbnails in the node UI.
        return {
            "ui": {"gear_exr": saved_rel, "images": saved_rel},
            "result": (hdr_stack, preview_stack, paths_str),
        }


NODE_CLASS_MAPPINGS = {"GearLogC3DecodeSaveEXR": GearLogC3DecodeSaveEXR}
NODE_DISPLAY_NAME_MAPPINGS = {"GearLogC3DecodeSaveEXR": "Gear · LogC3 Decode + Save EXR"}
