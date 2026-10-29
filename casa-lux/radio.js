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
];

/* Sonido continuo: empieza tras pulsar Play y después enlaza sesiones en orden aleatorio. */
const dock=document.createElement('aside');
dock.id='luxRadioDock';dock.setAttribute('aria-label','Radio Lu Roth · SoundCloud NTS Radio');
dock.innerHTML='<button id="luxRadioToggle" type="button" aria-expanded="false" aria-controls="luxRadioPanel"><span class="luxRadioNote" aria-hidden="true">♫</span><span class="luxRadioName">RADIO LU ROTH</span><span class="luxRadioChevron" aria-hidden="true">⌄</span></button><div id="luxRadioNow" role="status" aria-live="polite"></div><section id="luxRadioPanel" aria-label="Sesiones de música"><div id="luxRadioIntro"><strong>La música de la casa</strong><p>NTS Radio: soul, funk, disco, house, rock y descubrimientos. Reproducción continua, con orden aleatorio.</p></div><nav id="luxRadioChoices" aria-label="Elegir sesión"></nav><div id="luxRadioActive" aria-live="polite"></div><iframe id="luxRadioFrame" title="SoundCloud: reproductor seleccionado" loading="lazy" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe><div class="luxRadioFlow" role="group" aria-label="Opciones de reproducción"><button id="luxRadioLoop" type="button" aria-pressed="true">↻ Bucle: sí</button><button id="luxRadioRandom" type="button" aria-pressed="true">⤨ Aleatorio: sí</button><button id="luxRadioNext" type="button">⏭ Siguiente</button></div><p id="luxRadioHint" aria-live="polite">El primer play se hace dentro de SoundCloud. Después se cambian automáticamente las sesiones.</p><div id="luxRadioFooter"><a id="luxRadioOriginal" href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">Abrir en SoundCloud</a><a href="https://www.nts.live/" target="_blank" rel="noopener noreferrer">Escuchar NTS en directo</a><div>Las pistas disponibles y el permiso de reproducción automática dependen de SoundCloud y del navegador.</div></div></section>';
document.body.appendChild(dock);

// Invitada especial: sesión verificada en HÖR, fuera de SoundCloud.
const pegorerFeature=document.createElement('div');
pegorerFeature.id='luxRadioPegorer';
const pegorerLink=document.createElement('a');
pegorerLink.href='https://hoer.live/roberta-deflorio-b2b-valentina-pegorer-hor-march-17-2025/';
pegorerLink.target='_blank';pegorerLink.rel='noopener noreferrer';
pegorerLink.textContent='★ VALENTINA PEGORER · sesión HÖR ↗';
const pegorerCaption=document.createElement('small');
pegorerCaption.textContent='Con Roberta Deflorio · EBM, darkwave, synth-pop e indie dance. Se abre en HÖR.';
pegorerFeature.append(pegorerLink,pegorerCaption);
dock.querySelector('#luxRadioIntro').after(pegorerFeature);

const $=id=>document.getElementById(id);
const toggle=$('luxRadioToggle'),choices=$('luxRadioChoices'),frame=$('luxRadioFrame');
const memKey='casa-lux-soundcloud-choice-v1',settingsKey='casa-lux-radio-flujo-v1';
let selected=0,initialized=false,widget=null,widgetReady=false,transitioning=false;
let lastTrackIndex=0,trackCount=1,shuffleBag=[];
let flow={loop:true,random:true},hasPlayed=false,isPlaying=false;
try {
 const prev=Number(localStorage.getItem(memKey));
 if(Number.isInteger(prev)&&prev>=0&&prev<mixes.length)selected=prev;
 const saved=JSON.parse(localStorage.getItem(settingsKey)||'null');
 if(saved && typeof saved.loop==='boolean' && typeof saved.random==='boolean')flow=saved;
} catch {}
function save(){try{localStorage.setItem(memKey,String(selected));localStorage.setItem(settingsKey,JSON.stringify(flow))}catch{}}
function updateNow(){const mix=mixes[selected];if(!mix)return;$('luxRadioNow').textContent=(isPlaying?'♫ Sonando · ':hasPlayed?'Pausada · ':'Playlist · ')+mix.name;}
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
       callback:()=>{if(play)widget.play()}})}
  catch{frame.src=mixURL(mix,play)}
 }else frame.src=mixURL(mix,play);
 frame.title='SoundCloud · '+mix.name;
 $('luxRadioHint').textContent=play?'Siguiente sesión: '+mix.name:'Pulsa Play en SoundCloud para iniciar la radio.';
}
function goNext(){
 if(transitioning)return;
 transitioning=true;
 const next=pickNext();
 setMix(next,true);
 // No volvemos a la misma selección hasta recorrer las restantes (con modo aleatorio).
}
function setupWidget(){
 if(widget||!window.SC||typeof window.SC.Widget!=='function')return;
 try{
  const api=window.SC.Widget;widget=api(frame);
  widget.bind(api.Events.READY,()=>{
   widgetReady=true;
   widget.getSounds(sounds=>{if(Array.isArray(sounds))trackCount=Math.max(1,sounds.length)});
  });
  widget.bind(api.Events.PLAY,()=>{
   hasPlayed=true;isPlaying=true;widgetReady=true;transitioning=false;updateNow();
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
$('luxRadioNext').addEventListener('click',()=>{open(true);goNext()});
toggle.addEventListener('click',()=>open(!dock.classList.contains('open')));
document.addEventListener('keydown',e=>{
 if(e.key==='Escape'&&dock.classList.contains('open'))open(false);
});
updateControls();updateNow();
if(window.matchMedia('(min-width:801px)').matches)open(true);
})();
