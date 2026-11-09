
'use strict';
let mockQuiz=null,mockInterval=null;
const MOCK_SECTIONS=[['verbal','Verbal Skills'],['quantitative','Quantitative'],['reading','Reading'],['mathematics','Mathematics'],['language','Language']];
const MOCK_PER_SUBJECT=6;
const MOCK_DURATION=30*60*1000;
function stopMockTimer(){if(mockInterval!==null){clearInterval(mockInterval);mockInterval=null;}}
function mockAnswered(){return mockQuiz?Object.keys(mockQuiz.answers).length:0;}
function mockPool(){
 const result=[];
 for(const subject of MOCK_SECTIONS){
  const id=subject[0],all=EXAM_QUESTIONS.filter(q=>q.section===id);
  const ranked=rand(all).sort((a,b)=>(state.questionSeen?.[id+'|'+a.prompt]?.attempts||0)-(state.questionSeen?.[id+'|'+b.prompt]?.attempts||0));
  result.push(...ranked.slice(0,MOCK_PER_SUBJECT).map(q=>({...q,choices:rand(q.choices)})));
 }
 return result;
}
function renderMocks(){
 $('mockDay').value=String(selectedMockDay);
 const history=(state.mockHistory||[]).filter(x=>x.day===selectedMockDay);
 const best=history.length?Math.max(...history.map(x=>x.score)):null;
 $('mockIntro').innerHTML='<div class="kicker">DAY '+selectedMockDay+' · PREVIEW '+(selectedMockDay-50)+' / 10</div>'+
  '<h2 class="section-title">Five-section diagnostic practice</h2>'+
  '<p class="medium muted">30 starter questions, six from each section, with a 30-minute countdown and explained answers. This is a diagnostic preview, NOT an official full-length HSPT exam.</p>'+
  '<div class="hint">Reserved Quantitative paper: #'+(selectedMockDay-30)+' (52 questions, 28 minutes), to be attached to Mock Day '+selectedMockDay+' when the complete paper files are available. <button class="btn tiny outline" data-open-quant-reserved="1">View Quantitative paper slots →</button></div>'+
  '<div class="mock-section-summary">'+MOCK_SECTIONS.map(x=>'<div><b>'+safe(x[1])+'</b><span>6 practice questions</span></div>').join('')+'</div>'+
  '<div class="row"><span class="pill">'+history.length+' previous attempt(s)</span><span class="pill teal">Best '+(best===null?'—':best+'%')+'</span>'+
  '<button class="btn primary" data-start-mock="1">Start / retake preview →</button></div>';
 if(!mockQuiz||mockQuiz.day!==selectedMockDay){
  $('mockBody').innerHTML='<p class="muted">Start a preview to practice all five sections. Your prior mock results remain saved in this browser.</p>';
  return;
 }
 drawMockPreview();
}
function startMockPreview(){
 stopMockTimer();
 mockQuiz={day:selectedMockDay,questions:mockPool(),answers:{},deadline:Date.now()+MOCK_DURATION,submitted:false};
 drawMockPreview();mockInterval=setInterval(updateMockTimer,1000);updateMockTimer();
}
function updateMockTimer(){
 if(!mockQuiz||mockQuiz.submitted)return;
 const remain=Math.max(0,Math.ceil((mockQuiz.deadline-Date.now())/1000));
 const text=String(Math.floor(remain/60)).padStart(2,'0')+':'+String(remain%60).padStart(2,'0');
 const timer=$('mockClock');if(timer)timer.textContent=text;
 const answered=$('mockAnswered');if(answered)answered.textContent=mockAnswered()+'/'+mockQuiz.questions.length+' answered';
 if(remain===0)submitMockPreview();
}
function drawMockPreview(){
 if(!mockQuiz)return;
 const q=mockQuiz;
 const summary=q.submitted?'<div class="exam-results"><h3>'+q.correct+'/'+q.questions.length+' correct · '+q.score+'%</h3>'+
 '<p>'+MOCK_SECTIONS.map(x=>x[1]+': '+q.questions.filter((item,i)=>item.section===x[0]&&q.answers[i]===item.answer).length+'/6').join(' · ')+'</p></div>':'';
 const sectionHTML=MOCK_SECTIONS.map(([id,name])=>{
  const entries=q.questions.map((item,i)=>({item,i})).filter(x=>x.item.section===id);
  const questions=entries.map(({item,i})=>{
   const choices=item.choices.map(choice=>{
    const chosen=q.answers[i]===choice,correct=q.submitted&&choice===item.answer,wrong=q.submitted&&chosen&&!correct;
    return '<label class="option '+(correct?'correct':wrong?'wrong':'')+'"><input type="radio" name="mock-q-'+i+'" data-mock-answer="'+i+'" value="'+safe(choice)+'" '+(chosen?'checked':'')+' '+(q.submitted?'disabled':'')+'><span>'+safe(choice)+'</span></label>';
   }).join('');
   return '<section class="quiz-question"><div class="q-number">Question '+(i+1)+' · '+safe(item.type)+'</div>'+
    (item.passage?'<div class="passage">'+safe(item.passage)+'</div>':'')+
    '<h4>'+safe(item.prompt)+'</h4><div class="quiz-options">'+choices+'</div>'+
    (q.submitted?'<div class="answer-note">Correct: '+safe(item.answer)+' · '+safe(item.explanation)+'</div>':'')+'</section>';
  }).join('');
  return '<div class="mock-group"><h3>'+safe(name)+' · '+entries.length+' questions</h3>'+questions+'</div>';
 }).join('');
 $('mockBody').innerHTML='<div class="mock-clock"><span>DIAGNOSTIC PREVIEW · '+q.questions.length+' questions</span><span><strong id="mockClock">'+(q.submitted?'Finished':'30:00')+'</strong> <span class="small muted" id="mockAnswered">'+mockAnswered()+'/'+q.questions.length+' answered</span></span></div>'+
 summary+sectionHTML+
 '<div class="quiz-footer"><p class="hint">'+(q.submitted?'Answers and explanations are shown above.':'You can submit early; unanswered questions count as incorrect.')+'</p>'+
 (q.submitted?'<button class="btn primary" data-retake-mock="1">Retake this preview ↻</button>':'<button class="btn primary" data-submit-mock="1">Submit and score →</button>')+'</div>';
}
function submitMockPreview(){
 if(!mockQuiz||mockQuiz.submitted)return;
 stopMockTimer();const q=mockQuiz;
 q.submitted=true;q.correct=q.questions.filter((item,i)=>q.answers[i]===item.answer).length;
 q.score=Math.round(q.correct/q.questions.length*100);
 state.mockHistory??=[];state.mockBest??={};state.questionSeen??={};
 state.mockHistory.push({day:q.day,score:q.score,correct:q.correct,total:q.questions.length,submitted:true,preview:true,date:dateKey()});
 state.mockBest[q.day]=Math.max(state.mockBest[q.day]||0,q.score);
 q.questions.forEach((item,i)=>{
  if(q.answers[i]!==undefined){
   const key=item.section+'|'+item.prompt;
   const record=state.questionSeen[key]||{attempts:0,correct:0};
   record.attempts++;if(q.answers[i]===item.answer)record.correct++;state.questionSeen[key]=record;
  }
 });
 saveState();renderMocks();
}
document.addEventListener('change',e=>{
 const input=e.target;
 if(input.matches('[data-mock-answer]')&&mockQuiz&&!mockQuiz.submitted){
  mockQuiz.answers[Number(input.dataset.mockAnswer)]=input.value;updateMockTimer();
 }
});
