# Content Audit — Step 2: The LLM-Specific Layer

**Audit date:** 2026-07-11
**Method:** Every URL verified via direct fetch (WebFetch). YouTube videos verified via YouTube's oEmbed endpoint (confirms the video exists, its exact title, and channel) plus web search for channel/recency checks.

**Verdict key:** OK = live, free, accurate · WARN = live but caveat (redirect, partial gating, currency, or quality) · DEAD = 404/gone · PAYWALL = requires payment/membership for the described content.

---

## step2-1 — OpenAI Python SDK — API calls, caching, structured outputs

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Structured Outputs — OpenAI API Guide | https://platform.openai.com/docs/guides/structured-outputs | WARN | Content is live, free, and current (JSON Schema strict mode, Pydantic, both Responses API and Chat Completions), but the URL **301-redirects** to https://developers.openai.com/api/docs/guides/structured-outputs — OpenAI moved its docs off platform.openai.com. Update the stored URL to the developers.openai.com address (the sibling prompt-caching entry already uses it). |
| Prompt Caching — OpenAI API Guide | https://developers.openai.com/api/docs/guides/prompt-caching | OK | Live, free, official. Explains automatic caching, latency/cost reduction as described. Current. |
| openai-python (official SDK repo) | https://github.com/openai/openai-python | OK | Live, official, actively maintained — v2.45.0 released 2026-07-09 (two days before audit). README shows Responses API, streaming, async; Pydantic structured-output examples live in linked docs/examples rather than the README itself — description slightly generous but fair. |
| OpenAI Structured Output Tutorial (Responses API + JSON Schema) | https://www.youtube.com/watch?v=ROKU_Jqb1po | OK | Live. Exact title match; channel **Leon van Zyl**, published March 2025, with companion GitHub repo. Uses the modern Responses API — still current for mid-2026. |

### Supplemental recommendations
- None needed beyond fixing the redirected URL — official docs + SDK repo cover the topic well.

---

## step2-2 — Prompt engineering

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| ChatGPT Prompt Engineering for Developers | https://www.deeplearning.ai/courses/chatgpt-prompt-eng | WARN | Live (short URL resolves to the course page). Isa Fulford & Andrew Ng as described. Page says "Course access is **free for a limited time during the DeepLearning.AI learning platform beta**" and requires a free account — free today, but the free status is explicitly temporary. Worth a UI note and periodic re-check. |
| Prompt Engineering Guide | https://www.promptingguide.ai/ | OK | Live, free, DAIR.AI. Covers zero-shot, few-shot, CoT, ReAct, Reflexion. Site upsells paid academy courses, but the guide itself is fully free. |
| Learn Prompting — Introduction | https://learnprompting.org/docs/introduction | OK | Live. Core guide is "completely free and open-source" (their words); paid certifications/video courses exist alongside but the linked curriculum is free. |
| Prompt Engineering Tutorial – Master ChatGPT and LLM Responses | https://www.youtube.com/watch?v=_ZvnD73m40o | OK | Live. Exact title, freeCodeCamp.org channel. An older (2023) tutorial — fundamentals hold, but it predates reasoning-model prompting practices. |

### Supplemental recommendations
- **OpenAI Prompt Engineering guide (official docs)** — https://developers.openai.com/api/docs/guides/prompt-engineering — Verified live and free. Covers message roles, few-shot, RAG, and — importantly for 2026 — how prompting differs for reasoning vs. GPT models, plus snapshot pinning and eval advice. Hedges both the DeepLearning.AI course's "limited time" free status and the 2023 vintage of the freeCodeCamp video.

---

## step2-3 — Building AI agents from scratch (no frameworks)

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Build an AI Agent from Scratch with Python (No Frameworks) | https://alejandro-ao.com/agents-from-scratch/ | OK | Live, free. Covers exactly the described tool-use loop (LLM decides tool → app executes → result returned) with a complete Agent class. No paywall. |
| Intro to Agents — Create an Agent from Scratch | https://www.youtube.com/watch?v=vHDwpoSFdQY | OK | Live. "Intro to Agents - Create an Agent from Scratch (No Frameworks)" — Alejandro AO channel. Genuine video companion to the tutorial above. |
| Build your First AI Agent from Scratch (No Frameworks, Just Python) | https://www.youtube.com/watch?v=HkFB0_AcIcg | OK | Live. Exact title match; channel "Hunnur" (small channel — data.ts says only "YouTube"). Content matches description; somewhat redundant with the two Alejandro AO entries. |
| Deep Dive into LLMs like ChatGPT | https://www.youtube.com/watch?v=7xTGNNLPyMI | OK | Live. Andrej Karpathy's official channel, Feb 2025, ~3.5 hours. Exactly as described; the strongest resource in this topic. |

### Supplemental recommendations
- None needed — topic is well covered and all four verified OK.

---

## step2-4 — Context engineering

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Effective Context Engineering for AI Agents | https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents | OK | Live, free. Anthropic engineering blog, published Sep 29, 2025. Compaction, structured note-taking, multi-agent architectures. The anchor resource for this topic. |
| 7 Context Engineering Rules for Production AI Agents | https://www.youtube.com/watch?v=wgDzOSPbTqg | OK | Live. Full title "...(Anthropic + LangGraph)" — channel Dr. Maryam Miradi. Matches description; smaller independent channel (not an official source). |
| See How Anthropic Uses Context Engineering | https://www.youtube.com/watch?v=EKXClh779H0 | OK | Live. Channel "omni_georgio" — a commentary/explainer video on Anthropic's post, not Anthropic's own content. Description ("accessible explainer") is honest about this. Small channel. |
| Context Engineering Guide: RAG & Agentic AI | https://www.sundeepteki.org/blog/context-engineering-a-framework-for-robust-generative-ai-systems | OK | Live, free. Published 2025-06-26 by Sundeep Teki (AI consultant/researcher, personal blog). Covers RAG and agentic patterns as described. Personal blog rather than institutional source, but substantive. |

### Supplemental recommendations
- **Context Engineering for Agents (LangChain blog)** — https://www.langchain.com/blog/context-engineering-for-agents — Verified live and free (note: the older blog.langchain.com URL 301-redirects here; store the www.langchain.com form). Published July 2, 2025. The widely cited write/select/compress/isolate framework — an authoritative complement to the Anthropic post, and stronger sourcing than the two small-channel videos.

---

## Summary — Step 2 (16 resources)

| Verdict | Count |
|---|---|
| OK | 14 |
| WARN | 2 |
| PAYWALL | 0 |
| DEAD | 0 |

**Biggest issues:** (1) the Structured Outputs entry points at platform.openai.com, which now permanently redirects — update to developers.openai.com; (2) the DeepLearning.AI prompt-engineering course is free only "for a limited time during beta" and requires an account, so the app's unconditional "free" claim is fragile for that entry. Everything else verified live, free, and reasonably current for mid-2026.
