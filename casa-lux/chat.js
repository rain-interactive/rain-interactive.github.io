
/* Casa de Lux: chat cultural local (no simula una IA remota) */
(()=>{'use strict';
const dock=document.createElement('aside');dock.id='luxChatDock';dock.setAttribute('aria-label','Cuaderno cultural de Lux');
dock.innerHTML="\n<button type=\"button\" id=\"luxChatToggle\" aria-expanded=\"false\" aria-controls=\"luxChatPanel\"><span id=\"luxChatLed\"></span><span id=\"luxChatLabel\">LUX · CUADERNO</span><span id=\"luxChatTeaser\">Cine, música y cultura</span><span id=\"luxChatArrow\" aria-hidden=\"true\">⌄</span></button>\n<section id=\"luxChatPanel\" aria-label=\"Recomendaciones y mensajes\">\n<div id=\"luxChatHead\"><strong>Un cuaderno abierto</strong><small>Cine · música · A Coruña · Santiago · convocatorias</small></div>\n<nav id=\"luxChatTabs\" aria-label=\"Temas del cuaderno\"><button type=\"button\" data-ask=\"Cine\" aria-pressed=\"true\">Cine</button><button type=\"button\" data-ask=\"Música\" aria-pressed=\"false\">Música</button><button type=\"button\" data-ask=\"Agenda Coruña\" aria-pressed=\"false\">Coruña</button><button type=\"button\" data-ask=\"Agenda Santiago\" aria-pressed=\"false\">Santiago</button><button type=\"button\" data-ask=\"Becas de arte\" aria-pressed=\"false\">Becas</button></nav>\n<div id=\"luxChatLog\" role=\"log\" aria-live=\"polite\" aria-relevant=\"additions\"></div>\n<div id=\"luxChatChips\" aria-label=\"Pedir recomendaciones\"><button type=\"button\" data-ask=\"Cine raro\">Cine raro</button><button type=\"button\" data-ask=\"Música oscura\">Música oscura</button><button type=\"button\" data-ask=\"Exposiciones Coruña\">Exposiciones</button><button type=\"button\" data-ask=\"Convocatorias artísticas\">Convocatorias</button></div>\n<form id=\"luxChatForm\"><input id=\"luxChatInput\" aria-label=\"Mensaje para el cuaderno cultural\" autocomplete=\"off\" maxlength=\"220\" placeholder=\"Prueba: cine noir, música, becas…\" /><button id=\"luxChatSend\" type=\"submit\">Enviar</button></form>\n<div id=\"luxChatFoot\">Selección editorial y noticias enlazadas. Comprueba fechas y bases en la fuente. Sin mensajes privados.</div>\n</section>";
document.body.appendChild(dock);
const $=id=>document.getElementById(id), log=$('luxChatLog'),input=$('luxChatInput'),toggle=$('luxChatToggle');
const films=[
 ['After Hours','1985','Martin Scorsese','Una odisea nocturna donde cada puerta lleva a un desastre.','noir humor raro'],
 ['La Jetée','1962','Chris Marker','Ciencia ficción construida con fotografías y memoria.','experimental raro ciencia'],
 ['Tetsuo: The Iron Man','1989','Shinya Tsukamoto','Metal, cuerpo y ruido industrial.','terror raro experimental cyberpunk'],
 ['Ghost Dog: The Way of the Samurai','1999','Jim Jarmusch','Un samurái urbano y una banda sonora hipnótica.','noir raro musica'],
 ['Videodrome','1983','David Cronenberg','Televisión, carne y señales que no deberían existir.','terror cyberpunk raro'],
 ['Daisies','1966','Věra Chytilová','Collage cinematográfico travieso y anárquico.','experimental surreal humor raro'],
 ['Stalker','1979','Andréi Tarkovski','Un viaje lento al territorio de los deseos.','ciencia contemplativo raro'],
 ['The Lighthouse','2019','Robert Eggers','Dos hombres, un faro y una locura en blanco y negro.','terror noir raro'],
 ['Brazil','1985','Terry Gilliam','Burocracia, sueño y distopía de retazos.','ciencia surreal humor'],
 ['Possession','1981','Andrzej Żuławski','Una ruptura convertida en pesadilla física.','terror surreal raro'],
 ['The Cremator','1969','Juraj Herz','Humor negro y puesta en escena alucinada.','terror noir humor raro'],
 ['Memoria','2021','Apichatpong Weerasethakul','Una vibración misteriosa interrumpe lo cotidiano.','contemplativo raro experimental'],
 ['El caballo de Turín','2011','Béla Tarr','El tiempo, el viento y el fin del mundo.','contemplativo noir raro'],
 ['Under the Skin','2013','Jonathan Glazer','Ciencia ficción extrañamente humana.','terror ciencia experimental'],
 ['The Love Witch','2016','Anna Biller','Tecnicolor, magia y comedia incómoda.','surreal humor terror']
];
const tracks=[
 ['Portishead','Machine Gun','Ritmo mecánico y melancolía abrasiva.','oscura electronica noir'],
 ['Massive Attack','Angel','Bajo pesado y amenaza creciente.','oscura triphop'],
 ['Burial','Archangel','Niebla urbana y voces de otro lugar.','electronica nocturna oscura'],
 ['Sonic Youth','Teen Age Riot','Guitarras que tardan en estallar.','rock experimental'],
 ['Boards of Canada','Dayvan Cowboy','Cintas gastadas, infancia y horizontes.','ambient electronica contemplativo'],
 ['Stereolab','French Disko','Repetición y electricidad.','experimental rock'],
 ['Nine Inch Nails','The Day the World Went Away','Distorsión y ausencia.','oscura industrial'],
 ['The Knife','Silent Shout','Electrónica fría e inquietante.','oscura electronica'],
 ['Low','Dancing and Blood','Silencio y ruido en una misma habitación.','oscura contemplativo rock'],
 ['Chelsea Wolfe','Feral Love','Ritual de guitarras y sombras.','oscura rock'],
 ['Swans','Screen Shot','Una maquinaria rítmica insistente.','experimental oscura rock'],
 ['Cocteau Twins','Cherry-coloured Funk','Voces que parecen venir del agua.','contemplativo pop'],
 ['Death Grips','Hacker','Caos rítmico y velocidad.','experimental industrial electronica']
];
const ac='https://www.visitcoruna.com/turismo/es/agenda/agenda-por-tema?argIdioma=es&categoriaID=1417054416724';
const sc='https://www.santiagoturismo.com/axenda-cultural/';
const agenda={
 coruna:[
  ['Encontros. Federico García-Cabezón. Retrospectiva 1968–2026','Kiosco Alfonso','2026-10-15','2027-01-10',ac],
  ['Teño que cantar','Sala Salvador de Madariaga','2026-10-08','2026-11-15',ac],
  ['Fotografía micropictórica · More de la Cal','Fórum Metropolitano','2026-10-19','2026-11-02',ac],
  ['Norte Cinema Diverso','A Coruña','2026-11-25','2026-11-27','https://www.coruna.gal/cultura/es/agenda/calendario?argIdioma=es&categoriaID=1417055540843']
 ],
 santiago:[
  ['Ser Noutras · arte galega do Museo Reina Sofía','Santiago','2026-10-30','2027-03-28',sc],
  ['Cineuropa 2026','Santiago','2026-11-06','2026-11-22',sc],
  ['Voces del Pacífico','Cidade da Cultura','2026-06-05','2026-11-29',sc],
  ['Semana de Cinema Euroárabe Amal','Teatro Principal','2026-10-26','2026-10-30',sc]
 ]
};
const resources=[
 ['Ministerio de Cultura · artes visuales','Ayudas, residencias y producción. Revisar edición y plazo.','https://www.cultura.gob.es/cultura/creacion-contemporanea/becas-ayudas-y-subvenciones.html'],
 ['Rega · residencias artísticas do Gaiás','Programa gallego de residencias. Consultar futuras convocatorias.','https://xuventude.xunta.gal/es/node/3602'],
 ['Convocatorias culturales · A Coruña','Concursos y premios. Revisar bases y condiciones.','https://www.coruna.gal/informacionxuvenil/gl/convocatorias/concursos-e-premios?argIdioma=es'],
 ['Compostela Cultura · convocatorias','Proyectos expositivos. Ojo a edad, modalidad y plazos.','https://www.compostelacultura.gal/portalinstitucional/novas']
];
const phrases=[
 'Hay películas que funcionan como puertas abiertas a lugares extraños.',
 'Una canción también puede ser una pequeña arquitectura.',
 'El mar nunca repite exactamente el mismo encuadre.',
 'A veces la mejor exposición es la que no pensabas visitar.',
 'No todas las ideas necesitan convertirse en algo terminado.',
 'Hoy puede ser buen día para escuchar un disco desconocido.',
 'Una ciudad cambia cada vez que se enciende una sala de cine.'
];
let bulletin=null,lastTopic='cine',cursor=0;
function safe(u){try{const a=new URL(u,location.href);return a.protocol==='https:'?a.href:null}catch{return null}}
function date(){return new Intl.DateTimeFormat('sv-SE',{timeZone:'Europe/Madrid',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())}
function line(el,t,tag='p'){const x=document.createElement(tag);x.textContent=t;el.appendChild(x)}
function a(el,label,url){let h=safe(url);if(!h)return;const x=document.createElement('a');x.href=h;x.target='_blank';x.rel='noopener noreferrer';x.textContent=label;el.appendChild(x)}
function say(type,cb){let article=document.createElement('article');article.className='luxChatMsg '+type;let small=document.createElement('span');small.className='luxChatFrom';small.textContent=type==='bot'?'LUX · CUADERNO':'TÚ';article.appendChild(small);if(typeof cb==='string')line(article,cb);else cb(article);log.appendChild(article);while(log.children.length>22)log.firstChild.remove();log.scrollTop=log.scrollHeight}
function item(el,name,detail,description,links){const x=document.createElement('div');x.className='luxChatResult';line(x,name,'b');if(detail)line(x,detail,'span');if(description)line(x,description,'span');links.forEach(p=>a(x,p[0],p[1]));el.appendChild(x)}
function searchLink(url,q){return url+encodeURIComponent(q)}
function selection(items,q){
 const n=Number(q.match(/\b[2-5]\b/)?.[0]||3);
 let filter=null;
 if(/terror|horror/.test(q))filter='terror';
 else if(/noir|negra|polici/.test(q))filter='noir';
 else if(/ciencia|ficci|sci.fi|cyber/.test(q))filter='ciencia';
 else if(/rar|surreal|experiment|ruido/.test(q))filter='raro';
 else if(/oscura|oscur|industrial|noche|nocturn/.test(q))filter='oscura';
 else if(/electron|techno/.test(q))filter='electronica';
 else if(/guitarr|punk|rock/.test(q))filter='rock';
 else if(/calma|tranqui|suave|lento/.test(q))filter='contemplativo';
 const pool=filter?items.filter(i=>i[i.length-1].includes(filter)):items;
 const src=pool.length?pool:items,offset=(Math.floor(Date.now()/86400000)+cursor++)%src.length;
 return Array.from({length:Math.min(n,src.length)},(_,i)=>src[(offset+i)%src.length])
}
function cine(q){say('bot',el=>{line(el,'Tres películas para perderse un rato:');selection(films,q).forEach(f=>item(el,f[0]+' ('+f[1]+')',f[2],f[3],[['FilmAffinity',searchLink('https://www.filmaffinity.com/es/search.php?stext=',f[0]+' '+f[1])],['IMDb',searchLink('https://www.imdb.com/find/?q=',f[0]+' '+f[1])]]))})}
function musica(q){say('bot',el=>{line(el,'Tres pistas para escuchar donde prefieras:');selection(tracks,q).forEach(t=>item(el,t[0]+' — '+t[1],'',t[2],[['YouTube',searchLink('https://www.youtube.com/results?search_query=',t[0]+' '+t[1])],['Spotify',searchLink('https://open.spotify.com/search/',t[0]+' '+t[1])]]))})}
function stamp(iso){const s=iso.split('-');return s[2]+'/'+s[1]+'/'+s[0]}
function showNews(el,kind){const entries=bulletin?.[kind]||[];if(!entries.length)return;line(el,'Noticias recientes para consultar (confirmar fecha y condiciones):');entries.slice(0,3).forEach(x=>item(el,x.title,'Publicado '+stamp(x.date)+' · '+x.source,'',[['Fuente',x.link]]))}
function ciudad(kind){const isA=kind==='coruna';say('bot',el=>{line(el,'Agenda cultural de '+(isA?'A Coruña':'Santiago')+'.');const act=agenda[kind].filter(v=>v[3]>=date()).slice(0,4);if(!act.length)line(el,'No tengo eventos precargados que sigan vigentes.');
 act.forEach(v=>item(el,v[0],v[1]+' · '+(v[2]>date()?'Desde '+stamp(v[2]):'Hasta '+stamp(v[3])),'',[['Agenda oficial',v[4]]]));showNews(el,kind);a(el,'Consultar más actividades',isA?'https://www.coruna.gal/cultura/es/agenda/calendario?argIdioma=es&categoriaID=1417055540843':sc)})}
function becas(){say('bot',el=>{line(el,'Convocatorias de creación artística: no doy por abierto ningún plazo hasta comprobar bases y requisitos.');showNews(el,'becas');line(el,'Fuentes oficiales para seguir nuevas oportunidades:');resources.forEach(r=>item(el,r[0],'',r[1],[['Consultar',r[2]]]))})}
function answer(raw,showUser=true){const text=(raw||'').trim().slice(0,220);if(!text)return;if(showUser)say('user',text);const q=text.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');
 let topic=/\b(otra|otro|mas|siguiente|sorprendeme)\b/.test(q)&&q.length<35?lastTopic:
 /beca|convocat|residen|subvenc|ayuda|premio|proyecto|financia/.test(q)?'becas':
 /santiago|compostela/.test(q)?'santiago':
 /coruna|exposici|agenda|cultur|museo|evento/.test(q)?'coruna':
 /music|musica|disco|album|tema|cancion|spotify|youtube|escuchar|sonido|oscura|electronica/.test(q)?'musica':
 /cine|peli|film|affinity|imdb|terror|noir|comedia|ficcion|distopia|director/.test(q)?'cine':
 /hola|buenos|buenas|que tal/.test(q)?'nota':lastTopic;
 lastTopic=topic;
 [...$('luxChatTabs').querySelectorAll('button')].forEach(b=>{const s=b.dataset.ask.toLocaleLowerCase('es').normalize('NFD').replace(/[\u0300-\u036f]/g,'');b.setAttribute('aria-pressed',String((topic==='cine'&&s==='cine')||(topic==='musica'&&s==='musica')||(topic==='coruna'&&s.includes('coruna'))||(topic==='santiago'&&s.includes('santiago'))||(topic==='becas'&&s.includes('becas'))))});
 if(topic==='cine')cine(q);else if(topic==='musica')musica(q);else if(topic==='coruna'||topic==='santiago')ciudad(topic);else if(topic==='becas')becas();else say('bot',phrases[Math.floor(Date.now()/3600000)%phrases.length]+' También puedo recomendar películas, música y convocatorias culturales.');
}
function open(isOpen){dock.classList.toggle('open',isOpen);toggle.setAttribute('aria-expanded',String(isOpen));if(isOpen){input.focus({preventScroll:true});log.scrollTop=log.scrollHeight}}
toggle.addEventListener('click',()=>open(!dock.classList.contains('open')));
dock.querySelectorAll('[data-ask]').forEach(b=>b.addEventListener('click',()=>{open(true);answer(b.dataset.ask,false)}));
$('luxChatForm').addEventListener('submit',e=>{e.preventDefault();const t=input.value;input.value='';answer(t)});
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dock.classList.contains('open'))open(false)});
say('bot','Cuaderno cultural abierto. Puedo dejarte cine, música, planes en A Coruña y Santiago y pistas de becas o proyectos. ¿Por dónde empezamos?');
function teaser(){const p=['Cine extraño para hoy','Algo nuevo en el Atlántico','Música para bajar la luz','Convocatorias en el radar','Dos ciudades, muchas historias','La próxima idea está fuera'];$('luxChatTeaser').textContent=p[Math.floor(Date.now()/480000)%p.length]}
teaser();setInterval(teaser,90000);
setInterval(()=>{if(dock.classList.contains('open')&&log.children.length<14)say('bot',phrases[Math.floor(Date.now()/3600000)%phrases.length])},3600000);
async function news(){try{const resp=await fetch('/casa-lux/boletin.json?ts='+Math.floor(Date.now()/3600000),{cache:'no-store'});if(!resp.ok)return;const data=await resp.json();const clean=arr=>Array.isArray(arr)?arr.filter(v=>v&&typeof v.title==='string'&&v.title.length<200&&safe(v.link)&&/^\d{4}-\d{2}-\d{2}$/.test(v.date||'')&&(Date.now()-new Date(v.date+'T00:00:00Z').getTime())<45*86400000).slice(0,8):[];bulletin={coruna:clean(data.coruna),santiago:clean(data.santiago),becas:clean(data.becas)}}catch(err){console.info('Cuaderno: noticias sin conexión',err?.message||err)}}
news();setInterval(news,3600000);
})();
