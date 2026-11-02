#!/usr/bin/env python3
"""Genera copias CRT 640x480 del catálogo editorial; no toca los originales."""
import json
from pathlib import Path
from PIL import Image, ImageOps, ImageFilter, ImageEnhance

root = Path(__file__).resolve().parent
source = root / "planos-ambiente"
target = root / "crt-assets"
target.mkdir(parents=True, exist_ok=True)
catalog = json.loads((source / "catalogo.json").read_text(encoding="utf-8"))
accepted = []
for item in catalog.get("images", []):
    filename = item.get("file", "")
    if not filename.lower().endswith((".jpg", ".jpeg", ".png", ".webp")) or "/" in filename or "\\" in filename:
        continue
    original = source / filename
    if not original.is_file():
        continue
    try:
        with Image.open(original) as incoming:
            if min(incoming.size) < 700:
                continue
            im = ImageOps.exif_transpose(incoming).convert("RGB")
            # Formato CRT 4:3. Fondo tenue de la propia obra; imagen íntegra encima.
            bg = ImageOps.fit(im, (640, 480), method=Image.Resampling.BILINEAR)
            bg = ImageEnhance.Brightness(bg.filter(ImageFilter.GaussianBlur(11))).enhance(.40)
            im.thumbnail((640, 480), Image.Resampling.LANCZOS)
            bg.paste(im, ((640-im.width)//2, (480-im.height)//2))
            dest = target / (Path(filename).stem + ".jpg")
            bg.save(dest, "JPEG", quality=67, optimize=True, subsampling=2)
            accepted.append({"file": dest.name, "name": item.get("name") or Path(filename).stem})
    except (OSError, ValueError) as e:
        print("Sin procesar:", filename, e)
for p in target.glob("*.jpg"):
    if not any(x["file"] == p.name for x in accepted):
        p.unlink()
(target / "manifest.json").write_text(
    json.dumps({"format": "CRT 4:3", "resolution": "640x480", "images": accepted},
               ensure_ascii=False, indent=2) + "\n", encoding="utf-8"
)
print("Planos CRT generados:", len(accepted))
