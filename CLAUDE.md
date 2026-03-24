# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static website for **YGS Preclinical** — Dr. Yael Greenberg Shushlav's preclinical consulting business. No build tools, no npm, no framework — pure HTML/CSS/JS.

**Files:**
- [index.html](index.html) — Single-page site (~1,200 lines), 11 sections
- [articles.html](articles.html) — Publications & research page
- [404.html](404.html) — Custom 404 error page
- [styles.css](styles.css) — Design system and all styles (~2,060 lines)
- [script.js](script.js) — Vanilla JS interactivity (~244 lines)

## Running Locally

```bash
npx serve
# then open http://localhost:3000
```

`serve` reads `vercel.json` natively, so clean URLs (`/articles` instead of `/articles.html`) and rewrites work locally just as they do in production. Requires Node.js (no install step — `npx` downloads it on-the-fly).

**Fallback:** `python -m http.server 8000` still works for basic testing, but clean URLs like `/articles` will return 404. Use `/articles.html` directly with the Python server.

## Design System (CSS Custom Properties)

All defined at the top of [styles.css](styles.css):

| Variable | Value | Usage |
|---|---|---|
| `--navy` | `#12274F` | Primary color |
| `--teal` | `#2D7D78` | Accent color |
| `--sand` | `#F6F4F0` | Warm background |
| `--font-head` | `'DM Sans'` | Headings |
| `--font-body` | `'Inter'` | Body text |

Typography uses `clamp()` for fluid sizing (e.g., `clamp(2rem, 5vw, 3.25rem)`). Do not add hardcoded `px` font sizes — always use the `clamp()` pattern.

## JavaScript Patterns

[script.js](script.js) uses vanilla ES6+, no libraries. Key behaviors:
- **Sticky header** — adds scroll shadow at 8px scroll depth
- **Mobile nav** — hamburger toggle with focus trap (Tab/Shift+Tab cycling, ESC to close)
- **Active nav highlight** — uses `IntersectionObserver` to mark current section
- **Fade-up animations** — also `IntersectionObserver`; skipped when `prefers-reduced-motion` is set
- **Footer year** — auto-updated via JS

## Accessibility Requirements

The site is built to WCAG AA compliance. When editing:
- Maintain ARIA attributes (`aria-expanded`, `aria-hidden`, `aria-current`) on interactive elements
- Keep `prefers-reduced-motion` guards on all animations
- Preserve the skip link (`<a href="#main-content">`) as the first element in `<body>`
- The mobile menu uses the `inert` attribute for state management — do not remove

## SEO

JSON-LD structured data is embedded in the `<head>` of [index.html](index.html): `ProfessionalService`, `Person`, `WebSite`, and `FAQPage` schemas. Update these if service descriptions or contact details change.

Canonical URL: `https://preclinical.shushlav.com/`

## Section Order (index.html)

1. Header/Nav
2. Hero
3. Credibility strip (4 trust points)
4. Positioning / "What We Do"
5. Services (6-card grid)
6. Animal Models
7. 3Rs & Refinement (navy background)
8. Resources (placeholders)
9. About (Dr. Yael's bio)
10. CTA banner
11. Contact + Footer
