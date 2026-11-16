/* Run with: node tests/validate-language-papers.js */
const fs=require('node:fs');
const path=require('node:path');
const data=JSON.parse(fs.readFileSync(path.join(__dirname,'../sections/language/data/language-papers-v2.json'),'utf8'));
const sessions=JSON.parse(fs.readFileSync(path.join(__dirname,'../sections/language/data/language-20day-curriculum-spelling.json'),'utf8')).sessions;
const assert=require('node:assert/strict');
assert.equal(data.tests.length,20);
assert.equal(data.practice.length,20);
assert.equal(sessions.length,20);
const book=JSON.parse(fs.readFileSync(path.join(__dirname,'../sections/language/data/language-hspt-book-spelling.json'),'utf8'));
const allWords=sessions.flatMap(x=>x.words),allWordSet=new Set(allWords.map(x=>x.toLowerCase()));
assert.equal(allWords.length,317,'Expected 317 unique words');
assert.equal(allWordSet.size,317,'Spelling vocabulary must not repeat');
assert.equal(book.words.length,140,'Book spelling word count');
assert.ok(book.words.every(w=>allWordSet.has(w.toLowerCase())),'Every photographed book word must be in the curriculum');
function coreSignature(q){
 const clean=s=>String(s).replace(/^In the day \d+ [^:]*? case:\s*/,'').replace(/^For a grade 10[–-]12 [^,]*? assessment,\s*/,'').replace(/^In the [^,]*? (practice|challenge|test) scenario,\s*/,'').toLowerCase().replace(/\s+/g,' ').trim();
 return clean(q.text)+'|'+q.options.map(clean).sort().join('~');
}
const seen=new Set(),conceptualSeen=new Map();
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
 for(const set of [paper.questions,practice.questions]){
 const coreInSession=new Set();
 for(const q of set){
  const core=coreSignature(q);
  assert.ok(!coreInSession.has(core),'Conceptual duplicate in same Language session: '+q.id);
  coreInSession.add(core);
  assert.equal(q.options.length,4,q.id);
  assert.equal(new Set(q.options.map(x=>x.trim().toLowerCase())).size,4,q.id);
  assert.ok(Number.isInteger(q.correctIndex)&&q.correctIndex>=0&&q.correctIndex<4,q.id);
  assert.ok(q.text.length>15&&q.explanation.length>20,q.id);
  assert.ok(!/\{[A-Za-z]+\}/.test(q.text+q.options.join(' ')),q.id);
  const signature=q.text+'|'+[...q.options].sort().join('~');
  const previousConcept=conceptualSeen.get(core);
  assert.ok(!previousConcept,'Repeated conceptual core between '+previousConcept+' and '+q.id);
  conceptualSeen.set(core,q.id);
  assert.ok(!seen.has(signature),'Repeated question: '+q.id);
  seen.add(signature);checked++;
 }
 }
}
// Spell-check distractor consistency, including 'No mistakes' choices, against
// all taught spellings plus verified ordinary vocabulary that also appears.
const spellingWords=new Set([...allWordSet,'board']);
const allLanguageQuestions=[...data.tests,...data.practice].flatMap(session=>session.questions);
let spellingQuestions=0;
for(const q of allLanguageQuestions){
 const named=q.explanation.match(/\b(?:the )?(first|second|third|fourth) (?:sentence|option|choice|answer)\b/i);
 assert.doesNotMatch(q.explanation,/\b(?:first|second|third|fourth) (?:sentence|option|choice|answer|thesis|interpretation|synthesis|phrasing)\b/i,
  'Explanation must not depend on a possibly shuffled answer position: '+q.id);
 if(named){
  const i={first:0,second:1,third:2,fourth:3}[named[1].toLowerCase()];
  assert.equal(q.correctIndex,i,'Explanation references wrong answer position: '+q.id);
 }
 if(q.group!=='spelling')continue;
 spellingQuestions++;
 assert.ok(q.options.includes('No mistakes.'),'Spelling question missing no-error alternative '+q.id);
 const correct=q.options[q.correctIndex];
 const invalid=q.options.filter(x=>x!=='No mistakes.'&&!spellingWords.has(x.toLowerCase()));
 if(correct==='No mistakes.')assert.equal(invalid.length,0,'No-mistakes item includes a misspelling: '+q.id);
 else assert.deepEqual(invalid,[correct],'Spelling key or distractors inconsistent with taught spelling list: '+q.id);
}
assert.equal(spellingQuestions,260,'Expected 200 timed-paper + 60 guided spelling questions');

console.log('PASS: '+checked+' unique Language questions, 20 full papers, 20 guided practices and 317 distinct spelling words and zero repeated conceptual cores (140 textbook words).');
