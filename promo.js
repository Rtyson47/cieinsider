/* Exam-season banner for /0625/ and /9702/ pages. Edit PROMOS to change or end an offer. */
(function () {
  var today = new Date();
  var iso = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

  // Any static banner marked data-until="YYYY-MM-DD" disappears the day after that date.
  var dated = document.querySelectorAll('[data-until]');
  for (var d = 0; d < dated.length; d++) {
    if (iso > dated[d].getAttribute('data-until')) dated[d].parentNode.removeChild(dated[d]);
  }

  // until = last day shown (viewer's local date). 0625 P6: Tue 20 Oct 2026 (Mon 19 Oct in Zone 1).
  var PROMOS = [
    {
      path: '/0625/', until: '2026-10-20',
      eyebrow: 'November offer &middot; IGCSE Paper 6',
      title: 'Do a proper dry run before your exam. <em>Fix what it shows in time for the real one.</em>',
      body: 'Sit a 0625 Paper 6 past paper, timed, and send me photos of your attempt. It comes back marked within two days: every mark placed where you earned or lost it, and a note on each lost mark saying what the mark scheme needed. Send it at least two days before your exam and you&rsquo;ll have the fixes in hand before you sit the real paper.',
      was: '&pound;25', now: '&pound;15', priceNote: 'Paper 6, until your exam',
      cta: 'Get my Paper 6 marked &rarr;', href: '/marked/paper-6/',
      note: 'The offer is for Paper 6. Multiple-choice papers mark themselves, free, in the <a href="/mcq/">MCQ trainer</a>, and I mark 0625 Papers 3 to 6 and 9702 Papers 2 to 5, from &pound;25. <a href="/marked/">See prices &rarr;</a>'
    },
    // 9702 P1: Tue 10 Nov 2026 in all six zones. P2/P5 (14 Oct) are too close to market marking for.
    {
      path: '/9702/', until: '2026-11-10',
      eyebrow: 'November exams &middot; 9702 Paper 1',
      title: 'Paper 1 on Tue 10 November? <em>Sit a real one now, while there&rsquo;s time to fix what it shows.</em>',
      body: 'The MCQ trainer has real 9702 Paper 1 past papers from 2023 to 2026: 40 questions in 75 minutes, the paper beside the answer panel, marked the moment you submit. Do one under exam conditions and you&rsquo;ll see where the marks are going.',
      now: 'Free', priceNote: 'Real past papers, marked instantly',
      cta: 'Sit a Paper 1 now &rarr;', href: '/mcq/?paper=9702_w25_qp_11&type=AS',
      note: 'Want a paper marked? Paper 1 marks itself, free, in the <a href="/mcq/">MCQ trainer</a>. I mark Papers 2 to 5 myself, mark by mark against the scheme, from &pound;25. <a href="/marked/">See how it works &rarr;</a>'
    }
  ];

  var path = location.pathname;
  var p = null;
  for (var i = 0; i < PROMOS.length; i++) {
    if (path.indexOf(PROMOS[i].path) === 0 && iso <= PROMOS[i].until && (!PROMOS[i].from || iso >= PROMOS[i].from)) { p = PROMOS[i]; break; }
  }
  if (!p) return;

  var css = '' +
    '.cie-promo{background:#faf6ec;border-bottom:1px solid #d8ccb4;color:#1f1a14;font-family:Inter,-apple-system,sans-serif;position:relative;z-index:2}' +
    '.cie-promo *{box-sizing:border-box}' +
    '.cie-promo-in{max-width:1180px;margin:0 auto;padding:32px 32px 36px;display:grid;grid-template-columns:1.35fr 1fr;gap:40px;align-items:center}' +
    '.cie-promo-eye{font-size:12px;font-weight:600;letter-spacing:.14em;text-transform:uppercase;color:#a83b1f;margin:0 0 12px}' +
    '.cie-promo-eye i{display:inline-block;width:6px;height:6px;border-radius:50%;background:#a83b1f;margin-right:8px;vertical-align:middle}' +
    '.cie-promo h2{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:clamp(24px,3vw,32px);line-height:1.15;letter-spacing:-.02em;margin:0 0 12px;color:#1f1a14;text-align:left}' +
    '.cie-promo h2 em{font-style:italic;font-weight:500;color:#7d2a14}' +
    '.cie-promo-body{font-size:15px;line-height:1.65;color:#3a3127;margin:0;max-width:60ch;text-align:left}' +
    '.cie-promo-act{display:flex;flex-direction:column;gap:10px;text-align:center}' +
    '.cie-promo-price{font-family:Fraunces,Georgia,serif;font-weight:600;font-size:34px;line-height:1;margin:0 0 4px;color:#1f1a14}' +
    '.cie-promo-price s{font-size:22px;font-weight:400;color:#6b5e4d;margin-right:6px;text-decoration-thickness:2px}' +
    '.cie-promo-price span{display:block;font-family:Inter,sans-serif;font-size:12.5px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#a83b1f;margin-top:8px}' +
    '.cie-promo-btn{display:block;background:#a83b1f;color:#fff !important;border:1px solid #a83b1f;border-radius:6px;padding:14px 22px;font-size:15px;font-weight:600;text-decoration:none !important}' +
    '.cie-promo-btn:hover{background:#7d2a14;border-color:#7d2a14}' +
    '.cie-promo-note{font-size:13px;line-height:1.5;color:#6b5e4d;margin:2px 0 0}' +
    '.cie-promo-note a{color:#7d2a14;font-weight:600;white-space:nowrap}' +
    '@media (max-width:820px){.cie-promo-in{grid-template-columns:1fr;gap:22px;padding:26px 20px 30px}}';

  var style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  var el = document.createElement('section');
  el.className = 'cie-promo';
  el.setAttribute('aria-label', 'Offer');
  el.innerHTML =
    '<div class="cie-promo-in"><div>' +
      '<p class="cie-promo-eye"><i></i>' + p.eyebrow + '</p>' +
      '<h2>' + p.title + '</h2>' +
      '<p class="cie-promo-body">' + p.body + '</p>' +
    '</div><div class="cie-promo-act">' +
      (p.now ? '<p class="cie-promo-price">' + (p.was ? '<s>' + p.was + '</s> ' : '') + p.now + (p.priceNote ? '<span>' + p.priceNote + '</span>' : '') + '</p>' : '') +
      '<a class="cie-promo-btn" href="' + p.href + '">' + p.cta + '</a>' +
      (p.note ? '<p class="cie-promo-note">' + p.note + '</p>' : '') +
    '</div></div>';

  var bar = document.querySelector('.topbar, .cie-topbar, body > nav');
  if (bar && bar.parentNode) bar.parentNode.insertBefore(el, bar.nextSibling);
  else document.body.insertBefore(el, document.body.firstChild);
})();
