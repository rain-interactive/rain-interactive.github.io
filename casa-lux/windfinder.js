/* Casa de Lux · pronóstico oficial Windfinder A Coruña.
   Una sola incrustación. El contenido es del proveedor: no se extraen cifras
   ni se finge que el pronóstico sea una medición en directo. */
(()=>{'use strict';
const source='https://www.windfinder.com/widget/forecast/a_coruna_galicia_spain?days=1&columns=2&unit_wind=kmh&unit_temperature=c&unit_wave=m&unit_rain=mm&show_wind=1&show_temperature=1&show_waves=1&show_rain=1&show_clouds=1&show_pressure=0&show_day=0&version=1';
const full='https://es.windfinder.com/forecast/a_coruna_galicia_spain';
const bar=document.getElementById('liveStrip'),mobile=document.getElementById('mobileBar');
if(!bar||!mobile)return;
const card=document.createElement('section');card.id='wfForecast';
card.setAttribute('aria-label','Windfinder A Coruña · previsión oficial de viento, olas y tiempo');
const header=document.createElement('div');header.id='wfHeader';
const name=document.createElement('strong');name.textContent='WINDFINDER · A CORUÑA';
const link=document.createElement('a');link.href=full;link.target='_blank';link.rel='noopener noreferrer';link.textContent='Ver pronóstico completo';
header.append(name,link);
const frame=document.createElement('iframe');frame.title='Pronóstico Windfinder A Coruña: viento, ráfagas, oleaje, periodo y temperatura';
frame.src=source;frame.loading='lazy';frame.referrerPolicy='strict-origin-when-cross-origin';
frame.setAttribute('allow','fullscreen');
const footer=document.createElement('div');footer.id='wfFooter';footer.textContent='Pronóstico meteorológico de Windfinder, no medición en directo · unidades km/h, m y °C';
card.append(header,frame,footer);
const legacy=document.getElementById('temp')?.closest('.metric');
if(legacy)legacy.classList.add('luxWeatherLegacy');
const mobileLegacy=document.getElementById('mWeather')?.closest('.mobcell');
if(mobileLegacy)mobileLegacy.classList.add('luxWeatherLegacy');
function mount(){
 const destination=window.matchMedia('(max-width:720px)').matches?mobile:bar;
 if(card.parentNode!==destination){
  if(destination===bar)bar.insertBefore(card,bar.firstChild);
  else destination.insertBefore(card,destination.querySelector('.mobgrid')||destination.firstChild);
 }
}
mount();window.matchMedia('(max-width:720px)').addEventListener('change',mount);
const panel=document.getElementById('panel');
if(panel){
 const p=document.createElement('p');
 p.textContent='Viento, rachas, altura y período del oleaje: previsión mostrada en el widget oficial de Windfinder A Coruña. El pronóstico no sustituye a una lectura instrumental.';
 const a=document.createElement('a');a.href=full;a.target='_blank';a.rel='noopener noreferrer';a.textContent='Abrir Windfinder A Coruña';
 p.append(' · ',a);
 const label=panel.querySelector('label');
 if(label)panel.insertBefore(p,label);
}
})();
