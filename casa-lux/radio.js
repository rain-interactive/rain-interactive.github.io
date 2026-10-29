/* Reproductor oficial SoundCloud: no aloja ni copia el audio. */
(()=>{'use strict';
const mixes=[
 {name:'Sasha Crush · disco y funk',short:'Disco / Funk',desc:'Soul, synth-pop, disco, funk y algo de freestyle. Para escuchar mientras trabajas.',url:'https://soundcloud.com/user-643553014/sasha-crush-110724'},
 {name:'Moxie · The Travel Episode',short:'Suave / Soul',desc:'Una sesión de NTS tranquila: Sault, Khruangbin, Björk, Cleo Sol y Can.',url:'https://soundcloud.com/djmoxie/moxie-on-nts-radio-home-broadcast-22-travel-episode-pt-2-160920'},
 {name:'Moxie · NTS 2026',short:'House / DJ',desc:'La selección de sesiones de Moxie en NTS durante 2026: house, groove y descubrimientos.',url:'https://soundcloud.com/djmoxie/sets/moxie-nts-radio-playlist-2026'},
 {name:'Cheb Mimo · downtempo y raï',short:'Ritmos globales',desc:'Selección relajada y bailable con raï, discos magrebíes y downtempo.',url:'https://soundcloud.com/scenenoise/mimo-select'},
 {name:'pmresistance · All Styles All Smiles',short:'Soul / Boogie',desc:'Sonidos de los 80 y 90: soul, boogie y góspel de buen humor.',url:'https://soundcloud.com/pmresistance/nts-radio-mix-for-all-styles'},
 {name:'babyschön · Phonica',short:'Post-punk / Italo',desc:'NTS resident: italo, post-punk, EBM y house raro pero con ritmo.',url:'https://soundcloud.com/phonicarecords/off-the-record-mix-series-59-babyschon'},
 {name:'Channeling · indie rock y new wave',short:'Indie / Rock',desc:'Una sesión de NTS con indie, new wave y guitarras, fuera de lo electrónico.',url:'https://soundcloud.com/user-643553014/channeling-w-ivan-smagghe-8'},
 {name:'Pictureplane · indie rap 90s/2000s',short:'Hip-hop',desc:'Rap underground y boom bap de finales de los 90 y primeros 2000.',url:'https://soundcloud.com/pictureplane/nts-radio-boxxx-report-late-90s-early-2000s-indie-rap-mix'},
 {name:'NTS Guide To · colección',short:'Exploraciones',desc:'Sesiones de jazz, shoegaze, psicodelia brasileña, folk, vaporwave y otras rarezas.',url:'https://soundcloud.com/waitingfordog/sets/nts-guide-to'},
 {name:'NTS · CC:Disco! (2025)',short:'Disco elegante',desc:'Dos horas para cocinar o dibujar: Stevie Wonder, disco, soul y house cálido.',url:'https://soundcloud.com/user-643553014/cc-disco-220125'},
 {name:'NTS · CC:Disco! (2024)',short:'Disco y house',desc:'De Byron The Aquarius y Leon Vynehall a Womack & Womack. Energía sin estridencias.',url:'https://soundcloud.com/user-643553014/cc-disco-131124'},
 {name:'NTS · Prosumer (2025)',short:'Deep house',desc:'Todd Terry, Kerri Chandler y house para dejar sonando el estudio.',url:'https://soundcloud.com/user-643553014/prosumer-130525'},
 {name:'NTS · Prosumer For Hibiscus',short:'Synth / Boogie',desc:'Bowie, disco, boogie y synth-pop en una mezcla afectuosa y variada.',url:'https://soundcloud.com/user-643553014/prosumer-for-hibiscus-030924'},
 {name:'NTS · SlothBoogie',short:'Funk / Groove',desc:'Jazz, soul profundo, funk, broken beat y house amable.',url:'https://soundcloud.com/user-643553014/ldldn-w-slothboogie-010723'},
 {name:'NTS Radio · 48 sesiones',short:'48 sesiones NTS',desc:'Lista de SoundCloud con Floating Points, Thom Yorke, Four Tet, Caribou, vaporwave y más.',url:'https://soundcloud.com/verybusyppl/sets/nts-radio'},
 {name:'NTS · GiGi FM Production Mix',short:'Jungle / Dub',desc:'Jungle, techno, poesía y paisajes sonoros. Para la parte más exploradora del día.',url:'https://soundcloud.com/gigi-fm/nts-radio-gigi-fm-production-mix-21052025'},
 {name:'NTS · Orpheu The Wizard',short:'Electrónica rara',desc:'Selección de house, electrónica, disco oblicuo y hallazgos menos previsibles.',url:'https://soundcloud.com/user-643553014/orpheu-the-wizard-140624'},
 {name:'NTS · David August',short:'Club / Ritmo',desc:'Sesión acelerada de club con 45 temas y edits en 56 minutos.',url:'https://soundcloud.com/davidaugust/nts-radio-16012025'},
 {name:'NTS · IMOGEN Production Mix',short:'Techno / Club',desc:'Producción propia y atmósfera nocturna para cuando apetezca más intensidad.',url:'https://soundcloud.com/imogensmusic/nts-radio-100-production-mix'},
 {"name":"Vox Sinistra · Samo Mix 85","short":"Darkwave · EBM","desc":"Sintes oscuros, EBM y new beat. Mi elección para la noche de luces verdes.","url":"https://soundcloud.com/samorecords/samo-mix-85-vox-sinistra"},
 {"name":"Arnaud Rebotini · EBM Selection","short":"EBM francés","desc":"Máquinas analógicas y pulso industrial. Rebotini, The Hacker y Schwefelgelb.","url":"https://soundcloud.com/arnaudrebotini/a-modern-ebm-and-techno-selection-fevrier-2025-mix"},
 {"name":"CURVE X · Alien Planet","short":"Acid / Post-punk","desc":"Un viaje de vinilo desde Barcelona: post-punk, acid, techno y experimentación.","url":"https://soundcloud.com/from-hell-to-disco/from-hell-to-disco-03-curve-x"},
 {"name":"Local Suicide · Blank Wave","short":"Disco oscuro","desc":"Indie dance, italo, new wave y el lado más nocturno de Berlín.","url":"https://soundcloud.com/shialabiff/blank-wave-guest-mix-117-local-suicide"},
 {"name":"Huerco S · RA.658","short":"Ambient inquietante","desc":"Paisajes ambientales, extraños y envolventes; para mirar la Casa en silencio.","url":"https://soundcloud.com/resident-advisor/ra658-huerco-s"},
 {"name":"GiGi FM + Shoal · NTS","short":"Ambient / Texturas","desc":"Síntesis cruda y paisajes sonoros contemplativos; tecnología y naturaleza.","url":"https://soundcloud.com/gigi-fm/nts-radio-gigi-fm-presents-1"},
 {"name":"GiGi FM · F_LORAL","short":"Ambient íntimo","desc":"Música atmosférica luminosa para las horas de descanso.","url":"https://soundcloud.com/gigi-fm/gigi-fm-presents-f_loral-nts-radio-january-2026"},
 {"name":"DJ Stingray · Zone 313","short":"Electro futurista","desc":"Electro de Detroit, energía sintética y ritmos rápidos.","url":"https://soundcloud.com/rinsefm/djstingray260126"},
 {"name":"Buttechno · NTS enero 2026","short":"Ambient / Extraño","desc":"Pavel Milyakov: atmósferas melancólicas y experimentales.","url":"https://soundcloud.com/buttechno/nts-12012026"},
 {"name":"Inch of Shadow · Insomnia Berlin","short":"Dark disco / EBM","desc":"Dos horas de dark disco, EBM y electro grabadas en Berlín.","url":"https://soundcloud.com/inch-of-shadow/inch-of-shadow-insomnia-dj-set"},
 {"name":"Indie Music Nation · Dream Pop","short":"Shoegaze / Indie","desc":"Guitarras veladas, dream pop y canciones para mirar por la ventana.","url":"https://soundcloud.com/indiemusicnation/sets/dream-pop-shoegaze-april-2026"},
 {"name":"NTS · Dream Forest","short":"Jungle ambiental","desc":"Breakbeats de los noventa, neblina y nostalgia digital.","url":"https://soundcloud.com/user-202286394-991268468/dream-forest-w-barrage-250426"}
,
 {"name":"Minimal Schlager · TANK Mix","short":"Italo / Darkwave","desc":"Disco italiano, synth-pop inquieto, DAF, The Cure y Boy Harsher. Un salón de Lu Roth a medianoche.","url":"https://soundcloud.com/tank-magazine/tank-mix-minimal-schlager"},
 {"name":"Demdike Stare · MovingMetals","short":"Ritual / Industrial","desc":"Collage electrónico sombrío y espectral, para las escenas nocturnas más extrañas.","url":"https://soundcloud.com/modernlove/demdike-stare-mix-movingmetals"},
 {"name":"Skee Mask · Mixtape 001","short":"IDM / Ambient","desc":"Ambient espacial, breakbeats y techno de Munich; movimiento de cámara en cámara lenta.","url":"https://soundcloud.com/metamorphnyc/artcast001-skee-mask"},
 {"name":"Loraine James · NTS 140426","short":"Glitch / IDM","desc":"Jazz deconstruido, IDM y detalles ambientales, todo lo imperfecto y humano de la electrónica.","url":"https://soundcloud.com/user-202286394-991268468/loraine-james-140426"},
 {"name":"Ellen Allien · SECTION London","short":"Techno hipnótico","desc":"Sintetizadores espaciales, voces retorcidas y una sesión muy física.","url":"https://soundcloud.com/ellen-allien/ellen-alien-section-london-june-2025"},
 {"name":"Helena Hauff · The Cover Mix","short":"Electro crudo","desc":"Electro tenso y nocturno, máquinas viejas y electricidad en las paredes.","url":"https://soundcloud.com/mixmag-1/the-cover-mix-helena-hauff"},
 {"name":"DJ Diskord · Witch House","short":"Witch house","desc":"Salem, CRIM3S, Gesaffelstein y niebla digital para la Casa.","url":"https://soundcloud.com/morbidx-1/witch-housedark-trap-mix-by-dj-diskord"},
 {"name":"Doctor Jeep · De School","short":"Club / Bass","desc":"Una sesión oscura de club grabada en Ámsterdam, con ritmos de bajos muy vivos.","url":"https://soundcloud.com/drjeep/doctor-jeep-live-at-de-school"},
 {"name":"CRIM3S · selección oscura","short":"Witch / Noise","desc":"Recorrido concentrado por las canciones de CRIM3S: pulsos sucios y distorsión emocional.","url":"https://soundcloud.com/user-11160019-216054474/crim3s-mix"},
 {"name":"Boy Harsher · Machina Dark Mix","short":"Dark synth","desc":"Synth oscuro e hipnótico de Boy Harsher para una pausa breve entre sesiones.","url":"https://soundcloud.com/boy-harsher/machina-ft-mariana-saldana-1"}
];

/* Sonido continuo: empieza tras pulsar Play y después enlaza sesiones en orden aleatorio. */
const dock=document.createElement('aside');
dock.id='luxRadioDock';dock.setAttribute('aria-label','Radio Lu Roth · SoundCloud NTS Radio');
dock.innerHTML='<button id="luxRadioToggle" type="button" aria-expanded="false" aria-controls="luxRadioPanel"><span class="luxRadioNote" aria-hidden="true">♫</span><span class="luxRadioName">RADIO LU ROTH</span><span class="luxRadioChevron" aria-hidden="true">⌄</span></button><div id="luxRadioNow" role="status" aria-live="polite"></div><section id="luxRadioPanel" aria-label="Sesiones de música"><div id="luxRadioIntro"><strong>La música de la casa</strong><p>NTS Radio: soul, funk, disco, house, rock y descubrimientos. Reproducción continua, con orden aleatorio.</p></div><nav id="luxRadioChoices" aria-label="Elegir sesión"></nav><div id="luxRadioActive" aria-live="polite"></div><iframe id="luxRadioFrame" title="SoundCloud: reproductor seleccionado" loading="lazy" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="luxRadioFlow" role="group" aria-label="Opciones de reproducción"><button id="luxRadioLoop" type="button" aria-pressed="true">↻ Bucle: sí</button><button id="luxRadioRandom" type="button" aria-pressed="true">⤨ Aleatorio: sí</button><button id="luxRadioNext" type="button">⏭ Siguiente</button></div><p id="luxRadioHint" aria-live="polite">El primer play se hace dentro de SoundCloud. Después se cambian automáticamente las sesiones.</p><div id="luxRadioFooter"><a id="luxRadioOriginal" href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">Abrir en SoundCloud</a><div>Las pistas disponibles y el permiso de reproducción automática dependen de SoundCloud y del navegador.</div></div></section>';
document.body.appendChild(dock);

// Las fuentes conviven bajo Radio Lu Roth, sin créditos ni divisiones por autor.
// La playlist publicada de Rain utiliza el reproductor oficial de Spotify.
const luMusicShelf=document.createElement('div');
luMusicShelf.id='luMusicShelf';
luMusicShelf.innerHTML='<div class="luMusicShelfNav"><button id="luMusicPlaylist" type="button" aria-expanded="false" aria-controls="luMusicPlaylistPanel">Colección musical</button><a href="https://desktop-0qpstrv.tailae0643.ts.net/web/" target="_blank" rel="noopener noreferrer" title="Abrir la biblioteca privada en Jellyfin">Archivo audiovisual</a></div><div id="luMusicPlaylistPanel" hidden><p>Una colección más de Radio Lu Roth. Spotify puede pedir que inicies sesión para escucharla completa.</p><iframe id="luMusicSpotifyFrame" title="Radio Lu Roth · colección musical" loading="lazy" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" referrerpolicy="strict-origin-when-cross-origin"></iframe></div>';
dock.querySelector('#luxRadioPanel').insertBefore(luMusicShelf,dock.querySelector('#luxRadioActive'));
const musicShelfButton=luMusicShelf.querySelector('#luMusicPlaylist');
const musicShelfPanel=luMusicShelf.querySelector('#luMusicPlaylistPanel');
const musicShelfFrame=luMusicShelf.querySelector('#luMusicSpotifyFrame');
const musicShelfURL='https://open.spotify.com/embed/playlist/4l7Q5zlpxrBLu7yFwyJeEY?utm_source=generator';
let musicShelfOpen=false;
function showMusicShelf(show){
 // Inicializar primero SoundCloud para que la colección no se cierre al cargar.
 if(show&&!initialized)open(true);
 musicShelfOpen=Boolean(show);
 dock.classList.toggle('has-lu-collection',musicShelfOpen);
 musicShelfPanel.hidden=!musicShelfOpen;
 musicShelfButton.setAttribute('aria-expanded',String(musicShelfOpen));
 if(musicShelfOpen){
  if(!musicShelfFrame.src)musicShelfFrame.src=musicShelfURL;
  // No se oyen dos reproductores simultáneos.
  try{widget?.pause()}catch{}
  autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=true;
  isPlaying=false;updateNow();
  open(true);
 }else if(musicShelfFrame.src){
  // Desmontar el iframe detiene también una reproducción de Spotify.
  musicShelfFrame.removeAttribute('src');
 }
 updateNow();
}
musicShelfButton.addEventListener('click',()=>showMusicShelf(!musicShelfOpen));

const $=id=>document.getElementById(id);
const toggle=$('luxRadioToggle'),choices=$('luxRadioChoices'),frame=$('luxRadioFrame');
const memKey='casa-lux-soundcloud-choice-v1',settingsKey='casa-lux-radio-flujo-v1';
let selected=0,initialized=false,widget=null,widgetReady=false,transitioning=false;
let lastTrackIndex=0,trackCount=1,shuffleBag=[];
let flow={loop:true,random:true},hasPlayed=false,isPlaying=false,luRadioManual=false;
let autoSessionActive=false,autoPlaybackPending=false,autoStopRequested=false;
let visualPreference=null,visualRecent=[];
try {
 const prev=Number(localStorage.getItem(memKey));
 if(Number.isInteger(prev)&&prev>=0&&prev<mixes.length)selected=prev;
 const saved=JSON.parse(localStorage.getItem(settingsKey)||'null');
 if(saved && typeof saved.loop==='boolean' && typeof saved.random==='boolean')flow=saved;
} catch {}
function save(){try{localStorage.setItem(memKey,String(selected));localStorage.setItem(settingsKey,JSON.stringify(flow))}catch{}}
function updateNow(){const mix=mixes[selected];if(!mix)return;$('luxRadioNow').textContent=musicShelfOpen?'♫ Colección musical · Radio Lu Roth':(isPlaying?'♫ Sonando · ':hasPlayed?'Pausada · ':'Playlist · ')+mix.name;}
function mixURL(mix,play){
 return 'https://w.soundcloud.com/player/?url='+encodeURIComponent(mix.url)+
   '&auto_play='+Boolean(play)+'&color=%23ffffff&show_artwork=true&show_comments=false&show_user=true'+
   '&show_playcount=false&hide_related=true&visual=false&single_active=true';
}
function updateControls(){
 $('luxRadioLoop').setAttribute('aria-pressed',String(flow.loop));
 $('luxRadioRandom').setAttribute('aria-pressed',String(flow.random));
 $('luxRadioLoop').textContent=flow.loop?'↻ Bucle: sí':'↻ Bucle: no';
 $('luxRadioRandom').textContent=flow.random?'⤨ Aleatorio: sí':'⤨ Aleatorio: no';
}
function pickNext(){
 if(!flow.random)return (selected+1)%mixes.length;
 if(!shuffleBag.length){
  shuffleBag=Array.from({length:mixes.length},(_,i)=>i).filter(i=>i!==selected);
  for(let i=shuffleBag.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[shuffleBag[i],shuffleBag[j]]=[shuffleBag[j],shuffleBag[i]]}
 }
 const i=shuffleBag.shift();
 return Number.isInteger(i)?i:(selected+1)%mixes.length;
}
function setMix(i,play=false){
 if(!Number.isInteger(i)||!mixes[i])return;
 if(musicShelfOpen)showMusicShelf(false);
 selected=i;lastTrackIndex=0;trackCount=1;transitioning=false;isPlaying=false;updateNow();
 const mix=mixes[i];
 const active=$('luxRadioActive');
 active.replaceChildren();
 const title=document.createElement('strong');title.textContent=mix.name;
 const desc=document.createElement('small');desc.textContent=mix.desc;
 active.append(title,desc);
 $('luxRadioOriginal').href=mix.url;
 choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.index)===i)));
 initialized=true;save();
 if(widget&&widgetReady){
  // load conserva los listeners: no se reemplaza el iframe cuando la API está conectada.
  try{widget.load(mix.url,{auto_play:!!play,color:'#ffffff',show_artwork:true,
       show_comments:false,show_user:true,show_playcount:false,
       hide_related:true,visual:false,single_active:true,
       callback:()=>{if(play&&!autoStopRequested)widget.play()}})}
  catch{frame.src=mixURL(mix,play)}
 }else frame.src=mixURL(mix,play);
 frame.title='SoundCloud · '+mix.name;
 $('luxRadioHint').textContent=play?'Siguiente sesión: '+mix.name:'Pulsa Play en SoundCloud para iniciar la radio.';
}
function goNext(){
 if(transitioning)return;
 transitioning=true;
 const mood=document.getElementById('stage')?.dataset.luMood||'';
 let candidates=autoSessionActive&&!luRadioManual?ambientChoices(mood).filter(x=>x.i!==selected):[];
 if(autoSessionActive&&!luRadioManual&&visualPreference){
  const visualFilters={
   oscuro:/dark|ambient|industrial|drone|techno|post.punk|witch|experimental|demdike|skee|helena/i,
   luminoso:/disco|funk|soul|boogie|house|jazz|groove/i,
   frío:/electr|ambient|idm|wave|dub|jungle|techno|experimental/i,
   cálido:/soul|boogie|downtempo|disco|groove|indie|funk/i,
   neutro:/experimental|explor|indie|ambient|house/i
  };
  const rx=visualFilters[visualPreference.tone]||visualFilters.neutro;
  const visual=Array.from({length:mixes.length},(_,i)=>({m:mixes[i],i}))
   .filter(x=>x.i!==selected&&!visualRecent.includes(x.i)&&rx.test(x.m.name+' '+x.m.short+' '+x.m.desc));
  if(visual.length)candidates=visual;
 }
 const next=candidates.length?candidates[Math.floor(Math.random()*candidates.length)].i:pickNext();
 visualRecent.push(next);visualRecent=visualRecent.slice(-8);
 setMix(next,true);
 // SoundCloud termina primero el set actual; las preferencias visuales guían el siguiente.
}
function setupWidget(){
 if(widget||!window.SC||typeof window.SC.Widget!=='function')return;
 try{
  const api=window.SC.Widget;widget=api(frame);
  widget.bind(api.Events.READY,()=>{
   widgetReady=true;
   // Si el visitante ha encendido la Casa antes de que cargase SoundCloud,
   // se solicita reproducción al estar listo el widget (puede requerir Play).
   if(autoSessionActive&&autoPlaybackPending){
    autoPlaybackPending=false;
    try{widget.play()}catch{}
   }
   widget.getSounds(sounds=>{if(Array.isArray(sounds))trackCount=Math.max(1,sounds.length)});
  });
  widget.bind(api.Events.PLAY,()=>{
   hasPlayed=true;isPlaying=true;widgetReady=true;transitioning=false;autoPlaybackPending=false;updateNow();
   widget.getCurrentSoundIndex(index=>{
    if(Number.isInteger(index))lastTrackIndex=index;
   });
   widget.getSounds(sounds=>{if(Array.isArray(sounds))trackCount=Math.max(1,sounds.length)});
   $('luxRadioHint').textContent='Sonando · al acabar, '+(flow.loop?'otra sesión '+(flow.random?'aleatoria':'en orden'):'la radio se detendrá')+'.';
  });
  widget.bind(api.Events.PAUSE,()=>{isPlaying=false;updateNow()});
  widget.bind(api.Events.FINISH,()=>{
   if(!flow.loop||!hasPlayed||transitioning)return;
   // FINISH se emite también al terminar pistas individuales de un set.
   // Dejamos que SoundCloud avance internamente hasta la última pista.
   const endedIndex=lastTrackIndex;
   widget.getSounds(sounds=>{
    const count=Array.isArray(sounds)?Math.max(1,sounds.length):trackCount;
    if(endedIndex>=count-1)goNext();
   });
  });
  widget.bind(api.Events.ERROR,()=>{
   isPlaying=false;updateNow();
   $('luxRadioHint').textContent='Esta sesión no está disponible. Prueba «Siguiente» o ábrela en SoundCloud.';
  });
 }catch{widget=null;widgetReady=false}
}
function loadSDK(){
 if(window.SC?.Widget){setupWidget();return}
 if(document.getElementById('luxSoundcloudAPI'))return;
 const script=document.createElement('script');script.id='luxSoundcloudAPI';
 script.src='https://w.soundcloud.com/player/api.js';script.async=true;
 script.onload=setupWidget;
 script.onerror=()=>{$('luxRadioHint').textContent='No se pudo conectar el control automático. Puedes escuchar en SoundCloud.'};
 document.head.appendChild(script);
}
function open(value){
 dock.classList.toggle('open',value);
 toggle.setAttribute('aria-expanded',String(value));
 if(value){
  if(!initialized)setMix(selected,false);
  loadSDK();
 }
}
mixes.forEach((mix,i)=>{
 const button=document.createElement('button');
 button.type='button';button.dataset.index=String(i);button.textContent=mix.short;
 button.setAttribute('aria-pressed',String(i===selected));button.title=mix.desc;
 button.addEventListener('click',()=>{
  luRadioManual=true;autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=false;
  shuffleBag=shuffleBag.filter(x=>x!==i);
  if(!initialized)open(true);
  setMix(i,true);
  loadSDK();
 });
 choices.appendChild(button);
});
$('luxRadioLoop').addEventListener('click',()=>{
 flow.loop=!flow.loop;updateControls();save();
});
$('luxRadioRandom').addEventListener('click',()=>{
 flow.random=!flow.random;shuffleBag=[];updateControls();save();
});
$('luxRadioNext').addEventListener('click',()=>{luRadioManual=true;autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=false;open(true);goNext()});
toggle.addEventListener('click',()=>open(!dock.classList.contains('open')));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&dock.classList.contains('open'))open(false);
});
function ambientChoices(mood){
 const filters={
  'lluvia nocturna':/ambient|downtempo|dark|dembike|demdike|electrónica|nocturna|experimental/i,
  insomnio:/ambient|dark|post.punk|witch|electrónica|explor/i,
  nocturna:/post.punk|ebm|dark|techno|witch|industrial/i,
  lluvia:/ambient|downtempo|jazz|soul|explor/i,
  'gris atlántico':/ambient|downtempo|soul|jazz|explor/i,
  mañana:/suave|soul|disco|funk|boogie/i,
  taller:/house|soul|funk|ritmo|electrónica/i,
  atardecer:/synth|indie|new wave|downtempo|disco/i
 };
 const filter=filters[mood]||filters.taller;
 return mixes.map((m,i)=>({m,i})).filter(x=>filter.test(x.m.name+' '+x.m.short+' '+x.m.desc));
}
window.__luRadio={
 getState:()=>({title:musicShelfOpen?'Colección musical':mixes[selected]?.name||'',playing:isPlaying,hasPlayed,manual:luRadioManual,autoSessionActive,autoPlaybackPending,visualTone:visualPreference?.tone||null,collectionOpen:musicShelfOpen}),
 openCollection:()=>showMusicShelf(true),
 // La imagen guía el próximo set, sin interrumpir jamás la sesión en marcha.
 setVisualPreference:(profile)=>{
  if(!profile||typeof profile.tone!=='string')return false;
  visualPreference={tone:profile.tone,brightness:Number(profile.brightness)||0,detail:Number(profile.detail)||0};
  return true;
 },
 // Se llama directamente desde la pulsación ON: el gesto del usuario autoriza
 // intentar reproducir SoundCloud; no podemos garantizar permisos del navegador.
 startAutonomy:(mood)=>{
  if(musicShelfOpen)showMusicShelf(false);
  autoSessionActive=true;autoPlaybackPending=true;autoStopRequested=false;luRadioManual=false;visualRecent=[];
  const candidates=ambientChoices(mood);
  const choice=candidates.length?candidates[Math.floor(Math.random()*candidates.length)]:{i:selected};
  frame.loading='eager';
  open(true);
  setMix(choice.i,true);
  loadSDK();
  if(widgetReady&&widget){try{widget.play();autoPlaybackPending=false}catch{}}
  $('luxRadioHint').textContent='Autonomía ON: solicitando reproducción. Si SoundCloud la bloquea, pulsa Play en el reproductor.';
  return mixes[selected]?.name||'';
 },
 stopAutonomy:()=>{
  const wasAuto=autoSessionActive;
  autoSessionActive=false;autoPlaybackPending=false;autoStopRequested=true;
  if(!wasAuto)return;
  if(widget){try{widget.pause()}catch{}}
  else if(initialized)frame.src=mixURL(mixes[selected],false);
  isPlaying=false;updateNow();
  $('luxRadioHint').textContent='Autonomía apagada: radio en pausa. Puedes reproducirla manualmente.';
 },
 // Selección de ambiente sin iniciar audio ni interrumpir una sesión elegida por el visitante.
 suggest:(mood)=>{
  if(luRadioManual||hasPlayed||isPlaying||transitioning||autoSessionActive)return false;
  const filters={
   'lluvia nocturna':/ambient|downtempo|dark|dembike|demdike|electrónica|nocturna|experimental/i,
   insomnio:/ambient|dark|post.punk|witch|electrónica|explor/i,
   nocturna:/post.punk|ebm|dark|techno|witch|industrial/i,
   lluvia:/ambient|downtempo|jazz|soul|explor/i,
   'gris atlántico':/ambient|downtempo|soul|jazz|explor/i,
   mañana:/suave|soul|disco|funk|boogie/i,
   taller:/house|soul|funk|ritmo|electrónica/i,
   atardecer:/synth|indie|new wave|downtempo|disco/i
  };
  const filter=filters[mood]||filters.taller;
  const candidates=mixes.map((m,i)=>({m,i})).filter(x=>x.i!==selected&&filter.test(x.m.name+' '+x.m.short+' '+x.m.desc));
  if(!candidates.length)return false;
  const choice=candidates[Math.floor(Math.random()*candidates.length)];
  setMix(choice.i,false);
  return true;
 }
};
updateControls();updateNow();
if(window.matchMedia('(min-width:801px)').matches)open(true);
})();
