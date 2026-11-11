# Quantitative · 20-day practice papers

This folder is reserved for **20 topic-specific Quantitative practice papers**, one for each of the 20 Quantitative learning sessions in the HSPT study plan.

**Important:** These are *additional* practice papers. They do not replace the 40 full Quantitative papers in `../papers/` (papers 1–20 for learning, 21–30 for mock days, 31–40 reserved).

## How to add each paper

Upload one JSON file here for each learning session:

- `day-01.json` — Addition / Subtraction
- `day-02.json` — Multiplication / Division
- …
- `day-19.json` — Mixed Review I
- `day-20.json` — Mixed Review II

The complete list of all 20 sessions and their topics is in `manifest.json`.

## Suggested content format

Use a JSON object with `schema_version`, `title`, `session`, `topic`, `time_limit_minutes` (if timed), and a `questions` array. Each question should have a stable `question_id`, `prompt`, four `options` labeled A–D, `correct_option`, and `explanation`. Optional `stimulus` and `media.svg` may be included where appropriate, consistent with the existing Quantitative paper format.

Keep question IDs distinct from full-paper IDs and other practice sessions; avoid repeated prompts within a session. Decide the question count and timing based on the papers you provide.

## Integration notes

1. Upload the actual `day-NN.json` file.
2. Change that session's status in `manifest.json` from `awaiting_upload` to `ready` once the file has been validated.
3. Update `../quantitative-config.js` `topicTestSlots` to point to this file, then ensure `../quantitative.js` supports it.
4. Run question validation and test the Quantitative browser interface before deploying.

**No practice-paper question files are present yet.** This folder and manifest are a ready-to-fill organization structure, and the existing website does not attempt to load missing papers.
