#!/usr/bin/env python3
"""Resumen público de noticias para el cuaderno cultural; no confirma plazos de solicitud."""
import json
import re
import urllib.parse
import urllib.request
import xml.etree.ElementTree as ET
from datetime import datetime, timezone, timedelta
from email.utils import parsedate_to_datetime
from pathlib import Path

QUERIES = {
    "coruna": [
        '"A Coruña" (exposición OR exposiciones OR festival OR museo OR concierto OR cine) when:21d',
        '"Coruña" ("arte contemporáneo" OR "agenda cultural" OR exposiciones) when:21d',
    ],
    "santiago": [
        '"Santiago de Compostela" (exposición OR cine OR museo OR festival OR arte) when:21d',
        '"Compostela" ("programación cultural" OR "Compostela Cultura" OR Cineuropa) when:21d',
    ],
    "becas": [
        '(Galicia OR España) ("convocatoria artística" OR "residencias artísticas" OR "becas creación") when:35d',
        '(Galicia OR España) ("artes visuales" OR "arte contemporáneo") (ayudas OR premios OR convocatorias) when:35d',
    ],
}
ART = re.compile(r"exposici|cultur|cine|cinema|festiv|galer|muse|arte|teatr|concert|concerto|m[uú]sica|escult|fotograf", re.I)
GRANTS = re.compile(r"convocat|beca|bolsa|ayud|axuda|residen|premio|concurso|proyect|proxect|subvenc", re.I)
NOISE = re.compile(r"deporte|f[uú]tbol|liga|vivienda|inmobili|gasolina|restaurante|gastronom", re.I)
def read_feed(query):
    url="https://news.google.com/rss/search?"+urllib.parse.urlencode({"q":query,"hl":"es","gl":"ES","ceid":"ES:es"})
    req=urllib.request.Request(url,headers={"User-Agent":"Mozilla/5.0 (compatible; CultureNotebook/1.0)"})
    with urllib.request.urlopen(req,timeout=20) as resp:
        xml=resp.read(1600000)
    return ET.fromstring(xml).findall("./channel/item")
def build():
    result={"updated_at":datetime.now(timezone.utc).isoformat(timespec="seconds"),"coruna":[],"santiago":[],"becas":[]}
    now=datetime.now(timezone.utc)
    for category,queries in QUERIES.items():
        collected=[]
        for query in queries:
            try:
                nodes=read_feed(query)
            except Exception as e:
                print("RSS no disponible:",category,type(e).__name__,str(e)[:120])
                continue
            for item in nodes:
                title=" ".join((item.findtext("title") or "").split())
                link=(item.findtext("link") or "").strip()
                if not title or not link.startswith("https://") or NOISE.search(title):continue
                if category=="becas" and not GRANTS.search(title):continue
                if category!="becas" and not ART.search(title):continue
                try:published=parsedate_to_datetime(item.findtext("pubDate") or "").astimezone(timezone.utc)
                except Exception:continue
                if published>now+timedelta(days=1) or now-published>timedelta(days=(40 if category=="becas" else 25)):continue
                source=(item.findtext("source") or "Noticia").strip()[:70]
                title=re.sub(r"\s+-\s+"+re.escape(source)+r"$","",title,flags=re.I).strip()
                collected.append({"title":title[:190],"link":link,"date":published.date().isoformat(),"source":source})
        found=set()
        for event in sorted(collected,key=lambda x:x["date"],reverse=True):
            k=re.sub(r"\W","",event["title"].lower())[:70]
            if k in found:continue
            found.add(k);result[category].append(event)
            if len(result[category])>=8:break
    return result

if __name__=="__main__":
    file=Path("casa-lux/boletin.json")
    previous={}
    if file.exists():
        try:previous=json.loads(file.read_text("utf-8"))
        except Exception:pass
    data=build()
    for key in ("coruna","santiago","becas"):
        if not data[key]:data[key]=previous.get(key,[])[:8]
    file.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n","utf-8")
    print("Boletín guardado:",{k:len(data[k]) for k in ("coruna","santiago","becas")})
