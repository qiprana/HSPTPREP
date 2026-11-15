/* Run: node tests/validate-language-advanced.js */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict');
const bank=JSON.parse(fs.readFileSync(path.resolve(__dirname,'../sections/language/data/language-advanced-v1.json'),'utf8'));
assert.equal(bank.days.length,20);
function coreSignature(q){
 const clean=s=>String(s).replace(/^In the day \d+ [^:]*? case:\s*/,'').replace(/^For a grade 10[–-]12 [^,]*? assessment,\s*/,'').replace(/^In the [^,]*? (practice|challenge|test) scenario,\s*/,'').toLowerCase().replace(/\s+/g,' ').trim();
 return clean(q.text)+'|'+q.options.map(clean).sort().join('~');
}
const allIds=new Set(),allTexts=new Set();
let upgraded=0;
for(let i=0;i<20;i++){
 const day=bank.days[i];assert.equal(day.day,i+1);
 for(const [kind,count] of [['practice',8],['challenge',12],['test',8]]){
  assert.equal(day[kind].length,count);
  const inDay=new Set(),cores=new Set();
  for(const q of day[kind]){
   assert.ok(!allIds.has(q.id),q.id+' duplicate ID');allIds.add(q.id);
   assert.equal(q.options.length,4,q.id);
   assert.equal(new Set(q.options.map(x=>x.trim().toLowerCase())).size,4,q.id);
   assert.ok(q.correctIndex>=0&&q.correctIndex<4,q.id);
   assert.ok(q.explanation.length>=25,q.id);
   const t=q.text.toLowerCase().replace(/\s+/g,' ').trim();
   const core=coreSignature(q);
   assert.ok(!cores.has(core),q.id+' conceptual repeat within session');cores.add(core);
   assert.ok(!inDay.has(t),q.id+' repeated question in the same session');inDay.add(t);
   if(q.difficulty==='grade10-12'){
    upgraded++;
    assert.ok(q.text.length>=65,q.id+' should contain a substantial analytical problem');
    assert.ok(q.explanation.length>=60,q.id+' missing analytical rationale');
    assert.ok(!allTexts.has(t),q.id+' repeated advanced question across days');
    allTexts.add(t);
   }
  }
 }
 assert.equal(day.challenge[0].difficulty,'grade10-12');
 assert.equal(day.test[0].difficulty,'grade10-12');
}
assert.equal(upgraded,560);
console.log('PASS: 20 Language days, 560 advanced-bank questions, 560 revised grade 10-12 items and duplicate/answer checks.');
