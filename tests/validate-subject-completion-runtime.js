/* Simulated completion-path tests for Reading and Language across all 20 days.
   Run: node tests/validate-subject-completion-runtime.js */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const reading=JSON.parse(read('sections/reading/data/reading-papers-v2.json'));
const language=JSON.parse(read('sections/language/data/language-papers-v2.json'));
const esc=s=>String(s??'');
function extract(file,begin,end){
 const s=read(file),i=s.indexOf(begin),j=s.indexOf(end,i+begin.length);
 assert.ok(i>=0&&j>i,'Cannot extract completion handler from '+file);
 return s.slice(i,j);
}
const readingFinish=extract('reading-skills.html','function finish(auto){','const params=');
const languageFinish=extract('language.html','function finish(auto=false){','const params=');
function elements(){
 const nodes={};
 return id=>nodes[id]||(nodes[id]={innerHTML:'',textContent:'',onclick:null,classList:{add(){},remove(){}},scrollIntoView(){}});
}
const readingFn=new Function('progress','day','mode','questions','answers','stopClock','save','renderDays','renderDashboard','$','readingPromptHtml','esc',
 'let finished=false,started=true;'+readingFinish+';finish(false);return progress[day][mode];');
const languageFn=new Function('progress','day','mode','questions','answers','stop','save','saveMistakes','renderDays','renderDashboard','$','esc','mistakeBank','start',
 'let finished=false;'+languageFinish+';finish(false);return progress[day][mode];');
let runs=0;
for(let day=1;day<=20;day++){
 for(const mode of ['practice','test']){
  const progress={},$=elements();
  const set=mode==='practice'?reading.practice[day-1]:reading.tests[day-1];
  const questions=mode==='practice'
   ?set.questions.map((q,i)=>({...q,readingPassageId:i<10?'practice':null}))
   :[...set.passages.flatMap(p=>p.questions.map(q=>({...q,readingPassageId:p.id}))),...set.vocabularyQuestions.map(q=>({...q,readingPassageId:null}))];
  let saves=0,refreshes=0;
  const answers=questions.map(q=>(q.correctIndex+1)%4);
  const score=readingFn(progress,day,mode,questions,answers,()=>{},()=>saves++,()=>refreshes++,()=>refreshes++,$,q=>q.prompt,esc);
  assert.equal(score.total,questions.length);
  assert.equal(score.score,0,'Zero-score attempts must save as completed');
  assert.equal(saves,1);assert.equal(refreshes,2);
  assert.match($('workspace').innerHTML,/RESULTS/);
  runs++;
 }
 for(const mode of ['practice','test','challenge']){
  const progress={},$=elements(),mistakeBank={};
  const bank=mode==='test'?language.tests[day-1].questions:language.practice[day-1].questions;
  const questions=(mode==='challenge'
   ?[...language.practice[day-1].questions.slice(0,12)]
   :bank).map(q=>({id:q.id,text:q.text,options:q.options,correct:q.correctIndex,explain:q.explanation,topic:q.skill,group:q.group}));
  let saves=0,mistakeSaves=0,refreshes=0;
  const answers=questions.map(q=>(q.correct+1)%4);
  const score=languageFn(progress,day,mode,questions,answers,()=>{},()=>saves++,()=>mistakeSaves++,()=>refreshes++,()=>refreshes++,$,esc,mistakeBank,()=>{});
  assert.equal(score.total,questions.length);
  assert.equal(score.score,0,'Failing Language attempts still count as submitted');
  assert.equal(saves,1);assert.equal(mistakeSaves,1);assert.equal(refreshes,2);
  assert.match($('workspace').innerHTML,/RESULTS/);
  runs++;
 }
}
assert.equal(runs,100);
console.log('PASS: 100 Reading and Language completion simulations (20 days x 5 modes), including zero-score submission, saved progress, results and dashboard refresh.');
