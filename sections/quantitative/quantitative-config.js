/* Quantitative sources: 20 practice papers (topics from practice manifest),
   40 separate full-section papers. */
window.HSPT_QUANT_CONFIG = {
 version:3,
 topicPracticeMinutes:35,
 standardMinutes:30,
 practiceMinutes:28,
 questionsPerPaper:52,
 practicePaperSlots:Array.from({length:20},(_,i)=>({
   session:i+1,
   topicIndex:i,
   path:'sections/quantitative/practice-papers/test-'+String(i+1).padStart(2,'0')+'/questions.json',
   format:'json'
 })),
 paperSlots:Array.from({length:40},(_,i)=>({
   paperNumber:i+1,
   allocation:i<20?'learning':i<30?'mock':'reserve',
   path:'sections/quantitative/papers/test-'+String(i+1).padStart(2,'0')+'/questions.json',
   format:'json'
 }))
};
