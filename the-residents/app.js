(function residentsApp(){
'use strict';
const {works,sources,checked}=window.RESIDENTS_ARCHIVE;
const index=document.getElementById('work-index');
const article=document.getElementById('work');
const dialog=document.getElementById('sources-dialog');
const sourceMap=new Map(sources.map((s,i)=>[s.id,{...s,number:i+1}]));
const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let filter='all';
let selected=works.find(w=>w.id===location.hash.slice(1))?.id||'eskimo';
const refs=ids=>ids.map(id=>{const s=sourceMap.get(id);return `<a class="ref" href="#source-${esc(id)}" data-source="${esc(id)}" aria-label="Ver fuente ${s.number}: ${esc(s.title)}">[${s.number}]</a>`;}).join('');
const sourceItem=(s,prefix='source')=>`<li id="${prefix}-${esc(s.id)}"><span class="source-num">${String(s.number).padStart(2,'0')}</span><div class="source-body"><a href="${esc(s.url)}" target="_blank" rel="noopener noreferrer">${esc(s.title)} ↗</a><small>${esc(s.publisher)} · ${esc(s.kind)}</small><p>${esc(s.note)}</p></div></li>`;
function renderIndex(){
index.innerHTML=works.filter(w=>filter==='all'||w.category.includes(filter)).map(w=>`<a class="work-link" href="#${w.id}" data-work="${w.id}" ${w.id===selected?'aria-current="true"':''}><span class="number">${String(works.indexOf(w)+1).padStart(2,'0')}</span><span><span class="name">${esc(w.title)}</span><span class="year">${esc(w.year)}</span></span></a>`).join('');
document.querySelectorAll('[data-filter]').forEach(b=>{const active=b.dataset.filter===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});
}
function renderWork(){
const w=works.find(x=>x.id===selected);
const used=[...new Set([...w.summary.refs,...w.facts.flatMap(f=>f.refs)])].map(id=>sourceMap.get(id)).sort((a,b)=>a.number-b.number);
article.innerHTML=`<div class="work-hero"><figure class="work-figure"><img src="${esc(w.image)}" alt="${esc(w.imageAlt)}" decoding="async" referrerpolicy="no-referrer"><div class="image-fallback" hidden><span>${esc(w.title)}</span><a href="${esc(w.imageSource)}" target="_blank" rel="noopener noreferrer">Ver imagen en origen ↗</a></div><figcaption>${esc(w.credit)} <a href="${esc(w.imageSource)}" target="_blank" rel="noopener noreferrer">Procedencia ↗</a></figcaption></figure><div class="work-text"><div class="work-meta"><span class="work-date">${esc(w.year)}</span><span class="work-kind">${esc(w.type)}</span></div><h2 id="work-title">${esc(w.title)}</h2><p class="work-strap">${esc(w.strap)}</p><p class="work-summary">${esc(w.summary.text)} ${refs(w.summary.refs)}</p><div class="work-actions">${w.actions.map(a=>`<a href="${esc(a.url)}" target="_blank" rel="noopener noreferrer">${esc(a.label)} ↗</a>`).join('')}</div></div></div><section class="facts" aria-label="Hechos documentados"><p class="section-label">Lo documentado</p>${w.facts.map(f=>`<div class="fact"><h3>${esc(f.title)}</h3><p>${esc(f.text)} ${refs(f.refs)}</p></div>`).join('')}</section><aside class="reading" aria-label="Interpretación editorial de Rain"><p class="section-label">Lectura de Rain / interpretación</p><p>${esc(w.reading)}</p></aside><nav class="related" aria-label="Conexiones con otras obras"><p class="section-label">Sigue el hilo</p><div class="related-links">${w.related.map(id=>`<button data-work="${id}">${esc(works.find(x=>x.id===id).title)} <span aria-hidden="true">→</span></button>`).join('')}</div></nav><details class="work-sources"><summary>Fuentes de esta ficha <span>${used.length} referencias</span></summary><ol class="source-list">${used.map(s=>sourceItem(s)).join('')}</ol></details>`;
const img=article.querySelector('.work-figure img');
img.addEventListener('error',()=>{img.hidden=true;article.querySelector('.image-fallback').hidden=false;});
document.title=`${w.title} — The Residents · Rain Interactive`;
}
function select(id,{push=true,scroll=false}={}){
if(!works.some(w=>w.id===id))return;
selected=id;
if(filter!=='all'&&!works.find(w=>w.id===id).category.includes(filter))filter='all';
if(push&&location.hash!==`#${id}`)history.pushState({work:id},'',`#${id}`);
renderIndex();renderWork();
if(scroll){article.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});article.focus({preventScroll:true});}
}
document.addEventListener('click',event=>{
const workButton=event.target.closest('[data-work]');
if(workButton){event.preventDefault();select(workButton.dataset.work,{scroll:workButton.tagName==='BUTTON'});return;}
const sourceButton=event.target.closest('[data-source]');
if(sourceButton){event.preventDefault();article.querySelector('.work-sources').open=true;document.getElementById(`source-${sourceButton.dataset.source}`).scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});}
});
document.querySelectorAll('[data-filter]').forEach(b=>b.addEventListener('click',()=>{
filter=b.dataset.filter;
const matches=works.filter(w=>filter==='all'||w.category.includes(filter));
select(matches.some(w=>w.id===selected)?selected:matches[0].id);
}));
window.addEventListener('popstate',()=>select(works.find(w=>w.id===location.hash.slice(1))?.id||'eskimo',{push:false}));
document.getElementById('all-sources').innerHTML=sources.map(s=>sourceItem(sourceMap.get(s.id),'bibliography')).join('');
document.getElementById('checked-date').textContent=checked;
document.getElementById('image-credits').innerHTML=works.map(w=>`<li><a href="${esc(w.imageSource)}" target="_blank" rel="noopener noreferrer">${esc(w.title)}</a> — ${esc(w.credit)}</li>`).join('');
const openSources=()=>dialog.showModal();
document.getElementById('sources-open').addEventListener('click',openSources);
document.getElementById('method-open').addEventListener('click',openSources);
document.getElementById('sources-close').addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
let audioContext,audioGain,enabled=false;
const soundButton=document.getElementById('sound-toggle');
function createAtmosphere(){
const Context=window.AudioContext||window.webkitAudioContext;
if(!Context)throw new Error('Audio no disponible');
audioContext=new Context();audioGain=audioContext.createGain();audioGain.gain.value=0;audioGain.connect(audioContext.destination);
[55,82.41].forEach((frequency,i)=>{const o=audioContext.createOscillator(),gain=audioContext.createGain();o.type='sine';o.frequency.value=frequency;gain.gain.value=i?.15:.2;o.connect(gain).connect(audioGain);o.start();});
const buffer=audioContext.createBuffer(1,audioContext.sampleRate*4,audioContext.sampleRate),samples=buffer.getChannelData(0);
for(let i=0;i<samples.length;i++)samples[i]=(Math.random()*2-1)*.09;
const noise=audioContext.createBufferSource();noise.buffer=buffer;noise.loop=true;
const lowpass=audioContext.createBiquadFilter();lowpass.type='lowpass';lowpass.frequency.value=340;
noise.connect(lowpass).connect(audioGain);noise.start();
}
function setSound(value){
enabled=value;soundButton.setAttribute('aria-pressed',String(value));soundButton.textContent=`Sonido: ${value?'sí':'no'}`;
if(audioContext)audioGain.gain.setTargetAtTime(value ? .16 : 0,audioContext.currentTime,.25);
}
soundButton.addEventListener('click',async()=>{soundButton.disabled=true;try{if(!audioContext)createAtmosphere();await audioContext.resume();setSound(!enabled);}catch{soundButton.textContent='Audio no disponible';}finally{soundButton.disabled=false;}});
document.addEventListener('visibilitychange',()=>{if(document.hidden)setSound(false);});
window.addEventListener('pagehide',()=>setSound(false));
renderIndex();renderWork();
})();
