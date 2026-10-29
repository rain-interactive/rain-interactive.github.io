#!/usr/bin/env python3
"""Auditoría visual de los 50 planos reales de casa-lux.
Fase diagnóstico: no altera imágenes. Fase aplicar: elimina no-FHD y duplicados.
"""
import argparse
import base64
import io
import json
import re
from pathlib import Path
from PIL import Image, ImageChops, ImageStat, ImageOps, ImageDraw, ImageFont
import imagehash

ROOT=Path("casa-lux")
PACKS=ROOT/"assets"
FRAME_PATTERN=re.compile(r'window\.__luxImages\[(\d+)\]="data:image/([^;]+);base64,([^"]+)";')
SCENES_PATTERN=re.compile(r'const scenes=(\[.*?\]);',re.DOTALL)

def load():
    data={}
    for path in sorted(PACKS.glob("pack_*.js")):
        s=path.read_text("utf-8")
        for idx,kind,b64 in FRAME_PATTERN.findall(s):
            i=int(idx)
            assert i not in data, ("Índice duplicado en packs",i,path)
            raw=base64.b64decode(b64)
            with Image.open(io.BytesIO(raw)) as img:
                img.load()
                rgb=img.convert("RGB")
            data[i]={"image":rgb,"raw":raw,"kind":kind,"pack":path.name}
    html=(ROOT/"index.html").read_text("utf-8")
    m=SCENES_PATTERN.search(html)
    assert m, "No se encontró la lista de escenas"
    scenes=json.loads(m.group(1))
    return data,scenes,html

def analyze(data,scenes):
    rows=[]
    for i in sorted(data):
        img=data[i]["image"]
        rows.append({"index":i,"number":i+1,"name":scenes[i]["name"],"width":img.width,"height":img.height,
                     "fhd":img.size==(1920,1080),"phash":str(imagehash.phash(img,hash_size=16)),
                     "dhash":str(imagehash.dhash(img,hash_size=16)),"pack":data[i]["pack"]})
    # Las distancias se normalizan a escala 64 bits para facilitar lectura
    byid={r["index"]:r for r in rows}
    pairs=[]
    for n,a in enumerate(rows):
        for b in rows[n+1:]:
            pa=imagehash.hex_to_hash(a["phash"]);pb=imagehash.hex_to_hash(b["phash"])
            da=imagehash.hex_to_hash(a["dhash"]);db=imagehash.hex_to_hash(b["dhash"])
            p=int((pa-pb)/4);d=int((da-db)/4)
            if p<=19 or d<=14:
                pairs.append({"a":a["number"],"b":b["number"],"phash64":p,"dhash64":d,
                              "same_pixels":data[a["index"]]["raw"]==data[b["index"]]["raw"]})
    pairs.sort(key=lambda x:(min(x["phash64"],x["dhash64"]),x["phash64"]))
    report={"total":len(rows),"fhd":sum(r["fhd"] for r in rows),
        "non_fhd":[{"number":r["number"],"name":r["name"],"size":f'{r["width"]}x{r["height"]}'} for r in rows if not r["fhd"]],
        "pairs":pairs,"scenes":rows}
    (ROOT/"auditoria_planos.json").write_text(json.dumps(report,ensure_ascii=False,indent=2)+"\n","utf-8")
    return report

def preview(data,scenes,report):
    width=260
    height=146
    cell_h=177
    gap=10
    cols=5
    rows=(len(data)+cols-1)//cols
    out=Image.new("RGB",(cols*(width+gap)+gap,rows*(cell_h+gap)+gap+52),"#11131a")
    draw=ImageDraw.Draw(out)
    font=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",12)
    title=ImageFont.truetype("/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",19)
    draw.text((12,10),f"CASA DE LUX · {len(data)} planos originales · FHD {report['fhd']}",font=title,fill="#faf0ed")
    for i,k in enumerate(sorted(data)):
        col=i%cols;row=i//cols;x=gap+col*(width+gap);y=gap+52+row*(cell_h+gap)
        im=ImageOps.contain(data[k]["image"],(width,height))
        out.paste(im,(x+(width-im.width)//2,y+(height-im.height)//2))
        draw.text((x,y+height+4),f'{k+1:02d} · {scenes[k]["name"][:27]}',font=font,fill="#f6ece8")
        if data[k]["image"].size!=(1920,1080):
            draw.text((x+6,y+6),"NO FHD",font=font,fill="#ff7777",stroke_width=2,stroke_fill="#15151a")
    out.save(ROOT/"auditoria_planos.jpg",quality=88,optimize=True)

def apply(data,scenes,html,report):
    # No elimina duplicados por contenido estético sin una revisión previa explícita:
    # este modo utiliza ids marcados en una selección validada.
    selected=ROOT/"seleccion_planos.json"
    if not selected.exists():
        raise RuntimeError("Falta seleccion_planos.json con índices aprobados, sin alterar imágenes")
    config=json.loads(selected.read_text("utf-8"))
    keep=[int(n)-1 for n in config["keep_numbers"]]
    assert len(set(keep))==len(keep), "Selección con repetidos"
    assert all(n in data and data[n]["image"].size==(1920,1080) for n in keep), "Existe selección no FHD o inexistente"
    assert len(keep)>0,"No hay planos válidos"
    original={old:new for new,old in enumerate(keep)}
    for old in sorted(keep):
        print(f'Conservar {old+1:02d}: {scenes[old]["name"]} {data[old]["image"].size}')
    for path in sorted(PACKS.glob("pack_*.js")):
        path.unlink()
    # Pack 3 fotos para mantener carga progresiva.
    for n in range(0,len(keep),3):
        parts=["window.__luxImages=window.__luxImages||[];"]
        for old in keep[n:n+3]:
            new=original[old]
            b64=base64.b64encode(data[old]["raw"]).decode("ascii")
            parts.append(f'window.__luxImages[{new}]="data:image/{data[old]["kind"]};base64,{b64}";')
        path=PACKS/f"pack_{n//3+1:02d}.js"
        path.write_text("\n".join(parts)+"\n","utf-8")
    new_scenes=[scenes[n] for n in keep]
    html=SCENES_PATTERN.sub(lambda m:"const scenes="+json.dumps(new_scenes,ensure_ascii=False,separators=(',',':'))+";",html,count=1)
    html=re.sub(r'<script src="assets/pack_\d\d\.js"></script>\s*','',html)
    pack_tags='\n'.join(f'<script src="assets/pack_{n:02d}.js"></script>' for n in range(1,(len(keep)+2)//3+1))
    anchor='<script>if(typeof chooseScene'
    assert anchor in html
    html=html.replace(anchor,pack_tags+'\n'+anchor,1)
    html=html.replace('50 planos automáticos',f'{len(keep)} planos automáticos')
    html=html.replace('50 planos, formato',f'{len(keep)} planos, formato')
    html=html.replace('los 50',f'los {len(keep)}')
    html=html.replace('las 50',f'las {len(keep)}')
    (ROOT/"index.html").write_text(html,"utf-8")
    preview({i:data[i] for i in keep},scenes,report)
    audit={"originales":len(data),"conservados":len(keep),"eliminados":len(data)-len(keep),
           "kept_original_numbers":[i+1 for i in keep],"removed":[i+1 for i in sorted(data) if i not in keep],
           "required_size":[1920,1080]}
    (ROOT/"resultado_depuracion.json").write_text(json.dumps(audit,ensure_ascii=False,indent=2)+"\n","utf-8")
    print(json.dumps(audit,ensure_ascii=False))

def main():
    parser=argparse.ArgumentParser()
    parser.add_argument("--apply",action="store_true")
    opts=parser.parse_args()
    data,scenes,html=load()
    assert sorted(data)==list(range(len(scenes))),f'Hay {len(data)} imágenes y {len(scenes)} escenas'
    report=analyze(data,scenes)
    print("TOTALES",report["total"],"FHD",report["fhd"])
    print("TAMAÑOS NO FHD",report["non_fhd"])
    print("PARES PARECIDOS",report["pairs"][:45])
    preview(data,scenes,report)
    if opts.apply:
        apply(data,scenes,html,report)

if __name__=="__main__":
    main()
