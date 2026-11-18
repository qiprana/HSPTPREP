# HSPT Completion Checklist — Source of Truth

Last reviewed: 2026-11-17
Repository: qiprana/HSPTPREP
Live: https://qiprana.github.io/HSPTPREP/

## Operating rules
- This file is the persistent handoff for every subsequent work session. Read it before changing code, update it in the same commit as any completed work, and record the next precise task before ending.
- Status vocabulary: **TODO**, **IN PROGRESS**, **IMPLEMENTED / UNVERIFIED**, **TESTED**, **SIGNED OFF**. Never claim SIGNED OFF solely because files were generated or committed.
- Preserve existing student progress and question IDs when editing questions, unless a migration is explicitly planned.
- Each subject is signed off only after content QA, completion-state persistence, timed-test functionality, repeat/duplicate checks, and a deployed-site smoke test.
- Separate repo implementation, automated test results, and live GitHub Pages verification. A commit does not prove deployment.
- Prior chat claims and README descriptions are historical statements, **not** current independent test evidence.

## Priority order (user agreed November 17, 2026)

| Priority | Section / workstream | Current verified status | Acceptance criteria |
| --- | --- | --- | --- |
| 1 | Vocabulary | TODO — audit existing implementation before sign-off | All intended taught words available; daily and cumulative challenges use only words taught through that day; no duplicate question in same attempt; cumulative review revisits earlier days; one relevant multiple-choice question type has challenging **plausible answer choices**, not unnecessarily convoluted stems; pronunciation, meanings, review marking, timer, completion persistence and retakes work |
| 2 | Language | TODO — audit and complete | 20 learning sessions, daily challenges and full timed papers appropriately challenging for grade 10–12; broad topic coverage; no duplicate prompts per attempt; grammar and answer-key audit; test submission and completion flags correct |
| 3 | Verbal Skills | TODO — audit and complete | Synonyms, antonyms, analogies, logic and classification in daily/cumulative challenges; difficulty in choices as appropriate; unseen/cumulative mix; no duplicate questions per challenge; timers, scoring, explanations and completion persistence tested |
| 4 | Reading | TODO — separately audit remaining issues after priorities 1–3 | Real substantive grade 10–12 passages; questions require passage comprehension; all practice, challenges and 20 timed papers reviewed; underline references visible in stems and review; deduplication and completion tracking verified |
| 5 | Cross-section platform | TODO — test across sections | All challenges/tests start, pause where applicable, submit and finish; completion indicators agree with saved progress after reload; review/retakes work; mock days clearly distinguish diagnostics vs full-length exams; mobile UI and Pages smoke test |
| 6 | Quantitative/Mathematics | TODO — regression audit | Practice-paper mappings remain correct; 20 practice Quantitative + 40 timed Quantitative papers function; no wrong-section content; student progress intact |

## Verification checklist for each section
- [ ] Inventory actual data files, counts, question generators, and live links.
- [ ] Validate JSON/schema and unique stable IDs.
- [ ] Inspect content: grade level, grammatical accuracy, one unambiguous correct answer, plausible distractors, clear explanations.
- [ ] Detect identical/near-identical questions and duplicate choices, especially within one challenge.
- [ ] Verify daily questions match taught material; cumulative questions include previously taught material.
- [ ] Test day 1, middle day and last learning day; daily/cumulative challenges; 10 mock days as applicable.
- [ ] Test timer, submission, results, completed-state change, page refresh, repeat attempt, and browser persistence.
- [ ] Run automated tests and record command and output.
- [ ] Smoke-test the published GitHub Pages page and record live revision checked.
- [ ] Move status to **SIGNED OFF** with evidence, commit SHA, and date.

## Evidence / activity log
- **2026-11-17:** Created this checklist based on user's repeated request for persistent progress and completed, independently verified functionality. Current README reports 1,084 vocabulary entries, 98 original starter subject questions, Quantitative paper banks, and partial mock-paper coverage. These README claims require independent audit; no subject has been newly verified or signed off by this checklist creation.
- **Initial discovery:** Root README.md read successfully. GitHub code-search phrases 'vocabulary challenge', 'language challenge', and 'verbal challenge' returned no matches; these are inconclusive, not evidence of missing features.
- **Next action:** Inventory Vocabulary module files, inspect generator/selection logic and challenge completion, implement and test cumulative word-selection and distractor quality changes, then update this file with evidence. After Vocabulary is verified, proceed to Language, Verbal, Reading and platform QA.

## Session handoff
Current focus: **Vocabulary audit and completion**.
No completed QA or deployment verification is claimed yet.
