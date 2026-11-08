# HSPTPREP — Five-Section HSPT Learning Studio

A GitHub Pages-friendly HSPT study site. No logins, frameworks or paid APIs.

## What is included

- 1,084 vocabulary entries: 664 from the previously extracted user-supplied HSPT book collection, **420 original advanced enrichment entries** for approximately grades 9–12. Two book words have separate senses.
- A 60-day journey: **50 learning days** with roughly 21–22 new vocabulary entries per day plus **two student-selected HSPT subjects**, followed by **10 mock-exam days**. The default 5-day rotation provides 20 sessions for each of the five subjects.
- Speech synthesis (browser voice), syllable guides, word-part study notes, examples, and searchable A–Z list.
- Five HSPT exam areas: Verbal Skills, Quantitative Skills, Reading, Mathematics and Language.
- 98 **original starter** subject-practice questions with explanations, separate score history, and optional scaled timers. Subject attempts track coverage of available questions.
- Local browser storage; import/export progress backup. Version 3 progress migrates to version 4 without deleting covered-word flags or review marks. Previous 40-day completions and scores remain in historical records, without falsely counting as 50-day completions.

## Mock-exam readiness

- Days 51–60 currently offer **30-question five-section diagnostic previews** (six original starter questions per subject), with a 30-minute countdown, review explanations, and scores tracked separately.
- These are **not yet complete official-format mock papers**. The starter bank of 98 questions cannot provide 10 distinct full HSPT papers. Expand the bank with user-supplied material before enabling the complete paper format.
- Planned Quantitative coverage will use the user's three forthcoming categories; current quantitative questions are only preliminary samples.
- Marking study sessions complete is separate from taking a test. Completed days require all daily words marked covered and the two selected subject sessions finished; the optional 60-question Verbal daily/cumulative challenges remain available and retakable.

## Deploy

1. Put `index.html`, `mock.js`, `exam-data.js`, `words-01.js` through the final `words-NN.js`, and `words.csv` at the repository root.
2. In GitHub, open Settings → Pages → Deploy from a branch → `main` → `/ (root)`.
3. Your site will appear at `https://qiprana.github.io/HSPTPREP/` once GitHub Pages finishes publishing.

## Accuracy and attribution

The original source vocabulary retains its book definitions. Added advanced words and all exam questions are editorial learning materials. Word-part clues are not always a verified historical etymology. Question styles were informed by publicly available example formats and the five-section HSPT outline; **no question texts are copied from third-party commercial or free practice tests**.

Free reference sites for additional practice:
- https://admittest.com/guide/hspt-sample-questions
- https://www.testingmom.com/tests/high-school-placement-test-hspt-overview/hspt-practice-questions-by-subtest/hspt-verbal-skills-practice-questions/
- https://www.certpracticetest.com/hspt-practice-test/

This is independent, unofficial preparation material; not affiliated with Scholastic Testing Service.