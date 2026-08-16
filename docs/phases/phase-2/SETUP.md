# Phase 2 — Setup

## New environment variables

Create a `.env.local` in the project root (never commit it — it's already
covered by `.gitignore`'s `.env*.local` rule):

```bash
# Required for the ask_chirag chat widget to give live answers.
# Without it, /api/chat returns a static "not configured yet" message —
# the rest of the site works fine either way.
ANTHROPIC_API_KEY=sk-ant-...

# Optional. Without it: GitHub card still shows real repos/stars/languages/
# recent commits (no auth needed for those). With it: also unlocks the real
# contribution heatmap, total contributions, and streak (GitHub's REST API
# has no public endpoint for those — only GraphQL, which requires auth even
# for public profile data).
# Create at https://github.com/settings/tokens — a classic token with no
# scopes checked (public read access) is enough.
GITHUB_TOKEN=ghp_...
```

## Getting an Anthropic API key

1. https://console.anthropic.com → Settings → API Keys → Create Key.
2. Put it in `.env.local` as `ANTHROPIC_API_KEY`.
3. This is a paid API — the chat widget calls `claude-sonnet-5` per message
   (~500 output tokens max). `lib/rate-limit.ts` caps each visitor IP at 30
   messages/hour to bound cost exposure on a public page.

## Persisting usage history across restarts

`lib/usage-store.ts` writes each `/api/chat` call to `.data/usage-log.jsonl`
(gitignored — add `.data/` to `.gitignore` if you don't already exclude it,
depending on your deploy target). This is best-effort: on a read-only
filesystem (some serverless hosts outside `/tmp`) the write silently no-ops
and the observability card falls back to in-memory-only history for that
process's lifetime.

## Run

Same as Phase 1 — `npm install && npm run dev`. `npm run build` / `npm run
lint` / `npx tsc --noEmit` all need to stay clean (see Phase 1's SETUP.md for
the baseline commands).
