(function luVision(){
'use strict';
// EXPERIMENTO 02 · OJOS DE LU. Visión pixelar local; no reconoce personas ni objetos.
// No captura la pantalla ni usa webcams: solo analiza las fotos de la propia instalación.
const house=window.__luHouse;
if(!house)return;
const storeKey='lu-roth-ojos-v1',profiles=new Map();
const cap=(v,a,b)=>Math.max(a,Math.min(b,v));
let scanned=0,total=0,queue=[],working=false,started=false,lastHold=0;
let experiences=[];
try{
 const data=JSON.parse(localStorage.getItem(storeKey)||'null');
 if(data&&typeof data==='object'){
  for(const [k,v] of Object.entries(data.profiles||{}))
   if(k.startsWith('scene-')&&v&&Number.isFinite(v.brightness)&&typeof v.signature==='string')profiles.set(k,v);
  experiences=Array.isArray(data.experiences)?data.experiences.slice(-55):[];
 }
}catch{}
const persist=()=>{
 try{
  const tiny={};
  for(const [k,v] of Array.from(profiles.entries()).slice(-100))tiny[k]=v;
  localStorage.setItem(storeKey,JSON.stringify({profiles:tiny,experiences:experiences.slice(-55)}));
 }catch{}
};
const signature=src=>{
 if(typeof src!=='string')return '';
 // La cadena de imagen puede ser una data URI enorme: no se guarda su contenido.
 return [src.length,src.slice(0,26),src.slice(-25)].join(':');
};
const key=i=>'scene-'+i;
function get(i,scene){
 const p=profiles.get(key(i));
 return p&&p.signature===signature(scene?.src)?p:null;
}
function sample(img,signatureString){
 const W=120,H=68,canvas=document.createElement('canvas');
 canvas.width=W;canvas.height=H;
 const ctx=canvas.getContext('2d',{willReadFrequently:true});
 if(!ctx)return null;
 ctx.drawImage(img,0,0,W,H);
 const d=ctx.getImageData(0,0,W,H).data;
 const lum=new Float32Array(W*H);
 let sum=0,sumSq=0,saturation=0,warm=0,edginess=0,red=0,green=0,blue=0;
 let massX=0,massY=0,mass=0;
 const bands=[{score:0,count:0},{score:0,count:0},{score:0,count:0}];
 for(let y=0;y<H;y++){
  for(let x=0;x<W;x++){
   const j=y*W+x,i=j*4,r=d[i]/255,g=d[i+1]/255,b=d[i+2]/255;
   const l=(.2126*r+.7152*g+.0722*b);
   const chroma=Math.max(r,g,b)-Math.min(r,g,b);
   lum[j]=l;sum+=l;sumSq+=l*l;saturation+=chroma;
   red+=r;green+=g;blue+=b;warm+=r-b;
   const horizontal=x?Math.abs(l-lum[j-1]):0;
   const vertical=y?Math.abs(l-lum[j-W]):0;
   const edge=cap((horizontal+vertical)*1.5,0,1);
   edginess+=edge;
   // La energía visual indica textura o bordes, nunca identifica un rostro.
   const importance=cap(edge*2.6+.035,0,1);
   massX+=importance*x/W;massY+=importance*y/H;mass+=importance;
   if(x>W*.20&&x<W*.80){
    const band=y<H*.62?0:y<H*.72?1:y<H*.82?2:-1;
    if(band>=0){
     bands[band].score+=edge*.62+l*.36;
     bands[band].count++;
    }
   }
  }
 }
 const n=W*H,brightness=sum/n,detail=edginess/n,contrast=Math.sqrt(Math.max(0,sumSq/n-brightness*brightness));
 const center=mass>0?{x:cap(massX/mass,.27,.73),y:cap(massY/mass,.25,.67)}:{x:.5,y:.44};
 let choice=2,small=Infinity;
 for(let i=0;i<bands.length;i++){
  const b=bands[i];if(!b.count)continue;
  const rank=b.score/b.count+(i===0?.025:0);
  if(rank<small){choice=i;small=rank}
 }
 const bottom=[410,310,225][choice];
 let tone='neutro';
 if(brightness<.34)tone='oscuro';
 else if(brightness>.68)tone='luminoso';
 else if(warm/n>.095)tone='cálido';
 else if(warm/n<-.075)tone='frío';
 const precision=v=>Math.round(v*1000)/1000;
 return {
  signature:signatureString,
  brightness:precision(brightness),contrast:precision(contrast),
  saturation:precision(saturation/n),detail:precision(detail),
  warmth:precision(warm/n),
  rgb:[precision(red/n),precision(green/n),precision(blue/n)],
  center:{x:precision(center.x),y:precision(center.y)},
  captionBottom:bottom,tone
 };
}
function inspect(i,scene){
 const existing=get(i,scene);
 if(existing)return Promise.resolve(existing);
 if(!scene?.src)return Promise.resolve(null);
 return new Promise(resolve=>{
  const img=new Image();
  let done=false;
  const finish=p=>{
   if(done)return;
   done=true;
   img.onload=img.onerror=null;
   if(p){profiles.set(key(i),p);persist()}
   resolve(p);
  };
  img.onload=()=>{
   try{finish(sample(img,signature(scene.src)))}catch{finish(null)}
  };
  img.onerror=()=>finish(null);
  // Son data:image y archivos del mismo origen: no se envía información a terceros.
  img.src=scene.src;
  if(img.complete&&img.naturalWidth){try{finish(sample(img,signature(scene.src)))}catch{finish(null)}}
 });
}
function warmup(){
 if(working||!queue.length)return;
 if(document.hidden){setTimeout(warmup,2500);return}
 working=true;
 const item=queue.shift();
 inspect(item.i,item.scene).then(()=>{
  scanned=Math.max(scanned,profiles.size);
 }).finally(()=>{
  working=false;
  setTimeout(warmup,650);
 });
}
function begin(scenes){
 if(!Array.isArray(scenes))return;
 total=scenes.filter(x=>x?.src).length;
 if(started)return;
 started=true;
 const current=house.getState()?.index??0;
 queue=scenes.map((scene,i)=>({scene,i}))
  .filter(x=>x.scene?.src&&!get(x.i,x.scene))
  .sort((a,b)=>Math.abs(a.i-current)-Math.abs(b.i-current));
 scanned=total-queue.length;
 warmup();
}
function profile(index,scene){return get(index,scene)}
function score(index,scene,mood,previousIndex,scenes){
 const p=get(index,scene);
 if(!p)return 1;
 const prior=scenes?.[previousIndex]?get(previousIndex,scenes[previousIndex]):null;
 let match=1;
 if(/noche|insomnio/.test(mood))match*=1+cap((.52-p.brightness)*.65,-.23,.25);
 if(/mañana|taller/.test(mood))match*=1+cap((p.brightness-.43)*.42,-.17,.22);
 if(/lluvia|gris/.test(mood))match*=1+cap(-p.warmth*.45,-.1,.1);
 if(mood==='atardecer')match*=1+cap(p.warmth*.55,-.12,.14);
 if(prior){
  const separation=Math.abs(p.brightness-prior.brightness)*.32+
      Math.abs(p.warmth-prior.warmth)*.22;
  match*=1+cap(separation,.0,.17);
 }
 // El historial de elecciones favorece novedades visuales sin reentrenar un modelo.
 const recent=experiences.slice(-8).filter(x=>x.key===key(index)).length;
 match*=1/(1+recent*.15);
 return cap(match,.65,1.4);
}
function shouldHold(index,scene,mood){
 if(!scene||Date.now()-lastHold<6*60*1000)return false;
 const p=get(index,scene);
 if(!p)return false;
 const quiet=p.detail<.115&&p.contrast<.31;
 const chance=(quiet?.14:.04)+(mood==='lluvia nocturna'?.055:0);
 if(Math.random()>=chance)return false;
 lastHold=Date.now();
 return true;
}
function remember(index,mood,hold=false){
 experiences.push({key:key(index),mood,hold,at:Date.now()});
 experiences=experiences.slice(-55);
 persist();
}
function presentation(index,scene,layer){
 if(!layer||!scene?.src)return Promise.resolve(null);
 return inspect(index,scene).then(p=>{
  if(!p||window.__luAutonomy?.getState?.().enabled!==true)return p;
  if(layer.dataset.luCurrentSrc!==scene.src)return p;
  if(house.getState()?.index!==index)return p;
  // El foco facial/manual del autor prevalece sobre la saliencia de bordes.
  const cssFocus=(name,fallback)=>{
   const raw=parseFloat(layer.style.getPropertyValue(name));
   return Number.isFinite(raw)?raw:fallback;
  };
  const oldX=cssFocus('--lu-focus-x',50),oldY=cssFocus('--lu-focus-y',45);
  const x=cap(oldX+(p.center.x*100-oldX)*.13,oldX-4,oldX+4);
  const y=cap(oldY+(p.center.y*100-oldY)*.11,oldY-4,oldY+4);
  layer.style.setProperty('--lu-focus-x',x.toFixed(1)+'%');
  layer.style.setProperty('--lu-focus-y',y.toFixed(1)+'%');
  const slow=p.detail<.13?230:p.detail>.26?170:195;
  layer.style.setProperty('--lu-vision-duration',slow+'s');
  layer.style.setProperty('--lu-motion-x',p.center.x>.53?'-.24%':'.24%');
  layer.style.setProperty('--lu-motion-y',p.center.y>.45?'.20%':'-.20%');
  const stage=document.getElementById('stage');
  if(stage)stage.style.setProperty('--lu-vision-caption-bottom',p.captionBottom+'px');
  return p;
 });
}
function view(index,scenes){return get(index,scenes?.[index])}
function summary(p){
 if(!p)return 'Análisis visual en curso';
 return 'Imagen '+p.tone+' · luz '+Math.round(p.brightness*100)+'% · contraste '+Math.round(p.contrast*100)+'% · detalle '+Math.round(p.detail*100)+'%';
}
window.__luVision={begin,inspect,profile,view,score,shouldHold,remember,presentation,summary,
 status:()=>({analyzed:Math.min(total,profiles.size),total,last:experiences.at(-1)||null})};
})();