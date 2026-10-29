#!/usr/bin/env python3
"""Elimina el fondo desenfocado de las fotografías verticales de Casa de Lux.

No escala ni recorta el contenido central: reemplaza únicamente el margen
externo que se generó con GaussianBlur en los lotes 34–65.
"""
from __future__ import annotations
import base64
import io
import json
from pathlib import Path
import re
from PIL import Image, ImageOps, ImageDraw, ImageFont

ROOT=Path('casa-lux')
PACK_DIR=ROOT/'assets'
MARK=ROOT/'bordes_negros_aplicados.json'
W,H=1920,1080
# Tamaños originales, en el orden de importación de las fotografías aportadas.
SIZES=[
  (1536,864), (1024,1536), (1536,1024), (1536,1536),
  (1280,1536), (1148,1536), (1084,1536),
  *((1229,1536) for _ in range(9)),
  (864,1536), (1536,1404), (1313,1536), (1030,1536),
  (1229,1536), (887,1536), (983,1536),
  (1536,1536), (1536,1403), (1536,1536), (1536,1536),
  (1536,1024), (1152,1536), (1536,1501), (1228,1536), (1536,1280)
]
assert len(SIZES)==32, len(SIZES)
ORIGINAL={34+i:s for i,s in enumerate(SIZES)}
RE=re.compile(r'window\.__luxImages\[(\d+)\]="data:image/webp;base64,([A-Za-z0-9+/=]+)";')

def contained_dimensions(source):
    ow,oh=source
    if ow/oh > W/H:
        return W,round(oh*W/ow)
    return round(ow*H/oh),H

def main():
    if MARK.exists():
        status=json.loads(MARK.read_text('utf-8'))
        assert status.get('final_count')==66
        print('Bordes negros ya aplicados: no se reencodifican archivos.')
        return
    found=set(); revised={}; untouched=[]
    for n in range(13,30):
        path=PACK_DIR/f'pack_{n:02d}.js'
        content=path.read_text('utf-8')
        def replace(m):
            idx=int(m.group(1))
            assert idx in ORIGINAL and idx not in found, ('Índice no esperado o duplicado',idx)
            found.add(idx)
            ow,oh=ORIGINAL[idx]
            iw,ih=contained_dimensions((ow,oh))
            left=(W-iw)//2;top=(H-ih)//2
            if iw==W and ih==H:
                untouched.append(idx+1)
                return m.group(0)
            blob=base64.b64decode(m.group(2))
            with Image.open(io.BytesIO(blob)) as opened:
                assert opened.size==(W,H),(idx,opened.size)
                im=opened.convert('RGB')
            # Solo se cubren las zonas que procedían del relleno desenfocado.
            # Se preserva el rectángulo original (reencodificado a WebP).
            if left:
                im.paste((0,0,0),(0,0,left,H))
                im.paste((0,0,0),(left+iw,0,W,H))
            if top:
                im.paste((0,0,0),(0,0,W,top))
                im.paste((0,0,0),(0,top+ih,W,H))
            out=io.BytesIO();im.save(out,'WEBP',quality=94,method=5)
            revised[idx]={'image':im,'original_size':[ow,oh], 'content_rect':[left,top,iw,ih]}
            return f'window.__luxImages[{idx}]="data:image/webp;base64,{base64.b64encode(out.getvalue()).decode()}";'
        result,n_subs=RE.subn(replace,content)
        assert n_subs>0,(path,n_subs)
        if result!=content:
            path.write_text(result,'utf-8')
    assert sorted(found)==list(range(34,66)), ('Unexpected indices',sorted(found))
    assert 34+len(found)==66
    # Comprobación directa de bordes negros dentro de los WebP publicados.
    for n in range(13,30):
        text=(PACK_DIR/f'pack_{n:02d}.js').read_text('utf-8')
        for idx_s,data in RE.findall(text):
            idx=int(idx_s)
            iw,ih=contained_dimensions(ORIGINAL[idx]);left=(W-iw)//2;top=(H-ih)//2
            with Image.open(io.BytesIO(base64.b64decode(data))) as im:
                assert im.size==(W,H)
                rgb=im.convert('RGB')
                # WebP genera ruido de compresión ±2 en los píxeles negros.
                for p in [(0,H//2),(W-1,H//2)] if left else ([(W//2,0),(W//2,H-1)] if top else []):
                    assert max(rgb.getpixel(p))<=4,(idx,p,rgb.getpixel(p))
    fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'
    font=ImageFont.truetype(fontpath,14)
    title=ImageFont.truetype(fontpath,22)
    cw,ch=322,181;gap=12;cols=4;rows=8;top=72
    poster=Image.new('RGB',(cols*(cw+gap)+gap,top+rows*(ch+gap)+gap),(0,0,0))
    draw=ImageDraw.Draw(poster)
    draw.text((15,16),'CASA DE LUX · FONDO NEGRO · 1920 × 1080',font=title,fill='white')
    for i,idx in enumerate(range(34,66)):
        n=idx+1;c=i%cols;r=i//cols;x=gap+c*(cw+gap);y=top+r*(ch+gap)
        if idx in revised:
            src=revised[idx]['image']
        else:
            src=None
        if src is None: # El único plano panorámico se rescata de su pack sin alterarlo.
            raw=(PACK_DIR/f'pack_{13+(idx-34)//2:02d}.js').read_text('utf-8')
            match=next(m for m in RE.finditer(raw) if int(m.group(1))==idx)
            src=Image.open(io.BytesIO(base64.b64decode(match.group(2)))).convert('RGB')
        tile=src.resize((cw,ch),Image.Resampling.LANCZOS)
        poster.paste(tile,(x,y))
        draw.rectangle((x,y+ch-22,x+46,y+ch),fill=(0,0,0))
        draw.text((x+5,y+ch-20),str(n),font=font,fill='white')
    poster.save(ROOT/'bordes_negros_miniaturas.jpg',quality=86,optimize=True)
    status={'final_count':66,'checked_indices':[i+1 for i in sorted(found)],
        'modified_indices':[i+1 for i in sorted(revised)],'preserved_full_frame':untouched,
        'resolution':[W,H],'policy':'Conservar toda la fotografía; reemplazar solo márgenes desenfocados por negro puro.'}
    MARK.write_text(json.dumps(status,ensure_ascii=False,indent=2)+'\n','utf-8')
    print('VERIFICADO:',len(revised),'bordes negros,',len(untouched),'panorámicos sin cambios; escenas existentes 66')

if __name__=='__main__': main()