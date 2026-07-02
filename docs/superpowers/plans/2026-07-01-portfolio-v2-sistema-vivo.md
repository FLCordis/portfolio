# Portfólio v2 "Sistema Vivo" — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reconstruir o portfólio como site multi-arquivo bilíngue cujo hero é um pipeline de integração SVG animado (spec: `docs/superpowers/specs/2026-07-01-portfolio-v2-design.md`).

**Architecture:** Site estático vanilla (sem build). `index.html` semântico com textos PT embutidos como padrão; `i18n.js` sobrescreve via `data-i18n` + JSON quando EN. `pipeline.js` anima pacotes SVG com GSAP MotionPath. `main.js` porta os comportamentos já validados do site atual (tema, typewriter, reveals, filtros).

**Tech Stack:** HTML5, CSS3 (custom properties, oklch), JS ES5-compatible IIFE, GSAP 3.12 + ScrollTrigger + MotionPathPlugin (CDN, defer), Netlify (deploy via GitHub).

**Referência de código existente:** o `index.html` atual (1215 linhas) contém componentes prontos para portar. Quando um passo disser "portar de `index.html:X-Y`", copie o bloco e adapte apenas seletor/token citado. O site atual NÃO deve ser editado — a v2 o substitui no branch.

**Validação por passo:** servidor local `npx -y serve -l 8787 .` (fetch de i18n exige http, não file://). Abrir `http://localhost:8787`.

---

### Task 0: Branch de trabalho

- [ ] **Step 1: Criar branch**

```bash
git checkout -b feat/v2-sistema-vivo
```

- [ ] **Step 2: Verificar**

Run: `git branch --show-current` → `feat/v2-sistema-vivo`

---

### Task 1: Scaffold, assets e Netlify

**Files:**
- Create: `netlify.toml`, `README.md`, `assets/cv-flavio-cordis.pdf` (cópia de `Profile.pdf`), pastas `css/ js/ i18n/ assets/`

- [ ] **Step 1: Copiar o CV**

```bash
mkdir -p css js i18n assets && cp Profile.pdf assets/cv-flavio-cordis.pdf
```

- [ ] **Step 2: Criar `netlify.toml`**

```toml
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"

[[headers]]
  for = "/index.html"
  [headers.values]
    Cache-Control = "public, max-age=0, must-revalidate"

[[headers]]
  for = "/css/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/js/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/i18n/*"
  [headers.values]
    Cache-Control = "public, max-age=86400"

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=604800"
```

- [ ] **Step 3: Criar `README.md`** — título "Portfólio — Flávio Cordis", 1 parágrafo sobre o conceito "Sistema Vivo", árvore de arquivos, seção "Rodando localmente" (`npx serve`), seção "Deploy" (Netlify + GitHub push), tecnologias. Sem badges falsas.

- [ ] **Step 4: Commit**

```bash
git add netlify.toml README.md assets/ && git commit -m "chore: scaffold da v2 (pastas, netlify.toml, CV, README)"
```

---

### Task 2: Design tokens — `css/tokens.css`

**Files:** Create: `css/tokens.css`

- [ ] **Step 1: Criar o arquivo.** Portar o bloco `:root` e `[data-theme="light"]` de `index.html:38-98` integralmente e ACRESCENTAR ao `:root` os tokens do pipeline:

```css
  /* Pipeline (hero) */
  --pl-node-bg: #0c1118;
  --pl-node-border: #1c2733;
  --pl-path: #16202b;
  --pl-erp: #00ff88;
  --pl-ecom: #3b9eff;
  --pl-pg: #8a6cff;
  --pl-tg: #ffb454;
  --pl-wa: #ff5f7a;
```

E ao `[data-theme="light"]`:

```css
  --pl-node-bg: #ffffff;
  --pl-node-border: #d8dce8;
  --pl-path: #dfe3ee;
```

- [ ] **Step 2: Commit** — `git add css/tokens.css && git commit -m "feat: design tokens (base + pipeline)"`

---

### Task 3: `index.html` base + nav + footer + CSS base

**Files:**
- Create: `index.html` (novo, substitui o antigo no branch), `css/main.css`

- [ ] **Step 1: Escrever o novo `index.html`** com:

1. `<head>`: portar meta/OG/favicon/fonts de `index.html:1-28` do site atual; trocar título para "Flávio Cordis — Backend & Automation Engineer"; adicionar:

```html
<link rel="stylesheet" href="css/tokens.css">
<link rel="stylesheet" href="css/main.css">
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"></script>
<script defer src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/MotionPathPlugin.min.js"></script>
```

2. Nav: portar estrutura de `index.html:654-681` e acrescentar o toggle de idioma antes do toggle de tema:

```html
<div class="lang-toggle" role="group" aria-label="Idioma / Language">
  <button data-lang="pt" class="is-active" aria-label="Português">PT</button>
  <span aria-hidden="true">/</span>
  <button data-lang="en" aria-label="English">EN</button>
</div>
```

Links da nav (com `data-i18n`): `#experience` entra entre `#about` e `#systems`; âncoras: `about, experience, systems, skills, projects, contact`.

3. `<main>` com as 7 seções vazias (`section id=...` + comentário), footer portado de `index.html:1063-1079`.

4. Antes de `</body>`:

```html
<script defer src="js/main.js"></script>
<script defer src="js/pipeline.js"></script>
<script defer src="js/i18n.js"></script>
```

- [ ] **Step 2: Criar `css/main.css`** portando de `index.html`: reset/base (103-165), cursor glow (170-183), nav (188-257), buttons (262-278), reveal + reduced-motion (635-646), footer (625-630). Adicionar estilo do lang-toggle:

```css
.lang-toggle { display: inline-flex; align-items: center; gap: 2px; font-family: var(--font-display); font-size: var(--text-xs); color: var(--color-text-faint); }
.lang-toggle button { padding: var(--space-2); border-radius: var(--radius-sm); color: var(--color-text-muted); transition: color var(--transition); min-height: 44px; }
.lang-toggle button:hover { color: var(--color-text); }
.lang-toggle button.is-active { color: var(--color-primary); font-weight: 700; }
```

- [ ] **Step 3: Verificar** — `npx -y serve -l 8787 .`, abrir `http://localhost:8787`: nav renderiza com PT/EN + tema, página vazia sem erros no console (404 de js/ ainda é aceitável neste passo — criar `js/main.js`, `js/pipeline.js`, `js/i18n.js` vazios com `/* placeholder até Task N */` para zerar 404).

- [ ] **Step 4: Commit** — `git add index.html css/main.css js/ && git commit -m "feat: base da v2 (head, nav com idioma, footer, css base)"`

---

### Task 4: Hero — Pipeline Vivo (markup + estilos)

**Files:** Modify: `index.html` (seção hero), `css/main.css`

- [ ] **Step 1: Markup do hero.** Estrutura (conteúdo central portado/adaptado de `index.html:686-730`; textos PT são o conteúdo padrão):

```html
<section class="hero" id="hero" aria-label="Apresentação">
  <svg class="hero__pipeline" viewBox="0 0 1200 680" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <g class="pl-paths" fill="none" stroke="var(--pl-path)" stroke-width="1.5">
      <path id="pl-p1" d="M120 470 C 340 470, 380 340, 600 340"/>
      <path id="pl-p2" d="M170 590 C 380 590, 420 340, 600 340"/>
      <path id="pl-p3" d="M600 340 C 820 340, 860 430, 1080 430"/>
      <path id="pl-p4" d="M600 340 C 820 340, 860 560, 1100 560"/>
      <path id="pl-p5" d="M600 340 C 800 340, 840 250, 1050 250"/>
    </g>
    <g class="pl-nodes" font-family="var(--font-display)">
      <g class="pl-node" data-node="erp"      transform="translate(120 470)"><circle r="26"/><text y="48">ERP</text></g>
      <g class="pl-node" data-node="ecom"     transform="translate(170 590)"><circle r="26"/><text y="48">e-commerce</text></g>
      <g class="pl-node pl-node--core" data-node="n8n" transform="translate(600 340)"><circle r="34"/><text y="58">N8N</text></g>
      <g class="pl-node" data-node="pg"       transform="translate(1080 430)"><circle r="26"/><text y="48">PostgreSQL</text></g>
      <g class="pl-node" data-node="tg"       transform="translate(1100 560)"><circle r="26"/><text y="48">Telegram</text></g>
      <g class="pl-node" data-node="wa"       transform="translate(1050 250)"><circle r="26"/><text y="48">WhatsApp</text></g>
    </g>
    <g class="pl-packets"></g><!-- pipeline.js injeta os pacotes aqui -->
  </svg>
  <div class="hero__scrim" aria-hidden="true"></div>
  <div class="wrap hero__inner"><!-- centralizado -->
    <span class="hero__status"><span class="dot"></span> <span data-i18n="hero.status">Buscando novos desafios · Araraquara, SP</span></span>
    <h1><span class="line"><span class="word">Flávio</span></span> <span class="line"><span class="word stroke">Cordis</span></span></h1>
    <p class="hero__role"><span id="typed"></span><span class="cursor" aria-hidden="true">_</span></p>
    <p class="hero__tagline" data-i18n="hero.tagline">Arquitetura primeiro. Código depois. <span class="accent">Complexidade nunca.</span></p>
    <div class="hero__cta">
      <a href="#projects" class="btn btn--primary" data-i18n="hero.cta.projects">Ver Projetos</a>
      <a href="assets/cv-flavio-cordis.pdf" download class="btn btn--ghost" data-i18n="hero.cta.cv">Baixar CV ↓</a>
      <a href="https://github.com/FLCordis" target="_blank" rel="noopener noreferrer" class="btn btn--ghost">GitHub →</a>
    </div>
    <dl class="hero__stats"><!-- portar 3 stats de index.html:710-723; labels com data-i18n --></dl>
  </div>
  <div class="hero__scroll" aria-hidden="true"><span>scroll</span><span class="bar"></span></div>
</section>
```

- [ ] **Step 2: Estilos do hero em `css/main.css`.** Portar hero base de `index.html:283-405` (sem `.hero__grid`/`.hero__glow`, substituídos pelo pipeline) e adicionar:

```css
.hero__pipeline { position: absolute; inset: 0; width: 100%; height: 100%; }
.hero__scrim { position: absolute; inset: 0; background: linear-gradient(180deg, color-mix(in srgb, var(--color-bg) 30%, transparent), color-mix(in srgb, var(--color-bg) 82%, transparent) 70%); pointer-events: none; }
.hero__inner { text-align: center; }
.hero h1 .line { display: inline-block; }
.hero__cta, .hero__stats { justify-content: center; margin-inline: auto; }
.pl-node circle { fill: var(--pl-node-bg); stroke: var(--pl-node-border); stroke-width: 1.5; transition: filter var(--transition); }
.pl-node text { fill: var(--color-text-faint); font-size: 13px; text-anchor: middle; letter-spacing: .04em; }
.pl-node--core circle { stroke: var(--color-primary); }
.pl-node--core text { fill: var(--color-text-muted); }
.pl-node.is-hot circle { filter: drop-shadow(0 0 10px var(--color-primary-glow)); }
.pl-node[data-node="erp"]  circle { stroke: color-mix(in srgb, var(--pl-erp) 45%, var(--pl-node-border)); }
.pl-node[data-node="ecom"] circle { stroke: color-mix(in srgb, var(--pl-ecom) 45%, var(--pl-node-border)); }
.pl-node[data-node="pg"]   circle { stroke: color-mix(in srgb, var(--pl-pg) 45%, var(--pl-node-border)); }
.pl-node[data-node="tg"]   circle { stroke: color-mix(in srgb, var(--pl-tg) 45%, var(--pl-node-border)); }
.pl-node[data-node="wa"]   circle { stroke: color-mix(in srgb, var(--pl-wa) 45%, var(--pl-node-border)); }
@media (max-width: 720px) { .pl-node text { font-size: 17px; } }
```

- [ ] **Step 3: Verificar** no browser: pipeline estático visível atrás do texto central, legível nos 2 temas, sem overflow horizontal no mobile (DevTools 375px).

- [ ] **Step 4: Commit** — `git commit -am "feat: hero Pipeline Vivo (markup e estilos, estático)"`

---

### Task 5: `js/pipeline.js` — animação

**Files:** Create (substituir placeholder): `js/pipeline.js`

- [ ] **Step 1: Implementar:**

```js
(function () {
  'use strict';
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  window.addEventListener('load', function () {
    if (!window.gsap || !window.MotionPathPlugin || reduceMotion) return; // fallback: estático
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
      node.classList.add('is-hot');
      gsap.fromTo(node.querySelector('circle'),
        { attr: { r: name === 'n8n' ? 34 : 26 } },
        { attr: { r: (name === 'n8n' ? 34 : 26) + 4 }, duration: 0.18, yoyo: true, repeat: 1,
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
```

- [ ] **Step 2: Verificar** no browser: 5 pacotes fluindo, nós pulsando ao completar ciclo; rolar para baixo → animação pausa (checar no Performance monitor); ativar "Emulate prefers-reduced-motion" no DevTools + reload → diagrama estático.

- [ ] **Step 3: Commit** — `git add js/pipeline.js && git commit -m "feat: animação do pipeline (GSAP MotionPath + pausa fora da viewport)"`

---

### Task 6: Seção Sobre

**Files:** Modify: `index.html`, `css/main.css`

- [ ] **Step 1: Markup.** Portar base de `index.html:733-772` (grid, corpo, quote da Pamela Zave, terminal card) com `data-i18n` em todos os textos. Acrescentar após o quote:

```html
<div class="creds reveal">
  <h3 class="creds__title" data-i18n="about.creds.title">Certificações & Idiomas</h3>
  <ul class="creds__list">
    <li class="chip">Linux Experience</li>
    <li class="chip">Git & GitHub</li>
    <li class="chip">Docker — containers</li>
    <li class="chip">DevOps — CI/CD</li>
    <li class="chip" data-i18n="about.creds.english">Inglês B2 — leitura técnica e trabalho</li>
  </ul>
  <a class="btn btn--ghost" href="assets/cv-flavio-cordis.pdf" download data-i18n="about.creds.cv">Baixar CV completo ↓</a>
</div>
```

- [ ] **Step 2: CSS.** Portar about/quote/terminal de `index.html:410-452` + `.chips/.chip` de `477-489`. Adicionar:

```css
.creds { margin-top: var(--space-8); }
.creds__title { font-family: var(--font-display); font-size: var(--text-sm); margin-bottom: var(--space-3); }
.creds__list { list-style: none; display: flex; flex-wrap: wrap; gap: var(--space-2); margin-bottom: var(--space-4); }
```

- [ ] **Step 3: Verificar + commit** — `git commit -am "feat: seção sobre (método, certificações, download do CV)"`

---

### Task 7: Experiência — "Deploy Log"

**Files:** Modify: `index.html`, `css/main.css`

- [ ] **Step 1: Markup** (`section id="experience"`, eyebrow `// 02 — experiência`). Cada entrada:

```html
<ol class="deploylog">
  <li class="deploy reveal">
    <div class="deploy__marker"><span class="deploy__ver">v3.1</span><span class="deploy__line" aria-hidden="true"></span></div>
    <div class="deploy__body">
      <header class="deploy__head">
        <h3 class="deploy__role" data-i18n="exp.ns2.role">Engenheiro de Software Júnior</h3>
        <span class="deploy__org">New Standard Software</span>
        <time class="deploy__when mono" data-i18n="exp.ns2.when">out/2025 — atual · Araraquara, SP</time>
      </header>
      <ul class="deploy__items">
        <li data-i18n="exp.ns2.i1">Fluxos Node.js integrando o ERP a e-commerces e CRMs</li>
        <li data-i18n="exp.ns2.i2">APIs e microsserviços em Java Spring</li>
        <li data-i18n="exp.ns2.i3">App mobile do ERP em Flutter</li>
        <li data-i18n="exp.ns2.i4">Logs anti-redundância e rastreabilidade em PostgreSQL</li>
        <li data-i18n="exp.ns2.i5">Infra de mídia em Cloudflare R2 consumida via API</li>
      </ul>
      <div class="deploy__badges"><span class="badge">Node.js</span><span class="badge">Java Spring</span><span class="badge">Flutter</span><span class="badge">PostgreSQL</span><span class="badge">Cloudflare</span></div>
    </div>
  </li>
  <!-- v3.0 New Standard · Desenvolvedor Java (fev/2025—out/2025): integrações MatCon,
       automações N8N/JS/SQL, modelagem PostgreSQL, onboarding de clientes.
       Badges: N8N, JavaScript, SQL, REST -->
  <!-- v2.0 Followize · Desenvolvedor Full Stack (nov/2022—nov/2023): Laravel+Angular,
       distribuição de leads, APIs RESTful+Postman, Docker, Git/GitLab.
       Badges: Laravel, Angular, Docker, MySQL -->
  <!-- v1.0 JBT FoodTech · Estagiário de TI (fev/2022—nov/2022): SQL, sistemas Java, suporte.
       Badges: Java, SQL -->
</ol>
```

(As 3 entradas comentadas seguem EXATAMENTE o mesmo markup da primeira, com chaves `exp.ns1.*`, `exp.fw.*`, `exp.jbt.*` e os conteúdos indicados.)

- [ ] **Step 2: CSS:**

```css
.deploylog { list-style: none; display: grid; gap: var(--space-8); max-width: 760px; }
.deploy { display: grid; grid-template-columns: 64px 1fr; gap: var(--space-6); }
.deploy__marker { position: relative; display: flex; flex-direction: column; align-items: center; }
.deploy__ver { font-family: var(--font-display); font-size: var(--text-xs); font-weight: 700; color: var(--color-accent); background: var(--color-accent-dim); border: 1px solid color-mix(in srgb, var(--color-accent) 30%, transparent); border-radius: var(--radius-full); padding: var(--space-1) var(--space-2); }
.deploy__line { flex: 1; width: 1px; margin-top: var(--space-2); background: linear-gradient(var(--color-border-strong), transparent); }
.deploy:last-child .deploy__line { display: none; }
.deploy__head { display: flex; flex-wrap: wrap; align-items: baseline; gap: var(--space-2) var(--space-3); margin-bottom: var(--space-3); }
.deploy__role { font-weight: 700; font-size: var(--text-lg); letter-spacing: -0.01em; }
.deploy__org { font-family: var(--font-display); font-size: var(--text-sm); color: var(--color-primary); }
.deploy__when { font-size: var(--text-xs); color: var(--color-text-faint); flex-basis: 100%; }
.deploy__items { list-style: none; display: grid; gap: var(--space-2); margin-bottom: var(--space-4); color: var(--color-text-muted); font-size: var(--text-sm); }
.deploy__items li::before { content: '▸ '; color: var(--color-accent); font-family: var(--font-display); }
.deploy__badges { display: flex; flex-wrap: wrap; gap: var(--space-2); }
@media (max-width: 560px) { .deploy { grid-template-columns: 1fr; } .deploy__marker { flex-direction: row; } .deploy__line { display: none; } }
```

(`.badge` portado de `index.html:552-557`.)

- [ ] **Step 3: Verificar + commit** — `git commit -am "feat: timeline de experiência estilo deploy log"`

---

### Task 8: Sistemas em Produção

**Files:** Modify: `index.html`, `css/main.css`

- [ ] **Step 1: Markup** (`section id="systems"`, fundo `--color-surface` como a antiga automation, eyebrow `// 03 — sistemas`). Grid de 6 cards; portar base `.node` de `index.html:575-589` renomeando para `.sys`, e acrescentar linha de resultado:

```html
<article class="sys reveal">
  <div class="sys__ico"><!-- svg do ícone (portar os 6 de index.html:986-1026) --></div>
  <h3 class="sys__title" data-i18n="sys.ecom.title">Integrações de E-commerce</h3>
  <p class="sys__desc" data-i18n="sys.ecom.desc">Sincronização ERP ↔ Bling, WooCommerce, Mercado Livre, RD Station e Bitrix24.</p>
  <p class="sys__result mono" data-i18n="sys.ecom.result">→ refatoração eliminou falhas silenciosas de sincronização</p>
</article>
```

Os 6 cards (título / desc / resultado):
1. `sys.ecom` — acima.
2. `sys.logs` — "Logs Anti-redundância" / "Persistência estruturada em PostgreSQL com validação condicional." / "→ zero inserções duplicadas, rastreabilidade total de erros".
3. `sys.media` — "Infra de Mídia Cloudflare" / "Hospedagem de mídia com R2, D1 e Workers, consumo via API." / "→ menor custo e compatibilidade ampla de formatos".
4. `sys.fin` — "Automações Financeiras" / "Relatórios de e-commerce, PIX e renovação de credenciais bancárias." / "→ processos críticos sem intervenção manual".
5. `sys.bots` — "Bots WhatsApp & Telegram" / "Notificações, relatórios e monitoramento para equipes e clientes." / "→ alertas em tempo real, resposta imediata a falhas".
6. `sys.backup` — "Backup de Workflows N8N" / "Versionamento automático de fluxos no GitHub." / "→ restauração individual de qualquer workflow".

- [ ] **Step 2: CSS:** portar `.automation/.node` de `index.html:570-589` (renomear `.systems/.sys`) e adicionar:

```css
.sys__result { margin-top: var(--space-3); font-size: var(--text-xs); color: var(--color-accent); }
```

- [ ] **Step 3: Verificar + commit** — `git commit -am "feat: seção sistemas em produção (automações + resultados)"`

---

### Task 9: Stack + Projetos + Contato

**Files:** Modify: `index.html`, `css/main.css`

- [ ] **Step 1: Stack** — portar seção inteira de `index.html:775-861` (clusters, chips com ícones simpleicons, tags de contexto) com `data-i18n` nos títulos/descrições/tags. Eyebrow vira `// 04 — stack`.

- [ ] **Step 2: Projetos** — portar de `index.html:864-974` (filtros + 5 projetos, incl. 2 featured com terminal visual) com `data-i18n` nas descrições. Eyebrow `// 05 — projetos`. CSS: portar `index.html:505-565` + `@property --ga` (519) e keyframe `spin`.

- [ ] **Step 3: Contato** — portar de `index.html:1033-1059` (3 contact links) com `data-i18n` no título/lead. Eyebrow `// 06 — contato`. CSS: `index.html:598-620`.

- [ ] **Step 4: Verificar** página completa no browser (todas as seções, dois temas) **+ commit** — `git commit -am "feat: seções stack, projetos e contato"`

---

### Task 10: `js/main.js` — comportamentos

**Files:** Create (substituir placeholder): `js/main.js`

- [ ] **Step 1: Portar** de `index.html:1081-1212` a IIFE inteira: tema, ano, nav scroll, typewriter, count-up, filtros, cursor glow, GSAP reveals. Duas mudanças:

1. Typewriter lê papéis de variável atualizável e escuta troca de idioma:

```js
var roles = ['Backend Developer', 'Automation Engineer', 'Integrations & APIs'];
window.addEventListener('langchange', function (e) {
  if (e.detail.dict['hero.roles']) roles = e.detail.dict['hero.roles'];
});
```

(o loop `tick()` já referencia `roles[ri]` dinamicamente — funciona sem mais mudanças; em EN as roles são as mesmas, mas a chave existe para permitir variação.)

2. O bloco hero timeline do GSAP não referencia mais `.hero__sub` (removido na v2) — tirar da lista.

- [ ] **Step 2: Verificar** todos os comportamentos no browser (tema, typewriter, count-up ao rolar, filtros, reveals) **+ commit** — `git commit -am "feat: comportamentos (tema, typewriter, reveals, filtros)"`

---

### Task 11: i18n — `i18n/pt.json`, `i18n/en.json`, `js/i18n.js`

**Files:** Create: `i18n/pt.json`, `i18n/en.json`; Create (substituir placeholder): `js/i18n.js`

- [ ] **Step 1: `js/i18n.js`:**

```js
(function () {
  'use strict';
  var KEY = 'lang';
  var current = 'pt'; // PT já está no HTML

  function apply(lang, dict) {
    document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
    var desc = document.querySelector('meta[name="description"]');
    if (desc && dict['meta.description']) desc.setAttribute('content', dict['meta.description']);
    document.querySelectorAll('[data-i18n]').forEach(function (el) {
      var k = el.getAttribute('data-i18n');
      if (dict[k] != null) el.innerHTML = dict[k];
    });
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.classList.toggle('is-active', b.getAttribute('data-lang') === lang);
    });
    window.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang, dict: dict } }));
  }

  function load(lang) {
    if (lang === current) return;
    fetch('i18n/' + lang + '.json')
      .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function (dict) {
        current = lang;
        try { localStorage.setItem(KEY, lang); } catch (e) {}
        apply(lang, dict);
      })
      .catch(function () {}); // falhou → permanece o idioma atual (HTML PT é o fallback)
  }

  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('.lang-toggle button').forEach(function (b) {
      b.addEventListener('click', function () { load(b.getAttribute('data-lang')); });
    });
    var saved = null;
    try { saved = localStorage.getItem(KEY); } catch (e) {}
    if (saved === 'en') load('en');
  });
})();
```

Nota: trocar EN→PT também passa por `load('pt')` e o fetch de `pt.json` — por isso o PT.json precisa ser completo, não vazio.

- [ ] **Step 2: `i18n/pt.json`** — objeto plano com TODAS as chaves usadas nos `data-i18n` das Tasks 3–9 (nav.*, hero.*, about.*, exp.*, sys.*, stack.*, projects.*, contact.*, footer.*, meta.description) com os textos PT idênticos aos do HTML. `hero.roles` é array: `["Backend Developer","Automation Engineer","Integrations & APIs"]`.

- [ ] **Step 3: `i18n/en.json`** — mesmas chaves, traduzidas para inglês natural de recrutador (ex.: `hero.status`: "Open to new challenges · Araraquara, Brazil"; `hero.tagline`: "Architecture first. Code second. <span class=\"accent\">Complexity never.</span>"; `exp.ns2.role`: "Junior Software Engineer"; `sys.ecom.result`: "→ refactor eliminated silent sync failures"). Termos técnicos permanecem.

- [ ] **Step 4: Verificar:** clicar EN → página inteira troca sem reload; F5 → continua EN (localStorage); clicar PT → volta; nenhum texto "esquecido" em outro idioma (varredura visual seção a seção); `document.documentElement.lang` correto no console.

- [ ] **Step 5: Commit** — `git add i18n/ js/i18n.js && git commit -m "feat: i18n PT/EN com toggle e persistência"`

---

### Task 12: Validação final e merge

**Files:** Modify: conforme achados. Delete: nada (Profile.pdf permanece na raiz por ser fonte do CV).

- [ ] **Step 1: Checklist manual completo** (com `npx -y serve -l 8787 .`):
- PT e EN completos nos dois temas (4 combinações);
- mobile 375px: pipeline legível, sem scroll horizontal, texto sobre SVG legível;
- `prefers-reduced-motion` emulado: sem animações, conteúdo todo visível;
- bloquear cdnjs no DevTools (Network request blocking) + reload: conteúdo 100% visível, pipeline estático;
- todos os links externos, âncoras da nav e download do CV funcionam;
- console sem erros.

- [ ] **Step 2: Lighthouse** (DevTools, mobile): meta ≥95 em Performance/A11y/Best Practices/SEO. Corrigir achados (contraste, alt, etc.) e commitar correções.

- [ ] **Step 3: Aprovação do usuário** — mostrar o site rodando ao Flávio antes do merge.

- [ ] **Step 4: Merge**

```bash
git checkout main && git merge feat/v2-sistema-vivo && git push origin main
```

- [ ] **Step 5: Instruções de deploy ao usuário** (uma vez): criar repositório no GitHub, `git remote add origin ...`, push; no Netlify: "Import from Git" → escolher o repo → build command vazio, publish directory `/`. A partir daí todo push publica sozinho.
