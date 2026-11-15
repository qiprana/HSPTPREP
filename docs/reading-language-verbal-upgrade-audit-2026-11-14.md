# HSPT Reading, Language, Verbal — Question Upgrade and QA

Date: 2026-11-14 (America/Los_Angeles)

## Delivered changes (repository main)

### Verbal Skills
- Daily and cumulative challenges across 50 learning days use the upgraded synonym, antonym, analogy, verbal-logic, and verbal-classification generators.
- Each generated challenge retains 60 questions in 16 minutes (12 synonyms, 10 antonyms, 10 analogies, 12 logic, 16 classification).
- Vocabulary distractors prefer same-part-of-speech candidates and closer lexical context, while logic now includes quantified statements, conditional necessity, and invalid inference.
- `tests/validate-vocabulary-verbal.js` checks all 50 days × two challenge types (one generated sample each), including 60-item distributions, answer availability, distinct choices, and no duplicate question signatures in a sample. Randomly generated challenges still require further stochastic and pedagogical QA.

### Reading
- All 20 timed papers retain 62 items (four passages × ten comprehension questions, plus 22 vocabulary questions).
- All **800 timed comprehension questions** have been rewritten with more emphasis on evidence, qualifications, inference, methodological reasoning, and appropriate conclusions. 40 Day-1 questions were directly authored; the later 760 use evidence-role templates tied to passage facts. Long options were subsequently shortened to protect timed usability.
- All **200 guided-practice comprehension questions** now reference the corresponding daily passage, instead of generic test-taking advice and mismatched topics.
- Reading vocabulary comprises 440 timed plus 100 guided items. It remains a distinct lexical bank and **has not received independent grade-10–12 difficulty calibration**.
- The separate **Advanced Reading** track holds 80 attributed public-domain excerpts and 800 analytical writing prompts. Days 1–2 have 80 passage-specific model responses; Days 3–20 have 720 self-assessment rubrics requiring independent editorial review. This track is untimed.
- The 20 conventional Reading timed papers still rely on *original synthetic short passages*, not full authentic literary and informational excerpts. Replacing them with longer authentic texts while maintaining verified keys is a distinct unfinished editorial task.

### Language
- All **1,240 non-spelling standard-bank questions** (20 full papers × 50 grammar/composition plus 20 guided sessions × 12) have been revised for advanced syntax, logical meaning, and argument evaluation, using rule-based scenarios and answer rationales.
- All **560 advanced-bank questions** (20 days × 8 practice + 12 challenge + 8 test) have been revised, with correct-choice and distractor reasoning.
- The 260 spelling questions (10 per full paper and three per guided practice) retain their curricular spelling purpose; the spelling list was not re-normed for grades 10–12.
- Several new items use topic-specific variations of shared grammatical templates. They are structurally distinct, but **not independently psychometrically calibrated or blind-reviewed for actual grade difficulty**.

### Submission and completion tracking
- Reading and Language record attempts under `progress[day][mode]` and update the day and dashboard views after submission.
- The overview reads the correct nested Reading/Language storage format and shows practice, test, and challenge submission counts.
- Completion is distinguished from passing; a zero-score submitted attempt remains a completed attempt.
- A complete day receives a checkmark only after all relevant modes are submitted; partial days receive a separate dot.
- The main overview refreshes subject progress when returning via the browser's back-forward cache (`pageshow`) or when storage changes in another tab.
- `tests/validate-subject-completion-runtime.js` simulates 100 submissions (20 days × Reading practice/test and Language practice/test/challenge), including failing scores. These are simulated DOM/handler tests, **not actual Safari/Chrome browser tests**.

## Automated QA

Run the project workflows:
- `tests/validate-vocabulary-verbal.js`
- `tests/validate-reading-papers.js`
- `tests/validate-language-papers.js`
- `tests/validate-language-advanced.js`
- `tests/validate-advanced-reading.js`
- `tests/validate-difficulty-coverage.js`
- `tests/validate-completion-tracking.js`
- `tests/validate-subject-completion-runtime.js`
- `tests/validate-subject-navigation.js`

These validate file structure, expected counts, answer-index bounds, duplicate signatures, recorded difficulty labels, JavaScript syntax, saved results, and completion refresh behavior. They **do not** establish that every answer is correct in context or that a question is normed for any particular grade.

## Pending before full educational sign-off

1. Independent editorial review of **all revised comprehension and Language question sets**, especially 20-day template variants and explanations. Remove any ambiguous distractors and confirm every keyed answer with the passage or grammar rule.
2. Confirm that difficulty really meets the requested grades 10–12 level through blind student trials, not merely `difficultyBand` labels or longer wording.
3. Replace the short synthetic Reading timed passages with authentic, source-verified, classroom-appropriate 350–650-word selections and individually verified questions, or explicitly retain them as a separate HSPT-speed mode.
4. Review all 540 Reading vocabulary and 260 Language spelling questions for advanced grade-level appropriateness, and verify source/meaning nuances.
5. Complete live browser UI checks on Safari, Chrome, and mobile: 100% attempt, zero-score submission, retake, timed expiry, browser refresh, browser Back, dashboard sync, and same-origin storage persistence.
6. Review timing: high-school-level close reading may warrant a slower advanced mode while the original HSPT exam-paced tests retain their stated duration.

**Status:** Large-scale content upgrade and automated structural/function QA completed; full **pedagogical** sign-off and live cross-browser sign-off remain pending.

## Follow-up verification (same session)

- **Chromium browser completion smoke test passed**: GitHub Actions [run 43684690733](https://github.com/qiprana/HSPTPREP/actions/runs/43684690733). Test opened the actual local static site, submitted 15/62-question Reading modes and 23/12/60-question Language modes, refreshed, verified persisted local scores and completion labels, and reopened the overview to check saved counts. It specifically tested zero-score submissions. This verifies a Chromium runner, not Safari/iPhone devices.
- Completed a versioned no-cache JSON loader refresh and added cross-page status refresh events for return navigation.
- Reading coverage: all 800 timed comprehension items, all 200 guided comprehension items revised; 540 vocabulary remain separate and have not been certified as advanced.
- Language coverage: all 1,240 standard non-spelling items and 560 advanced-bank items revised; 260 spelling items remain separate.
- **Cross-day Language question repetition remains an editorial weakness**: several templated cases preserve the same core premise and options across different days, even after changing topic labels. `tests/report-language-repetition.js` reports this explicitly in CI rather than claiming the duplicate-free structural test proves conceptual variety. A proposed bulk noun-replacement pass was rejected because it created collisions and was not deployed.
- The phrase 'grade10-12' on a question is a targeting label, not student-normed difficulty validation. Independently authored replacements, distractor review, and blind student testing remain necessary for a fully verified grade 10–12 question bank.
