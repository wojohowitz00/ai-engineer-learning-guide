# SWOT Work Plan

Date: 2026-07-31. Derived from `docs/swot-analysis.md` — every actionable weakness/threat from the per-feature SWOT matrices, sequenced into four phases. Each item is tracked as a beads issue (IDs below); this document is the narrative sequencing, not the tracker — `bd ready` is the source of truth for status.

Sequencing logic: Phase 1 items are prerequisites the later phases lean on (progress portability, curriculum-as-API, LLM reliability). Phase 2 executes the cross-platform mobile strategy. Phase 3 is content operations — protecting the product's core trust asset. Phase 4 is experience enrichment that can proceed anytime after Phase 1.

## Phase 1 — Foundations

These unblock multi-platform work and fix known reliability gaps.

| # | Item | Type / Pri | SWOT source | Issue |
|---|---|---|---|---|
| 1.1 | Progress export/import as versioned JSON (add `schemaVersion` to the localStorage blob) | feature / P1 | §7 weakness: device-locked progress; the bridge across all four surfaces and the migration path to optional accounts | `ai-engineer-learning-guide-6tf` |
| 1.2 | Serve curriculum JSON from the server (`GET /api/curriculum`) and automate the export in CI | feature / P1 | §10 weakness: manual, hardcoded-path `export-curriculum` lets clients drift from `data.ts` | `ai-engineer-learning-guide-v11` |
| 1.3 | LLM health check + friendly unavailable-state UX | feature / P2 | §6 weakness: Ollama-not-running fails at request time with a generic 500 | `ai-engineer-learning-guide-br7` |
| 1.4 | Fix Study Buddy interview retry after a failed turn | bug / P2 | §5 known bug: retry sends an empty message | `ai-engineer-learning-guide-cku` |
| 1.5 | Machine-enforce "at most one start-here resource per topic" | task / P2 | §3 weakness: invariant held by convention only | `ai-engineer-learning-guide-vi3` |

## Phase 2 — Cross-platform mobile

Executes the modified mobile goal: iOS/iPadOS + Android + web/mobile web from one strategy.

| # | Item | Type / Pri | SWOT source | Issue |
|---|---|---|---|---|
| 2.1 | Spike: Capacitor wrap of the React app; iOS simulator build; go/no-go verdict vs React Native (Android validation deferred to 4.5 per 2026-07-31 decision) | feature / P1 | §10 recommendation: one codebase for all four surfaces | `ai-engineer-learning-guide-abj` |
| 2.2 | Hosted LLM backend story for mobile (Ollama Cloud path, cost controls) | task / P2 | §10 weakness: phones can't reach `localhost:11434` | `ai-engineer-learning-guide-v9a` |
| 2.3 | Decide the fate of the native SwiftUI iOS app (after 2.1's verdict) | task / P2 | §10 threat: per-platform native UIs are unsustainable solo | `ai-engineer-learning-guide-7vj` |
| 2.4 | Mobile-web layout audit and polish (filter bar, drawer, tap targets) | task / P3 | §8/§10: desktop-shaped controls at phone widths | `ai-engineer-learning-guide-sa6` |

Dependency: 2.3 is blocked by 2.1. App-store defense note: the Study Buddy and quizzes are the answer to Apple's minimum-functionality bar for content apps — keep them first-class in any wrapped build.

## Phase 3 — Content operations

The curriculum is the product; these protect its verified-free trust position over time.

| # | Item | Type / Pri | SWOT source | Issue |
|---|---|---|---|---|
| 3.1 | Automated periodic link checker over all resource URLs (includes the Depth Zero day-one dependencies) | task / P2 | §1 threat: link rot vs. a point-in-time audit; §2 threat: broken first-run experience | `ai-engineer-learning-guide-gyu` |
| 3.2 | Content changelog surfaced to returning learners | task / P3 | §1 weakness: no visibility into what changed | `ai-engineer-learning-guide-wzj` |
| 3.3 | CONTRIBUTING.md with the resource audit checklist | task / P3 | §1 opportunity: scale curation without dropping the quality bar | `ai-engineer-learning-guide-9s9` |
| 3.4 | Stable resource IDs; key bookmarks by ID, not URL | task / P3 | §8 weakness: audit URL fixes silently break bookmarks | `ai-engineer-learning-guide-vt3` |

Dependency: 3.4 is blocked by 1.1 (needs the `schemaVersion` migration seam).

## Phase 4 — Experience enrichment

Independent quality-of-life work; start anytime after Phase 1.

| # | Item | Type / Pri | SWOT source | Issue |
|---|---|---|---|---|
| 4.1 | Stream explain/interview responses | feature / P3 | §5 weakness: long generations feel slow, especially on local models | `ai-engineer-learning-guide-ml2` |
| 4.2 | Replace home-grown markdown renderer with react-markdown | task / P3 | §5 weakness: renderer is a growing liability | `ai-engineer-learning-guide-8j3` |
| 4.3 | Capstone starter scaffolding + shareable completion artifact | feature / P3 | §4 weakness: capstone is copy-only; keep the free tier substantive | `ai-engineer-learning-guide-tx5` |
| 4.4 | Interactive Depth Zero on-ramp checklist | feature / P4 | §2 weakness: no feedback loop on the day-one ship | `ai-engineer-learning-guide-bkd` |
| 4.5 | Capacitor Android build validation (deferred from 2.1; blocked by it) | task / P4 | §10: Android half of the cross-platform goal | `ai-engineer-learning-guide-va0` |

## Explicitly deferred (from the SWOT, no issue filed)

- **Premium teasers (§9):** teaser plumbing is sound and fail-silent; further work (entitlements, purchase flow) is blocked on the premium service existing, which lives outside this repo.
- **Persona-variant motivation hooks (§3 opportunity)** and **semantic search (§8 opportunity):** opportunities, not problems — revisit after Phase 2 ships.
- **Optional accounts/sync (§7):** deliberately sequenced *behind* export/import (1.1); build the seam first, decide on accounts when premium forces the identity question anyway.

## Execution notes

- Quality gate for every code change: `npm run lint` (tsc) + `npm run build` — there is no test suite (adding one is worth considering during 1.4, the first behavioral fix).
- Execution work should be delegated to smaller models where mechanical; planning and review stay with the lead model (user preference, recorded via `bd remember`).
