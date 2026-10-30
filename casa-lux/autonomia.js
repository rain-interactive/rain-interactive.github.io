(function luBrain(){
'use strict';
// LU ROTH / Autonomía local. Sin observación fuera de esta pestaña ni acceso a dispositivos.
const house=window.__luHouse,stage=document.getElementById('stage'),panel=document.getElementById('panel');
if(!house||!stage||!panel)return;
const key='lu-roth-autonomia-v4',zone='Europe/Madrid',el=id=>document.getElementById(id),txt=id=>(el(id)?.textContent||'').trim();
let memory={enabled:false,events:[],counts:{},ritual:{},longLooks:{},lastDay:'',lastMood:'',lastRadio:0};
try{
 const chosen=localStorage.getItem(key);
 const v3=!chosen?localStorage.getItem('lu-roth-autonomia-v3'):null;
 const previous=chosen?null:(v3||localStorage.getItem('lu-roth-autonomia-v2')||localStorage.getItem('lu-roth-autonomia-v1'));
 const alreadyRenumbered=Boolean(chosen||v3);
 const saved=JSON.parse(chosen||previous||'null');
 // Migrate old scene IDs without confusing removed 17–26 with current 17–26.
 const remap=(id)=>{
  if(typeof id!=='string')return '';
  const match=id.match(/^scene-(\d+)$/);
  if(!match)return '';
  const oldIndex=Number(match[1]);
  if(!Number.isInteger(oldIndex)||oldIndex<0)return '';
  if(alreadyRenumbered)return oldIndex<43?'scene-'+oldIndex:'';
  if(oldIndex>=16&&oldIndex<=25)return '';
  const currentIndex=oldIndex>25?oldIndex-10:oldIndex;
  return currentIndex<43?'scene-'+currentIndex:'';
 };
 if(saved&&typeof saved==='object'){
  // Esta nueva versión se inicia apagada; solo ON explícito activa la autonomía.
  memory.enabled=false; // Cada carga requiere la pulsación ON para activar sonido y director.
  // Migración: no volver a guardar data:image enormes dentro de localStorage.
  memory.events=Array.isArray(saved.events)?saved.events.slice(-60)
   .filter(e=>e&&typeof e.name==='string'&&remap(e.id))
   .map(e=>({
    id:remap(e.id),
    name:e.name.slice(0,110),at:Number(e.at)||Date.now(),mood:String(e.mood||'').slice(0,45),hold:!!e.hold
   })):[];
  memory.counts={};
  for(const [k,v] of Object.entries(saved.counts&&typeof saved.counts==='object'?saved.counts:{})){
   const current=remap(k);
   if(current&&Number.isFinite(Number(v)))memory.counts[current]=Number(v);
  }
  memory.lastMood=typeof saved.lastMood==='string'?saved.lastMood:'';
  memory.lastRadio=Number(saved.lastRadio)||0;
  // Solo se conservan hábitos de esta versión; nunca se fabrican recuerdos retroactivos.
  const validScene=id=>typeof id==='string'&&/^scene-\d+$/.test(id)&&Number(id.slice(6))<43;
  const habits=chosen&&saved.ritual&&typeof saved.ritual==='object'?saved.ritual:{};
  memory.ritual={};
  for(const [m,id] of Object.entries(habits)){
   if(validScene(id)&&m.length<60)memory.ritual[m]=id;
  }
  const looks=chosen&&saved.longLooks&&typeof saved.longLooks==='object'?saved.longLooks:{};
  memory.longLooks={};
  for(const [id,n] of Object.entries(looks)){
   if(validScene(id)&&Number.isFinite(Number(n)))memory.longLooks[id]=Math.max(0,Math.min(9,Number(n)));
  }
  memory.lastDay=chosen&&typeof saved.lastDay==='string'?saved.lastDay.slice(0,12):'';

 }
}catch{}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(memory))}catch{}};
function sense(){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
 const hour=Number(parts.find(p=>p.type==='hour')?.value)||0;
 const weather=txt('weatherText').toLowerCase(),moon=txt('moonName').toLowerCase(),tide=(txt('tideTitle')+' '+txt('tideNext')).toLowerCase();
 const tmp=Number((txt('temp').replace(',','.').match(/-?\d+(?:\.\d+)?/)||[])[0]);
 const radio=window.__luRadio?.getState?.()||null;
 const mail=window.__luMail?.getState?.()||null;
 const subtitle=window.__luNotes?.getState?.()||{text:txt('subtitleText'),visible:!!el('subtitleLux')?.classList.contains('visible')};
 const wind=txt('wind'),nextMoon=txt('nextMoon'),atlantico=txt('atlanticoStatus'),workshop=txt('classStatus');
 const sky=window.__luSky?.getState?.()||null;
 const humidity=Number((txt('humidityValue').match(/\d+(?:[.,]\d+)?/)||[])[0]);
 const outdoorHumidity=Number.isFinite(humidity)?humidity:null;
 return {mail,subtitle,wind,nextMoon,atlantico,workshop,sky,outdoorHumidity,hour,night:hour<10||hour>=20,weather,moon,tide,temp:Number.isFinite(tmp)?tmp:null,
  cloudy:/nub|cubiert|cloud|overcast|niebla|fog|bruma/.test(weather),
  rain:/lluv|rain|torment|storm|chubasco/.test(weather),
  rising:/sub|crec|plea|flood/.test(tide),
  waning:/mengu|waning/.test(moon),
  scene:house.getState()?.scene||'',radio};
}
function atmosphere(p){
 if(p.night&&p.rain)return 'lluvia nocturna';
 if(p.night)return p.waning?'insomnio':'nocturna';
 if(p.rain)return 'lluvia';
 if(p.cloudy)return 'gris atlántico';
 if(p.hour>=10&&p.hour<14)return 'mañana';
 if(p.hour>=14&&p.hour<18)return 'taller';
 return 'atardecer';
}
const weights={
 'lluvia nocturna':{contemplar:5,leer:3,descanso:4,musica:4,cine:3,ordenador:2},
 insomnio:{contemplar:5,cine:4,leer:4,musica:3,descanso:3},
 nocturna:{cine:4,descanso:4,contemplar:4,musica:4,leer:3},
 lluvia:{crear:4,leer:3,contemplar:5,ordenador:3,musica:3},
 'gris atlántico':{contemplar:4,crear:4,leer:3,musica:3},
 mañana:{cotidiano:5,movimiento:4,crear:3,leer:3,ordenador:3},
 taller:{crear:5,ordenador:4,cotidiano:3,musica:3},
 atardecer:{contemplar:5,crear:3,descanso:3,musica:3,cotidiano:3}
};
function weightedChoice(choices){
 let sum=0;for(const c of choices)sum+=c.weight;
 let x=Math.random()*sum;
 for(const c of choices){x-=c.weight;if(x<=0)return c.index}
 return choices.at(-1)?.index??null;
}
function choose(scenes,shown,recent){
 if(!memory.enabled)return null;
 const p=sense(),mood=atmosphere(p),palette=weights[mood]||{},tail=memory.events.slice(-15).map(e=>e.id),pool=[];
 for(let index=0;index<scenes.length;index++){
  const s=scenes[index];if(!s||!s.src||index===shown)continue;
  let w=palette[s.group]||1.65;
  if(s.time==='noche'&&!p.night)w*=.14;
  if(s.time==='dia'&&p.night)w*=.22;
  const id='scene-'+index;
  if(tail.includes(id)||recent.includes(index))w*=.035;
  w/=Math.sqrt(1+(Number(memory.counts[id])||0)*.45);
  // Un lugar recurrente puede reaparecer días después sin dominar el pase.
  if(memory.ritual[mood]===id)w*=1.9;
  if(memory.longLooks[id])w*=1+Math.min(.35,memory.longLooks[id]*.08);
  w*=window.__luVision?.score?.(index,s,mood,shown,scenes)||1;
  // La posición astronómica real matiza ligeramente el criterio artístico.
  if(p.sky?.dark){
   const planets=p.sky.planetsAbove||[];
   if(p.sky.moonAltitude>35&&/contemplar|descanso/.test(s.group))w*=1.17;
   if(planets.includes('Júpiter')&&/leer|contemplar|crear/.test(s.group))w*=1.09;
   if(planets.includes('Saturno')&&/cine|contemplar/.test(s.group))w*=1.09;
   if(planets.length>=3&&s.group==='musica')w*=1.12;
  }
  if(w>0)pool.push({index,weight:w});
 }
 return pool.length?weightedChoice(pool):null;
}
function cameraAndColor(p,mood){
 const palette={
  'lluvia nocturna':'saturate(.91) contrast(1.09)',
  insomnio:'saturate(.86) contrast(1.06)',
  nocturna:'saturate(.96) contrast(1.04)',
  lluvia:'saturate(.94) contrast(1.05)',
  'gris atlántico':'saturate(.91) contrast(1.04)',
  mañana:'saturate(1.07) contrast(1.01)',
  taller:'saturate(1.05) contrast(1.02)',
  atardecer:'saturate(1.04) contrast(1.04)'
 };
 const astronomical=p.sky?.dark?(p.sky?.moonAltitude>35?' brightness(1.018)':' brightness(.995)'):'';
 stage.classList.add('lu-autonomous');stage.style.setProperty('--lu-art-grade',(palette[mood]||'saturate(1)')+astronomical);
 stage.dataset.luMood=mood;
 const active=house.getState()?.active;
 const sharp=(active===0?el('filmA'):el('filmB'))?.querySelector('.film-sharp');
 if(sharp){
  sharp.style.animationDuration=(p.night?165:(p.rain?155:128))+'s';
  sharp.style.animationDirection=memory.events.length%2?'alternate-reverse':'alternate';
 }
}
function chooseRadio(mood){
 const radio=window.__luRadio;
 if(!radio||typeof radio.suggest!=='function'||Date.now()-memory.lastRadio<30*60*1000)return;
 if(radio.suggest(mood)){memory.lastRadio=Date.now();save()}
}
function record(index,scenes){
 const s=scenes[index];if(!memory.enabled||!s?.src)return;
 const p=sense(),mood=atmosphere(p);
 const id='scene-'+index;
 memory.events.push({id,name:s.name,at:Date.now(),mood,hold:false});memory.events=memory.events.slice(-60);
 memory.counts[id]=(Number(memory.counts[id])||0)+1;
 // Los lugares recurrentes se conservan por día, pero también pueden cambiar.
 const day=new Intl.DateTimeFormat('sv-SE',{timeZone:zone,year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
 if(day!==memory.lastDay){
  memory.lastDay=day;
  for(const m of Object.keys(memory.ritual))if(Math.random()<.16)delete memory.ritual[m];
 }
 if(!memory.ritual[mood]||Math.random()<.055)memory.ritual[mood]=id;
 window.__luVision?.remember?.(index,mood,false);
 if(Object.keys(memory.counts).length>120)memory.counts={};
 if(Math.max(0,...Object.values(memory.counts).map(Number))>150){
  for(const k of Object.keys(memory.counts))memory.counts[k]=Math.ceil(memory.counts[k]/2);
 }
 memory.lastMood=mood;
 cameraAndColor(p,mood);chooseRadio(mood);save();render();
}

function onScene(index,scenes){
 if(!memory.enabled){stage.classList.remove('lu-autonomous');return}
 record(index,scenes);
 const active=house.getState()?.active;
 const layer=el(active===0?'filmA':'filmB');
 const vision=window.__luVision;
 if(vision?.presentation){
  vision.presentation(index,scenes[index],layer).then(profile=>{
   if(!profile||!memory.enabled||house.getState()?.index!==index)return;
   // El color de esta fotografía orienta el siguiente set; no se corta el actual.
   window.__luRadio?.setVisualPreference?.(profile);
   // Lu percibe el plano sin publicar comentarios repetitivos.
   render();
  }).catch(()=>{});
 }
}
function nextDelay(index,scenes){
 // Son sesiones musicales externas: estimación por género, no análisis de la onda.
 const scene=scenes?.[index],p=sense();
 const energy=p.radio?.playing&&!p.radio?.collectionOpen?p.radio.energy:'media';
 const ranges={alta:[24,42],media:[37,63],baja:[60,90]};
 const [lower,upper]=ranges[energy]||ranges.media;
 let seconds=lower+Math.random()*(upper-lower);
 const category=scene?.group||'';
 if(/contemplar|descanso|leer/.test(category))seconds*=1.08;
 if(/movimiento|crear|ordenador|musica/.test(category))seconds*=.93;
 if(scene?.type==='ambiente')seconds*=.96;
 if(p.rain&&/contemplar|descanso|leer/.test(category))seconds*=1.05;
 seconds=Math.round(Math.max(22,Math.min(100,seconds)));
 const last=memory.events.at(-1);
 if(last&&last.id==='scene-'+index){last.dwell=seconds;save()}
 return seconds*1000;
}
function shouldHold(index,scenes){
 if(!memory.enabled||index<0)return false;
 return window.__luVision?.shouldHold?.(index,scenes[index],atmosphere(sense()))===true;
}
function onHold(index,scenes){
 if(!memory.enabled||!scenes[index])return;
 const mood=atmosphere(sense());
 window.__luVision?.remember?.(index,mood,true);
 const id='scene-'+index;
 memory.events.push({id,name:scenes[index].name,at:Date.now(),mood,hold:true});
 memory.longLooks[id]=Math.min(9,(Number(memory.longLooks[id])||0)+1);
 memory.events=memory.events.slice(-60);
 save();render();
}
// La percepción altera la cámara y la atmósfera, no genera textos repetitivos.
let lastPerception='';
function reflect(force=false){
 if(!memory.enabled||document.hidden)return;
 const p=sense(),mood=atmosphere(p);
 const fingerprint=[p.hour,p.weather,p.tide,p.moon,p.wind,p.nextMoon,p.atlantico,
  p.outdoorHumidity,p.sky?.fingerprint||''].join('|');
 if(!force&&fingerprint===lastPerception)return;
 lastPerception=fingerprint;
 cameraAndColor(p,mood);
 render();
}

const section=document.createElement('section');section.id='luBrainPanel';
section.innerHTML='<label>LU ROTH · SISTEMA AUTÓNOMO</label><p id="luBrainState" role="status"></p><p id="luBrainSense"></p><p id="luBrainMemory"></p><div class="luBrainActions"><button type="button" id="luBrainToggle"></button><button type="button" id="luBrainErase">Borrar memoria local</button></div><p class="luBrainFoot">Decisiones programadas a partir del estado de la pantalla. Memoria guardada solo en este navegador. Sin acceso al ordenador ni observación cuando la página está cerrada.</p>';
panel.insertBefore(section,el('closePanel'));
const css=document.createElement('style');css.id='lu-autonomy-style';
css.textContent=`
#stage.lu-autonomous #filmA .film-sharp,#stage.lu-autonomous #filmB .film-sharp{filter:var(--lux-grade,brightness(1) saturate(1)) var(--lu-art-grade,saturate(1))!important}
#stage.lu-autonomous[data-lux-asleep="yes"] #filmA .film-sharp,#stage.lu-autonomous[data-lux-asleep="yes"] #filmB .film-sharp{filter:var(--lux-grade,brightness(1)) brightness(.44) saturate(.65) var(--lu-art-grade,saturate(1))!important}
#luBrainPanel{margin:18px 0;padding:14px 0;border-top:1px solid #ffffff30}
#luBrainPanel p{margin:8px 0;line-height:1.5}
#luBrainPanel .luBrainActions{display:flex;flex-wrap:wrap;gap:8px;margin:12px 0}
#luBrainPanel button{border:1px solid #ffffff55;background:#211e27;color:#fff;border-radius:6px;padding:8px 12px;cursor:pointer}
#luBrainPanel button:hover,#luBrainPanel button:focus-visible{background:#3b3341}
#luBrainPanel .luBrainFoot{font-size:12px;opacity:.7}
@media(prefers-reduced-motion:reduce){#stage.lu-autonomous .film-sharp{animation:none!important}}
`;document.head.appendChild(css);
function render(){
 const p=sense(),mood=atmosphere(p);
 el('luBrainState').textContent=memory.enabled?'Encendida · Lu elige los planos y cuándo cambiarlos, sin intervalo fijo':'Apagada · montaje visual ágil';
 el('luBrainSense').textContent='Percibe: '+(p.night?'noche':'día')+' · '+(p.weather||'tiempo no disponible')+' · '+(p.tide||'mareas no disponibles')+' · Luna: '+(p.moon||'sin datos')+
 (p.outdoorHumidity!==null?' · Humedad exterior '+p.outdoorHumidity+'%':'')+
 (p.sky?' · Cielo: '+p.sky.planetCount+' planetas sobre horizonte'+(p.sky.dominantPlanet?' · '+p.sky.dominantPlanet.name+' '+Math.round(p.sky.dominantPlanet.alt)+'°':''):'')+
 ' · Atmósfera: '+mood;
 const mailInfo=p.mail?'Mensajes: '+p.mail.total+' · '+(p.mail.latest?.subject||'sin asunto'):'Buzón: esperando datos';
 const audioInfo=p.radio?.playing?'Radio: sonando · '+p.radio.title:p.radio?.autoPlaybackPending?'Radio: intentando reproducir · '+p.radio.title:'Radio: '+(p.radio?.title||'sin sesión');
 el('luBrainState').textContent+=(memory.enabled?' · '+audioInfo:'');
 el('luBrainMemory').title=mailInfo;
 const last=memory.events.at(-1);
 const habitual=memory.ritual[mood];
 const habitualIndex=habitual?Number(habitual.split('-')[1]):-1;
 const habitualName=house.getScenes()[habitualIndex]?.name||'';
 el('luBrainMemory').textContent='Memoria: '+memory.events.length+' decisiones recientes'+(last?' · Última: '+last.name+(last.hold?' (mantener)':''):'')+
  (habitualName?' · Lugar recurrente: '+habitualName:'');
 const vision=window.__luVision;
 const visionStatus=vision?.status?.();
 const state=house.getState();
 const photo=vision?.view?.(state?.index,house.getScenes());
 let eyes=el('luBrainEyes');
 if(!eyes){eyes=document.createElement('p');eyes.id='luBrainEyes';el('luBrainMemory').after(eyes)}
 if(eyes)eyes.textContent=visionStatus
  ?'Ojos: '+visionStatus.analyzed+'/'+visionStatus.total+' fotografías · '+vision.summary(photo)
  :'Ojos: esperando el módulo de visión';
 el('luBrainToggle').textContent=memory.enabled?'Pausar autonomía':'Activar autonomía';
 el('luBrainToggle').setAttribute('aria-pressed',String(memory.enabled));
 const power=el('luAutoPower');
 if(power){
  power.disabled=false;
  power.dataset.enabled=memory.enabled?'on':'off';
  power.setAttribute('aria-pressed',String(memory.enabled));
  power.setAttribute('aria-label',memory.enabled?'Desactivar autonomía de Lu Roth':'Activar autonomía de Lu Roth');
  power.title=memory.enabled?'Pausar autonomía de Lu Roth':'Dejar que Lu dirija la Casa';
  const label=el('luAutoPowerText');
  if(label)label.textContent=memory.enabled?'AUTONOMÍA ON':'AUTONOMÍA OFF';
 }
}
function setAutonomy(enabled){
 if(memory.enabled===enabled){render();return}
 memory.enabled=enabled;save();
 if(!enabled){
  document.body.classList.remove('lu-immersive');
  window.__luRadio?.stopAutonomy?.();
  window.__luNotes?.stop?.();
  // Al apagar: la casa mantiene una rotación de imágenes ágil.
  house.reschedule?.();
  stage.classList.remove('lu-autonomous');
  stage.style.removeProperty('--lu-art-grade');
  for(const id of ['filmA','filmB']){
   const sharp=el(id)?.querySelector('.film-sharp');
   sharp?.style.removeProperty('animation-duration');
   sharp?.style.removeProperty('animation-direction');
  }
  render();
  return;
 }
 // La fotografía adquiere más presencia; los datos siguen accesibles y visibles.
 document.body.classList.add('lu-immersive');
 // Los ojos comienzan a catalogar fotografías locales, sin subir ninguna imagen.
 window.__luVision?.begin?.(house.getScenes());
 // Comienza el audio directamente en el gesto ON (permiso sujeto a SoundCloud/navegador).
 const initialPerception=sense();
 window.__luRadio?.startAutonomy?.(atmosphere(initialPerception));
 // Las lecturas del Atlántico se refrescan y los nuevos datos alimentan el motor.
 window.__luClimateRefresh?.();
 // ON inicia una escena nueva; a partir de ahí Lu elige las duraciones.
 const current=house.getState(),scenes=house.getScenes();
 const next=choose(scenes,current?.index??-1,[]);
 if(Number.isInteger(next)&&typeof house.show==='function'&&house.show(next)){
  // display() ya ha registrado esta decisión y actualizado la cámara.
  reflect(true);
  render();
  return;
 }
 house.reschedule?.();
 cameraAndColor(sense(),atmosphere(sense()));
 reflect(true);
 render();
}
function toggleAutonomy(){setAutonomy(!memory.enabled)}
el('luBrainToggle').addEventListener('click',toggleAutonomy);
el('luAutoPower')?.addEventListener('click',toggleAutonomy);
el('luBrainErase').addEventListener('click',()=>{
 memory.events=[];memory.counts={};memory.ritual={};memory.longLooks={};memory.lastDay='';memory.lastMood='';memory.lastRadio=0;save();render();
});
window.__luAutonomy={choose,onScene,onHold,shouldHold,nextDelay,isEnabled:()=>memory.enabled,toggle:toggleAutonomy,setEnabled:setAutonomy,getState:()=>({enabled:memory.enabled,observed:sense(),memory:{events:memory.events.slice(),lastMood:memory.lastMood,ritual:{...memory.ritual},longLooks:{...memory.longLooks}}})};
const initial=house.getState();
if(initial?.index>=0&&memory.enabled)onScene(initial.index,house.getScenes());
else render();
// Los datos existentes avisan en cuanto cambian, sin esperar al siguiente plano.
let reflectionTimer=null;
if(typeof MutationObserver==='function'){
 const observer=new MutationObserver(()=>{
  if(!memory.enabled||document.hidden)return;
  clearTimeout(reflectionTimer);
  reflectionTimer=setTimeout(()=>reflect(false),900);
 });
 for(const id of ['temp','weatherText','wind','tideTitle','tideNext','moonName','nextMoon','atlanticoStatus',
                   'luxMailLatestSubject','luxMailLatestExcerpt','subtitleText','humidityValue','luSkyHeadline']){
  const node=el(id);
  if(node)observer.observe(node,{childList:true,subtree:true,characterData:true});
 }
}
window.addEventListener('lu:sky-update',()=>{if(memory.enabled){reflect(false);render()}});
setInterval(()=>{if(!document.hidden){reflect(false);render()}},60000);
})();