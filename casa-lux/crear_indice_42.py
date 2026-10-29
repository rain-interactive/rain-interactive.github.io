#!/usr/bin/env python3
"""Lámina actual de Casa de Lux: 42 escenas, antiguas 25-66, números nuevos 1-42."""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont
import re,base64,io,json
root=Path(__file__).resolve().parent
html=(root/"index.html").read_text("utf-8")
scenes=json.loads(re.search(r'const scenes=(\[.*?\]);',html,re.S).group(1))
assert len(scenes)==42,len(scenes)
assets={}
pattern=re.compile(r'window\.__luxImages\[(\d+)\]="data:image/webp;base64,([A-Za-z0-9+/=]+)";')
for n in range(9,30):
    raw=(root/"assets"/f"pack_{n:02}.js").read_text("utf-8")
    for index,b64 in pattern.findall(raw):
        i=int(index)
        assert i not in assets,i
        with Image.open(io.BytesIO(base64.b64decode(b64))) as im:
            assert im.size==(1920,1080),(i,im.size)
            assets[i]=im.convert("RGB")
assert sorted(assets)==list(range(24,66)), sorted(assets)
font="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
title=ImageFont.truetype(font,40)
sub=ImageFont.truetype(font,20)
number=ImageFont.truetype(font,29)
caption=ImageFont.truetype(font,17)
col_count=6
row_count=7
tw,th=440,248
margin=18; label=46; head=116
W=margin+(tw+margin)*col_count
H=head+margin+(th+label+margin)*row_count
sheet=Image.new('RGB',(W,H),'#050505')
draw=ImageDraw.Draw(sheet)
draw.text((25,20),"CASA DE LUX · 42 PLANOS",fill="#fff",font=title)
draw.text((25,77),"Selección actual · numerados 01–42 · 1920 × 1080",fill="#bbb",font=sub)
for i,scene in enumerate(scenes):
    x=margin+(i%col_count)*(tw+margin)
    y=head+margin+(i//col_count)*(th+label+margin)
    img=assets[i+24].resize((tw,th),Image.Resampling.LANCZOS)
    sheet.paste(img,(x,y))
    draw.rectangle((x+7,y+7,x+65,y+44),fill="#000")
    draw.text((x+13,y+10),f"{i+1:02}",fill="#fff",font=number)
    draw.rectangle((x,y+th,x+tw,y+th+label),fill="#121212")
    name=scene["name"]
    while draw.textbbox((0,0),name,font=caption)[2]>tw-18 and len(name)>5:
        name=name[:-2].rstrip(" .")+"…"
    draw.text((x+9,y+th+12),name,fill="#fff",font=caption)
out=root/"Casa_de_Lux_42_planos_numerados.jpg"
sheet.save(out,"JPEG",quality=91,optimize=True,subsampling=0)
print(f"CONTACT SHEET: {out.name} · {len(scenes)} fotos · {W}×{H} · {out.stat().st_size} bytes")
