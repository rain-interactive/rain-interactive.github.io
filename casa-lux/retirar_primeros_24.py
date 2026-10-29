#!/usr/bin/env python3
"""Retirar los 24 primeros planos de Casa de Lux y renumerar el resto.

Antes: 66 planos y 29 packs de imágenes. Después: 42 planos y 14 packs.
Conserva exactamente los archivos WebP restantes y sus 1920 × 1080 píxeles.
Genera una nueva hoja JPG numerada de la colección final.
"""
import base64
import io
import json
import re
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT=Path(__file__).resolve().parent
ASSETS=ROOT/"assets"
INDEX=ROOT/"index.html"
SHEET=ROOT/"Casa_de_Lux_42_planos_numerados.jpg"
PACK_RE=re.compile(r'window\.__luxImages\[(\d+)\]="data:image/(webp);base64,([A-Za-z0-9+/=]+)";')
SCENES_RE=re.compile(r'const scenes=(\[.*?\]);',re.S)
LOAD_RE=re.compile(r'<script src="assets/pack_\d{2}\.js"></script>\s*')
SIZES=(1920,1080)

html=INDEX.read_text("utf8")
match=SCENES_RE.search(html)
assert match,"No se ha encontrado la lista de escenas."
scenes=json.loads(match.group(1))
if len(scenes)==42 and SHEET.exists():
    print("Ya ejecutado: 42 planos y JPG.")
    raise SystemExit(0)
assert len(scenes)==66,(len(scenes),"Se esperaban 66 escenas originales")

images={}
raw_files={}
old_packs=sorted(ASSETS.glob("pack_*.js"))
assert len(old_packs)==29,(len(old_packs),"packs originales")
for pack in old_packs:
    contents=pack.read_text("utf8")
    matches=list(PACK_RE.finditer(contents))
    assert matches,(pack,"sin imágenes")
    for item in matches:
        idx=int(item.group(1))
        assert idx not in raw_files,("índice duplicado",idx)
        data=base64.b64decode(item.group(3))
        with Image.open(io.BytesIO(data)) as picture:
            assert picture.size==SIZES,(idx,picture.size)
            if idx>=24:
                images[idx-24]=picture.convert("RGB")
        if idx>=24:
            raw_files[idx-24]=data

assert sorted(raw_files)==list(range(42)),("Indices faltantes",sorted(raw_files))
kept=scenes[24:]
assert len(kept)==42 and kept[0]["name"]=="Pensar delante del ordenador"
assert kept[-1]["name"]=="Una tarde en el taller"

# Realizar todos los cambios solo tras verificar que están las 42 fotos.
# Guardar los mismos bytes WebP, sin pérdida por una nueva compresión.
for pack in old_packs:
    pack.unlink()
for start in range(0,42,3):
    parts=["window.__luxImages=window.__luxImages||[];"]
    for idx in range(start,min(start+3,42)):
        payload=base64.b64encode(raw_files[idx]).decode("ascii")
        parts.append(f'window.__luxImages[{idx}]="data:image/webp;base64,{payload}";')
    (ASSETS/f"pack_{start//3+1:02d}.js").write_text("\n".join(parts)+"\n","utf8")

# Renumerar escenas y reemplazar etiquetas de carga de packs.
html=SCENES_RE.sub(lambda _m:"const scenes="+json.dumps(kept,ensure_ascii=False,separators=(',',':'))+";",html,count=1)
pack_tags="".join(f'<script src="assets/pack_{i:02d}.js"></script>\n' for i in range(1,15))
assert len(LOAD_RE.findall(html))==29
# Insertar las etiquetas en la posición de los antiguos scripts externos,
# NUNCA dentro del script JavaScript que contiene scenes.forEach.
replaced_tags=0
def replace_load_tag(_match):
    global replaced_tags
    replaced_tags+=1
    return pack_tags if replaced_tags==1 else ""
html=LOAD_RE.sub(replace_load_tag,html)
assert replaced_tags==29
anchor="scenes.forEach((scene,i)=>{scene.src=window.__luxImages?.[i]||''});"
assert anchor in html,"No se encontró el cargador de imágenes"
html=html.replace("66 planos automáticos","42 planos automáticos")
html=html.replace("66 planos, formato","42 planos, formato")
html=html.replace("66 encuadres","42 encuadres")
html=html.replace("all 66 scenes","all 42 scenes")
html=html.replace("66 scenes","42 scenes")
html=html.replace("66 photographs","42 photographs")
assert len(LOAD_RE.findall(html))==14
assert len(json.loads(SCENES_RE.search(html).group(1)))==42
assert all(name in html for name in ["chat.js","radio.js","windfinder.js","monocromo.css","cornerClock"])
INDEX.write_text(html,"utf8")

# Hoja para decidir cuáles conservar después: números nuevos 01—42.
try:
    fontpath="/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
    titlefont=ImageFont.truetype(fontpath,36)
    subfont=ImageFont.truetype(fontpath,19)
    numberfont=ImageFont.truetype(fontpath,24)
    namefont=ImageFont.truetype(fontpath,16)
except OSError:
    titlefont=subfont=numberfont=namefont=ImageFont.load_default()
cols=6
rows=7
w=350
h=197
gap=14
label_h=49
header=108
sheet_w=cols*(w+gap)+gap
sheet_h=header+rows*(h+label_h+gap)+gap
sheet=Image.new("RGB",(sheet_w,sheet_h),"#070707")
d=ImageDraw.Draw(sheet)
d.text((25,15),"CASA DE LUX · 42 PLANOS",font=titlefont,fill="#ffffff")
d.text((25,67),"Nueva numeración · originales 25—66 · 1920 × 1080 · sin los primeros 24",font=subfont,fill="#cbcbcb")
for idx in range(42):
    x=gap+(idx%cols)*(w+gap)
    y=header+gap+(idx//cols)*(h+label_h+gap)
    preview=images[idx].resize((w,h),Image.Resampling.LANCZOS)
    sheet.paste(preview,(x,y))
    d.rectangle((x+5,y+5,x+54,y+38),fill="#000000")
    d.text((x+10,y+6),f"{idx+1:02d}",font=numberfont,fill="#ffffff")
    d.rectangle((x,y+h,x+w,y+h+label_h),fill="#151515")
    name=kept[idx]["name"]
    while len(name)>4 and d.textbbox((0,0),name,font=namefont)[2]>w-14:
        name=name[:-2].rstrip(" .")+'…'
    d.text((x+8,y+h+12),name,font=namefont,fill="#ffffff")
sheet.save(SHEET,"JPEG",quality=91,optimize=True,subsampling=0)

# Eliminar el índice desactualizado para evitar que se use la numeración vieja.
old_sheet=ROOT/"Casa_de_Lux_66_planos_numerados.jpg"
if old_sheet.exists():
    old_sheet.unlink()

report={
    "removed_original_numbers":list(range(1,25)),
    "remaining_original_numbers":list(range(25,67)),
    "total":42,"resolution":[1920,1080],
    "new_numbering":{str(i+1):{"before":i+25,"name":scenes[i+24]["name"]} for i in range(42)},
    "packs":14,"proof_jpg":SHEET.name}
(ROOT/"seleccion_actual_42.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n","utf8")
print("Eliminados 24; conservados 42; renumerados 01..42.")
print("JPG",SHEET,SHEET.stat().st_size,"bytes",sheet.size)
