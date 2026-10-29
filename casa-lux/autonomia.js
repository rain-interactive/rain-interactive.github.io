(function luBrain(){
'use strict';
// LU ROTH / Autonomía local. Sin observación fuera de esta pestaña ni acceso a dispositivos.
const house=window.__luHouse,stage=document.getElementById('stage'),panel=document.getElementById('panel');
if(!house||!stage||!panel)return;
const key='lu-roth-autonomia-v1',zone='Europe/Madrid',el=id=>document.getElementById(id),txt=id=>(el(id)?.textContent||'').trim();
let memory={enabled:true,events:[],counts:{},lastMood:'',lastRadio:0};
try{
 const saved=JSON.parse(localStorage.getItem(key)||'null');
 if(saved&&typeof saved==='object'){
  memory.enabled=saved.enabled!==false;
  memory.events=Array.isArray(saved.events)?saved.events.slice(-60).filter(e=>e&&typeof e.src==='string'):[];
  memory.counts=saved.counts&&typeof saved.counts==='object'?saved.counts:{};
  memory.lastMood=typeof saved.lastMood==='string'?saved.lastMood:'';
  memory.lastRadio=Number(saved.lastRadio)||0;
 }
}catch{}
const save=()=>{try{localStorage.setItem(key,JSON.stringify(memory))}catch{}};
function sense(){
 const parts=new Intl.DateTimeFormat('en-GB',{timeZone:zone,hour:'2-digit',minute:'2-digit',hourCycle:'h23'}).formatToParts(new Date());
 const hour=Number(parts.find(p=>p.type==='hour')?.value)||0;
 const weather=txt('weatherText').toLowerCase(),moon=txt('moonName').toLowerCase(),tide=(txt('tideTitle')+' '+txt('tideNext')).toLowerCase();
 const tmp=Number((txt('temp').replace(',','.').match(/-?\d+(?:\.\d+)?/)||[])[0]);
 const radio=window.__luRadio?.getState?.()||null;
 return {hour,night:hour<10||hour>=20,weather,moon,tide,temp:Number.isFinite(tmp)?tmp:null,
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
 const p=sense(),mood=atmosphere(p),palette=weights[mood]||{},tail=memory.events.slice(-15).map(e=>e.src),pool=[];
 for(let index=0;index<scenes.length;index++){
  const s=scenes[index];if(!s||!s.src||index===shown)continue;
  let w=palette[s.group]||1.65;
  if(s.time==='noche'&&!p.night)w*=.14;
  if(s.time==='dia'&&p.night)w*=.22;
  if(tail.includes(s.src)||recent.includes(index))w*=.035;
  w/=Math.sqrt(1+(Number(memory.counts[s.src])||0)*.45);
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
 stage.classList.add('lu-autonomous');stage.style.setProperty('--lu-art-grade',palette[mood]||'saturate(1)');
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
 memory.events.push({src:s.src,name:s.name,at:Date.now(),mood});memory.events=memory.events.slice(-60);
 memory.counts[s.src]=(Number(memory.counts[s.src])||0)+1;
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
 el('luBrainState').textContent=memory.enabled?'Activa · decide un plano cada tres minutos':'En pausa · selección aleatoria clásica';
 el('luBrainSense').textContent='Percibe: '+(p.night?'noche':'día')+' · '+(p.weather||'tiempo no disponible')+' · '+(p.tide||'mareas no disponibles')+' · Luna: '+(p.moon||'sin datos')+' · Atmósfera: '+mood;
 const last=memory.events.at(-1);
 el('luBrainMemory').textContent='Memoria: '+memory.events.length+' decisiones recientes'+(last?' · Última: '+last.name:'');
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
 // ON inicia inmediatamente una elección nueva. Después el motor sigue cada tres minutos.
 const current=house.getState(),scenes=house.getScenes();
 const next=choose(scenes,current?.index??-1,[]);
 if(Number.isInteger(next)&&typeof house.show==='function'&&house.show(next)){
  // display() ya ha registrado esta decisión y actualizado la cámara.
  render();
  return;
 }
 cameraAndColor(sense(),atmosphere(sense()));
 render();
}
function toggleAutonomy(){setAutonomy(!memory.enabled)}
el('luBrainToggle').addEventListener('click',toggleAutonomy);
el('luAutoPower')?.addEventListener('click',toggleAutonomy);
el('luBrainErase').addEventListener('click',()=>{
 memory.events=[];memory.counts={};memory.lastMood='';memory.lastRadio=0;save();render();
});
window.__luAutonomy={choose,onScene,toggle:toggleAutonomy,setEnabled:setAutonomy,getState:()=>({enabled:memory.enabled,observed:sense(),memory:{events:memory.events.slice(),lastMood:memory.lastMood}})};
const initial=house.getState();
if(initial?.index>=0&&memory.enabled)onScene(initial.index,house.getScenes());
else render();
setInterval(()=>{if(!document.hidden)render()},60000);
})();