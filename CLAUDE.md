# Answer Sorter: project rules

Read README.md first. It explains the game loop, scoring, spacing, and how to add a question.

## Tech

- Plain HTML and JavaScript only. No frameworks, no libraries, no build step, no npm.
- Keep the current style in app.js: ES5 (`var`, `function`), one IIFE, the `h()` helper for DOM.
- No network calls. Everything must work from the files in this folder.

## Phones and size

- Must run offline on low-end Android phones. Assume a slow CPU, little memory, and no connection after the first visit.
- Keep the total size of all shipped files under 200 KB.
- Every new file the game needs must be added to `FILES` in sw.js.
- When any shipped file changes, bump `CACHE` in sw.js (v1 to v2, and so on).

## Writing

- Use plain English that second-language learners can read: short sentences, common words.
- No em dashes in any text. This covers items, UI text, comments, and docs. Use a full stop, a comma, or a colon.

## Items (items.js)

Every item needs:

- Exactly one answer with `type: "correct"`.
- At least one `type: "trap"`, with `mis` (a named misconception) and `why`.
- Exactly one `type: "dud"`, with `why`.

Reuse the same `mis` name when the same misconception appears again. The Misconception Map groups by it.

## How we work

- Work in phases.
- Stop after each phase and wait for approval before starting the next one.
