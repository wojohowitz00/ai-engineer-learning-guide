# Content Audit — Consolidated Summary

Date: 2026-07-11. Method: three parallel research agents; every URL individually verified (direct fetch, YouTube oEmbed/watch-page checks, web search fallback for bot-blocked sites). Per-step detail in `step-{1..6}.md`.

## Totals (107 resources)

| Step | Resources | OK | WARN | PAYWALL | DEAD |
|---|---|---|---|---|---|
| 1 — SE Gap | 20 | 15 | 2 | 3 | 0 |
| 2 — LLM Layer | 16 | 14 | 2 | 0 | 0 |
| 3 — Backends | 20 | 17 | 3 | 0 | 0 |
| 4 — RAG | 19 | 16 | 2 | 1 | 0 |
| 5 — Evals | 16 | 9 | 7 | 0 | 0 |
| 6 — Full-Stack | 16 | 15 | 1 | 0 | 0 |
| **Total** | **107** | **86** | **17** | **4** | **0** |

Headline: **zero dead links** — the curation is fundamentally sound. The problems are paywall violations of the "completely free" promise, staleness in fast-moving tooling, and one topic-fit gap.

## Priority fixes for src/data.ts

### P1 — Paywall violations (break the app's core promise)
1. **step1-2** Real Python "Python Basics: Modules and Packages" course → members-only. Replace with official Python tutorial ch. 9 or keep only free written tutorials.
2. **step1-5** Real Python "Using the .env File" video → members-only. Replace (e.g. Python Logging HOWTO / pytest Get Started docs per step-1 report).
3. **step1-5** Real Python "Testing Your Code With pytest" course → members-only. Replace with pytest official Get Started docs.
4. **step4-1** DeepLearning.AI "Retrieval Augmented Generation" full course → description "(Free to audit)" is wrong; only Module 1 free. Replace with DL.AI short course "Building and Evaluating Advanced RAG Applications".

### P1 — Deprecated / dead-end content
5. **step5-2** OpenAI Evals cookbook → teaches deprecated `oaieval`; hosted Evals product itself shuts down 2026-11-30. Replace with Promptfoo docs and/or Langfuse Evaluation overview.
6. **step4-4** DataCamp Pinecone tutorial → uses `pinecone.init()` removed in SDK v3+; code won't run. Replace/supplement with official Pinecone quickstart (also fixes this topic having only 3 resources).

### P2 — Stale URLs (content fine, links redirect)
7. **step2-1** OpenAI structured outputs → `developers.openai.com/api/docs/guides/structured-outputs`
8. **step4-3** OpenAI embeddings → `developers.openai.com/api/docs/guides/embeddings`
9. **step3-2** Pydantic docs → update to current docs path (old URL 301s to product hub)

### P2 — Fragile "free" claims
10. All four DeepLearning.AI short courses (step2-2, 5-2, 5-3, 5-4) are free only "during platform beta" and require accounts. Keep, but hedge with permanent-free alternatives (OpenAI prompt-engineering guide already identified for step2-2).
11. **step6-3** freeCodeCamp auth tutorial deploys to Heroku free tier (discontinued 2022). Keep for the auth content, note the deployment half is non-viable.

### P3 — Fit and quality upgrades
12. **step6-3** capstone has zero LLM-native full-stack resources. Add Vercel AI Chatbot template (github.com/vercel/ai-chatbot — streaming, auth, Postgres persistence).
13. **step1-1** Real Python "Application Layouts" (2018) predates pyproject.toml norms → supplement with PyPA packaging tutorial.
14. **step5-1** Datalumina Langfuse self-hosting video predates Langfuse v3 architecture; **step5-4** Guardrails content stale → supplement with OWASP LLM Top 10 (2025) + current Guardrails docs.
15. **step2-4** context engineering: add LangChain context-engineering post as stronger complement to small-channel videos.

## Confirmed good (spot-check highlights)

- All 44 YouTube videos exist with matching titles/channels; both Corey Schafer attributions genuine (FastAPI course May 2026, Pydantic course).
- Towards Data Science left Medium's metered paywall (Feb 2025) — its links are fully free.
- Evidently AI guides updated May 2026; Langfuse doc URLs current; openai-python repo current (v2.45.0, 2026-07-09).
- The odd freeCodeCamp slug `posgresql-course-for-beginners` (sic) is the real URL and resolves.
