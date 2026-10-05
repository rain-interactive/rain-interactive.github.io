const fs=require('fs'),vm=require('vm'),assert=require('assert');
const {createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync(process.argv[2],'utf8'),script=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].at(-1)[1];
function setup(saved=false){
 const memory=new Map(saved?[['sdj-commandos-tutorial-v1','1']]:[]),canvas=createCanvas(800,360),events={};
 function node(){return {style:{},classList:{add(){},remove(){}},setAttribute(){},addEventListener(n,fn){this[n]=fn},setPointerCapture(){},getBoundingClientRect(){return {top:0,left:0,width:800,height:360}},after(){},append(){},innerHTML:'',textContent:''}}
 const nodes=new Map(),doc={body:node(),hidden:false,querySelector:s=>s==='canvas'?canvas:nodes.get(s)||nodes.set(s,node()).get(s),querySelectorAll:()=>[],addEventListener(){},dispatchEvent(){},createElement:t=>t==='canvas'?createCanvas(128,128):node()};
 const env={document:doc,window:{innerWidth:800,innerHeight:360,commandosT:s=>s},localStorage:{getItem:k=>memory.get(k)||null,setItem:(k,v)=>memory.set(k,v)},requestAnimationFrame(){},addEventListener:(n,fn)=>events[n]=fn,performance:{now:()=>2000},CustomEvent:class{},console,Math,setTimeout,clearTimeout};
 vm.createContext(env);vm.runInContext(script.replace('intro();requestAnimationFrame(frame);','intro();'),env);
 return {run:c=>vm.runInContext(c,env),env,canvas,doc,memory,events,screen:doc.querySelector('#screen')};
}


const sim=setup();sim.run(`
function simulateRun(policy,weapon,seed){
 let rng=seed>>>0;Math.random=()=>{rng=(Math.imul(rng,1664525)+1013904223)>>>0;return rng/4294967296};
 startingWeapon=weapon;start();muted=true;
 let hurt=0,hits=0,collected=0,expired=0,upgradeCount=0,heal=0,decision=0,steps=0,lastCause='',peaks=0;
 const originalDamage=damage;damage=function(n){const before=p.hp;originalDamage(n);if(p.hp<before){hits++;hurt+=before-p.hp;lastCause=foes.some(e=>e.hp>0&&Math.abs(e.x-p.x)<(e.boss?64:34)&&Math.abs(p.y-e.y)<40)?'contact':shots.some(b=>b.mortar&&Math.abs(b.x-p.x)<45)?'mortar':'projectile'}};
 function choose(){const ready=arsenal.find(a=>a.level>=3&&!a.evolved&&!stats.components[componentKey(a)]);let u;
 if(ready)u=choices.find(a=>a.id==='component:'+componentKey(ready));
 u ||=choices.find(a=>a.id.startsWith('rank:gun:'))||choices.find(a=>a.id==='equip:mines')||choices.find(a=>a.id==='rank:grenade:')||choices.find(a=>a.id==='damage')||choices.find(a=>a.id==='speed')||choices.find(a=>a.id==='rate')||choices.find(a=>a.id==='health')||choices[0];
 u.apply();syncArsenal();state='playing';O.style.display='none';clearInput();upgradeCount++;
 }
 for(steps=0;steps<108000;steps++){
  if(state==='upgrade'){choose();continue}
  if(state==='chest'){document.querySelector('#chest-continue').onclick();continue}
  if(state==='win'||state==='dead')break;
  decision-=1/60;
  if(decision<=0&&state==='playing'){
   decision=.2;let direction=0;
   const kit=pickups.filter(a=>a.kind==='health'&&a.expires>clock).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
   const target=foes.filter(e=>e.hp>0).sort((a,b)=>Math.abs(a.x-p.x)-Math.abs(b.x-p.x))[0];
   if(policy==='medical'){
    if(kit&&p.hp<=p.max-2)direction=Math.abs(kit.x-p.x)>10?Math.sign(kit.x-p.x):0;
    else if(target){const d=target.x-p.x;if(Math.abs(d)>250||Math.sign(d)!==p.dir)direction=Math.sign(d)}
   }
   if(policy==='tactical'){
    const nearby=foes.find(e=>e.hp>0&&Math.abs(e.x-p.x)<(e.boss?100:65)&&Math.abs(p.y-e.y)<50);
    const danger=shots.find(b=>b.life>0&&!b.mortar&&Math.abs(b.x+b.vx*.35-p.x)<42&&Math.abs(b.y+b.vy*.35-(p.y-32))<40);
    const mortar=shots.find(b=>b.mortar&&Math.abs(b.landing-p.x)<60)||foes.flatMap(e=>e.bossAttack?.kind==='mortar'?Array.from({length:e.bossAttack.count},(_,i)=>({landing:e.bossAttack.x+(i-(e.bossAttack.count-1)/2)*100})):[]).find(a=>Math.abs(a.landing-p.x)<60);
    if(nearby)direction=Math.sign(p.x-nearby.x)||-p.dir;
    else if(mortar)direction=Math.sign(p.x-mortar.landing)||p.dir;
    else if(danger)direction=Math.sign(danger.vx)||p.dir;
    else if(kit&&p.hp<=p.max-2)direction=Math.abs(kit.x-p.x)>10?Math.sign(kit.x-p.x):0;
    else if(target){const d=target.x-p.x,role=gunRole(weapons[weapon]),stand=role==='shotgun'?140:role==='precision'?340:250;if(Math.abs(d)>stand||Math.sign(d)!==p.dir)direction=Math.sign(d)}
   }
   if((p.x<90&&direction<0)||(p.x>world-90&&direction>0))direction=-direction;
   input.left=direction<0;input.right=direction>0;
  }
  const kits=pickups.filter(a=>a.kind==='health'),before=p.hp;update(1/60);
  if(p.hp>before)heal+=p.hp-before;
  for(const kit of kits)if(!pickups.includes(kit)){if(kit.expires<=clock)expired++;else if(kit.dead)collected++}
  peaks=Math.max(peaks,foes.length);if(steps%120===0)draw();
 }
 damage=originalDamage;
 return {policy,weapon:weapons[weapon].name,seed,result:state,seconds:+clock.toFixed(1),zone:phase+1,level:lv,kills,hits,hurt,heal,medkits:collected,expired,lastCause,maxFoes:peaks,evolutions:runEvolutions.length,upgrades:upgradeCount};
}
`);
const results=[];for(const policy of ['stationary','medical','tactical'])for(const weapon of [0,4,11,13,16])for(const seed of (policy==='tactical'?[17,43,101,211,307,419,523,631,743,853,967,1087,1201]:[17,43,101])){const r=sim.run(`simulateRun('${policy}',${weapon},${seed})`);results.push(r);}
for(const weapon of [0,4,11,13,16]){const a=results.filter(r=>r.policy==='tactical'&&r.weapon===sim.run(`weapons[${weapon}].name`)),times=a.map(r=>r.seconds).sort((a,b)=>a-b);console.log(JSON.stringify({weapon:a[0].weapon,runs:a.length,medianSeconds:times[Math.floor(times.length/2)],maximumZone:Math.max(...a.map(r=>r.zone)),wins:a.filter(r=>r.result==='win').length}));}
if(process.argv[3])fs.writeFileSync(process.argv[3],JSON.stringify(results,null,2));
