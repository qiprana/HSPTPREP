'use strict';
/* Run: node tests/validate-vocabulary-verbal.js */
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const base=path.join(__dirname,'..');
const index=fs.readFileSync(path.join(base,'index.html'),'utf8');
const quick=fs.readFileSync(path.join(base,'daily-quick.js'),'utf8');
const window={HSPT_WORD_CHUNKS:[]};
for(let i=1;i<=16;i++){
 const name='words-'+String(i).padStart(2,'0')+'.js';
 new Function('window',fs.readFileSync(path.join(base,name),'utf8'))(window);
}
const raw=window.HSPT_WORD_CHUNKS.flat();
assert.equal(raw.length,1084,'Vocabulary list must contain 1,084 entries');
const keys=new Set(raw.map(w=>w.key));
assert.equal(keys.size,1084,'All vocabulary entry keys must be unique');
const words=raw.map((w,i)=>({...w,legacyDay:w.day,day:Math.floor(i*50/raw.length)+1}));
const dayWords=Object.fromEntries(Array.from({length:50},(_,i)=>[i+1,words.filter(w=>w.day===i+1)]));
for(let d=1;d<=50;d++)assert.ok(dayWords[d].length>=21&&dayWords[d].length<=22,'Day '+d+' should have 21 or 22 words');
for(const w of words){
 assert.ok(w.word&&w.meaning&&w.example&&w.root&&w.key,'Missing study content: '+w.key);
}
const start=index.indexOf('function rand(arr){'),stop=index.indexOf('let quizTimerId=null;');
assert.ok(start>=0&&stop>start,'Verbal question generator missing');
const script=index.slice(start,stop);
const api=new Function('WORDS','DAY_WORDS','state',script+'return {makeVerbalChallenge,makeQuestion};')
 (words,dayWords,{covered:{},review:{}});
let verbalQuestions=0,vocabularyQuestions=0;
for(let d=1;d<=50;d++)for(const mode of ['daily','cumulative']){
 const qs=api.makeVerbalChallenge(d,mode),groups={};
 assert.equal(qs.length,60,'Day '+d+' '+mode+' question count');
 for(const q of qs){
  groups[q.category]=(groups[q.category]||0)+1;
  assert.ok(q.answer&&q.prompt&&q.explain,'Question missing text');
  assert.ok(q.choices.includes(q.answer),'Answer not offered: '+q.prompt);
  assert.equal(new Set(q.choices.map(x=>String(x).toLowerCase())).size,q.choices.length,'Duplicate options '+q.prompt);
  assert.equal(q.choices.length,q.category==='Verbal Logic'?3:4,'Wrong option count '+q.category);
  if(q.category==='Antonyms')assert.match(q.prompt,/opposite/i,'Antonym cannot be a definition question');
  if(q.category==='Synonyms')assert.match(q.prompt,/most nearly means/i,'Synonym mislabeled');
  verbalQuestions++;
 }
 for(const [name,count] of [['Synonyms',12],['Antonyms',10],['Analogies',10],['Verbal Logic',12],['Verbal Classification',16]])
  assert.equal(groups[name],count,'Wrong count for '+name+' on day '+d);
}
for(const w of words){
 const pool=dayWords[w.day];
 for(const type of ['meaning','definition','synonym','antonym','context','syllable','analogy']){
  if(type==='antonym'&&!w.antonym)continue;
  const q=api.makeQuestion(w,pool,type);
  assert.equal(q.choices.length,4,'Incorrect vocabulary options '+w.key+' '+type);
  assert.equal(new Set(q.choices.map(x=>String(x).toLowerCase().trim())).size,4,'Duplicate vocabulary choices '+w.key+' '+type);
  assert.ok(q.choices.includes(q.answer)&&q.explain,'Invalid answer/explanation '+w.key+' '+type);
  if(type==='context')assert.match(q.prompt,/completes this sentence/i,'Missing context sentence: '+w.key);
  vocabularyQuestions++;
 }
}
assert.match(index,/deadline:Date\.now\(\)\+16\*60\*1000/,'Verbal timer should be 16 minutes');
assert.ok(!index.includes('14-minute countdown')&&!quick.includes('14-minute countdown'),'Outdated Verbal timer label');
assert.match(index,/q\.score>=PASS_MARK\)markSubjectDone/,'Passing score must be required for Verbal completion');
assert.match(index,/window\.speechSynthesis\.speak/,'Pronunciation support must be present');
assert.match(index,/state\.covered/,'Word-level progress must be saved');
assert.match(index,/state\.review/,'Needs-review mechanism must be present');
const p=index.indexOf('function submitQuiz(auto=false)'),e=index.indexOf('function speak(text)',p);
assert.ok(p>=0&&e>p,'Verbal submit handler missing');
const quizHandler=index.slice(p,e);
for(const [answered,correct,shouldComplete] of [[60,60,true],[60,25,false],[45,45,false]]){
 const questions=Array.from({length:60},(_,i)=>({answer:'A',prompt:'q'+i}));
 const answers={};for(let i=0;i<answered;i++)answers[i]=i<correct?'A':'B';
 const q={day:1,kind:'daily',questions,answers,submitted:false},state={quizBest:{},history:[]};
 let done=0,saved=0;
 const submit=new Function('currentQuiz','state','stopQuizTimer','chosenSubjects','markSubjectDone','dateKey','saveState','maybeComplete','renderChallenges','drawQuiz','window','toast','PASS_MARK',quizHandler+'return submitQuiz;')
  (q,state,()=>{},()=>['verbal'],()=>done++,()=> '2026-11-09',()=>saved++,()=>{},()=>{},()=>{},{scrollTo(){}},()=>{},70);
 submit(true);
 assert.equal(done,shouldComplete?1:0,'Incorrect subject completion behavior');
 assert.equal(saved,1,'Score should persist');
}
console.log('PASS: '+raw.length+' vocabulary entries across 50 days; '+vocabularyQuestions+' vocabulary exercise cases and '+verbalQuestions+' Verbal items checked; timer, categories and scoring validated.');
