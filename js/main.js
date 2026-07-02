/* Comportamentos gerais: tema, typewriter, count-up, filtros, cursor glow, reveals. */
(function () {
  'use strict';
  var root = document.documentElement;
  var body = document.body;
  body.classList.remove('no-js');
  body.classList.add('js-ready');

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Theme toggle (in-memory, no storage) ---------- */
  var toggle = document.getElementById('theme-toggle');
  toggle.addEventListener('click', function () {
    var next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    root.setAttribute('data-theme', next);
    var meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.setAttribute('content', next === 'dark' ? '#0a0a0f' : '#f7f7fb');
  });

  /* ---------- Year ---------- */
  document.getElementById('year').textContent = new Date().getFullYear();

  /* ---------- Nav blur on scroll ---------- */
  var nav = document.getElementById('nav');
  function onScroll() { nav.classList.toggle('scrolled', window.scrollY > 80); }
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* ---------- Typewriter (hero role) ---------- */
  var typed = document.getElementById('typed');
  var roles = ['Backend Developer', 'Automation Engineer', 'Integrations & APIs'];
  window.addEventListener('langchange', function (e) {
    if (e.detail.dict['hero.roles']) roles = e.detail.dict['hero.roles'];
  });
  if (reduceMotion) {
    typed.textContent = roles[0];
  } else {
    var ri = 0, ci = 0, deleting = false;
    (function tick() {
      var word = roles[ri % roles.length];
      typed.textContent = word.slice(0, ci);
      if (!deleting && ci < word.length) { ci++; setTimeout(tick, 65); }
      else if (!deleting && ci === word.length) { deleting = true; setTimeout(tick, 1800); }
      else if (deleting && ci > 0) { ci--; setTimeout(tick, 32); }
      else { deleting = false; ri = (ri + 1) % roles.length; setTimeout(tick, 320); }
    })();
  }

  /* ---------- Count-up stats ---------- */
  function countUp(el) {
    var target = parseInt(el.getAttribute('data-count'), 10);
    var valEl = el.querySelector('.val');
    if (reduceMotion) { valEl.textContent = target; return; }
    var start = performance.now(), dur = 1400;
    function frame(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      valEl.textContent = Math.round(target * eased);
      if (p < 1) requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
  }

  /* ---------- Project filter ---------- */
  var filters = document.querySelectorAll('.filter');
  var projects = document.querySelectorAll('.project');
  filters.forEach(function (btn) {
    btn.addEventListener('click', function () {
      filters.forEach(function (b) { b.classList.remove('is-active'); });
      btn.classList.add('is-active');
      var f = btn.getAttribute('data-filter');
      projects.forEach(function (p) {
        var tech = p.getAttribute('data-tech') || '';
        p.classList.toggle('is-hidden', !(f === 'all' || tech.indexOf(f) !== -1));
      });
      if (window.ScrollTrigger) ScrollTrigger.refresh();
    });
  });

  /* ---------- Cursor glow (pointer devices only) ---------- */
  var glow = document.getElementById('cursor-glow');
  if (window.matchMedia('(pointer: fine)').matches && !reduceMotion) {
    var gx = 0, gy = 0, cx = 0, cy = 0, active = false;
    window.addEventListener('mousemove', function (e) {
      gx = e.clientX; gy = e.clientY;
      if (!active) { active = true; glow.style.opacity = '1'; }
    });
    (function loop() {
      cx += (gx - cx) * 0.12; cy += (gy - cy) * 0.12;
      glow.style.transform = 'translate(' + cx + 'px,' + cy + 'px) translate(-50%,-50%)';
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- GSAP reveals ---------- */
  window.addEventListener('load', function () {
    var reveals = document.querySelectorAll('.reveal');

    if (!window.gsap || reduceMotion) {
      reveals.forEach(function (el) { el.classList.add('is-in'); });
      document.querySelectorAll('.stat__num').forEach(countUp);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    // Hero load-in (opacity/scale only — no translateY que desloque layout)
    var heroTl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    heroTl.from('.hero__status', { opacity: 0, duration: 0.6 })
          .from('.hero h1 .word', { yPercent: 110, opacity: 0, duration: 0.9, stagger: 0.08 }, '-=0.3')
          .from('.hero__role, .hero__tagline', { opacity: 0, y: 16, duration: 0.6, stagger: 0.1 }, '-=0.4')
          .from('.hero__cta .btn', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 }, '-=0.2')
          .from('.hero__stats .stat', { opacity: 0, y: 12, duration: 0.5, stagger: 0.08 }, '-=0.2');

    // Stats count-up quando entram na tela
    ScrollTrigger.create({
      trigger: '.hero__stats', start: 'top 90%', once: true,
      onEnter: function () { document.querySelectorAll('.stat__num').forEach(countUp); }
    });

    // Section reveals (opacity + slight y, batched)
    ScrollTrigger.batch('.reveal', {
      start: 'top 88%',
      onEnter: function (els) {
        gsap.to(els, { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out', stagger: 0.08, overwrite: true });
      }
    });
    gsap.set('.reveal', { y: 24 });
    // Garante que filhos do hero (já animados) fiquem visíveis
    gsap.set('.hero .reveal', { opacity: 1, y: 0 });

    ScrollTrigger.refresh();
  });
})();
