"use strict";
const ADV_DAYS=Array.from({length:20},(_,i)=>i+1);
let advExtendedBank=null;
let advLoadRequest=0;
const ADV_FILES=day=>[1,2,3,4].map(i=>'./sections/reading/data/advanced/day-'+String(day).padStart(2,'0')+'/passage-0'+i+'.json');
let advDay=1;
const ADV_KEY='hspt-reading-advanced-v1';
let advPassages=[],advPassage=0,advQuestion=0,advProgress={};
const adv$=id=>document.getElementById(id);
const advEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
try{advProgress=JSON.parse(localStorage.getItem(ADV_KEY)||'{}')||{}}catch(err){advProgress={}}
function advSave(){try{localStorage.setItem(ADV_KEY,JSON.stringify(advProgress))}catch(err){}}
function advRecord(q){return advProgress[q.id]||(advProgress[q.id]={answer:'',evidence:'',revealed:false,status:''});}
function advStats(){
 const ids=advPassages.flatMap(p=>p.questions.map(q=>q.id));
 const marked=ids.filter(id=>['understood','review'].includes(advProgress[id]?.status));
 adv$('globalStatus').textContent=marked.length+' / '+ids.length+' questions reviewed · '+ids.filter(id=>advProgress[id]?.status==='review').length+' marked for further study. Progress is saved on this device.';
 adv$('overallBar').style.width=(ids.length?100*marked.length/ids.length:0)+'%';
}
function advRender(){
 adv$('dayPicker').innerHTML=ADV_DAYS.map(day=>'<button class="tab '+(day===advDay?'active':'')+'" data-adv-day="'+day+'">Day '+day+'</button>').join('');
 adv$('dayPicker').querySelectorAll('[data-adv-day]').forEach(b=>b.onclick=()=>advLoadDay(Number(b.dataset.advDay)));

 if(!advPassages.length)return;
 const paper=advPassages[advPassage],q=paper.questions[advQuestion],rec=advRecord(q);
 adv$('readingLayout').hidden=false;
 adv$('passagePicker').innerHTML=advPassages.map((p,i)=>{
 const completed=p.questions.filter(q=>advProgress[q.id]?.status).length;
 return '<button class="tab '+(i===advPassage?'active':'')+'" data-adv-passage="'+i+'"><strong>'+advEsc(p.source.work)+'</strong><span>'+completed+'/10 reviewed</span></button>';
 }).join('');
 adv$('passageInfo').innerHTML='<div class="kicker">PASSAGE '+(advPassage+1)+' OF 4 · '+advEsc(p.genre)+'</div>'+
 '<h2>'+advEsc(p.title)+'</h2><p class="source">'+advEsc(p.source.author)+' · '+advEsc(p.source.chapter)+
 ' · '+advEsc(p.source.publicationYear)+' · '+paper.wordCount+' words · <a target="_blank" rel="noopener noreferrer" href="'+
 advEsc(p.source.url)+'">Original work</a></p>'+
 (p.source.contextNote?'<p class="notes small muted">'+advEsc(p.source.contextNote)+'</p>':'');
 adv$('passageText').textContent=paper.text;
 const total=paper.questions.length,reviewed=paper.questions.filter(item=>advProgress[item.id]?.status).length;
 adv$('questionPanel').innerHTML='<div class="kicker">QUESTION '+(advQuestion+1)+' OF '+total+' · '+advEsc(q.skill)+'</div>'+
 '<p class="small muted">'+reviewed+' of '+total+' questions reviewed in this passage</p><div class="progress"><div style="width:'+(reviewed/total*100)+'%"></div></div>'+
 '<div class="question"><h2>'+advEsc(q.prompt)+'</h2>'+
 '<label class="field" for="advAnswer">Your interpretation (at least 40 characters)</label>'+
 '<textarea class="area" id="advAnswer" rows="4" placeholder="Explain your reasoning in your own words…">'+advEsc(rec.answer)+'</textarea>'+
 '<label class="field" for="advEvidence">Support it with a detail or quotation from the passage</label>'+
 '<textarea class="area evidence" id="advEvidence" rows="3" placeholder="Which line or detail supports your answer?">'+advEsc(rec.evidence)+'</textarea>'+
 (rec.revealed?'<div class="feedback"><div class="kicker">'+(q.answerType==='guided-rubric'?'RESPONSE GUIDE · EDITORIAL REVIEW PENDING':'MODEL ANSWER & SOURCE EVIDENCE')+'</div><p>'+advEsc(q.modelAnswer)+'</p>'+
 '<p><b>Evidence anchor:</b> '+advEsc(q.evidence)+'</p><p class="small muted">'+(q.answerType==='guided-rubric'?'This is a response guide, not a checked model solution. Evaluate your answer against the rubric and the excerpt.':'Compare with the model response. This exercise uses self-assessment, not automated scoring.')+'</p></div>':'')+
 '<div class="actions">'+(rec.revealed?'<button class="secondary" data-adv-status="review">Needs review</button>'+
 '<button class="primary" data-adv-status="understood">I understand this</button>':
 '<button class="primary" id="advReveal">Reveal model response</button>')+'</div></div>'+
 '<div class="actions"><button class="secondary" data-adv-step="-1" '+(advPassage===0&&advQuestion===0?'disabled':'')+'>← Previous</button>'+
 '<button class="secondary" data-adv-step="1" '+(advPassage===advPassages.length-1&&advQuestion===total-1?'disabled':'')+'>Next question →</button>'+
 (rec.status?'<span class="'+(rec.status==='review'?'review':'good')+'">'+(rec.status==='review'?'Needs review':'Reviewed')+'</span>':'')+'</div>';
 const saveInputs=()=>{rec.answer=adv$('advAnswer').value;rec.evidence=adv$('advEvidence').value;advSave();advRevealState();};
 adv$('advAnswer').addEventListener('input',saveInputs);
 adv$('advEvidence').addEventListener('input',saveInputs);
 const reveal=adv$('advReveal');
 if(reveal)reveal.onclick=()=>{rec.revealed=true;advSave();advRender()};
 adv$('questionPanel').querySelectorAll('[data-adv-step]').forEach(b=>b.onclick=()=>{
 const d=Number(b.dataset.advStep);let p=advPassage,n=advQuestion+d;
 if(n<0){p--;n=advPassages[p].questions.length-1}
 else if(n>=paper.questions.length){p++;n=0}
 advPassage=p;advQuestion=n;advRender();
 });
 adv$('questionPanel').querySelectorAll('[data-adv-status]').forEach(b=>b.onclick=()=>{rec.status=b.dataset.advStatus;advSave();advRender();});
 adv$('passagePicker').querySelectorAll('[data-adv-passage]').forEach(b=>b.onclick=()=>{advPassage=Number(b.dataset.advPassage);advQuestion=0;advRender()});
 advRevealState();advStats();
}
function advRevealState(){
 const b=adv$('advReveal');if(!b)return;
 const answer=adv$('advAnswer')?.value.trim()||'',evidence=adv$('advEvidence')?.value.trim()||'';
 b.disabled=answer.length<40||evidence.length<12;
 b.title=b.disabled?'Write your interpretation and identify evidence first.':'Compare with the model response.';
}
async function advLoadDay(day){
 if(!ADV_DAYS.includes(day))return;
 const ticket=++advLoadRequest;
 adv$('globalStatus').textContent='Loading Day '+day+' passages…';
 try{
  let papers;
  if(day<=2){
   papers=await Promise.all(ADV_FILES(day).map(async p=>{const r=await fetch(p,{cache:'no-cache'});if(!r.ok)throw Error('Cannot load '+p+' (HTTP '+r.status+')');return r.json()}));
  }else{
   if(!advExtendedBank){
    const r=await fetch('./sections/reading/data/advanced/complete-days-03-20.json',{cache:'no-cache'});
    if(!r.ok)throw Error('Cannot load advanced Reading bank (HTTP '+r.status+')');
    advExtendedBank=await r.json();
   }
   papers=advExtendedBank.days.find(x=>x.day===day)?.passages;
  }
  if(ticket!==advLoadRequest)return;
  if(!Array.isArray(papers)||papers.length!==4||papers.some((p,i)=>p.id!=='ADV-D'+String(day).padStart(2,'0')+'-P'+(i+1)||!Array.isArray(p.questions)||p.questions.length!==10))throw Error('Advanced day data invalid');
  advDay=day;advPassages=papers;advPassage=0;advQuestion=0;advRender();
 }catch(err){if(ticket===advLoadRequest)adv$('globalStatus').textContent='Advanced reading material could not be loaded. Please try reloading.';console.error(err)}
}
advLoadDay(1);
