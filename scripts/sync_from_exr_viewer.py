"""Sync vendored exr-viewer build output into web/vendor/.

Contributor tool — end users never need to run this. The committed
`web/vendor/` already contains a working build.

Usage
    python scripts/sync_from_exr_viewer.py [PATH_TO_EXR_VIEWER]

Source resolution order:
    1. CLI argument
    2. EXR_VIEWER_PATH environment variable
    3. ../exr-viewer (sibling checkout to ComfyUI_Gear)
    4. ./exr-viewer (clone inside ComfyUI_Gear, e.g. as a submodule)

Expects `dist/` (SPA) and optionally `dist-lib/` (library bundle) to be
up-to-date in that location. Rebuild inside exr-viewer with:
    npm run build       # SPA only
    npm run build:all   # SPA + library bundle
"""
from __future__ import annotations

import os
import shutil
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent


def _candidates() -> list[Path]:
    """Where to look for the exr-viewer source, in priority order."""
    cands: list[Path] = []
    if len(sys.argv) > 1:
        cands.append(Path(sys.argv[1]).expanduser().resolve())
    if env := os.environ.get("EXR_VIEWER_PATH"):
        cands.append(Path(env).expanduser().resolve())
    cands.append((REPO_ROOT / ".." / "exr-viewer").resolve())
    cands.append((REPO_ROOT / "exr-viewer").resolve())
    return cands


def _mirror_tree(src: Path, dst: Path) -> int:
    if dst.exists():
        shutil.rmtree(dst)
    shutil.copytree(src, dst)
    return sum(1 for p in dst.rglob("*") if p.is_file())


def main() -> int:
    src_root: Path | None = None
    tried: list[Path] = []
    for c in _candidates():
        tried.append(c)
        if (c / "dist").exists():
            src_root = c
            break

    if src_root is None:
        print("[sync] could not find an exr-viewer checkout with dist/. Tried:")
        for t in tried:
            print(f"        {t}")
        print("[sync] pass the path explicitly: "
              "python scripts/sync_from_exr_viewer.py /path/to/exr-viewer")
        return 1

    print(f"[sync] using exr-viewer at {src_root}")
    vendor = REPO_ROOT / "web" / "vendor"
    vendor.mkdir(parents=True, exist_ok=True)

    n = _mirror_tree(src_root / "dist", vendor / "exr-viewer")
    print(f"[sync] SPA:     {n} files -> {vendor / 'exr-viewer'}")

    dist_lib = src_root / "dist-lib"
    if dist_lib.exists():
        n = _mirror_tree(dist_lib, vendor / "lib")
        print(f"[sync] Library: {n} files -> {vendor / 'lib'}")

    return 0


if __name__ == "__main__":
    sys.exit(main())
