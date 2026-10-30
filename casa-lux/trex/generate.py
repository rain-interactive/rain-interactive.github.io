#!/usr/bin/env python3
"""Genera los 43 fotogramas CRT de Casa Lux a partir de la colección original.
Solo 512×288 WebP con pérdida, sin EXIF, metadatos ni fotografías ajenas al proyecto.
Ejecutar desde la raíz del repositorio: python3 casa-lux/trex/generate.py
"""
import base64
import io
import json
import re
import subprocess
import urllib.request
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "trex"
SHOTS = OUT / "planos"
SHOTS.mkdir(parents=True, exist_ok=True)
html = (ROOT / "index.html").read_text("utf8")
match = re.search(r"const scenes=(\[.*?\]);", html, re.S)
if not match:
    raise RuntimeError("No se pudo leer el catálogo")
scenes = json.loads(match.group(1))
if len(scenes) != 31:
    raise RuntimeError(f"Se esperaban 31 imágenes de packs; hay {len(scenes)}")
names = [
 ("Auriculares y cuaderno","lux_43_bocetos.jpg","musica"),
 ("Descanso bajo el edredón","lux_44_dormir.jpg","descanso"),
 ("Con el gato negro","lux_45_gato.jpg","descanso"),
 ("Sobre sábanas blancas","lux_46_sabanas.jpg","contemplar"),
 ("Retrato cálido · Lux","lux_47_retrato_calido.jpg","cotidiano"),
 ("Lux · Lienzo negro","lux_48_taller_negro.jpg","crear"),
 ("Lux · Retrato fragmentado","lux_49_retrato_fragmentado.jpg","crear"),
 ("Lu Roth · Escaleras y abrigo","lu_roth_49_escalera_abrigo.jpg","descanso"),
 ("Lu Roth · Bolso y grafitis","lu_roth_50_bolso_grafitis.jpg","contemplar"),
 ("Lu Roth · Bañera violeta","lu_roth_51_banera_violeta.jpg","descanso"),
 ("Lu Roth · Pasillo verde","lu_roth_52_pasillo_verde.jpg","contemplar"),
 ("Lu Roth · Baño turquesa","lu_roth_53_bano_turquesa.jpg","contemplar"),
]
packs = {}
for path in sorted((ROOT/"assets").glob("pack_*.js")):
    src = path.read_text("utf8")
    for idx, kind, b64 in re.findall(
            r'window\.__luxImages\[(\d+)\]="data:image/([^;]+);base64,([^"]+)";', src):
        packs[int(idx)] = base64.b64decode(b64)

def convert(im):
    im = im.convert("RGB")
    w, h = im.size
    test = im.resize((240, 135))
    def dark_strip(x):
        sample = [test.getpixel((x,y)) for y in range(17,121,7)]
        return sum(max(color)<=8 for color in sample) / len(sample) >= .94
    left = right = 0
    while left < 100 and dark_strip(left):
        left += 1
    while right < 100 and dark_strip(239-right):
        right += 1
    if left>=14 and right>=14 and abs(left-right)<17 and 240-left-right>=40:
        im=im.crop((round(w*left/240),0,round(w*(240-right)/240),h))
    w,h=im.size
    if w/h > 16/9:
        nw=round(h*16/9)
        im=im.crop(((w-nw)//2,0,(w+nw)//2,h))
    else:
        nh=round(w*9/16)
        im=im.crop((0,(h-nh)//2,w,(h+nh)//2))
    return im.resize((512,288),Image.Resampling.LANCZOS)

manifest=[]
for i in range(43):
    if i<31:
        original_index = i + (10 if i>=16 else 0)
        packid = 24 + original_index + (1 if original_index>=37 else 0)
        if packid not in packs:
            raise RuntimeError(f"Falta pack {packid} para plano {i+1}")
        im = Image.open(io.BytesIO(packs[packid]))
        scene=scenes[i]
        name,group,time=scene["name"],scene.get("group","contemplar"),scene.get("time","ambos")
    else:
        name,filename,group=names[i-31]
        im=Image.open(ROOT/"assets"/filename)
        time="noche" if i>=38 else "ambos"
    with im:
        shot=convert(im)
        shot.save(SHOTS/f"{i+1:02}.webp","WEBP",quality=53,method=5)
    manifest.append(dict(n=i+1,name=name,group=group,time=time,src=f"planos/{i+1:02}.webp"))
(OUT/"planos.json").write_text(json.dumps(manifest,ensure_ascii=False,separators=(',',':'))+"\n","utf8")

# Radio Lu Roth: conservar las sesiones públicas; solo se cargan al activar SONIDO.
radio_src=(ROOT/"radio.js").read_text("utf8")
pattern=re.search(r"const mixes=(\[[\s\S]*?\]);\s*/\* Sonido continuo",radio_src)
if not pattern:
    raise RuntimeError("No se encuentra el catálogo de SoundCloud")
js_code = r"""
const vm=require('node:vm');
let source='';
process.stdin.on('data',chunk=>source+=chunk);
process.stdin.on('end',()=>{
 const arr=vm.runInNewContext(source,{},{timeout:1000});
 process.stdout.write(JSON.stringify(arr.map((m,i)=>({n:i+1,name:m.name,url:m.url,short:m.short}))));
});
"""
run=subprocess.run(["node","-e",js_code],input=pattern.group(1),text=True,capture_output=True,check=True)
mixes=json.loads(run.stdout)
if len(mixes)<40 or any(not m["url"].startswith("https://soundcloud.com/") for m in mixes):
    raise RuntimeError("Catálogo SoundCloud incompleto")
(OUT/"radio.json").write_text(json.dumps(mixes,ensure_ascii=False,separators=(',',':'))+"\n","utf8")

# La astronomía se calcula 100% localmente; un único script minificado, descargado una sola vez.
vendor=OUT/"vendor"
vendor.mkdir(exist_ok=True)
engine=vendor/"astronomy.browser.min.js"
if not engine.exists() or engine.stat().st_size < 10000:
    urls=[
      "https://cdn.jsdelivr.net/npm/astronomy-engine@2.1.19/astronomy.browser.min.js",
      "https://unpkg.com/astronomy-engine@2.1.19/astronomy.browser.min.js",
    ]
    for url in urls:
        try:
            with urllib.request.urlopen(url,timeout=25) as response:
                data=response.read(350000)
            if len(data)>10000 and b"function" in data:
                engine.write_bytes(data)
                break
        except Exception as err:
            print("Motor astronómico no disponible en:",url,err)
    else:
        raise RuntimeError("No se pudo descargar Astronomy Engine")
summary=sum((SHOTS/f"{i+1:02}.webp").stat().st_size for i in range(43))
print(f"OK: 43 fotografías · {summary:,} bytes · radio {len(mixes)} sesiones · Astronomy Engine {engine.stat().st_size:,} bytes")
