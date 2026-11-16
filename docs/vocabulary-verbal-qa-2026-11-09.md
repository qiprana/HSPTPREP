# HSPT Prep — Vocabulary and Verbal Skills final implementation sign-off

**Date:** 2026-11-09  
**Repository:** `qiprana/HSPTPREP`, default branch `main`  
**Status:** **Implementation and source-metadata coverage signed off; automated regression checks passed.** Independent psychometric and live-browser verification remain separate activities.

## Vocabulary — signed off

- 1,084 unique keyed vocabulary entries distributed at runtime into 50 learning days (21–22 words daily). Original source `words-*.js` retains legacy day labels; runtime distribution is intentional.
- All 1,084 vocabulary words have a meaning, example sentence, root/word-parts field, part of speech and **non-empty synonym**.
- 1,055 words have a supplied antonym or contextual opposite; **29 words have no reliable direct antonym**, and instead carry an explicit `antonymStatus: "no-direct-antonym"` and rationale. The UI shows “No direct antonym for this meaning.” These 29 are excluded from exercises asking for a strict antonym.
- The previously incomplete 163 synonyms and 183 antonym fields have been reviewed and handled by either a sense-specific lexical entry or explicit no-direct-antonym classification; no unclassified blanks remain.
- Corrected *instinctively* from adjective to adverb; retained its legacy word key to preserve browser progress.
- Word learning, browser pronunciation, dictionary, needs-review flags and daily/cumulative challenge generation remain intact.
- **7,559 vocabulary question instances** across reverse definitions, meanings, synonyms, available antonyms, sentence context, syllables and analogies passed structural checks.

## Verbal Skills — signed off

- Fifty daily and fifty cumulative challenges, each containing **60 questions**.
- Per challenge: 12 synonyms, 10 genuine antonym questions, 10 analogies, 12 logical reasoning questions with three options (True/False/Uncertain), and 16 verbal classification questions.
- **6,000 generated question instances** were tested for category distribution, valid keys, nonduplicated choices, explanations and correct question counts.
- The optional 60-question full Verbal challenge uses a **16-minute countdown** consistently across the page and explanatory text.
- A Verbal learning session receives passing completion credit only with **all answers submitted and at least 70% correct**. Scores below threshold and incomplete attempts are recorded without incorrectly marking a session complete.
- Simulated perfect, failing and incomplete submissions verified correct behavior and persisted result records.

## Continuous quality safeguards

- `node tests/validate-vocabulary-verbal.js` checks all 1,084 entries, 50 study days, 29 no-direct-antonym exceptions, 7,559 vocabulary exercise cases, 100 Verbal sets, category distributions, answer keys, timer and scoring rules.
- `.github/workflows/validate-vocabulary-verbal.yml` runs the regression script on relevant changes.
- All regression checks were executed successfully against the repository source.

## Scope and remaining independent verification

The application is original HSPT preparation material, not official HSPT exams. Automated checks establish structural validity and test a broad sample of generated question combinations, but cannot prove that every antonym pair is unambiguous, every analogy is exam-calibrated, or every word definition is lexicographically perfect. A complete independent human review of all questions and cross-browser/mobile live GitHub Pages verification were **not** performed as part of this sign-off. The last ten cross-subject mock days remain separate diagnostic previews, outside this section's scope.

**Decision:** Sign off Vocabulary and Verbal Skills **implementation, content-field completion, and automated QA**. Do not describe the project as independently standardized, browser-certified, or psychometrically validated.


## November 15, 2026 — Student feedback: simple stems, harder studied-word choices

Scope: **only the 12 'Synonyms / choose the studied word' multiple-choice questions** in each 60-question daily or cumulative challenge. Other categories (antonyms, analogies, logic, and classification), study content and storage keys are unchanged.

- Replaced unnecessarily long context stems for this category with a concise definition prompt: *Which studied word best means …?*
- Correct answers and all three distractors are assigned **on or before** the selected day; same part of speech, distinct headwords, and a source-based check rejecting explicitly identical meaning/synonym pairs. Candidate ranking favors lexical sense overlap while excluding exact equivalents. Independent judgment is still needed for borderline semantic equivalents and whether every question is truly challenging.
- Daily challenge: 12 correct-answer words from that day, with earlier studied words among distractors when possible.
- Cumulative challenge after Day 1: **4 current-day + 8 previous-day** correct-answer words, with previous-day targets randomized across earlier days instead of repeatedly selecting Day 1–2.
- Generated 7,200 synonym-choice questions over all 50 days × both challenge types × 6 draws; structural, source-day, previous-day mix, and multi-day coverage checks passed in dry runs.
- Added automated regression checks for studied-only options, same part of speech, distribution across previous days, and stable four-choice format; [Vocabulary/Verbal validation workflow](https://github.com/qiprana/HSPTPREP/actions/workflows/validate-vocabulary-verbal.yml).
- Added Playwright browser smoke assertions for a rendered Day 50 cumulative challenge with 60 items and the new 4/8 question-source mix.
- Earlier November 15 CI on the original implementation failed because its test expected the *old prompt text*; the assertion was corrected, and [run 43777024003](https://github.com/qiprana/HSPTPREP/actions/runs/43777024003) passed. The subsequent cumulative-diversity and browser tests must be checked at their latest commit before marking final QA complete.

**Scope of sign-off:** working vocabulary implementation and student-requested focused question-style improvement, subject to final latest-commit CI. This does not establish psychometric grade-level norms or that every generated distractor has undergone human blind review.
