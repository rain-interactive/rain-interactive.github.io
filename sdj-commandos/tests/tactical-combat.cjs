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

const t=setup();t.run('start();muted=true;spawn=999;nextElite=999;nextBoss=999;scenery=[]');
t.run("foes=[{x:p.x-250,y:G,hp:100,max:100,kind:'soldier',age:1,cd:0,speed:0,hit:0,touch:99}];update(.01)");assert.equal(t.run('shots.length'),0);assert(t.run('rearThreat()!=null'),'Rear attack needs warning');
t.run('draw()');t.run('update(.3)');assert.equal(t.run('shots.length'),0);t.run('update(.36)');assert(t.run('shots.length>0'),'Warning must lead to an actual attack');assert.equal(t.run('rearThreat()'),undefined);
t.run('start();muted=true;scenery=[];clock=12.2;spawn=0;nextElite=12;foes=[];nextBoss=999;lastWave=0;updateWaveDirector(.01)');assert(t.run('waveBreather()'));assert.equal(t.run('foes.length'),0,'Rest stops reinforcements and elites');assert.equal(t.run('pickups.length'),1,'Medical delivery must continue');t.run('draw()');
t.run("foes=[{x:p.x+250,y:G,hp:100,max:100,kind:'soldier',age:1,cd:0,speed:0,hit:0,touch:99}];update(.01)");assert.equal(t.run('shots.length'),0,'Enemies hold fire during regroup');
t.run('clock=15.01;foes=[];spawn=0;updateWaveDirector(.01)');assert(!t.run('waveBreather()'));assert(t.run('foes.length>0'),'Rest must end and attacks resume');
t.run('clock=147;foes=[]');assert(!t.run('waveBreather()'),'Final wave stays active');t.run('clock=13;addEnemy(true)');assert(!t.run('waveBreather()'),'No rest during bosses');
t.run('start();muted=true');const close=t.run("projectileDamage({damage:10,role:'shotgun',range:230,distance:30},{kind:'soldier'})"),far=t.run("projectileDamage({damage:10,role:'shotgun',range:230,distance:220},{kind:'soldier'})");assert(close>far*2);assert(t.run("projectileDamage({damage:10,role:'shotgun',range:230,distance:30},{kind:'ustank'})")<close);
assert(t.run("projectileDamage({damage:10,role:'precision',range:900,distance:700},{kind:'ustank'})")>10);
t.run('startingWeapon=13;start();muted=true;foes=[{x:p.x+800,y:G-80,hp:100,kind:\'soldier\'}];shoot()');assert(t.run('bullets[0].vy<0'),'Sniper can aim beyond old 650 limit');assert(t.run('bullets[0].role===\'precision\''));
assert(t.run('weapons[11].range<weapons[4].range&&weapons[4].range<weapons[13].range'));assert(t.run('weapons[16].rate>weapons[4].rate*4'),'Explosives have deliberate cadence');
t.run("start();muted=true;scenery=[];foes=[{x:p.x+100,y:G,hp:100,max:100,kind:'ustank',hit:0}];explosion(p.x+100,G-25,90,10,'explosive')");assert.equal(t.run('foes[0].hp'),86.5,'Blast armor bonus is calculated per target');
console.log('Passed warning lead time and shot, wave regroup and resumption, uninterrupted medkits, boss exceptions, weapon ranges, shotgun falloff, armor response and long-range aim.');
