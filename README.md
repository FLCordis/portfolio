# Flávio Cordis — Portfólio

Portfólio pessoal em **arquivo único**, autocontido, sem build e sem dependências locais.
Tudo (HTML, CSS e JS) vive em `flavio-cordis-portfolio.html`. Dependências externas são só
CDNs: Google Fonts (Inter + JetBrains Mono), GSAP + ScrollTrigger e Simple Icons.

## Stack

- HTML5 semântico, CSS moderno (custom properties, `clamp()`, `@property`, `color-mix`)
- Animações: **GSAP + ScrollTrigger** (reveals, stagger, count-up) + CSS puro (typewriter,
  grid de fundo, borda-gradiente, cursor glow)
- Dark mode padrão com toggle claro/escuro (em memória — sem `localStorage`)
- Acessível: um só `<h1>`, hierarquia de headings, `alt` em imagens, foco visível,
  respeita `prefers-reduced-motion`, touch targets ≥ 44px

## Estrutura da página

`Nav · Hero · About · Skills · Projects · Automation · Contact · Footer`
