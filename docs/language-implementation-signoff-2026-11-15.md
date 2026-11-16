# Language Section — Implementation and Editorial-Structure Sign-off

**Date:** November 15, 2026  
**Repository:** `qiprana/HSPTPREP`  
**Release target:** [HSPT Language](https://qiprana.github.io/HSPTPREP/language.html)  
**Scope:** Student-ready technical implementation and automated question-bank checks. Not a standardized psychometric or comprehensive independent human editorial certification.

## Inventory retained

| Component | Quantity |
| --- | ---: |
| Standard timed papers | 20 × 60 = 1,200 questions |
| Standard guided practice | 20 × 15 = 300 questions |
| Advanced practice | 20 × 8 = 160 questions |
| Advanced challenges | 20 × 12 = 240 questions |
| Advanced timed tests | 20 × 8 = 160 questions |
| Total question instances | **2,060** |
| Spelling questions within standard sessions | 260 |
| Distinct scheduled spelling words | 317, including 140 from supplied textbook lists |

## November upgrade delivered

1. **Advanced bank:** reauthored all 140 advanced Days 11–15 questions and all 140 Days 16–20 questions, with previously reauthored Days 7–10. Removed reused question cores in Days 1–6. The full 560-question bank has **zero exact repeated normalized cores** after removing scenario wrappers. All question IDs are retained, each item has four distinct options, a keyed answer, and an explanation. Correct-answer positions are balanced: **140 in each position (A–D)**.
2. **Standard guided practices and papers:** audited all 1,500 questions. Replaced duplicated grammar, composition, argument evaluation and guided practice questions, preserving each ID and the day/subject structure. The cross-day **exact normalized core-repeat count fell from 122 clusters affecting 757 items to zero**. No guided-practice item now repeats an identical full-paper core.
3. **Answer quality:** corrected at least 38 explanations incorrectly referring to a “first sentence” when the answer options were shuffled, plus 59 other position-dependent explanations and several phrasing/grammar issues. A test now rejects position-dependent answer explanations.
4. **Distractors:** replaced hundreds of repetitive or implausible composition choices with question-specific near misses, including cases that omit a comparison group, mishandle a concurrent cause, overgeneralize a sample, or mistake a process metric for an outcome. A first audit showed that **454/480 (94.6%)** of composition questions had the correct choice strictly longest; this fell to **169/480 (35.2%)**. A regression guard alerts if the ratio returns to 50% or above.
5. **Spelling:** the 317-word 20-day curriculum contains no duplicate word entries, covers the 140 book-sourced words, and supports 260 spelling questions in standard sessions. Checks validate the correct misspelling or “No mistakes” answer against the study list, with the legitimate ordinary word “board” recognized.
6. **Usability and completion:** 20 guided sessions, 20 advanced challenges, 20 standard timed papers, and the advanced-test bank retain their IDs and scoring data. Browser smoke tests cover Day 1 and Day 20 submissions, zero scores, saved completion, retake, timer expiry, refresh, and dashboard indicators; see GitHub Actions for the final run status.

## Automated checks and evidence

- `node tests/validate-language-papers.js`: 20 standard papers × 60, 20 guided practices × 15, spelling coverage, answer key ranges, unique options, **global zero repeated cores**, spelling-key integrity, answer-position prose checks, and composition answer-length threshold.
- `node tests/validate-language-advanced.js`: all 560 advanced questions, global zero repeated cores, correct/option validation, four answer positions equally represented.
- `node tests/validate-difficulty-coverage.js` and `node tests/report-language-repetition.js`.
- `tests/browser-completion-smoke.cjs` on Chromium, Firefox, and WebKit via GitHub Actions.
- GitHub Pages deployment workflow.

**Do not call the section independently standardized or independently human-reviewed:** automated validation confirms measurable structural properties, not that every possible near-synonym, grammar interpretation, or student-level difficulty is unambiguous. A real student trial or independent copy-editing pass may still identify improvements, which should be treated as ongoing feedback rather than a blocker to functional use.

## Recovery and next work

- Detailed engineering history and all remaining program priorities are recorded in [Issue #14](https://github.com/qiprana/HSPTPREP/issues/14).
- Vocabulary remains separately implemented and signed off for its student-requested choice upgrade.
- Next major student-content tasks are Verbal Skills difficulty/distractor review and Reading's unfinished passage/question upgrades.
