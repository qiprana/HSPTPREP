/* Run: node tests/validate-quantitative-practice.js */
'use strict';
const fs=require('node:fs');
const path=require('node:path');
const vm=require('node:vm');
const assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const dataRoot=path.join(root,'sections/quantitative/practice-papers');
const manifest=JSON.parse(fs.readFileSync(path.join(dataRoot,'manifest.json'),'utf8'));
assert.equal(manifest.collection_kind,'focused_practice');
assert.equal(manifest.test_count,20);
assert.equal(manifest.question_count,1040);
assert.equal(manifest.tests.length,20);

const window={};
const cfg=fs.readFileSync(path.join(root,'sections/quantitative/quantitative-config.js'),'utf8');
vm.runInNewContext(cfg,{window});
const config=window.HSPT_QUANT_CONFIG;
assert.equal(config.practicePaperSlots.length,20);
assert.equal(config.paperSlots.length,40);
assert.equal(config.topicPracticeMinutes,35);

const allIds=new Set();
let total=0,withMedia=0;
for(let session=1;session<=20;session++){
 const code=String(session).padStart(2,'0');
 const expected='test-'+code+'/questions.json';
 const entry=manifest.tests[session-1];
 assert.equal(entry.test_number,session);
 assert.equal(entry.files.json,expected);
 assert.equal(entry.question_count,52);
 assert.ok(Array.isArray(entry.focus_topics)&&entry.focus_topics.length>=1);
 assert.equal(config.practicePaperSlots[session-1].path,'sections/quantitative/practice-papers/'+expected);
 assert.equal(config.practicePaperSlots[session-1].format,'json');
 const paper=JSON.parse(fs.readFileSync(path.join(dataRoot,expected),'utf8'));
 assert.equal(paper.exam_id,'HSPT-QS-PRACTICE-20-T'+code);
 assert.equal(paper.time_limit_minutes,35);
 assert.equal(paper.questions.length,52);
 assert.deepEqual([...paper.focus_topics],[...entry.focus_topics]);
 const seen=new Set();
 for(const q of paper.questions){
  assert.ok(q.question_id&&!allIds.has(q.question_id),'Duplicate question ID '+q.question_id);
  allIds.add(q.question_id);
  assert.ok(typeof q.prompt==='string'&&q.prompt.length>10,'Missing question '+q.question_id);
  assert.ok(typeof q.explanation==='string'&&q.explanation.length>10,'Missing explanation '+q.question_id);
  assert.ok(['A','B','C','D'].includes(q.correct_option),'Bad answer '+q.question_id);
  const values=['A','B','C','D'].map(k=>q.options?.[k]);
  assert.ok(values.every(v=>typeof v==='string'&&v.trim()),'Missing choice '+q.question_id);
  assert.equal(new Set(values.map(v=>v.toLowerCase().trim())).size,4,'Duplicate choice '+q.question_id);
  const signature=JSON.stringify([q.prompt,q.stimulus,q.options,q.media?.svg]);
  assert.ok(!seen.has(signature),'Repeated question within paper '+q.question_id);
  seen.add(signature);
  if(q.media?.svg)withMedia++;
  total++;
 }
}
assert.equal(total,1040);
assert.equal(allIds.size,1040);

const index=fs.readFileSync(path.join(root,'index.html'),'utf8');
const runner=fs.readFileSync(path.join(root,'sections/quantitative/quantitative.js'),'utf8');
const focus=fs.readFileSync(path.join(root,'sections/quantitative/quantitative-practice.js'),'utf8');
assert.ok(index.includes('id="quantPracticeRunner"'),'Focused practice panel missing');
assert.ok(index.includes('quantitative-practice.js'),'Focused practice script not loaded');
assert.ok(index.indexOf('quantitative.js?v=')<index.indexOf('quantitative-practice.js?v='),'Practice must load after full runner');
assert.ok(focus.includes('state.quantPracticeAttempts'),'Practice score history missing');
assert.ok(!config.topics,'Old one-topic-per-day headings must be removed');
assert.ok(!runner.includes('quantTopicCard'),'Do not render duplicate concept cards');
assert.ok(!runner.includes('quantTopicsReviewed'),'Do not use independent concept-reviewed state');
assert.ok(runner.includes('id="quantPracticeCards"'),'Practice paper list missing');
assert.ok(focus.includes('quantFocusedManifest?.tests[session-1]?.focus_topics'),'Practice headings must come from paper manifest');
assert.ok(!focus.includes("querySelectorAll('.quant-topic')"),'Duplicate topic UI detected');
assert.ok(!index.includes('Mark concept reviewed'),'Redundant concept review control detected');

assert.ok(focus.includes('focused-practice'),'Practice completion tracking missing');
assert.ok(focus.includes('quantitative|practice-'),'Focused question history key missing');
assert.ok(runner.includes('quantitative|paper-'),'Full paper history key must remain unchanged');
new vm.Script(runner);
new vm.Script(focus);
const sandbox={window,renderQuantitative:()=>{},startQuantPaper:()=>{},setPage:()=>{},
 document:{addEventListener:()=>{}},state:{},console};
vm.createContext(sandbox);
vm.runInContext(focus,sandbox);
const first=vm.runInContext('quantFocusedPath(QCFG.practicePaperSlots[0])',Object.assign(sandbox,{QCFG:config}));
assert.equal(first,'sections/quantitative/practice-papers/test-01/questions.json');
console.log('PASS: 20 focused practice papers, 1,040 valid unique IDs, '+withMedia+' SVG questions; 35-minute timer, separate scoring, stable 40-paper runner and browser wiring.');
