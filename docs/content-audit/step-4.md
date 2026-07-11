# Content Audit — Step 4: Retrieval-Augmented Generation (RAG)

- **Audit date:** 2026-07-11
- **Scope:** Topics `step4-1` through `step4-5` in `src/data.ts` (19 resources — note `step4-4` has only 3 while every other topic has 4)
- **Method:** Every URL fetched directly (WebFetch). YouTube videos verified via YouTube's oEmbed endpoint (confirms video exists, exact title, and channel), with web search for dates where needed. Verdicts: **OK** (live, free, accurate), **WARN** (live but with an issue worth fixing/noting), **DEAD** (broken/renamed), **PAYWALL** (materially gated).

---

## step4-1 — RAG fundamentals and pipeline design

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Learn RAG from Scratch (LangChain engineer) | https://www.freecodecamp.org/news/mastering-rag-from-scratch/ | OK | Live, free (freeCodeCamp, Apr 2024). Confirmed Lance Martin (LangChain) as instructor; covers multi-query, RAG-Fusion, HyDE, RAPTOR, CRAG, Adaptive RAG as described. Conceptual content that has aged well. |
| RAG 101: Learn how to build your first pipeline! | https://www.youtube.com/watch?v=QTK55_Otbqs | OK | Verified DataCamp channel; title exact match. YouTube video is free (DataCamp *courses* are paid, but this is not one). |
| Retrieval Augmented Generation (RAG) | https://www.deeplearning.ai/courses/retrieval-augmented-generation | PAYWALL | Live, but the data.ts claim "(Free to audit; certificate is paid)" is **inaccurate for this page**: only Module 1 is a free preview; full access to all modules, assessments, and certificate requires paid enrollment / PRO membership (verified on page). This is a 26-hour full course (Zain Hasan), not a free short course. Either relabel honestly, link the Coursera audit path, or swap for a genuinely free alternative (see supplement below). |
| Learn RAG & MCP Fundamentals | https://www.freecodecamp.org/news/learn-rag-and-mcp-fundamentals/ | OK | Live, free (freeCodeCamp, Jan 22, 2026). Chroma, embeddings, chunking "precision problem" — matches description; very current. |

**Supplemental recommendations:**

1. **Building and Evaluating Advanced RAG Applications (DeepLearning.AI short course)** — https://www.deeplearning.ai/short-courses/building-evaluating-advanced-rag/ — Verified live and free (fetched 2026-07-11; "Course access is free for a limited time during the DeepLearning.AI learning platform beta"). Taught by Jerry Liu (LlamaIndex CEO) and Anupam Datta; ~2 hours on advanced retrieval + RAG evaluation. A genuinely free DL.AI option to back up (or replace) the paywalled full RAG course.

## step4-2 — Chunking strategies

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Chunking Strategies for LLM Applications | https://www.pinecone.io/learn/chunking-strategies/ | OK | Live, free; updated 2025-06-28. Covers fixed-size, content-aware, structure-based, semantic, and LLM-contextual chunking (incl. Anthropic contextual retrieval) — matches description and is current. |
| Document Chunking Strategies for RAG Systems | https://www.youtube.com/watch?v=yrLe3UAR1PU | OK | Exists; actual title "…Complete Python Tutorial 2025", channel Mahendra Medapati (data.ts platform is just "YouTube", so no misattribution). Small channel — content matches description. |
| Semantic Chunking for Improved RAG Results | https://www.youtube.com/watch?v=FPYtGK6HYRg | OK | Exists; actual title "RAG Tutorial 2025 #10: Semantic Chunking for Improved RAG Results", channel Harish Neel \| AI. It is episode 10 of a series — fine standalone, but worth knowing. |
| LangChain Text Splitters (Chunking) for Beginners – 6 Examples | https://www.youtube.com/watch?v=Io43kf0hYn4 | OK | Verified; channel Ryan & Matt Data Science, title matches. |

**Supplemental recommendations:** none needed — Pinecone article anchors the topic and is freshly updated.

## step4-3 — Generating embeddings via API & embedding models

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Vector embeddings (Embeddings guide) | https://platform.openai.com/docs/guides/embeddings | WARN | 301 permanent redirect to https://developers.openai.com/api/docs/guides/embeddings. Destination is live, free, no login, and **current** (documents text-embedding-3-small/-large, dimensions parameter — matches description). Update the stored URL to the new host. |
| Embedding Models: from Architecture to Implementation | https://www.deeplearning.ai/courses/embedding-models-from-architecture-to-implementation | OK | Live; genuinely a free ~1-hour short course (BERT, dual encoders, contrastive loss — matches description). Caveat: page says "free for a limited time during the… platform beta", and the graded assignment needs PRO — free status could change. |
| What is a Vector Database? Powering Semantic Search & AI Applications | https://www.youtube.com/watch?v=gl1r1XV0SLw | OK | Verified IBM Technology; title exact match. Authoritative channel. |
| Understanding Embedding Models | https://www.youtube.com/watch?v=qJp8ZDxS1xQ | OK | Exists; verified channel TensorTeach, full title "Understanding Embedding Models \| Mastering Vector Databases \| TensorTeach". Small/low-profile channel — the weakest authority in this step, but content matches the description. |

**Supplemental recommendations:**

1. **Sentence Transformers (SBERT) official documentation** — https://www.sbert.net/ — Verified live and free (fetched 2026-07-11). The canonical open-source reference for using and fine-tuning embedding models (semantic search, retrieve-and-rerank, cross-encoders, sparse encoders), maintained with Hugging Face. Complements the OpenAI-API-centric guide with the local/open-model side, and is a stronger authority than the TensorTeach video.

## step4-4 — Vector storage and retrieval methods

Only 3 resources here vs. 4 everywhere else — a slot is open.

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| What is a Vector Database & How Does it Work? | https://www.pinecone.io/learn/vector-database/ | OK | Live, free. Covers ANN algorithms PQ, LSH, HNSW, random projection, similarity measures, plus production concerns — matches description. |
| How Vector Databases Power AI | https://www.youtube.com/watch?v=aExSNbSC1f8 | OK | Verified; channel is IBM Technology (data.ts platform says just "YouTube" — could credit IBM for authority). |
| Mastering Vector Databases with Pinecone | https://www.datacamp.com/tutorial/mastering-vector-databases-with-pinecone-tutorial | WARN | Live and free (DataCamp *tutorials* are free; only courses are paid). But **stale**: published Aug 2023, no update since, and its code uses the deprecated `pinecone.init(api_key=…, environment=…)` pattern that was removed from the Pinecone SDK (v3+, 2024) — the examples will not run against today's client or serverless indexes. Replace or pair with current docs (below). |

**Supplemental recommendations:**

1. **Pinecone official quickstart** — https://docs.pinecone.io/guides/get-started/quickstart — Verified live and free (fetched 2026-07-11); uses the current SDK (`Pinecone` class, `create_index_for_model`, `upsert_records`, SDK v9 conventions) with a free Starter tier. Fills the empty 4th slot and gives working code where the DataCamp tutorial is now broken.
2. *(If a 5th slot is ever wanted:)* Pinecone's Faiss/ANN "learn" series (linked from the vector-database article above) covers HNSW/IVF/PQ internals in depth — same free Pinecone learn hub already vetted here.

## step4-5 — PostgreSQL + pgvector

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| pgvector (official README) | https://github.com/pgvector/pgvector | OK | Official repo; current (v0.8.5, Postgres 13–18 support). Documents HNSW/IVFFlat and six distance operators — matches description; actively maintained. |
| pgvector Tutorial: Integrate Vector Search into PostgreSQL | https://www.datacamp.com/tutorial/pgvector-tutorial | OK | Free DataCamp *tutorial* (not a paid course). Published Aug 2024, **updated Jan 20, 2026** — current. Covers install, IVFFlat/HNSW, Python/LangChain, OpenAI-powered semantic search app. |
| PGVector: Turn PostgreSQL Into A Vector Database | https://www.youtube.com/watch?v=j1QcPSLj7u0 | OK | Verified NeuralNine; title exact match. |
| PostgreSQL pgvector for Python developers: Practical Guide | https://www.youtube.com/watch?v=PuHP3kktmQI | OK | Exists; channel is Denis Magda (Postgres/distributed-SQL developer advocate) — data.ts platform says just "YouTube"; could credit him. Title exact match. |

**Supplemental recommendations:** none needed — anchored by the official README, and the DataCamp tutorial was refreshed in 2026.

---

## Summary

| Verdict | Count |
|---|---|
| OK | 16 |
| WARN | 2 |
| DEAD | 0 |
| PAYWALL | 1 |

**Totals:** 19 resources audited. No dead links. The one PAYWALL is the DeepLearning.AI full RAG course (step4-1), whose "free to audit" description is inaccurate — only Module 1 is free. The two WARNs: the OpenAI embeddings guide URL 301-redirects to developers.openai.com (step4-3), and the DataCamp Pinecone tutorial (step4-4) teaches a deprecated SDK API from 2023. step4-4's missing 4th resource is best filled by the verified Pinecone official quickstart.
