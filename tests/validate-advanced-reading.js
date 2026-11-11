/* Run: node tests/validate-advanced-reading.js */
'use strict';
const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),vm=require('node:vm');
const root=path.resolve(__dirname,'..');
const read=p=>fs.readFileSync(path.join(root,p),'utf8');
const data=p=>JSON.parse(read(p));
const names=new Set(),passageTexts=new Set(),ids=new Set(),works=new Set();
const sources=[];
for(let day=1;day<=2;day++)for(let i=1;i<=4;i++){
 const code=String(i).padStart(2,'0');
 const p=data('sections/reading/data/advanced/day-'+String(day).padStart(2,'0')+'/passage-'+code+'.json');
 assert.equal(p.id,'ADV-D'+String(day).padStart(2,'0')+'-P'+i);
 assert.ok(p.title.length>10);
 assert.ok(p.wordCount>=350&&p.wordCount<=650,p.title+' must be within the 350-650 word editorial target');
 assert.equal(p.questions.length,10);
 assert.ok(p.source?.work&&p.source?.author&&p.source?.chapter);
 assert.ok(/^https:\/\/www\.gutenberg\.org\/ebooks\/[0-9]+$/.test(p.source.url));
 assert.ok(p.source.rights.includes('United States'));
 assert.ok(!passageTexts.has(p.text),'Duplicate Day 1 passage');
 passageTexts.add(p.text);works.add(p.source.work);
 for(const q of p.questions){
  assert.ok(!ids.has(q.id),'Repeated advanced question ID '+q.id);
  assert.ok(q.id.startsWith(p.id.replace('-P','-P')+'-Q')||q.id.startsWith(p.id+'-Q'),q.id+' wrong passage prefix');
  assert.ok(q.prompt.length>=30&&q.modelAnswer.length>=70,q.id+' incomplete analytical explanation');
  assert.ok(q.evidence.length>=10&&p.text.toLowerCase().includes(q.evidence.toLowerCase()),q.id+' evidence not found in its passage');
  assert.ok(q.skill.length>=4);
  assert.ok(!names.has(q.prompt.toLowerCase().trim()),q.id+' duplicate question text');
  names.add(q.prompt.toLowerCase().trim());ids.add(q.id);
 }
 sources.push(p.source.work);
}
assert.ok(works.size>=4);
assert.equal(ids.size,80,'Days 1–2 must contain 80 advanced questions');
const bank=data('sections/reading/data/advanced-passages-v1.json');
assert.equal(bank.gradeBand,'10-11');
assert.equal(bank.days.length,20);
assert.equal(bank.sources.length,8);
const longBank=bank.days.flatMap((d,i)=>{assert.equal(d.day,i+1);assert.equal(d.passages.length,4);return d.passages});
assert.equal(longBank.length,80);
assert.equal(new Set(longBank.map(p=>p.id)).size,80);
assert.equal(new Set(longBank.map(p=>p.text)).size,80,'Repeated authentic source passages in staged 20-day bank');
assert.ok(longBank.every(p=>p.source?.url&&p.source?.author&&p.reviewStatus==='pending'));
assert.ok(longBank.every(p=>p.questions.length===0),'Staged excerpts must not be assigned unrelated legacy questions');
const completed=data('sections/reading/data/advanced/complete-days-03-20.json');
assert.equal(completed.days.length,18,'18 additional practice days');
let extendedCount=0;
for(let d=3;d<=20;d++){
 const day=completed.days[d-3];
 assert.equal(day.day,d,'Advanced day in sequence');
 assert.equal(day.passages.length,4,'Four passages per advanced day');
 for(let i=0;i<4;i++){
  const p=day.passages[i];
  assert.equal(p.id,'ADV-D'+String(d).padStart(2,'0')+'-P'+(i+1));
  assert.ok(p.wordCount>=300&&p.wordCount<=650,p.id+' requires readable excerpt length');
  assert.ok(!/Project Gutenberg|1\\.E\\.\\d/.test(p.text),p.id+' contains distribution license');
  assert.ok(p.source?.url&&p.source?.author&&p.source?.excerptStart);
  assert.ok(!passageTexts.has(p.text),p.id+' repeated passage');
  passageTexts.add(p.text);
  assert.equal(p.questions.length,10);
  for(const q of p.questions){
   assert.ok(!ids.has(q.id),q.id+' repeated ID');ids.add(q.id);
   assert.ok(q.prompt.length>=90&&q.modelAnswer.length>=100);
   assert.ok(p.text.includes(q.evidence),q.id+' evidence does not appear in passage');
   assert.equal(q.answerType,'guided-rubric');
   assert.equal(q.reviewStatus,'requires-editorial-review');
   extendedCount++;
  }
 }
}
assert.equal(extendedCount,720);
assert.equal(ids.size,800);
const html=read('advanced-reading.html'),reading=read('reading-skills.html'),script=read('sections/reading/advanced-reading.js');
assert.ok(reading.includes('href="./advanced-reading.html"'),'Reading page must link advanced Day 1 pilot');
assert.ok(html.includes('800 evidence-based questions'));
assert.ok(html.includes('id="dayPicker"'));
assert.ok(script.includes('length:20'));
assert.ok(html.includes('sections/reading/advanced-reading.js'));
assert.ok(script.includes('hspt-reading-advanced-v1'),'Use independent student progress key');
assert.ok(!script.includes('hspt-reading-v2'),'Do not overwrite legacy Reading progress');
assert.ok(script.includes('advRevealState()'),'Require response and textual evidence before revealing model answer');
assert.ok(script.includes("answer.length<40||evidence.length<12"),'Require both analytical response and evidence');
new vm.Script(script);
const embedded=[...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(x=>x[1]).filter(Boolean);
for(const s of embedded)new vm.Script(s);
console.log('PASS: 20 advanced Reading days, 80 passages, 800 evidence-led questions (720 guided-rubric exercises awaiting editorial review); separate student progress and syntax checks.');
