const fs=require('fs'),vm=require('vm');
const {createCanvas}=require('@napi-rs/canvas');
const html=fs.readFileSync(process.argv[2],'utf8');
const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(m=>m[1]);
const canvas=createCanvas(800,360);
function node(){return {style:{},classList:{add(){},remove(){}},setAttribute(){},addEventListener(){},getBoundingClientRect(){return {top:0,left:0,width:800,height:360}},innerHTML:'',textContent:'',after(){},append(){}}}
const nodes=new Map(),doc={body:node(),hidden:false,querySelector:s=>s==='canvas'?canvas:nodes.get(s)||nodes.set(s,node()).get(s),querySelectorAll:()=>[],addEventListener(){},dispatchEvent(){},createElement:t=>t==='canvas'?createCanvas(128,128):node()};
const env={document:doc,window:{innerWidth:800,innerHeight:360,commandosT:s=>s},localStorage:{getItem:()=>null,setItem(){}},requestAnimationFrame(){},addEventListener(){},performance:{now:()=>2000},CustomEvent:class{},console,Math,setTimeout,clearTimeout};
vm.createContext(env);vm.runInContext(scripts.at(-1).replace('intro();requestAnimationFrame(frame);',''),env);
vm.runInContext(`W=800;C.width=W;phase=0;clock=22;cam=550;state='playing';p={x:850,y:G,dir:1,step:1.7,flash:.08,recoil:.08,throwPose:0,hp:8,max:8,inv:0};stats={orbit:0,weapon:0,rate:1,damage:0,multi:0,speed:170,magnet:90,radius:85,unlocked:0};scenery=makeScenery(0);foes=[{x:1070,y:G,kind:'ustank',boss:true,hp:40,max:40,dir:-1,age:1,cd:.2,look:0},{x:985,y:G,kind:'soldier',boss:false,hp:3,max:3,dir:-1,age:1.6,cd:.1,look:2},{x:660,y:G,kind:'soldier',hp:3,max:3,dir:1,age:1.2,cd:1,look:12},{x:1150,y:145,kind:'helicopter',hp:14,max:14,dir:-1,age:1,cd:.6}];`,env);
vm.runInContext('draw()',env);fs.writeFileSync(process.argv[3],canvas.toBuffer('image/png'));
if(process.argv[4]){vm.runInContext(`explosion(1000,G-25,100,0);clock+=.23;draw()`,env);fs.writeFileSync(process.argv[4],canvas.toBuffer('image/png'));}

for(let zone=0;zone<5;zone++){
 vm.runInContext(`phase=${zone};clock=30+${zone}*20;scenery=makeScenery(phase);arcadeBlasts=[];foes=Array.from({length:20},(_,i)=>({x:cam+20+i*38,y:G,kind:'soldier',look:i,age:1+i*.12,dir:i%2?1:-1,cd:i%3?.8:.1,hp:3,max:3}));draw()`,env);
 fs.writeFileSync('/tmp/commandos-zone-'+zone+'.png',canvas.toBuffer('image/png'));
}
vm.runInContext(`start();muted=true;p.inv=999;for(let i=0;i<900;i++){update(1/60);if(i%15===0)draw()}if(!Number.isFinite(p.x)||!Number.isFinite(clock))throw Error('Invalid simulation');`,env);
const assert=require('assert');
vm.runInContext("start();muted=true;spawn=999;nextBoss=999;nextElite=999;foes=[{x:p.x+50,y:G,kind:'soldier',look:2,hp:3,max:3,dir:-1,age:1,cd:1,speed:45,hit:0,touch:1}];update(.01)",env);
assert(vm.runInContext('foes[0].moving===false&&foes[0].walk===0',env),'Stationary troops must hold their gait');
vm.runInContext('foes[0].x=p.x+250;update(.01)',env);
assert(vm.runInContext('foes[0].moving&&foes[0].walk>0',env),'Gait must follow actual displacement');
vm.runInContext('foes[0].x=p.x+50;foes[0].cd=0;update(.01);draw()',env);
assert(vm.runInContext('foes[0].shotPulse===.18',env),'Shot animation must begin on a real shot');
vm.runInContext('update(.02)',env);
assert(vm.runInContext('foes[0].shotPulse<.18&&foes[0].shotPulse>0',env),'Recoil must decay independently');
vm.runInContext("for(let i=0;i<30;i++)addArcadeBlast(p.x,G-20,100);draw()",env);
assert(vm.runInContext('arcadeBlasts.length<=16',env),'Blast debris must stay bounded');
console.log('Stationary/moving gait, real shot pulse, recoil decay and blast cap passed.');
console.log('Rendered five zones and all 20 troop variants; 900 simulation frames passed.');

