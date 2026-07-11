# Code Analysis — AI Engineer Learning Guide

Date: 2026-07-11. Baseline commit: initial import of Google AI Studio export.

## What this app is

An interactive learning roadmap for data scientists transitioning to AI engineering. Single-page React app with a small Express backend that proxies three Gemini API features.

- **Content**: 6 steps → 27 topics → ~105 curated free resources, all hardcoded in `src/data.ts`.
- **Progress tracking**: completion checkmarks, bookmarks, and quiz scores persisted to `localStorage` (`ai_engineer_roadmap_progress`). No accounts, no database.
- **AI features** ("Study Buddy" drawer, `src/components/StudyBuddy.tsx`): topic explanations, 3-question generated quizzes (structured JSON output), and a chat-based mock interview — each backed by an Express endpoint in `server.ts` calling `gemini-3.5-flash` server-side so the API key never reaches the browser.

## Architecture

| Layer | Tech | Files |
|---|---|---|
| UI | React 19, Tailwind v4, lucide-react, motion | `src/App.tsx`, `src/components/*` |
| Data | Static TypeScript arrays | `src/data.ts`, `src/types.ts` |
| Server | Express + Vite middleware (dev) / static dist (prod) | `server.ts` |
| LLM | `@google/genai`, lazy-initialized client | `server.ts` |

Sensible choices for a prototype: key stays server-side, quiz uses `responseSchema` for structured output, client state is dumb-simple localStorage.

## Findings

### Content (the real product)
- The guide's core promise is "completely free, no paywalls", but several entries are on metered-paywall platforms (Towards Data Science, Medium) — subject of the content audit in `docs/content-audit/`.
- `step4-4` has 3 resources; every other topic has 4.
- Step 6 (full-stack projects) leans on generic MERN chat tutorials rather than LLM-native app builds — fit question flagged for audit.

### Code quality (tracked in beads)
- `README.md` is AI Studio boilerplate; `package.json` still named `react-example` (ai-engineer-learning-guide-vrk).
- `App.tsx`: "Clear Filter Filters" typo; unused icon imports (Moon, Sun, Info, Calendar, Terminal, …) — dark-mode icons with no dark mode (ai-engineer-learning-guide-egx).
- `server.ts`: `lastUserMessage` computed and never used; raw `error.message` returned to clients; no rate limiting; interview endpoint trusts arbitrary client history (ai-engineer-learning-guide-26w, fine for local prototype).
- `RoadmapCard.tsx`: `key?: any` declared in props interface — React `key` is not a prop and shouldn't be typed there.
- `StudyBuddy.tsx`: error-retry button calls `handleSendMessage()` with an empty input, so a failed interview turn can't actually be retried; custom markdown renderer is home-grown (acceptable for prototype, would swap for `react-markdown` if features grow).
- Model id `gemini-3.5-flash` needs verification against current Gemini model list (ai-engineer-learning-guide-26w).
- No tests; `npm run lint` is just `tsc --noEmit`.

## Verification status

Static analysis only in this pass — dependencies not yet installed, app not yet run. Link verification delegated to research agents writing `docs/content-audit/step-{1..6}.md`.
