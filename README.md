# AI Engineer Learning Guide

An interactive roadmap for data scientists transitioning to AI engineering. Six steps, 27 topics, 120 curated resources — every link individually verified (liveness, free access, currency), with the few membership-gated picks flagged by a paywall badge and paired with free alternatives.

Alongside the curriculum, an **AI Study Buddy** drawer offers per-topic concept explanations, generated multiple-choice quizzes, and a chat-based mock interview. Progress (completed topics, bookmarks, quiz scores) persists in `localStorage` — no accounts.

## Stack

- **UI**: React 19, Tailwind CSS v4, lucide-react, motion
- **Server**: Express + Vite middleware (dev) / static build (prod)
- **LLM**: [OpenRouter](https://openrouter.ai) via the OpenAI SDK — any supported model, one API key, no provider lock-in

## Run locally

Prerequisites: Node.js 20+

```bash
npm install
cp .env.example .env    # then set OPENROUTER_API_KEY (https://openrouter.ai/keys)
npm run dev             # http://localhost:3000
```

By default all AI features use [OpenRouter's Auto Router](https://openrouter.ai/docs/guides/routing/routers/auto-router) (`openrouter/auto`), which picks the best model per prompt. To pin a specific model, set `OPENROUTER_MODEL` to any [OpenRouter model id](https://openrouter.ai/models). The quiz feature requires strict structured-output (`json_schema`) support — if quiz generation fails under the Auto Router, pin `OPENROUTER_QUIZ_MODEL` to a schema-capable model (e.g. `google/gemini-3.5-flash`).

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Dev server with Vite HMR on port 3000 |
| `npm run build` | Production build (client to `dist/`, server to `dist/server.cjs`) |
| `npm start` | Run the production build |
| `npm run lint` | TypeScript check (`tsc --noEmit`, strict) |

## Project layout

- `src/data.ts` — the curriculum: steps → topics → resources (the real product)
- `src/App.tsx`, `src/components/` — roadmap UI, resource cards, Study Buddy drawer
- `server.ts` — Express server with three LLM endpoints: `/api/ai/explain`, `/api/ai/quiz`, `/api/ai/interview`
- `docs/code-analysis.md` — baseline architecture notes
- `docs/content-audit/` — per-step link audit reports and consolidated summary
- `.beads/` — issue tracking (`bd ready` to see open work)

## Content maintenance

The resource list was audited 2026-07-11 (see `docs/content-audit/SUMMARY.md`). Fast-moving entries worth periodic re-checks: DeepLearning.AI "free during beta" courses, Medium-hosted articles, and anything tied to a specific SDK version.
