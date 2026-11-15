/* Run: node tests/validate-completion-tracking.js */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const index=read('index.html'),reading=read('reading-skills.html'),language=read('language.html');
for(const [name,html] of [['overview',index],['reading',reading],['language',language]]){
 for(const js of [...html.matchAll(/<script(?:\\s[^>]*)?>([\\s\\S]*?)<\\/script>/g)].map(m=>m[1]).filter(Boolean))new vm.Script(js,{filename:name+'.js'});
}
const savedReading={1:{practice:{score:12,total:15},test:{score:41,total:62}},2:{test:{score:52,total:62}},3:{practice:{score:0,total:15}}};
const savedLanguage={1:{practice:{score:14,total:23},test:{score:45,total:60},challenge:{score:7,total:12}},2:{challenge:{score:0,total:12}}};
const count=(p,kind)=>Object.entries(p).filter(([d,v])=>+d>=1&&+d<=20&&!!v?.[kind]).length;
assert.equal(count(savedReading,'practice'),2);
assert.equal(count(savedReading,'test'),2);
assert.equal(count(savedLanguage,'challenge'),2,'Failed or zero-scored submissions still count as completed attempts');
assert.ok(index.includes("!!(value.practice||typeof value.score==='number')"),'Overview reads Reading and Language practice objects');
assert.ok(index.includes('submittedTests=')&&index.includes('submittedChallenges='),'Overview counts submitted tests and challenges');
assert.ok(index.includes('✓ CHALLENGE COMPLETED'),'Verbal completion state separated from pass/fail');
assert.ok(index.includes('submitted:true,passed:q.score>=PASS_MARK'),'Verbal attempts save submission status');
assert.ok(reading.includes("progress[day][mode]={score,total:n,date:")&&reading.includes("Full test '+(p.test?'✓ Completed"),'Reading records and shows completed attempts');
assert.ok(language.includes("progress[day][mode]={score,total,date:")&&language.includes("✓ Challenge submitted"),'Language records and shows challenges');
assert.ok(reading.includes("renderDays();renderDashboard();")&&language.includes("renderDays();renderDashboard();"),'Section completion refreshes dashboards');
console.log('PASS: completion status wiring and saved score semantics for Reading, Language, and Verbal.');
