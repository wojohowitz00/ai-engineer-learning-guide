# Hosted LLM Backend for Mobile Clients

Date: 2026-07-31.

Why this exists: `server.ts` proxies the three Study Buddy LLM endpoints
(`/api/ai/explain`, `/api/ai/quiz`, `/api/ai/interview`) to whatever
OpenAI-compatible backend it's configured with. Locally that's Ollama on
`localhost:11434`. A phone cannot reach `localhost:11434` on someone else's
machine — a mobile build needs a server instance it can actually talk to over
the network. This doc covers that deployment story: which base URL a client
talks to, how to point the server at a hosted (rather than local) model
provider, what cost controls exist today, and how to deploy and verify an
instance.

## 1. Architecture for mobile

The client/server split doesn't change for mobile: the React UI and the
Express API are the same code, deployed once, reachable over the network.
What changes is *which* instance a given client talks to.

- **Web** (the current deployment target): the browser loads the built SPA
  from the same origin that serves `/api/*`. Relative paths — `fetch("/api/ai/explain")`,
  `fetch("/api/curriculum")`, `fetch("/api/premium/teasers")` (see `src/components/StudyBuddy.tsx`
  and `src/App.tsx`) — resolve correctly because origin == API host.
- **Native/webview (Capacitor)**: a Capacitor-wrapped build ships the UI
  inside a native shell, but that shell is not served from the API's origin —
  there is no "same origin" to resolve a relative `/api/ai/explain` against.
  Those requests need an absolute base URL pointing at a deployed instance of
  this server (e.g. `https://study-buddy.example.com/api/ai/explain`).
- **Curriculum refresh**: `GET /api/curriculum` returns `{ steps: roadmapData }`
  — the same shape `scripts/export-curriculum.ts` writes to the iOS app's
  bundled `curriculum.json`. A deployed instance lets any client (native or
  web) pull curriculum updates without an app store release, instead of only
  getting them via the bundled JSON snapshot at build time.

**This is not implemented today.** Making the client's API base URL
configurable (env var, build-time config, or runtime setting) is scoped to
the Capacitor spike, `ai-engineer-learning-guide-abj` — call it out explicitly
as a requirement there, alongside the other native-webview gaps that spike
already tracks (localStorage vs. Capacitor Preferences, external links,
drawer UX in WKWebView).

## 2. Hosted provider setup

`server.ts` picks a backend at process start via this resolution order
(server.ts:51-72):

| Priority | Trigger | Base URL | Default model | Notes |
|---|---|---|---|---|
| 1 | `LLM_BASE_URL` set | that URL | `LLM_MODEL` or `openrouter/auto`/`gemma4:31b`/`gemma3` fallback | Escape hatch for any OpenAI-compatible server (LM Studio, self-hosted, etc.) |
| 2 | `OLLAMA_API_KEY` set | `https://ollama.com/v1` | `gemma4:31b` | **Recommended for a small VPS** — no local model weights to store |
| 3 | `OPENROUTER_API_KEY` set | `https://openrouter.ai/api/v1` | `openrouter/auto` | Backwards-compatible alternative; paid, routes to whatever model OpenRouter picks unless pinned |
| 4 (default) | none of the above | `http://localhost:11434/v1` | `gemma3` | Local dev only — not reachable from a deployed mobile client |

Notes on the defaults:

- The Ollama Cloud default changed from `gemma3:12b` to `gemma4:31b` because
  Ollama retired the `gemma3` family from cloud serving on 2026-07-15
  (`server.ts:63-65`, commit `2c6bec7`). The *local* default is unaffected —
  `gemma3` still works fine as a local Ollama pull.
- `LLM_MODEL` overrides the default in any mode; `OPENROUTER_MODEL` is a
  backwards-compatible alias honored ahead of the OpenRouter default.
- `LLM_API_KEY` is a generic override, used ahead of `OLLAMA_API_KEY` /
  `OPENROUTER_API_KEY` — for a custom `LLM_BASE_URL` that needs a key under a
  different name than either of those.

**Quiz escape hatch:** `/api/ai/quiz` requires `json_schema` structured-output
support (`response_format: { type: "json_schema", strict: true, ... }`,
server.ts:224-260). Not every model supports it. If quiz generation fails
under whatever model `MODEL` resolves to, pin a schema-capable model
separately with `LLM_QUIZ_MODEL` (or its OpenRouter alias
`OPENROUTER_QUIZ_MODEL`) without disturbing the explain/interview model
choice — `QUIZ_MODEL` falls back to `MODEL` if unset (server.ts:72).

For a small VPS that can't store model weights, the practical recommendation
is: set `OLLAMA_API_KEY` and nothing else. It's the path this repo is already
built and tested for (see the Ollama Cloud fix in commit `2c6bec7`), needs no
`LLM_BASE_URL` juggling, and — unlike OpenRouter — the same model ids work
locally and in the cloud.

## 3. Operator cost controls (as they exist today)

Three mechanisms are live in `server.ts`:

- **Per-IP rate limit**: `express-rate-limit` caps every route under `/api/`
  to 20 requests/minute per IP (server.ts:17-25). This covers `/api/ai/*` and
  `/api/curriculum`/`/api/premium/teasers` alike — there's no separate,
  lighter limit for the cheap curriculum/teaser reads.
- **Output token cap**: `MAX_OUTPUT_TOKENS = 2048` is passed as `max_tokens`
  on every completion call (server.ts:76, 179, 222, 314). This bounds
  per-request cost and, on OpenRouter specifically, avoids a `402` that
  otherwise triggers when OpenRouter pre-checks affordability against the
  routed model's full output window (65k+ tokens) rather than what the
  request actually asks for.
- **Health check, cached 30s**: `GET /api/ai/health` calls `models.list()`
  bounded to a 2.5s timeout, and caches the result (success or failure) for
  30 seconds (server.ts:107-126) so repeated drawer opens don't hammer the
  backend or eat into the rate limit budget themselves.

**Limits of this as a cost control:**

- Per-IP limiting is a weak proxy for per-user limiting. Behind NAT or
  CGNAT — a shared office network, a mobile carrier's carrier-grade NAT, a
  university — many distinct users share one IP and collectively get one
  20 req/min budget, or (in the other direction) one abusive user can rotate
  IPs to bypass it entirely.
- There is no per-user authentication or per-user quota. Every client hits
  the same anonymous rate limit; there's no way to identify, throttle, or ban
  a specific abusive user independently of their IP.
- Real quotas — a request budget tied to an identity rather than an IP —
  would arrive with accounts. Accounts are deliberately deferred; see
  `docs/swot-work-plan.md` (§7, sequenced behind progress export/import,
  `ai-engineer-learning-guide-6tf`). Until then, the rate limit + token cap
  above is the full extent of operator cost protection, and a hosted
  instance's realistic exposure should be sized accordingly (e.g. via the
  hosted provider's own spend caps/credit limits, not just this server's
  in-process limiter).

## 4. Deploying: checklist

1. **Build**: `npm run build` — Vite builds the client to `dist/`, esbuild
   bundles `server.ts` to `dist/server.cjs`.
2. **Set environment variables** (see `.env.example`):
   - `OLLAMA_API_KEY` (recommended hosted path) — or `OPENROUTER_API_KEY`, or
     `LLM_BASE_URL` (+ `LLM_API_KEY` if the custom endpoint needs one).
   - Optionally `LLM_MODEL` / `LLM_QUIZ_MODEL` to override the resolved
     defaults.
   - `NODE_ENV=production` — required; without it, `setupServer()` starts
     Vite middleware instead of serving `dist/` (server.ts:326-341).
   - `APP_URL` — used for self-referential links.
   - `PREMIUM_SERVICE_URL` — optional; only if the premium teaser relay is
     wanted on this instance.
   - Note: the listen port is hardcoded to `3000` (server.ts:12) — not
     configurable via env today. Put a reverse proxy or platform port mapping
     in front of it if the deploy target needs a different external port.
3. **Run**: `NODE_ENV=production node dist/server.cjs` (equivalently,
   `npm start`, which just runs that same built bundle — build first, it
   doesn't build for you).
4. **Verify**: `curl https://<host>/api/ai/health` — expect
   `{"ok":true,"provider":"ollama-cloud","model":"gemma4:31b"}` (provider/model
   will vary based on which env vars are set). `"ok": false` comes back with
   an actionable `hint` field instead of a generic error — read that first
   before digging into logs.
