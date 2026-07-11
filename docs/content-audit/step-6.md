# Content Audit — Step 6: Build and Ship Full-Stack Projects

**Audit date:** 2026-07-11
**Method:** Every resource URL in `src/data.ts` (topics `step6-1` through `step6-4`) was verified via direct WebFetch of the page and, for YouTube videos, WebFetch of the watch page plus WebSearch to confirm channel and recency. Verdicts: **OK** (live, free, accurate, current), **WARN** (live but with a freshness, freeness, or accuracy caveat), **DEAD** (404 / removed / redirect to homepage), **PAYWALL** (not genuinely free). All supplemental recommendations were fetched and verified live on the audit date.

---

## step6-1 — Automated backend pipeline (ingest → email summary, scheduling)

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| How to Automate Work Using Python | https://www.freecodecamp.org/news/how-to-automate-things-using-python/ | OK | Live, free (freeCodeCamp). Confirmed to include a "Hacker News Headlines Emailer" and an "Automated News Summarizer" project, as described. Published 2021, but smtplib/schedule fundamentals are stable. |
| Python Email Automation – 6 Real-World Projects | https://www.youtube.com/watch?v=YBYiA51YhFQ | OK | Live; title confirmed on watch page. Free. |
| Automate Data Jobs with Cron & Python Easily | https://www.youtube.com/watch?v=o425kNX8CyE | OK | Live; title confirmed on watch page. Cron content is evergreen. Free. |
| How to Use Python Schedule Library for Task Automation | https://medium.com/@sachinchauhanpy/how-to-use-python-schedule-library-for-task-automation-beginners-guide-with-examples-1c6969e75f2f | OK | Live; published Apr 2025. Fetched in full with no member-only gate, so it is a public (non-metered) Medium story as of the audit date. Caveat: Medium can convert stories to member-only at the author's discretion — re-check periodically. Content matches description. |

### Supplemental recommendations
- None required. Coverage (smtplib, schedule library, cron) is complete and all links are healthy.

---

## step6-2 — Basic front-end for a chat UI (Streamlit / Gradio)

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Build a basic LLM chat app | https://docs.streamlit.io/develop/tutorials/chat-and-llm-apps/build-conversational-apps | OK | Live at current docs path, no redirect. Covers `st.chat_message` / `st.chat_input` through a streaming ChatGPT-like app. Official and current. |
| Build a Streamlit Chatbot FAST | https://www.youtube.com/watch?v=sBhK-2K9bUc | OK | Live; title confirmed on watch page. Free. |
| Creating A Chatbot Fast | https://www.gradio.app/guides/creating-a-chatbot-fast | OK | Live, official Gradio guide. Confirmed coverage of `gr.ChatInterface`, streaming via `yield`, and persistent chat history. Current. |
| Build a Chatbot with Python, Gradio, LangChain and OpenAI | https://www.youtube.com/watch?v=AevVRlg6dsc | OK | Live; title confirmed on watch page. Free. |

### Supplemental recommendations
- None required. Both official docs are current and the videos are live.

---

## step6-3 — Full-stack chat application (UI + backend + database + auth)

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| MERN Stack Project: Realtime Chat App Tutorial | https://www.youtube.com/watch?v=ntKkVrQqBYY | OK | Live; full title confirmed ("... React.js & Socket.io"), published Nov 2024, code on GitHub, free deployment covered. Solid tutorial — but human-to-human chat, no LLM component (see topic-fit note below). |
| How to Build a Full Stack Application Using ChatGPT | https://www.freecodecamp.org/news/build-a-full-stack-application-using-chatgpt/ | OK | Live, free (freeCodeCamp, May 2023). Note: this teaches using ChatGPT as a coding assistant to build an app — AI-assisted development, not building an AI application. Description in the app is accurate but the fit is loose. |
| How to Build a Full-Stack Authentication App With React, Express, MongoDB | https://www.freecodecamp.org/news/how-to-build-a-fullstack-authentication-system-with-react-express-mongodb-heroku-and-netlify/ | WARN | Live and free, but published Jul 2022 and its deployment half targets the **Heroku free tier, discontinued Nov 2022** — those instructions no longer work without paying. The auth code (bcrypt, JWT, protected routes) remains sound; learners must substitute Render/Railway/etc. for deployment. |
| Building a Full-Stack Chatbot App \| React + Node.js + MongoDB | https://www.youtube.com/watch?v=x_-TbwsPnAA | OK | Live; title confirmed on watch page. Free. |

**Topic-fit assessment (requested):** This topic is the capstone of an *AI engineering* guide, yet three of four resources are generic MERN chat/auth tutorials with no LLM anywhere in the stack, and the fourth uses ChatGPT only as a pair-programmer. The MERN fundamentals (REST API, JWT auth, MongoDB, websockets) are legitimately transferable, but the topic never shows the learner the things that make LLM apps different full-stack problems: token streaming to the browser (SSE), persisting conversation/message history per user, provider API-key handling server-side, and cost/latency-aware UX. Recommendation: keep one MERN tutorial for fundamentals and add at least one LLM-native full-stack example (below).

### Supplemental recommendations
- **Vercel AI Chatbot template** — https://github.com/vercel/ai-chatbot (redirects to the renamed canonical repo `github.com/vercel/chatbot`) — Open-source (MIT-style licensed, 20k+ stars, actively maintained) full-stack **LLM-native** chat app: Next.js + AI SDK with streaming, Auth.js authentication, Neon Postgres chat-history persistence, multi-provider model support. Exactly the "UI + backend + database + auth" promise of this topic, but for an AI product. **Verified live 2026-07-11.**
- **Streamlit + FastAPI learners already covered in step6-2/6-4**; if a second LLM-native resource is wanted, the Langfuse-instrumented example apps linked from https://langfuse.com/docs (verified live 2026-07-11) tie this step back to Step 5's observability content.

---

## step6-4 — Deployment: VPS or free-tier cloud

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| How To Serve Flask Applications with Gunicorn and Nginx on Ubuntu 22.04 | https://www.digitalocean.com/community/tutorials/how-to-serve-flask-applications-with-gunicorn-and-nginx-on-ubuntu-22-04 | OK | Live, free (DigitalOcean community tutorials are free). Covers venv, Gunicorn, Nginx reverse proxy, and Let's Encrypt/Certbot SSL as described. Published May 2022; Ubuntu 22.04 is still an LTS in support — content remains valid. |
| How to Deploy a MERN Stack Notes App on AWS | https://www.freecodecamp.org/news/how-to-deploy-mern-stack-notes-app-aws/ | OK | Live, free, and fresh (published Jan 2026). Confirmed EC2 + RDS PostgreSQL + S3/CloudFront on the AWS Free Tier, matching the description. |
| Host Python Web Apps FOR FREE (Flask, Django, FastAPI) | https://www.youtube.com/watch?v=grUCtaAiUd0 | OK | Live; title confirmed on watch page. Note for maintainers: Render's free web services spin down on idle and free-tier terms shift periodically — worth a periodic re-check, but the video itself is live and on-topic. |
| Set Up Django with Postgres, Nginx, and Gunicorn on Ubuntu | https://www.digitalocean.com/community/tutorials/how-to-set-up-django-with-postgres-nginx-and-gunicorn-on-ubuntu | OK | Live, free, last updated Oct 2025 (actively maintained, multi-Ubuntu-version). Matches description. |

### Supplemental recommendations
- None required. Both DigitalOcean tutorials are free and maintained, and the AWS walkthrough is only months old.

---

## Summary

| Verdict | Count |
|---|---|
| OK | 15 |
| WARN | 1 |
| DEAD | 0 |
| PAYWALL | 0 |
| **Total resources** | **16** |

Key issues: (1) the freeCodeCamp auth tutorial's Heroku free-tier deployment path has been defunct since Nov 2022 — the only WARN; (2) step6-3 is strategically misaligned: an AI-engineering capstone built entirely from generic MERN tutorials, with no LLM-native full-stack example — the verified Vercel AI Chatbot template fills that gap; (3) the Medium article in step6-1 is publicly readable today but should be re-checked periodically since Medium stories can move behind the member paywall.
