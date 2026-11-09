/* Run: node tests/validate-subject-navigation.js */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const assert=require('node:assert/strict');
const root=path.join(__dirname,'..');
const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const reading=fs.readFileSync(path.join(root,'reading-skills.html'),'utf8');
const language=fs.readFileSync(path.join(root,'language.html'),'utf8');
const oldReading=fs.readFileSync(path.join(root,'reading-day1.html'),'utf8');
assert.equal((index.match(/id="overviewSubjectPlan"/g)||[]).length,1,'Overview must have one editable subject plan');
assert.ok(!index.includes('id="overviewDays"'),'Remove redundant overview day grid');
assert.ok(!index.includes("$('overviewDays')"),'Remove dead duplicate grid renderer');
assert.ok(index.includes("let overviewPlanDay=firstIncomplete();"),'Open overview editor on next incomplete day');
assert.ok(index.includes("Diagnostic mock '+(i+1)"),'Mock previews must be clearly labeled');
assert.ok(index.includes("'./reading-skills.html?day='+day+'&focus=test'"),'Selected Reading day must open its paper');
assert.ok(index.includes("'./language.html?day='+day+'&focus=test'"),'Selected Language day must open its paper');
assert.ok(index.includes('language:25'),'Language section timer must be 25 minutes');
assert.ok(reading.includes('reading/reading-papers-v2.json'),'Reading loads its complete paper bank');
assert.ok(language.includes('content/language-papers-v2.json'),'Language loads its complete paper bank');
assert.ok(reading.includes('Select a learning session')&&language.includes('Select a learning session'),'Subject day selection heading must match');
assert.ok(reading.includes('20 distinct timed papers')&&language.includes('20 distinct timed papers'),'Each subject must show its paper count');
assert.ok(oldReading.includes('reading-skills.html?day=1'),'Legacy Reading link must redirect');
for(const [filename,html] of [['index.html',index],['reading-skills.html',reading],['language.html',language]]){
 const scripts=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(s=>s.trim());
 for(const js of scripts)assert.doesNotThrow(()=>new Function(js),filename+' JavaScript syntax');
}
console.log('PASS: One 60-day overview, 20-day Reading and Language links, matched interfaces, legacy redirect and JavaScript syntax.');
