# Advanced Reading standard — Grades 10–11

**Status: 20 days of untimed guided advanced reading published; 80 excerpts, 800 prompts. Editorial sign-off and advanced multiple-choice full-paper replacement incomplete.**
The existing 20-day Reading bank is introductory and consists predominantly of synthetic passages and direct-recall questions. It does **not** yet meet the standard below. Do not advertise it as Grade 10–11 advanced content until actual passages and questions have been replaced and checked.

## Required standard

- **Authentic reading:** Use real literary, historical, scientific, philosophical, or argumentative works, not newly invented filler stories. Check reuse rights of the *specific edition or excerpt*, and give work, author, publication year, source URL, excerpt/chapter identification, and rights status on each passage. Never present newly written material as a quotation.
- **Grade level:** Target strong 10th- to 11th-grade students (advanced enrichment beyond the usual 8th-grade HSPT candidate level). Alternate literary, history, science and argument/analysis. Preserve historical language where comprehensible; contextualize antiquated usage.
- **Length:** Aim for ~350–650 words per authentic passage, with a coherent argumentative or narrative arc and sufficient information for deeper questions. Avoid fragments that cannot support ten substantive questions. A substantially shorter excerpt requires editorial justification.
- **Questions:** 10 carefully authored questions per passage: central thesis and nuance; evidence and inference across sentences; authorial stance, tone and rhetorical techniques; reasoning, assumptions or counterarguments; structure and paragraph function; difficult vocabulary *in context*; synthesis. Avoid questions solvable solely by superficial option elimination or an obvious answer echoed verbatim.
- **Distractors:** Four plausible, comparable answer choices, with distinct reasoning-based traps. Wrong choices should reflect a realistic misreading, overgeneralization, unwarranted assumption or incomplete inference, not absurd alternatives.
- **Explanations:** Identify precise source evidence (paragraph or sentence) and explain why the correct choice is justified **and why a tempting distractor fails**. Do not simply repeat the answer as the explanation.
- **Difficulty validation:** Blind-review a sample without showing the passage; if questions can regularly be answered from choices alone, rewrite them. Conduct independent answer-key/source-evidence review and duplicate screening across papers.
- **Timing:** A 62-question, 23-minute exam simulation must stay separate from the longer advanced close-reading practice. Advanced authentic excerpts need an untimed guided mode or a thoughtfully recalibrated timer; don't imply the two formats have identical demands.
- **Student data:** Keep legacy question IDs and progress intact. New advanced questions require new stable IDs and a separately versioned bank; never silently reassign old IDs to changed questions.

## Content model

Each new passage should carry:
`{id, title, text, genre, difficultyBand:"grade10-11", source:{work,author,year,chapter,url,rights,excerptStart,excerptEnd}, questions:[...]}`.

Each question should carry:
`{id, prompt, choices, correctIndex, explanation, evidenceQuoteOrLocation, distractorRationales, skill, difficultyBand}`.

Reject passages that lack source provenance, rights review or evidence mapping. A generated seed file is not an acceptable finished passage.

## Source candidates (verify the exact excerpts before upload)

- **Pride and Prejudice** (Jane Austen, 1813) — literary fiction. https://www.gutenberg.org/ebooks/1342 — Narrative voice, free indirect discourse, irony, inference.
- **Narrative of the Life of Frederick Douglass, an American Slave** (Frederick Douglass, 1845) — memoir and historical firsthand account. https://www.gutenberg.org/ebooks/23 — Perspective, argument, tone, rhetorical choice; teach with historical context.
- **The Federalist Papers** (Alexander Hamilton, James Madison, John Jay, 1787) — political argument and historical essay. https://www.gutenberg.org/ebooks/1404 — Claim/evidence, inference, counterargument, paragraph structure.
- **On the Origin of Species** (Charles Darwin, 1859) — historical scientific argument. https://www.gutenberg.org/ebooks/1228 — Scientific reasoning, qualification, hypothesis and evidence; historical science not modern factual guidance.

These are verified available public-domain work candidates, *not* 80 completed selected excerpts. Science passages may also use current open-license sources if attribution and licensing requirements are met.

## Existing-bank audit (2026-11-10)

- 20 full Reading papers with 80 short synthetic passages, 10 comprehension questions per passage and 22 separate vocabulary questions per paper.
- Current questions frequently permit elimination by implausible distractors; some explanations merely repeat the answer.
- **No existing synthetic passage has been relabeled as authentic or advanced.**
- Vocabulary underlining is a separate UI defect and is fixed independently.

## Actual implementation progress

- Days 1–2 include eight authentic excerpts and 80 authored evidence-based written-response questions at `advanced-reading.html`; Days 3–20 add 72 excerpts with 720 scaffolded interpretation questions and generic self-assessment rubrics, **not individually written model answers**. All remain separate from timed HSPT-style papers.
- Eight public-domain source works have yielded 80 staged passage excerpts in `sections/reading/data/advanced-passages-v1.json`. Boundaries and content are pending editorial review.
- The existing 20-day 62-question exam simulation has deliberately not been changed. Full advanced replacement still requires passage-specific editorial review of 72 advanced excerpts, individually authored and verified model answers or challenging answer choices, independent student-level review, and a separate timing policy. The advanced practice is published as ungraded self-assessment, not certified exam material.

## 2026-11-10 follow-up QA

- Added `sections/reading/data/advanced/complete-days-03-20.json`: 18 days, 72 excerpts, 720 self-assessed questions. Twelve staged selections containing indexes, distribution terms, or license pages were replaced with passages split from other public-domain selections; these replacements still need editorial checks for coherent excerpt boundaries.
- Existing Day 1–2 passage-specific questions and the students' local progress keys were preserved.
- The page's day selector now supports 20 days. Advanced responses remain untimed and ungraded. The question-bank checks reject duplicate question IDs, duplicate excerpts, missing textual evidence anchors, and Gutenberg license content.
- Automated structural and JavaScript syntax checks cannot certify reading level, answer quality, classroom suitability, or live browser behavior.
