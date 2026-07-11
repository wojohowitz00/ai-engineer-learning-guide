# Content Audit — Step 3: Build Production-Ready Backends

- **Audit date:** 2026-07-11
- **Scope:** Topics `step3-1` through `step3-5` in `src/data.ts` (20 resources)
- **Method:** Every URL fetched directly (WebFetch). YouTube videos verified via YouTube's oEmbed endpoint (confirms video exists, exact title, and channel), with web search used for publication dates and for pages that block automated fetches. Verdicts: **OK** (live, free, accurate), **WARN** (live but with an issue worth fixing/noting), **DEAD** (broken/renamed), **PAYWALL** (materially gated).

---

## step3-1 — FastAPI

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Tutorial - User Guide | https://fastapi.tiangolo.com/tutorial/ | OK | Official FastAPI docs; live, free, current. Covers params, validation, auth, dependencies, testing, deployment. |
| Python FastAPI Tutorial: Full Course for Beginners | https://www.youtube.com/watch?v=iukOehU5aF4 | OK | Channel claim verified: this really is Corey Schafer ("Python FastAPI Tutorial: Full Course for Beginners - Build a Full-Stack Web App"). Published ~May 2026 — very current. |
| FastAPI Full Crash Course | https://www.youtube.com/watch?v=rvFsGRvj9jo | OK | Verified NeuralNine, "FastAPI Full Crash Course - Python's Fastest Web Framework". |
| FastAPI Blog Tutorials | https://testdriven.io/blog/topics/fastapi/ | OK | 23 blog posts, free to read; newest Jan 2026. Note: the site also sells paid courses ($30+) alongside the free blog — description correctly points at the blog. |

**Supplemental recommendations:** none needed — coverage is strong and current.

## step3-2 — Pydantic

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Python Pydantic Tutorial: Complete Data Validation Course | https://www.youtube.com/watch?v=M81pfi64eeM | OK | Channel claim verified: Corey Schafer, "Python Pydantic Tutorial: Complete Data Validation Course (Used by FastAPI)". |
| Data Validation in Python With Pydantic | https://www.youtube.com/watch?v=ySCtmCTm1lE | OK | Verified Real Python channel; title exact match. |
| Structured Output from LLMs Using Pydantic | https://www.youtube.com/watch?v=rjEMU15ZONM | OK | Verified Code with Felix, "Structured Output from LLMs Using Pydantic (Beginner's Guide)". |
| Pydantic Official Documentation | https://docs.pydantic.dev/ | WARN | 301 permanent redirect to https://pydantic.dev/docs/ — now a product hub for Pydantic Validation / Pydantic AI / Pydantic Logfire rather than the validation-library reference directly. Still official and free, but consider updating the URL to https://pydantic.dev/docs/ (or deep-linking the Validation docs) so users land where the description promises. |

**Supplemental recommendations:** none needed.

## step3-3 — Docker (for Python developers)

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Python Docker Tutorials | https://realpython.com/tutorials/docker/ | WARN | Page is live (confirmed via search; direct fetch blocked by bot protection, HTTP 403). Real Python mixes free written tutorials with **members-only tutorials and video courses** on the same listing page, so some links behind this hub require a paid membership — a soft conflict with the app's "no paywalls" promise. Keep, but note the mixed access. |
| Docker Full Course | https://www.freecodecamp.org/news/docker-full-course/ | OK | Live, free; ~7-hour course as described (images, networking, volumes, Compose, Swarm). Published June 4, 2026 — very fresh. |
| Containerize Your Python Application with Docker | https://www.youtube.com/watch?v=k6D5UyLPNrI | OK | Verified Coder In Boots; title exact match. Small channel, but content matches the description. |
| A Gentle Introduction to Docker for Python Developers | https://www.kdnuggets.com/a-gentle-introduction-to-docker-for-python-developers | OK | Live, free; KDnuggets, Sept 9, 2025, by Bala Priya C. Uses a FastAPI todo app as the example — good fit for this step. |

**Supplemental recommendations:**

1. **Docker's official Python language guide** — https://docs.docker.com/guides/python/ — Verified live and free (fetched 2026-07-11). Official, current (references Python 3.12, PostgreSQL 18, modern tooling), and covers containerize → develop → test → CI for a Python app. Fills the gap left by Real Python's mixed free/members-only access with a fully free, authoritative alternative.

## step3-4 — PostgreSQL

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Part I. Tutorial (Official PostgreSQL Docs) | https://www.postgresql.org/docs/current/tutorial.html | OK | Official docs, currently serving PostgreSQL 18; live and free. |
| PostgreSQL Course for Beginners | https://www.freecodecamp.org/news/posgresql-course-for-beginners/ | OK | The "posgresql" typo is in the real slug — the page resolves. Free 3-hour course (Oct 2023) covering setup through aggregates, as described. |
| PostgreSQL Tutorial for Beginners | https://www.youtube.com/watch?v=SpfIwlAYaKk | OK | Verified freeCodeCamp.org channel, "PostgreSQL Tutorial for Beginners". |
| Building a Database Application With PostgreSQL & Python | https://www.youtube.com/watch?v=Yh0uwzQ-TrE | OK | Verified channel "Drez"; actual title is "Building Database Application With PostgreSQL & Python" (trivial title drift). |

**Supplemental recommendations:** none needed.

## step3-5 — Model Context Protocol (MCP) servers

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Build an MCP Server | https://modelcontextprotocol.io/docs/develop/build-server | OK | Official MCP docs; live, free, current. Python (and other SDK) weather-server walkthrough, exactly as described. |
| Learn MCP Essentials … with FastMCP | https://www.freecodecamp.org/news/learn-mcp-essentials-and-how-to-create-secure-agent-interfaces-with-fastmcp/ | OK | Live, free (freeCodeCamp, Oct 15, 2025). Hands-on FastMCP projects incl. STDIO + HTTP Stream calculators and FastMCP Cloud deploy. |
| MCP Tutorial: Build Your First MCP Server and Client from Scratch | https://www.youtube.com/watch?v=RhTiAOGwbYE | OK | Verified KodeKloud; full title includes "(Free Labs)". Published July 21, 2025 — acceptable recency for MCP. |
| Model Context Protocol (MCP) Tutorial … in 6 Steps | https://towardsdatascience.com/model-context-protocol-mcp-tutorial-build-your-first-mcp-server-in-6-steps/ | WARN | Live and — contrary to TDS's old Medium-metered reputation — **fully free** on the standalone towardsdatascience.com site (verified; no meter hit). Flagged for **currency**: published June 11, 2025, in a fast-moving area (MCP auth and Streamable HTTP transport have evolved since). The FastMCP + Claude Desktop approach it teaches is still the standard pattern, so it remains usable. |

**Supplemental recommendations:** none strictly needed — the official docs (resource 1) are current and anchor the topic. If one is added later, prefer another modelcontextprotocol.io page over a third-party tutorial.

---

## Summary

| Verdict | Count |
|---|---|
| OK | 17 |
| WARN | 3 |
| DEAD | 0 |
| PAYWALL | 0 |

**Totals:** 20 resources audited. No dead links and no hard paywalls. The three WARNs: Real Python's Docker hub mixes in members-only content (step3-3), `docs.pydantic.dev` now 301-redirects to the pydantic.dev product hub (step3-2), and the TDS MCP tutorial is a year old in a fast-moving space (step3-5). Notably, both "Corey Schafer" channel claims — often a fabrication risk in curated lists — check out as genuine.
