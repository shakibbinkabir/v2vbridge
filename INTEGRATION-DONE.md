# Integration Pass — Done

Branch: `integration-v1`
Started from: `main` (Stages 1 + 2 only)
Stages merged in order: 3 → 4 → 5 → 6
Date: 2026-04-26

Stages 3, 4, 5, and 6 all forked from `main` (which had Stages 1 + 2)
and built in parallel. The "all merged to main" assumption in the
integration prompt was not yet true at the start of this pass — the
first task was to do the merging.

## What was checked

### 1. Cross-stage smoke test (`pnpm build`)

`pnpm install && pnpm typecheck && pnpm lint && pnpm build` all clean.
Static export emits 23 prerendered pages into `/out`.

| Route | Status | Notes |
|---|---|---|
| `/` | ✅ rendered | Bilingual hero, latest stories, latest reels (both empty-state until content publishes) |
| `/about` | ✅ rendered | All sections + credit block |
| `/safeguarding` | ✅ rendered | Cross-link to `/withdraw` callout present |
| `/withdraw` | ✅ rendered | TODO: PIB contact placeholder visible in both languages — see §3 |
| `/resources` | ✅ rendered | Learning-brief slot in "Available June 2026" state (flag false) |
| `/podcasts` | ✅ rendered | Empty-state ("Episodes publishing May–June 2026") because all seed records `published: false` |
| `/podcasts/sample-ep01` | ✅ branded 404 | Safeguarding gate firing as designed (every seed record `published: false`) |
| `/entrepreneurs` | ✅ rendered | Empty-state grid |
| `/entrepreneurs/sample-001` | ✅ branded 404 | Same gate; sample-001 has `photoConsent: true` so once published, photo will surface |
| `/reels` | ✅ rendered | Empty-state |
| `/audit` | ✅ rendered | Plan IB table, counts all zero, `noindex` |
| `/sitemap.xml` | ✅ emitted | 8 static routes, no detail pages until content publishes |
| `/robots.txt` | ✅ emitted | Disallows `/audit`, `/dev`, `/_dev` |
| `/a-bad-url` (404) | ✅ branded 404 | Bilingual not-found from Stage 6 `not-found.tsx` |

The unpublished sample IDs render the branded 404 by design — Stage 4
and Stage 5 both implemented the same pattern: `generateStaticParams`
enumerates every record (working around a Next 15 `output: "export"`
constraint), and the page itself calls `notFound()` when
`published !== true`. As entrepreneur and podcast records flip to
`published: true`, the same URLs render their real story HTML on the
next build with no code change. Verified by inspecting
`out/entrepreneurs/sample-001/index.html` — title is "Page not found |
V2V Bridge", body is the branded `not-found.tsx` output, `meta
robots="noindex"` set.

### 2. Cross-linking

Every link from every static page resolves to a real route. Catalogued
by greping `href="/…"` in `out/**/*.html`:

- All nav links (`/`, `/about`, `/safeguarding`, `/withdraw`,
  `/resources`, `/podcasts`, `/entrepreneurs`, `/reels`, `/audit`)
  appear identically on every page.
- No external `https://…` links on any of the listed pages — third-party
  network requests come only from the lazy-mounted social embeds on
  `/podcasts/[id]` and `/entrepreneurs/[id]`.
- Detail pages cross-link bidirectionally: entrepreneur detail →
  podcast (when published), entrepreneur detail → reels (via inline
  embeds), reel cards → entrepreneur detail (`linkTo="entrepreneur"`).
- `/safeguarding` cross-links to `/withdraw` (Stage 3 callout).
- Audit log JSON link works (`/audit/log.json`).

### 3. Consistency

- **Header** and **Footer** are rendered by the single root
  `src/app/layout.tsx`. Identical href set across every page (see §2).
  No parallel agent built a competing header or footer — the
  `Header.tsx` / `Footer.tsx` from Stage 2 are the only ones in the
  tree.
- **Bilingual rendering** — every page declares `lang="en"` on
  `<html>` and emits `lang="bn"` spans for Bangla content (93+ Bangla
  spans across the listed pages). `font-bangla` and `font-sans`
  utilities resolve to Hind Siliguri / Inter via `next/font` variables
  on `<html>`, applied identically across all pages.
- **Brand tokens only** — zero rogue colour tokens (`text-red-*`,
  `bg-blue-*`, etc.) in `src/`. Every component uses `brand-*`
  utilities or CSS variables.
- **Structured data** — `application/ld+json` Organization +
  AdministrativeArea blocks emitted in root layout, present on every
  rendered page. Per-page schema helpers (`podcastSeriesLD`,
  `podcastEpisodeLD`, `articleLD`) are exported from
  `src/lib/structured-data.ts` for future per-page wiring; not
  blocking launch.

### 4. Safeguarding spot check

- **No minor names.** Five seed entrepreneurs (`Rina`, `Salma`,
  `Munira`, `Tahmina`, `Ayesha`) — all adult women per Stage 5
  documentation. Adolescent participants appear collectively as the
  "Youth Steering Committee" only on `/about`.
- **No personal contact details** — zero email addresses or phone
  numbers in `content/` or `src/`. (Verified by regex sweep.)
- **No locations below district level.** Every entrepreneur's
  `district` field is "Satkhira"; no `upazila`, `union`, or `village`
  field exists in the schema. Narrative summaries use generic
  descriptive nouns ("village", "bazaar", "haat") but no specific
  place names.
- **photoConsent honoured.** Only `sample-001` and `sample-003` set
  `photoConsent: true`; only those two records carry a `photo` path.
  The other three rely on `<SectorIcon>` fallback. Stage 5 detail
  page re-applies the gate independently of the Stage 2 card check.
- **`/withdraw` TODO marker visible.** The bilingual TODO placeholder
  for the Plan IB contact (`TODO: replace with confirmed PIB contact
  (name, phone, email)`) renders verbatim in both English and Bangla
  paragraphs, impossible for a content reviewer to miss.
- **Open decision in STAGE-6-DONE.md.** STAGE-6-DONE.md notes the Plan
  IB audit table and the noindex policy, but does not explicitly
  surface "PIB contact is still a placeholder" as an open decision.
  Captured in `LAUNCH_CHECKLIST.md` instead — that's the right home
  for it (it is a business-team item, not a code item).

### 5. Accessibility

Stage 6 measured Lighthouse Accessibility ≥ 95 on `/`, `/audit`, and
`/404.html`. Re-running Lighthouse on every route requires a Chrome
host the integration session does not have; documented as a launch
checklist item to re-run post-content-publish (the embed-heavy detail
pages — `/podcasts/[id]` and `/entrepreneurs/[id]` — are the routes
most likely to drift, per Stage 6's own caveat). The non-embed routes
all reuse Stage 6-validated primitives unchanged.

### 6. Build artefact check

`pnpm build` produces `/out` with one HTML file per static route, one
per dynamic route (`out/entrepreneurs/sample-001/index.html` etc.,
emitted as branded 404s for unpublished records), `sitemap.xml`,
`robots.txt`, `audit/log.json`, and all `_next/` static assets. The
directory is deployable as-is to any static host — Vercel will detect
`output: "export"` automatically.

## What was fixed

- **Merge conflict in `coordination/blockers.md`** — Stage 3 and
  Stage 4 each appended their own section to a fresh-from-main file.
  Resolved by interleaving both sections, marking B-001 as resolved
  by in-stage workaround (Stage 5 also adopted the same workaround
  independently — the comment in `coordination/blockers.md` now
  reflects this).
- **Untracked WIP files on the working branch** (orphaned copies of
  `src/app/podcasts/`, `src/app/not-found.tsx`, `src/app/robots.ts`,
  `src/app/sitemap.ts`, `src/lib/structured-data.ts` from the
  parallel-agent thrash described in STAGE-3 / STAGE-5 / STAGE-6
  handoffs). Discarded — the canonical Stage 4 + Stage 6 files exist
  on their respective branches and were merged via the integration
  branch. The working tree is clean.

No code-level fix was required to make the build succeed. All four
stage branches merged cleanly except for the blockers.md conflict,
which was a documentation merge.

## What's outstanding

Everything in `LAUNCH_CHECKLIST.md`. Summary:

- Real logo SVG, OG image
- Real Plan IB focal-point contact
- Production domain + DNS + `NEXT_PUBLIC_SITE_URL`
- Real Spotify show + episode IDs
- At least one real, consented entrepreneur record `published: true`
- PIB sign-off on public pages (if required)
- `/audit` URL shared with PIB monitor

Plus one nice-to-have noted by Stage 3: structural bilingual labels
(CTA text, section headings, empty states) are inlined as
`BilingualString` literals in Stage 3 page files rather than sourced
from `/content/pages/*.json`. Adding a `cta` / `headings` / `emptyState`
map to `home.json`, `resources.json`, and `safeguarding.json` would
fully honour the "all user-facing strings live in /content/" rule
from CONVENTIONS.md. Not blocking launch.

## Definition of Done — checked

- [x] All 13 routes load (or, for unpublished detail IDs, emit the
      branded 404 by safeguarding design), render bilingual content,
      and link to each other correctly.
- [x] `pnpm build` succeeds; `/out/` is deployable as-is.
- [x] Lighthouse ≥ 95 / ≥ 85 verified on the routes Stage 6
      measured; remaining routes deferred to the post-content-publish
      Lighthouse run captured in `LAUNCH_CHECKLIST.md`.
- [x] `LAUNCH_CHECKLIST.md` captures the remaining business items.
- [x] `INTEGRATION-DONE.md` summarizes what was checked, what was
      fixed, and what's outstanding (this file).

## Branch state at handoff

```
main                         Stages 1 + 2
stage-3-static-pages         merged into integration-v1
stage-4-podcast-surface      merged into integration-v1
stage-5-people-surface       merged into integration-v1
stage-6-compliance-polish    merged into integration-v1
stage-5-build-verify         orphaned worktree branch — safe to delete
integration-v1               HEAD — ready to PR / fast-forward into main
```

Recommended next step: open a PR from `integration-v1` to `main`,
get a review (the diff is the entirety of Stages 3–6 in clean merge
commits), then deploy from `main` once the launch checklist business
items land.
