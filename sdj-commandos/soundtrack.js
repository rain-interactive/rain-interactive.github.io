(()=>{
const audio=new Audio('/sdj-commandos/soundtrack-poker-face.mp3?v=20261005-07');
audio.loop=true;audio.volume=.45;audio.preload='none';
let wanted=false,duckTimer,videoOpen=false;
document.addEventListener('commandos-victory-video',e=>{videoOpen=!!e.detail?.open;if(videoOpen)audio.pause();else if(wanted)audio.play().catch(()=>{})});
document.addEventListener('commandos-level-cry',e=>{clearTimeout(duckTimer);audio.volume=.12;duckTimer=setTimeout(()=>{audio.volume=.45},Math.max(0,e.detail?.duration||1.25)*1000+100)});
const button=document.createElement('button');
button.id='soundtrack-toggle';button.type='button';button.textContent='♫ Música: apagada';button.setAttribute('aria-pressed','false');
button.style.cssText='position:fixed;right:10px;top:10px;z-index:2147483647;width:auto;margin:0;padding:9px 12px;background:#111;color:#fff;border:1px solid #aaa;font:12px monospace;cursor:pointer';
(document.querySelector('#screen')||document.body).append(button);
function mark(){button.textContent=wanted?'♫ Música: encendida':'♫ Música: apagada';button.setAttribute('aria-pressed',String(wanted))}
function start(){if(videoOpen)return;wanted=true;mark();audio.play().catch(()=>{wanted=false;mark();button.textContent='♫ Reintentar música'})}
button.addEventListener('click',()=>{if(wanted){wanted=false;audio.pause();mark()}else start()});
document.addEventListener('click',e=>{if(e.target.closest('button')?.textContent.trim()==='JUGAR AL JUEGO'&&!wanted)start()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)audio.pause();else if(wanted)start()});
window.addEventListener('pagehide',()=>audio.pause());
})();