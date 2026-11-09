# HSPT Prep — Language Section Sign-off

**Status:** Implementation complete; automated content and interaction QA passed  
**Date:** 2026-11-09  
**Scope:** Language learning sessions and full Language subject practice (not the ten cross-subject diagnostic mock days)

## Accepted scope

- 20 Language learning sessions covering parts of speech, adjectives, adverbs, verbs, nouns, pronouns, agreement, usage, punctuation, sentence structure, spelling rules and composition.
- 20 distinct timed Language papers, each containing 30 usage/mechanics + 10 spelling + 20 composition questions, with a 25-minute timer.
- 20 separate 15-question guided practices (300 practice questions).
- 1,200 full-paper questions; 1,500 questions across full tests and guided practice combined.
- 317 distinct spelling study words across 20 sessions, including 140 words transcribed from the user's textbook photographs and 177 other advanced words.
- Practice navigation, answer explanations, scoring, per-day progress, spelling pronunciation and typed recall.
- Day-selector links from the main subject page.
- Automated regression test `node tests/validate-language-papers.js` and a GitHub Actions workflow.

## Completed checks

- Correct counts, day IDs and answer-key index ranges.
- Unique question-and-options combinations across all 1,500 questions.
- No duplicate spelling terms and complete coverage of the 140 recorded textbook spelling entries.
- Simulated day-selection, paper loading, perfect-score calculation, review display, spelling recall and local progress saving.

## Release caveats

The questions are original learning and practice content, **not** official HSPT papers. Automated and representative manual review do not establish that every distractor or answer is psychometrically validated. A full human review of all 1,500 questions and browser-based cross-device accessibility tests have not been performed. The GitHub Pages live deployment is verified separately from the repository source.

Language implementation is signed off for the project's practice scope, with the caveats above disclosed.
