# Content Audit — Step 5: Observability and Evaluations (Evals)

**Audit date:** 2026-07-11
**Method:** Every resource URL in `src/data.ts` (topics `step5-1` through `step5-4`) was verified via direct WebFetch of the page and, for YouTube videos, WebFetch of the watch page plus WebSearch to confirm channel and recency. Verdicts: **OK** (live, free, accurate, current), **WARN** (live but with a freshness, freeness, or accuracy caveat), **DEAD** (404 / removed / redirect to homepage), **PAYWALL** (not genuinely free). All supplemental recommendations were fetched and verified live on the audit date.

---

## step5-1 — Langfuse: tracking inputs, outputs, latency, and cost

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| 10 min Walkthrough of Langfuse | https://www.youtube.com/watch?v=2E8iTvGo9Hs | OK | Live. Official Langfuse channel, published Dec 2024. Covers dashboard, tracing, evals, prompt management, datasets. Free. |
| Get Started with Tracing | https://langfuse.com/docs/observability/get-started | OK | Live at current docs path (no redirect). Covers drop-in integrations for OpenAI SDK, LangChain, OTEL, Vercel AI SDK and more, exactly as described. Actively maintained. |
| LLM Observability & Application Tracing — Overview | https://langfuse.com/docs/observability/overview | OK | Live at current docs path. Conceptual overview of traces, structured logs, latency/cost capture. Matches description. |
| Get Started with Langfuse — Open-Source LLM Monitoring (Datalumina) | https://www.youtube.com/watch?v=epnPfe5am3I | WARN | Live; Datalumina channel, published Jul 2024. Predates Langfuse v3 (Dec 2024), which substantially changed the self-hosting architecture (ClickHouse, Redis, S3/blob storage now required). Concepts still valid, but the local self-hosting steps shown may not match current Langfuse. |

### Supplemental recommendations
- None required. Both Langfuse docs URLs resolve at current (post-restructure) paths and the official walkthrough video is current enough. If the Datalumina video is ever dropped, the official self-hosting docs at https://langfuse.com/self-hosting (linked from the verified docs) are the natural replacement.

---

## step5-2 — Building evaluation datasets & regression testing

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Automated Testing for LLMOps | https://www.deeplearning.ai/courses/automated-testing-llmops | WARN | Live. Taught by Rob Zuber (CircleCI CTO). Page still says "Course access is free for a limited time during the DeepLearning.AI learning platform beta" — free today, but explicitly time-limited, and graded assignments/certificate require a paid PRO plan. Conflicts with a hard "no paywalls" promise; monitor. |
| How to create LLM test datasets with synthetic data | https://www.evidentlyai.com/llm-guide/llm-test-dataset-synthetic-data | OK | Live, fully readable without registration, last updated May 2026. Covers manual/existing/synthetic dataset creation, happy-path/edge/adversarial cases, RAG datasets. Authoritative and current. |
| LLM evaluation datasets: test cases and synthetic data (video) | https://www.youtube.com/watch?v=Do6KAkutKbc | OK | Live; title confirmed ("LLM evaluation datasets: test cases and synthetic data"), Evidently AI channel. Free. |
| Getting Started with OpenAI Evals | https://developers.openai.com/cookbook/examples/evaluation/getting_started_with_openai_evals | WARN | Live, but effectively archived: last updated Mar 2024 and the page itself carries the banner "OpenAI now has a hosted evals product with an API! We recommend you use this instead." Worse, the hosted Evals platform is *also* deprecated — OpenAI docs state Evals becomes read-only Oct 31, 2026 and shuts down Nov 30, 2026. Teaching the `oaieval` open-source framework in mid-2026 is a dead end. Replace or heavily caveat. |

### Supplemental recommendations
- **Promptfoo — Getting Started** — https://www.promptfoo.dev/docs/intro/ — Open-source (20k+ GitHub stars), free, actively maintained CLI/library for declarative LLM test cases and regression evals; a durable, vendor-neutral replacement for the deprecated OpenAI Evals framework. **Verified live 2026-07-11.**
- **Langfuse — Evaluation Overview (Datasets & Experiments)** — https://langfuse.com/docs/evaluation/overview — Covers building reusable test-case datasets, running experiments, and catching regressions in CI, and dovetails with the Langfuse tracing content in step5-1. Free (open source). **Verified live 2026-07-11.**

---

## step5-3 — "LLM-as-a-judge" workflows

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| LLM-as-a-judge: a complete guide | https://www.evidentlyai.com/llm-guide/llm-as-a-judge | OK | Live, free, last updated May 2026. Covers pairwise vs. direct scoring, position/verbosity/self-enhancement biases, prompt best practices — exactly as described. |
| LLM-as-a-judge: evaluating LLMs with LLMs (video) | https://www.youtube.com/watch?v=Qj3u_kzfJVo | OK | Live; confirmed via search — Evidently AI, published Dec 2024. Matches description. |
| Evaluating AI Agents | https://www.deeplearning.ai/courses/evaluating-ai-agents | WARN | Live; taught by Arize AI (John Gilhuly, Aman Khan), 2h36m. Same caveat as other DeepLearning.AI short courses: "free for a limited time during the platform beta"; graded assignment/certificate requires PRO. Free today, contingent tomorrow. |
| LLM-as-Judge: Automated AI Evaluation Explained (video) | https://www.youtube.com/watch?v=XJeKSAXFRCk | WARN | Video is live and title matches, but the channel could not be identified via watch-page fetch or web search (no indexed footprint), so authority and recency are unverifiable. Weakest link in this topic; consider swapping for an attributable source. |

### Supplemental recommendations
- **Langfuse — LLM-as-a-Judge evaluators** (reachable from https://langfuse.com/docs/evaluation/overview, verified live 2026-07-11) — hands-on judge configuration against real traces; complements Evidently's conceptual guide and replaces the unattributable YouTube video if it is dropped. Free, open source.

---

## step5-4 — Guardrails: prompt injection, PII, output validation

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Safe and Reliable AI via Guardrails | https://www.deeplearning.ai/courses/safe-and-reliable-ai-via-guardrails | WARN | Live; instructor confirmed as Shreya Rajpal (Guardrails AI founder). Same "free for a limited time during beta" caveat; certificate behind PRO. Course also predates recent Guardrails AI library versions, so code may not run as-shown. |
| LLM Guardrails: Hallucination, Toxicity, PII, and Prompt Injection | https://www.youtube.com/watch?v=qP5tBuRBnhM | OK | Live. Full title is "LLM Guardrails: ... | Databricks GenAI Engineer Cert" — a cert-prep conceptual explainer, which fits the "core conceptual intro" description. Channel attribution "StackLessons" could not be independently confirmed from the watch page. |
| Guardrails for LLM Applications — Complete Tutorial | https://www.youtube.com/watch?v=7V1w5gnZ-kw | OK | Live; title confirmed ("Guardrails for LLM Applications \| Complete Tutorial for AI Developers With Guardrails AI"). Matches the hands-on-library description. |
| How to validate LLM responses continuously in real time | https://guardrailsai.com/blog/validate-llm-responses-real-time | WARN | Live (no 404/redirect) and free, but published Jan 2024 against an early library version; the post itself lists since-changed limitations (no reask/async streaming support at the time). Fast-moving library — treat as historical background, not current how-to. |

### Supplemental recommendations
- **OWASP Top 10 for LLM Applications (2025)** — https://genai.owasp.org/llm-top-10/ — The authoritative, framework-neutral reference for prompt injection (LLM01) and sensitive-information disclosure (LLM02); the topic currently has no standards-level source. Free (CC BY-SA 4.0). **Verified live 2026-07-11.**
- **Guardrails AI — Official Documentation** — https://www.guardrailsai.com/docs — Current docs for Guards, validators, and the Guardrails Hub; the reliable up-to-date counterpart to the 2024-era course and blog post. Free, open-source Python framework. **Verified live 2026-07-11.**

---

## Summary

| Verdict | Count |
|---|---|
| OK | 9 |
| WARN | 7 |
| DEAD | 0 |
| PAYWALL | 0 |
| **Total resources** | **16** |

Key issues: (1) the OpenAI Evals cookbook teaches a framework that is deprecated twice over — the open-source framework was superseded, and the hosted Evals platform it points to shuts down Nov 2026; (2) all three DeepLearning.AI courses are free only "for a limited time during beta" with certificates paywalled, which sits uneasily with the app's "completely free, no paywalls" promise; (3) Guardrails AI content (course + blog) is 2024-era against a fast-moving library; (4) one LLM-as-judge video has no verifiable author.
