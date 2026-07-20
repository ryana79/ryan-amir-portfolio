/* ============================================
   RYAN AMIR · PORTFOLIO 2026 · runtime
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBoot();
  initSpotlight();
  initBackground();
  initClock();
  initTerminal();
  initStatCounters();
  initScrollProgress();
  initRailNav();
  initSectionInView();
  initScramble();
  initTilt();
  initMagnetic();
  initTabs();
  initFilter();
  initSubjectChips();
  initContactForm();
  initSmoothScroll();
  initCtaMini();
  initAgent();
  initKeyboardShortcuts();
});

/* ============================================
   BOOT SEQUENCE
   ============================================ */
function initBoot() {
  const boot = document.getElementById('boot');
  if (!boot) return;

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const seen = (() => {
    try { return sessionStorage.getItem('folio-boot-seen') === '1'; } catch (_) { return false; }
  })();

  if (reduceMotion || seen) {
    boot.classList.add('done');
    boot.style.display = 'none';
    return;
  }

  try { sessionStorage.setItem('folio-boot-seen', '1'); } catch (_) { /* noop */ }

  const lines = document.getElementById('boot-lines');
  const fill  = document.getElementById('boot-fill');
  const pct   = document.getElementById('boot-pct');

  const seq = [
    { txt: '> establishing session…',                          ms: 160, tag: 'info' },
    { txt: '✓ cert verified · ed25519:ryan-amir',                ms: 180, tag: 'ok'   },
    { txt: '✓ mounting /folio · v26.0.0',                       ms: 180, tag: 'ok'   },
    { txt: '✓ loading modules · cloud · platform · product',    ms: 200, tag: 'ok'   },
    { txt: '✓ handshake complete · ready',                       ms: 160, tag: 'ok'   },
  ];

  let p = 0;
  function step(i) {
    if (i >= seq.length) {
      p = 100;
      fill.style.width = '100%';
      pct.textContent = '100%';
      setTimeout(() => { boot.classList.add('done'); }, 200);
      return;
    }
    const { txt, ms, tag } = seq[i];
    const ln = document.createElement('span');
    ln.className = 'boot-line';
    ln.style.animationDelay = '0s';
    const time = new Date();
    const ts = [time.getHours(), time.getMinutes(), time.getSeconds()]
      .map(n => String(n).padStart(2, '0')).join(':');
    ln.innerHTML = `<span class="dim">${ts}</span><span class="${tag}">${txt}</span>`;
    lines.appendChild(ln);
    p += (100 / seq.length);
    fill.style.width = p + '%';
    pct.textContent = Math.round(p) + '%';
    setTimeout(() => step(i + 1), ms);
  }
  setTimeout(() => step(0), 80);
}

/* ============================================
   MOUSE SPOTLIGHT
   ============================================ */
function initSpotlight() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  let raf = 0;
  document.addEventListener('mousemove', (e) => {
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(() => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px');
      document.documentElement.style.setProperty('--my', e.clientY + 'px');
    });
  });
}

/* ============================================
   ANIMATED BACKGROUND — drifting nodes + lines
   ============================================ */
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    canvas.style.display = 'none';
    return;
  }
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [];
  let raf = 0;
  let running = true;

  function nodeBudget() {
    const base = w <= 720 ? 18 : 56;
    return Math.max(10, Math.round(base * (Math.min(w, 1400) / 1400)));
  }

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = nodeBudget();
    nodes = Array.from({ length: count }, () => ({
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.4,
    }));
  }
  resize();
  window.addEventListener('resize', resize);

  function readAccent() {
    const root = getComputedStyle(document.documentElement);
    return root.getPropertyValue('--accent').trim() || 'oklch(0.86 0.19 150)';
  }

  function tick() {
    if (!running) return;
    ctx.clearRect(0, 0, w, h);
    const accent = readAccent();

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 140 * 140) {
          const alpha = (1 - d2 / (140 * 140)) * 0.32;
          ctx.strokeStyle = accent.replace(/oklch\(([^)]+)\)/, (_, body) => `oklch(${body} / ${alpha.toFixed(3)})`);
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
    for (const n of nodes) {
      ctx.fillStyle = accent.replace(/oklch\(([^)]+)\)/, (_, body) => `oklch(${body} / 0.55)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    raf = requestAnimationFrame(tick);
  }

  function setRunning(on) {
    if (on === running) return;
    running = on;
    if (running) raf = requestAnimationFrame(tick);
    else cancelAnimationFrame(raf);
  }

  document.addEventListener('visibilitychange', () => {
    setRunning(!document.hidden);
  });

  // Pause when canvas is far off-screen (scrolled deep into page)
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => setRunning(e.isIntersecting && !document.hidden));
  }, { threshold: 0.01 });
  io.observe(canvas);

  raf = requestAnimationFrame(tick);
}

/* ============================================
   CLOCK
   ============================================ */
function initClock() {
  const el = document.querySelector('[data-stat="clock"]');
  if (!el) return;
  function tick() {
    const d = new Date();
    const hh = String(d.getUTCHours()).padStart(2, '0');
    const mm = String(d.getUTCMinutes()).padStart(2, '0');
    const ss = String(d.getUTCSeconds()).padStart(2, '0');
    el.textContent = `${hh}:${mm}:${ss}`;
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================
   TERMINAL LOG STREAM
   ============================================ */
function initTerminal() {
  const body = document.getElementById('term-body');
  if (!body) return;

  const seed = [
    ['init', "ssh ryan-amir@folio.dev"],
    ['ok',   "fingerprint verified · session opened"],
    ['info', "loading modules: cloud · platform · product"],
    ['ok',   "✓ azure · terraform · github actions"],
    ['ok',   "ready · open to Cloud / Platform / DevOps roles"],
    ['warn', "tip: press / for the agent · or scroll to folio"],
  ];

  function ts() {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(n => String(n).padStart(2, '0')).join(':');
  }

  function writeLine(tag, text) {
    const line = document.createElement('span');
    line.className = 'term-line';
    const t = document.createElement('span');
    t.className = 'term-time';
    t.textContent = ts();
    const p = document.createElement('span');
    p.className = 'term-prompt';
    p.textContent = '$';
    const tagEl = document.createElement('span');
    tagEl.className = 'term-tag ' + (tag === 'warn' ? 'warn' : tag === 'info' ? 'info' : '');
    tagEl.textContent = `[${tag.toUpperCase()}]`;
    const body2 = document.createElement('span');
    body2.textContent = ' ' + text;
    line.append(t, p, tagEl, body2);
    body.appendChild(line);
  }

  function bootSeed(i = 0) {
    if (i >= seed.length) {
      const cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      body.appendChild(cursor);
      return; // freeze — no infinite synthetic stream
    }
    writeLine(seed[i][0], seed[i][1]);
    setTimeout(() => bootSeed(i + 1), 200 + Math.random() * 120);
  }

  setTimeout(() => bootSeed(0), 280);
}

/* ============================================
   STAT COUNTERS (real profile metrics)
   ============================================ */
function initStatCounters() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = parseInt(el.dataset.count, 10);
      if (isNaN(target) || el.dataset.done) return;
      el.dataset.done = '1';
      const start = performance.now();
      const dur = 1100;
      const step = (now) => {
        const t = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(step);
        else el.textContent = target;
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll('.stat-card-num').forEach(el => obs.observe(el));
}

/* ============================================
   TEXT SCRAMBLE
   ============================================ */
function initScramble() {
  const els = document.querySelectorAll('[data-scramble]');
  if (!els.length) return;
  const chars = '▸◇■§¤//*≡$#@*<>{}[]0123456789';
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting || e.target.dataset.scrambled) return;
      e.target.dataset.scrambled = '1';
      scramble(e.target);
      obs.unobserve(e.target);
    });
  }, { threshold: 0.2 });
  els.forEach(el => obs.observe(el));

  function scramble(root) {
    // Find text nodes — walk only top-level text nodes inside span/em children
    const targets = [];
    root.querySelectorAll('*').forEach(child => {
      if (child.children.length) return; // leaf
      if (child.textContent.trim()) targets.push(child);
    });
    if (!targets.length && root.textContent.trim()) targets.push(root);

    targets.forEach((node, idx) => {
      const original = node.textContent;
      const len = original.length;
      let frame = 0;
      const total = 14;
      const delay = idx * 90;
      setTimeout(() => {
        const it = setInterval(() => {
          frame++;
          const progress = frame / total;
          let out = '';
          for (let i = 0; i < len; i++) {
            if (i < Math.floor(progress * len)) {
              out += original[i];
            } else if (original[i] === ' ') {
              out += ' ';
            } else {
              out += chars[Math.floor(Math.random() * chars.length)];
            }
          }
          node.textContent = out;
          if (frame >= total) {
            clearInterval(it);
            node.textContent = original;
          }
        }, 35);
      }, delay);
    });
  }
}

/* ============================================
   3D TILT
   ============================================ */
function initTilt() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  const cards = document.querySelectorAll('.folio-card, .module, .feature-project, .case-strip');
  cards.forEach(card => {
    let r = 0;
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) / (rect.width / 2);
      const dy = (e.clientY - cy) / (rect.height / 2);
      cancelAnimationFrame(r);
      r = requestAnimationFrame(() => {
        card.classList.add('tilting');
        card.style.transform = `perspective(900px) rotateX(${(-dy * 3).toFixed(2)}deg) rotateY(${(dx * 3).toFixed(2)}deg) translateZ(0)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      cancelAnimationFrame(r);
      card.classList.remove('tilting');
      card.style.transform = '';
    });
  });
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagnetic() {
  if (!window.matchMedia('(hover: hover)').matches) return;
  document.querySelectorAll('.btn').forEach(btn => {
    const glyph = btn.querySelector('.btn-glyph');
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const dx = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const dy = (e.clientY - rect.top - rect.height / 2) / rect.height;
      btn.style.transform = `translate(${(dx * 4).toFixed(1)}px, ${(dy * 4 - 2).toFixed(1)}px)`;
      if (glyph) glyph.style.transform = `translate(${(dx * 6).toFixed(1)}px, ${(dy * 6).toFixed(1)}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
      if (glyph) glyph.style.transform = '';
    });
  });
}

/* ============================================
   KEYBOARD SHORTCUTS
   ============================================ */
function initKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // ignore when typing
    const tag = (e.target.tagName || '').toLowerCase();
    if (tag === 'input' || tag === 'textarea') return;

    if (e.key === '/') {
      e.preventDefault();
      const panelKs = document.getElementById('agent-panel');
      const closerKs = panelKs ? panelKs.querySelector('.agent-close') : null;
      const launcherKs = document.getElementById('agent-launcher');
      if (panelKs && closerKs && panelKs.hidden === false) {
        closerKs.click();
        return;
      }
      if (launcherKs) launcherKs.click();
    }
    if (e.key === 'g') {
      // 'g then h' — cheap chord
      window._gPending = true;
      setTimeout(() => { window._gPending = false; }, 900);
    }
    if (window._gPending && e.key === 'h') {
      window._gPending = false;
      document.getElementById('home')?.scrollIntoView({ behavior: 'smooth' });
    }
  });
}

/* ============================================
   SCROLL PROGRESS
   ============================================ */
function initScrollProgress() {
  const bar = document.querySelector('.scroll-progress span');
  if (!bar) return;
  const tick = () => {
    const h = document.documentElement;
    const total = h.scrollHeight - h.clientHeight;
    const pct = total > 0 ? (h.scrollTop / total) * 100 : 0;
    bar.style.width = pct + '%';
  };
  window.addEventListener('scroll', tick, { passive: true });
  tick();
}

/* ============================================
   RAIL NAV / ACTIVE LINKS
   ============================================ */
function initRailNav() {
  const sections = document.querySelectorAll('section[id], header[id]');
  const links = document.querySelectorAll('.rail-nav a, .mobile-nav a');

  const setActive = () => {
    let current = '';
    const top = window.scrollY + 200;
    sections.forEach(s => { if (top >= s.offsetTop) current = s.id; });
    links.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + current));
  };
  window.addEventListener('scroll', () => requestAnimationFrame(setActive), { passive: true });
  setActive();
}

/* ============================================
   SECTION IN-VIEW + REVEALS
   ============================================ */
function initSectionInView() {
  const targets = document.querySelectorAll(
    '.section, .practice-grid .module, .folio-card, .feature-project, .case-strip, .contact-grid > *, .colo-grid'
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in-view');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -6% 0px' });

  targets.forEach((el, i) => {
    if (!el.classList.contains('section')) {
      el.classList.add('reveal');
      el.classList.add('reveal-d-' + ((i % 4) + 1));
    }
    obs.observe(el);
  });
}

/* ============================================
   TABS (WAI-ARIA)
   ============================================ */
function initTabs() {
  const tablist = document.querySelector('.tabs[role="tablist"]');
  if (!tablist) return;
  const tabs = Array.from(tablist.querySelectorAll('[role="tab"]'));
  const panels = tabs.map(t => document.getElementById(t.getAttribute('aria-controls'))).filter(Boolean);

  function activate(tab, { focusTab = true } = {}) {
    tabs.forEach(t => {
      const on = t === tab;
      t.classList.toggle('active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
      t.tabIndex = on ? 0 : -1;
    });
    panels.forEach(p => {
      const on = p.id === tab.getAttribute('aria-controls');
      p.classList.toggle('active', on);
      if (on) p.removeAttribute('hidden');
      else p.setAttribute('hidden', '');
    });
    if (focusTab) tab.focus();
  }

  // ensure initial state
  const initial = tabs.find(t => t.getAttribute('aria-selected') === 'true') || tabs[0];
  if (initial) activate(initial, { focusTab: false });

  tabs.forEach(t => {
    t.addEventListener('click', () => activate(t));
    t.addEventListener('keydown', (e) => {
      const i = tabs.indexOf(t);
      let next = -1;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (i + 1) % tabs.length;
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (i - 1 + tabs.length) % tabs.length;
      else if (e.key === 'Home') next = 0;
      else if (e.key === 'End') next = tabs.length - 1;
      if (next < 0) return;
      e.preventDefault();
      activate(tabs[next]);
    });
  });
}

/* ============================================
   FILTER
   ============================================ */
function initFilter() {
  const buttons = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.portfolio-item');
  const count = document.getElementById('filter-count');

  function updateCount(visible, total) {
    if (count) count.textContent = String(visible).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
  }
  updateCount(items.length, items.length);

  buttons.forEach(b => {
    b.addEventListener('click', () => {
      buttons.forEach(x => {
        x.classList.remove('active');
        x.setAttribute('aria-pressed', 'false');
      });
      b.classList.add('active');
      b.setAttribute('aria-pressed', 'true');
      const f = b.dataset.filter;
      let visible = 0;
      items.forEach((item, i) => {
        const show = f === 'all' || item.dataset.category === f;
        item.style.display = show ? '' : 'none';
        if (show) {
          visible++;
          item.style.animation = `panel-in 0.45s var(--ease) ${i * 0.05}s both`;
        }
      });
      updateCount(visible, items.length);
    });
  });
}

/* ============================================
   CONTACT FORM
   ============================================ */
function initContactForm() {
  const form = document.getElementById('contact-form');
  const msg = document.getElementById('msg');
  if (!form || !msg) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    msg.className = 'form-message';
    msg.textContent = '// transmitting…';

    const data = new FormData(form);
    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: { 'Accept': 'application/json' },
        body: data,
      });
      if (res.ok) {
        msg.className = 'form-message is-success';
        msg.innerHTML = '<span class="form-ok">✓ DELIVERED</span> message queued · reply within 24h on weekdays';
        form.reset();
      } else {
        msg.className = 'form-message is-error';
        msg.textContent = '✕ delivery failed · email ryanmohammadamir@gmail.com';
      }
    } catch (err) {
      msg.className = 'form-message is-error';
      msg.textContent = '✕ network error · email ryanmohammadamir@gmail.com';
    }
  });
}

function initSubjectChips() {
  const input = document.getElementById('contact-subject');
  const chips = document.querySelectorAll('.subject-chip');
  if (!input || !chips.length) return;
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      input.value = chip.dataset.subject || chip.textContent.trim();
      input.focus();
      chips.forEach(c => c.classList.toggle('active', c === chip));
    });
  });
}

/* ============================================
   SMOOTH SCROLL
   ============================================ */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (!href || href === '#' || href === '#!') return;
      const target = document.querySelector(href);
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 60;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
}

function initCtaMini() {
  document.querySelectorAll('[data-link]').forEach(b => {
    b.addEventListener('click', () => {
      const t = document.querySelector(b.dataset.link);
      if (t) t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
}

/* ============================================
   AGENT CHAT (Claude)
   ============================================ */
function initAgent() {
  const launcher = document.getElementById('agent-launcher');
  const panel    = document.getElementById('agent-panel');
  const closeBtn = panel.querySelector('.agent-close');
  const form     = document.getElementById('agent-form');
  const input    = document.getElementById('agent-input');
  const body     = document.getElementById('agent-body');
  const chips    = panel.querySelectorAll('.agent-chip');

  let launcherClickGuardUntil = 0;

  const SYSTEM = `You are Ryan Amir's portfolio agent. Speak in first-person plural ("we", "Ryan and I") sparingly; usually answer as a knowledgeable assistant on Ryan's behalf in 3rd person. Be concise (max ~80 words), warm, lower-case-ish technical tone. Use plain text. Never invent details — only use the facts below.

FACTS:
- Ryan Amir, 21, born in Pakistan, based Matawan NJ.
- Cloud engineer with 3+ years experience. Currently Cloud Engineer @ Astro Intelligence INC (Jul '23 — present). Previously Cloud Solutions Engineer @ Chief Technology Group (Jun '21 — Jun '23).
- Education: Rutgers University, BS Computer Science, 2023–2027.
- Strongest stack: Azure (admin associate cert), Terraform, Bicep, GitHub Actions, Python, PowerShell, Bash, Cosmos DB, Service Bus.
- Notable achievements: cut idle compute costs 25% via runbooks; administered Azure Virtual Desktop for 100+ users via Nerdio; sub-200ms API p95; resolved 85% of tickets on first contact at prior role.
- Featured projects: CloudPulse (AI observability — React + Azure Functions + OpenAI; github.com/ryana79/cloudpulse-azure-optimizer; live cloudpulse-ai.com), Platform Control Room (Azure IDP / GitOps / drift / cost; github.com/ryana79/platform-control-room; live platformcontrolroom.com), CardWise (rewards optimizer — Next.js on Vercel; source private; live cardwise-alpha.vercel.app), Incident Postmortem Manager, Azure Serverless User Manager (sub-200ms p95), Glight Cutz (Flask booking, 500+ clients).
- Certs: Azure Administrator Associate (Jan 2026), Azure Fundamentals, AWS Cloud Practitioner, AT&T Tech Academy.
- Open to Cloud, Platform, and DevOps roles. Based in Matawan NJ; remote-friendly. Best contact: ryanmohammadamir@gmail.com.

If asked anything you don't know, say so briefly and suggest emailing Ryan.`;

  const history = [];

  function open() {
    if (performance.now() < launcherClickGuardUntil) return;
    panel.hidden = false;
    document.documentElement.classList.add('agent-open');
    setTimeout(() => input.focus(), 80);
  }
  function close() {
    panel.hidden = true;
    document.documentElement.classList.remove('agent-open');
    launcherClickGuardUntil = performance.now() + 450;
    try { launcher.focus(); } catch (_) { /* noop */ }
  }

  launcher.addEventListener('click', (e) => {
    if (!panel.hidden) return;
    if (performance.now() < launcherClickGuardUntil) {
      e.preventDefault();
      e.stopPropagation();
      return;
    }
    open();
  });
  launcher.addEventListener('keydown', (e) => {
    if (!panel.hidden) return;
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); }
  });

  /** Mobile: synthetic "click" after touchend can hit the FAB under the panel — swallow it. */
  function onCloseInteract(ev) {
    if (ev) {
      ev.preventDefault();
      ev.stopPropagation();
    }
    close();
  }
  closeBtn.addEventListener('touchend', onCloseInteract, { passive: false });
  closeBtn.addEventListener('click', onCloseInteract);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !panel.hidden) close();
  });

  function addMsg(role, text, htmlExtra) {
    const wrap = document.createElement('div');
    wrap.className = 'agent-msg agent-msg-' + (role === 'user' ? 'user' : 'bot');
    const r = document.createElement('span');
    r.className = 'agent-msg-role';
    r.textContent = role === 'user' ? 'you' : 'agent';
    const t = document.createElement('span');
    t.className = 'agent-msg-text';
    t.textContent = text;
    if (htmlExtra) t.appendChild(htmlExtra);
    wrap.append(r, t);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    return t;
  }

  function mailtoFallback(question) {
    const a = document.createElement('a');
    a.href = 'mailto:ryanmohammadamir@gmail.com?subject=' +
      encodeURIComponent('Portfolio question') +
      '&body=' + encodeURIComponent(question || '');
    a.textContent = 'email Ryan →';
    a.className = 'agent-mail-link';
    return a;
  }

  function showTyping() {
    const w = document.createElement('div');
    w.className = 'agent-msg agent-msg-bot agent-typing-wrap';
    w.innerHTML = `<span class="agent-msg-role">agent</span><span class="agent-typing"><span class="dot"></span><span class="dot"></span><span class="dot"></span></span>`;
    body.appendChild(w);
    body.scrollTop = body.scrollHeight;
    return w;
  }

  async function ask(q) {
    if (!q.trim()) return;
    addMsg('user', q);
    const typing = showTyping();
    try {
      const res = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: q }),
      });
      typing.remove();
      if (!res.ok) {
        const space = document.createTextNode(' ');
        const frag = document.createDocumentFragment();
        frag.append(space, mailtoFallback(q));
        addMsg('agent', '// agent offline — ', frag);
        return;
      }
      const data = await res.json();
      const t = (data.text || '').trim();
      if (!t) {
        const space = document.createTextNode(' ');
        const frag = document.createDocumentFragment();
        frag.append(space, mailtoFallback(q));
        addMsg('agent', '// empty reply — ', frag);
        return;
      }
      addMsg('agent', t);
    } catch (_) {
      typing.remove();
      const space = document.createTextNode(' ');
      const frag = document.createDocumentFragment();
      frag.append(space, mailtoFallback(q));
      addMsg('agent', '// connection error — ', frag);
    }
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value;
    input.value = '';
    ask(q);
  });

  chips.forEach(c => {
    c.addEventListener('click', () => ask(c.textContent));
  });
}
