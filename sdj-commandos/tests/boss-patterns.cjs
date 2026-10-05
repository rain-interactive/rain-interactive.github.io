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
for(let zone=0;zone<5;zone++){
 t.run(`start();muted=true;phase=${zone};foes=[];addEnemy(true);foes[0].cd=0;updateBossAttack(foes[0],.01)`);
 assert(t.run('foes[0].bossAttack!=null'));assert.equal(t.run('shots.length'),0,'No shot before windup');
 assert.equal(t.run('foes[0].bossAttack.kind'),['aimed','fan','burst','mortar','aimed'][zone]);const target=t.run('foes[0].bossAttack.x');
 t.run('p.x+=80;draw();clock+=.8;updateBossAttack(foes[0],.01)');assert.equal(t.run('shots.length'),0,'Telegraph lead time');assert.equal(t.run('foes[0].bossAttack.x'),target,'Aim remains fixed while player dodges');
 t.run('clock+=.5;updateBossAttack(foes[0],.01);for(let i=0;i<120;i++){clock+=1/60;updateBossAttack(foes[0],1/60)}');assert(t.run('shots.length>0'));assert(t.run('shots.every(b=>Number.isFinite(b.vx)&&Number.isFinite(b.vy)&&b.life>0)'));
 const firstCount=t.run('shots.length');t.run('foes[0].hp=foes[0].max*.5;updateBossAttack(foes[0],.01)');assert(t.run('foes[0].enraged'));assert.equal(t.run("floats.filter(a=>a.t==='SEGUNDA FASE').length"),1);
 t.run('updateBossAttack(foes[0],.01)');assert.equal(t.run("floats.filter(a=>a.t==='SEGUNDA FASE').length"),1,'Phase transition must announce once');
 assert(t.run('bossPattern(foes[0]).count')>firstCount||zone===4,'Second phase expands pattern');
 t.run('foes[0].cd=0;updateBossAttack(foes[0],.01);draw()');
}
t.run('start();muted=true;phase=4;foes=[];addEnemy(true);foes[0].attackCycle=1');assert.equal(t.run('bossPattern(foes[0]).kind'),'fan');
t.run('start();muted=true');assert.equal(t.run("enemyRole({kind:'soldier',look:2})"),'assault');assert.equal(t.run("enemyRole({kind:'soldier',look:14})"),'agent');assert.equal(t.run("enemyRole({kind:'soldier',look:12})"),'special');
t.run("foes=[{x:p.x-100,speed:40,dir:1,cd:2,age:1,slow:0}];moveEnemy(foes[0],100,'agent',1)");assert(t.run('foes[0].x<p.x-100'),'Agents retreat when crowded');
t.run("foes=[{x:p.x-250,speed:40,dir:1,cd:2,age:1,slow:0}];moveEnemy(foes[0],250,'assault',1)");assert(t.run('foes[0].x>p.x-250'),'Infantry applies pressure');
t.run('start();muted=true;p.inv=0;damage(2)');assert.equal(t.run('p.hp'),4);assert.equal(t.run('p.lastDamage'),2);assert(t.run('p.hurtFlash>0'));t.run('draw();state=\'upgrade\';const frozen=p.hurtFlash;update(.1)');assert.equal(t.run('p.hurtFlash'),t.run('frozen'),'Feedback freezes during menus');
t.run("start();muted=true;foes=[];spawn=999;nextElite=999;nextBoss=999;scenery=[];p.inv=0;shots=[{x:p.x,y:G-9,vx:0,vy:100,life:1,heavy:true,mortar:true,radius:38,landing:p.x,blastWarning:true}];update(.02)");assert.equal(t.run('p.hp'),4,'Mortar ground impacts damage inside marked radius');assert.equal(t.run('shots.length'),0,'Detonation must be consumed once');
t.run("p.inv=0;shots=[{x:p.x+100,y:G-9,vx:0,vy:100,life:1,heavy:true,mortar:true,radius:38,landing:p.x+100,blastWarning:true}];update(.02)");assert.equal(t.run('p.hp'),4,'Dodging a mortar marker must be safe');
t.run("start();muted=true;for(let i=0;i<20;i++)kill({x:p.x,y:G,hp:0,max:1,kind:'soldier'})");assert.equal(t.run('combatMarks.length'),8);t.run('draw();start()');assert.equal(t.run('combatMarks.length'),0,'No stale kill marks after restart');
console.log('Passed five distinct telegraphed bosses, fixed aim, actual shots, second phase, role movement, hit feedback, mortar danger/safe dodge, pause behavior and bounded marks.');
