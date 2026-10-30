/* LUX · BUZÓN CULTURAL. Mensajes editoriales generados localmente, sin IA ni servicio de chat externo. */
(()=>{'use strict';
const storageKey='casa-lux-correo-publico-v3';
const prefsKey='casa-lux-correo-opciones-v3';
const filmUrl=t=>'https://www.filmaffinity.com/es/search.php?stext='+encodeURIComponent(t);
const imdbUrl=t=>'https://www.imdb.com/find/?q='+encodeURIComponent(t);
const musicUrl=t=>'https://www.youtube.com/results?search_query='+encodeURIComponent(t);
const spotifyUrl=t=>'https://open.spotify.com/search/'+encodeURIComponent(t);
const cityA='https://www.coruna.gal/cultura/es/agenda/calendario?argIdioma=es&categoriaID=1417055540843';
const cityS='https://www.santiagoturismo.com/axenda-cultural/';
const grantsUrl='https://www.cultura.gob.es/cultura/creacion-contemporanea/becas-ayudas-y-subvenciones.html';
const datestring=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const escapeDay=(date)=>new Intl.DateTimeFormat('es-ES',{timeZone:'Europe/Madrid',day:'2-digit',month:'2-digit'}).format(date);
const seed=[
 ['cine','Una película para empezar la noche','After Hours (1985), de Martin Scorsese. La peor noche de alguien puede convertirse en una comedia perfecta.',['FilmAffinity',filmUrl('After Hours 1985')],['IMDb',imdbUrl('After Hours 1985')]],
 ['música','Algo industrial y hermoso','Portishead — Machine Gun. Percusión casi mecánica para mirar por la ventana.',['Escuchar en YouTube',musicUrl('Portishead Machine Gun')],['Spotify',spotifyUrl('Portishead Machine Gun')]],
 ['idea','Una nota desde el estudio','Las imágenes no tienen por qué explicarlo todo. En ocasiones, el misterio es parte de la obra.'],
 ['cine','Fotografías que se convierten en cine','La Jetée (1962), de Chris Marker. Una historia de ciencia ficción contada casi completamente mediante imágenes fijas.',['FilmAffinity',filmUrl('La Jetée 1962')],['IMDb',imdbUrl('La Jetée 1962')]],
 ['coruna','Agenda de A Coruña','Una exposición puede ser una buena excusa para cruzar la ciudad. Consultar la agenda municipal para fechas actualizadas.',['Agenda de A Coruña',cityA]],
 ['santiago','Un paseo por Compostela','Un día para cine, artes visuales y pasear por Santiago. La agenda oficial reúne las citas culturales.',['Agenda Santiago',cityS]],
 ['becas','Radar de creación artística','Conviene revisar periódicamente residencias, ayudas de producción y convocatorias de artes visuales. Los plazos deben comprobarse en las bases.',['Ayudas del Ministerio',grantsUrl]],
 ['música','Bajos en una habitación oscura','Massive Attack — Angel. Empieza como una sombra y termina ocupando toda la habitación.',['YouTube',musicUrl('Massive Attack Angel')],['Spotify',spotifyUrl('Massive Attack Angel')]],
 ['cine','La televisión también puede dar miedo','Videodrome (1983), de David Cronenberg. Pantallas, cuerpo y tecnología en una pesadilla sin manual de instrucciones.',['FilmAffinity',filmUrl('Videodrome 1983')],['IMDb',imdbUrl('Videodrome 1983')]],
 ['idea','Acerca del mar','El océano de ahí fuera nunca va a ofrecer dos planos iguales. Eso ya es una película interminable.'],
 ['cine','Una película que hace ruido','Tetsuo: The Iron Man (1989), de Shinya Tsukamoto. Chatarra, piel y una energía industrial salvaje.',['FilmAffinity',filmUrl('Tetsuo The Iron Man 1989')]],
 ['música','El sonido de una ciudad vacía','Burial — Archangel. Un tema que parece grabado en una calle después de llover.',['YouTube',musicUrl('Burial Archangel')],['Spotify',spotifyUrl('Burial Archangel')]],
 ['becas','No olvidar las residencias','Las residencias pueden ofrecer espacio, equipo, acompañamiento o financiación; cada convocatoria establece sus propios requisitos.',['Convocatorias del Ministerio',grantsUrl]],
 ['cine','Un samurái urbano','Ghost Dog: The Way of the Samurai (1999), de Jim Jarmusch. Un oficio extraño, palomas y una música estupenda.',['FilmAffinity',filmUrl('Ghost Dog 1999')]],
 ['idea','Recordatorio del taller','Hay ideas que mejoran después de pasar varios días mirándolas sin hacer nada.'],
 ['música','Cintas de otro tiempo','Boards of Canada — Dayvan Cowboy. Electrónica que huele a cintas magnéticas y carreteras desiertas.',['YouTube',musicUrl('Boards of Canada Dayvan Cowboy')]],
 ['cine','Algo para perder las certezas','Daisies (1966), de Věra Chytilová. Collage cinematográfico y una libertad difícil de domesticar.',['FilmAffinity',filmUrl('Daisies 1966')]],
 ['santiago','Cine de autor en Santiago','Cineuropa es una cita interesante para descubrir películas que no llegan siempre a las salas. Verificar las fechas de la edición en la agenda.',['Agenda de Santiago',cityS]],
 ['música','Un grupo que suena a fábrica','Swans — Screen Shot. Repetición, percusión y una maquinaria que va creciendo.',['YouTube',musicUrl('Swans Screen Shot')]],
 ['idea','Una última observación','Tal vez una casa virtual también pueda funcionar como un pequeño archivo de descubrimientos.']
];
const notes=[
 ['idea','Una observación','Hoy me he quedado pensando en lo raro que es mirar el mar desde una pantalla. No es el mar, pero puede recordar su ritmo.'],
 ['idea','Una idea sin obligación','La próxima obra podría empezar con un material abandonado y sin un plan claro.'],
 ['música','Un disco para esta habitación','Cocteau Twins — Heaven or Las Vegas. Una atmósfera luminosa y extraña.',['YouTube',musicUrl('Cocteau Twins Heaven or Las Vegas')]],
 ['cine','Cine de madrugada','The Lighthouse (2019). Dos hombres, un faro y un blanco y negro que parece salir de otro siglo.',['FilmAffinity',filmUrl('The Lighthouse 2019')]],
 ['música','Más electrónica nocturna','The Knife — Silent Shout. Para cuando la casa se queda a oscuras.',['YouTube',musicUrl('The Knife Silent Shout')]],
 ['cine','Una película lenta para mirar despacio','Stalker (1979), de Andréi Tarkovski. Un viaje por un lugar donde las reglas cambian.',['FilmAffinity',filmUrl('Stalker 1979')]],
 ['idea','Sobre las imágenes','Un encuadre quieto puede sugerir movimiento si se mira durante suficiente tiempo.'],
 ['idea','Un mensaje sin importancia','Si hoy no sale ninguna idea extraordinaria, quizá salga una buena pregunta.'],
 ['becas','Revisar nuevas oportunidades','Consulta las nuevas convocatorias de creación visual. Una noticia reciente no garantiza que el plazo siga abierto.',['Ministerio de Cultura',grantsUrl]],
 ['coruna','Algo para hacer en Coruña','Un museo, una sala pequeña o una proyección también pueden alimentar un proyecto.',['Agenda municipal',cityA]]
];
const byCategory={cine:'Cine',musica:'Música',idea:'Notas',coruna:'A Coruña',santiago:'Santiago',becas:'Becas'};
const filters=[['Todos','all'],['Sin leer','unread'],['Cine','cine'],['Música','musica'],['Coruña','coruna'],['Santiago','santiago'],['Becas','becas'],['Notas','idea']];
const dock=document.createElement('aside');dock.id='luxMailDock';dock.setAttribute('aria-label','Buzón cultural de Lux');
dock.innerHTML='<button type="button" id="luxMailToggle" aria-expanded="true" aria-controls="luxMailRecent" aria-label="Plegar o desplegar los últimos mensajes"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="m3 7 9 7 9-7"/></svg><strong id="luxMailCount">0</strong><span class="luxUnreadLabel">sin leer</span></button><button type="button" id="luxMailLatest" aria-label="Leer el último mensaje" aria-live="polite"><span class="luxMailLatestKicker">ÚLTIMO MENSAJE</span><strong id="luxMailLatestSubject"></strong><span id="luxMailLatestExcerpt"></span></button><section id="luxMailPanel" aria-label="Mensajes culturales"><div id="luxMailHead"><div id="luxMailTitle"><strong>Correo de Lux</strong><span id="luxMailTotal"></span></div><p>Una pequeña correspondencia desde la casa.</p></div><div id="luxMailTools" role="group" aria-label="Filtrar mensajes"></div><div id="luxMailList" role="list" aria-label="Bandeja de mensajes"></div><article id="luxMailDetail" aria-live="polite"></article><form id="luxMailPrompt"><input id="luxMailInput" maxlength="180" placeholder="Pide cine, música, agenda o becas…" aria-label="Pedir una recomendación"/><button id="luxMailSend" type="submit">Pedir</button></form><p id="luxMailStatus" aria-live="polite"></p><div id="luxMailFoot">Mensajes editoriales programados; no es un chat en directo. El sonido funciona tras interactuar con la página.</div></section>';
document.body.appendChild(dock);
// Lectura visible: mensajes recientes en el lateral, independientes del archivo previo.
const recent=document.createElement('section');
recent.id='luxMailRecent';
recent.setAttribute('aria-label','Últimos mensajes de Lu');
recent.innerHTML='<div id="luxRecentHead"><strong>MENSAJES DE LU</strong><span id="luxRecentAmount">Últimos mensajes</span></div><div id="luxMailRecentList" role="list"></div><p id="luxRecentFoot">Notas de la Casa guardadas en este navegador.</p>';
dock.appendChild(recent);
const $=id=>document.getElementById(id);
let state={messages:[],prefs:{mute:false},filter:'all',active:null,open:false,writing:false};
function load(k,fallback){try{return JSON.parse(localStorage.getItem(k))??fallback}catch{return fallback}}
function persist(){try{localStorage.setItem(storageKey,JSON.stringify(state.messages.slice(0,180)));localStorage.setItem(prefsKey,JSON.stringify(state.prefs))}catch{}}
function idFor(v){return (v||'').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,'-').replace(/-$/,'').slice(0,60)}
function mk(tuple,id,time,read=false,source='editorial'){return{id,category:tuple[0]==='música'?'musica':tuple[0],subject:tuple[1],body:tuple[2],links:tuple.slice(3).filter(x=>Array.isArray(x)&&x.length===2),date:time||Date.now(),read,source}}
const start=load(storageKey,null);
const valid=v=>v&&typeof v.id==='string'&&typeof v.subject==='string'&&typeof v.body==='string'&&typeof v.category==='string'&&Array.isArray(v.links);
state.messages=Array.isArray(start)?start.filter(valid).slice(0,180):seed.map((s,i)=>mk(s,'seed-'+i,Date.now()-(seed.length-i)*240000,false));
/* Migración de las antiguas notas privadas al único buzón, sin perder su estado leído. */
try{
 const old=JSON.parse(localStorage.getItem('lux-casa-notes-v1')||'[]');
 if(Array.isArray(old)){
  for(const n of old){
   if(!n||typeof n.text!=='string'||!n.text.trim())continue;
   const id='note-legacy-'+String(n.id||n.date||n.text.slice(0,30));
   if(state.messages.some(m=>m.id===id))continue;
   const links=typeof n.url==='string'&&n.url.startsWith('https://')?[['Ver fuente',n.url]]:[];
   state.messages.push({id,category:'idea',subject:'Nota · '+String(n.tag||'Lu').slice(0,40),body:n.text.slice(0,800),links,date:Date.parse(n.date)||Date.now(),read:!!n.read,source:'house'});
  }
  state.messages=state.messages.sort((a,b)=>b.date-a.date).slice(0,180);
 }
}catch{}
state.prefs=load(prefsKey,{mute:false});
if(typeof state.prefs.recentOpen!=='boolean')state.prefs.recentOpen=true;
function safe(h){try{const u=new URL(h);return u.protocol==='https:'?u.href:null}catch{return null}}
function txt(parent,tag,content,className){const el=document.createElement(tag);if(className)el.className=className;el.textContent=content;parent.appendChild(el);return el}
function unreadCount(){return state.messages.filter(m=>!m.read).length}
function newestMessage(){return state.messages.reduce((latest,m)=>!latest||m.date>latest.date?m:latest,null)}
function updateLatestPreview(){
 const latest=newestMessage(),preview=$('luxMailLatest');
 preview.hidden=true;
 if(!latest)return;
 $('luxMailLatestSubject').textContent=latest.subject;
 $('luxMailLatestExcerpt').textContent=latest.body.replace(/\s+/g,' ').trim();
 preview.title='Leer: '+latest.subject;
}
function counts(){const n=unreadCount();$('luxMailCount').textContent=String(n>99?'99+':n);$('luxMailTotal').textContent=n+' sin leer · '+state.messages.length+' mensajes';$('luxMailToggle').setAttribute('aria-label',n+' mensajes sin leer')}
function buildTools(){const tools=$('luxMailTools');tools.replaceChildren();for(const [label,key] of filters){const b=txt(tools,'button',label);b.type='button';b.setAttribute('aria-pressed',String(state.filter===key));b.addEventListener('click',()=>{state.filter=key;state.active=null;render()})}
 const read=txt(tools,'button','Marcar leídos');read.id='luxMailAllRead';read.type='button';read.addEventListener('click',()=>{state.messages.forEach(x=>x.read=true);persist();render()});
 const mute=txt(tools,'button',state.prefs.mute?'🔇 Sonido':'♫ Sonido');mute.type='button';mute.setAttribute('aria-label',state.prefs.mute?'Activar sonido de entrada':'Silenciar mensajes');mute.addEventListener('click',()=>{state.prefs.mute=!state.prefs.mute;persist();buildTools();initAudio()});
}
function niceDate(d){let date=new Date(d);return isNaN(date.getTime())?'':escapeDay(date)}
function showDetail(m){const target=$('luxMailDetail');target.replaceChildren();if(!m){txt(target,'p','Selecciona un sobre para leer el mensaje.');return}
 txt(target,'h3',m.subject);txt(target,'div','LUX · '+(byCategory[m.category]||'Cultura')+' · '+niceDate(m.date)+(m.source==='news'?' · Noticia enlazada':''),'luxMeta');txt(target,'p',m.body);
 for(const entry of m.links){const href=safe(entry[1]);if(!href)continue;const link=txt(target,'a',entry[0]);link.href=href;link.target='_blank';link.rel='noopener noreferrer';}
}
function render(){buildTools();counts();updateLatestPreview();renderRecent();const list=$('luxMailList');list.replaceChildren();const msgs=state.messages.filter(m=>state.filter==='all'||(state.filter==='unread'?!m.read:m.category===state.filter)).sort((a,b)=>Number(a.read)-Number(b.read)||b.date-a.date);
if(!msgs.length){state.active=null;txt(list,'p','No hay mensajes en esta sección.','luxMailEmpty');showDetail(null);return}
// Solo se marca leído tras pulsar expresamente un mensaje.
if(!msgs.some(m=>m.id===state.active))state.active=null;
for(const m of msgs){const btn=document.createElement('button');btn.className='luxMailItem'+(m.read?'':' unread')+(state.active===m.id?' active':'');btn.type='button';btn.setAttribute('role','listitem');btn.setAttribute('aria-label',(m.read?'':'Sin leer: ')+m.subject);const dot=txt(btn,'span','','luxMailDot');dot.setAttribute('aria-hidden','true');const body=document.createElement('span');body.className='luxMailBody';txt(body,'span',m.subject,'luxMailSubject');txt(body,'span',m.body,'luxMailPreview');btn.appendChild(body);txt(btn,'time',niceDate(m.date));btn.addEventListener('click',()=>{state.active=m.id;m.read=true;persist();render();$('luxMailDetail').scrollTop=0});list.appendChild(btn)}
showDetail(state.messages.find(m=>m.id===state.active))}
function renderRecent(){
 const list=$('luxMailRecentList');list.replaceChildren();
 const messages=[...state.messages].sort((a,b)=>b.date-a.date).slice(0,5);
 $('luxRecentAmount').textContent=messages.length+' recientes · '+unreadCount()+' sin leer';
 if(!messages.length){txt(list,'p','Todavía no hay mensajes.','luxRecentEmpty');return}
 for(const m of messages){
  const item=document.createElement('article');item.className='luxRecentItem'+(m.read?'':' unread');
  item.setAttribute('role','listitem');
  txt(item,'span',(byCategory[m.category]||'Apuntes').toUpperCase(),'luxRecentKicker');
  const head=document.createElement('div');head.className='luxRecentItemHead';
  txt(head,'strong',m.subject);
  txt(head,'time',niceDate(m.date));
  item.appendChild(head);
  txt(item,'p',m.body,'luxRecentText');
  for(const entry of m.links){
   const url=safe(entry[1]);if(!url)continue;
   const a=txt(item,'a',entry[0]);
   a.href=url;a.target='_blank';a.rel='noopener noreferrer';
  }
  list.appendChild(item);
 }
}
function setOpen(open){
 state.open=Boolean(open);
 dock.classList.toggle('open',state.open);
 $('luxMailToggle').setAttribute('aria-expanded',String(state.open));
 $('luxMailToggle').setAttribute('aria-label',state.open?'Plegar mensajes':'Desplegar últimos mensajes');
 state.prefs.recentOpen=state.open;
 persist();
}
$('luxMailToggle').addEventListener('click',()=>setOpen(!state.open));
$('luxMailLatest').addEventListener('click',()=>setOpen(true));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&state.open)setOpen(false)});
let ctx=null;
function initAudio(){if(ctx&&ctx.state==='suspended')ctx.resume().catch(()=>{});if(!ctx){try{ctx=new(window.AudioContext||window.webkitAudioContext)();if(ctx.state==='suspended')ctx.resume().catch(()=>{})}catch{}}}
function chime(){if(state.prefs.mute||!ctx||ctx.state!=='running')return;try{const t=ctx.currentTime;for(const [i,hz] of [[0,610],[1,820]]){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(hz,t+i*0.14);g.gain.setValueAtTime(0.0001,t+i*0.14);g.gain.exponentialRampToValueAtTime(i?0.012:0.017,t+i*0.14+0.025);g.gain.exponentialRampToValueAtTime(0.0001,t+i*0.14+0.21);o.connect(g);g.connect(ctx.destination);o.start(t+i*0.14);o.stop(t+i*0.14+0.23)}}catch{}}
function deliver(msg,silent=false){if(state.messages.some(m=>m.id===msg.id))return false;state.messages.unshift(msg);state.messages=state.messages.slice(0,180);persist();render();if(!silent)chime();return true}
window.__luMail={
 getState:()=>{
  const latest=newestMessage();
  return {total:state.messages.length,unread:unreadCount(),latest:latest?{id:latest.id,category:latest.category,subject:latest.subject,body:latest.body,date:latest.date}:null};
 },
 post:(subject,body,category='idea',id='')=>{
  if(typeof subject!=='string'||typeof body!=='string'||!subject.trim()||!body.trim())return false;
  const safeCategory=byCategory[category]?category:'idea';
  const entry=mk([safeCategory,subject.slice(0,110),body.slice(0,800)],id||('lu-house-'+Date.now()),Date.now(),false,'house');
  return deliver(entry,true);
 }
};
function writing(msg){if(state.writing||state.messages.some(m=>m.id===msg.id))return;state.writing=true;$('luxMailStatus').textContent='Lux está escribiendo una nota…';try{window.__luxShowWriting?.(14000)}catch{}setTimeout(()=>{deliver(msg);state.writing=false;$('luxMailStatus').textContent='';},4400)}
let number=0;
function curPick(arr){return arr[(Math.floor(Date.now()/86400000)+number++)%arr.length]}
function daily(){const key='daily-'+datestring();if(!state.messages.some(m=>m.id===key)){const msg=mk(curPick(notes),key,Date.now());writing(msg)}}
function periodic(){if(document.hidden)return;const key='hour-'+Math.floor(Date.now()/2100000);if(!state.messages.some(m=>m.id===key))writing(mk(curPick(notes),key,Date.now()))}
function reply(value){const q=value.trim().toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');if(!q)return;
 let category='cine',tuple;
 if(/beca|ayuda|subvencion|residencia|proyecto|convocatoria|concurso/.test(q))category='becas';
 else if(/santiago|compostela/.test(q))category='santiago';
 else if(/coruna|agenda|exposicion|museo|galeria|cultura/.test(q))category='coruna';
 else if(/music|disco|escuchar|cancion|youtube|spotify|rock|electronica|sonido/.test(q))category='musica';
 else if(/idea|nota|sorpresa/.test(q))category='idea';
 if(category==='cine'){
 const catalog=[
 ['La Jetée','1962','Chris Marker','Una película hecha de fotografías y memoria.'],
 ['After Hours','1985','Martin Scorsese','Una noche que se complica cada vez más.'],
 ['Stalker','1979','Andréi Tarkovski','Contemplación y ciencia ficción.'],
 ['Tetsuo: The Iron Man','1989','Shinya Tsukamoto','Un sueño metálico y ruidoso.'],
 ['Daisies','1966','Věra Chytilová','Una aventura de collage y anarquía.'],
 ['Videodrome','1983','David Cronenberg','La televisión se mezcla con el cuerpo.']
 ];
 const f=curPick(catalog);tuple=['cine','Te propongo: '+f[0],f[0]+' ('+f[1]+'), de '+f[2]+'. '+f[3],['FilmAffinity',filmUrl(f[0]+' '+f[1])],['IMDb',imdbUrl(f[0]+' '+f[1])]];
 }else if(category==='musica'){const t=curPick(notes.filter(x=>x[0]==='música'||x[0]==='musica').concat(seed.filter(x=>x[0]==='música'||x[0]==='musica')));tuple=['musica',t[1],t[2],...t.slice(3)]}
 else if(category==='idea'){const t=curPick(notes.filter(x=>x[0]==='idea'));tuple=t}
 else if(category==='coruna')tuple=['coruna','Una mirada a la agenda coruñesa','Consulta lo que está pasando en A Coruña; algunas exposiciones y actividades necesitan reserva.',['Agenda de Coruña',cityA]];
 else if(category==='santiago')tuple=['santiago','Un plan por Compostela','La programación de Santiago incluye exposiciones, cine, música y artes escénicas.',['Agenda de Santiago',cityS]];
 else tuple=['becas','Becas y oportunidades en el radar','Consulta las ayudas y residencias; verifica siempre plazos, elegibilidad y bases antes de preparar una solicitud.',['Ministerio de Cultura',grantsUrl]];
 const id='ask-'+Date.now()+'-'+(++number);writing(mk(tuple,id,Date.now()))
}
$('luxMailPrompt').addEventListener('submit',e=>{e.preventDefault();const i=$('luxMailInput');if(!i.value.trim())return;const value=i.value;i.value='';initAudio();reply(value)});
async function fetchBulletin(){try{const response=await fetch('/casa-lux/boletin.json?cache='+Math.floor(Date.now()/3600000),{cache:'no-store'});if(!response.ok)return;const data=await response.json();
 for(const category of ['coruna','santiago','becas']){const rows=Array.isArray(data[category])?data[category]:[];for(const r of rows.slice(0,4).reverse()){if(!r||!safe(r.link)||!r.title||! /^\d{4}-\d\d-\d\d$/.test(r.date||''))continue;
 const when=Date.parse(r.date+'T12:00:00Z');if(!Number.isFinite(when)||when>Date.now()+86400000||Date.now()-when>30*86400000)continue;
 const id='news-'+idFor(category+'-'+r.title);if(state.messages.some(m=>m.id===id))continue;
 const tuple=[category,'Novedad · '+(category==='becas'?'convocatorias':category==='coruna'?'A Coruña':'Santiago'),r.title+'\n\nPublicado '+r.date+' · '+(r.source||'Fuente cultural')+'. '+(category==='becas'?'Comprueba bases y plazos.':'Comprueba fechas y lugar del evento.'),['Leer la noticia',r.link]];
 deliver(mk(tuple,id,when,false,'news'),true);
 }
 }
 }catch(e){console.info('Buzón: novedades temporalmente no disponibles',e?.message||e)}}
Object.assign(window.__luMail,{
 getState:()=>{
  const latest=newestMessage();
  return {total:state.messages.length,unread:unreadCount(),writing:state.writing,
    latest:latest?{subject:latest.subject,body:latest.body.slice(0,250),category:latest.category}:null};
 },
 // El motor utiliza el buzón existente; no publica mensajes en ningún servidor.
 observeAutonomy:(context)=>{
  if(!context||typeof context!=='object')return false;
  const slot=Math.floor(Date.now()/(45*60000)),id='lu-auto-'+slot;
  if(state.messages.some(m=>m.id===id))return false;
  const fields=[
   context.scene?'Escena: '+String(context.scene).slice(0,100):null,
   context.mood?'Ambiente: '+String(context.mood).slice(0,80):null,
   context.weather&& !/consultando|no disponible|sin datos/.test(context.weather.toLowerCase())?'Tiempo: '+String(context.weather).slice(0,100):null,
   context.tide&& !/consultando|no disponible|sin datos/.test(context.tide.toLowerCase())?'Mareas: '+String(context.tide).slice(0,100):null,
   context.moon&& !/calculando|no disponible|sin datos/.test(context.moon.toLowerCase())?'Luna: '+String(context.moon).slice(0,80):null
  ].filter(Boolean);
  return deliver(mk(['idea','Registro de la Casa',fields.join(' · ')||'El motor autónomo está activo.'],id,Date.now()),true);
 }
});
persist();render();setOpen(state.prefs.recentOpen);
setTimeout(daily,18000);
setInterval(periodic,2100000);
setTimeout(fetchBulletin,3500);
setInterval(fetchBulletin,3600000);
})();
