# Phase 1 — Setup

No external credentials or env vars are introduced in this phase (no
database, no third-party API keys yet — the "live systems" stats are still
hardcoded mock data in the original design and haven't been ported).

## Prerequisites

- Node.js 22.13+ recommended (the repo works on 22.12 but `npm install` will
  print `EBADENGINE` warnings from ESLint's tooling; harmless, but a bump
  removes the noise).
- npm (repo uses `package-lock.json`).

## Install & run

```bash
npm install
npm run dev      # http://localhost:3000 (or next available port)
```

## Build & lint (what CI should run)

```bash
npm run build     # next build — type-checks + prerenders all 5 locales
npm run lint       # eslint .
npx tsc --noEmit    # standalone type-check, same as build's TS pass
```

## Locales

Visiting `/` serves the default locale (`en`, no prefix). Other locales are
prefixed: `/hi`, `/es`, `/fr`, `/ja` (see `i18n/routing.ts`,
`localePrefix: "as-needed"`).
