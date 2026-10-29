#!/usr/bin/env python3
"""Catálogo de los encuadres cinematográficos usados por Casa de Lu Roth."""
import base64
import io
import json
import math
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

ROOT = Path(__file__).resolve().parent
html = (ROOT / "index.html").read_text(encoding="utf-8")
m = re.search(r"const scenes=(\[.*?\]);", html, re.S)
if not m:
    raise ValueError("No hay datos de escenas en index.html")
scenes = json.loads(m.group(1))
m = re.search(r"const nuevosPlanos=(\[.*?\]);", html, re.S)
if not m:
    raise ValueError("No hay datos de planos individuales")
# Los nuevos planos usan sintaxis JS con comillas simples; se toman por nombres de archivo.
independent = [
    ("Auriculares y cuaderno", "assets/lux_43_bocetos.jpg"),
    ("Descanso bajo el edredón", "assets/lux_44_dormir.jpg"),
    ("Con el gato negro", "assets/lux_45_gato.jpg"),
    ("Sobre sábanas blancas", "assets/lux_46_sabanas.jpg"),
    ("Retrato cálido · Lux", "assets/lux_47_retrato_calido.jpg"),
    ("Lux · Lienzo negro", "assets/lux_48_taller_negro.jpg"),
    ("Lux · Retrato fragmentado", "assets/lux_49_retrato_fragmentado.jpg"),
    ("Lu Roth · Escaleras y abrigo", "assets/lu_roth_49_escalera_abrigo.jpg"),
    ("Lu Roth · Bolso y grafitis", "assets/lu_roth_50_bolso_grafitis.jpg"),
    ("Lu Roth · Bañera violeta", "assets/lu_roth_51_banera_violeta.jpg"),
    ("Lu Roth · Pasillo verde", "assets/lu_roth_52_pasillo_verde.jpg"),
    ("Lu Roth · Baño turquesa", "assets/lu_roth_53_bano_turquesa.jpg")
]
focus = [
[50,42],[50,43],[50,43],[50,53],[53,35],[51,46],[50,45],[50,49],[50,40],[50,43],
[51,40],[53,43],[50,47],[52,43],[50,49],[50,43],[50,45],[50,42],[50,44],[51,40],
[50,45],[50,50],[50,45],[50,44],[50,45],[50,44],[51,38],[50,42],[50,47],[50,41],
[50,42],[52,42],[50,41],[50,50],[50,44],[50,44],[50,43],[50,45],[50,49],[50,44],[50,43],
[51,43],[50,46],[50,38],[51,46],[50,41],[50,47],[50,40],[49,53],[55,52],[55,49],[49,15],[57,34]
]
assert len(scenes) == 41 and len(independent) == 12 and len(focus) == 53
packs = {}
for path in sorted((ROOT / "assets").glob("pack_*.js")):
    src = path.read_text(encoding="utf-8")
    for index, b64 in re.findall(r'window\.__luxImages\[(\d+)\]="data:image/webp;base64,([^"]+)"', src):
        packs[int(index)] = base64.b64decode(b64)
print("Imágenes disponibles en packs:", len(packs))

def original(i):
    if i < len(scenes):
        packid = 24 + i + (1 if i >= 37 else 0)
        if packid not in packs:
            raise ValueError(f"Plano {i+1} sin imagen pack {packid}")
        return Image.open(io.BytesIO(packs[packid])).convert("RGB"), scenes[i]["name"]
    name, filename = independent[i-len(scenes)]
    path = ROOT / filename
    if not path.exists():
        raise FileNotFoundError(path)
    return Image.open(path).convert("RGB"), name

def black_side_crop(im):
    w, h = im.size
    sample = im.resize((240, 135), Image.Resampling.BILINEAR)
    def bar(x):
        n = 0
        for y in range(17,121,7):
            if max(sample.getpixel((x,y))) <= 8:
                n += 1
        return n / len(range(17,121,7)) >= .94
    left, right = 0, 0
    while left < 105 and bar(left):
        left += 1
    while right < 105 and bar(239-right):
        right += 1
    if left >= 14 and right >= 14 and abs(left-right) < 17 and 240-left-right >= 40:
        L = round(w * left / 240)
        R = round(w * right / 240)
        return im.crop((L, 0, w-R, h))
    return im

def crop16x9(im, at):
    im = black_side_crop(im)
    x, y = (a/100 for a in at)
    w,h = im.size
    target = 16/9
    if w/h > target:
        nw = round(h*target)
        lx = round((w-nw)*x)
        im = im.crop((lx,0,lx+nw,h))
    else:
        nh = round(w/target)
        ty = round((h-nh)*y)
        im = im.crop((0,ty,w,ty+nh))
    return im

COLS, THUMBW, THUMBH, GAP, PAD = 4, 385, 216, 18, 26
CELLH, HEAD = 267, 100
ROWS = math.ceil(len(focus)/COLS)
W=PAD*2+COLS*THUMBW+(COLS-1)*GAP
H=HEAD+PAD+ROWS*CELLH+PAD
im = Image.new("RGB",(W,H),(11,13,16))
d=ImageDraw.Draw(im)
regular="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
bold="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
fTitle=ImageFont.truetype(bold,30)
fSub=ImageFont.truetype(regular,16)
fNum=ImageFont.truetype(bold,16)
fItem=ImageFont.truetype(regular,14)
d.text((PAD,25),"CASA DE LU ROTH   /   ENCUADRES 16:9",font=fTitle,fill="#f2e7e8")
d.text((PAD,69),"53 planos · zoom a pantalla completa · selección automática cada tres minutos",font=fSub,fill="#bdb6bd")
for i in range(len(focus)):
    shot,name=original(i)
    frame=crop16x9(shot,focus[i]).resize((THUMBW,THUMBH),Image.Resampling.LANCZOS)
    x=PAD+(i%COLS)*(THUMBW+GAP)
    y=HEAD+(i//COLS)*CELLH
    im.paste(frame,(x,y))
    d.rectangle((x,y,x+THUMBW-1,y+THUMBH-1),outline="#48484b",width=1)
    d.text((x+5,y+THUMBH+8),f"{i+1:02d}",font=fNum,fill="#f5d9de")
    name=name if len(name) <= 39 else name[:37]+"…"
    d.text((x+39,y+THUMBH+8),name,font=fItem,fill="#dddce1")
out=ROOT/"catalogo_encuadres_cine.jpg"
im.save(out,"JPEG",quality=91,optimize=True,subsampling=0)
print(f"Generado {out} : {W}×{H} · {out.stat().st_size} bytes")
