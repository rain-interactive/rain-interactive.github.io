/* Reproductor oficial SoundCloud: no aloja ni copia el audio. */
(()=>{'use strict';
const mixes=[
 {name:'Moxie · NTS 2026',short:'Moxie',desc:'Sesiones recientes de house y electrónica, desde su archivo de NTS 2026.',url:'https://soundcloud.com/djmoxie/sets/moxie-nts-radio-playlist-2026'},
 {name:'CORIN · archivo NTS',short:'CORIN',desc:'Electrónica experimental, síntesis y territorios sonoros extraños.',url:'https://soundcloud.com/corinmusic/sets/nts-radio-mixes'},
 {name:'GiGi FM · Prieste5s',short:'Ambient',desc:'Naturaleza y tecnología, texturas ambientales y psicodelia hipnótica.',url:'https://soundcloud.com/gigi-fm/nts-radio-gigi-fm-presents-prieste5s-03122025'},
 {name:'Fold · NTS Radio',short:'Garage',desc:'House, UK garage, breaks y techno en sesiones largas.',url:'https://soundcloud.com/foldmusic/sets/house-uk-garage-techno'},
 {name:'Well Street · NTS',short:'Well St.',desc:'Sesiones de NTS con Kincaid, Sam Fussell y más.',url:'https://soundcloud.com/wellstreet/sets/nts-radio'}
];
const dock=document.createElement('aside');
dock.id='luxRadioDock';dock.setAttribute('aria-label','Radio y mezclas de SoundCloud');
dock.innerHTML='<button id="luxRadioToggle" type="button" aria-expanded="false" aria-controls="luxRadioPanel"><span class="luxRadioNote" aria-hidden="true">♫</span><span class="luxRadioName">SOUNDCLOUD · NTS SELECTS</span><span class="luxRadioChevron" aria-hidden="true">⌄</span></button><section id="luxRadioPanel" aria-label="Sesiones de música"><div id="luxRadioIntro"><strong>La música de la casa</strong><p>Una selección de sesiones de NTS y mezclas experimentales. Dale a play dentro del reproductor.</p></div><nav id="luxRadioChoices" aria-label="Elegir sesión"></nav><div id="luxRadioActive" aria-live="polite"></div><iframe id="luxRadioFrame" title="SoundCloud: reproductor seleccionado" loading="lazy" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe><div id="luxRadioFooter"><a id="luxRadioOriginal" href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">Abrir en SoundCloud</a><a href="https://www.nts.live/" target="_blank" rel="noopener noreferrer">NTS en directo (sin anuncios)</a><div>La disponibilidad y posibles anuncios de SoundCloud dependen de la plataforma.</div></div></section>';
document.body.appendChild(dock);
const $=id=>document.getElementById(id);
const toggle=$('luxRadioToggle'),choices=$('luxRadioChoices'),frame=$('luxRadioFrame');
const memKey='casa-lux-soundcloud-choice-v1';
let selected=0,initialized=false;
try{const prev=Number(localStorage.getItem(memKey));if(Number.isInteger(prev)&&prev>=0&&prev<mixes.length)selected=prev}catch{}
function setMix(i){
 selected=i;
 const mix=mixes[i];
 $('luxRadioActive').replaceChildren();
 const title=document.createElement('strong');title.textContent=mix.name;
 const desc=document.createElement('small');desc.textContent=mix.desc;
 $('luxRadioActive').append(title,desc);
 $('luxRadioOriginal').href=mix.url;
 choices.querySelectorAll('button').forEach(b=>b.setAttribute('aria-pressed',String(Number(b.dataset.index)===i)));
 frame.src='https://w.soundcloud.com/player/?url='+encodeURIComponent(mix.url)+'&auto_play=false&color=%237dc6b5&show_artwork=true&show_comments=false&show_user=true&show_playcount=false&hide_related=true&visual=false&single_active=true';
 frame.title='SoundCloud · '+mix.name;
 initialized=true;
 try{localStorage.setItem(memKey,String(i))}catch{}
}
function open(value){
 dock.classList.toggle('open',value);
 toggle.setAttribute('aria-expanded',String(value));
 if(value&&!initialized)setMix(selected);
}
mixes.forEach((mix,i)=>{
 const button=document.createElement('button');
 button.type='button';button.dataset.index=String(i);button.textContent=mix.short;
 button.setAttribute('aria-pressed',String(i===selected));
 button.title=mix.desc;
 button.addEventListener('click',()=>setMix(i));
 choices.appendChild(button);
});
toggle.addEventListener('click',()=>open(!dock.classList.contains('open')));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&dock.classList.contains('open'))open(false)});
if(window.matchMedia('(min-width:801px)').matches)open(true);
})();
