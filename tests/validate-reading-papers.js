/* Run: node tests/validate-reading-papers.js */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../sections/reading/data/reading-papers-v2.json'),'utf8'));
const legacy=JSON.parse(fs.readFileSync(path.join(__dirname,'../sections/reading/data/paper-01.json'),'utf8'));
assert.equal(data.tests.length,20,'Exactly 20 Reading papers');
assert.equal(data.practice.length,20,'Exactly 20 guided practices');
assert.equal(data.lessons.length,20,'Exactly 20 Reading lessons');
const ids=new Set(),signatures=new Set(),vocabWords=new Set(),passageIds=new Set();
let total=0,fullCount=0,guidedCount=0;
function checkQuestion(q,location){
 assert.ok(q.id&&typeof q.prompt==='string'&&q.prompt.length>=12,location+' missing question prompt');
 assert.equal(q.choices.length,4,location+' must have four options');
 assert.equal(new Set(q.choices.map(x=>x.toLowerCase().trim())).size,4,location+' duplicate choices');
 assert.ok(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4,location+' invalid answer key');
 assert.ok(q.explanation&&q.explanation.length>=20,location+' missing explanation');
 assert.ok(!ids.has(q.id),'Repeated question id '+q.id);
 ids.add(q.id);
 const sig=q.prompt+'|'+q.choices.slice().sort().join('~');
 assert.ok(!signatures.has(sig),'Repeated question-and-options '+q.id);
 signatures.add(sig);
 total++;
}
for(let d=1;d<=20;d++){
 const paper=data.tests[d-1],guided=data.practice[d-1];
 assert.equal(paper.day,d);
 assert.equal(guided.day,d);
 assert.equal(paper.durationMinutes,23);
 assert.equal(paper.totalQuestions,62);
 assert.equal(paper.passages.length,4);
 assert.equal(paper.vocabularyQuestions.length,22);
 for(const passage of paper.passages){
   assert.equal(passage.questions.length,10,passage.title);
   assert.ok(!passageIds.has(passage.id),'Repeated passage '+passage.id);
   passageIds.add(passage.id);
   assert.ok(passage.text.length>300,passage.title+' passage too short');
   for(const q of passage.questions){checkQuestion(q,'Day '+d);assert.equal(q.passageId,passage.id);fullCount++;}
 }
 for(const q of paper.vocabularyQuestions){
   checkQuestion(q,'Day '+d+' vocabulary');fullCount++;
   const word=String(q.word||q.targetWord||'').toLowerCase();
   assert.ok(word.length>0,'Missing target vocab word '+q.id);
   assert.ok(!vocabWords.has(word),'Repeated full-test vocabulary target '+word);
   vocabWords.add(word);
 }
 assert.equal(guided.questions.length,15);
 assert.ok(guided.passage.length>100);
 for(const q of guided.questions){checkQuestion(q,'Guided day '+d);guidedCount++;}
}
assert.equal(fullCount,1240);
assert.equal(guidedCount,300);
assert.equal(total,1540);
assert.equal(passageIds.size,80);
assert.equal(vocabWords.size,440);
assert.equal(legacy.vocabularyQuestions.length,22);
assert.equal(new Set(legacy.vocabularyQuestions.map(x=>x.targetWord.toLowerCase())).size,22);
console.log('PASS: 20 Reading papers, 80 passages, 1240 test questions, 300 guided questions and 440 unique full-test vocabulary targets.');
