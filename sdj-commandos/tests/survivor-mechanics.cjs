const fs=require('fs'),vm=require('vm');
const {createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync(process.argv[2],'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const canvas=createCanvas(800,360);
function node(){return {style:{},classList:{add(){},remove(){}},setAttribute(){},addEventListener(){},getBoundingClientRect(){return {top:0,left:0,width:800,height:360}},innerHTML:'',textContent:'',after(){},append(){}}}
const nodes=new Map(),doc={body:node(),hidden:false,querySelector:s=>s==='canvas'?canvas:nodes.get(s)||nodes.set(s,node()).get(s),querySelectorAll:()=>[],addEventListener(){},dispatchEvent(){},createElement:t=>t==='canvas'?createCanvas(128,128):node()};
const env={document:doc,window:{innerWidth:800,innerHeight:360,commandosT:s=>s},localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame(){},addEventListener(){},performance:{now:()=>2000},CustomEvent:class{},console,Math,setTimeout,clearTimeout};
vm.createContext(env);vm.runInContext(scripts.at(-1).replace('intro();requestAnimationFrame(frame);',''),env);
const assert=require('assert');env.check=assert;
function run(code){return vm.runInContext(code,env)}
function resume(){run("if(state==='upgrade'){choices[0].apply();syncArsenal();state='playing'}else if(state==='chest')document.querySelector('#chest-continue').onclick()");}
run("start();muted=true;p.inv=999");
assert.equal(run('arsenal.length'),2);
run("stats.unlocked=28;survivorUpgradePool().find(u=>u.id==='equip:gun:10').apply();shoot()");
assert.equal(run('arsenal.length'),3);assert.equal(run('bullets.length'),2);
assert.equal(run("survivorUpgradePool().some(u=>u.id.startsWith('equip:'))"),false);
run('const startingIndex=stats.weapon;survivorUpgradePool().find(u=>u.id===\'rank:gun:0\').apply()');
assert.equal(run('stats.weapon'),0);
for(let wi=0;wi<29;wi++){
 run(`startingWeapon=${wi};start();muted=true;p.inv=999;shoot()`);
 assert(run("bullets.length+mines.length>0"),'No attack from weapon '+wi);
 assert(run('bullets.every(b=>Number.isFinite(b.vx)&&Number.isFinite(b.damage)&&b.life>0)'));
}
for(const wi of [0,15,17,21,25]){
 run(`startingWeapon=${wi};start();muted=true;arsenal[0].level=5;stats.components[componentKey(arsenal[0])]=1;chests=[{x:p.x,age:0}];openChest(chests[0]);`);
 assert(run('arsenal[0].evolved'));assert.equal(run('chests.length'),0);
 const before=run('clock');run('update(.1)');assert.equal(run('clock'),before,'Chest must pause gameplay');
 resume();run('shoot()');assert(run('state===\'playing\''));
}
run("startingWeapon=0;start();muted=true;stats.unlocked=28;survivorUpgradePool().find(u=>u.id==='equip:gun:10').apply();arsenal[0].cd=1;arsenal[2].cd=0;shoot()");
assert.equal(run('bullets.length'),1,'Each attack needs independent cooldown');
run("start();muted=true;p.inv=999;arsenal[1].level=5;stats.components.explosive=1;chests=[{x:p.x,age:0}];openChest(chests[0]);document.querySelector('#chest-continue').onclick();grenade(true);bombs[0].fuse=.01;spawn=100;nextBoss=999;nextElite=999;update(.02)");
assert(run('fireZones.length===1'),'Napalm must create lingering fire');
run("start();muted=true;mines=[{x:1000,y:G,age:1,chain:true},{x:1100,y:G,age:1,chain:true},{x:1200,y:G,age:1,chain:true}];foes=[{x:1000,y:G,hp:10000,max:10000,kind:'soldier',age:1,cd:1}];updateMines(.01)");
assert.equal(run('mines.length'),0,'Mine chain must propagate');
run("mines=[{x:1000,y:G,age:2,kind:'remotemine'},{x:1900,y:G,age:2,kind:'remotemine'}];updateMines(.01)");
assert.equal(run('mines.length'),0,'Remote mines must detonate together');
run("start();muted=true;stageCleared=true;gems=[{x:1900,y:G,value:50,age:0}];chests=[{x:2000,age:0}];advanceStage()");
assert.equal(run('phase'),0);assert.equal(run('gems.length'),0);assert.equal(run('xp'),38);
for(let i=0;i<10&&run('phase===0');i++){resume();run('advanceStage()')}
assert.equal(run('phase'),1);assert.equal(run('chestCount'),1);assert(run('xp>0'),'Unused XP must survive stage transition');
run("arsenal.forEach(a=>{a.level=5;a.evolved=true});stats.rate=.32;stats.damage=6;stats.multi=3;stats.magnetUp=3;stats.speedUp=3;stats.healthUp=3;stats.unlocked=28;arsenal.push({type:'orbit',level:5,evolved:true});");
assert.equal(run('survivorUpgradePool().length'),0,'Capped upgrades must not be offered');assert.equal(run('buildUpgradeChoices()[0].id'),'recover');
run("startingWeapon=0;start();muted=true;phase=4;stageCleared=true;xp=0;chests=[];advanceStage()");
assert.equal(run('state'),'finale');run('for(let i=0;i<420;i++)update(1/60)');assert.equal(run('state'),'win');assert(run('victoryUnlocked'));
run("startingWeapon=0;start();muted=true;survivorUpgradePool().find(u=>u.id==='equip:orbit').apply();arsenal[2].level=5;stats.components.orbit=1;chests=[{x:p.x,age:0}];openChest(chests[0])");
assert(run('arsenal[2].evolved&&stats.orbit===5'),'Guardian ring must expand coverage');resume();
for(let zone=0;zone<5;zone++){
 run(`start();muted=true;p.inv=999;phase=${zone};stageStarted=0;clock=25;foes=[];nextBoss=999;updateWaveDirector(.1)`);
 assert(run('foes.some(e=>e.elite)'),'Every stage needs elite spawns');
 run('clock=35;spawn=0;foes=[];nextElite=999;updateWaveDirector(.1)');assert(run('foes.length>0'));
}

// Exercise a full run, resolving all actual upgrade and chest screens.
run("Math.random=(()=>{let seed=123456789;return()=>{seed=(Math.imul(seed,1664525)+1013904223)>>>0;return seed/4294967296}})();startingWeapon=0;start();muted=true;p.inv=999;");
for(let i=0;i<60000;i++){
 if(run("state==='upgrade'"))run("{const chosen=choices.find(u=>u.id.startsWith('rank:'))||choices.find(u=>u.id.startsWith('equip:'))||choices[0];chosen.apply();syncArsenal();state='playing';O.style.display='none'}");
 if(run("state==='chest'"))resume();
 // Stage transitions reset invulnerability; this progression fixture excludes death deliberately.
 run('p.inv=999;update(1/60)');if(i%120===0)run('draw()');
 if(run("state==='win'"))break;
}
assert(run('Number.isFinite(p.x)&&Number.isFinite(clock)'));
assert(run('phase===4&&state===\'win\''),'Full simulation must reach victory: '+JSON.stringify(run('({phase,state,clock,stageCleared,foes:foes.map(e=>({kind:e.kind,hp:e.hp,boss:e.boss,x:e.x})),arsenal})')));
assert(run('arsenal.length===3'));assert(run('chestCount>=10'));assert(run('runEvolutions.length>0'));
console.log('Passed: 29 weapons, 3 slots, independent cooldowns, 5 evolution families, napalm, chained/remote mines, chest pause, XP transfer, caps and full five-zone victory.');
console.log(JSON.stringify(run('({time:clock,level:lv,chests:chestCount,evolutions:runEvolutions,arsenal:arsenal.map(attackName)})')));
// Real canvas screenshot of a progressed loadout, elite marker and treasure.
run("state='playing';fx=[];floats=[];bullets=[];shots=[];bombs=[];corpses=[];arcadeBlasts=[];fireZones=[];phase=1;stageStarted=clock-25;cam=550;p.x=850;p.hp=8;scenery=makeScenery(1);chests=[{x:1030,age:1}];foes=[{x:1030,y:G,hp:18,max:26,kind:'soldier',look:12,age:1,cd:1,elite:true,dir:-1}];draw()");
fs.writeFileSync('/tmp/commandos-survivor-preview.png',canvas.toBuffer('image/png'));
