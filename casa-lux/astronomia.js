(function luAstronomy(){
'use strict';
// CASA DE LU ROTH · CIELO REAL · A CORUÑA
// Cálculo topocéntrico local (Astronomy Engine, MIT). NO consulta el Planetario
// ni afirma que los planetas sean visibles a simple vista.
const lat=43.3623,lon=-8.4115,elevation=20;
const stage=document.getElementById('stage');
const strip=document.getElementById('liveStrip');
const mobile=document.querySelector('#mobileBar .mobgrid');
const panel=document.getElementById('panel');
if(!stage||!strip)return;
const astro=window.Astronomy;
const bodyData=[
 ['Sun','Sol','sol'],['Moon','Luna','luna'],
 ['Mercury','Mercurio','planeta'],['Venus','Venus','planeta'],
 ['Mars','Marte','planeta'],['Jupiter','Júpiter','planeta'],
 ['Saturn','Saturno','planeta'],['Uranus','Urano','planeta'],
 ['Neptune','Neptuno','planeta'],['Pluto','Plutón (enano)','enano']
];
// Coordenadas ecuatoriales J2000 de estrellas brillantes: RA (horas), DEC (grados), distancia (a.l.).
// Muestra de referencia, no catálogo estelar completo.
const starData=[
 ['Star1','Sirio',6.752,-16.72,8.6],
 ['Star2','Arturo',14.261,19.18,36.7],
 ['Star3','Vega',18.616,38.78,25.3],
 ['Star4','Capella',5.278,46.0,42.2],
 ['Star5','Rigel',5.242,-8.2,860],
 ['Star6','Betelgeuse',5.919,7.4,548],
 ['Star7','Altair',19.846,8.87,16.7],
 ['Star8','Polaris',2.53,89.26,433]
];
let latest=null;
const sky=document.createElement('div');
sky.id='luSkyMetric';sky.className='metric';
sky.innerHTML='<div class="kicker">✧ Cielo · A Coruña</div><div class="luSkyTitle" id="luSkyHeadline">Calculando cielo…</div><canvas id="luSkyMap" width="320" height="184" aria-label="Mapa polar del cielo. Norte arriba; este a la derecha. Representa posiciones, no visibilidad a simple vista." role="img"></canvas><div class="tiny" id="luSkyBrief">Altura y azimut en espera</div>';
const workshop=strip.querySelector('#classState')?.closest('.metric');
if(workshop)strip.insertBefore(sky,workshop);else strip.appendChild(sky);
let mobileMap=null,mobileHeadline=null,mobileBrief=null;
if(mobile){
 const card=document.createElement('div');card.className='mobcell';card.id='luSkyMobile';
 card.innerHTML='<div class="kicker">✧ Cielo · A Coruña</div><div class="mobvalue" id="luSkyMobileHeadline">Calculando…</div><canvas id="luSkyMobileMap" width="320" height="184" role="img" aria-label="Mapa del cielo de A Coruña, posiciones calculadas sobre el horizonte"></canvas><div class="mobdetail" id="luSkyMobileBrief">Planetas y astros</div>';
 mobile.insertBefore(card,mobile.querySelector('#mClass')?.closest('.mobcell')||null);
 mobileMap=card.querySelector('canvas');
 mobileHeadline=card.querySelector('#luSkyMobileHeadline');
 mobileBrief=card.querySelector('#luSkyMobileBrief');
}
let map=sky.querySelector('canvas');
const headline=sky.querySelector('#luSkyHeadline');
const brief=sky.querySelector('#luSkyBrief');
let detailedMap=null,detailRows=null,detailTime=null,detailSummary=null;
if(panel){
 const block=document.createElement('section');
 block.id='luSkyDetails';
 block.innerHTML='<label>✧ Planisferio · A Coruña</label><p>Vista cenital: norte arriba, este a la derecha. El borde representa el horizonte (0°) y el centro, el cenit (90°). Las posiciones son calculadas, no confirman que un astro pueda verse a simple vista.</p><canvas id="luSkyDetailedMap" width="460" height="420" role="img" aria-label="Posición calculada de planetas, Sol, Luna y ocho estrellas brillantes sobre el horizonte de A Coruña"></canvas><p id="luSkyDetailSummary">Calculando posiciones…</p><div id="luSkyDetailRows"></div><p id="luSkyTimestamp"></p><p class="luSkySource">Astronomía calculada en este navegador con <a href="https://github.com/cosinekitty/astronomy" target="_blank" rel="noopener noreferrer">Astronomy Engine</a> (MIT). Comparación de referencia: <a href="https://ssd.jpl.nasa.gov/horizons/" target="_blank" rel="noopener noreferrer">NASA/JPL Horizons</a>. No es una conexión directa con el Planetario de A Coruña ni con JPL.</p>';
 const close=panel.querySelector('#closePanel');
 if(close)panel.insertBefore(block,close);else panel.appendChild(block);
 detailedMap=block.querySelector('canvas');
 detailRows=block.querySelector('#luSkyDetailRows');
 detailTime=block.querySelector('#luSkyTimestamp');
 detailSummary=block.querySelector('#luSkyDetailSummary');
}
const names=['N','NE','E','SE','S','SO','O','NO'];
const direction=az=>names[Math.round(((az%360)+360)%360/45)%8];
const isNumber=n=>typeof n==='number'&&Number.isFinite(n);
const fmtDegree=n=>(n>=0?'+':'')+Math.round(n)+'°';
function getLocation(body,name,type,when,observer){
 const eq=astro.Equator(body,when,observer,true,true);
 const h=astro.Horizon(when,observer,eq.ra,eq.dec,'normal');
 if(!isNumber(h.altitude)||!isNumber(h.azimuth))throw Error('Posición astronómica no numérica');
 return {key:body,name,type,az:((h.azimuth%360)+360)%360,alt:h.altitude,above:h.altitude>0};
}
function compute(when=new Date()){
 if(!astro||typeof astro.Observer!=='function'||typeof astro.Equator!=='function'||typeof astro.Horizon!=='function')return null;
 const observer=new astro.Observer(lat,lon,elevation);
 const bodies=bodyData.map(([key,name,type])=>getLocation(key,name,type,when,observer));
 const stars=starData.map(([key,name,ra,dec,lightyears])=>{
  astro.DefineStar(key,ra,dec,lightyears);
  return getLocation(key,name,'estrella',when,observer);
 });
 const sun=bodies[0],moon=bodies[1];
 const planets=bodies.filter(x=>x.type==='planeta'&&x.above);
 const highest=planets.slice().sort((a,b)=>b.alt-a.alt)[0]||null;
 const dark=sun.alt< -6;
 return {
  updatedAt:when.toISOString(),latitude:lat,longitude:lon,
  dark,sunAltitude:sun.alt,moonAltitude:moon.alt,moonAbove:moon.above,
  planetCount:planets.length,planetsAbove:planets.map(x=>x.name),
  dominantPlanet:highest?{name:highest.name,key:highest.key,alt:highest.alt,az:highest.az,direction:direction(highest.az)}:null,
  bodies,stars,
  fingerprint:[Math.floor(when.getTime()/300000),planets.map(x=>x.key).join(','),moon.above?'M1':'M0'].join(':')
 };
}
function paint(canvas,state,large){
 if(!canvas||!state)return;
 const ctx=canvas.getContext('2d');
 if(!ctx)return;
 const w=canvas.width,h=canvas.height;
 ctx.clearRect(0,0,w,h);
 const cx=w/2,cy=h/2+2,r=Math.min(w/2-39,h/2-18);
 ctx.save();
 const stroke=large?'rgba(255,255,255,.47)':'rgba(255,255,255,.5)';
 const drawCircle=(radius,alpha)=>{
  ctx.beginPath();ctx.arc(cx,cy,radius,0,2*Math.PI);
  ctx.lineWidth=large?1.3:1;ctx.strokeStyle=`rgba(255,255,255,${alpha})`;ctx.stroke();
 };
 drawCircle(r,.53);drawCircle(r*2/3,.19);drawCircle(r/3,.19);
 ctx.lineWidth=1;ctx.strokeStyle='rgba(255,255,255,.14)';
 for(let a=0;a<360;a+=45){
  const rad=a*Math.PI/180;ctx.beginPath();ctx.moveTo(cx,cy);
  ctx.lineTo(cx+r*Math.sin(rad),cy-r*Math.cos(rad));ctx.stroke();
 }
 ctx.textBaseline='middle';ctx.font=(large?'14':'11')+'px system-ui, sans-serif';
 ctx.fillStyle='rgba(255,255,255,.85)';
 for(const [label,angle] of [['N',0],['E',90],['S',180],['O',270]]){
  const rad=angle*Math.PI/180;
  ctx.textAlign='center';
  ctx.fillText(label,cx+(r+15)*Math.sin(rad),cy-(r+13)*Math.cos(rad));
 }
 const pt=o=>{
  const rad=o.az*Math.PI/180,dist=r*(90-Math.min(90,o.alt))/90;
  return [cx+dist*Math.sin(rad),cy-dist*Math.cos(rad)];
 };
 for(const star of state.stars){
  if(!star.above)continue;
  const [x,y]=pt(star);
  ctx.beginPath();ctx.arc(x,y,large?2:1.6,0,2*Math.PI);
  ctx.fillStyle=state.dark?'rgba(255,255,255,.8)':'rgba(255,255,255,.38)';ctx.fill();
  if(large&&state.dark){
   ctx.font='11px system-ui';ctx.textAlign='left';ctx.fillStyle='rgba(255,255,255,.7)';
   ctx.fillText(star.name,x+5,y-6);
  }
 }
 const visible=state.bodies.filter(o=>o.above).sort((a,b)=>{
  const priority=x=>x.type==='sol'?4:x.type==='luna'?3:x.type==='planeta'?2:1;
  return priority(a)-priority(b);
 });
 for(const o of visible){
  const [x,y]=pt(o);const sun=o.type==='sol',moon=o.type==='luna';
  const radius=sun?(large?7:5):moon?(large?6:4):(large?4:3.4);
  ctx.beginPath();ctx.arc(x,y,radius+2,0,Math.PI*2);
  ctx.fillStyle='rgba(0,0,0,.72)';ctx.fill();
  ctx.beginPath();ctx.arc(x,y,radius,0,Math.PI*2);
  ctx.fillStyle=sun?'#ffe8b3':moon?'#d7ebff':o.type==='planeta'?'#f4cfc2':'#aeb6bb';
  ctx.fill();ctx.strokeStyle='#222';ctx.lineWidth=0.7;ctx.stroke();
  ctx.fillStyle='#fff';ctx.textAlign='left';ctx.font=(large?'13':'11')+'px system-ui';
  if(large||!sun)ctx.fillText(o.name.replace(' (enano)',''),x+radius+3,y-(large?5:3));
 }
 ctx.restore();
}
function show(state){
 const d=new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Madrid',hour:'2-digit',minute:'2-digit',day:'2-digit',month:'short'}).format(new Date(state.updatedAt));
 const focus=state.dominantPlanet;
 const summary=focus?focus.name+' · '+focus.direction+' '+fmtDegree(focus.alt):'Sin planetas sobre horizonte';
 headline.textContent=summary;
 brief.textContent=state.planetCount+' planetas sobre horizonte · Luna '+(state.moonAbove?'↑':'↓');
 if(mobileHeadline)mobileHeadline.textContent=focus?focus.name+' '+fmtDegree(focus.alt):'Sin planetas arriba';
 if(mobileBrief)mobileBrief.textContent=state.planetCount+' planetas · Luna '+(state.moonAbove?'↑':'↓');
 paint(map,state,false);paint(mobileMap,state,false);paint(detailedMap,state,true);
 if(detailSummary)detailSummary.textContent=state.dark?'Cielo nocturno geométrico':'Cielo diurno o crepuscular · no implica visibilidad a simple vista';
 if(detailTime)detailTime.textContent='Calculado: '+d+' · Lat. 43,3623° N / Long. 8,4115° O · altura aprox. 20 m · revisa el reloj del dispositivo.';
 if(detailRows){
  detailRows.replaceChildren();
  for(const o of state.bodies){
   const row=document.createElement('div');row.className='luSkyBodyRow';
   const name=document.createElement('span');name.textContent=o.name;
   const coords=document.createElement('span');
   coords.textContent=fmtDegree(o.alt)+' alt. · '+Math.round(o.az)+'° az. · '+direction(o.az)+(o.above?' · ↑':' · ↓');
   coords.title=o.above?'Sobre horizonte matemático':'Bajo horizonte matemático';
   row.append(name,coords);detailRows.appendChild(row);
  }
  const stars=document.createElement('p');stars.className='luSkyStars';
  stars.textContent='Estrellas de referencia sobre horizonte: '+(state.stars.filter(x=>x.above).map(x=>x.name).join(', ')||'ninguna de la muestra');
  detailRows.appendChild(stars);
 }
}
function unavailable(message){
 headline.textContent='Cielo sin datos';
 brief.textContent=message;
 if(mobileHeadline)mobileHeadline.textContent='Cielo sin datos';
 if(mobileBrief)mobileBrief.textContent=message;
 if(detailSummary)detailSummary.textContent=message;
}
window.__luSky={
 getState:()=>latest,
 refresh:()=>{
  try{
   const result=compute();
   if(!result){unavailable('Motor astronómico no disponible');return false}
   latest=result;show(result);
   // Las decisiones creativas leen estas coordenadas; no se finge observación física.
   window.dispatchEvent(new CustomEvent('lu:sky-update',{detail:{updatedAt:result.updatedAt}}));
   return true;
  }catch(error){
   unavailable('No se pudo calcular el cielo');
   return false;
  }
 },
 source:'Astronomy Engine 2.1.19, cálculo local, A Coruña'
};
window.__luSky.refresh();
const timer=window.setInterval(()=>{if(!document.hidden)window.__luSky.refresh()},5*60*1000);
document.addEventListener('visibilitychange',()=>{if(!document.hidden)window.__luSky.refresh()});
})();