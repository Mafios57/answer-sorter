# Answer Sorter

A small offline game. Students sort each answer into Correct, Trap (looks right but is wrong), or Dud (clearly wrong).

Plain HTML and JavaScript. No framework, no build step, no server code. About 45 KB in total.

## Run it

- On a computer: double-click `index.html`. It opens in the browser and works with no internet.
- To install on phones and run offline: put the folder on any web host (GitHub Pages, Netlify, a school server). Open the link once on the phone. After that it works with no connection. On Android Chrome, tap "Add to Home screen".
- To test locally as an installable app: in this folder run `python3 -m http.server 8000`, then open `http://localhost:8000`.

## Files

| File | What it does |
| --- | --- |
| index.html | Page and styles |
| app.js | Game logic |
| items.js | The question bank. Edit this to add questions. |
| sw.js | Offline cache |
| manifest.webmanifest, icon.svg | Home-screen install |

## What each question does

1. Stem Scan: tap the word that tells you what to find. Always on for ages 12-15. For 16-19, on in the first 6 sessions, then for 3 in 10 questions.
2. Stake: bet 1, 2, or 3 before seeing the answers. Right: +1, +2, +3. Wrong: 0, -2, -6. Ages 12-15 never drop below zero.
3. Sort Round: label every answer. Ages 12-15 see 3 answers. Ages 16-19 see all of them.
4. Feedback: names the misconception behind each trap and gives a "how to spot it" tip.
5. Why It Fails: pick the misconception behind one trap, then write the reason. Ages 12-15 get a sentence starter.

A question counts as right when the correct answer is labeled Correct and no other answer is. Mixing up Trap and Dud shows in feedback but does not cost points.

## Spacing

Sessions are 8 questions, mixed across subjects. Each question sits in a review box from 1 to 5.

- Right: moves up a box and comes back later (after 1, 2, 4, 8, or 16 sessions).
- Wrong: back to box 1, returns next session.

## Data

Progress stays on the device. "Export data" downloads a CSV of every answer: bet, result, labels, the trap explained, and the written explanation. Use it in the pilot to find traps fewer than 5% of students pick.

## Print

"Print cards" makes a printable set for the chosen subject and age group, with an answer key at the bottom of each card. Cards for ages 12-15 show 3 answers, the same as the game.

## Add a question

Copy any item in `items.js` and change it. Rules:

- One answer with `type: "correct"`.
- At least one `type: "trap"`, each with `mis` (the misconception name) and `why`.
- One `type: "dud"` with `why`.
- `ages` holds "12-15", "16-19", or both.
- `target` is a word from the stem that tells the student what to find, or `null`.

Use the same `mis` name each time the same misconception appears. The Misconception Map groups by that name.

After changing any file on a hosted copy, change `CACHE` in `sw.js` (v1 to v2) so phones load the new version.

## Not built yet

- Trap Forge (students write traps): needs teacher approval and sharing between devices.
- Mark the Answer (Paper 2 writing) and Calm Start.
- Class teams, teacher dashboard, and sync to a server.
- Free-text scoring. Written explanations are saved for teacher review only.
