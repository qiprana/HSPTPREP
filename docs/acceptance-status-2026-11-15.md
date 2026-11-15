# HSPT Verbal, Reading and Language — acceptance status
Date: 2026-11-15

## Sign-off decision
**Functional regression sign-off: PASS for automated desktop browser engines, subject to device-specific manual testing.**
**Content / grade 10–12 editorial sign-off: NOT APPROVED.** Structural correctness and passing CI do not prove authentic reading, nuanced distractors, or calibrated grade-level difficulty.

## Verified
- Reading: 20 timed tests of 62 items and 20 guided practice sessions have structural validators. Existing IDs and student progress format remain stable.
- The complete Day 2 Reading timed paper now contains four original, 350+ word passages and 40 newly authored passage-specific analytical questions. This is not an authentic-source paper; rights/source claims have not been invented.
- Reading has an additional diagnostic audit for short passages, generic rationales and answer-length cues.
- Language: 20 timed tests and advanced challenge banks have structural validators, plus conceptual-duplicate checks *within* each practice/challenge/test session.
- Verbal: all 50 daily and cumulative configurations are sampled five times for 60-item distribution, unique prompts, distinct choices and valid keys.
- Verbal completed-attempt semantics now differ from passing: a fully answered submission records the session as completed even below 70%, while the pass label and score are retained.
- Playwright smoke tests for Reading/Language submission, zero-score attempts, persistence, retakes, timer expiry, dashboard counts and Day-20 entry passed in Chromium, Firefox and WebKit on GitHub-hosted Linux runners. WebKit is a useful Safari-engine check but is not a physical iPhone or macOS Safari test.
- The latest earlier GitHub Pages deployment completed successfully; consult Actions for the deployment state of subsequent commits.

## Outstanding content acceptance failures
1. Seventy-six of eighty timed Reading passages are still short/synthetic and have not received individual 350–650 word evidence-sensitive rewrites; authentic-source provenance and rights checks remain absent from conventional papers. Four Day 2 passages are improved original writing, not public-domain excerpts.
2. Reading vocabulary (540 guided/timed items) has not been independently reviewed for grade 10–12 lexical difficulty; the remaining passage distractors and keys need independent editorial review.
3. Language retains cross-day core repeats documented in `tests/report-language-repetition.js`; per-session uniqueness is not equivalent to cross-day diversity.
4. Verbal distractor nuances, synonym/antonym senses, and actual grade-level calibration remain subject to expert review and blind student trials.
5. No real Safari macOS / iPhone / Android device testing and no independent student-level difficulty trial have been completed.

## Acceptance rule
Do not mark any subject content fully signed off until (a) all published target questions have individually verified keys and distractors, (b) Reading source / rights records are complete for authentic reading modes, (c) semantic repeat audit passes agreed thresholds, and (d) the requested advanced difficulty is confirmed using student trials or an independent editorial rubric.

## Evidence
- Reading validator: https://github.com/qiprana/HSPTPREP/actions/runs/43751978447
- Language validator: https://github.com/qiprana/HSPTPREP/actions/runs/43752118752
- Verbal validator: https://github.com/qiprana/HSPTPREP/actions/runs/43751824373
- Cross-browser completion smoke: https://github.com/qiprana/HSPTPREP/actions/runs/43752034881
- GitHub Pages and latest runs: https://github.com/qiprana/HSPTPREP/actions
