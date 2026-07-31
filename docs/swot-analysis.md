# Feature SWOT Analysis — AI Engineer Learning Guide

Date: 2026-07-31. Basis: code inspection of `src/data.ts`, `src/App.tsx`, `src/components/`, `server.ts`, `scripts/export-curriculum.ts`, plus `README.md` and `docs/code-analysis.md`.

One matrix per feature. The **mobile** matrix is evaluated under a modified goal: the mobile version must cover **iOS/iPadOS and Android**, alongside **web and mobile web** — not iOS-only as today. A strategy recommendation for that follows the matrices.

Reading note: Strengths/Weaknesses are internal (what the code and content do today); Opportunities/Threats are external (market, platforms, upstream dependencies).

---

## 1. Curriculum roadmap (6 steps / 28 topics / 122 resources)

The core product: hardcoded in `src/data.ts` (~1,170 lines), rendered as a vertical timeline.

| Strengths | Weaknesses |
|---|---|
| Every link individually verified (liveness, free access, currency) — audit trail in `docs/content-audit/` | Content is hardcoded TypeScript; non-developers can't contribute, and every edit is a code deploy |
| Clear structure borrowed from a proven roadmap (Ebbelaar), with honest attribution | No versioning or changelog for content — learners can't see what changed since their last visit |
| Single source of truth already exported to JSON for other clients (`export-curriculum.ts`) | Link rot is inevitable; audit was a point-in-time snapshot (2026-07-11), re-verification is manual |
| Free-forever guarantee is a trust differentiator | 122 resources is a curation ceiling — scaling coverage means scaling the audit burden |

| Opportunities | Threats |
|---|---|
| The JSON export makes the curriculum an API — could feed mobile apps, a CLI, or partner integrations | AI engineering moves fast; a "2026 Edition" dates itself visibly within months |
| Community contributions via PRs against `data.ts` (with audit checklist) | Upstream roadmap (ai-cookbook) may diverge; the structure borrowed could become stale |
| SEO: verified-free curated lists rank well and earn backlinks | Free-resource aggregators (roadmap.sh, GitHub awesome-lists) compete at much larger scale |

## 2. Depth Zero on-ramp

"Ship something with an LLM on day one" before the curriculum starts.

| Strengths | Weaknesses |
|---|---|
| Strong differentiator vs. front-loaded theory curricula; matches the pull-based philosophy | It's one static step — no feedback loop confirming the learner actually shipped something |
| Low commitment threshold converts skimmers into learners | Success depends on external tools (Ollama install, API keys) the guide doesn't control |

| Opportunities | Threats |
|---|---|
| Could become interactive: an in-app "ship your first LLM call" checklist wired to the Study Buddy | If the day-one exercise breaks (model retired, tool changed), it poisons first impressions — the exact class of event that hit gemma3 cloud retirement |
| Natural top-of-funnel for the premium guided capstones | Copycat "build first" on-ramps are easy for competitors to replicate |

## 3. Pull-motivation hooks + start-here / go-deeper curation

Each topic opens with a lived pain point (`whenYouNeedThis`); one "start here" resource, the rest collapsed.

| Strengths | Weaknesses |
|---|---|
| Original copy — not scrapeable commodity content; also feeds the Study Buddy prompts (`sanitizeHook` in `server.ts`) | Hooks target one persona (data scientist/developer with scar tissue); weaker fit for other audiences |
| Reduces choice paralysis — the #1 failure mode of resource lists | "At most one per topic" start-here constraint is enforced by convention, not by types or tests |

| Opportunities | Threats |
|---|---|
| Persona-variant hooks (analyst vs. backend dev) with the same resource spine | If hooks feel formulaic across 28 topics, the device wears thin and reads as marketing |
| Hooks are exactly the framing LLM tutors need — premium Study Buddy features can build on them | — |

## 4. Capstone project thread

One evolving project (personal research assistant) spanning all six steps; each deliverable ends on the weakness the next step fixes.

| Strengths | Weaknesses |
|---|---|
| Narrative continuity is rare in free curricula; creates completion momentum | Exists only as copy — no scaffolding, starter repo, or checkpoint validation |
| Deliberate weakness-to-next-step chaining is genuinely good pedagogy | No way to show off a finished capstone (no share/export artifact) |

| Opportunities | Threats |
|---|---|
| The premium tier's guided capstone modules are the natural monetization of this thread — teaser plumbing already exists | If the free capstone copy is too thin, it reads as an ad for premium and damages the free-forever trust position |
| Public gallery of learner capstones → community + social proof | — |

## 5. AI Study Buddy — explain / quiz / mock interview

Drawer UI (`StudyBuddy.tsx`, ~710 lines) backed by three Express endpoints (`/api/ai/explain`, `/api/ai/quiz`, `/api/ai/interview`).

| Strengths | Weaknesses |
|---|---|
| Grounded in per-topic motivation hooks — answers anchor to the learner's scenario, not generic tutoring | Quiz requires `json_schema` structured output; small local models fail it (mitigated by `LLM_QUIZ_MODEL` pin, but that's a user-facing footgun) |
| Quiz uses strict structured output; scores persist to progress | No streaming — long explains render only when complete; feels slow on weaker hardware |
| Interview history is sanitized server-side (role coercion, 40-turn / 8k-char caps); rate limiting on `/api/` | Home-grown markdown renderer; failed interview turns can't be retried (known bug, `code-analysis.md`) |
| API key never reaches the browser | Quality is uncontrolled: whatever model the user runs is the product experience |

| Opportunities | Threats |
|---|---|
| Spaced repetition over quiz history; interview transcripts as portfolio prep | Model churn: the gemma3 cloud retirement already forced a default-model change once; it will happen again |
| The premium tier's "enhanced Study Buddy" has a clear upgrade path from this base | Free ChatGPT/Claude/Gemini are one tab away and better at open-ended tutoring — the moat is only the curriculum grounding |

## 6. Provider-agnostic LLM backend

Any OpenAI-compatible server: local Ollama (default), Ollama Cloud, LM Studio, OpenRouter — resolved by env vars in `server.ts`.

| Strengths | Weaknesses |
|---|---|
| Zero-cost, zero-key default (local Ollama) fits the free-forever position | Requires a Node server even though the rest of the app is static — hosting is all-or-nothing |
| Clean resolution order with sensible defaults; one SDK (OpenAI) for all providers | No health check/fallback: if Ollama isn't running, features fail at request time with a generic 500 |
| Cost controls: 2048-token output cap, 20 req/min rate limit | `MAX_OUTPUT_TOKENS=2048` can truncate long explains on verbose models |

| Opportunities | Threats |
|---|---|
| The same endpoint contract can serve mobile clients unchanged — it's already a platform-neutral API | OpenAI-compatibility is a de-facto standard, not a guaranteed one; provider drift (structured-output dialects especially) lands here |
| Bring-your-own-key premium hosting tier | Hosted deployment shifts costs to the operator; abuse control is only per-IP rate limiting |

## 7. Progress tracking (localStorage, no accounts)

Completions, bookmarks, quiz scores under one key; dashboard stat widgets; reset with confirm.

| Strengths | Weaknesses |
|---|---|
| Zero-friction privacy story: no signup, no backend state, GDPR-trivial | Device-locked: clearing browser data or switching devices silently destroys progress |
| Dead-simple implementation — one JSON blob, no sync bugs | No export/import escape hatch; no schema version field, so future shape changes risk breaking stored blobs |

| Opportunities | Threats |
|---|---|
| Export/import as JSON is a cheap first step toward sync without accounts | **Multi-platform makes this the weakest link**: iOS, Android, and web each hold an island of progress with no bridge |
| Optional accounts later can migrate localStorage in one shot | A premium tier will eventually require identity anyway — bolting accounts on late is costlier than designing the seam now |

## 8. Search, format filters, bookmarks tab, quiz history tab

Client-side substring search, format filter buttons, bookmark cards, evaluation log with retake.

| Strengths | Weaknesses |
|---|---|
| Instant — all client-side over static data, no index needed | Substring match only; no fuzzy/semantic search, no keyboard navigation |
| Bookmarks keyed by URL keep the model trivial | URL-keyed bookmarks break if a resource URL is updated during an audit fix |
| Retake flow closes the loop from history back into the Study Buddy | Filter UI (5 buttons + search) is desktop-shaped; cramped at phone widths |

| Opportunities | Threats |
|---|---|
| The Study Buddy backend could power semantic search over the same data for near-zero new infra | Low — this is table-stakes UI; main risk is polish debt accumulating |

## 9. Premium teaser system

`PREMIUM_SERVICE_URL` relay with 60s cache; locked previews per step; hidden when unset.

| Strengths | Weaknesses |
|---|---|
| Fail-silent design: unset or unreachable → empty list, UI hides itself; 3s timeout; server-side fetch avoids CORS | Teaser-only today — no purchase or entitlement flow exists on this side |
| Clean free/paid boundary (separate service, separate repo) protects the MIT free-forever promise | Depends on a service that doesn't exist publicly yet; dead plumbing until it ships |

| Opportunities | Threats |
|---|---|
| Only monetization hook in the codebase; step-aligned teasers meet learners exactly at the relevant moment | Mispositioned lock icons could read as "the free guide is crippled" — the copy currently guards against this, and must keep doing so |

## 10. Mobile — modified goal: iOS/iPadOS + Android + web/mobile web

Today: a native iOS app in a sibling repo (`ai-engineer-learning-guide-ios`) bundling `curriculum.json` from `npm run export-curriculum`. The modification widens the target to all four surfaces.

| Strengths (current position) | Weaknesses (current position) |
|---|---|
| Curriculum already decoupled from any client via the JSON export — the hard architectural work is done | The export writes to a hardcoded sibling path; it's a manual, easy-to-forget sync step (no CI) |
| The web UI already has responsive breakpoints (`md:` throughout), so mobile web is largely working today | Native iOS covers one platform with a codebase that shares zero UI code with web; Android would double that cost if done natively again |
| The Express API is platform-neutral — any client can call the same three endpoints | Study Buddy on mobile cannot assume local Ollama; it requires a hosted backend (Ollama Cloud/OpenRouter), which the operator pays for |
| | Progress does not sync across any of the four surfaces (see §7) |

| Opportunities | Threats |
|---|---|
| **One React codebase can plausibly cover all four surfaces** (see recommendation) — TS types in `src/types.ts` are shared for free | Maintaining three UI codebases (React web, SwiftUI, Kotlin/Compose) for a curated-content app is a solo-maintainer death march |
| App-store presence reaches learners who never find the website; offline curriculum reading is a genuine mobile win | App-store review friction: Apple 4.2 (minimum functionality) scrutinizes thin content-wrapper apps; the Study Buddy + quizzes are the defense |
| iPadOS split-view (curriculum beside Study Buddy) is a differentiated tablet experience | Platform AI rules keep shifting (LLM content in apps, external-purchase rules for the future premium tier on both stores) |
| Curriculum-as-JSON means content updates can ship without app-store releases (remote fetch + bundled fallback) | Feature drift between platforms erodes trust — the iOS app already lags the web feature set (no Study Buddy parity guarantee) |

### Cross-platform strategy recommendation

Three realistic paths, given a React/TS codebase, a solo-ish maintainer, and an existing SwiftUI app:

1. **Capacitor wrap of the existing React app** — lowest cost. One codebase → iOS, iPadOS, Android, web, mobile web. Reuses everything in `src/`. Trade-off: web-feel UI, and the existing SwiftUI app is retired or demoted. This is the pragmatic default for a content-first app.
2. **React Native / Expo (with `react-native-web`)** — native-feel UI on both stores, still TypeScript, still shares `types.ts` and the API client, but the current Tailwind/React DOM UI must be rebuilt in RN primitives. Roughly a rewrite of the view layer; justified only if native feel is a product priority.
3. **Keep native per platform** (SwiftUI + new Kotlin app) — best platform fidelity, worst economics: three UIs to keep in feature parity for a curated list + LLM drawer. Not recommended at this scale.

**Recommendation: path 1 (Capacitor), plus three enablers regardless of path:**
- Automate `export-curriculum` in CI (or serve curriculum JSON from the server) so clients can't drift from `data.ts`.
- Add progress export/import (JSON blob with a schema version) now — it is the cheap bridge across the four surfaces and the migration path to optional accounts later.
- Stand up a default hosted LLM backend (Ollama Cloud path already exists in `server.ts`) so Study Buddy works out of the box on phones, with rate limits already in place.

---

## Cross-cutting summary

- **Biggest asset**: content/delivery separation (`data.ts` → JSON export → any client). Every platform expansion leans on it.
- **Biggest liability under the multi-platform goal**: device-locked localStorage progress — four surfaces, four islands.
- **Biggest external threat**: model/provider churn (already materialized once with gemma3 cloud retirement) hitting the feature that differentiates the product (Study Buddy).
- **Monetization posture**: sound — the free/paid boundary is architecturally enforced (separate service), which protects the trust position the whole product depends on.
