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
 {name:'NTS Guide To · colección',short:'Exploraciones',desc:'Sesiones de jazz, shoegaze, psicodelia brasileña, folk, vaporwave y otras rarezas.',url:'https://soundcloud.com/waitingfordog/sets/nts-guide-to'}
];
const dock=document.createElement('aside');
dock.id='luxRadioDock';dock.setAttribute('aria-label','Radio y mezclas de SoundCloud');
dock.innerHTML='<button id="luxRadioToggle" type="button" aria-expanded="false" aria-controls="luxRadioPanel"><span class="luxRadioNote" aria-hidden="true">♫</span><span class="luxRadioName">SOUNDCLOUD · RADIO DE LUX</span><span class="luxRadioChevron" aria-hidden="true">⌄</span></button><section id="luxRadioPanel" aria-label="Sesiones de música"><div id="luxRadioIntro"><strong>La música de la casa</strong><p>Soul, funk, house, bandas y alguna rareza: sesiones reales y variadas. Dale a play.</p></div><nav id="luxRadioChoices" aria-label="Elegir sesión"></nav><div id="luxRadioActive" aria-live="polite"></div><iframe id="luxRadioFrame" title="SoundCloud: reproductor seleccionado" loading="lazy" allow="autoplay; encrypted-media" referrerpolicy="strict-origin-when-cross-origin"></iframe><div id="luxRadioFooter"><a id="luxRadioOriginal" href="https://soundcloud.com" target="_blank" rel="noopener noreferrer">Abrir en SoundCloud</a><a href="https://www.nts.live/" target="_blank" rel="noopener noreferrer">NTS en directo (sin anuncios)</a><div>La reproducción y los anuncios dependen de SoundCloud, no de la casa.</div></div></section>';
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
