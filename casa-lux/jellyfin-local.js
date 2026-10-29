(function luPrivateJellyfin(){
'use strict';
/*
 * Rain Media connector: entirely client-side, opt-in, keeps login & token
 * in JS memory for this tab only. No analytics, no public metadata exports.
 */
const shelf=document.getElementById('luMusicShelf'),host=document.getElementById('luxRadioDock');
if(!shelf||!host)return;
const base='https://desktop-0qpstrv.tailae0643.ts.net';
const localKey='rain-private-jellyfin'; // not used for credentials
const clean=s=>String(s||'').slice(0,240);
const elements={};
let token='',userId='',items={audio:[],videos:[],films:[]},counts={audio:0,videos:0,films:0};
let connected=false,auto=false,current=null,failures=0,remembered=[],visualTone='neutro',lastMood='';
const ui=document.createElement('section');
ui.id='luPrivateMedia';
ui.innerHTML=`
 <button type="button" id="luMediaConnect" aria-expanded="false" aria-controls="luMediaBody">Archivo privado · Conectar</button>
 <div id="luMediaBody" hidden>
  <p id="luMediaInfo">Conexión directa y privada con Rain Media. Solo funciona con acceso a Jellyfin desde este dispositivo.</p>
  <form id="luMediaLogin" autocomplete="off">
   <label>Usuario de Jellyfin<input id="luMediaUser" autocomplete="username" required maxlength="120"></label>
   <label>Contraseña<input id="luMediaPassword" type="password" autocomplete="current-password" required></label>
   <button type="submit">Entrar y leer catálogo</button>
  </form>
  <div id="luMediaLibrary" hidden>
   <div id="luMediaCounts" role="status"></div>
   <div id="luMediaSuggestion"></div>
   <div class="luMediaActions">
    <button type="button" id="luMediaSurprise">Otra selección</button>
    <button type="button" id="luMediaPlay">Escuchar canción</button>
    <button type="button" id="luMediaAuto" aria-pressed="false">Continuidad: OFF</button>
    <button type="button" id="luMediaDisconnect">Desconectar</button>
   </div>
   <audio id="luMediaAudio" controls preload="none" referrerpolicy="no-referrer"></audio>
   <p class="luMediaPrivate">El catálogo y la sesión permanecen en este navegador. Si una pista no se reproduce aquí, puedes abrir Jellyfin.</p>
  </div>
  <a id="luMediaOpen" href="https://desktop-0qpstrv.tailae0643.ts.net/web/" target="_blank" rel="noopener noreferrer">Abrir Jellyfin</a>
 </div>`;
shelf.appendChild(ui);
for(const x of ['luMediaConnect','luMediaBody','luMediaInfo','luMediaLogin','luMediaUser','luMediaPassword','luMediaLibrary','luMediaCounts','luMediaSuggestion','luMediaSurprise','luMediaPlay','luMediaAuto','luMediaDisconnect','luMediaAudio','luMediaOpen'])elements[x]=ui.querySelector('#'+x);
const e=id=>elements[id];
const notice=t=>{e('luMediaInfo').textContent=t};
function switchOpen(open){
 const state=Boolean(open);
 e('luMediaBody').hidden=!state;
 e('luMediaConnect').setAttribute('aria-expanded',String(state));
 if(state){
  document.getElementById('luxRadioDock')?.classList.add('open');
  document.getElementById('luxRadioToggle')?.setAttribute('aria-expanded','true');
 }
}
e('luMediaConnect').addEventListener('click',()=>switchOpen(e('luMediaBody').hidden));
const headers=(secret,mediaType)=>({
 'Authorization':'MediaBrowser Client="Casa Lu Roth", Device="Browser", DeviceId="rain-lu-roth-session", Version="2.0"'+(secret?', Token="'+secret+'"':''),
 ...(mediaType?{'Content-Type':'application/json'}:{})
});
function resource(path,secret,init={}){
 return fetch(base+path,{
  ...init,mode:'cors',credentials:'omit',cache:'no-store',
  headers:{...headers(secret,Boolean(init.body)),...(init.headers||{})}
 }).then(async r=>{
  if(!r.ok)throw Error('Jellyfin HTTP '+r.status);
  return r.json();
 });
}
async function fetchItems(view,types,limit=650){
 let start=0,total=0,list=[];
 const parent=view?.Id||'';
 const batch=160;
 for(let n=0;n<Math.ceil(limit/batch);n++){
  const q=new URLSearchParams({
   Recursive:'true',IncludeItemTypes:types,StartIndex:String(start),Limit:String(Math.min(batch,limit-start)),
   Fields:'Genres,Overview,AlbumArtist',SortBy:'SortName',SortOrder:'Ascending'
  });
  if(parent)q.set('ParentId',parent);
  const data=await resource('/Users/'+encodeURIComponent(userId)+'/Items?'+q.toString(),token);
  const next=Array.isArray(data.Items)?data.Items:[];
  total=Number(data.TotalRecordCount)||total||next.length;
  list.push(...next.filter(x=>typeof x.Id==='string'||typeof x.Id==='number').map(x=>({
   id:String(x.Id),name:clean(x.Name),type:clean(x.Type),album:clean(x.Album),
   artist:clean(x.AlbumArtist||x.Artists?.join(', ')),genres:Array.isArray(x.Genres)?x.Genres.slice(0,5).map(clean):[],
   year:Number(x.ProductionYear)||0
  })));
  start+=next.length;
  if(!next.length||list.length>=total||start>=limit)break;
 }
 return {items:list,total};
}
async function readLibrary(){
 notice('Leyendo títulos de las bibliotecas autorizadas…');
 let views=[];
 try{
  const data=await resource('/Users/'+encodeURIComponent(userId)+'/Views',token);
  views=Array.isArray(data.Items)?data.Items:[];
 }catch{}
 const findView=names=>views.find(x=>names.includes(String(x.CollectionType||'').toLowerCase()))||null;
 const viewMusic=findView(['music']),viewVideo=findView(['musicvideos','homevideos','videos']),viewFilms=findView(['movies']);
 // No carga ni almacena medios binarios: únicamente metadatos dentro de esta pestaña.
 const fetched=await Promise.allSettled([
  fetchItems(viewMusic,'Audio',1000),fetchItems(viewVideo,'MusicVideo,Video',500),
  fetchItems(viewFilms,'Movie',400)
 ]);
 const keys=['audio','videos','films'];
 for(let i=0;i<keys.length;i++){
  const item=fetched[i];
  if(item.status==='fulfilled'){
   items[keys[i]]=item.value.items;counts[keys[i]]=item.value.total;
  }
 }
 if(keys.every(k=>!items[k].length))throw Error('Jellyfin no ha devuelto títulos de esta cuenta.');
 e('luMediaCounts').textContent=
  'Música: '+counts.audio+' · Vídeos: '+counts.videos+' · Películas: '+counts.films+
  (counts.audio>items.audio.length?' · Canciones consultadas: '+items.audio.length:'');
 e('luMediaLibrary').hidden=false;
 e('luMediaLogin').hidden=true;
 notice('Biblioteca conectada. La memoria musical vive únicamente en esta pestaña.');
 suggest();
}
function rank(x,mood){
 const words=(x.name+' '+x.album+' '+x.artist+' '+x.genres.join(' ')).toLowerCase();
 let n=1;
 if(/nocturna|insomnio|lluvia/.test(mood))n+=/ambient|dub|industrial|electron|drone|experimental|post.punk|idm|trip.hop|aphex|actress/i.test(words)?3:0;
 else if(/mañana|taller|atardecer/.test(mood))n+=/soul|funk|jazz|groove|reggae|house|disco|dance|bossa/i.test(words)?2.5:0;
 if(visualTone==='oscuro')n+=/ambient|metal|industrial|dark|drone|post.punk/i.test(words)?2:0;
 if(visualTone==='luminoso')n+=/soul|funk|disco|house|pop|reggae/i.test(words)?2:0;
 if(remembered.includes(x.id))n*=.06;
 return Math.max(.02,n);
}
function weighted(list,mood){
 let total=0;const rated=list.map(x=>({x,w:rank(x,mood)}));
 for(const x of rated)total+=x.w;
 let r=Math.random()*total;
 for(const t of rated){r-=t.w;if(r<=0)return t.x}
 return rated.at(-1)?.x||null;
}
function suggest(mood){
 if(!connected)return;
 lastMood=mood||lastMood||'contemplar';
 const songs=items.audio;
 const videos=items.videos;
 const films=items.films;
 const group=songs.length?songs:videos.length?videos:films;
 if(!group.length)return;
 current=weighted(group,lastMood);
 e('luMediaSuggestion').textContent=current?
   'Lu propone · '+current.name:'Sin títulos disponibles';
 e('luMediaPlay').textContent=songs.length?'Escuchar canción':'Abrir en Jellyfin';
 if(current){
  const details=base+'/web/#/details?id='+encodeURIComponent(current.id);
  e('luMediaOpen').href=details;
  e('luMediaOpen').textContent='Ver en Jellyfin · '+current.name;
 }
}
function selectAndPlay(){
 if(!connected||!current)return;
 const item=current;
 if(item.type!=='Audio'){
  // Una web estática no debe copiar ni redistribuir películas del servidor.
  window.open(e('luMediaOpen').href,'_blank','noopener,noreferrer');return;
 }
 const audio=e('luMediaAudio');
 // Token nunca va a GitHub ni a la URL de la página. El stream autenticado
 // de Jellyfin usa un enlace efímero solo dentro del reproductor de esta pestaña.
 const url=base+'/Audio/'+encodeURIComponent(item.id)+'/stream?static=true&api_key='+encodeURIComponent(token);
 audio.pause();audio.src=url;audio.load();
 window.__luRadio?.stopAutonomy?.();
 remembered.push(item.id);remembered=remembered.slice(-20);
 audio.play().catch(()=>notice('Pulsa ▶ en el reproductor o abre esta pista en Jellyfin.'));
}
function disconnect(){
 const audio=e('luMediaAudio');
 audio.pause();audio.removeAttribute('src');audio.load();
 token='';userId='';connected=false;auto=false;current=null;remembered=[];
 items={audio:[],videos:[],films:[]};counts={audio:0,videos:0,films:0};
 e('luMediaLibrary').hidden=true;e('luMediaLogin').hidden=false;
 e('luMediaPassword').value='';
 e('luMediaAuto').textContent='Continuidad: OFF';e('luMediaAuto').setAttribute('aria-pressed','false');
 e('luMediaOpen').href=base+'/web/';e('luMediaOpen').textContent='Abrir Jellyfin';
 notice('Biblioteca desconectada. No se ha guardado la sesión.');
}
e('luMediaLogin').addEventListener('submit',async ev=>{
 ev.preventDefault();
 const username=e('luMediaUser').value.trim(),pw=e('luMediaPassword').value;
 if(!username||!pw)return;
 e('luMediaLogin').querySelector('button').disabled=true;
 try{
  const response=await resource('/Users/AuthenticateByName','',{method:'POST',body:JSON.stringify({Username:username,Pw:pw})});
  const fresh=response.AccessToken,uid=response.User?.Id;
  if(!fresh||!uid)throw Error('No se ha recibido una sesión válida.');
  token=String(fresh);userId=String(uid);connected=true;
  e('luMediaPassword').value='';
  await readLibrary();
 }catch(error){
  disconnect();
  notice('No se pudo leer Jellyfin: '+clean(error.message)+'. Si es un bloqueo CORS del navegador, ábrelo en su aplicación oficial.');
 }finally{e('luMediaLogin').querySelector('button').disabled=false}
});
e('luMediaSurprise').addEventListener('click',()=>suggest(lastMood));
e('luMediaPlay').addEventListener('click',selectAndPlay);
e('luMediaAuto').addEventListener('click',()=>{
 auto=!auto;
 e('luMediaAuto').setAttribute('aria-pressed',String(auto));
 e('luMediaAuto').textContent='Continuidad: '+(auto?'ON':'OFF');
 if(auto&&!e('luMediaAudio').paused)return;
 if(auto){suggest(lastMood);selectAndPlay()}
});
e('luMediaDisconnect').addEventListener('click',disconnect);
e('luMediaAudio').addEventListener('ended',()=>{
 if(!auto||!connected)return;
 suggest(lastMood);selectAndPlay();
});
e('luMediaAudio').addEventListener('error',()=>{
 if(!connected)return;
 failures++;
 notice('Esta pista no se ha podido reproducir desde aquí. Puedes abrirla en Jellyfin.'+
  (failures>=2?' Desactiva Continuidad si no se reproduce el formato.':''));
 if(failures>=3){auto=false;e('luMediaAuto').textContent='Continuidad: OFF';e('luMediaAuto').setAttribute('aria-pressed','false')}
});
window.__luJellyfin={
 suggest:(mood,visual)=>{
  if(!connected)return false;
  if(visual?.tone)visualTone=visual.tone;
  if(!auto||e('luMediaAudio').paused)suggest(mood);
  return true;
 },
 status:()=>({connected,auto,count:{...counts},sampled:{audio:items.audio.length,videos:items.videos.length,films:items.films.length}}),
 disconnect
};
})();