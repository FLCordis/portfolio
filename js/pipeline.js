/* Pipeline Vivo — pacotes de dados fluindo pelo diagrama do hero.
   Fallback: sem GSAP/CDN ou com prefers-reduced-motion, o diagrama fica estático. */
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('load', function () {
    if (!window.gsap || !window.MotionPathPlugin || reduceMotion) return;
    gsap.registerPlugin(MotionPathPlugin);

    var svg = document.querySelector('.hero__pipeline');
    if (!svg) return;
    var layer = svg.querySelector('.pl-packets');
    var NS = 'http://www.w3.org/2000/svg';

    // rota: path, cor (token), nó de destino, duração, atraso inicial
    var routes = [
      { path: '#pl-p1', color: 'var(--pl-erp)',  dest: 'n8n', dur: 3.2, delay: 0   },
      { path: '#pl-p2', color: 'var(--pl-ecom)', dest: 'n8n', dur: 3.8, delay: 1.1 },
      { path: '#pl-p3', color: 'var(--pl-pg)',   dest: 'pg',  dur: 3.0, delay: 0.6 },
      { path: '#pl-p4', color: 'var(--pl-tg)',   dest: 'tg',  dur: 3.4, delay: 1.7 },
      { path: '#pl-p5', color: 'var(--pl-wa)',   dest: 'wa',  dur: 3.6, delay: 2.3 }
    ];

    function pulse(name) {
      var node = svg.querySelector('.pl-node[data-node="' + name + '"]');
      if (!node) return;
      var base = name === 'n8n' ? 34 : 26;
      node.classList.add('is-hot');
      gsap.fromTo(node.querySelector('circle'),
        { attr: { r: base } },
        { attr: { r: base + 4 }, duration: 0.18, yoyo: true, repeat: 1,
          onComplete: function () { node.classList.remove('is-hot'); } });
    }

    var tweens = routes.map(function (r) {
      var dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '5');
      dot.style.fill = r.color; // var() não funciona em atributo de apresentação, só em style
      layer.appendChild(dot);
      return gsap.to(dot, {
        motionPath: { path: r.path, align: r.path, alignOrigin: [0.5, 0.5] },
        duration: r.dur, delay: r.delay, repeat: -1, repeatDelay: 0.8, ease: 'power1.inOut',
        onRepeat: function () { pulse(r.dest); }
      });
    });

    // pausa fora da viewport (economia de CPU/bateria)
    new IntersectionObserver(function (entries) {
      var on = entries[0].isIntersecting;
      tweens.forEach(function (t) { on ? t.play() : t.pause(); });
    }, { threshold: 0.05 }).observe(svg);
  });
})();
