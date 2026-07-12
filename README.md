# AI Engineer Learning Guide

An interactive learning roadmap for people who already code — developers, data scientists, analysts — transitioning to AI engineering. A "Depth Zero" on-ramp (ship something with an LLM on day one) plus six steps, 28 topics, and 122 curated resources — every link individually verified (liveness, free access, currency), with the few membership-gated picks flagged by a paywall badge and paired with free alternatives.

The guide is built around **pull-based learning**: every topic opens with a motivation hook anchored in a pain point you have already felt in real technical work, one "start here" resource is marked per topic (the rest collapse behind a "go deeper" toggle), and a capstone project thread runs through all the steps — each step's deliverable deliberately ends on the weakness the next step fixes.

Alongside the curriculum, an **AI Study Buddy** drawer offers per-topic concept explanations, generated multiple-choice quizzes, and a chat-based mock interview — all anchored in the same motivating scenarios. Progress (completed topics, bookmarks, quiz scores) persists in `localStorage` — no accounts.

## Inspiration & attribution

This project stands on two pieces of work by others:

- **The roadmap.** This guide uses **Dave Ebbelaar**'s six-step roadmap as its structure: the steps and their topic breakdown come from his video ["How to Go From Data Scientist to AI Engineer (I Did This)"](https://www.youtube.com/watch?v=yAOzupIW87E) and the companion roadmap [`ds-ml-to-ai-engineer-2026.md`](https://github.com/daveebbelaar/ai-cookbook/tree/main/roadmaps) in his MIT-licensed [ai-cookbook](https://github.com/daveebbelaar/ai-cookbook) repository. **The learning resources, however, are our own** — every one of the 122 links was independently selected, verified, and audited for this project rather than taken from the roadmap. If this guide is useful to you, his channel and cookbook are the primary sources — go subscribe and star them.
- **The learning philosophy.** The pull-based framing — the Depth Zero "solve one real problem today" on-ramp, per-topic motivation hooks, and the start-here/go-deeper resource minimalism — was inspired by the video ["How I'd Learn AI in 2026 From Scratch — BACKWARDS"](https://www.youtube.com/watch?v=Wx8r6ZEEjz0) and its companion one-page map, adapted here for an audience that already has engineering scar tissue to anchor to.

What is original to this project: the interactive application itself, the resource curation and link audit, the wording of all motivation hooks and capstone copy, and the AI Study Buddy. This project is not affiliated with or endorsed by either creator.

## Features

- **Depth Zero on-ramp** — ship something real with an LLM before starting the curriculum
- **Pull-motivation hooks** — every topic opens with the data-science pain point that makes it necessary
- **Start here / go deeper** — one recommended entry resource per topic; the rest a click away
- **Capstone thread** — one evolving project (a personal research assistant over your own documents) spanning every step
- **AI Study Buddy** — concept explanations, generated quizzes, and mock interviews per topic, via any OpenRouter model
- **Progress tracking** — completions, bookmarks, and quiz scores in `localStorage`; no accounts, no backend state

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

## Content maintenance

The resource list was audited 2026-07-11 (see `docs/content-audit/SUMMARY.md`); resources added since were verified individually at the time of addition. Fast-moving entries worth periodic re-checks: DeepLearning.AI "free during beta" courses, Medium-hosted articles, and anything tied to a specific SDK version.
