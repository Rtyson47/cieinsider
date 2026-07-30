/**
 * CIE Insider — Email Gate
 * ========================
 * Drop this file into every trainer page and wire up the appropriate
 * trigger calls (see "HOW TO WIRE UP" below).
 *
 * Features:
 *  - Per-trainer smart triggers (not just section completion)
 *  - Refresh-proof: progress counters persist in localStorage
 *  - One signup unlocks everything across the whole site
 *  - Modal matches CIE Insider design system
 *
 * Setup (Claude Code / Cowork — swap these two values):
 *   KIT_API_KEY  → your Kit (ConvertKit) public API key
 *   KIT_FORM_ID  → your Kit form ID (from the form's embed code)
 *
 * ─────────────────────────────────────────────────────────────
 * HOW TO WIRE UP — one call per trainer
 * ─────────────────────────────────────────────────────────────
 *
 * 1. P5 DRILL (drills mode — 10 questions)
 *    Call after each answer is submitted:
 *      CIEGate.track('drill_answer');
 *    Gate fires after 3 answers.
 *
 * 2. SPOTTER (8 scenarios)
 *    Call after each scenario is submitted:
 *      CIEGate.track('spotter_answer');
 *    Gate fires after 2 submissions.
 *
 * 3. PLANNING SIMULATOR (5 stages)
 *    Call after each stage is completed:
 *      CIEGate.track('planning_stage');
 *    Gate fires after 2 stages.
 *
 * 4. EXAMINER TIPS / GUIDE (browse-style, no answering)
 *    Add this once on page load — it handles its own timing:
 *      CIEGate.watchBrowse();
 *    Gate fires after 90 seconds on page AND 40% scroll depth.
 *    Both conditions must be met. Time accumulates across refreshes.
 *
 * ─────────────────────────────────────────────────────────────
 */

(function () {

  // ─────────────────────────────────────────────
  // CONFIG — replace with real values
  // ─────────────────────────────────────────────
  const KIT_API_KEY = 'BW8jYJD2dFUjrf5y-qjv6g';
  const KIT_FORM_ID = '9454927';

  const UNLOCK_KEY = 'cie_insider_unlocked';

  // Per-trainer thresholds
  const THRESHOLDS = {
    drill_answer:   3, // 3 drill questions answered
    spotter_answer: 2, // 2 spotter scenarios submitted
    planning_stage: 2, // 2 planning stages completed
  };

  // Browse trigger settings (Examiner Tips / Guide)
  const BROWSE = {
    seconds:     90,  // cumulative time on page (survives refreshes)
    scrollDepth: 0.40 // 40% down the page
  };

  // ─────────────────────────────────────────────
  // PUBLIC API
  // ─────────────────────────────────────────────
  window.CIEGate = {

    /**
     * Track a countable event (drill answer, spotter submission, etc.)
     * Call this every time the relevant action happens.
     * @param {string} eventKey — one of the keys in THRESHOLDS above
     */
    track(eventKey) {
      if (isUnlocked()) return;

      const storageKey = `cie_gate_count_${eventKey}`;
      const threshold  = THRESHOLDS[eventKey];

      if (!threshold) {
        console.warn(`CIEGate: unknown event key "${eventKey}"`);
        return;
      }

      // Increment and persist counter (survives refresh)
      let count = parseInt(localStorage.getItem(storageKey) || '0', 10);
      count += 1;
      localStorage.setItem(storageKey, count);

      if (count >= threshold) showModal();
    },

    /**
     * Set up scroll + time tracking for browse-style pages.
     * Call once on page load for Examiner Tips / Guide pages.
     * Both the time and scroll conditions must be met before the gate fires.
     * Time accumulates across page refreshes.
     */
    watchBrowse() {
      if (isUnlocked()) return;

      const TIME_KEY    = 'cie_gate_browse_time_done';
      const SCROLL_KEY  = 'cie_gate_browse_scroll_done';
      const ELAPSED_KEY = 'cie_gate_browse_elapsed';

      let timeReached   = localStorage.getItem(TIME_KEY)   === 'true';
      let scrollReached = localStorage.getItem(SCROLL_KEY) === 'true';

      function maybeShow() {
        if (timeReached && scrollReached) showModal();
      }

      // ── Time tracker ──────────────────────────
      if (!timeReached) {
        const elapsed   = parseInt(localStorage.getItem(ELAPSED_KEY) || '0', 10);
        const remaining = Math.max(0, BROWSE.seconds - elapsed) * 1000;
        const startedAt = Date.now();

        // Accumulate elapsed time when student leaves/refreshes
        function saveElapsed() {
          const spent = Math.round((Date.now() - startedAt) / 1000);
          localStorage.setItem(ELAPSED_KEY, elapsed + spent);
        }
        document.addEventListener('visibilitychange', saveElapsed);
        window.addEventListener('beforeunload', saveElapsed);

        setTimeout(() => {
          timeReached = true;
          localStorage.setItem(TIME_KEY, 'true');
          maybeShow();
        }, remaining);
      }

      // ── Scroll depth tracker ──────────────────
      if (!scrollReached) {
        function onScroll() {
          const docHeight = document.documentElement.scrollHeight - window.innerHeight;
          if (docHeight <= 0) return;
          const depth = window.scrollY / docHeight;
          if (depth >= BROWSE.scrollDepth) {
            scrollReached = true;
            localStorage.setItem(SCROLL_KEY, 'true');
            window.removeEventListener('scroll', onScroll);
            maybeShow();
          }
        }
        window.addEventListener('scroll', onScroll, { passive: true });
      }

      // Both conditions may already be satisfied on load (from a prior session)
      maybeShow();
    },

    /** Returns true if this device has already signed up */
    isUnlocked() {
      return isUnlocked();
    }
  };

  // ─────────────────────────────────────────────
  // INTERNAL
  // ─────────────────────────────────────────────
  function isUnlocked() {
    return localStorage.getItem(UNLOCK_KEY) === 'true';
  }

  function unlock() {
    localStorage.setItem(UNLOCK_KEY, 'true');
    // Clean up all gate tracking keys
    Object.keys(localStorage)
      .filter(k => k.startsWith('cie_gate_'))
      .forEach(k => localStorage.removeItem(k));
  }

  function showModal() {
    if (document.getElementById('cie-gate-overlay')) return; // already showing
    injectStyles();

    const overlay = document.createElement('div');
    overlay.id = 'cie-gate-overlay';
    overlay.innerHTML = `
      <div class="cie-gate-modal" role="dialog" aria-modal="true" aria-labelledby="cie-gate-title">
        <div class="cie-gate-kicker">FREE ACCESS</div>
        <h2 class="cie-gate-title" id="cie-gate-title">Keep going — it's free.</h2>
        <p class="cie-gate-body">
          All trainers stay free. Just tell us which paper you're revising so
          we can send you the right tips at the right time.
        </p>

        <div class="cie-gate-field-group">
          <label class="cie-gate-label">Which syllabus?</label>
          <div class="cie-gate-pills" id="cie-gate-syllabus">
            <button type="button" class="cie-gate-pill" data-value="0625">IGCSE Physics (0625)</button>
            <button type="button" class="cie-gate-pill" data-value="9702">A Level Physics (9702)</button>
            <button type="button" class="cie-gate-pill" data-value="both">Both</button>
          </div>
        </div>

        <div class="cie-gate-field-group">
          <label class="cie-gate-label">When's your exam?</label>
          <div class="cie-gate-pills" id="cie-gate-exam">
            <button type="button" class="cie-gate-pill" data-value="may_jun_2026">May/Jun 2026</button>
            <button type="button" class="cie-gate-pill" data-value="oct_nov_2026">Oct/Nov 2026</button>
            <button type="button" class="cie-gate-pill" data-value="may_jun_2027">May/Jun 2027</button>
            <button type="button" class="cie-gate-pill" data-value="exploring">Just exploring</button>
          </div>
        </div>

        <div class="cie-gate-field-group">
          <label class="cie-gate-label" for="cie-gate-email">Your email</label>
          <input
            id="cie-gate-email"
            class="cie-gate-input"
            type="email"
            placeholder="you@example.com"
            autocomplete="email"
          />
        </div>

        <button class="cie-gate-submit" id="cie-gate-submit">Continue for free →</button>
        <p class="cie-gate-disclaimer">No spam. Unsubscribe any time.</p>
        <p class="cie-gate-error" id="cie-gate-error" hidden></p>
      </div>
    `;

    document.body.appendChild(overlay);

    overlay.querySelectorAll('.cie-gate-pills').forEach(group => {
      group.querySelectorAll('.cie-gate-pill').forEach(pill => {
        pill.addEventListener('click', () => {
          group.querySelectorAll('.cie-gate-pill').forEach(p => p.classList.remove('selected'));
          pill.classList.add('selected');
        });
      });
    });

    overlay.querySelector('#cie-gate-submit').addEventListener('click', handleSubmit);
    overlay.querySelector('#cie-gate-email').addEventListener('keydown', e => {
      if (e.key === 'Enter') handleSubmit();
    });

    setTimeout(() => overlay.querySelector('#cie-gate-email').focus(), 100);
  }

  async function handleSubmit() {
    const email      = document.querySelector('#cie-gate-email').value.trim();
    const syllabus   = document.querySelector('#cie-gate-syllabus .selected')?.dataset.value;
    const examWindow = document.querySelector('#cie-gate-exam .selected')?.dataset.value;
    const errorEl    = document.querySelector('#cie-gate-error');
    const submitBtn  = document.querySelector('#cie-gate-submit');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showError('Please enter a valid email address.'); return;
    }
    if (!syllabus)   { showError('Please select a syllabus.'); return; }
    if (!examWindow) { showError('Please select your exam window.'); return; }

    submitBtn.textContent = 'Saving…';
    submitBtn.disabled = true;
    errorEl.hidden = true;

    try {
      const res = await fetch(
        `https://api.convertkit.com/v3/forms/${KIT_FORM_ID}/subscribe`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            api_key: KIT_API_KEY,
            email,
            tags: buildTags(syllabus, examWindow),
            fields: { syllabus, exam_window: examWindow }
          })
        }
      );

      const responseBody = await res.json();
      console.log('Kit response status:', res.status);
      console.log('Kit response body:', responseBody);

      unlock();
      closeModal();

    } catch (err) {
      submitBtn.textContent = 'Continue for free →';
      submitBtn.disabled = false;
      showError('Something went wrong — please try again.');
    }
  }

  function buildTags(syllabus, examWindow) {
    /**
     * Create matching tags in Kit, then paste their numeric IDs here.
     * Replace each 0 with the real Kit tag ID.
     */
    const TAG_IDS = {
      '0625':         19669519,
      '9702':         19669522,
      'both':         19669536,
      'may_jun_2026': 19669537,
      'oct_nov_2026': 19669541,
      'may_jun_2027': 19669543,
      'exploring':    19669546,
    };
    return [TAG_IDS[syllabus], TAG_IDS[examWindow]].filter(id => id > 0);
  }

  function closeModal() {
    const overlay = document.getElementById('cie-gate-overlay');
    if (overlay) {
      overlay.classList.add('cie-gate-fadeout');
      setTimeout(() => overlay.remove(), 400);
    }
  }

  function showError(msg) {
    const el = document.querySelector('#cie-gate-error');
    if (el) { el.textContent = msg; el.hidden = false; }
  }

  // ─────────────────────────────────────────────
  // STYLES
  // ─────────────────────────────────────────────
  function injectStyles() {
    if (document.getElementById('cie-gate-styles')) return;
    const style = document.createElement('style');
    style.id = 'cie-gate-styles';
    style.textContent = `
      #cie-gate-overlay {
        position: fixed;
        inset: 0;
        background: rgba(31, 26, 20, 0.72);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        padding: 1rem;
        animation: cieGateFadeIn 0.25s ease;
      }
      #cie-gate-overlay.cie-gate-fadeout {
        animation: cieGateFadeOut 0.4s ease forwards;
      }
      @keyframes cieGateFadeIn  { from { opacity: 0 } to { opacity: 1 } }
      @keyframes cieGateFadeOut { from { opacity: 1 } to { opacity: 0 } }

      .cie-gate-modal {
        background: #f5efe4;
        border-radius: 4px;
        border: 1px solid rgba(31, 26, 20, 0.12);
        box-shadow: 0 8px 32px rgba(31, 26, 20, 0.18);
        padding: 2.5rem 2.5rem 2rem;
        max-width: 480px;
        width: 100%;
        animation: cieGateSlideUp 0.3s ease;
      }
      @keyframes cieGateSlideUp {
        from { transform: translateY(16px); opacity: 0 }
        to   { transform: translateY(0);    opacity: 1 }
      }
      .cie-gate-kicker {
        font-family: 'Inter', sans-serif;
        font-size: 0.65rem;
        font-weight: 600;
        letter-spacing: 0.12em;
        color: #a83b1f;
        margin-bottom: 0.75rem;
      }
      .cie-gate-title {
        font-family: 'Fraunces', serif;
        font-size: 1.9rem;
        font-weight: 700;
        color: #1f1a14;
        margin: 0 0 0.6rem;
        line-height: 1.15;
      }
      .cie-gate-body {
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        color: #4a3f35;
        margin: 0 0 1.6rem;
        line-height: 1.55;
      }
      .cie-gate-field-group { margin-bottom: 1.25rem; }
      .cie-gate-label {
        display: block;
        font-family: 'Inter', sans-serif;
        font-size: 0.75rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        color: #1f1a14;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
      }
      .cie-gate-pills { display: flex; flex-wrap: wrap; gap: 0.4rem; }
      .cie-gate-pill {
        font-family: 'Inter', sans-serif;
        font-size: 0.8rem;
        padding: 0.35rem 0.8rem;
        border: 1.5px solid rgba(31, 26, 20, 0.25);
        border-radius: 100px;
        background: transparent;
        color: #1f1a14;
        cursor: pointer;
        transition: all 0.15s ease;
      }
      .cie-gate-pill:hover { border-color: #a83b1f; color: #a83b1f; }
      .cie-gate-pill.selected {
        background: #1f1a14;
        border-color: #1f1a14;
        color: #f5efe4;
      }
      .cie-gate-input {
        width: 100%;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        padding: 0.65rem 0.85rem;
        border: 1.5px solid rgba(31, 26, 20, 0.25);
        border-radius: 4px;
        background: #fff;
        color: #1f1a14;
        box-sizing: border-box;
        outline: none;
        transition: border-color 0.15s;
      }
      .cie-gate-input:focus { border-color: #a83b1f; }
      .cie-gate-submit {
        width: 100%;
        font-family: 'Inter', sans-serif;
        font-size: 0.9rem;
        font-weight: 600;
        padding: 0.8rem 1rem;
        background: #1f1a14;
        color: #f5efe4;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        margin-top: 0.5rem;
        transition: background 0.15s, opacity 0.15s;
      }
      .cie-gate-submit:hover    { background: #a83b1f; }
      .cie-gate-submit:disabled { opacity: 0.6; cursor: not-allowed; }
      .cie-gate-disclaimer {
        font-family: 'Inter', sans-serif;
        font-size: 0.72rem;
        color: #8a7a6e;
        text-align: center;
        margin: 0.6rem 0 0;
      }
      .cie-gate-error {
        font-family: 'Inter', sans-serif;
        font-size: 0.8rem;
        color: #a83b1f;
        margin: 0.5rem 0 0;
        text-align: center;
      }
      @media (max-width: 520px) {
        .cie-gate-modal { padding: 1.75rem 1.25rem 1.5rem; }
        .cie-gate-title { font-size: 1.5rem; }
      }
    `;
    document.head.appendChild(style);
  }

})();
