
'use strict';
/* Daily learning sequence: untimed concept check, then adjusted HSPT section timer.
   Verbal recall lives inside the daily vocabulary block to avoid double counting. */
let miniQuiz=null,miniTimer=null;
const QUICK_STANDARD={verbal:16,quantitative:30,reading:25,mathematics:45,language:25};
const QUICK_TIMES=Object.fromEntries(Object.entries(QUICK_STANDARD).map(([key,val])=>[key,val-2]));
function stopMiniTimer(){if(miniTimer!==null){clearInterval(miniTimer);miniTimer=null;}}
function sectionPool(subject,day){
 if(subject==='verbal')return makeVerbalChallenge(day,'daily').filter(q=>q.choices.includes(q.answer)).map(q=>({
  section:'verbal',type:q.category,prompt:q.prompt,answer:q.answer,choices:[...q.choices],explanation:q.explain||'',studyWords:q.studyWords||[]}));
 return EXAM_QUESTIONS.filter(q=>q.section===subject&&q.choices.includes(q.answer)).map(q=>({...q,choices:[...q.choices],explanation:q.explanation||''}));
}
function uniqueSelection(pool,subject,count,exclude=[]){
 const fingerprint=q=>String(q.prompt||'').trim().toLowerCase().replace(/\s+/g,' ')+'|'+(q.passage||'')+'|'+[...q.choices].map(x=>String(x).trim().toLowerCase()).sort().join('|');
 const omitted=new Set(exclude),unique=new Map();
 for(const q of rand(pool)){if(omitted.has(q.prompt)||!Array.isArray(q.choices)||new Set(q.choices).size!==q.choices.length)continue;const key=fingerprint(q);if(!unique.has(key))unique.set(key,q);}
 const shuffled=[...unique.values()];
 const unseen=shuffled.filter(q=>!state.questionSeen?.[subject+'|'+q.prompt]?.attempts);
 const seen=shuffled.filter(q=>state.questionSeen?.[subject+'|'+q.prompt]?.attempts)
  .sort((a,b)=>(state.questionSeen[subject+'|'+a.prompt]?.correct||0)-(state.questionSeen[subject+'|'+b.prompt]?.correct||0));
 return [...unseen,...seen].slice(0,count).map(q=>({...q,choices:rand(q.choices)}));
}
function perDayQuestionTarget(subject){
 const total=EXAM_QUESTIONS.filter(q=>q.section===subject).length;
 const pending=EXAM_QUESTIONS.filter(q=>q.section===subject&&!state.questionSeen?.[subject+'|'+q.prompt]?.attempts).length;
 const remaining=Math.max(1,20-sessionsCount(subject));
 return subject==='verbal'?Math.min(20,Math.max(8,Math.ceil(pending/remaining))):
  Math.min(total,Math.max(8,Math.ceil(pending/remaining)));
}
function recordQuestionAttempt(item,selected){
 if(selected===undefined)return;
 state.questionSeen??={};
 const key=item.section+'|'+item.prompt,record=state.questionSeen[key]||{attempts:0,correct:0};
 record.attempts++;if(selected===item.answer)record.correct++;state.questionSeen[key]=record;
}
function renderMiniPractice(){
 const panel=$('miniChallenge');
 if(!miniQuiz||miniQuiz.day!==selectedDay){panel.classList.add('hidden');return;}
 panel.classList.remove('hidden');
 const q=miniQuiz,subject=SUBJECTS.find(x=>x[0]===q.subject)?.[1]||q.subject,verbal=q.subject==='verbal';
 const info=verbal?'This recall check is included in the daily 20-minute vocabulary block. No extra Verbal learning time is added.':
  'First study the concepts for roughly 10 minutes, answer these three untimed questions, then take the timed section challenge.';
 const options=(item,i,selection,group,reveal)=>'<div class="mini-options">'+item.choices.map(choice=>{
  const chosen=choice===selection,correct=reveal&&choice===item.answer,wrong=reveal&&chosen&&!correct;
  return '<label class="mini-option '+(correct?'correct':wrong?'wrong':'')+'"><input type="radio" name="mini-'+group+'-'+i+'" data-mini-'+group+'="'+i+'" value="'+safe(choice)+'" '+(chosen?'checked':'')+' '+(reveal?'disabled':'')+'><span>'+safe(choice)+'</span></label>';
 }).join('')+'</div>';
 const card=(item,i,selection,group,reveal)=>'<article class="mini-question"><div class="q-number">'+(group==='prep'?'CONCEPT CHECK':'TIMED CHALLENGE')+' · '+(i+1)+'</div>'+
  (item.passage?'<div class="passage">'+safe(item.passage)+'</div>':'')+
  '<h3>'+safe(item.prompt)+'</h3>'+options(item,i,selection,group,reveal)+
  (reveal?'<div class="answer-note">Correct: '+safe(item.answer)+' · '+safe(item.explanation||'')+'</div>':'')+'</article>';
 let inner='<div class="mini-top"><div><div class="kicker">DAY '+q.day+' · '+safe(subject)+'</div><h2 class="section-title">Learn + practice + challenge</h2></div>'+
 '<span class="pill teal">'+(verbal?'20-minute vocabulary block':QUICK_TIMES[q.subject]+'-minute timed section')+'</span></div>'+
 '<div class="mini-lesson"><b>'+(verbal?'Vocabulary recall':'Concept learning · 10 minutes')+'</b><p class="medium muted">'+safe(info)+'</p></div>';
 if(q.stage==='prep'){
  const ready=Object.keys(q.prepAnswers).length===q.prep.length;
  inner+='<div class="mini-questions">'+q.prep.map((item,i)=>card(item,i,q.prepAnswers[i],'prep',q.prepAnswers[i]!==undefined)).join('')+'</div>';
  if(verbal){
   const correct=q.prep.filter((item,i)=>q.prepAnswers[i]===item.answer).length;
   inner+='<div class="quiz-footer"><span class="hint">'+Object.keys(q.prepAnswers).length+'/'+q.prep.length+' checked · finish with at least 4 correct</span>'+
    '<button class="btn primary" data-mini-finish-recall="1" '+(ready?'':'disabled')+'>Complete Verbal recall →</button></div>'+
    '<p class="hint">For additional speed practice, the optional 60-question Verbal test has a 16-minute countdown.</p>';
  }else{
   inner+='<div class="quiz-footer"><span class="hint">'+Object.keys(q.prepAnswers).length+'/'+q.prep.length+' concept questions checked</span>'+
    '<button class="btn primary" data-mini-start-timed="1" '+(ready?'':'disabled')+'>Start '+QUICK_TIMES[q.subject]+'-minute challenge →</button></div>';
  }
 }else{
  inner+='<div class="mini-sticky"><span>'+safe(subject)+' · Time remaining <small class="muted" id="miniCount">'+Object.keys(q.answers).length+'/'+q.questions.length+' answered</small></span>'+
   '<strong id="miniClock">'+(q.submitted?'Finished':QUICK_TIMES[q.subject]+':00')+'</strong></div>';
  if(q.submitted){
   inner+='<div class="exam-results"><h3>'+q.correct+'/'+q.questions.length+' correct · '+q.score+'%</h3>'+
    '<p>'+(q.passed?'Passed · Subject session recorded.':'Review your mistakes, then retake. Passing requires at least 70% and all answers attempted.')+'</p></div>';
  }
  inner+='<div class="mini-questions">'+q.questions.map((item,i)=>card(item,i,q.answers[i],'answer',q.submitted)).join('')+'</div>'+
   '<div class="quiz-footer"><span class="hint">Question-bank coverage is tracked separately from repeated attempts. A section timer uses standard time minus 2 minutes; available starter sets are not full exam papers.</span>'+
   (q.submitted?'<button class="btn primary" data-mini-retry="1">Retake challenge ↻</button>':'<button class="btn primary" data-mini-submit="1">Submit section →</button>')+'</div>';
 }
 panel.innerHTML='<div class="card pad">'+inner+'<div style="margin-top:13px"><button class="btn tiny outline" data-mini-close="1">Close</button></div></div>';
 if(q.stage==='timed'&&!q.submitted)updateMiniTimer();
}
function startMiniPractice(subject){
 if(!chosenSubjects(selectedDay).includes(subject))return;
 const pool=sectionPool(subject,selectedDay),count=subject==='verbal'?5:3;
 if(pool.length<count){toast('This question bank needs more questions before practice can begin.');return;}
 stopMiniTimer();
 miniQuiz={day:selectedDay,subject,stage:'prep',prep:uniqueSelection(pool,subject,count),prepAnswers:{},questions:[],answers:{},submitted:false,deadline:null};
 renderMiniPractice();
 $('miniChallenge').scrollIntoView?.({behavior:'smooth',block:'start'});
}
function startMiniTimed(){
 const q=miniQuiz;if(!q||q.subject==='verbal'||Object.keys(q.prepAnswers).length!==q.prep.length)return;
 const pool=sectionPool(q.subject,q.day),target=perDayQuestionTarget(q.subject);
 q.questions=uniqueSelection(pool,q.subject,target,q.prep.map(x=>x.prompt));
 if(q.questions.length<target){
  const excluded=q.questions.map(x=>x.prompt);
  q.questions.push(...uniqueSelection(pool,q.subject,target-q.questions.length,excluded));
 }
 if(!q.questions.length){toast('Question bank unavailable.');return;}
 q.stage='timed';q.answers={};q.submitted=false;q.deadline=Date.now()+QUICK_TIMES[q.subject]*60000;
 stopMiniTimer();renderMiniPractice();miniTimer=setInterval(updateMiniTimer,1000);updateMiniTimer();
}
function updateMiniTimer(){
 const q=miniQuiz;if(!q||q.submitted||q.stage!=='timed')return;
 const seconds=Math.max(0,Math.ceil((q.deadline-Date.now())/1000));
 const el=$('miniClock'),count=$('miniCount');
 if(el){el.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');el.style.color=seconds<=60?'#b43b32':'';}
 if(count)count.textContent=Object.keys(q.answers).length+'/'+q.questions.length+' answered';
 if(seconds===0)finishMiniPractice(true);
}
function finishVerbalRecall(){
 const q=miniQuiz;if(!q||q.stage!=='prep'||q.subject!=='verbal'||Object.keys(q.prepAnswers).length!==q.prep.length)return;
 const correct=q.prep.filter((item,i)=>q.prepAnswers[i]===item.answer).length;
 state.miniHistory??=[];
 state.miniHistory.unshift({day:q.day,subject:'verbal',type:'vocabulary-recall',score:Math.round(correct*100/q.prep.length),correct,total:q.prep.length,date:dateKey(),passed:correct>=4});
 saveState();
 if(correct>=4){markSubjectDone(q.day,'verbal','vocabulary-recall');toast('Verbal vocabulary recall completed within daily study time.');stopMiniTimer();miniQuiz=null;renderMiniPractice();}
 else{toast('Try the vocabulary recall again after reviewing the explanations.');startMiniPractice('verbal');}
}
function finishMiniPractice(timedOut=false){
 const q=miniQuiz;if(!q||q.stage!=='timed'||q.submitted)return;
 stopMiniTimer();q.submitted=true;q.correct=q.questions.filter((item,i)=>q.answers[i]===item.answer).length;
 q.score=Math.round(q.correct*100/q.questions.length);
 q.passed=Object.keys(q.answers).length===q.questions.length&&q.score>=70;
 state.miniHistory??=[];state.miniBest??={};
 state.miniHistory.unshift({day:q.day,subject:q.subject,score:q.score,correct:q.correct,total:q.questions.length,date:dateKey(),passed:q.passed,timedOut});
 state.miniBest[q.day+'|'+q.subject]=Math.max(state.miniBest[q.day+'|'+q.subject]||0,q.score);
 q.questions.forEach((item,i)=>recordQuestionAttempt(item,q.answers[i]));
 saveState();
 if(q.passed)markSubjectDone(q.day,q.subject,'timed-section');
 renderMiniPractice();
 if(timedOut)toast('The section timer ended and answers were scored.');
}
document.addEventListener('click',e=>{
 const button=e.target.closest('button');if(!button)return;
 if(button.dataset.miniFinishRecall){finishVerbalRecall();return;}
 if(button.dataset.miniStartTimed){startMiniTimed();return;}
 if(button.dataset.miniSubmit){finishMiniPractice();return;}
 if(button.dataset.miniRetry&&miniQuiz){startMiniPractice(miniQuiz.subject);return;}
 if(button.dataset.miniClose){stopMiniTimer();miniQuiz=null;renderMiniPractice();}
});
document.addEventListener('change',e=>{
 const input=e.target;if(!miniQuiz||miniQuiz.submitted)return;
 if(input.matches('[data-mini-prep]')&&miniQuiz.stage==='prep'){
  const i=Number(input.dataset.miniPrep);if(miniQuiz.prepAnswers[i]!==undefined)return;
  miniQuiz.prepAnswers[i]=input.value;recordQuestionAttempt(miniQuiz.prep[i],input.value);saveState();renderMiniPractice();
 }else if(input.matches('[data-mini-answer]')&&miniQuiz.stage==='timed'){
  miniQuiz.answers[Number(input.dataset.miniAnswer)]=input.value;updateMiniTimer();
 }
});
