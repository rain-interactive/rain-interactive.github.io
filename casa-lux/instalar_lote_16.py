#!/usr/bin/env python3
"""Integrar lote validado de 16 WebP Full-HD en Casa de Lux.
Requiere cargar previamente casa-lux/lux_16_upload.zip desde el ZIP adjunto.
Preserva los 34 originales y los controles de correo, música y rutinas.
"""
from pathlib import Path
from PIL import Image
import base64,io,json,re,zipfile,sys

ROOT=Path('casa-lux')
ARCHIVE=ROOT/'lux_16_upload.zip'
assert ARCHIVE.exists(),f'Falta {ARCHIVE}'
HTML_PATH=ROOT/'index.html'
html=HTML_PATH.read_text('utf-8')
match=re.search(r'const scenes=(\[.*?\]);',html,re.S)
assert match,'No se encontró const scenes'
scenes=json.loads(match.group(1))
if len(scenes)==50 and (ROOT/'lote_16_integrado.json').exists():
    print('Lote ya instalado: 50 planos únicos.');sys.exit(0)
assert len(scenes)==34,f'Esperados 34 originales, encontrados {len(scenes)}'

entries=[
('Lucía · estudio negro','contemplar','ambos'),
('Leopardo verde · retrato','crear','ambos'),
('Aerógrafo · jardín lunar','crear','dia'),
('Escultura · espinas','crear','ambos'),
('Contactos fotográficos','crear','ambos'),
('Alas al contraluz','contemplar','noche'),
('Convergencia radial','contemplar','noche'),
('VLTRABRVTALISMA · El origen','crear','ambos'),
('VLTRABRVTALISMA · La paradoja','crear','noche'),
('VLTRABRVTALISMA · La máscara','crear','noche'),
('VLTRABRVTALISMA · La armadura','crear','noche'),
('VLTRABRVTALISMA · El vestido','crear','noche'),
('VLTRABRVTALISMA · La mercancía','crear','noche'),
('VLTRABRVTALISMA · El salón','crear','noche'),
('VLTRABRVTALISMA · La frecuencia','musica','noche'),
('VLTRABRVTALISMA · El manifiesto','crear','noche')]

with zipfile.ZipFile(ARCHIVE) as z:
    manifest=json.loads(z.read('Lux_16_fotos_FullHD/manifest.json'))
    assert manifest['size']==[1920,1080] and len(manifest['scenes'])==16
    for i,record in enumerate(manifest['scenes']):
        idx=34+i
        raw=z.read('Lux_16_fotos_FullHD/'+record['file'])
        with Image.open(io.BytesIO(raw)) as image:
            assert image.size==(1920,1080),(record['file'],image.size)
        scenes.append({'name':entries[i][0],'group':entries[i][1],'time':entries[i][2],
           'src':'','width':1920,'height':1080,'orig':'aportado por el usuario · plano FHD único'})
        packno=13+i//3
        path=ROOT/'assets'/f'pack_{packno:02}.js'
        if i%3==0:
            path.write_text('window.__luxImages=window.__luxImages||[];\n',encoding='utf-8')
        with path.open('a',encoding='utf-8') as o:
            o.write(f'window.__luxImages[{idx}]="data:image/webp;base64,{base64.b64encode(raw).decode()}";\n')
    print('Integradas imágenes nuevas: 16')
assert len(scenes)==50
html=html[:match.start()]+'const scenes='+json.dumps(scenes,ensure_ascii=False,separators=(',',':'))+';'+html[match.end():]
anchor='<script src="assets/pack_12.js"></script>'
assert anchor in html,'Falta pack_12'
html=html.replace(anchor,anchor+'\n'+'\n'.join(f'<script src="assets/pack_{n:02}.js"></script>' for n in range(13,19)),1)
html=html.replace('34 planos automáticos','50 planos automáticos')
html=html.replace('34 planos, formato','50 planos, formato')
html=html.replace('34 encuadres','50 encuadres').replace('34 scenes','50 scenes').replace('34 photographs','50 photographs')
HTML_PATH.write_text(html,encoding='utf-8')
(ROOT/'lote_16_integrado.json').write_text(json.dumps({
 'previous':34,'new':16,'total':50,'size':[1920,1080],
 'names':[x[0] for x in entries]},indent=2,ensure_ascii=False)+'\n',encoding='utf-8')
print('Casa de Lux: 50 planos a 1920 × 1080')
