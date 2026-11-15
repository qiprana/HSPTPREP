/* Editorial audit: diagnostic, not a substitute for independent human review.
 * Run: node tests/report-reading-editorial-gaps.js
 */
'use strict';
const fs = require('node:fs');
const path = require('node:path');
const bank = JSON.parse(fs.readFileSync(path.join(__dirname, '../sections/reading/data/reading-papers-v2.json'), 'utf8'));
const issues = [];
const counts = {};
const flag = (category, id, detail) => {
  counts[category] = (counts[category] || 0) + 1;
  issues.push({category, id, detail});
};
function words(s) { return String(s || '').trim().split(/\s+/).filter(Boolean).length; }
function auditQuestion(q, context, passageText) {
  const options = q.choices || [];
  const explanation = String(q.explanation || '');
  const prompt = String(q.prompt || '');
  if (/refer to the passage for the supporting detail|evidence:\s*.+refer to the passage/i.test(explanation))
    flag('non-specific explanation', q.id, context);
  if (passageText && /paragraph \d+/i.test(prompt) && !passageText.includes('\n'))
    flag('unverifiable paragraph reference', q.id, context);
  if (options.length === 4) {
    const sizes = options.map(words);
    if (Math.max(...sizes) >= 3 * Math.max(1, Math.min(...sizes)) && Math.max(...sizes) - Math.min(...sizes) >= 7)
      flag('strong option-length cue', q.id, context + ': ' + sizes.join('/'));
    const correct = options[q.correctIndex] || '';
    if (words(correct) >= 9 && options.filter(o=>words(o)>=9).length === 1)
      flag('only long choice is correct', q.id, context);
  }
  if (passageText && words(prompt) < 5)
    flag('very short comprehension stem', q.id, context);
}
for (const paper of bank.tests || []) {
  for (const passage of paper.passages || []) {
    const wc = words(passage.text);
    if (wc < 350) flag('timed passage below advanced 350-word target', passage.id, 'day ' + paper.day + ': ' + wc + ' words');
    for (const q of passage.questions || []) auditQuestion(q, 'timed day ' + paper.day, passage.text);
  }
  for (const q of paper.vocabularyQuestions || []) auditQuestion(q, 'vocabulary day ' + paper.day);
}
for (const practice of bank.practice || []) {
  if (words(practice.passage) < 350) flag('guided passage below advanced 350-word target', 'guided-' + practice.day, 'day ' + practice.day);
  for (const q of practice.questions || []) auditQuestion(q, 'guided day ' + practice.day, practice.passage);
}
const report = {note: 'Diagnostic only. Flags identify review candidates; no score or student progress is changed.', counts, totalFlags: issues.length, examples: issues.slice(0,60)};
console.log(JSON.stringify(report,null,2));
