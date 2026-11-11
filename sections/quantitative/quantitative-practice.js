'use strict';
/* Focused Quantitative practice: 20 uploaded 52-question papers.
   Separate from the 40 full-section papers and their score history. */
let quantFocusedQuiz=null,quantFocusedTimer=null,quantFocusedManifest=null,quantFocusedManifestRequested=false;
function quantFocusedState(){
 state.quantPracticeAttempts??=[];
 state.questionSeen??={};
 return state;
}
function quantFocusedPath(slot){
 const p=slot?.path;
 return typeof p==='string'&&/^sections\/quantitative\/practice-papers\/test-\d{2}\/questions\.json$/.test(p)?p:'';
}
function quantFocusedBest(session){
 const attempts=quantFocusedState().quantPracticeAttempts.filter(a=>a.session===session);
 return attempts.length?Math.max(...attempts.map(a=>a.score)):null;
}
async function quantFocusedLoadManifest(){
 if(quantFocusedManifestRequested)return;
 quantFocusedManifestRequested=true;
 try{
  const response=await fetch('sections/quantitative/practice-papers/manifest.json',{cache:'no-cache'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const manifest=await response.json();
  if(!Array.isArray(manifest.tests)||manifest.tests.length!==20)throw Error('Expected 20 papers');
  for(let i=0;i<20;i++){
   const item=manifest.tests[i],expected='test-'+String(i+1).padStart(2,'0')+'/questions.json';
   if(item.test_number!==i+1||item.files?.json!==expected||!Array.isArray(item.focus_topics))throw Error('Invalid manifest for session '+(i+1));
  }
  quantFocusedManifest=manifest;
 }catch(error){console.warn('Quantitative focused practice manifest unavailable',error);}
 quantFocusedRenderCards();
}
function quantFocusedCard(session){
 const slot=QCFG.practicePaperSlots[session-1],file=quantFocusedPath(slot);
 const best=quantFocusedBest(session),day=quantCurrentLearningDay(session);
 const topics=quantFocusedManifest?.tests[session-1]?.focus_topics;
 const label='Practice paper '+String(session).padStart(2,'0');
 const topicHtml=topics?.length
  ?'<div class="quant-focus-tags">'+topics.map(topic=>'<span class="quant-focus-tag">'+safe(topic)+'</span>').join('')+'</div>'
  :'<p class="small muted">Loading paper topics…</p>';
 return '<article class="quant-practice-card">'+
  '<div class="quant-topic-no">SESSION '+session+(day?' · DAY '+day:' · Flexible day')+'</div>'+
  '<h4>'+label+'</h4>'+
  '<div class="small muted">Topics covered</div>'+topicHtml+
  '<div class="quant-practice-footer"><span class="small muted">52 questions · 35 minutes</span>'+
  '<span class="pill '+(best===null?'':'teal')+'">'+(best===null?'Not attempted':'Best '+best+'%')+'</span></div>'+
  (file?'<button class="btn tiny primary" data-quant-practice="'+session+'">Start practice paper →</button>':
   '<button class="btn tiny outline" disabled>Practice paper unavailable</button>')+'</article>';
}
function quantFocusedRenderCards(){
 const root=$('quantitativePlan');
 if(!root||root.classList.contains('hidden'))return;
 const cards=root.querySelector('#quantPracticeCards');
 if(cards)cards.innerHTML=QCFG.practicePaperSlots.map((_,i)=>quantFocusedCard(i+1)).join('');
 const today=root.querySelector('#quantTodayPractice');
 if(today&&chosenSubjects(selectedDay).includes('quantitative')){
  const session=quantSession(selectedDay),topics=quantFocusedManifest?.tests[session-1]?.focus_topics;
  if(session>=1&&session<=20){
   today.innerHTML='<div class="kicker">TODAY’S QUANTITATIVE SESSION · DAY '+selectedDay+'</div>'+
    '<h3>Practice paper '+String(session).padStart(2,'0')+'</h3>'+
    (topics?.length?'<p>'+topics.map(safe).join(' · ')+'</p>':'<p class="muted">Loading practice topics…</p>')+
    '<button class="btn tiny primary" data-quant-practice="'+session+'">Start today’s practice →</button>';
  }
 }
}
function quantFocusedStop(){
 if(quantFocusedTimer!==null){clearInterval(quantFocusedTimer);quantFocusedTimer=null;}
}
function quantFocusedClose(){
 quantFocusedStop();quantFocusedQuiz=null;
 const runner=$('quantPracticeRunner');if(runner)runner.classList.add('hidden');
}
async function quantFocusedStart(session){
 const slot=QCFG.practicePaperSlots[session-1],file=quantFocusedPath(slot);
 if(!file){toast('Focused practice paper not found for this session.');return;}
 quantFocusedClose();
 stopQuantPaperTimer();
 quantPaperQuiz=null;
 $('quantPaperRunner')?.classList.add('hidden');
 try{
  const response=await fetch(file,{cache:'no-cache'});
  if(!response.ok)throw Error('HTTP '+response.status);
  const data=await response.json();
  const expected='HSPT-QS-PRACTICE-20-T'+String(session).padStart(2,'0');
  if(data.exam_id!==expected)throw Error('Incorrect practice paper ID for session '+session);
  if(!Array.isArray(data.questions)||data.questions.length!==52)throw Error('Practice paper must have 52 questions');
  const minutes=Number(data.time_limit_minutes);
  if(!Number.isFinite(minutes)||minutes<1||minutes>120)throw Error('Invalid timer duration');
  const questions=quantPaperNormalize(data,session);
  quantFocusedQuiz={session,questions,minutes,answers:{},deadline:Date.now()+minutes*60000,submitted:false};
  quantFocusedRenderQuiz();
  quantFocusedTimer=setInterval(quantFocusedTick,1000);
  quantFocusedTick();
 }catch(err){toast('Cannot load focused practice: '+err.message);}
}
function quantFocusedTick(){
 const q=quantFocusedQuiz;if(!q||q.submitted)return;
 const seconds=Math.max(0,Math.ceil((q.deadline-Date.now())/1000));
 const clock=$('quantPracticeClock');
 if(clock)clock.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
 const answered=$('quantPracticeAnswered');
 if(answered)answered.textContent=Object.keys(q.answers).length+' / '+q.questions.length+' answered';
 if(seconds===0)quantFocusedSubmit(true);
}
function quantFocusedRenderQuiz(){
 const q=quantFocusedQuiz;if(!q)return;
 const anchor=$('quantPracticeRunner');if(!anchor)return;
 anchor.classList.remove('hidden');
 const total=q.questions.length;
 const summary=q.submitted?'<div class="exam-results"><h3>'+q.correct+' / '+total+' correct · '+q.score+'%</h3><p>Focused practice score saved separately from your full papers. Review explanations below or retake this session.</p></div>':'';
 anchor.innerHTML='<div class="quant-paper-clock"><span>QUANTITATIVE · FOCUSED PRACTICE #'+q.session+' · '+total+' QUESTIONS</span>'+
 '<div><strong id="quantPracticeClock">'+(q.submitted?'Finished':String(q.minutes).padStart(2,'0')+':00')+'</strong> <span id="quantPracticeAnswered">'+Object.keys(q.answers).length+' / '+total+' answered</span></div></div>'+summary+
 q.questions.map((item,i)=>'<section class="mini-question"><div class="q-number">QUESTION '+(i+1)+' OF '+total+' · '+safe(item.type)+' · '+safe(item.topic)+'</div>'+
 '<h3>'+safe(item.prompt)+'</h3>'+quantPaperStimulus(item)+
 item.choices.map(choice=>'<label class="mini-option"><input type="radio" name="quant-practice-q-'+i+'" data-quant-practice-answer="'+i+'" value="'+safe(choice)+'" '+(q.answers[i]===choice?'checked':'')+' '+(q.submitted?'disabled':'')+'><span>'+safe(choice)+'</span></label>').join('')+
 (q.submitted?'<div class="answer-note">Correct: '+safe(item.answer)+' · '+safe(item.explanation)+'</div>':'')+'</section>').join('')+
 '<div class="row"><button class="btn primary" data-quant-practice-'+(q.submitted?'retake':'submit')+'="'+q.session+'">'+(q.submitted?'Retake practice ↻':'Submit practice →')+'</button>'+
 '<button class="btn outline" data-quant-practice-close="1">Close practice</button></div>';
 if(!q.submitted)quantFocusedTick();
 anchor.scrollIntoView?.({behavior:'smooth',block:'start'});
}
function quantFocusedSubmit(auto=false){
 const q=quantFocusedQuiz;if(!q||q.submitted)return;
 quantFocusedStop();
 q.submitted=true;q.correct=q.questions.filter((item,i)=>q.answers[i]===item.answer).length;
 q.score=Math.round(100*q.correct/q.questions.length);
 quantFocusedState();
 state.quantPracticeAttempts.push({session:q.session,correct:q.correct,score:q.score,day:selectedDay,date:dateKey(),answered:Object.keys(q.answers).length,auto});
 q.questions.forEach((item,i)=>{
  if(q.answers[i]===undefined)return;
  const key='quantitative|practice-'+q.session+'|'+item.id,entry=state.questionSeen[key]||{attempts:0,correct:0};
  entry.attempts++;if(q.answers[i]===item.answer)entry.correct++;state.questionSeen[key]=entry;
 });
 if(q.session===quantSession(selectedDay)&&chosenSubjects(selectedDay).includes('quantitative')&&
    Object.keys(q.answers).length===q.questions.length&&q.score>=70)
  markSubjectDone(selectedDay,'quantitative','focused-practice');
 saveState();quantFocusedRenderQuiz();renderQuantitative();
 if(auto)toast('The '+q.minutes+'-minute focused practice timer ended; answers were scored.');
}
const quantOriginalRender=renderQuantitative;
renderQuantitative=function(){quantOriginalRender();quantFocusedRenderCards();quantFocusedLoadManifest();};
const quantOriginalStartFull=startQuantPaper;
startQuantPaper=function(number){quantFocusedClose();return quantOriginalStartFull(number);};
const quantOriginalSetPage=setPage;
setPage=function(page){if(page!=='exam')quantFocusedClose();return quantOriginalSetPage(page);};
document.addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 if(button.dataset.quantPractice){quantFocusedStart(Number(button.dataset.quantPractice));return;}
 if(button.dataset.quantPracticeSubmit){quantFocusedSubmit();return;}
 if(button.dataset.quantPracticeRetake){quantFocusedStart(Number(button.dataset.quantPracticeRetake));return;}
 if(button.dataset.quantPracticeClose){quantFocusedClose();return;}
});
document.addEventListener('change',e=>{
 const node=e.target;
 if(node.matches('[data-quant-practice-answer]')&&quantFocusedQuiz&&!quantFocusedQuiz.submitted){
  quantFocusedQuiz.answers[Number(node.dataset.quantPracticeAnswer)]=node.value;
  quantFocusedTick();
 }
});
