/* "Spotted a mistake?" button. Loaded on trainers and blog posts as /report.js.
   Opens an email to Rich with the page, the address and any text the reader
   selected already filled in. No backend, no data stored. */
(function () {
  var TO = 'rich@cieinsider.com';

  function isDark() {
    var c = getComputedStyle(document.body).backgroundColor.match(/\d+/g);
    if (!c) return false;
    return (0.299 * c[0] + 0.587 * c[1] + 0.114 * c[2]) < 128;
  }

  function build() {
    var dark = isDark();
    var css = document.createElement('style');
    css.textContent =
      '#cie-report{position:fixed;right:14px;bottom:14px;z-index:90;' +
      'font:500 13px/1 Inter,system-ui,-apple-system,sans-serif;padding:9px 13px;border-radius:999px;' +
      'cursor:pointer;text-decoration:none;box-shadow:0 2px 10px rgba(0,0,0,.15);opacity:.92;' +
      (dark ? 'background:#1a1f26;color:#e8e6e3;border:1px solid #3a4250;'
            : 'background:#faf6ec;color:#3a3127;border:1px solid #d8ccb4;') + '}' +
      '#cie-report:hover,#cie-report:focus-visible{opacity:1;' +
      (dark ? 'border-color:#d4a574;' : 'border-color:#a83b1f;color:#a83b1f;') + '}' +
      '@media print{#cie-report{display:none}}';
    document.head.appendChild(css);

    var a = document.createElement('a');
    a.id = 'cie-report';
    a.href = '#';
    a.textContent = 'Spotted a mistake?';
    a.title = 'Select the wrong bit first and it goes into the email';

    // Capture the selection on pointerdown: clicking a link can clear it.
    var picked = '';
    function grab() { picked = String(window.getSelection ? window.getSelection() : '').trim(); }
    a.addEventListener('pointerdown', grab);

    a.addEventListener('click', function (e) {
      e.preventDefault();
      if (!picked) grab();
      var quote = picked.slice(0, 600);
      var subject = 'Mistake on CIE Insider: ' + document.title.replace(/\s*\|\s*CIE Insider\s*$/, '');
      var body =
        'Page: ' + location.href + '\n\n' +
        (quote ? 'The bit that looks wrong:\n"' + quote + '"\n\n' : '') +
        'What I think it should say (and the paper or mark scheme, if you know it):\n\n';
      location.href = 'mailto:' + TO + '?subject=' + encodeURIComponent(subject) +
        '&body=' + encodeURIComponent(body);
      picked = '';
    });

    document.body.appendChild(a);

    // Sit above any bar pinned to the bottom of the screen (e.g. the MCQ "Mark paper" bar).
    function lift() {
      var h = 0, vh = window.innerHeight;
      var els = document.body.querySelectorAll('*');
      for (var i = 0; i < els.length; i++) {
        var el = els[i];
        if (el === a) continue;
        var pos = getComputedStyle(el).position;
        if (pos !== 'fixed' && pos !== 'sticky') continue;
        var r = el.getBoundingClientRect();
        if (r.height && r.height < vh / 2 && r.bottom >= vh - 2 && r.width > window.innerWidth / 2) {
          h = Math.max(h, vh - r.top);
        }
      }
      a.style.bottom = (14 + h) + 'px';
    }
    lift();
    // Trainers build their bottom bars after the first paint, so measure again.
    window.addEventListener('load', lift);
    setTimeout(lift, 1500);
    window.addEventListener('resize', lift);
    window.addEventListener('scroll', lift, { passive: true });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', build);
  else build();
})();
