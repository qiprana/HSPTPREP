'use strict';
// Regression guard for full Reading content upgrade, including stable question IDs.
// Run: node tests/validate-reading-long-passages.js
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../sections/reading/data/reading-papers-v2.json'),'utf8'));
const count=s=>String(s||'').trim().split(/\s+/).filter(Boolean).length;
const targets=new Set(Array.from({length:10},(_,i)=>i+11).flatMap(d=>[2,3,4].map(p=>'R'+d+'-P'+p)));
const passageIds=new Set(),questionIds=new Set();
const vocabulary=[],vocabTargets=new Set();
let rewrittenTimed=0,rewrittenGuided=0,passages=0,guided=0,minimum=Infinity;
function checkQuestion(q,context){
 assert.ok(q.id&&!questionIds.has(q.id),'Missing or duplicate ID: '+q.id);
 questionIds.add(q.id);
 assert.ok(q.prompt&&q.explanation&&q.explanation.length>=20,context+' incomplete question '+q.id);
 assert.equal(q.choices.length,4,q.id+' choice count');
 assert.equal(new Set(q.choices.map(s=>s.toLowerCase().trim())).size,4,q.id+' duplicate choice');
 assert.ok(q.correctIndex>=0&&q.correctIndex<4,q.id+' invalid answer index');
}
for(const paper of data.tests){
 assert.equal(paper.passages.length,4,'Timed day '+paper.day+' passage count');
 for(const p of paper.passages){
  passages++;
  assert.ok(p.id&&!passageIds.has(p.id),'Missing or duplicate passage ID: '+p.id);
  passageIds.add(p.id);
  const wc=count(p.text);minimum=Math.min(minimum,wc);
  assert.ok(wc>=350,p.id+' under 350 words: '+wc);
  assert.equal(p.questions.length,10,p.id+' question count');
  for(const q of p.questions){
   checkQuestion(q,p.id);
   assert.equal(q.passageId,p.id,'Broken passage ID for '+q.id);
   if(targets.has(p.id)){
    assert.equal(q.editorialStatus,'individually-authored-editorial-review-pending',q.id+' not rewritten');
    assert.ok(!/Which synthesis most faithfully|Which detail establishes the precise problem|Which passage detail most directly|Which follow-up study would most directly|How does the final action/i.test(q.prompt),'Old template question '+q.id);
    rewrittenTimed++;
   }
  }
 }
 for(const q of paper.vocabularyQuestions){checkQuestion(q,'timed vocabulary');vocabulary.push(q);}
}
assert.equal(passages,80);
assert.equal(minimum>=350,true);
assert.equal(rewrittenTimed,300,'All ten questions for 30 passages must be passage-specific (includes 30 previously reauthored closing questions)');
for(const p of data.practice){
 guided++;
 assert.ok(count(p.passage)>=350,'Guided day '+p.day+' under 350 words');
 assert.equal(p.questions.length,15,'Guided question count Day '+p.day);
 for(const [i,q] of p.questions.entries()){
  checkQuestion(q,'guided '+p.day);
  if(i>=1&&i<=9){
   assert.equal(q.editorialStatus,'individually-authored-editorial-review-pending','Unrevised guided template '+q.id);
   assert.ok(!/Which passage detail identifies an intervention|Which interpretation integrates the evidence|Which additional investigation would best|Which alternative explanation could be investigated/i.test(q.prompt),'Generic guided template '+q.id);
   rewrittenGuided++;
  }
  if(q.word)vocabulary.push(q);
 }
}
assert.equal(guided,20);
assert.equal(rewrittenGuided,180);
assert.equal(vocabulary.length,540,'440 timed plus 100 guided vocabulary questions');
let antonyms=0;
for(const q of vocabulary){
 assert.ok(q.word&&q.prompt.toLowerCase().includes(q.word.toLowerCase()),q.id+' missing contextual target');
 if(q.type==='Antonym'){antonyms++;assert.ok(/opposite/i.test(q.prompt),q.id+' incorrect antonym instruction');}
 const w=q.word.toLowerCase();
 assert.ok(!vocabTargets.has(w),'Repeated Reading vocab target: '+w+' in '+q.id);
 vocabTargets.add(w);
 const escaped=w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 const ctx=(q.prompt.match(/"[^"]+"/g)||[]).join(' ').replace(new RegExp(escaped,'gi'),'');
 const answer=q.choices[q.correctIndex];
 const escapedAnswer=answer.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
 assert.ok(!(new RegExp('\\b'+escapedAnswer+'\\b','i')).test(ctx),q.id+' leaks correct answer in the context');
}
assert.equal(antonyms,110);
console.log('PASS: 80 timed passages (min '+minimum+' words), 20 guided passages >=350 words, 300 passage-specific timed questions, 180 revised guided items, 540 unique vocabulary targets (110 antonyms); valid keys and preserved IDs.');
