# ComfyUI_Gear

VFX-oriented custom nodes for [ComfyUI](https://github.com/comfyanonymous/ComfyUI).

Currently ships:
- **Gear · LogC3 Decode + Save EXR** — inverse-LogC3 a `[0,1]` LoRA output to scene-linear HDR and write a float16 EXR.
- **Gear · Color Grade (exr-viewer)** — full ACEScct grading panel (color wheels, lift/gamma/gain/offset, scopes, A|B compare, batch scrubber, AgX / ACES Fitted / Hable / Reinhard tone mappers, .cube LUTs) embedded as a modal pop-up powered by [exr-viewer](https://github.com/oumad/exr-viewer).

More nodes will be added over time. The pack is structured so adding one is editing one file (see *Layout* below).

## Install

### Via ComfyUI Manager
Search for `ComfyUI_Gear` and install. Restart ComfyUI.

### Manual
```bash
cd ComfyUI/custom_nodes
git clone https://github.com/oumad/ComfyUI_Gear
cd ComfyUI_Gear
pip install -r requirements.txt
```
Then restart ComfyUI. The grade panel needs no extra setup — the exr-viewer build is committed in `web/vendor/`.

## Usage

### LogC3 Decode + Save EXR
Connect your HDR LoRA's `[0,1]` LogC3-compressed output (an `IMAGE`) to `image`. Outputs:
- `hdr_linear` — scene-linear HDR tensor (values can exceed 1.0). Pipe into Gear Color Grade or any `IMAGE`-consuming node.
- `tonemapped_preview` — quick Reinhard preview at `preview_ev` for the graph UI.
- `exr_paths` — newline-joined absolute paths of saved EXRs.

The `filename_prefix` accepts ComfyUI tokens (`%year%`, `%month%`, `%day%`, `%hour%`, `%minute%`, `%second%`, `%batch_num%`). EXRs are auto-counter-suffixed so they never overwrite.

### Color Grade (exr-viewer)
Wire `hdr_linear` to the grade node, run the graph once. Click **Open grade panel** on the node — the modal pops up with the exr-viewer interface.

- **Live preview**: every slider, color wheel, and master moves the WebGL canvas instantly. No graph re-run needed.
- **Persistence**: changes are ephemeral until **Save** (blue, ✓). **Cancel** / × / Esc / click-outside discards. Saved state survives modal reopen and workflow save/load — including the exact dot+master position on each color wheel.
- **A|B compare**: connect an `IMAGE` to the optional `sdr_reference` input, click `A|B` in the panel toolbar, and drag the wipe line. Works across batches — scrubbing the timeline swaps both EXR and SDR.
- **Batches**: pass an `[N, H, W, C]` IMAGE; the panel shows a frame scrubber at the bottom.
- **.cube LUTs**: click `LUT` in the toolbar to load any `.cube` file (1D LUTs not supported). Bundled film LUTs live in `web/vendor/exr-viewer/test-luts/`.

Outputs:
- `graded_display` — display-referred sRGB (post tone-map + OETF), 0..1.
- `graded_linear` — scene-linear HDR after grading, pre-tonemap. Pipe back into a Gear LogC3 Decode's EXR writer (or any saver) to bake the grade into your EXRs.

The grade math runs in two places that stay in sync:
1. `exr-viewer/src/renderer.ts` — GLSL fragment shader (drives the live preview).
2. `gear/grading.py` — torch port (runs on backend execution).

Section headers match 1:1, so a change in one is a mechanical mirror in the other.

## Layout

```
ComfyUI_Gear/
├── __init__.py                  # registers nodes + WEB_DIRECTORY
├── pyproject.toml               # project + ComfyUI Registry metadata
├── requirements.txt
├── nodes/                       # one file per node (thin wrappers)
│   ├── __init__.py              # aggregates NODE_CLASS_MAPPINGS
│   ├── logc3_decode.py
│   └── color_grade.py
├── gear/                        # pure-Python library (no ComfyUI deps)
│   ├── logc3.py                 # LogC3 encode/decode (matches LoRA params)
│   ├── grading.py               # torch port of renderer.ts
│   └── exr_io.py                # float16 EXR writer
├── web/                         # ComfyUI frontend extension
│   ├── gear_grade.js            # button → modal → postMessage bridge
│   └── vendor/                  # synced from exr-viewer/dist/ (committed)
│       ├── exr-viewer/          # SPA loaded by the iframe
│       └── lib/                 # standalone renderer bundle (reserved)
└── scripts/
    └── sync_from_exr_viewer.py  # contributor tool: refresh web/vendor/
```

## Adding a new node

1. Create `nodes/my_node.py` with a class exposing `INPUT_TYPES`, `RETURN_TYPES`, `FUNCTION`, `CATEGORY`, and a `NODE_CLASS_MAPPINGS` / `NODE_DISPLAY_NAME_MAPPINGS` pair.
2. If the math is reusable, put it in `gear/` (no ComfyUI imports).
3. Import the mappings in `nodes/__init__.py` and merge them into the aggregated dicts.

That's it — `__init__.py` re-exports automatically.

## Updating the grade pipeline (contributors)

```bash
# inside the exr-viewer repo
npm run build         # rebuild the SPA → exr-viewer/dist/
npm run build:all     # also rebuild the library bundle → exr-viewer/dist-lib/

# inside this repo
python scripts/sync_from_exr_viewer.py  # mirrors dist/ + dist-lib/ into web/vendor/
```

The sync script accepts a path argument or `EXR_VIEWER_PATH` env var; default points at the maintainer's local clone.

End users **never** run npm — the prebuilt exr-viewer output is committed in `web/vendor/`.

## Compatibility

- ComfyUI: any recent version (2024+) with the standard frontend.
- Python: 3.10+.
- GPU: any device that runs ComfyUI; the grade panel uses WebGL2 in the browser.
- OS: Windows, Linux, macOS — the embedded exr-viewer is pure browser code.

## License

MIT — see [LICENSE](LICENSE).

## Credits

- [exr-viewer](https://github.com/oumad/exr-viewer) — the GPU grading pipeline this pack embeds.
- [exrs](https://github.com/johannesvollmer/exrs) — Rust/WASM EXR codec used by the panel.
- ARRI LogC3 EI 800 transfer function reference.
