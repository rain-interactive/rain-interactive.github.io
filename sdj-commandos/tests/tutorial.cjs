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
const t=setup();t.doc.querySelector('#start').onclick();
assert.equal(t.run('state'),'tutorial');assert.equal(t.run('tutorialStep'),'right');
function press(x,y=180,id=1){t.screen.pointerdown({target:t.canvas,clientX:x,clientY:y,pointerId:id,preventDefault(){}})}
function release(id=1){t.screen.pointerup({pointerId:id})}
function tick(n){t.run(`for(let i=0;i<${n};i++)update(1/60)`)}
t.run('draw()');fs.writeFileSync('/tmp/commandos-tutorial-right.png',t.canvas.toBuffer('image/png'));
press(150);tick(20);release();assert.equal(t.run('tutorialStep'),'right','Wrong direction must not pass');assert.equal(t.run('clock'),0);assert.equal(t.run('foes.length'),0);assert.equal(t.run('bullets.length'),0);
press(650);tick(6);assert.equal(t.run('tutorialStep'),'rightDone');release();assert(t.run('p.x>tutorialOrigin'));
tick(92);assert.equal(t.run('tutorialStep'),'left');t.run('draw()');fs.writeFileSync('/tmp/commandos-tutorial-left.png',t.canvas.toBuffer('image/png'));
press(650);tick(20);release();assert.equal(t.run('tutorialStep'),'left');assert.equal(t.memory.has('sdj-commandos-tutorial-v1'),false,'Incomplete tutorial must not be saved');
press(150);tick(6);release();assert.equal(t.run('tutorialStep'),'leftDone');
tick(122);assert.equal(t.run('tutorialStep'),'achievement');assert.equal(t.run('state'),'tutorial');assert.equal(t.memory.get('sdj-commandos-tutorial-v1'),'1');t.run('draw()');fs.writeFileSync('/tmp/commandos-tutorial-achievement.png',t.canvas.toBuffer('image/png'));
t.run("for(let i=0;i<180&&state==='tutorial';i++)update(1/60)");assert.equal(t.run('state'),'playing');assert.equal(t.run('clock'),0,'Combat clock must start after the tutorial achievement');assert.equal(t.run('phase'),0);assert.equal(t.run('p.x'),1100);assert.equal(t.run('input.left||input.right'),false);
t.run('enterCombat()');assert.equal(t.run('state'),'playing','Same-session replay must skip tutorial');
const returning=setup(true);returning.doc.querySelector('#start').onclick();assert.equal(returning.run('state'),'playing','Returning visitor must skip completed tutorial');
const interrupted=setup();interrupted.doc.querySelector('#start').onclick();interrupted.run("input.right=true;update(.033);input.right=false");assert.equal(interrupted.memory.has('sdj-commandos-tutorial-v1'),false);
// Portrait canvas is rotated 90 degrees, matching the existing gameplay touch mapping.
t.env.window.innerWidth=360;t.env.window.innerHeight=800;assert.equal(t.run('touchSide({clientX:100,clientY:50})'),'left');assert.equal(t.run('touchSide({clientX:100,clientY:300})'),'right');
const keyboard=setup();keyboard.doc.querySelector('#start').onclick();keyboard.events.keydown({code:'ArrowRight',preventDefault(){}});keyboard.run('for(let i=0;i<6;i++)update(1/60)');assert.equal(keyboard.run('tutorialStep'),'rightDone');
console.log('Passed real pointer input, wrong-side rejection, ordered movement, saved completion, achievement, clean combat start, return visits, keyboard and portrait mapping.');
