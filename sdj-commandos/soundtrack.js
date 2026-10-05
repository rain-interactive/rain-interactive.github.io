(()=>{
let ctx,score,timer,enabled=false,origin=0,scheduled=0;
const active=new Set();
const button=document.createElement('button');
button.type='button';button.textContent='♫ Música: apagada';button.setAttribute('aria-pressed','false');
button.style.cssText='position:fixed;right:10px;top:10px;z-index:2147483647;width:auto;margin:0;padding:9px 12px;background:#111;color:#fff;border:1px solid #aaa;font:12px monospace;cursor:pointer';
document.body.append(button);
function stop(){clearInterval(timer);timer=null;for(const o of active){try{o.stop()}catch{}}active.clear()}
function note(n,type,gain,start){const [at,duration,p,velocity]=n;const time=start+at;if(time<ctx.currentTime-.02)return;
 const osc=ctx.createOscillator(),amp=ctx.createGain();osc.type=type;osc.frequency.value=440*2**((p-69)/12);
 const volume=gain*velocity/127; amp.gain.setValueAtTime(0,time);amp.gain.linearRampToValueAtTime(volume,time+.012);amp.gain.setValueAtTime(volume*.65,time+Math.max(.02,duration-.025));amp.gain.linearRampToValueAtTime(0,time+duration);
 osc.connect(amp);amp.connect(ctx.destination);active.add(osc);osc.onended=()=>{active.delete(osc);amp.disconnect();osc.disconnect()};osc.start(time);osc.stop(time+duration+.02)
}
function schedule(){if(!enabled||!score||document.hidden)return;const end=ctx.currentTime+.35;
 for(let loop=Math.max(0,Math.floor((scheduled-origin)/score.duration));origin+loop*score.duration<end;loop++){
  const start=origin+loop*score.duration;
  for(const [events,type,gain] of [[score.lead,'square',.055],[score.bass,'triangle',.11]])for(const n of events){const at=start+n[0];if(at>=scheduled&&at<end)note(n,type,gain,start)}
 }scheduled=end;
}
async function enable(){ctx ||= new(window.AudioContext||window.webkitAudioContext)();await ctx.resume();
 if(!score){const r=await fetch('/sdj-commandos/soundtrack-notes.json?v=20261005-04');if(!r.ok)throw Error('score');score=await r.json()}
 enabled=true;button.textContent='♫ Música: encendida';button.setAttribute('aria-pressed','true');origin=ctx.currentTime+.05;scheduled=origin;schedule();timer=setInterval(schedule,100)
}
function toggle(){if(enabled){enabled=false;stop();button.textContent='♫ Música: apagada';button.setAttribute('aria-pressed','false')}else enable().catch(()=>{enabled=false;stop();button.textContent='♫ Reintentar música'})}
button.addEventListener('click',toggle);
document.addEventListener('click',e=>{if(e.target.closest('button')?.textContent.trim()==='JUGAR AL JUEGO'&&!enabled)toggle()});
document.addEventListener('visibilitychange',()=>{if(!ctx)return;if(document.hidden){stop();ctx.suspend()}else if(enabled){ctx.resume().then(()=>{origin=ctx.currentTime+.05;scheduled=origin;schedule();timer=setInterval(schedule,100)})}});
window.addEventListener('pagehide',()=>{stop();ctx?.close()},{once:true});
})();