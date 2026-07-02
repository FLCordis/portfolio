# Portfólio v2 — "Sistema Vivo" — Design

**Data:** 2026-07-01
**Status:** Aprovado pelo Flávio (direção, hero e detalhes validados via visual companion + terminal)

## Objetivo

Substituir o portfólio atual (`index.html` único, dark/terminal) por uma v2 muito mais impressionante, cuja identidade visual demonstra o trabalho do Flávio em vez de apenas descrevê-lo: um **pipeline de integração animado** como cenário do site. Público nº 1: **recrutadores e empresas** (vagas backend/integrações).

## Decisões tomadas

| Decisão | Escolha |
|---|---|
| Direção visual | **B — Sistema Vivo**: portfólio como integração rodando (nós N8N-style, dados fluindo) |
| Layout do hero | **B — Cenário imersivo**: pipeline SVG ocupa o hero inteiro como fundo, texto centralizado sobreposto |
| Público-alvo | Recrutadores/empresas (CLT/PJ backend) |
| Idioma | Bilíngue **PT/EN com toggle** na nav; padrão PT-BR; troca sem reload; persiste em `localStorage` |
| Conteúdo novo | Timeline de carreira, resultados com métricas, certificações + inglês B2, download do CV em PDF |
| Estrutura | **Multi-arquivo** + repositório GitHub conectado ao Netlify (deploy automático por push) |
| Stack | **Vanilla** HTML/CSS/JS, sem build. GSAP via CDN (única dependência) |

## Arquitetura de arquivos

```
portfolio/
├── index.html          # marcação semântica, enxuta
├── css/
│   ├── tokens.css      # design tokens (cores, tipografia, espaçamento, temas dark/light)
│   └── main.css        # componentes e seções
├── js/
│   ├── main.js         # nav, tema, reveals, typewriter, count-up, filtros
│   ├── pipeline.js     # animação do pipeline do hero (SVG + GSAP MotionPath)
│   └── i18n.js         # toggle PT/EN via data-i18n + JSON
├── i18n/
│   ├── pt.json
│   └── en.json
├── assets/
│   └── cv-flavio-cordis.pdf
├── netlify.toml        # headers de cache (css/js/assets) e segurança
└── README.md           # vitrine do repositório público
```

O `index.html` atual permanece no repo até a v2 estar validada (v2 o substitui no merge final).

## Seções do site (ordem)

1. **Hero — Pipeline Vivo.** Pipeline SVG full-bleed como fundo: nós (ERP, E-commerce → **N8N** central → PostgreSQL, Telegram, WhatsApp) conectados por caminhos curvos; pacotes de dados coloridos viajam continuamente. Gradiente escurecendo sobre o SVG para legibilidade. Sobreposto e centralizado: badge de status ("disponível · Araraquara, SP"), nome (sobrenome em outline stroke), typewriter de papéis, tagline "Arquitetura primeiro. Código depois. Complexidade nunca.", CTAs (**Ver Projetos**, **Baixar CV ↓**, GitHub), stats com count-up.
2. **Sobre.** Método (arquitetura antes do código), formação (CC/UNIP 2024), terminal card `profile.json`, certificações (Linux, Git/GitHub, Docker, CI/CD) e inglês B2 integrados, botão de download do CV.
3. **Experiência — "Deploy Log".** Timeline das empresas no estilo log de deploys, com marcador de versão por fase:
   - `v3.x` New Standard Software — Engenheiro de Software Jr (out/2025–atual): fluxos Node.js ERP↔e-commerces/CRMs, APIs e microsserviços Java Spring, app ERP mobile em Flutter, logs anti-redundância em PostgreSQL, infra de mídia Cloudflare R2.
   - `v3.0` New Standard Software — Desenvolvedor Java (fev/2025–out/2025): integrações e-commerce no ecossistema MatCon, automações N8N/JavaScript/SQL, suporte backend e modelagem PostgreSQL.
   - `v2.0` Followize — Desenvolvedor Full Stack (nov/2022–nov/2023): Laravel + Angular, distribuição de leads, APIs RESTful + Postman, Docker, Git/GitLab.
   - `v1.0` JBT FoodTech — Estagiário de TI (fev/2022–nov/2022): SQL, sistemas Java, suporte.
4. **Sistemas em Produção.** Funde a antiga seção "Automações" com resultados de impacto do CV — cada card é um sistema real + resultado: refatoração de integrações e-commerce (eliminando falhas silenciosas de sincronização), sistema de logs anti-redundância no PostgreSQL, infra de mídia Cloudflare (R2/D1/Workers), automação de relatórios financeiros/PIX/renovação de credenciais bancárias, bots WhatsApp/Telegram, backup versionado de workflows N8N.
5. **Stack.** Clusters por contexto de uso (mantém a lógica atual: foco atual / uso em produção / experiência prática / estudo contínuo), visual refinado.
6. **Projetos.** Cards do GitHub com filtros por tecnologia (mantém os 5 projetos atuais, visual refinado).
7. **Contato + footer.** Email, LinkedIn, GitHub; footer com logo FC.

## i18n

- Elementos textuais marcados com `data-i18n="chave"`; dicionários planos em `i18n/pt.json` e `i18n/en.json` com as mesmas chaves.
- `i18n.js` carrega o JSON via `fetch`, aplica os textos, atualiza `<html lang>` e `meta description`, salva escolha em `localStorage` (`lang`).
- Toggle `PT | EN` na nav ao lado do toggle de tema. Padrão: `pt-BR`.
- Arrays (ex.: papéis do typewriter) também vêm do dicionário.

## Animações e interações

- **Pipeline (hero):** GSAP MotionPathPlugin move os pacotes pelos `<path>`; nó pulsa (scale/glow) quando um pacote chega; tooltip com nome do sistema no hover. `IntersectionObserver` pausa a timeline fora da viewport. Com `prefers-reduced-motion`: diagrama estático, sem pacotes.
- **Deploy Log:** entradas revelam em sequência no scroll (ScrollTrigger), como logs chegando.
- **Mantidos do site atual:** typewriter, count-up, reveals batched, cursor glow (pointer fine), filtros de projetos, tema dark/light (dark padrão).

## Performance, acessibilidade e resiliência

- Sem frameworks; GSAP + ScrollTrigger + MotionPathPlugin via CDN (`defer`). Meta Lighthouse ≥ 95.
- HTML semântico, contraste AA nos dois temas, foco visível, navegação por teclado, `aria-label`s, `prefers-reduced-motion` respeitado em tudo.
- Fallback sem GSAP/CDN: conteúdo 100% visível (classe `no-js`/checagem `window.gsap`), pipeline estático. Nunca página quebrada.
- Fallback de i18n: se o `fetch` do JSON falhar, o HTML já contém os textos em PT como conteúdo padrão.
- `netlify.toml`: cache longo para `css/`, `js/`, `assets/` e headers de segurança básicos (X-Frame-Options, X-Content-Type-Options, Referrer-Policy).

## Validação (manual, site estático)

- PT e EN completos (nenhuma chave sem tradução visível);
- temas dark/light nos dois idiomas;
- mobile: pipeline legível/simplificado em tela estreita, texto sempre legível sobre o SVG;
- `prefers-reduced-motion`;
- links externos, âncoras e download do CV;
- Lighthouse (performance, a11y, SEO, best practices).

## Fora de escopo

- Backend/formulário de contato (links diretos bastam);
- blog, CMS, analytics;
- migração de hospedagem (permanece Netlify; deploy passa a ser via GitHub);
- testes automatizados.
