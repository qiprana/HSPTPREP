# HSPTPREP — Five-Section HSPT Learning Studio

A GitHub Pages-friendly HSPT study site. No logins, frameworks or paid APIs.

## What is included

- 1,084 vocabulary entries: 664 from the previously extracted user-supplied HSPT book collection, **420 original advanced enrichment entries** for approximately grades 9–12. Two book words have separate senses.
- A 60-day journey: **50 learning days** with roughly 21–22 new vocabulary entries per day plus **two student-selected HSPT subjects**, followed by **10 mock-exam days**. The default 5-day rotation provides 20 sessions for each of the five subjects.
- Speech synthesis (browser voice), syllable guides, word-part study notes, examples, and searchable A–Z list.
- Five HSPT exam areas: Verbal Skills, Quantitative Skills, Reading, Mathematics and Language.
- 98 **original starter** subject-practice questions with explanations, separate score history, and optional scaled timers. Subject attempts track coverage of available questions.
- Local browser storage; import/export progress backup. Version 3 progress migrates to version 4 without deleting covered-word flags or review marks. Previous 40-day completions and scores remain in historical records, without falsely counting as 50-day completions.

## Daily subject pairing and time budget

- The recommended five-day rotation is: **Mathematics + Verbal/Vocabulary**, **Quantitative + Reading**, **Mathematics + Verbal/Vocabulary**, **Reading + Language**, **Quantitative + Language**. Repeat it ten times: each section receives **20 learning sessions**.
- Daily vocabulary is a single **20-minute** block. A brief Verbal recall check fits within that block rather than adding another study session on days paired with Mathematics.
- Each non-Verbal subject has **10 minutes of concept practice** followed by a timed section challenge. Challenge timers are **two minutes shorter** than the standard durations supplied for the plan: Verbal 14, Quantitative 28, Reading 23, Mathematics 43, Language 23 minutes.
- Add **5 minutes for review**. Recommended default day totals are **78, 96, 78, 91 and 96 minutes** per five-day cycle. Students can choose other subject pairs, so displayed times are recalculated automatically.
- Short concept questions are untimed; timed subject questions prioritize unseen items from the available bank and record distinct question coverage separately from repeat attempts. The optional 60-question Verbal exam is available with a **14-minute** timer.
- The 98-question starter bank is intentionally marked as sample practice. Complete section-size question sets and actual section coverage depend on additional bank uploads.

## Quantitative: 20 focused practice papers and 40 full-section papers

All 40 Quantitative papers are now stored in `sections/quantitative/papers/test-NN/questions.json`, accompanied by HTML, metadata and validation reports. The collection manifest is at `sections/quantitative/papers/manifest.json`; it lists **2,080 questions** total. Every paper has **52 questions** and the practice interface uses a **28-minute countdown** (two minutes below the provided 30-minute standard).

| Paper numbers | Allocation | Status |
| --- | --- | --- |
| 1–20 | Quantitative learning sessions 1–20 during Days 1–50 | Connected, playable |
| 21–30 | Quantitative portion of mock days 51–60, one per day | Connected; launch from mock-day panel |
| 31–40 | Future reinforcement, retakes and targeted review | Connected, available as reserve |

A separate collection of **20 focused practice papers (1,040 questions, 52 per paper, 35 minutes each)** is stored under `sections/quantitative/practice-papers/test-NN/questions.json`. **Each paper is the learning session**: its title, topic labels, and schedule come from the uploaded `practice-papers/manifest.json`. There is no separate concept-review checklist. Practice results remain independent from the 40 full-section papers. A passing focused paper can complete the selected Quantitative learning session when all 52 questions are answered and at least 70% are correct. A practice paper may cover multiple syllabus topics; no additional single-topic headings are shown.

The JSON runner reads the original source schema: `questions` (52 items), `question_id`, `prompt`, `options` with A–D keys, `correct_option`, `explanation`, optional `stimulus` and geometry SVG diagrams in `media.svg`. It preserves these diagrams, renders comparison quantities, tracks individual question attempts, scores and retakes, and stores progress locally in the browser.

Each Quantitative paper is a separate complete section. Days 51–60 still include a **30-question, five-section diagnostic preview**, because full Reading, Mathematics, Language and Verbal mock-paper banks are not yet complete. The matching 52-question Quantitative paper (#21–30) can be launched separately on each mock day. Do not present the diagnostic as a complete five-section HSPT exam.

## Reading vocabulary display

Reading test and guided-practice prompts now underline the vocabulary target in their example phrase or sentence. All 540 Reading vocabulary questions, including Day 1 Q41–57, are covered without changing questions, answers, IDs or saved student progress. The same formatting is used in answer review.

## Mock-exam readiness

- Days 51–60 currently offer **30-question five-section diagnostic previews** (six original starter questions per subject), with a 30-minute countdown, review explanations, and scores tracked separately.
- These are **not yet complete official-format mock papers**. The starter bank of 98 questions cannot provide 10 distinct full HSPT papers. Expand the bank with user-supplied material before enabling the complete paper format.
- Quantitative has 20 focused practice papers plus 40 full-section online papers. Other subjects still need their full mock-paper banks.
- Marking study sessions complete is separate from taking a test. Completed days require all daily words marked covered and the two selected subject sessions finished; the optional 60-question Verbal daily/cumulative challenges remain available and retakable.

## Deploy

1. Keep public HTML pages at the root and resource files under `sections/` or `shared/`.
2. In GitHub, open Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
3. Your site will appear at `https://qiprana.github.io/HSPTPREP/` once GitHub Pages finishes publishing.

## Accuracy and attribution

The original source vocabulary retains its book definitions. Added advanced words and all exam questions are editorial learning materials. Word-part clues are not always a verified historical etymology. Question styles were informed by publicly available example formats and the five-section HSPT outline; **no question texts are copied from third-party commercial or free practice tests**.

Free reference sites for additional practice:
- https://admittest.com/guide/hspt-sample-questions
- https://www.testingmom.com/tests/high-school-placement-test-hspt-overview/hspt-practice-questions-by-subtest/hspt-verbal-skills-practice-questions/
- https://www.certpracticetest.com/hspt-practice-test/

This is independent, unofficial preparation material; not affiliated with Scholastic Testing Service.

## Adding new material

```text
index.html, language.html, reading-skills.html  # stable public URLs
sections/
  vocabulary/data/       # word chunks, CSV
  verbal/                # future Verbal Skills data
  reading/data/          # lessons, papers, source seeds
  reading/generators/    # content-building helpers
  language/data/         # spelling, lessons, papers
  language/generators/   # content-building helpers
  quantitative/          # runner and config
    papers/test-01..40/           # complete full-section papers
    practice-papers/test-01..20/  # focused practice papers
  mathematics/           # future Mathematics content
shared/                  # shared browser scripts
tests/                   # validation checks
docs/                    # project notes
.github/workflows/       # automated tests
```

Keep question IDs, study progress keys, and public page URLs stable. Put new content under its section and run the validation tests before deploying. Quantitative papers 1–20 are learning, 21–30 mocks, and 31–40 reserve. The legacy forty-tests index redirects to the new catalog.


## Advanced authentic Reading (Grades 10–11)

An **untimed Day 1 pilot** is available at `advanced-reading.html`, with four sourced public-domain excerpts and 40 evidence-based written-response questions. Students write a response and cite a detail before seeing a model answer; self-reviews are saved independently under `hspt-reading-advanced-v1` and the existing 23-minute, 62-question Reading papers remain unchanged.

A separate `sections/reading/data/advanced-passages-v1.json` contains **80 source-attributed excerpts across 20 days from eight historical public-domain works**, not yet released as tests. The excerpt boundaries, historical context and difficulty still need editorial review, and 760 further advanced passage questions have not yet been authored. Do not silently substitute those excerpts for unrelated legacy questions.
