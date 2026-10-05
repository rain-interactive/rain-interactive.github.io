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
function win(){t.run("start();muted=true;phase=4;stageCleared=true;xp=0;chests=[];advanceStage();for(let i=0;i<420;i++)update(1/60)");assert.equal(t.run('state'),'win')}
function achievement(){const html=t.doc.querySelector('#overlay').innerHTML;assert(html.includes('Enhorabuena, has desbloqueado el vídeo secreto.'));assert(html.includes('victory-achievement'));assert.equal((html.match(/class="victory-achievement"/g)||[]).length,1);assert(html.includes('id="victory-watch"'))}
win();achievement();assert.equal(t.memory.get('sdj-commandos-victory'),'1');
win();achievement();
t.doc.querySelector('#victory-watch').onclick({preventDefault(){}});assert.equal(t.run('state'),'reward');t.doc.querySelector('#victory-back').onclick();assert.equal(t.run('state'),'win');achievement();
t.run('start();end(false)');assert.equal(t.run('state'),'dead');assert(!t.doc.querySelector('#overlay').innerHTML.includes('victory-achievement'));
const lang={window:{},localStorage:{getItem:()=> 'en'},document:{readyState:'loading',addEventListener(){}}};vm.createContext(lang);vm.runInContext([...html.matchAll(/<script>([\s\S]*?)<\/script>/g)][0][1],lang);assert.equal(lang.window.commandosT('Enhorabuena, has desbloqueado el vídeo secreto.'),'Congratulations, you unlocked the secret video.');
console.log('Passed finale-to-achievement, repeated wins after stored unlock, video access and return, no achievement on defeat, and English translation.');
