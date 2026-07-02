# Portfólio — Flávio Cordis

Portfólio pessoal com conceito **"Sistema Vivo"**: em vez de apenas descrever o trabalho com integrações e automação, o site o demonstra — o hero é um pipeline de integração real (ERP → N8N → PostgreSQL → Telegram/WhatsApp) com dados fluindo continuamente em SVG animado. Bilíngue (PT/EN), dark/light, sem frameworks.

## Estrutura

```
├── index.html          # marcação semântica (textos PT como padrão)
├── css/
│   ├── tokens.css      # design tokens (cores, tipografia, temas)
│   └── main.css        # componentes e seções
├── js/
│   ├── main.js         # tema, typewriter, reveals, filtros
│   ├── pipeline.js     # animação do pipeline (GSAP MotionPath)
│   └── i18n.js         # toggle PT/EN
├── i18n/
│   ├── pt.json
│   └── en.json
├── assets/
│   └── cv-flavio-cordis.pdf
└── netlify.toml        # headers de cache e segurança
```

## Rodando localmente

O toggle de idioma usa `fetch`, então precisa de um servidor HTTP (não `file://`):

```bash
npx -y serve -l 8787 .
# http://localhost:8787
```

## Deploy

Hospedado no Netlify com deploy contínuo: cada push na branch `main` publica automaticamente. Sem build — o diretório raiz é servido como está.

## Tecnologias

HTML5 · CSS3 (custom properties, oklch, color-mix) · JavaScript vanilla · GSAP 3 (ScrollTrigger + MotionPathPlugin, via CDN) · Netlify
