/* Run with: node tests/validate-language-papers.js */
const fs=require('node:fs');
const path=require('node:path');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/language-papers-v2.json'),'utf8'));
const sessions=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/language-20day-curriculum-spelling.json'),'utf8')).sessions;
const assert=require('node:assert/strict');
assert.equal(data.tests.length,20);
assert.equal(data.practice.length,20);
assert.equal(sessions.length,20);
const book=JSON.parse(fs.readFileSync(path.join(__dirname,'../content/language-hspt-book-spelling.json'),'utf8'));
const allWords=sessions.flatMap(x=>x.words),allWordSet=new Set(allWords.map(x=>x.toLowerCase()));
assert.equal(allWords.length,317,'Expected 317 unique words');
assert.equal(allWordSet.size,317,'Spelling vocabulary must not repeat');
assert.equal(book.words.length,140,'Book spelling word count');
assert.ok(book.words.every(w=>allWordSet.has(w.toLowerCase())),'Every photographed book word must be in the curriculum');
const seen=new Set();
let checked=0;
for(let day=1;day<=20;day++){
 const paper=data.tests[day-1],practice=data.practice[day-1];
 assert.equal(paper.day,day);assert.equal(practice.day,day);
 assert.equal(paper.questions.length,60);assert.equal(practice.questions.length,15);
 assert.equal(paper.durationMinutes,25);
 assert.equal(paper.questions.filter(x=>x.group==='usage').length,30);
 assert.equal(paper.questions.filter(x=>x.group==='spelling').length,10);
 assert.equal(paper.questions.filter(x=>x.group==='composition').length,20);
 assert.ok(sessions[day-1].words.length>=15&&sessions[day-1].words.length<=16,'Day '+day+' word count');
 for(const q of [...paper.questions,...practice.questions]){
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options.map(x=>x.trim().toLowerCase())).size,4,q.id);
  assert.ok(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4,q.id);
  assert.ok(q.text.length>15&&q.explanation.length>20,q.id);
  assert.ok(!/\{[A-Za-z]+\}/.test(q.text+q.options.join(' ')),q.id);
  const signature=q.text+'|'+[...q.options].sort().join('~');
  assert.ok(!seen.has(signature),'Repeated question: '+q.id);
  seen.add(signature);checked++;
 }
}
console.log('PASS: '+checked+' unique Language questions, 20 full papers, 20 guided practices and 317 distinct spelling words (140 textbook words).');
