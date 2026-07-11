# Content Audit — Step 1: Close the Software Engineering Gap

**Audit date:** 2026-07-11
**Method:** Every URL verified via direct fetch (WebFetch/curl). YouTube videos verified via YouTube's oEmbed endpoint (confirms the video exists, its exact title, and channel) plus web search for channel/recency checks. Real Python blocks automated fetchers (HTTP 403 bot protection for all its URLs), so those pages were verified live via search-engine indexing and the site's documented freemium model (written tutorials free; video courses/lessons members-only).

**Verdict key:** OK = live, free, accurate · WARN = live but caveat (redirect, partial gating, currency, or quality) · DEAD = 404/gone · PAYWALL = requires payment/membership for the described content.

---

## step1-1 — Moving from Jupyter notebooks to structured, multi-file Python projects

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| The Journey from Jupyter to Programmer: A Quick-Start Guide | https://towardsdatascience.com/the-journey-from-jupyter-to-programmer-a-quick-start-guide/ | OK | Live, by Lucy Dickinson, June 2025. TDS left Medium in Feb 2025 and is now self-hosted — **no Medium metered paywall**; article is fully readable free. Content matches description. |
| Python Application Layouts: A Reference | https://realpython.com/python-application-layouts/ | WARN | Live (confirmed via search index; site 403s bots). Written tutorials on Real Python are free to read. Caveat: this reference predates the modern `pyproject.toml` / `src/` layout era, so "canonical" is a stretch in 2026 — pair with the PyPA packaging tutorial (see supplements). |
| Anatomy of a Scalable Python Project (FastAPI) | https://www.youtube.com/watch?v=Af6Zr0tNNdE | OK | Live. Title matches exactly; channel is **ArjanCodes** (data.ts says only "YouTube" — worth attributing; it strengthens credibility). |
| How to Structure Programming Projects for Beginners | https://www.youtube.com/watch?v=3gf60ncxe28 | OK | Live. Full title: "How to Structure Programming Projects for Beginners | Python Long-term Project Structuring", channel "lemonade in tech". Small channel, but description ("beginner-friendly overview") is accurate. |

### Supplemental recommendations
- **Packaging Python Projects (PyPA, official)** — https://packaging.python.org/en/latest/tutorials/packaging-projects/ — Verified live and free. The official, current reference for `src/` layout and `pyproject.toml` (covers Hatchling, setuptools, and uv-build backends, PEP 639 metadata). Fills the currency gap left by the 2018-era Real Python layout article.

---

## step1-2 — Object-oriented programming (OOP) — classes, imports, modules

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| OOP Learning Path | https://realpython.com/learning-paths/object-oriented-programming-oop-python/ | WARN | Live (search-verified; site 403s bots). The path mixes free written tutorials with **members-only video courses**, so a learner following it will hit membership walls partway through. Conflicts with the "no paywalls" promise unless noted in the UI. |
| Python OOP Tutorials – Working with Classes | https://www.youtube.com/watch?v=ZDa-Z5JzLYM | OK | Live. "Python OOP Tutorial 1: Classes and Instances" — Corey Schafer. First of a classic 6-part series; description accurate. Older (2016) but Python class syntax is stable — still the standard recommendation. |
| Python Modules and Packages – An Introduction | https://realpython.com/python-modules-packages/ | OK | Live (search-verified). Written tutorial — free tier on Real Python. Description accurate. |
| Python Basics: Modules and Packages | https://realpython.com/courses/python-basics-modules-packages/ | PAYWALL | Live, but Real Python **video courses are members-only** (only preview lessons free). Breaks the "completely free, no paywalls" promise. Recommend replacing or labeling. |

### Supplemental recommendations
- **The Python Tutorial — 9. Classes (docs.python.org)** — https://docs.python.org/3/tutorial/classes.html — Verified live, free, current (Python 3.14 docs). Authoritative coverage of class definition, inheritance, scoping/namespaces. Good free replacement for the paywalled modules/packages video course when combined with the free Real Python modules article already listed.

---

## step1-3 — UV — modern dependency management

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| uv Official Documentation | https://docs.astral.sh/uv/ | OK | Live, free, official Astral docs. Covers init/add/run/lock/sync and Python version management exactly as described. Current as of mid-2026. |
| How to Manage Python Packages with uv | https://www.freecodecamp.org/news/how-to-manage-python-packages-with-uv/ | OK | Live, free (freeCodeCamp). By Hew Hahn, Nov 2025 — recent. Covers lockfiles, `uv run`, pip migration as described. |
| Python uv Tutorial | https://www.youtube.com/watch?v=l3IWgp_r2xY | OK | Live. "Python uv tutorial" — channel Codeling; companion blog post dated June 2025. Short high-level overview; uv CLI fundamentals shown are still current. Small channel. |
| UV Python Package Manager Tutorial 2025 (100x Faster Than Pip) | https://www.youtube.com/watch?v=_6l2phhOoSg | OK | Live. Exact title match, channel "AI with Thiru". "2025" in the title reads slightly dated in mid-2026, but core uv workflow is unchanged. Small channel. |

### Supplemental recommendations
- None needed — official docs anchor the topic and the freeCodeCamp article is recent.

---

## step1-4 — Git workflows — branching strategies and pull requests

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| Git & GitHub Crash Course for Beginners | https://www.freecodecamp.org/news/git-and-github-crash-course-for-beginners/ | OK | Live, free. Published Dec 2025. Covers branching, merging, rebase, PRs as described. |
| Gitflow Workflow | https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow | OK | Live, free (Atlassian tutorial; page fetched, title confirmed). Atlassian's own page notes Gitflow is now considered legacy vs. trunk-based development — the description already frames this correctly. |
| How to Create a Pull Request in 4 Minutes | https://www.youtube.com/watch?v=nCKdihvneS0 | OK | Live. "How to create a pull request in 4 min | GitHub for Beginners" — official **GitHub** channel. Matches description. |
| Git and GitHub for Beginners – Crash Course | https://www.youtube.com/watch?v=RGOj5yH7evk | OK | Live. Exact title, freeCodeCamp.org channel. The classic course as described. |

### Supplemental recommendations
- None needed — all four verified OK.

---

## step1-5 — Production basics: testing (pytest), debugging, logging, .env config

| Resource | URL | Verdict | Notes |
|---|---|---|---|
| pytest Tutorial: Effective Python Testing | https://realpython.com/pytest-python-testing/ | OK | Live (search-verified; site 403s bots). Written tutorial — free tier. Fixtures/parametrize/marks coverage matches description. |
| Logging in Python | https://realpython.com/python-logging/ | OK | Live (search-verified). Written tutorial — free tier. Description accurate. |
| Using the .env File | https://realpython.com/videos/using-env-file/ | PAYWALL | Live, but this is a Real Python **video lesson** (part of a members-only course). Full video requires paid membership. Breaks the free promise. |
| Testing Your Code With pytest | https://realpython.com/courses/testing-your-code-with-pytest/ | PAYWALL | Live, but search-verified that "the full lesson is for members only" — Real Python video courses require paid membership. Also redundant with the free pytest written tutorial above. |

### Supplemental recommendations
- **pytest official "Get Started" guide** — https://docs.pytest.org/en/stable/getting-started.html — Verified live, free, current (references pytest 9.1). Authoritative replacement for the paywalled pytest video course.
- **Python Logging HOWTO (docs.python.org)** — https://docs.python.org/3/howto/logging.html — Verified live, free, current (3.14 docs). Loggers, handlers, levels, formatters. Also note: for the `.env` gap, the python-dotenv PyPI/GitHub README is the natural free substitute for the paywalled Real Python video.

---

## Summary — Step 1 (20 resources)

| Verdict | Count |
|---|---|
| OK | 15 |
| WARN | 2 |
| PAYWALL | 3 |
| DEAD | 0 |

**Biggest issue:** three Real Python *video/course* resources are members-only (step1-2 "Python Basics: Modules and Packages", step1-5 "Using the .env File", step1-5 "Testing Your Code With pytest"), which contradicts the app's "completely free, no paywalls" promise. Real Python *written* tutorials remain free and are fine. Verified free replacements are listed above.
