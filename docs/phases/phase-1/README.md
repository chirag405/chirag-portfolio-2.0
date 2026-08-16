# Phase 1 — Foundation: i18n plumbing, theming, header/hero/footer chrome

## What this phase built

A working Next.js 16 (App Router) site with full `next-intl` locale routing,
a light/dark theme system, a hue-shiftable accent color, a custom cursor, and
the top-of-page chrome (sticky status bar + hero + footer) ported pixel-for-
pixel from the Claude Design handoff at
`Portfolio Site Details-handoff/portfolio-site-details/project/Portfolio.dc.html`.

The remaining sections of the design (live systems, experience timeline, work
grid, publications, stack, chat widget, easter egg) are **not yet built** —
that's Phase 2+.

## Design source

The `.dc.html` file is a Claude Design *prototype*, not production code (see
its own `README.md` in the handoff folder). Its custom elements (`<x-dc>`,
`<sc-if>`, `<sc-for>`, `<image-slot>`) and `support.js`/`image-slot.js` are the
**design tool's own preview runtime** — they were not ported. Instead, the
prototype's HTML/CSS/JS was read as a visual + behavioral spec and
reimplemented as real React components with the equivalent Tailwind/CSS.

## Tech stack

- **Next.js 16.3.1**, App Router, Turbopack, React 19.
- **next-intl 4.13.6** for i18n — locale segment routing at `app/[locale]`.
- **Tailwind CSS v4** (`@tailwindcss/postcss`) + hand-written CSS custom
  properties for the design's exact tokens (`--bg`, `--fg`, `--accent`, …),
  because the source design leans on `oklch()` colors and CSS vars directly.
- **motion** (the `motion/react` package, formerly Framer Motion) — several
  components are vendored from [Motion Primitives](https://motion-primitives.com)
  (MIT-licensed, copied in per its own "copy the source into your project"
  distribution model) and from [Aceternity UI](https://ui.aceternity.com) via
  its shadcn registry.

## Folder structure

```
app/[locale]/
  layout.tsx       Root HTML shell: fonts, ThemeScript, NextIntlClientProvider
  page.tsx          Assembles Header + Hero + Footer for "/"
  globals.css       Design tokens (light + dark), keyframes, Tailwind import

i18n/
  routing.ts        Locale list (en, hi, es, fr, ja), default locale, prefix strategy
  navigation.ts      Locale-aware Link/usePathname/useRouter (next-intl wrappers)
  request.ts         Server-side message loading per request

messages/
  en.json, hi.json, es.json, fr.json, ja.json
  All UI copy lives here — see "Editing content" below.

components/motion-primitives/   Vendored, unmodified-API components:
  cursor.tsx            Spring-follow custom cursor (from motion-primitives.com)
  in-view.tsx            IntersectionObserver-driven reveal wrapper
  animated-number.tsx    Spring count-up number (retheme: fixed span/div/p tag cache
                          to satisfy the `react-hooks/static-components` lint rule)
  text-effect.tsx        Word/line/char stagger-reveal text
  magnetic.tsx            Cursor-attraction wrapper for buttons
  image-comparison.tsx    Before/after drag-slider (not wired up yet — see Phase 4 note)
  scroll-progress.tsx     Scroll-linked progress bar

components/ui/
  timeline.tsx        Aceternity's Timeline, RE-THEMED in place: the stock
                        neutral/purple-blue palette and hardcoded heading were
                        replaced with this design's --line/--accent tokens and
                        the original prototype's dot+rail geometry. Not wired
                        into a page yet — reserved for the Phase 2 Experience
                        section.

components/site/    Portfolio-specific composition:
  header.tsx           Sticky status bar: identity, nav, language switcher,
                        theme toggle, hue lever
  hero.tsx              Name reveal (TextEffect), typed `whoami`, stat row,
                        CTA buttons (wrapped in Magnetic), signature slash flourish
  footer.tsx            Contact links, live clock, status line
  hue-lever.tsx          Drag-to-retheme accent hue (writes CSS vars + localStorage)
  theme-toggle.tsx        Light/dark switch (motion crossfade icon)
  theme-script.tsx        Pre-hydration inline script: sets data-theme + hue
                          from localStorage/system pref before first paint
  language-switcher.tsx   <select> driven by next-intl's routing.locales
  site-cursor.tsx          Wires the vendored Cursor to `[data-cursor]` targets
                          site-wide (view/open/download/expand/chat/close/…)
  scroll-progress-bar.tsx  Accent-gradient top progress bar
```

## Theming model

Two independent axes, both client-controlled and persisted to `localStorage`,
both applied *before* first paint via the inline script in
`components/site/theme-script.tsx` (referenced from `app/[locale]/layout.tsx`,
first child of `<body>`, with `suppressHydrationWarning` on `<html>`):

1. **Light / dark** — `data-theme="light"|"dark"` attribute on `<html>`.
   Defaults to `prefers-color-scheme`. Token overrides live in
   `app/[locale]/globals.css` under `:root[data-theme="dark"]`.
2. **Accent hue** — the original prototype's "drag to retheme" lever.
   `--accent`/`--accent-weak`/`--accent-ghost` are `oklch()` values with a
   hue set via inline `style.setProperty`, persisted as a single degree
   number in `localStorage` (`chirag-hue`).

## Editing content (the "separate folder" for changeable text)

All UI copy is in `messages/<locale>.json`, one file per locale, structured
by section (`meta`, `header`, `hero`, `footer`, `cursor`, …). Editing a string
for a shipped locale never touches component code. Adding a new locale means:
add the code to `i18n/routing.ts`'s `locales` array and `localeNames` map,
then add `messages/<code>.json` with the same key shape as `en.json`.

Content that is genuinely code/data rather than prose (the terminal's literal
`whoami` command, the `role.json` JSON keys, `chirag_singh`/`ai_engineer`
status-bar identifiers) is deliberately left in English in every locale —
it's presented as raw system output, not translatable UI text.

## Deferred to later phases

- Live systems, experience timeline (Aceternity Timeline is vendored+themed
  but not yet wired into a section), work grid, publications, stack, chat
  widget, easter egg, resume.json download, scroll-reveal on the remaining
  sections.
- `ImageComparison` (vendored) has no real light/dark screenshots to compare
  yet — once the full page exists, capture `public/preview-light.png` and
  `public/preview-dark.png` and wire it in.
