/* Casa de Lux · Windfinder A Coruña compacto, junto a mareas y luna.
  La fuente completa se abre únicamente cuando el usuario lo pide. */
(()=>{'use strict';
const source='https://www.windfinder.com/widget/forecast/a_coruna_galicia_spain?days=1&columns=2&unit_wind=kmh&unit_temperature=c&unit_wave=m&unit_rain=mm&show_wind=1&show_temperature=1&show_waves=1&show_rain=1&show_clouds=1&show_pressure=0&show_day=0&version=1';
const full='https://es.windfinder.com/forecast/a_coruna_galicia_spain';
const bar=document.getElementById('liveStrip'),mobile=document.getElementById('mobileBar'),stage=document.getElementById('stage');
if(!bar||!mobile||!stage)return;
const card=document.createElement('div');card.id='wfForecast';card.className='metric';
card.setAttribute('aria-label','Windfinder A Coruña · viento, oleaje y tiempo');
card.innerHTML='<div class="kicker">≈ WINDFINDER · A CORUÑA</div><div class="value">Viento y olas</div><div class="detail">Previsión · A Coruña</div><button type="button" id="wfOpen" aria-controls="wfDetails" aria-expanded="false">Consultar previsión <span aria-hidden="true">⌃</span></button>';
const details=document.createElement('section');details.id='wfDetails';details.hidden=true;
details.setAttribute('role','region');details.setAttribute('aria-label','Previsión detallada Windfinder');
const header=document.createElement('div');header.id='wfHeader';
const name=document.createElement('strong');name.textContent='WINDFINDER · A CORUÑA';
const link=document.createElement('a');link.href=full;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Pronóstico completo';
const close=document.createElement('button');close.type='button';close.id='wfClose';close.textContent='Cerrar ×';close.setAttribute('aria-label','Cerrar previsión de Windfinder');
header.append(name,link,close);
const frame=document.createElement('iframe');frame.title='Windfinder A Coruña · previsión de viento, olas y tiempo';
frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';frame.setAttribute('allow','fullscreen');
const footer=document.createElement('div');footer.id='wfFooter';footer.textContent='Fuente: Windfinder · previsión, no lectura instrumental en directo. km/h · m · °C.';
details.append(header,frame,footer);stage.appendChild(details);
function show(open){
 details.hidden=!open;
 card.querySelector('#wfOpen').setAttribute('aria-expanded',String(open));
 if(open&&!frame.getAttribute('src'))frame.src=source;
}
card.querySelector('#wfOpen').addEventListener('click',()=>show(details.hidden));
close.addEventListener('click',()=>show(false));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!details.hidden)show(false)});
const legacy=document.getElementById('temp')?.closest('.metric');
if(legacy)legacy.classList.add('luxWeatherLegacy');
const mobileLegacy=document.getElementById('mWeather')?.closest('.mobcell');
if(mobileLegacy)mobileLegacy.classList.add('luxWeatherLegacy');
function mount(){
 const isMobile=window.matchMedia('(max-width:720px)').matches;
 const destination=isMobile?mobile:bar;
 if(card.parentNode===destination)return;
 if(isMobile){
  const grid=mobile.querySelector('.mobgrid');
  if(grid)grid.prepend(card);else mobile.append(card);
 }else{
  if(legacy&&legacy.parentElement===bar)bar.insertBefore(card,legacy);
  else bar.insertBefore(card,bar.children[1]||null);
 }
 if(!details.hidden)show(false);
}
mount();
const mq=window.matchMedia('(max-width:720px)');
if(mq.addEventListener)mq.addEventListener('change',mount);
const panel=document.getElementById('panel');
if(panel&&!panel.querySelector('#wfInfoLine')){
 const p=document.createElement('p');p.id='wfInfoLine';
 p.textContent='Windfinder ofrece el pronóstico de viento, olas y temperatura de A Coruña. Se abre bajo demanda desde el panel inferior; sin cifras inventadas.';
 const a=document.createElement('a');a.href=full;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Abrir Windfinder';
 p.append(' · ',a);panel.append(p);
}
})();