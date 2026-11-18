# Reading — Implementation and Content Upgrade Sign-off

**Date:** November 18, 2026  
**Release:** https://qiprana.github.io/HSPTPREP/reading-skills.html  
**Scope:** Complete the dated engineering/content-upgrade backlog for passage length, generic questions, guided practice, Reading vocabulary structural QA and browser progress compatibility. This is NOT a claim of full authentic-source coverage or independent student-normed grade-level calibration.

## Delivered

| Area | Verified repository count | Notes |
| --- | ---: | --- |
| Timed Reading papers | 20 × 62 = 1,240 questions | Each has 4 passages × 10 comprehension + 22 vocabulary questions; 23-minute timer |
| Timed passages | 80 of 80 at least 350 words | Minimum 366 words; IDs unchanged |
| Guided practice | 20 × 15 = 300 questions | Each has one 350+ word text, 10 comprehension + 5 vocabulary; revised guided length range 353–390 words |
| Timed-question upgrade | 300 passage-specific questions across Days 11–20 passages 2–4 | 30 closing inference questions reauthored previously, 270 remaining template questions reauthored Nov 18 |
| Guided-question upgrade | 180 formerly templated comprehension questions | Nine per guided day individually reauthored; first comprehension item per day already individually authored |
| Reading vocabulary structural audit | 540 items: 440 timed + 100 guided | 430 meaning/synonym, 110 antonym. All contextual targets present, 540 unique words, valid 4-option keys. Corrected 33 contextual/duplication issues across two commits |
| Answer-length cue in revised comprehension | 125 of 480 (26%) | Unique longest correct answer; guard threshold under 40% |
| Student progress compatibility | IDs and score storage preserved | New content retains all existing question IDs, including vocabulary and guided IDs |

## Evidence and safeguards
- **Latest source bank:** `sections/reading/data/reading-papers-v2.json` (original schema retained).
- **Regression script:** `node tests/validate-reading-long-passages.js` now checks all 80 timed passages, 20 guided lengths, all 300 upgraded timed questions, all 180 guided items, unique 540 vocabulary targets, correct-answer leakage, stable identifiers and length bias.
- **Full bank validation:** `node tests/validate-reading-papers.js` checks question totals, IDs, options, answers, source labels and underlined vocabulary rendering.
- **Difficulty/schema check:** `node tests/validate-difficulty-coverage.js`.
- **Editorial diagnostic (non-blocking):** `node tests/report-reading-editorial-gaps.js`.
- **Automation:** `.github/workflows/validate-reading.yml` runs these on relevant commits. Successful validation was observed on content commit `d60dbda0`, and the expanded validator is being checked on `985b89f9`. A pass is necessary for engineering sign-off.
- **Browser completion:** Existing `tests/browser-completion-smoke.cjs` / GitHub Actions verifies submission, timer expiry, retakes and persistence. Successful run was observed on `eff43578` before the final text-only guided rewrites; later run status must be checked.
- **Deployment:** GitHub Pages builds must finish successfully on the final content revision before claiming the exact latest version live.

## Remaining distinctions: do not overclaim
- **Authentic-source coverage:** 35 of 80 timed passages carry explicit public-domain source metadata. The other 45 are **original synthetic passages** (not sourced quotations). These are substantive original high-school-level reading scenarios, not authentic published excerpts. The separate Advanced Reading collection has its own public-domain source passages. If the acceptance criterion is that *all* conventional timed passages be published authentic texts, this remains unfinished and would require matching new answer keys and passage-specific questions, not a cosmetic source tag.
- **Independent educational calibration:** Structural checks and contextual editorial work cannot establish psychometric norms for grades 10–12, nor can they rule out every borderline lexical interpretation in 540 vocabulary items. An independent student trial and blind specialist review remain optional further QA, not engineering features.
- **Physical-device review:** automated Chromium/Firefox/WebKit completion tests are not a substitute for real iPhone or Safari-on-macOS use.

**Implementation decision:** Timed/guided passage length, duplicate/generic-question remediation and automated structural QA are **completed and student-usable**. The separate all-authentic-excerpts editorial requirement is not certified complete; do not relabel original passages as externally sourced.
