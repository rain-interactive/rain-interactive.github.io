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

const t=setup();t.run('start();muted=true');assert.equal(t.run('p.hp'),6);assert.equal(t.run('p.max'),6);
t.run('p.hp=2;recoveryReward().apply()');assert.equal(t.run('p.hp'),2,'Menu supplies must not heal');
t.run("survivorUpgradePool().find(a=>a.id==='speed').apply();survivorUpgradePool().find(a=>a.id==='health').apply()");assert.equal(t.run('p.hp'),2);assert.equal(t.run('p.max'),7);
t.run('start();muted=true;clock=12;foes=[];spawn=999;nextBoss=999;nextElite=999;lastWave=0;updateMedicalDirector()');assert.equal(t.run('pickups.length'),1);assert.equal(t.run('pickups[0].expires-clock'),12);assert.equal(t.run('Math.abs(pickups[0].x-p.x)'),180);
t.run('updateMedicalDirector()');assert.equal(t.run('pickups.length'),1,'A delivery must not repeat every frame');
t.run('clock=24;p.hp=2;update(.01)');assert.equal(t.run("pickups.filter(a=>a.kind==='health').length"),0,'Expired medkit must disappear');assert.equal(t.run('p.hp'),2);
t.run("medicalDropAt(p.x+180);p.x=pickups[0].x;p.hp=2;p.inv=999;nextMedical=999;update(.01)");assert.equal(t.run('p.hp'),5);assert.equal(t.run('pickups.length'),0,'Health collection must consume the kit');
t.run('start();p.hp=2;stageCleared=true;gems=[];chests=[];xp=0;advanceStage()');assert.equal(t.run('phase'),1);assert.equal(t.run('p.hp'),2,'Zone transition must preserve wounds');
// Controlled, avoidable combat pressure: three ordinary hits per 24-second interval.
function pressure(collect){t.run('start();muted=true;p.inv=0');for(let cycle=0;cycle<2;cycle++){t.run('for(let hit=0;hit<3;hit++){clock+=8;p.inv=0;damage(1)}');if(collect&&t.run("state==='playing'"))t.run("medicalDropAt(p.x);spawn=999;nextBoss=999;nextElite=999;nextMedical=999;update(.01)")}return t.run('({state,hp:p.hp})')}
assert.equal(pressure(false).state,'dead','Skipping two kits under sustained fire must be dangerous');assert.equal(pressure(true).hp,6,'Collected kits must offset this pressure');
t.run('start();p.x=world-40;medicalSide=1;dropMedical()');assert(t.run('pickups[0].x<p.x&&Math.abs(pickups[0].x-p.x)===180'),'Delivery must remain reachable near an edge');
console.log('Passed six-health start, no passive menu/stage healing, distant reachable drops, expiry, healing, delivery interval, boundary handling and two missed-kit pressure scenario.');
