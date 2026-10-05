(()=>{
const TRACK='/sdj-commandos/soundtrack-poker-face.mp3?v=20261005-07';
// Audible bounds measured from the current track; omit the silent intro/outro.
const LOOP_START=2.03,LOOP_END=236.68;
let context,gain,buffer,loading,source,offset=0,startedAt=0;
let wanted=false,duckTimer,videoOpen=false,playRequest=0;
function prepare(){
  if(!context){
    context=new (window.AudioContext||window.webkitAudioContext)();
    gain=context.createGain();gain.gain.value=.45;gain.connect(context.destination);
  }
  if(!loading)loading=fetch(TRACK).then(r=>{if(!r.ok)throw new Error('Music unavailable');return r.arrayBuffer()})
    .then(data=>context.decodeAudioData(data)).then(decoded=>{
      const first=Math.round(LOOP_START*decoded.sampleRate);
      const last=Math.min(decoded.length,Math.round(LOOP_END*decoded.sampleRate));
      buffer=context.createBuffer(decoded.numberOfChannels,last-first,decoded.sampleRate);
      for(let channel=0;channel<decoded.numberOfChannels;channel++)
        buffer.copyToChannel(decoded.getChannelData(channel).subarray(first,last),channel);
      return buffer;
    }).catch(error=>{loading=null;throw error});
  return loading;
}
function pause(){
  playRequest++;
  if(source){
    offset=(offset+context.currentTime-startedAt)%buffer.duration;
    source.stop();source.disconnect();source=null;
  }
}
async function play(){
  if(videoOpen||document.hidden||source)return;
  const request=++playRequest;
  try{
    const ready=prepare();
    // Resume during the user's tap, before waiting for download/decode on mobile.
    await context.resume();await ready;
    if(request!==playRequest||!wanted||videoOpen||document.hidden||source)return;
    source=context.createBufferSource();source.buffer=buffer;source.loop=true;
    source.connect(gain);startedAt=context.currentTime;source.start(0,offset);
  }catch{
    if(request!==playRequest)return;
    wanted=false;mark();button.textContent='♫ Reintentar música';
  }
}
document.addEventListener('commandos-victory-video',e=>{
  videoOpen=!!e.detail?.open;if(videoOpen)pause();else if(wanted)play();
});
document.addEventListener('commandos-level-cry',e=>{
  clearTimeout(duckTimer);if(gain)gain.gain.value=.12;
  duckTimer=setTimeout(()=>{if(gain)gain.gain.value=.45},Math.max(0,e.detail?.duration||1.25)*1000+100);
});
const button=document.createElement('button');
button.id='soundtrack-toggle';button.type='button';button.textContent='♫ Música: apagada';button.setAttribute('aria-pressed','false');
button.style.cssText='position:fixed;right:10px;top:10px;z-index:2147483647;width:auto;margin:0;padding:9px 12px;background:#111;color:#fff;border:1px solid #aaa;font:12px monospace;cursor:pointer';
(document.querySelector('#screen')||document.body).append(button);
function mark(){button.textContent=wanted?'♫ Música: encendida':'♫ Música: apagada';button.setAttribute('aria-pressed',String(wanted))}
function start(){if(videoOpen)return;wanted=true;mark();play()}
button.addEventListener('click',()=>{if(wanted){wanted=false;pause();mark()}else start()});
document.addEventListener('click',e=>{if(e.target.closest('#commandos-cover-start button')&&!wanted)start()},true);
document.addEventListener('visibilitychange',()=>{if(document.hidden)pause();else if(wanted)play()});
window.addEventListener('pagehide',()=>pause());
})();