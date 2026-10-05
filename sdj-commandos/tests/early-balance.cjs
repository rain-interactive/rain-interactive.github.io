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

const t=setup();t.run('start();muted=true');assert.equal(t.run('wavePressure().cap'),8);assert.equal(t.run('wavePressure().batch'),1);t.run('clock=50');assert.equal(t.run('wavePressure().cap'),12);t.run('clock=100');assert.equal(t.run('wavePressure().cap'),18);
t.run('phase=1');assert.equal(t.run('wavePressure().cap'),20);t.run('phase=2');assert.equal(t.run('wavePressure().interval'),1);
for(let zone=0;zone<5;zone++){t.run(`start();muted=true;phase=${zone};addEnemy(true)`);assert.equal(t.run('wavePressure().cap'),6+zone*2);assert.equal(t.run('wavePressure().batch'),1);assert(t.run('wavePressure().interval>1'))}
t.run('start();muted=true;clock=1;lastWave=0;foes=[];spawn=0;nextElite=999;nextBoss=999;updateWaveDirector(.01)');assert.equal(t.run('foes.length'),1,'Intro wave must spawn one enemy');assert(t.run('spawn>1.5'));t.run('clock=16;spawn=0;foes=[];updateWaveDirector(.01)');assert.equal(t.run('foes.length'),1,'Early rush must not create a double batch');
assert.equal(t.run('weapons[0].damage'),3);assert(t.run('weapons[11].range<weapons[4].range'));assert(t.run('weapons[16].rate>weapons[4].rate*4'));
t.run('start();muted=true;phase=1');assert.equal(t.run('weaponRankCap()'),3);assert(!t.run("survivorUpgradePool().some(u=>u.id.startsWith('component:'))"));assert.equal(t.run('p.hp'),6);assert.equal(t.run('target'),24);
console.log('Passed gradual early pressure, unchanged late-zone pace, boss reinforcement caps, stronger starter weapons and preserved health/progression restrictions.');
