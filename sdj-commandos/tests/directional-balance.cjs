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

const t=setup();
t.run('start();muted=true');
function enemy(x,y){return `{x:${x},y:${y},hp:100,max:100,kind:'soldier',age:1,cd:99,speed:0,hit:0,touch:99}`}
for(const dir of [-1,1]){
 t.run(`start();muted=true;p.dir=${dir};foes=[${enemy(1100-dir*30,290)},${enemy(1100+dir*180,290)}];shoot()`);
 assert(t.run(`bullets.every(b=>Math.sign(b.vx)===${dir})`),'Only forward targets may be aimed at');assert.equal(t.run('p.dir'),dir);
 t.run(`bullets=[];arsenal[0].cd=0;foes=[${enemy(1100-dir*30,290)}];shoot()`);
 assert(t.run(`bullets.every(b=>Math.sign(b.vx)===${dir})`),'Rear-only enemies must not turn the gun');
 t.run('p.bombcd=0;grenade(true)');assert(t.run(`Math.sign(bombs[0].vx)===${dir}`));
}
t.run('start();muted=true;p.vx=100;input.left=true;input.right=false;update(.001)');assert.equal(t.run('p.dir'),-1,'Input must immediately switch facing despite inertia');
t.run('start();muted=true;p.dir=1;foes=[];spawn=999;nextBoss=999;nextElite=999');
t.run(`foes=[${enemy(850,290)}];foes[0].cd=0;update(.01);update(.7)`);assert(t.run('shots.length>0'),'Rear enemies must still fire');assert.equal(t.run('p.dir'),1);
for(let phase=0;phase<5;phase++){
 t.run(`start();muted=true;phase=${phase}`);const cap=Math.min(5,phase+2);
 for(let rank=1;rank<cap;rank++)t.run("survivorUpgradePool().find(u=>u.id==='rank:gun:0').apply()");
 assert.equal(t.run('arsenal[0].level'),cap);assert(!t.run("survivorUpgradePool().some(u=>u.id==='rank:gun:0')"));
}
t.run('start();muted=true');for(let i=0;i<12;i++)t.run("chests=[{x:p.x}];openChest(chests[0]);document.querySelector('#chest-continue').onclick()");assert(t.run('arsenal.every(a=>a.level===1)'),'Elite chests cannot bypass progression');
t.run('start();muted=true;phase=1');assert(!t.run("survivorUpgradePool().some(u=>u.id==='multi'||u.id.startsWith('component:'))"));assert(t.run('arsenal.every(a=>!readyEvolution(a))'));
t.run('start();muted=true');let costs=[];for(let i=0;i<18;i++){costs.push(t.run('target'));t.run("xp=target;gainPendingLevel();state='playing'")};assert(costs.every((c,i)=>!i||c>costs[i-1]));assert(costs.at(-1)>500,'XP must not settle at a cheap fixed cap');
let health=[];for(let phase=0;phase<5;phase++){t.run(`start();muted=true;phase=${phase};addEnemy(true)`);health.push(t.run('foes[0].hp'))}assert(health.every((c,i)=>!i||c>health[i-1]));assert.equal(health.at(-1),265);
t.run('start();muted=true;phase=3;arsenal[0].level=5;stats.components.ballistic=1;chests=[{x:p.x}];openChest(chests[0])');assert(t.run('arsenal[0].evolved'),'Late recipe chest must still evolve weapon');
console.log('Passed forward guns/grenades, immediate turns, rear enemy fire, zone rank caps, chest rewards, late components, rising XP and boss progression.');
