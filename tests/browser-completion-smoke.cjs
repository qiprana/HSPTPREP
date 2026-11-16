/* Browser smoke test (Chromium, Firefox and WebKit via BROWSER). Run via GitHub Actions. */
'use strict';
const assert=require('node:assert/strict');
const {chromium,firefox,webkit}=require('playwright');
const BROWSER=process.env.BROWSER||'chromium';
const browserType={chromium,firefox,webkit}[BROWSER];
if(!browserType)throw new Error('Unknown browser: '+BROWSER);
const ROOT='http://127.0.0.1:8765';
async function run(){
 const browser=await browserType.launch({headless:true});
 const page=await browser.newPage();
 const errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 page.on('dialog',d=>d.accept());
 try{
  await page.goto(ROOT+'/reading-skills.html?day=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{const b=document.getElementById('practiceBtn');return b&&!b.disabled;});
  await page.locator('#practiceBtn').click();
  await page.locator('[data-choice="0"]').first().click();
  await page.evaluate(()=>{answers=questions.map(q=>(q.correctIndex+1)%4);finish(false);});
  assert.match(await page.locator('#workspace').innerText(),/GUIDED PRACTICE RESULTS/i);
  await page.reload();
  await page.waitForFunction(()=>{const b=document.getElementById('testBtn');return b&&!b.disabled;});
  let stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hspt-reading-v2')||'{}'));
  assert.equal(stored['1'].practice.score,0);
  assert.equal(stored['1'].practice.total,15);
  await page.locator('#testBtn').click();
  await page.evaluate(()=>{answers=questions.map(q=>(q.correctIndex+1)%4);finish(false);});
  assert.match(await page.locator('#workspace').innerText(),/FULL READING PAPER RESULTS/i);
  await page.reload();
  await page.waitForFunction(()=>{const b=document.getElementById('testBtn');return b&&!b.disabled;});
  stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('hspt-reading-v2')||'{}'));
  assert.equal(stored['1'].test.score,0);
  assert.equal(stored['1'].test.total,62);
  assert.ok((await page.locator('#dashboard').innerText()).includes('Practice ✓ Completed'));
  assert.ok((await page.locator('#dashboard').innerText()).includes('Full test ✓ Completed'));
  assert.match(await page.locator('#days').innerText(),/Day 1/);
  console.log('PASS: Reading practice and 62-question test submission, reload, and completed indicators.');
  // Exercise the real UI for retake, timed expiry and persistence (not just direct finish calls).
  await page.locator('#testBtn').click();
  assert.match(await page.locator('#timer').innerText(),/^23:00$/);
  await page.locator('[data-choice="0"]').first().click();
  await page.locator('#submit').click(); // dialog handler accepts incomplete submission
  assert.match(await page.locator('#workspace').innerText(),/FULL READING PAPER RESULTS/i);
  await page.locator('#again').click();
  await page.evaluate(()=>{seconds=1;});
  await page.waitForFunction(()=>finished===true,{timeout:5000});
  assert.match(await page.locator('#workspace').innerText(),/timer ended and the paper was scored/i);
  await page.reload();
  await page.waitForFunction(()=>{const b=document.getElementById('testBtn');return b&&!b.disabled;});
  assert.ok(await page.locator('#days .day.done').count(),'Retaken Reading test remains marked complete');
  console.log('PASS: Reading UI submit, retake, timed expiry, reload and completion state.');

  // One source-based, graded advanced challenge on each Reading day; keep practice/test progress independent.
  for(const advancedDay of [1,20]){
   await page.goto(ROOT+'/reading-skills.html?day='+advancedDay,{waitUntil:'domcontentloaded'});
   await page.waitForFunction(()=>document.getElementById('advancedBtn')?.disabled===false);
   await page.locator('#advancedBtn').click();
   assert.match(await page.locator('#workspace').innerText(),/Question 1 of 10/);
   assert.match(await page.locator('#workspace').innerText(),/Source:/);
   await page.evaluate(()=>{answers=questions.map(q=>(q.correctIndex+1)%4);finish(false);});
   await page.reload();
   await page.waitForFunction(()=>document.getElementById('advancedBtn')?.disabled===false);
   const saved=await page.evaluate(d=>JSON.parse(localStorage.getItem('hspt-reading-v2')||'{}')[d],String(advancedDay));
   assert.equal(saved.advanced.total,10);
   assert.equal(saved.advanced.score,0);
   assert.ok((await page.locator('#dashboard').innerText()).includes('Advanced ✓ Completed'));
  }
  console.log('PASS: Days 1 and 20 authentic Reading challenge loads, submission and persistence.');
  await page.goto(ROOT+'/language.html?day=1',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>{const b=document.getElementById('practiceBtn');return b&&!b.disabled;});
  for(const [mode,button,expected] of [['practice','#practiceBtn',23],['challenge','#challengeBtn',12],['test','#testBtn',60]]){
   await page.locator(button).click();
   await page.locator('[data-choice="0"]').first().click();
   await page.evaluate(()=>{answers=questions.map(q=>(q.correct+1)%4);finish(false);});
   assert.match(await page.locator('#workspace').innerText(),/RESULTS/i);
   await page.reload();
   await page.waitForFunction(()=>{const b=document.getElementById('testBtn');return b&&!b.disabled;});
   const p=await page.evaluate(()=>JSON.parse(localStorage.getItem('hspt-language-v1')||'{}')['1']);
   assert.equal(p[mode].score,0,mode+' zero score must count as submitted');
   assert.equal(p[mode].total,expected,mode+' question count');
  }
  assert.ok((await page.locator('#dashboard').innerText()).includes('✓ Practice submitted'));
  assert.ok((await page.locator('#dashboard').innerText()).includes('✓ Challenge submitted'));
  assert.ok((await page.locator('#dashboard').innerText()).includes('✓ Full test submitted'));
  assert.ok(await page.locator('#days .day.done').count(),'Full Language day should have completion checkmark');
  console.log('PASS: Language 23 practice, 12 challenge, and 60 test questions; reload and completed indicators.');

  await page.locator('#challengeBtn').click();
  assert.match(await page.locator('#timer').innerText(),/^8:00$/);
  await page.locator('#submit').click();
  assert.match(await page.locator('#workspace').innerText(),/ADVANCED CHALLENGE RESULTS/i);
  await page.locator('#again').click();
  await page.evaluate(()=>{seconds=1;});
  await page.waitForFunction(()=>finished===true,{timeout:5000});
  assert.match(await page.locator('#workspace').innerText(),/Time expired; answers were scored/i);
  await page.reload();
  await page.waitForFunction(()=>{const b=document.getElementById('testBtn');return b&&!b.disabled;});
  assert.ok(await page.locator('#days .day.done').count(),'Retaking or timing out Language challenge must retain completion');
  console.log('PASS: Language real UI submit, retake, timer expiry and persistence.');

  // Boundary coverage: last configured day loads the intended number of questions.
  await page.goto(ROOT+'/reading-skills.html?day=20',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('testBtn')?.disabled===false);
  await page.locator('#testBtn').click();
  assert.match(await page.locator('#workspace').innerText(),/Question 1 of 62/);
  await page.goto(ROOT+'/language.html?day=20',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('testBtn')?.disabled===false);
  await page.locator('#testBtn').click();
  assert.match(await page.locator('#workspace').innerText(),/Question 1 of 60/);
  console.log('PASS: Both subject day-20 paper endpoints load.');

  await page.goto(ROOT+'/index.html',{waitUntil:'load'});
  await page.evaluate(()=>{examSection='reading';setPage('exam');});
  const readingInfo=await page.locator('#readingPilotLink').innerText();
  assert.match(readingInfo,/1\/20 practices submitted/);
  assert.match(readingInfo,/1\/20 timed papers submitted/);
  assert.match(readingInfo,/2\/20 authentic close-reading challenges completed/);
  await page.evaluate(()=>{examSection='language';renderExam();});
  const languageInfo=await page.locator('#readingPilotLink').innerText();
  assert.match(languageInfo,/1\/20 practices submitted/);
  assert.match(languageInfo,/1\/20 tests submitted/);
  assert.match(languageInfo,/1\/20 advanced challenges submitted/);
  console.log('PASS: Overview reads completed Reading and Language attempts after navigation.');

  // Final Language day must support complete real submissions and keep completion
  // status after refresh for all three independent modes.
  await page.goto(ROOT+'/language.html?day=20',{waitUntil:'domcontentloaded'});
  await page.waitForFunction(()=>document.getElementById('practiceBtn')?.disabled===false);
  for(const [mode,selector,expected] of [
   ['practice','#practiceBtn',23],
   ['challenge','#challengeBtn',12],
   ['test','#testBtn',60]
  ]){
   await page.locator(selector).click();
   assert.match(await page.locator('#workspace').innerText(),new RegExp('Question 1 of '+expected));
   await page.evaluate(()=>{answers=questions.map(q=>(q.correct+1)%4);finish(false);});
   await page.reload();
   await page.waitForFunction(()=>document.getElementById('testBtn')?.disabled===false);
   const record=await page.evaluate(()=>JSON.parse(localStorage.getItem('hspt-language-v1')||'{}')['20']);
   assert.equal(record[mode].score,0,'Day 20 '+mode+' zero-score submission should persist');
   assert.equal(record[mode].total,expected,'Day 20 '+mode+' expected question count');
  }
  const languageDay20=await page.locator('#dashboard').innerText();
  for(const label of ['✓ Practice submitted','✓ Challenge submitted','✓ Full test submitted']){
   assert.ok(languageDay20.includes(label),'Day 20 missing dashboard status: '+label);
  }
  assert.ok(await page.locator('#days .day.done').count(),'Day 20 Language completion marker after refresh');
  console.log('PASS: Language Day 20 all three modes submit, persist scores and display completion after reload.');


  // Vocabulary word-choice UI: short stems, studied-only options, and
  // cumulative mixing across the actual rendered quiz (not only generator tests).
  await page.evaluate(()=>{selectedDay=50;activeKind='cumulative';setPage('challenges');startQuiz();});
  const vocabSnapshot=await page.evaluate(()=>{
   const qs=currentQuiz.questions.filter(q=>q.category==='Synonyms');
   return {
    count:currentQuiz.questions.length,
    visible:document.querySelectorAll('#challengeBody .quiz-question').length,
    shortStems:qs.every(q=>q.prompt.startsWith('Which studied word best means')),
    current:qs.filter(q=>WORDS.find(w=>w.key===q.studyWordKey)?.day===50).length,
    earlier:qs.filter(q=>WORDS.find(w=>w.key===q.studyWordKey)?.day<50).length,
    earlierDays:[...new Set(qs.map(q=>WORDS.find(w=>w.key===q.studyWordKey)?.day).filter(d=>d<50))].length,
    learnedChoices:qs.every(q=>q.choices.every(c=>WORDS.some(w=>w.word===c&&w.day<=50))),
    distinctChoices:qs.every(q=>q.choices.length===4&&new Set(q.choices).size===4)
   };
  });
  assert.equal(vocabSnapshot.count,60);
  assert.equal(vocabSnapshot.visible,60);
  assert.equal(vocabSnapshot.current,4);
  assert.equal(vocabSnapshot.earlier,8);
  assert.ok(vocabSnapshot.earlierDays>=5);
  assert.ok(vocabSnapshot.shortStems&&vocabSnapshot.learnedChoices&&vocabSnapshot.distinctChoices);
  await page.evaluate(()=>{stopQuizTimer();currentQuiz=null;});
  console.log('PASS: Day 50 Vocabulary cumulative challenge renders 60 questions with 4 current and 8 broadly distributed previous synonym-choice targets.');

  assert.deepEqual(errors,[],'No uncaught page script errors');
  console.log('PASS: '+BROWSER+' browser completion smoke test.');
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
