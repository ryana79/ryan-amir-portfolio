/* ============================================
   RYAN AMIR · PORTFOLIO 2026 · runtime
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
  initBoot();
  initSpotlight();
  initViewingNow();
  initBackground();
  initClock();
  initTerminal();
  initSparklines();
  initLiveStats();
  initScrollProgress();
  initRailNav();
  initSectionInView();
  initScramble();
  initTilt();
  initMagnetic();
  initTabs();
  initGauges();
  initFilter();
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
  const lines = document.getElementById('boot-lines');
  const fill  = document.getElementById('boot-fill');
  const pct   = document.getElementById('boot-pct');

  const seq = [
    { txt: '> establishing session…',                          ms: 220, tag: 'info' },
    { txt: '✓ cert verified · ed25519:ryan-amir',                ms: 240, tag: 'ok'   },
    { txt: '✓ mounting /folio · v26.0.0',                       ms: 260, tag: 'ok'   },
    { txt: '✓ loading modules · cloud · web · ops',              ms: 280, tag: 'ok'   },
    { txt: '· syncing telemetry · 1.2k events/sec',              ms: 240, tag: 'info' },
    { txt: '✓ handshake complete · ready',                       ms: 220, tag: 'ok'   },
  ];

  let p = 0;
  function step(i) {
    if (i >= seq.length) {
      p = 100;
      fill.style.width = '100%';
      pct.textContent = '100%';
      setTimeout(() => { boot.classList.add('done'); }, 250);
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
  setTimeout(() => step(0), 100);
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
   VIEWING NOW (fake-but-real-feeling presence)
   ============================================ */
function initViewingNow() {
  const el = document.getElementById('viewing-count');
  if (!el) return;
  // seed based on time so it doesn't reset each load
  const minute = Math.floor(Date.now() / 60000);
  let n = 3 + (minute % 9); // 3–11
  el.textContent = n;
  setInterval(() => {
    const delta = Math.random() < 0.5 ? -1 : 1;
    n = Math.max(2, Math.min(14, n + delta));
    el.textContent = n;
  }, 7000 + Math.random() * 4000);
}

/* ============================================
   ANIMATED BACKGROUND — drifting nodes + lines
   ============================================ */
function initBackground() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
  let nodes = [];
  const NODE_COUNT_BASE = 56;

  function resize() {
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const count = Math.round(NODE_COUNT_BASE * (Math.min(w, 1400) / 1400));
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
    ctx.clearRect(0, 0, w, h);
    const accent = readAccent();

    // update + draw nodes
    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > w) n.vx *= -1;
      if (n.y < 0 || n.y > h) n.vy *= -1;
    }

    // lines
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
    // dots
    for (const n of nodes) {
      ctx.fillStyle = accent.replace(/oklch\(([^)]+)\)/, (_, body) => `oklch(${body} / 0.55)`);
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fill();
    }
    requestAnimationFrame(tick);
  }
  tick();
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
    ['info', "loading modules: cloud · web · automation"],
    ['ok',   "✓ cloud-engineering        [ 95% ]"],
    ['ok',   "✓ infrastructure-as-code   [ 90% ]"],
    ['ok',   "✓ ci/cd pipelines          [ 85% ]"],
    ['info', "scanning recent commits · last 30 days"],
    ['info', "12 commits · 4 PRs merged · 0 incidents"],
    ['ok',   "ready · open to work"],
    ['warn', "tip: type 'help' in agent panel ↘"],
  ];

  const events = [
    ['info', "deploy → astro-prod · west-us : SUCCESS"],
    ['ok',   "terraform plan: 0 to add, 2 to change"],
    ['info', "metric: api.p95 · 187ms · ok"],
    ['warn', "cost-alert: vm-batch-03 right-sized · -18%"],
    ['ok',   "github actions · build #428 · green"],
    ['info', "ssh keys rotated · key-vault sync ok"],
    ['ok',   "bicep → resource group 'rg-folio' · OK"],
    ['info', "log analytics · 0 errors in last 24h"],
    ['warn', "azure-monitor alert · resolved < 4m"],
    ['ok',   "fslogix profile sync · 100 users · OK"],
    ['info', "k8s ingress refresh · zero downtime"],
    ['ok',   "service bus depth: 0 messages"],
    ['ok',   "agent online · ready for queries"],
  ];

  let idx = 0;
  function ts() {
    const d = new Date();
    return [d.getHours(), d.getMinutes(), d.getSeconds()]
      .map(n => String(n).padStart(2, '0')).join(':');
  }

  function writeLine(tag, text, instant) {
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

    while (body.children.length > 11) body.removeChild(body.firstChild);
  }

  function bootSeed(i = 0) {
    if (i >= seed.length) {
      const cursor = document.createElement('span');
      cursor.className = 'term-cursor';
      body.appendChild(cursor);
      streamLoop();
      return;
    }
    writeLine(seed[i][0], seed[i][1]);
    setTimeout(() => bootSeed(i + 1), 240 + Math.random() * 180);
  }

  function streamLoop() {
    const cursor = body.querySelector('.term-cursor');
    setInterval(() => {
      const [tag, txt] = events[idx % events.length];
      idx++;
      if (cursor) body.removeChild(cursor);
      writeLine(tag, txt);
      if (cursor) body.appendChild(cursor);
    }, 3400);
  }

  setTimeout(() => bootSeed(0), 350);
}

/* ============================================
   SPARKLINES
   ============================================ */
function initSparklines() {
  const sparks = document.querySelectorAll('.spark');
  const series = {};

  function noisySeries(base, jitter, len) {
    const out = [];
    let v = base;
    for (let i = 0; i < len; i++) {
      v += (Math.random() - 0.5) * jitter;
      v = Math.max(base * 0.55, Math.min(base * 1.45, v));
      out.push(v);
    }
    return out;
  }

  sparks.forEach(c => {
    const key = c.dataset.spark;
    const base = key === 'rps' ? 420 : key === 'cpu' ? 25 : 180;
    const jitter = key === 'rps' ? 28 : key === 'cpu' ? 6 : 10;
    series[key] = { canvas: c, data: noisySeries(base, jitter, 64), base, jitter };
  });

  function getAccent() {
    return getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#5cf3a4';
  }

  function draw(s) {
    const { canvas, data } = s;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const w = canvas.clientWidth, h = canvas.clientHeight;
    if (canvas.width !== w * dpr) { canvas.width = w * dpr; canvas.height = h * dpr; }
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);

    const min = Math.min(...data), max = Math.max(...data);
    const accent = getAccent();
    const range = max - min || 1;

    // baseline
    ctx.strokeStyle = 'rgba(255,255,255,0.06)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(0, h - 2);
    ctx.lineTo(w, h - 2);
    ctx.stroke();

    // path
    ctx.beginPath();
    data.forEach((v, i) => {
      const x = (i / (data.length - 1)) * w;
      const y = h - 3 - ((v - min) / range) * (h - 6);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    // gradient fill
    const grad = ctx.createLinearGradient(0, 0, 0, h);
    grad.addColorStop(0, accent.replace(/oklch\(([^)]+)\)/, (_, b) => `oklch(${b} / 0.35)`));
    grad.addColorStop(1, accent.replace(/oklch\(([^)]+)\)/, (_, b) => `oklch(${b} / 0)`));

    // dup for fill
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.6;
    ctx.shadowColor = accent;
    ctx.shadowBlur = 6;
    ctx.stroke();
    ctx.shadowBlur = 0;

    // fill
    ctx.lineTo(w, h);
    ctx.lineTo(0, h);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();
  }

  function tickAll() {
    Object.values(series).forEach(s => {
      s.data.push(s.data[s.data.length - 1] + (Math.random() - 0.5) * s.jitter);
      const tail = s.data[s.data.length - 1];
      const clipped = Math.max(s.base * 0.55, Math.min(s.base * 1.45, tail));
      s.data[s.data.length - 1] = clipped;
      if (s.data.length > 64) s.data.shift();
      draw(s);
    });
  }
  tickAll();
  setInterval(tickAll, 1100);
  window.addEventListener('resize', tickAll);
}

/* ============================================
   LIVE STATS (uptime, latency, telemetry nums)
   ============================================ */
function initLiveStats() {
  const lat = document.querySelector('[data-stat="lat"]');
  if (lat) {
    setInterval(() => {
      const ms = Math.round(12 + Math.random() * 8);
      lat.textContent = ms + 'ms';
    }, 1800);
  }

  const teleMap = { rps: [380, 460], cpu: [18, 32], p95: [170, 210] };
  Object.entries(teleMap).forEach(([k, [a, b]]) => {
    const el = document.querySelector(`[data-tele="${k}"]`);
    if (!el) return;
    setInterval(() => {
      el.textContent = Math.round(a + Math.random() * (b - a));
    }, 1100);
  });

  // animate stat-card counters
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
  const cards = document.querySelectorAll('.folio-card, .module, .feature-project');
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
  const links = document.querySelectorAll('.rail-nav a');

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
    '.section, .practice-grid .module, .folio-card, .feature-project, .contact-grid > *, .colo-grid'
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
   TABS
   ============================================ */
function initTabs() {
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.tab-panel');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      const id = t.dataset.tab;
      tabs.forEach(x => x.classList.remove('active'));
      panels.forEach(p => p.classList.remove('active'));
      t.classList.add('active');
      const panel = document.getElementById('tab-' + id);
      if (panel) panel.classList.add('active');
      if (id === 'skills') replayGauges();
    });
  });
}

/* ============================================
   GAUGES
   ============================================ */
let gaugesAnimated = false;

function initGauges() {
  const wrap = document.getElementById('tab-skills');
  if (!wrap) return;
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting && !gaugesAnimated && wrap.classList.contains('active')) {
        runGauges();
      }
    });
  }, { threshold: 0.2 });
  obs.observe(wrap);
}

function runGauges() {
  document.querySelectorAll('.gauge').forEach((g, i) => {
    const lv = parseInt(g.dataset.level, 10) || 0;
    const fill = g.querySelector('.gauge-fill');
    if (!fill) return;
    fill.style.width = '0%';
    setTimeout(() => { fill.style.width = lv + '%'; }, 120 + i * 110);
  });
  gaugesAnimated = true;
}

function replayGauges() {
  gaugesAnimated = false;
  setTimeout(runGauges, 60);
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
      buttons.forEach(x => x.classList.remove('active'));
      b.classList.add('active');
      const f = b.dataset.filter;
      let visible = 0;
      items.forEach((item, i) => {
        const show = f === 'all' || item.dataset.category === f;
        item.style.display = show ? '' : 'none';
        if (show) {
          visible++;
          item.style.animation = 'none';
          requestAnimationFrame(() => {
            item.style.animation = `panel-in 0.45s var(--ease) ${i * 0.05}s both`;
          });
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
        msg.textContent = '✓ message received · I\'ll write back soon';
        form.reset();
      } else {
        msg.className = 'form-message is-error';
        msg.textContent = '✕ delivery failed · please try again';
      }
    } catch (err) {
      msg.className = 'form-message is-error';
      msg.textContent = '✕ network error · please try again';
    }
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
- Featured projects: CloudPulse (AI cloud observability — React + Azure Functions + OpenAI, live at cloudpulse-ai.com), CardWise (credit-card rewards optimizer — ranks your wallet by dollars back; Next.js on Vercel at cardwise-alpha.vercel.app), Platform Control Room (Azure IDP / GitOps), Incident Postmortem Manager (Azure + React + Cosmos DB), Azure Serverless User Manager (Python Functions + Bicep, sub-200ms p95), Glight Cutz booking system (Flask, 500+ clients).
- Certs: Azure Administrator Associate (Jan 2026), Azure Fundamentals, AWS Cloud Practitioner, AT&T Tech Academy.
- Open to opportunities. Best contact: ryanmohammadamir@gmail.com.

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

  function addMsg(role, text) {
    const wrap = document.createElement('div');
    wrap.className = 'agent-msg agent-msg-' + (role === 'user' ? 'user' : 'bot');
    const r = document.createElement('span');
    r.className = 'agent-msg-role';
    r.textContent = role === 'user' ? 'you' : 'agent';
    const t = document.createElement('span');
    t.className = 'agent-msg-text';
    t.textContent = text;
    wrap.append(r, t);
    body.appendChild(wrap);
    body.scrollTop = body.scrollHeight;
    return t;
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
      const data = await res.json();
      typing.remove();
      const t = (data.text || '').trim() || '// no response — try emailing ryan at ryanmohammadamir@gmail.com';
      addMsg('agent', t);
    } catch (_) {
      typing.remove();
      addMsg('agent', '// connection error — try emailing ryan directly at ryanmohammadamir@gmail.com');
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
