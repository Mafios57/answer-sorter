// Answer Sorter: a small offline game.
// Loop per question: Stem Scan -> Stake (bet) -> Sort Round -> Feedback -> Why It Fails.
// Progress is stored on the device (localStorage). No server, no build step.

(function () {
  'use strict';

  var ITEMS = window.ITEMS || [];
  var SESSION_SIZE = 8;
  var INTERVALS = [0, 1, 2, 4, 8, 16];          // Leitner box -> sessions to wait
  var SCORE = { 1: [1, 0], 2: [2, -2], 3: [3, -6] }; // bet -> [right, wrong] (certainty-based marking)
  var BET_NAMES = { 1: 'Guessing', 2: 'Fairly sure', 3: 'Very sure' };
  var LABELS = { correct: 'Correct', trap: 'Trap', dud: 'Dud' };
  var STORE_KEY = 'answer-sorter-v1';
  var MAX_LOG = 3000;

  // ---------- storage ----------
  function freshStore() { return { age: null, subject: 'All subjects', sessions: 0, cards: {}, mis: {}, log: [] }; }
  function loadStore() {
    try {
      var raw = localStorage.getItem(STORE_KEY);
      if (raw) { var s = JSON.parse(raw); if (s && s.cards) return s; }
    } catch (e) { /* storage blocked: play without saving */ }
    return freshStore();
  }
  var store = loadStore();
  function save() {
    if (store.log.length > MAX_LOG) store.log = store.log.slice(-MAX_LOG);
    try { localStorage.setItem(STORE_KEY, JSON.stringify(store)); } catch (e) { /* ignore */ }
  }

  // ---------- helpers ----------
  var app = document.getElementById('app');
  function h(tag, props, kids) {
    var el = document.createElement(tag);
    if (props) {
      Object.keys(props).forEach(function (k) {
        var v = props[k];
        if (v === null || v === undefined || v === false) return;
        if (k === 'class') el.className = v;
        else if (k === 'text') el.textContent = v;
        else if (k.indexOf('on') === 0) el.addEventListener(k.slice(2), v);
        else el.setAttribute(k, v === true ? '' : v);
      });
    }
    (kids || []).forEach(function (c) {
      if (c === null || c === undefined) return;
      el.appendChild(typeof c === 'string' ? document.createTextNode(c) : c);
    });
    return el;
  }
  function show(kids) {
    app.innerHTML = '';
    kids.forEach(function (k) { if (k) app.appendChild(k); });
    window.scrollTo(0, 0);
  }
  function shuffle(list) {
    var a = list.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }
  function unique(list) { return list.filter(function (x, i) { return list.indexOf(x) === i; }); }
  function norm(word) { return String(word).toLowerCase().replace(/[^a-z0-9\/₂²]/g, ''); }
  function pct(n, d) { return d ? Math.round((100 * n) / d) + '%' : '-'; }
  function card(it) { return store.cards[it.id] || { box: 1, last: -99 }; }
  function isDue(it) { var c = card(it); return store.sessions - c.last >= INTERVALS[c.box]; }
  function poolFor(subject) {
    return ITEMS.filter(function (it) {
      return it.ages.indexOf(store.age) >= 0 && (subject === 'All subjects' || it.subject === subject);
    });
  }
  // Only subjects with questions for the chosen age group (all subjects before an age is picked).
  function subjects() {
    var list = ITEMS.filter(function (it) { return !store.age || it.ages.indexOf(store.age) >= 0; });
    return ['All subjects'].concat(unique(list.map(function (it) { return it.subject; })));
  }

  // ---------- home ----------
  function home() {
    if (subjects().indexOf(store.subject) < 0) { store.subject = 'All subjects'; save(); }
    var ageRow = h('div', { class: 'row' });
    ['12-15', '16-19'].forEach(function (age) {
      ageRow.appendChild(h('button', {
        class: 'choice' + (store.age === age ? ' on' : ''), text: 'Ages ' + age,
        onclick: function () { store.age = age; save(); home(); }
      }));
    });

    var select = h('select', { 'aria-label': 'Subject', onchange: function () { store.subject = select.value; save(); home(); } });
    subjects().forEach(function (s) {
      var opt = h('option', { value: s, text: s });
      if (s === store.subject) opt.selected = true;
      select.appendChild(opt);
    });

    var kids = [
      h('h1', { text: 'Answer Sorter' }),
      h('p', { class: 'hint', text: 'Sort every answer: Correct, Trap (looks right but is wrong), or Dud (clearly wrong).' }),
      h('h2', { text: '1. Your age group' }), ageRow,
      h('h2', { text: '2. Subject' }), select
    ];

    if (store.age) {
      var pool = poolFor(store.subject);
      var due = pool.filter(isDue).length;
      kids.push(h('p', { class: 'hint', text: pool.length + ' questions in this set. ' + due + ' due now.' }));
      kids.push(h('button', { class: 'btn', text: 'Start', disabled: pool.length === 0, onclick: startSession }));
    } else {
      kids.push(h('p', { class: 'hint', text: 'Pick your age group to start.' }));
    }
    kids.push(h('button', { class: 'btn ghost', text: 'My progress', onclick: progress }));
    kids.push(h('div', { class: 'row' }, [
      h('button', { class: 'btn ghost', text: 'Print cards', disabled: !store.age, onclick: printView }),
      h('button', { class: 'btn ghost', text: 'Export data', onclick: exportCSV })
    ]));
    kids.push(h('button', { class: 'linkbtn', text: 'Reset all progress', onclick: resetAll }));
    show(kids);
  }

  function resetAll() {
    if (!window.confirm('Delete all progress on this device?')) return;
    var age = store.age;
    store = freshStore(); store.age = age; save(); home();
  }

  // ---------- session ----------
  var sess = null;

  function pickItems(subject) {
    var pool = poolFor(subject);
    var due = shuffle(pool.filter(isDue)).sort(function (a, b) { return card(a).box - card(b).box; });
    var rest = shuffle(pool.filter(function (it) { return !isDue(it); }));
    return interleave(due.concat(rest).slice(0, SESSION_SIZE));
  }

  // Mix topics: avoid two questions from the same subject in a row where possible.
  function interleave(list) {
    var out = [], left = shuffle(list);
    while (left.length) {
      var last = out.length ? out[out.length - 1].subject : null;
      var idx = 0;
      for (var i = 0; i < left.length; i++) { if (left[i].subject !== last) { idx = i; break; } }
      out.push(left.splice(idx, 1)[0]);
    }
    return out;
  }

  function startSession() {
    store.sessions += 1; save();
    sess = { n: store.sessions, items: pickItems(store.subject), i: 0, points: 0, right: 0, sure: 0, sureWrong: 0 };
    nextItem();
  }

  function header() {
    return h('div', { class: 'top noprint' }, [
      h('span', { text: 'Question ' + (sess.i + 1) + ' of ' + sess.items.length + '   |   Points ' + sess.points }),
      h('button', { class: 'linkbtn', text: 'Quit', onclick: function () { if (window.confirm('Stop this session?')) endSession(); } })
    ]);
  }

  // Ages 12-15 see 3 answers (correct, one trap, dud). Ages 16-19 see all.
  function visibleAnswers(it) {
    if (store.age === '16-19') return it.answers.slice();
    var pick = function (type) { return it.answers.filter(function (a) { return a.type === type; }); };
    return pick('correct').concat(shuffle(pick('trap')).slice(0, 1), pick('dud'));
  }

  function nextItem() {
    var it = sess.items[sess.i];
    if (!it) return endSession();
    var ctx = { it: it, answers: shuffle(visibleAnswers(it)), labels: {}, bet: null, scan: null };
    // Stem Scan: always on for 12-15. For 16-19, on in the first 6 sessions, then 3 in 10 questions.
    var scanOn = store.age === '12-15' || sess.n <= 6 || Math.random() < 0.3;
    if (scanOn) scanStep(ctx); else betStep(ctx);
  }

  // M6 Stem Scan
  function scanStep(ctx) {
    var it = ctx.it;
    var target = it.target ? norm(it.target) : null;
    var words = h('div', { class: 'stem words' });
    var fb = h('p', { class: 'feedback' });
    var next = h('button', { class: 'btn', text: 'Next', onclick: function () { betStep(ctx); } });
    next.hidden = true;
    var noneBtn;
    function finish(ok) {
      if (ctx.scan !== null) return;
      ctx.scan = ok;
      Array.prototype.forEach.call(words.children, function (b) {
        b.disabled = true;
        if (target && norm(b.textContent) === target) b.classList.add('target');
      });
      noneBtn.disabled = true;
      fb.className = 'feedback ' + (ok ? 'good' : 'bad');
      fb.textContent = ok ? 'Yes. That word tells you what to find.'
        : (target ? 'The key word is "' + it.target + '". Read it before you answer.' : 'This question has no trick word.');
      next.hidden = false;
    }
    it.stem.split(/\s+/).forEach(function (w) {
      words.appendChild(h('button', { class: 'word', text: w, onclick: function () { finish(!!target && norm(w) === target); } }));
    });
    noneBtn = h('button', { class: 'btn ghost', text: 'No trick word', onclick: function () { finish(!target); } });
    show([header(), h('h2', { text: 'Stem Scan' }),
      h('p', { class: 'hint', text: 'Tap the word that tells you what the question wants.' }),
      words, noneBtn, fb, next]);
  }

  // M4 Stake
  function betStep(ctx) {
    var list = h('div');
    [1, 2, 3].forEach(function (b) {
      var s = SCORE[b];
      list.appendChild(h('button', { class: 'btn bet', onclick: function () { ctx.bet = b; sortStep(ctx); } }, [
        h('strong', { text: BET_NAMES[b] }),
        h('span', { text: 'Right: +' + s[0] + '   Wrong: ' + (s[1] === 0 ? '0' : s[1]) })
      ]));
    });
    var note = store.age === '12-15' ? 'Your points never go below zero.' : 'Bet "Very sure" only if you are more than 80% sure.';
    show([header(), h('div', { class: 'stem', text: ctx.it.stem }),
      h('h2', { text: 'How sure are you?' }),
      h('p', { class: 'hint', text: 'Bet before you see the answers. ' + note }), list]);
  }

  // M1 Sort Round
  function sortStep(ctx) {
    var check = h('button', { class: 'btn', text: 'Check', disabled: true, onclick: function () { feedbackStep(ctx); } });
    var rows = h('div');
    ctx.answers.forEach(function (a, idx) {
      var group = h('div', { class: 'labels', role: 'group' });
      ['correct', 'trap', 'dud'].forEach(function (lab) {
        group.appendChild(h('button', {
          class: 'lab lab-' + lab, text: LABELS[lab],
          onclick: function (ev) {
            ctx.labels[idx] = lab;
            Array.prototype.forEach.call(group.children, function (b) { b.classList.toggle('on', b === ev.currentTarget); });
            if (Object.keys(ctx.labels).length === ctx.answers.length) check.disabled = false;
          }
        }));
      });
      rows.appendChild(h('div', { class: 'answer' }, [h('p', { class: 'atext', text: a.text }), group]));
    });
    show([header(), h('div', { class: 'stem', text: ctx.it.stem }),
      h('p', { class: 'hint', text: 'Label every answer. Exactly one is Correct.' }), rows, check]);
  }

  // Feedback + scoring + spacing + misconception map
  function feedbackStep(ctx) {
    var it = ctx.it;
    var right = ctx.answers.every(function (a, i) {
      return a.type === 'correct' ? ctx.labels[i] === 'correct' : ctx.labels[i] !== 'correct';
    });
    var s = SCORE[ctx.bet];
    var before = sess.points;
    sess.points += right ? s[0] : s[1];
    if (store.age === '12-15' && sess.points < 0) sess.points = 0;
    ctx.right = right;
    if (right) sess.right += 1;
    if (ctx.bet === 3) { sess.sure += 1; if (!right) sess.sureWrong += 1; }

    // Leitner boxes (M5): right moves up a box, wrong goes back to box 1 and returns next session.
    var c = card(it);
    store.cards[it.id] = { box: right ? Math.min(5, c.box + 1) : 1, last: sess.n };

    // Misconception Map: a trap is "avoided" when it was not labeled Correct.
    ctx.answers.forEach(function (a, i) {
      if (a.type !== 'trap') return;
      var m = store.mis[a.mis] || { seen: 0, avoided: 0, streak: 0, subject: it.subject };
      m.seen += 1;
      if (ctx.labels[i] !== 'correct') { m.avoided += 1; m.streak += 1; } else { m.streak = 0; }
      store.mis[a.mis] = m;
    });
    save();

    var correct = ctx.answers.filter(function (a) { return a.type === 'correct'; })[0];
    var delta = sess.points - before;
    var headline = right
      ? 'You found the correct answer. ' + (delta >= 0 ? '+' : '') + delta + ' points.'
      : 'The correct answer is: ' + correct.text + '. ' + (delta >= 0 ? '+' : '') + delta + ' points.';
    if (ctx.bet === 3 && !right) headline += ' You were very sure, so this question comes back next time.';

    var list = h('div');
    ctx.answers.forEach(function (a, i) {
      var mine = ctx.labels[i];
      var match = mine === a.type;
      var lines = [
        h('p', { class: 'atext' }, [h('span', { class: 'tag tag-' + a.type, text: LABELS[a.type] }), ' ' + a.text]),
        h('p', { class: 'hint ' + (match ? 'good' : 'bad'), text: (match ? '✓ You said ' : '✗ You said ') + LABELS[mine] + '.' })
      ];
      if (a.type === 'trap') lines.push(h('p', { text: 'Misconception: ' + a.mis + '. ' + a.why }));
      if (a.type === 'dud' && !match) lines.push(h('p', { text: a.why }));
      list.appendChild(h('div', { class: 'answer' }, lines));
    });

    show([header(), h('div', { class: 'stem', text: it.stem }),
      h('p', { class: 'feedback ' + (right ? 'good' : 'bad'), text: headline }),
      list,
      h('div', { class: 'card' }, [h('strong', { text: 'How to spot it: ' }), it.tip]),
      h('button', { class: 'btn', text: 'Explain a trap', onclick: function () { explainStep(ctx); } })]);
  }

  // M2 Why It Fails: pick the misconception, then write the reason.
  function explainStep(ctx) {
    var it = ctx.it;
    var traps = ctx.answers.filter(function (a) { return a.type === 'trap'; });
    var trap = traps[Math.floor(Math.random() * traps.length)];
    // Wrong options: misconceptions from other questions for this age group.
    // Skip every trap in this question, so a true misconception is never marked wrong.
    var own = it.answers.map(function (a) { return a.mis; });
    var sameSubject = [], others = [];
    ITEMS.forEach(function (x) {
      if (x.ages.indexOf(store.age) < 0) return;
      x.answers.forEach(function (a) {
        if (a.type !== 'trap' || own.indexOf(a.mis) >= 0) return;
        (x.subject === it.subject ? sameSubject : others).push(a.mis);
      });
    });
    var wrongOptions = unique(shuffle(unique(sameSubject)).concat(shuffle(unique(others)))).slice(0, 2);
    var options = shuffle([trap.mis].concat(wrongOptions));

    var young = store.age === '12-15';
    var fb = h('p', { class: 'feedback' });
    var text = h('textarea', { 'aria-label': 'Your explanation', placeholder: young ? '' : 'Say why it is wrong and how you would check.' });
    if (young) text.value = 'This is wrong because ';
    var writeBox = h('div', {}, [h('h2', { text: 'Now say it in your own words' }), text,
      h('button', { class: 'btn', text: 'Save and continue', onclick: function () { finish(text.value); } }),
      h('button', { class: 'btn ghost', text: 'Skip writing', onclick: function () { finish(''); } })]);
    writeBox.hidden = true;

    var picked = null;
    var opts = h('div');
    options.forEach(function (m) {
      opts.appendChild(h('button', {
        class: 'btn ghost', text: m,
        onclick: function () {
          if (picked !== null) return;
          picked = m;
          Array.prototype.forEach.call(opts.children, function (b) { b.disabled = true; });
          var ok = m === trap.mis;
          fb.className = 'feedback ' + (ok ? 'good' : 'bad');
          fb.textContent = (ok ? 'Yes. ' : 'Not this one. The misconception is: ' + trap.mis + '. ') + trap.why;
          writeBox.hidden = false;
        }
      }));
    });

    function finish(explanation) {
      var starter = 'This is wrong because ';
      if (young && explanation.trim() === starter.trim()) explanation = '';
      store.log.push({
        t: new Date().toISOString(), session: sess.n, item: it.id, subject: it.subject, age: store.age,
        scan: ctx.scan, bet: ctx.bet, right: ctx.right,
        labels: ctx.answers.map(function (a, i) { return a.text + '=' + ctx.labels[i]; }).join(' | '),
        trap: trap.text, picked: picked, pickedRight: picked === trap.mis, explanation: explanation.trim()
      });
      save();
      sess.i += 1;
      nextItem();
    }

    show([header(), h('h2', { text: 'Why It Fails' }),
      h('p', { text: 'Why is "' + trap.text + '" wrong?' }),
      h('p', { class: 'hint', text: 'Pick the mistake behind it.' }), opts, fb, writeBox]);
  }

  function endSession() {
    var n = sess.i;
    show([h('h1', { text: 'Session done' }),
      h('div', { class: 'card' }, [
        h('p', { text: 'Points: ' + sess.points }),
        h('p', { text: 'Correct answers found: ' + sess.right + ' of ' + n }),
        h('p', { text: 'Very sure but wrong: ' + sess.sureWrong + ' of ' + sess.sure + ' "Very sure" bets' })
      ]),
      h('p', { class: 'hint', text: 'Questions you missed come back next session. Questions you got right come back later.' }),
      h('button', { class: 'btn', text: 'Play again', onclick: startSession }),
      h('button', { class: 'btn ghost', text: 'My progress', onclick: progress }),
      h('button', { class: 'btn ghost', text: 'Home', onclick: home })]);
    sess = null;
  }

  // ---------- progress ----------
  function progress() {
    var byBet = { 1: [0, 0], 2: [0, 0], 3: [0, 0] };
    store.log.forEach(function (r) { if (byBet[r.bet]) { byBet[r.bet][0] += 1; if (r.right) byBet[r.bet][1] += 1; } });
    var table = h('table', {}, [h('tr', {}, [h('th', { text: 'Your bet' }), h('th', { text: 'Times' }), h('th', { text: 'Right' }), h('th', { text: 'Aim' })])]);
    var aims = { 1: 'under 67%', 2: '67-80%', 3: 'over 80%' };
    [1, 2, 3].forEach(function (b) {
      table.appendChild(h('tr', {}, [h('td', { text: BET_NAMES[b] }), h('td', { text: String(byBet[b][0]) }),
        h('td', { text: pct(byBet[b][1], byBet[b][0]) }), h('td', { text: aims[b] })]));
    });

    var advice = [];
    var b3 = byBet[3], b1 = byBet[1];
    if (b3[0] >= 5 && b3[1] / b3[0] < 0.8) advice.push('You bet "Very sure" more often than your results support. Check your answer before betting high.');
    if (b1[0] >= 5 && b1[1] / b1[0] > 0.67) advice.push('You are often right when you say "Guessing". Trust yourself and bet higher.');
    if (!advice.length) advice.push(store.log.length < 10 ? 'Play a few sessions to see your pattern.' : 'Your bets match your results. Keep going.');

    var misList = h('div');
    var names = Object.keys(store.mis).sort(function (a, b) { return store.mis[a].streak - store.mis[b].streak; });
    if (!names.length) misList.appendChild(h('p', { class: 'hint', text: 'No traps met yet.' }));
    names.forEach(function (name) {
      var m = store.mis[name];
      var beaten = m.streak >= 2;
      misList.appendChild(h('div', { class: 'mis' }, [
        h('span', {}, [h('span', { class: 'dot' + (beaten ? ' green' : '') }), name]),
        h('span', { class: 'hint', text: 'avoided ' + m.avoided + ' of ' + m.seen })
      ]));
    });

    var boxes = [0, 0, 0, 0, 0, 0];
    Object.keys(store.cards).forEach(function (id) { boxes[store.cards[id].box] += 1; });

    show([h('h1', { text: 'My progress' }),
      h('h2', { text: 'How well do you judge yourself?' }), table,
      h('div', { class: 'card' }, advice.map(function (t) { return h('p', { text: t }); })),
      h('h2', { text: 'Misconception Map' }),
      h('p', { class: 'hint', text: 'Green means you avoided this trap the last 2 times you met it.' }), misList,
      h('h2', { text: 'Review boxes' }),
      h('p', { class: 'hint', text: 'Box 1: ' + boxes[1] + '   Box 2: ' + boxes[2] + '   Box 3: ' + boxes[3] + '   Box 4: ' + boxes[4] + '   Box 5: ' + boxes[5] }),
      h('button', { class: 'btn', text: 'Home', onclick: home })]);
  }

  // ---------- print ----------
  function printView() {
    var pool = poolFor(store.subject);
    var letters = 'ABCDEF';
    var cards = pool.map(function (it, n) {
      var answers = shuffle(visibleAnswers(it));
      var key = answers.map(function (a, i) {
        return letters[i] + ' ' + LABELS[a.type] + (a.type === 'trap' ? ' (' + a.mis + ')' : '');
      }).join('.   ');
      return h('div', { class: 'printcard' }, [
        h('p', { class: 'hint', text: (n + 1) + '. ' + it.subject + '   |   ' + it.syllabus }),
        h('p', { text: it.stem }),
        h('ol', { type: 'A' }, answers.map(function (a) { return h('li', { text: a.text + '   Correct / Trap / Dud' }); })),
        h('p', { text: 'Bet: 1   2   3' }),
        h('div', { class: 'key' }, [h('p', { text: 'Key: ' + key }), h('p', { text: 'How to spot it: ' + it.tip })])
      ]);
    });
    show([h('div', { class: 'noprint' }, [
        h('h1', { text: 'Print cards' }),
        h('p', { class: 'hint', text: store.subject + ', ages ' + store.age + '. Fold or cut off the key before class.' }),
        h('div', { class: 'row' }, [
          h('button', { class: 'btn', text: 'Print', onclick: function () { window.print(); } }),
          h('button', { class: 'btn ghost', text: 'Back', onclick: home })])
      ])].concat(cards));
  }

  // ---------- export ----------
  function exportCSV() {
    if (!store.log.length) { window.alert('No answers saved yet.'); return; }
    var cols = ['t', 'session', 'item', 'subject', 'age', 'scan', 'bet', 'right', 'labels', 'trap', 'picked', 'pickedRight', 'explanation'];
    var esc = function (v) { v = v === null || v === undefined ? '' : String(v); return '"' + v.replace(/"/g, '""') + '"'; };
    var lines = [cols.join(',')].concat(store.log.map(function (r) { return cols.map(function (c) { return esc(r[c]); }).join(','); }));
    var blob = new Blob(['﻿' + lines.join('\n')], { type: 'text/csv;charset=utf-8' });
    var a = h('a', { href: URL.createObjectURL(blob), download: 'answer-sorter-data.csv' });
    document.body.appendChild(a); a.click(); a.remove();
  }

  // ---------- offline ----------
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(function () { /* still works online */ });
  }

  home();
})();
