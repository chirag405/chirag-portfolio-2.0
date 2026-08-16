# Phase 1 — Testing / verification gate

## Automated (mirrors CI)

- [ ] `npm run build` completes with **no errors** and prerenders all 5
      locale routes (`/en`, `/hi`, `/es`, `/fr`, `/ja` shown as
      `● /en`, `● /hi`, `● /es`, `+2 more` in the build output route table).
- [ ] `npm run lint` reports **0 problems**.
- [ ] `npx tsc --noEmit` reports **0 errors**.

## Manual — English (default)

1. `npm run dev`, open `http://localhost:<port>/`.
2. **Header**: sticky status bar shows a pulsing dot, `chirag_singh · ai_engineer`,
   nav links `systems / work / stack` (scroll targets don't exist yet — Phase 2+,
   clicking them is a no-op until then), a language `<select>`, a light/dark
   toggle button, and the hue-lever track.
3. **Hero**: "Chirag" then "Singh." animate in on load (staggered, ~50ms/160ms
   delay). A brief diagonal accent flourish sweeps across the hero and fades
   within ~1s of load. The terminal panel types out `chirag — ai engineer`
   character-by-character next to a blinking block cursor. The three CTA
   buttons pull gently toward the cursor on hover (Magnetic) and the OS
   cursor is replaced by the custom pill cursor (desktop, fine-pointer only)
   which grows and shows a translated label (`view`/`open`/`download`) when
   hovering them.
4. **Hue lever**: click-drag the small track in the header — the accent color
   (button fills, blinking cursor, dot, links) shifts hue live. Reload the
   page — the chosen hue persists.
5. **Theme toggle**: click the sun/moon button — background/text invert
   (light ⇄ dark), the icon crossfades. Reload — the choice persists. With no
   prior choice and OS set to dark mode, the site should load in dark mode
   with no flash of the light theme.
6. **Footer**: "Let's build." heading, 5 contact link pills (email/github/
   leetcode/linkedin/x — the external ones open in a new tab), a live
   `HH:MM:SS IST` clock ticking every second, and a copyright line with the
   current year.
7. **Scroll progress bar**: a thin gradient bar at the very top of the
   viewport fills left→right as you scroll (page is short in Phase 1, but the
   bar should still visibly move).
8. **Reduced motion**: enable "prefers reduced motion" in OS/browser settings,
   reload — the custom cursor should not appear (falls back to the normal OS
   cursor) and animations should be near-instant.

## Manual — other locales

For each of `/hi`, `/es`, `/fr`, `/ja`:

- [ ] Page renders with no console errors.
- [ ] Header nav labels, hero copy, footer labels, and the terminal hint line
      are all translated (compare against `messages/<locale>.json`).
- [ ] The `<html lang="…">` attribute matches the locale.
- [ ] The language `<select>` shows the correct locale selected and switching
      it navigates to the right prefixed path while preserving scroll
      position / not reloading fonts.
- [ ] `chirag_singh`, `ai_engineer`, the literal `whoami` / `cat role.json`
      commands, and the typed terminal output stay in English (intentional —
      see Phase 1 README, "Editing content").

## Known non-issues

- Nav links (`systems`, `work`, `stack`) point at anchors that don't exist
  yet — expected until their sections are built in later phases.
- `ImageComparison` and the Aceternity `Timeline` are vendored but not
  rendered anywhere yet — expected, see Phase 1 README "Deferred to later
  phases".
