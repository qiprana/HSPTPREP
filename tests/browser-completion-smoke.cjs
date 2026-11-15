/* Browser smoke test (Chromium, local static site). Run via GitHub Actions. */
'use strict';
const assert=require('node:assert/strict');
const {chromium}=require('playwright');
const ROOT='http://127.0.0.1:8765';
async function run(){
 const browser=await chromium.launch({headless:true});
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
  await page.goto(ROOT+'/index.html',{waitUntil:'load'});
  await page.evaluate(()=>{examSection='reading';setPage('exam');});
  const readingInfo=await page.locator('#readingPilotLink').innerText();
  assert.match(readingInfo,/1\/20 practices submitted/);
  assert.match(readingInfo,/1\/20 timed papers submitted/);
  await page.evaluate(()=>{examSection='language';renderExam();});
  const languageInfo=await page.locator('#readingPilotLink').innerText();
  assert.match(languageInfo,/1\/20 practices submitted/);
  assert.match(languageInfo,/1\/20 tests submitted/);
  assert.match(languageInfo,/1\/20 advanced challenges submitted/);
  console.log('PASS: Overview reads completed Reading and Language attempts after navigation.');
  assert.deepEqual(errors,[],'No uncaught page script errors');
  console.log('PASS: Browser completion smoke test.');
 }finally{await browser.close();}
}
run().catch(e=>{console.error(e);process.exitCode=1;});
