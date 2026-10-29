#!/usr/bin/env python3
"""Casa de Lux: elimina los márgenes desenfocados de los 24 primeros planos
y publica una hoja JPG numerada con TODOS los 66 planos de la instalación.

El centro original cuadrado 1080x1080 se preserva, sin recortes ni ampliación.
Los demás planos no se tocan: 31 de los nuevos ya tenían bandas negras.
"""
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps
import base64, io, json, re

ROOT=Path(__file__).resolve().parent
PACKS=ROOT/'assets'
HTML=(ROOT/'index.html').read_text('utf8')
match=re.search(r'const scenes=(\[.*?\]);',HTML,re.S)
assert match, "No existe la lista de planos"
SCENES=json.loads(match.group(1))
assert len(SCENES)==66,(len(SCENES),'escenas distintas de 66')
W,H=1920,1080
LEFT=420;CENTRAL=1080;RIGHT=1500
PAT=re.compile(r'window\.__luxImages\[(\d+)\]="data:image/webp;base64,([A-Za-z0-9+/=]+)";')
REPORT=ROOT/'bordes_negros_originales.json'
ALREADY=REPORT.exists()
images={}
changed=[]
packs=[]
for n in range(1,30):
    path=PACKS/f'pack_{n:02d}.js'
    source=path.read_text('utf8')
    def transform(m):
        idx=int(m.group(1))
        assert idx not in images,(idx,"imagen duplicada")
        data=base64.b64decode(m.group(2))
        with Image.open(io.BytesIO(data)) as raw:
            assert raw.size==(W,H),(idx+1,raw.size)
            im=raw.convert('RGB')
        if idx<24 and not ALREADY:
            # Los 24 primeros planos están creados como una foto cuadrada
            # (x 420..1500) con las columnas laterales desenfocadas.
            # Sustituimos únicamente esas columnas por negro puro.
            central=im.crop((LEFT,0,RIGHT,H))
            clean=Image.new('RGB',(W,H),(0,0,0))
            clean.paste(central,(LEFT,0))
            im=clean
            buffer=io.BytesIO()
            im.save(buffer,'WEBP',quality=95,method=5)
            data=buffer.getvalue()
            changed.append(idx+1)
        images[idx]=im
        return (f'window.__luxImages[{idx}]="data:image/webp;base64,'
                f'{base64.b64encode(data).decode()}";')
    transformed,count=PAT.subn(transform,source)
    assert count>0,(path,count)
    if not ALREADY and transformed!=source:
        path.write_text(transformed,'utf8')
        packs.append(path.name)
assert sorted(images)==list(range(66)),'Faltan imágenes de la secuencia'
assert ALREADY or changed==list(range(1,25)),changed

# Imagen JPG alta resolución con todos los planos y números grandes.
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
titlefont=ImageFont.truetype(fontpath,34)
subfont=ImageFont.truetype(fontpath,19)
namefont=ImageFont.truetype(fontpath,16)
numberfont=ImageFont.truetype(fontpath,28)
cols=6
rows=11
w,h=355,200
gap=14
label_height=51
cell_h=h+label_height
header=105
sheet_w=cols*(w+gap)+gap
sheet_h=header+rows*(cell_h+gap)+gap
sheet=Image.new('RGB',(sheet_w,sheet_h),'#070707')
draw=ImageDraw.Draw(sheet)
draw.text((25,17),"CASA DE LUX · 66 PLANOS",fill="#fff",font=titlefont)
draw.text((25,68),"Todos los planos numerados · 1920 × 1080 · fotografía íntegra y fondo negro",fill="#c2c2c2",font=subfont)
for index in range(66):
    col=index%cols
    row=index//cols
    x=gap+col*(w+gap)
    y=header+gap+row*(cell_h+gap)
    thumb=images[index].resize((w,h),Image.Resampling.LANCZOS)
    sheet.paste(thumb,(x,y))
    draw.rectangle((x+4,y+4,x+57,y+36),fill="#000")
    draw.text((x+10,y+5),f'{index+1:02d}',fill="#fff",font=numberfont)
    draw.rectangle((x,y+h,x+w,y+h+label_height),fill="#111")
    text=SCENES[index]["name"]
    # Tamaño de título consistente; cortar solo etiqueta, nunca la fotografía.
    while draw.textbbox((0,0),text,font=namefont)[2] > w-16 and len(text)>8:
        text=text[:-2].rstrip(' .')+'…'
    draw.text((x+8,y+h+12),text,fill="#fff",font=namefont)
path=ROOT/'Casa_de_Lux_66_planos_numerados.jpg'
sheet.save(path,'JPEG',quality=90,optimize=True,subsampling=0)
if not ALREADY:
    REPORT.write_text(json.dumps({
        'total':66,'modified_indices':changed,'other_existing_borders':[i for i in range(36,67)],
        'untouched_indices':[i for i in range(25,36)],
        'photo_center':[LEFT,0,CENTRAL,H],'resolution':[W,H],
        'reason':'Fotos iniciales cuadradas 1080x1080 con relleno lateral desenfocado'},
        ensure_ascii=False,indent=2)+'\n','utf8')
print('OK',len(images),'fotos JPG',path, path.stat().st_size,'bytes')
print('Márgenes negros nuevos',len(changed),'packs',packs)
