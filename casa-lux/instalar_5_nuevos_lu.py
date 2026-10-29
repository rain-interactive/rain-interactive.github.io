#!/usr/bin/env python3
"""Instala los cinco planos definitivos (49–53) desde el ZIP JPG FHD aportado por el usuario.
No toca ni recomprime las fotografías, ni modifica los 48 planos existentes.
"""
from pathlib import Path
from zipfile import ZipFile
from PIL import Image
import re

ROOT=Path(__file__).resolve().parent
ZIP=ROOT/"Lu_Roth_Planos_49_a_53_FHD.zip"
ASSETS=ROOT/"assets"
ITEMS=[
 ("49_escalera_abrigo.jpg","lu_roth_49_escalera_abrigo.jpg","Lu Roth · Escaleras y abrigo","descanso","[49,53]"),
 ("50_bolso_grafitis.jpg","lu_roth_50_bolso_grafitis.jpg","Lu Roth · Bolso y grafitis","contemplar","[55,52]"),
 ("51_banera_violeta.jpg","lu_roth_51_banera_violeta.jpg","Lu Roth · Bañera violeta","descanso","[55,49]"),
 ("52_pasillo_verde.jpg","lu_roth_52_pasillo_verde.jpg","Lu Roth · Pasillo verde","contemplar","[49,15]"),
 ("53_bano_turquesa.jpg","lu_roth_53_bano_turquesa.jpg","Lu Roth · Baño turquesa","contemplar","[57,34]"),
]
if not ZIP.is_file():
 raise FileNotFoundError("Falta "+str(ZIP)+"; sube el archivo ZIP a casa-lux")
ASSETS.mkdir(exist_ok=True)
with ZipFile(ZIP) as z:
 for member,target,*_ in ITEMS:
  if member not in z.namelist():raise ValueError("Falta en el ZIP: "+member)
  blob=z.read(member)
  out=ASSETS/target
  out.write_bytes(blob)
  with Image.open(out) as img:
   img.verify()
  with Image.open(out) as img:
   assert img.size==(1920,1080),f"Resolución inesperada en {member}: {img.size}"
print("Cinco JPG 1920x1080 instalados sin pérdida")

f=ROOT/"index.html"
html=f.read_text(encoding="utf-8")
mark=" {name:'Lux · Retrato fragmentado',group:'crear',time:'ambos',src:'assets/lux_49_retrato_fragmentado.jpg'}"
if "lu_roth_49_escalera_abrigo.jpg" not in html:
 assert html.count(mark)==1, "No se ha encontrado el final del catálogo previo"
 add="".join(f",\n {{name:'{name}',group:'{group}',time:'noche',src:'assets/{target}'}}" for _,target,name,group,_ in ITEMS)
 html=html.replace(mark,mark+add)
 html=html.replace("Orden: 41 escenas de los packs + 7 planos individuales existentes.",
                   "Orden: 41 escenas de los packs + 12 planos individuales existentes.")
 focus_last="[51,43],[50,46],[50,38],[51,46],[50,41],[50,47],[50,40]"
 assert html.count(focus_last)==1, "No se encuentra el final de los encuadres"
 html=html.replace(focus_last,focus_last+","+",".join(e[4] for e in ITEMS))
 html=html.replace("const focus=luFocus[index]||[50,45];",
                   "const focus=(luFrameFocusByFilename[src.split('/').pop()]||luFocus[index]||[50,45]);")
 maptext="const luFrameFocusByFilename={\n"+ "".join(f" '{target}':{focus},\n" for _,target,_,_,focus in ITEMS)+"};\n"
 assert html.count("const luFrameCache=new Map();")==1
 html=html.replace("const luFrameCache=new Map();",maptext+"const luFrameCache=new Map();")
 f.write_text(html,encoding="utf-8")
print("Casa de Lu Roth: 53 planos, encuadres individuales y 3 min preservados")

g=ROOT/"generar_catalogo_cine.py"
cat=g.read_text(encoding="utf-8")
if "lu_roth_49_escalera_abrigo.jpg" not in cat:
 marker='    ("Lux · Retrato fragmentado", "assets/lux_49_retrato_fragmentado.jpg")'
 assert cat.count(marker)==1
 appended=",\n"+",\n".join(f'    ("{name}", "assets/{target}")' for _,target,name,_,_ in ITEMS)
 cat=cat.replace(marker,marker+appended)
 assert "assert len(scenes) == 41 and len(independent) == 7 and len(focus) == 48" in cat
 cat=cat.replace("assert len(scenes) == 41 and len(independent) == 7 and len(focus) == 48",
                 "assert len(scenes) == 41 and len(independent) == 12 and len(focus) == 53")
 assert cat.count(focus_last)==1
 cat=cat.replace(focus_last,focus_last+","+",".join(e[4] for e in ITEMS))
 cat=cat.replace("ROWS = math.ceil(48/COLS)","ROWS = math.ceil(len(focus)/COLS)")
 cat=cat.replace('"48 planos · zoom a pantalla completa · selección automática cada tres minutos"',
                 '"53 planos · zoom a pantalla completa · selección automática cada tres minutos"')
 cat=cat.replace("for i in range(48):","for i in range(len(focus)):")
 g.write_text(cat,encoding="utf-8")
print("Generador del catálogo: 53 encuadres")
