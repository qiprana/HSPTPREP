/* Quantitative learning plan. Map paper slots to actual uploaded files once present.
   The HSPTPREP main branch did not contain an output/ directory when this file was authored.
   Do not mark a paper available without a readable source file. */
window.HSPT_QUANT_CONFIG = {
 version:1,
 standardMinutes:30,
 practiceMinutes:28,
 questionsPerPaper:52,
 topics:[
  "Addition / Subtraction",
  "Multiplication / Division",
  "Operations involving fractions",
  "Fraction comparisons",
  "Operations involving decimals",
  "Distributive property",
  "Exponents & scientific notation",
  "Distributive property with variables",
  "Slope of a line",
  "Evaluating equations with variables",
  "Sum of angles",
  "Angles in a triangle",
  "Transversal and vertical angles",
  "Right angles",
  "Roman numerals",
  "Comparing objects",
  "Measurements",
  "Graphs and charts",
  "Mixed Review I — arithmetic and number reasoning",
  "Mixed Review II — algebra, geometry and data"
],
 topicTestSlots:Array.from({length:20},(_,i)=>({
   session:i+1,
   topicIndex:i,
   path:null,
   format:null
 })),
 paperSlots:Array.from({length:40},(_,i)=>({
   paperNumber:i+1,
   allocation:i<20?'learning':i<30?'mock':'reserve',
   path:null,
   format:null
 }))
};
