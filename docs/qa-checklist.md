# QA Checklist

The acceptance gate for retiring the native SwiftUI app
(`ai-engineer-learning-guide-7vj`): a full pass over every feature on **web**
and on **iOS on a physical device**. Android (`va0`) is tested after it builds
and is not a gate for iOS.

Derived from the source, not from memory — line references are included so a
failing item can be traced. Re-derive this list if the UI changes materially.

## How to use it

1. Run the automated tier first. If it fails, stop — the manual pass is wasted
   effort until it's green.
2. Work top to bottom. Items marked **[data]** mutate stored progress, so do
   them after the read-only checks, and export your progress first if you care
   about it.
3. A box is ticked only when the *observable outcome* matched, not when the
   feature merely didn't crash.

---

## Tier 0 — Automated (no human required)

```bash
npm run lint     # tsc --noEmit, strict
npm run build    # vite → dist/client, esbuild → dist/server.cjs
npm run smoke    # 17 backend assertions; boots the built server itself
npx tsx scripts/export-curriculum.ts /tmp/curriculum.json   # curriculum invariants
```

All four run in CI on every push and PR. `npm run smoke` needs **no LLM key** —
validation short-circuits before any model call and `/api/ai/health` returns a
well-formed `{ok: false}` when no provider is reachable.

Covered automatically, so it is **not** repeated below: endpoint contracts,
`/api/curriculum` cacheability, teaser degradation to an empty list, all input
validation (400 paths), CORS for both webview origins plus rejection of unknown
origins, `Vary: Origin`, SPA serving, non-exposure of the server bundle, rate
limiting, and that preflights don't consume the rate budget.

**Not** covered automatically — everything below.

---

## Tier 1 — Web

Run in a desktop browser, then repeat the starred (★) items at a phone viewport
width (`sa6` covers the responsive audit in more depth).

### Navigation and dashboard

- [ ] ★ Three tabs switch views: Full Curriculum / My Bookmarks / Quiz & Practice History (`App.tsx:418-452`)
- [ ] Bookmarks tab shows a count badge only when at least one bookmark exists (`App.tsx:437`)
- [ ] Four dashboard tiles render: completion %, completed modules x/y, bookmark count, quiz count (`App.tsx:361-410`)
- [ ] Completion % and its progress bar match the number of ticked modules
- [ ] Search/filter state persists when switching tabs and back (current behaviour — confirm it's wanted)

### Curriculum tab — browsing

- [ ] ★ Step cards render with step badge, "N/M Modules Completed", title, description (`RoadmapCard.tsx:64-126`)
- [ ] Per-step progress ring and % match the ticked modules in that step
- [ ] Step icon fills solid at 100% completion (`RoadmapCard.tsx:123`)
- [ ] Capstone "Your Project This Step" box renders where present (`RoadmapCard.tsx:78-96`)
- [ ] "When you need this" callout renders where present (`RoadmapCard.tsx:169-174`)
- [ ] Resource type icons differ by type — video/course/docs/repo/blog (`RoadmapCard.tsx:43-58`)
- [ ] "Start here" badge appears on primary resources (`RoadmapCard.tsx:212-216`)
- [ ] "Paywall" badge appears on gated resources, in both curriculum and bookmarks views (`RoadmapCard.tsx:217-222`, `App.tsx:568-573`)

### Curriculum tab — search and filter

- [ ] ★ Search matches topic titles (`App.tsx:260-286`)
- [ ] Search also matches resource title, description, and platform
- [ ] A step disappears entirely when none of its topics match
- [ ] ★ All five format filters work: All / Videos / Courses / Tutorials / Docs·Blogs·Repos (`App.tsx:477-495`)
- [ ] "Docs" filter includes docs, blog **and** repo types (`App.tsx:278`)
- [ ] Filters are single-select — picking one clears the previous
- [ ] Search and filter compose (both applied together)
- [ ] Empty-results panel appears when the combination matches nothing (`App.tsx:502-528`)
- [ ] "Clear Filters" resets both search and filter (`App.tsx:522`)

### Curriculum tab — resource expansion

- [ ] "Go deeper — N more resources" expands hidden resources (`RoadmapCard.tsx:268-286`)
- [ ] Label pluralises correctly: "1 resource" vs "N resources"
- [ ] "Show fewer resources" collapses again
- [ ] A topic with a primary resource but only one resource total shows **no** toggle (`RoadmapCard.tsx:269`)
- [ ] A topic with no primary resource shows all resources, uncollapsed (`RoadmapCard.tsx:139`)
- [ ] Expansion state resets on reload (per-component, not persisted)

### Progress interactions **[data]**

- [ ] ★ Clicking the circle icon toggles module completion (`App.tsx:182-194`)
- [ ] Completed titles get strikethrough and grey styling
- [ ] Step and global percentages recompute immediately
- [ ] Progress survives a page reload
- [ ] ★ Bookmark icon toggles and swaps to the filled state (`App.tsx:197-209`)
- [ ] Bookmarking is reflected instantly in the Bookmarks tab and its counter
- [ ] Quiz score pill appears under a topic after completing its quiz (`RoadmapCard.tsx:177-182`)

### Bookmarks tab

- [ ] Grid shows every bookmarked resource with step/topic reference, platform, type (`App.tsx:535-618`)
- [ ] "Remove" un-bookmarks and the card disappears (`App.tsx:556-561`)
- [ ] Empty state "Your study queue is empty" renders at zero bookmarks (`App.tsx:602-616`)
- [ ] "Explore Curriculum" button returns to the curriculum tab (`App.tsx:610`)

### Quiz & Practice History tab

- [ ] Completed evaluations list one row per quiz taken (`App.tsx:621-716`)
- [ ] Each row shows step reference, topic title, date, accuracy %, score badge
- [ ] Accuracy is green at ≥80%, blue below
- [ ] "Retake Quiz" reopens the Study Buddy on that topic (`App.tsx:673-691`)
- [ ] Empty state "No evaluations taken yet" renders at zero quizzes (`App.tsx:700-714`)

### Export / import / reset **[data]**

- [ ] Export downloads `ai-engineer-guide-progress-YYYY-MM-DD.json` (`App.tsx:140-150`)
- [ ] Exported file contains schemaVersion, completedTopicIds, bookmarkedUrls, quizScores
- [ ] Import shows a confirm dialog before replacing progress (`App.tsx:152-179`)
- [ ] Cancelling the confirm leaves progress untouched
- [ ] Import replaces (does not merge) progress
- [ ] Re-selecting the *same* file re-triggers the import (input value is reset)
- [ ] Import of malformed JSON alerts "not a valid progress export"
- [ ] Import of unrelated JSON (`{"foo":"bar"}`) is rejected
- [ ] Import of a JSON array or primitive (`[]`, `42`) is rejected
- [ ] Import of a file with `schemaVersion: 2` is rejected (future schema) (`App.tsx:46-52`)
- [ ] Import of a legacy file with **no** `schemaVersion` is accepted as v1
- [ ] Import with some malformed entries drops just those, keeping the rest (`App.tsx:54-79`)
- [ ] "Reset Stats" confirms, then clears modules, bookmarks and quiz scores (`App.tsx:227-231`)
- [ ] Cancelling the reset confirm changes nothing

### Study Buddy — drawer

- [ ] ★ "AI Study Buddy" button opens the drawer for that topic (`RoadmapCard.tsx:187-193`)
- [ ] Drawer always opens in "Concept Explainer" mode and auto-loads (`StudyBuddy.tsx:101-125`)
- [ ] ★ Close button (X) closes the drawer (`StudyBuddy.tsx:412-417`)
- [ ] ★ Clicking the backdrop closes the drawer (`StudyBuddy.tsx:389`)
- [ ] All three mode tabs switch: Concept Explainer / Knowledge Quiz / Mock Interview
- [ ] Returning to an already-loaded tab does **not** refetch (`StudyBuddy.tsx:422-459`)
- [ ] Loading state shows a spinner with a message that rotates every ~2.5s (`StudyBuddy.tsx:59-94`)
- [ ] With the LLM backend stopped, an amber health banner appears with a hint (`StudyBuddy.tsx:464-477`)
- [ ] "Check again" in the health banner re-runs the check
- [ ] With the backend stopped, an error banner plus "Retry Request" appears
- [ ] "Retry Request" retries the correct mode's call (`StudyBuddy.tsx:486`)

### Study Buddy — Concept Explainer

- [ ] Explanation loads and renders for the opened topic (`StudyBuddy.tsx:144-163`)
- [ ] Markdown renders: headers, bullet lists, numbered lists, bold, inline code (`StudyBuddy.tsx:274-378`)
- [ ] Fenced code blocks render with a header bar
- [ ] Copy button copies code and shows a green tick for ~2s (`StudyBuddy.tsx:266-271`)

### Study Buddy — Knowledge Quiz

- [ ] Quiz generates 3 questions with 4 options each (`StudyBuddy.tsx:166-191`)
- [ ] Selecting an option highlights it
- [ ] "Submit Answer" is disabled until an option is selected (`StudyBuddy.tsx:664`)
- [ ] After submit: correct option turns green, a wrong pick turns red, others dim
- [ ] Explanation panel appears after submitting, styled by correctness
- [ ] Options are locked after submitting (no double-submit)
- [ ] "Next Question" advances; last question reads "Finish Quiz"
- [ ] Finishing shows trophy, final score, accuracy % (`StudyBuddy.tsx:539-573`)
- [ ] **[data]** Score persists to the Practice History tab with today's date
- [ ] **[data]** Score badge appears on the quiz tab and under the topic
- [ ] "Retake Quiz" fetches a fresh quiz

### Study Buddy — Mock Interview

- [ ] Opens with a seeded assistant welcome referencing the topic (`StudyBuddy.tsx:111-120`)
- [ ] Typing and pressing Enter sends the message (`StudyBuddy.tsx:222-232`)
- [ ] Send is disabled while empty, whitespace-only, or loading
- [ ] Assistant reply appends and the view auto-scrolls to the bottom
- [ ] User bubbles are right-aligned/dark, assistant left-aligned with an "AI" avatar
- [ ] Multi-turn context is retained across several exchanges
- [ ] On failure the user's message stays in the log and an error banner shows

### Outbound links

- [ ] ★ Resource links open in a new tab (`RoadmapCard.tsx:251-261`)
- [ ] "Launch Learning Resource" in the bookmarks tab opens correctly (`App.tsx:587-595`)

---

## Tier 2 — iOS (physical device)

**Run the entirety of Tier 1 on the device first.** These are the additional
checks that only make sense on native.

### Build and launch

- [ ] App installs and launches without a white screen
- [ ] Launch screen appears, then the content (no flash of unstyled content)
- [ ] App icon and display name are correct on the home screen

### Native-specific behaviour

- [ ] **API base URL**: Study Buddy works — proves `VITE_API_BASE_URL` was baked in and CORS passed (`s84`)
- [ ] With the API host unreachable, Study Buddy shows its error banner rather than hanging
- [ ] **External links open in Safari** and leave the app (`WebViewDelegationHandler.swift:328`)
- [ ] Returning to the app from Safari preserves scroll position and state
- [ ] **[data]** Progress survives force-quit and relaunch
- [ ] **[data]** Progress survives an app update (reinstall over the top)

### Layout (`5mh`)

- [ ] Content clears the Dynamic Island / notch at the top
- [ ] Content clears the home indicator at the bottom
- [ ] Header remains correct while scrolled
- [ ] Landscape orientation is usable
- [ ] iPad layout is usable (app supports iPad — check `UISupportedInterfaceOrientations~ipad`)
- [ ] Study Buddy drawer respects safe areas, including its bottom input
- [ ] **Scrolling inside the drawer does not scroll the page behind it** (scroll chaining)
- [ ] Drawer close/backdrop tap targets are reachable and comfortably sized
- [ ] Text input in Mock Interview is not obscured by the on-screen keyboard
- [ ] Pinch-zoom is disabled (Capacitor disables it — confirm it holds)

---

## Tier 3 — Android (after `va0` builds)

- [ ] Re-run all of Tier 1 in the Android webview
- [ ] Re-run Tier 2's native-specific and layout sections, substituting Android equivalents
- [ ] Hardware back button behaves sensibly (closes the drawer before exiting the app)
- [ ] CORS works from the `http://localhost` origin (already allowlisted server-side)

---

## Known-suspect behaviours — confirm intent, don't just tick

Surfaced while deriving this checklist. Each is *possibly* correct by design;
the point is to make a decision rather than discover it in the wild.

- [ ] **Premium teaser is nested inside the capstone block** (`RoadmapCard.tsx:84` inside `:78`). A step with a teaser but **no** capstone text would never render its teaser. Confirm every teaser-bearing step has a capstone, or unnest it.
- [ ] **Quiz progress bar starts at 0%** on question 1 of N (`currentQuestionIdx / length`, `StudyBuddy.tsx:583-588`). Reads as "nothing done yet" rather than "question 1 of 3". Off-by-one or intended?
- [ ] **Health check fails open** (`StudyBuddy.tsx:127-137`). If the health request itself errors, `health` stays null and **no banner shows** even though the backend may be down. Deliberate per the code comment — confirm it's still what you want on native, where the API host is remote.
- [ ] **Clipboard copy has no error handling** (`StudyBuddy.tsx:266-271`). The green tick shows even if `navigator.clipboard.writeText` rejects (denied permission, non-secure context). Test in the iOS webview specifically.
- [ ] **`NaN%` is reachable in Practice History** if an imported quiz record has `total: 0` (`App.tsx:636-645`). Import validation drops malformed entries but does not check `total > 0`.
- [ ] **Bookmarks are keyed by URL** (`App.tsx:197-209`). Two resources sharing a URL would toggle together. `vt3` fixes this by moving to stable IDs.
- [ ] **Export uses the UTC date** (`toISOString().slice(0,10)`), so the filename can disagree with the user's local date near midnight.
