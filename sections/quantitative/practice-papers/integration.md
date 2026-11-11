# HSPT Focused Topic-Drill Practice Collection Integration

Start with `manifest.json`. Each of the 20 practice test entries supplies relative paths,
SHA-256 checksums, `focus_topics` (3 syllabus topics per test), and `topic_question_counts`.
Each folder (`test-01`..`test-20`) is self-contained:
- `metadata.json`: indexes stable question IDs, numbering (`Q61-112`), focus topics, archetypes, and levels.
- `questions.json`: canonical `QuestionRecord` objects with inline `<svg>` diagrams and `_task` proof trees.
- `questions.db`: portable SQLite database (`exams` and `questions` tables) with zero external file paths.
- `questions.html`: standalone interactive practice viewer with the configured focused-practice timer, topic/archetype filters, and rationales.
- `validation.json`: per-test mathematical verification receipt.

Across the 20 practice tests (1,040 unique questions), all 18 HSPT Subtest 2 syllabus topics
are covered at both Level 2 (Medium, 312 items) and Level 3 (Hard, 728 items) using the
Pass 2 HSPT pattern weightage schedule.
