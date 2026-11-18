'use strict';
// Structural regression guard for the 2026-11-17 Reading passage upgrade.
// Run: node tests/validate-reading-long-passages.js
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../sections/reading/data/reading-papers-v2.json'),'utf8'));
const wordCount=text=>String(text||'').trim().split(/\s+/).filter(Boolean).length;
const ids=new Set();
let passages=0;
for(const paper of data.tests){
 for(const passage of paper.passages){
  passages++;
  assert.ok(!ids.has(passage.id),'Duplicate passage ID '+passage.id);
  ids.add(passage.id);
  assert.ok(wordCount(passage.text)>=350,passage.id+' is under 350 words');
  assert.equal(passage.questions.length,10,passage.id+' requires ten questions');
  const questionIds=new Set();
  for(const q of passage.questions){
   assert.ok(!questionIds.has(q.id),'Repeated question ID in '+passage.id);
   questionIds.add(q.id);
   assert.equal(q.passageId,passage.id,q.id+' passage link changed');
  }
 }
}
assert.equal(passages,80,'Twenty timed papers must contain 80 passages');
const target=Array.from({length:10},(_,i)=>i+11).flatMap(day=>[2,3,4].map(part=>'R'+day+'-P'+part));
for(const id of target){
 const passage=data.tests.flatMap(p=>p.passages).find(p=>p.id===id);
 assert.ok(passage,'Missing renovated passage '+id);
 assert.ok(wordCount(passage.text)>=350,'Unexpanded target passage '+id);
 const last=passage.questions[9];
 assert.equal(last.editorialStatus,'individually-authored-editorial-review-pending',id+' closing question not replaced');
 assert.ok(!/Repeat the method|Which follow-up study would most directly/.test(last.prompt),id+' closing item still generic');
}
console.log('PASS: all 80 Reading timed passages >=350 words; 30 targeted passages and closing questions upgraded; IDs preserved.');
