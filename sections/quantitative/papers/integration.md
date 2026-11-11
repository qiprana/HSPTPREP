# Quantitative test integration

Start with manifest.json. Each test entry supplies relative paths and checksums.
Each folder can be copied independently: metadata.json indexes stable question IDs,
numbering, topics and levels; questions.json contains canonical QuestionRecord objects.
SQLite uses the existing exams/questions schema; raw_json retains all inline SVG and
mathematical proof evidence. questions.html is standalone practice with timer and scoring.
IDs are stable within this build; do not identify questions solely by their number.
The content registry spans the entire collection. Difficulty is designed and verified
by reasoning structure, not measured from student response data. Questions reproduce
from build-config.json and the source version recorded in manifest.json; SQLite creation
timestamps may differ on a rebuild. Use a new output directory for a fresh build.
