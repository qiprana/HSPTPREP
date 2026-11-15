/* Run: node tests/validate-difficulty-coverage.js */
'use strict';
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const read=p=>JSON.parse(fs.readFileSync(path.resolve(__dirname,'..',p),'utf8'));
const reading=read('sections/reading/data/reading-papers-v2.json');
const language=read('sections/language/data/language-papers-v2.json');
const advanced=read('sections/language/data/language-advanced-v1.json');
let readingTimed=0,readingGuided=0,readingVocab=0,languageReasoning=0,languageSpelling=0,langAdvanced=0;
for(const paper of reading.tests){
 assert.equal(paper.passages.length,4);
 for(const p of paper.passages){
  assert.equal(p.questions.length,10);
  for(const q of p.questions){assert.equal(q.difficultyBand,'grade10-12',q.id+' not rewritten');readingTimed++;}
 }
 for(const q of paper.vocabularyQuestions)readingVocab++;
}
for(const p of reading.practice){
 assert.equal(p.questions.length,15);
 for(const q of p.questions.slice(0,10)){assert.equal(q.difficultyBand,'grade10-12',q.id+' not rewritten');readingGuided++;}
 readingVocab+=5;
}
for(const set of [...language.tests,...language.practice]){
 for(const q of set.questions){
  if(q.group==='spelling')languageSpelling++;
  else {assert.equal(q.difficultyBand,'grade10-12',q.id+' grammar/composition still basic');languageReasoning++;}
 }
}
for(const day of advanced.days)for(const q of [...day.practice,...day.challenge,...day.test]){
 assert.equal(q.difficultyBand,'grade10-12',q.id+' advanced bank unreviewed baseline');
 assert.ok(q.explanation.length>=60,q.id+' explanation too short');
 langAdvanced++;
}
assert.equal(readingTimed,800);
assert.equal(readingGuided,200);
assert.equal(readingVocab,540);
assert.equal(languageReasoning,1240);
assert.equal(languageSpelling,260);
assert.equal(langAdvanced,560);
console.log('PASS: Reading 800 timed + 200 guided comprehension rewritten, Language 1240 grammar/composition + 560 advanced rewritten. Reading 540 vocabulary and Language 260 spelling items checked separately for structure, not certified as advanced.');
