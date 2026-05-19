# CIE Insider — MCQ Trainer

A web-based MCQ practice tool for CIE Physics past papers (0625, 9702).
Built as a static site — drop into GitHub Pages and ship.

## Adding a new paper

Three things to do.

### 1. Drop the PDF
Put the question paper PDF at the path your paper JSON points to. Convention:
```
papers/{syllabus}/{session}/{paperId}.pdf
```
e.g. `papers/0625/2025_w/0625_w25_qp_11.pdf`

Session folder uses CIE's own code: `2025_w` (Oct/Nov), `2025_s` (May/June),
`2025_m` (March, India only).

### 2. Create the paper JSON
Copy an existing file under `papers/{syllabus}/` and edit:

```json
{
  "id": "0625_s25_qp_12",
  "syllabusCode": "0625",
  "label": "May/June 2025 — Paper 1 Variant 2 (Core)",
  "paperType": "core",
  "session": "May/June 2025",
  "duration": 45,
  "questionCount": 40,
  "pdfPath": "papers/0625/2025_s/0625_s25_qp_12.pdf",
  "markschemePath": "papers/0625/2025_s/0625_s25_ms_12.pdf",
  "questions": [
    { "n": 1, "answer": "B", "topic": "motion", "subtopic": "graphs_motion",
      "difficulty": null, "explanation": null },
    ...
  ]
}
```

Required per question: `n`, `answer`, `topic`.
Optional per question: `subtopic`, `difficulty`, `explanation`.

`topic` and `subtopic` IDs must match the syllabus taxonomy in
`papers/{syllabus}/syllabus.json`. If you tag a subtopic that doesn't exist,
the topic breakdown still works but you lose the granular view later.

### 3. Register it in the index
Add an entry to `papers/index.json` under the relevant syllabus.
The paper picker reads from here.

## Adding explanations

Edit the paper JSON, set the `explanation` field for any question. HTML
allowed inside the string. Example:

```json
"explanation": "Watch the distinction between weight and mass when the lift accelerates. The scale reads the <strong>normal force</strong>, not the gravitational force."
```

You don't need explanations for every question. The most-commonly-wrong
ones are the highest-leverage to write first. The dot indicator next to
a question number in the answer panel shows where an explanation exists.

## Adding a new syllabus

1. Create `papers/{code}/` folder
2. Create `papers/{code}/syllabus.json` (copy structure from 0625 or 9702)
3. Add the syllabus block to `papers/index.json`
4. Add paper files in the new folder

## Local development

PDF embedding doesn't work over `file://` in most browsers. Run a local
server:

```bash
cd mcq-v2
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

## Deployment to GitHub Pages

Push to a GitHub repo, enable Pages on the main branch root. Done.
GitHub Pages serves PDFs with correct MIME and CORS so embedding works.

## Data model summary

```
papers/
├── index.json              # syllabus & paper registry
├── 0625/
│   ├── syllabus.json       # topic taxonomy for 0625
│   ├── 0625_w25_qp_11.json # paper file (questions, answers, tags)
│   └── 2025_w/
│       ├── 0625_w25_qp_11.pdf
│       └── 0625_w25_ms_11.pdf
└── 9702/
    ├── syllabus.json
    └── ...
```

LocalStorage keys used by the app:
- `cieinsider_last_paper` — last-opened paper id (auto-restore)
- `cieinsider_attempt_{paperId}` — in-progress answers per paper
- `cieinsider_history` — completed attempt log (for future history view)

## Modes

**Practice mode** (default): Timer is optional. Pause/resume freely. When the
timer hits zero, it just stops red — no auto-submit. Mark when you're ready.

**Exam conditions mode**: Timer starts immediately, cannot be paused.
Auto-submits when the timer expires. Attempt is flagged as exam-conditions
in the history. Useful for pacing practice in the run-up to a real sitting.
