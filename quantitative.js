'use strict';
/* Quantitative curriculum: 18 topic sessions + 2 review sessions,
   20 learning papers, 10 mock-phase papers, 10 reserve papers.
   Files are not assumed present; only explicit manifest paths are loadable. */
const QCFG=window.HSPT_QUANT_CONFIG;
let quantPaperQuiz=null,quantPaperTimer=null;
function quantState(){
 state.quantTopicsReviewed??={};
 state.quantPaperAttempts??=[];
 return state;
}
function quantSession(day){
 let sessions=0;
 for(let d=1;d<=Math.min(day,TOTAL_DAYS);d++){
  if(chosenSubjects(d).includes('quantitative'))sessions++;
 }
 return sessions;
}
function quantCurrentLearningDay(session){
 for(let day=1;day<=TOTAL_DAYS;day++){
  if(chosenSubjects(day).includes('quantitative')&&quantSession(day)===session)return day;
 }
 return null;
}
function quantGroup(paperNumber){return paperNumber<=20?'learning':paperNumber<=30?'mock':'reserve';}
function quantPaperLink(slot){
 if(!slot||!slot.path)return '';
 const path=slot.path.trim();
 if(!/^output\/[a-zA-Z0-9_./-]+\.(?:json|pdf)$/i.test(path)||path.includes('..'))return '';
 return path;
}
function quantPaperBest(paper){
 const scores=(state.quantPaperAttempts||[]).filter(x=>x.paper===paper).map(x=>x.score);
 return scores.length?Math.max(...scores):null;
}
function quantTopicCard(index){
 const title=QCFG.topics[index];
 const session=index+1,day=quantCurrentLearningDay(session);
 const covered=!!state.quantTopicsReviewed?.[session];
 return '<div class="quant-topic '+(covered?'quant-covered':'')+'">'+
 '<div class="quant-topic-no">SESSION '+session+(day?' · DAY '+day:' · Flexible')+'</div>'+
 '<strong>'+safe(title)+'</strong><p class="small muted">Topic learning and question practice</p>'+
 '<div class="quant-topic-actions"><span class="pill '+(covered?'teal':'')+'">'+(covered?'✓ Concept reviewed':'Topic test: awaiting upload')+'</span>'+
 '<button class="btn tiny outline" data-quant-mark-topic="'+session+'">'+(covered?'Undo reviewed':'Mark concept reviewed')+'</button></div></div>';
}
function quantPaperCard(number){
 const slot=QCFG.paperSlots[number-1],file=quantPaperLink(slot),best=quantPaperBest(number),status=file?'File linked':'Awaiting paper';
 let label=number<=20?'Learning paper '+number:number<=30?'Mock Day '+(number+30)+' paper '+number:'Reserve paper '+number;
 return '<div class="quant-paper '+(file?'quant-linked':'')+'" data-paper-number="'+number+'"><div class="quant-paper-top"><strong>'+safe(label)+'</strong>'+
 '<span class="pill '+(file?'teal':'')+'">'+safe(status)+'</span></div>'+
 '<p class="small muted">52 questions · 28 minutes · '+(best===null?'Not attempted':'Best '+best+'%')+'</p>'+
 (file?(slot.format==='json'?'<button class="btn tiny primary" data-quant-paper="'+number+'">Start 28-minute paper →</button>':
 '<a class="btn tiny outline" href="'+safe(file)+'" target="_blank" rel="noopener noreferrer">Open PDF paper ↗</a>'):
 '<button class="btn tiny outline" disabled>Paper not uploaded</button>')+'</div>';
}
function renderQuantitative(){
 const root=$('quantitativePlan');if(!root||!QCFG)return;
 quantState();
 const selected=chosenSubjects(selectedDay).includes('quantitative');
 const session=selected?quantSession(selectedDay):null;
 const count=QCFG.paperSlots.filter(slot=>!!quantPaperLink(slot)).length;
 const totalReviewed=Object.values(state.quantTopicsReviewed||{}).filter(Boolean).length;
 root.innerHTML='<div class="quant-heading"><div><div class="kicker">QUANTITATIVE SKILLS · 20 LEARNING SESSIONS</div><h2 class="section-title">18 topics + 2 mixed review sessions</h2><p class="medium muted">Learn a topic and practise its question types. Individual topic tests are placeholders until you upload them. Each full paper will contain 52 questions with a 28-minute challenge timer.</p></div>'+
 '<div class="quant-head-stat"><b>'+totalReviewed+' / 20</b><span>Topics reviewed</span></div></div>'+
 (selected&&session>=1&&session<=20?'<div class="quant-today"><b>Selected learning day '+selectedDay+' · Quantitative session '+session+'</b>'+
 '<p>Topic: '+safe(QCFG.topics[session-1])+' · Reserved full paper: #'+session+'</p>'+
 '<div class="row"><button class="btn tiny outline" data-quant-jump-topic="'+session+'">Go to today’s topic ↓</button>'+
 '<button class="btn tiny outline" data-quant-jump-paper="'+session+'">Go to paper #'+session+' ↓</button></div></div>':'')+
 '<div class="quant-topic-grid">'+QCFG.topics.map((_,i)=>quantTopicCard(i)).join('')+'</div>'+
 '<div class="quant-paper-section"><div class="kicker">FULL PAPERS · 52 QUESTIONS / 28 MIN</div><h3>Paper allocation</h3>'+
 '<p class="hint">'+count+' of 40 paper files are currently linked in this repository. A paper is not playable until its file is uploaded and mapped in quantitative-config.js.</p>'+
 '<div class="quant-paper-tabs"><button class="btn tiny outline" data-quant-filter="learning">Papers 1–20 · Learning</button>'+
 '<button class="btn tiny outline" data-quant-filter="mock">Papers 21–30 · Mock days</button>'+
 '<button class="btn tiny outline" data-quant-filter="reserve">Papers 31–40 · Reserve</button></div>'+
 '<div class="quant-paper-grid">'+QCFG.paperSlots.map(slot=>quantPaperCard(slot.paperNumber)).join('')+'</div></div>'+
 '<div class="quant-note"><b>Other practice</b><p class="small muted">The existing short sample questions below are optional practice. They are not the 52-question papers or the individual topic tests.</p></div>';
 if(quantPaperQuiz)renderQuantPaperQuiz();
}
function quantScroll(selector){
 const id=Number(selector.dataset.quantJumpTopic||selector.dataset.quantJumpPaper);
 const target=selector.dataset.quantJumpTopic?
  document.querySelectorAll('.quant-topic')[id-1]:document.querySelectorAll('.quant-paper')[id-1];
 target?.scrollIntoView({behavior:'smooth',block:'center'});
}
function stopQuantPaperTimer(){if(quantPaperTimer!==null){clearInterval(quantPaperTimer);quantPaperTimer=null;}}
function quantPaperNormalize(data,number){
 if(!Array.isArray(data?.questions)||data.questions.length!==52)throw Error('Paper '+number+' must contain exactly 52 questions.');
 const ids=new Set(),labels=['A','B','C','D'];
 return data.questions.map((q,i)=>{
  const options=q.options||q.choices;
  const raw=Array.isArray(options)?options:options&&labels.every(k=>typeof options[k]==='string')?labels.map(k=>options[k]):null;
  if(!q.prompt||!raw||raw.length!==4||raw.some(x=>typeof x!=='string')||new Set(raw).size!==4)throw Error('Invalid answer choices on paper '+number+', question '+(i+1));
  const expected=q.correct_option||q.answer;
  const correct=labels.includes(expected)?labels.indexOf(expected):raw.indexOf(expected);
  if(correct<0)throw Error('Missing correct answer on paper '+number+', question '+(i+1));
  const id=String(q.question_id||q.id||number+'-'+(i+1));
  if(ids.has(id))throw Error('Duplicate question ID on paper '+number);
  ids.add(id);
  return {id,prompt:String(q.prompt),choices:raw.map((v,j)=>labels[j]+'. '+v),answer:labels[correct]+'. '+raw[correct],
   explanation:String(q.explanation||'Explanation unavailable.'),stimulus:q.stimulus,
   topic:String(q.syllabus_topic||''),type:String(q.archetype||'Quantitative'),
   mediaSvg:q.media?.content_type==='image/svg+xml'&&typeof q.media.svg==='string'?q.media.svg:null};
 });
}
function quantPaperStimulus(item){
 let html='';
 if(item.stimulus&&typeof item.stimulus==='object'&&!Array.isArray(item.stimulus)){
  html+='<div class="quant-stimulus">'+['A','B','C'].filter(k=>item.stimulus[k]).map(k=>'<div><b>('+k+')</b> '+safe(String(item.stimulus[k]))+'</div>').join('')+'</div>';
 }else if(typeof item.stimulus==='string'&&item.stimulus!==item.prompt){html+='<div class="quant-stimulus">'+safe(item.stimulus)+'</div>';}
 if(item.mediaSvg){
  const src='data:image/svg+xml;charset=utf-8,'+encodeURIComponent(item.mediaSvg);
  html+='<div class="quant-figure"><img alt="Diagram for this quantitative question" loading="lazy" src="'+src+'"></div>';
 }
 return html;
}
async function startQuantPaper(number){
 const slot=QCFG.paperSlots[number-1],file=quantPaperLink(slot);
 if(!file||slot.format!=='json'){toast('This paper has not been uploaded in an interactive format yet.');return;}
 stopQuantPaperTimer();
 try{
  const response=await fetch(file,{cache:'no-cache'});
  if(!response.ok)throw Error('Cannot load '+file+' (HTTP '+response.status+')');
  const questions=quantPaperNormalize(await response.json(),number);
  quantPaperQuiz={paper:number,questions,answers:{},deadline:Date.now()+QCFG.practiceMinutes*60*1000,submitted:false};
  renderQuantPaperQuiz();
  quantPaperTimer=setInterval(tickQuantPaper,1000);
  tickQuantPaper();
 }catch(err){toast('Paper unavailable: '+err.message);}
}
function tickQuantPaper(){
 const q=quantPaperQuiz;if(!q||q.submitted)return;
 const seconds=Math.max(0,Math.ceil((q.deadline-Date.now())/1000));
 const node=$('quantPaperClock');
 if(node)node.textContent=String(Math.floor(seconds/60)).padStart(2,'0')+':'+String(seconds%60).padStart(2,'0');
 const answered=$('quantPaperAnswered');
 if(answered)answered.textContent=Object.keys(q.answers).length+' / 52 answered';
 if(seconds===0)submitQuantPaper(true);
}
function renderQuantPaperQuiz(){
 const q=quantPaperQuiz;if(!q)return;
 const anchor=$('quantPaperRunner');if(!anchor)return;
 anchor.classList.remove('hidden');
 const scored=q.submitted?'<div class="exam-results"><h3>'+q.correct+' / 52 correct · '+q.score+'%</h3><p>Your result is saved in this browser. Review explanations below and retake whenever you wish.</p></div>':'';
 anchor.innerHTML='<div class="quant-paper-clock"><span>QUANTITATIVE PAPER #'+q.paper+' · 52 QUESTIONS</span>'+
 '<div><strong id="quantPaperClock">'+(q.submitted?'Finished':'28:00')+'</strong> <span id="quantPaperAnswered">'+Object.keys(q.answers).length+' / 52 answered</span></div></div>'+scored+
 q.questions.map((item,i)=>'<section class="mini-question"><div class="q-number">QUESTION '+(i+1)+' OF 52 · '+safe(item.type)+' · '+safe(item.topic)+'</div>'+
 '<h3>'+safe(item.prompt)+'</h3>'+quantPaperStimulus(item)+
 item.choices.map(choice=>'<label class="mini-option"><input type="radio" name="quant-q-'+i+'" data-quant-answer="'+i+'" value="'+safe(choice)+'" '+(q.answers[i]===choice?'checked':'')+' '+(q.submitted?'disabled':'')+'><span>'+safe(choice)+'</span></label>').join('')+
 (q.submitted?'<div class="answer-note">Correct: '+safe(item.answer)+' · '+safe(item.explanation)+'</div>':'')+'</section>').join('')+
 '<div class="row"><button class="btn primary" data-quant-'+(q.submitted?'retake':'submit')+'="'+q.paper+'">'+(q.submitted?'Retake paper ↻':'Submit paper →')+'</button>'+
 '<button class="btn outline" data-quant-close="1">Close paper</button></div>';
 if(!q.submitted)tickQuantPaper();
 anchor.scrollIntoView?.({behavior:'smooth',block:'start'});
}
function submitQuantPaper(auto=false){
 const q=quantPaperQuiz;if(!q||q.submitted)return;
 stopQuantPaperTimer();
 q.submitted=true;q.correct=q.questions.filter((item,i)=>q.answers[i]===item.answer).length;
 q.score=Math.round(q.correct*100/52);
 quantState();state.quantPaperAttempts.push({paper:q.paper,correct:q.correct,score:q.score,day:selectedDay,date:dateKey(),answered:Object.keys(q.answers).length,auto});
 state.questionSeen??={};
 q.questions.forEach((item,i)=>{if(q.answers[i]===undefined)return;const key='quantitative|paper-'+q.paper+'|'+item.id,entry=state.questionSeen[key]||{attempts:0,correct:0};entry.attempts++;if(q.answers[i]===item.answer)entry.correct++;state.questionSeen[key]=entry;});
 // On learning days, credit the scheduled quantitative session only when an entire paper was attempted and passed.
 const session=quantSession(selectedDay);
 if(q.paper<=20&&chosenSubjects(selectedDay).includes('quantitative')&&session===q.paper&&Object.keys(q.answers).length===52&&q.score>=70)markSubjectDone(selectedDay,'quantitative','full-paper');
 saveState();renderQuantPaperQuiz();renderQuantitative();
 if(auto)toast('The 28-minute timer ended. Your paper was scored.');
}
document.addEventListener('click',e=>{
 const btn=e.target.closest('button');if(!btn)return;
 if(btn.dataset.quantMarkTopic){const n=Number(btn.dataset.quantMarkTopic);quantState();state.quantTopicsReviewed[n]=!state.quantTopicsReviewed[n];saveState();renderQuantitative();return;}
 if(btn.dataset.quantFilter){document.querySelectorAll('.quant-paper').forEach(el=>{const num=Number(el.dataset.paperNumber);el.classList.toggle('hidden',quantGroup(num)!==btn.dataset.quantFilter)});return;}
 if(btn.dataset.quantJumpTopic||btn.dataset.quantJumpPaper){quantScroll(btn);return;}
 if(btn.dataset.quantPaper){startQuantPaper(Number(btn.dataset.quantPaper));return;}
 if(btn.dataset.quantSubmit){submitQuantPaper();return;}
 if(btn.dataset.quantRetake){startQuantPaper(Number(btn.dataset.quantRetake));return;}
 if(btn.dataset.quantClose){stopQuantPaperTimer();quantPaperQuiz=null;$('quantPaperRunner').classList.add('hidden');return;}
 if(btn.dataset.openQuantReserved){examSection='quantitative';setPage('exam');return;}
});
document.addEventListener('change',e=>{
 const n=e.target;if(n.matches('[data-quant-answer]')&&quantPaperQuiz&&!quantPaperQuiz.submitted){quantPaperQuiz.answers[Number(n.dataset.quantAnswer)]=n.value;tickQuantPaper();}
});
