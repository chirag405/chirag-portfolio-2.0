# Phase 2 — Content sections, live data, and the RAG chatbot

## What this phase built

Everything below the hero: the Live Systems dashboard (now backed by real
GitHub/LeetCode APIs and the site's own Claude usage), Experience (Aceternity
Timeline), Work, Publications, Stack, plus the `ask_chirag` chat widget and
the `whoami` easter egg. Also: default theme is light regardless of OS
preference, and the hue lever got a small color-swatch affordance since it
was easy to miss.

Per user instruction, this phase does not ship a `TESTING.md` — the surface
here is almost entirely visual/UI and not worth a formal checklist.

## New architecture

```
lib/
  data/portfolio.ts     Single source of truth for experience/projects/skills/
                          publication content, shared by the UI sections and
                          resume.json download.
  rag/
    knowledge.ts          The chatbot's grounded corpus — prose documents
                            mirroring lib/data/portfolio.ts.
    retrieve.ts            Lightweight TF-IDF keyword retriever (no embedding
                            API — the corpus is ~15 short documents, so a
                            real vector store would be overhead, not value).
  usage-store.ts          Records every /api/chat call's real token usage,
                            cost, and latency. In-memory ring buffer +
                            best-effort JSONL append to .data/usage-log.jsonl
                            (silently skipped on read-only filesystems).
  github.ts                Fetches github.com/chirag405 via the public REST
                            API (repos, stars, languages, recent push events —
                            no auth needed) and, only when GITHUB_TOKEN is
                            set, the GraphQL contributionsCollection for the
                            real contribution calendar + streak.
  leetcode.ts               POSTs LeetCode's own (unofficial, no-auth)
                            GraphQL endpoint for solved counts by difficulty
                            and computes the current streak from
                            submissionCalendar.
  rate-limit.ts             In-memory per-IP rate limit for /api/chat (30
                            requests/hour) — single-instance only, see SETUP.
  download-resume.ts        Client-side resume.json blob download, shared by
                            the hero CTA and the easter egg.

app/api/
  chat/route.ts             POST. Retrieves context via lib/rag, streams a
                            Claude Sonnet 5 response (thinking disabled — this
                            is short Q&A, not a reasoning task), then records
                            real usage/cost/latency via lib/usage-store.
  stats/route.ts             GET. Aggregates lib/usage-store into the
                            observability card's 24h rollups + sparkline.
  github/route.ts, leetcode/route.ts   GET. Thin wrappers around lib/github
                            and lib/leetcode with HTTP caching headers.

components/site/systems/    Live Systems dashboard: github-card.tsx,
                            leetcode-card.tsx (both poll their API route once
                            on mount), observability-card.tsx (polls
                            /api/stats every 8s), viz.tsx (shared SVG
                            LangBar/Donut/Spark/ContribGrid builders), and
                            live-systems-section.tsx (async server component
                            wrapper).

components/site/
  experience-section.tsx    Wraps components/ui/timeline.tsx (themed in
                            Phase 1) with the real experience data + the
                            click-to-expand detail modal.
  work-section.tsx, publications-section.tsx, stack-section.tsx
  chat-widget.tsx            Floating "ask_chirag" button + panel. Streams
                            plain-text chunks from /api/chat via
                            ReadableStream (not SSE — simpler for a
                            single-turn text response, no need for the
                            event-framing SSE gives you).
  easter-egg.tsx              Global keydown buffer watching for "whoami".
```

## The chatbot: model and RAG choice

- **Model**: `claude-sonnet-5`. The user asked for "sonnet 3.7", which is
  retired (Feb 2026) — substituted for the current Sonnet per
  `shared/model-migration.md`'s retirement table.
- **RAG**: a real retrieval step (TF-IDF over `lib/rag/knowledge.ts`) feeds
  the top-4 matching documents into the system prompt before calling Claude,
  rather than stuffing the whole knowledge base into every request. The
  corpus is small enough (~15 short docs) that a hosted embedding API
  (Voyage, OpenAI, etc.) would add a dependency and cost with no real benefit
  over keyword scoring at this scale.
- **Thinking disabled, `max_tokens: 500`**: this is single-turn FAQ-style
  Q&A about a fixed, small knowledge base — not a reasoning task, so adaptive
  thinking (Sonnet 5's default) only adds latency and cost here.

## Known limitations (by design, not bugs)

- `lib/rate-limit.ts` and the in-memory half of `lib/usage-store.ts` are
  **single-instance** — fine for one Node/VPS/Docker process, not correct if
  ever deployed across multiple serverless instances (each would have its
  own counters). Upgrading to a shared store (Redis/Upstash/Vercel KV) is a
  follow-up if this ever needs to scale.
- GitHub contributions/streak/heatmap require `GITHUB_TOKEN` (GitHub's REST
  API has no public contribution-calendar endpoint — only GraphQL, which
  requires auth even for public data). Without it, the card still shows real
  repos/stars/languages/commits and falls back to a decorative (clearly
  non-real) texture for the heatmap.
- The LeetCode username in the original design mock (`chirag405`) does not
  resolve on LeetCode's own API (verified directly against
  `leetcode.com/graphql` — "That user does not exist"), even though the same
  handle is a real GitHub account. The card is wired to real data and fails
  gracefully to an "unavailable" state; update `LEETCODE_USERNAME` in
  `lib/leetcode.ts` once the correct handle is known.
