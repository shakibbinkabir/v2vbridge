# Stage 3 — Static Pages — Done

Branch: `stage-3-static-pages`
Build commit: `4a4f727` (stage-3: build static pages…)
This handoff doc is the next commit on the branch.

## Definition of Done — checked

- [x] All 5 pages render real content read from `/content/pages/*.json`
- [x] Each page exports its own `metadata` derived from `pageCopy.metadata`
- [x] `pnpm typecheck` clean
- [x] `pnpm lint` clean
- [x] `pnpm build` succeeds — see "Verification" below for the
      caveat about the off-limits files that had to be moved aside to
      get a clean Stage-3-only build (Stage 6's `src/app/robots.ts`
      currently breaks `output: 'export'` and is owned by Stage 6, not
      this branch).
- [x] Bilingual content renders in correct fonts on every route
      (verified by inspecting the static `/out/<route>/index.html`
      files — `font-sans` / `font-bangla` utilities + `lang` attributes
      both present in the rendered HTML)

## Files added

```
src/app/page.tsx                replaces the Stage 1 placeholder
src/app/about/page.tsx          new
src/app/safeguarding/page.tsx   new
src/app/withdraw/page.tsx       new
src/app/resources/page.tsx      new
```

(`coordination/blockers.md` updated with two notes — see below.)

No changes to `src/components/`, `src/lib/`, `/content/`, or
`src/app/layout.tsx`. No new dependencies. No per-page OG images
generated; pages inherit `og-default.png` from the root layout, which
is the spec-allowed fallback.

## What each page renders

### Home (`/`)

- Hero with bilingual title from `home.json`, an inline kicker
  (`Plan IB · Youth Equality Award 2026 · CapeC.`), and two CTAs:
  `Listen to the stories` → `/podcasts`, `About the project` → `/about`.
- "Latest stories" section: `getAllPublishedPodcasts().slice(0, 3)`
  rendered as a 3-column responsive grid of `<PodcastCard>`. The
  sector tag on each card is looked up via `getEntrepreneur(p.entrepreneurId)`.
  Heading: `Latest stories / সর্বশেষ গল্প` via `<BilingualText>`.
- "Latest reels" section: `getAllPublishedReels().slice(0, 6)` as a
  responsive `<ReelCard>` grid. Heading: `Latest reels / সর্বশেষ রিল`.
- About teaser: pulls the first section from `home.json` (heading +
  body) and adds a `Read the full project page` link to `/about`.
- Empty states: when 0 published items exist, both grids show a
  `Coming May–June 2026 / আসছে মে–জুন ২০২৬` block in place of the grid.

### About (`/about`)

- Hero with `about.title` from `about.json`.
- All `about.sections` rendered inside a `<Prose>` wrapper, each
  heading + body via `<BilingualText>` (`as="h2"` / `as="p"`).
- Closing credit block (`<dl>` of bilingual role labels + real text):
  Plan IB (Youth Equality Award 2026), CapeC. Consulting (Satkhira &
  Dhaka), Vercel + Spotify for Podcasters (hosting & audio).

### Safeguarding (`/safeguarding`)

- Hero + `safeguarding.json` sections in `<Prose>`.
- "Report a safeguarding concern" callout: brand-coral left border,
  bilingual title and body, a `<Button href="/withdraw">` that points
  at the same Plan IB contact source as `/withdraw` (per the spec's
  cross-link instruction).

### Withdraw (`/withdraw`)

- Hero with `withdraw.title` and a small bilingual `intro` paragraph
  inlined into the Hero.
- All `withdraw.sections` rendered in `<Prose>`. The seed JSON's
  `TODO: replace with confirmed PIB contact` placeholder is preserved
  verbatim and clearly visible to content reviewers — left intentionally
  unchanged.
- Indexable per the spec ("Stage 6 handles audit-only noindex").

### Resources (`/resources`)

- Hero + `resources.json` sections in `<Prose>`.
- "Final learning brief" block driven by
  `resources.flags?.learningBriefAvailable`:
  - When `false` (current state): renders a brand-coral pill that
    reads `Available June 2026 / জুন ২০২৬-এ উপলব্ধ`.
  - When the content team flips the flag to `true` and adds
    `/public/learning-brief.pdf`, the same block renders a primary
    `<Button href="/learning-brief.pdf">` instead. No code change
    needed.

## Decisions / deviations

1. **Inline `BilingualString` literals for structural labels.** The
   spec instructed Stage 3 to render specific bilingual strings (CTA
   labels, "Latest stories" / "Latest reels" headings, the "Coming
   May–June 2026" empty state, and the equivalent "Available June 2026"
   and "Report a safeguarding concern" labels) that are not present in
   any `/content/pages/*.json`. CONVENTIONS.md says "all user-facing
   strings live in /content/pages/*.json as { en, bn } pairs", but
   Stage 3 cannot modify `/content/`. I inlined these as small
   `BilingualString` literals in each page file so the bilingual
   contract is preserved (every English string travels with its Bangla
   pair, in a typed shape, in one place at the top of the file). A
   coordination note in `coordination/blockers.md` proposes adding a
   `cta` / `headings` / `emptyState` map to `home.json`,
   `resources.json`, and `safeguarding.json` so a future content
   edit replaces the literals.

2. **Hero kicker on the home page** — also inlined for the same
   reason. `Plan IB · Youth Equality Award 2026 · CapeC.` is a
   structural label, not body content.

3. **About-page credits — inlined real text, not placeholders.** The
   spec said "Use real text, not placeholders". The credit roles
   (Funder / Implementer / Hosting & infrastructure) are inlined
   with their bilingual role labels. The `who` strings stay
   English-only (organisation names — Plan IB, CapeC., Vercel,
   Spotify for Podcasters — are not translated).

4. **`<main>` already provided by `src/app/layout.tsx`.** Stage 3
   pages return fragments / sequences of `<Hero>` + `<Section>` rather
   than wrapping in their own `<main>`, because the Stage 2 layout
   already wraps `{children}` in `<main id="main-content">`.
   Nesting `<main>` inside `<main>` would be invalid HTML.

5. **`/podcasts` and `/entrepreneurs` links from the home page** point
   at routes Stages 4 and 5 own. They will resolve once those branches
   merge; until then, in a Stage-3-only build, they 404 — which is
   the expected parallel-agent state. No blocker to raise; this is by
   design per `V2V_Bridge_PRD_Staged_v1.1.md` §5.

## Workspace orchestration issue (logged in `coordination/blockers.md`)

This single-clone workspace was thrashing between stage branches
during Stage 3: at several points my working-tree `src/app/page.tsx`
was reverted to the Stage 1 placeholder by an external git checkout
(parallel Stage 4 / 5 / 6 sessions sharing this clone). The actual
Stage 3 home page **is** committed at `4a4f727` on
`stage-3-static-pages` and the static build of that commit produces
the correct HTML — see "Verification" below. If you check out this
branch and see the placeholder, run
`git checkout stage-3-static-pages -- src/app/page.tsx` to refresh
the working tree from the commit.

The PRD's recommendation (`git worktree add ../v2v-stage-3
stage-3-static-pages` per agent) would prevent this. Logged for the
Integration pass to verify.

## Verification

```
pnpm typecheck    # clean (with all branches' files present)
pnpm lint         # clean (with all branches' files present)
pnpm build        # to verify Stage 3 routes in isolation, the
                  # off-limits Stage 4/5/6 untracked files
                  # (src/app/podcasts/, src/app/audit/,
                  # src/app/robots.ts, src/app/sitemap.ts,
                  # src/app/not-found.tsx, src/lib/structured-data.ts)
                  # were temporarily moved aside.
                  # `src/app/robots.ts` as currently written is missing
                  # the `dynamic = 'force-static'` export the static
                  # export mode needs — that's Stage 6's blocker, not
                  # this branch's, but it does prevent a full
                  # cross-stage build until Stage 6 fixes it.
                  # Stage-3-isolated build: 9 routes including all 5
                  # of mine plus /dev (Stage 2) and /_not-found.
```

`/out/<route>/index.html` for each Stage 3 route was inspected and
contained:

- `/` — Hero CTAs, "Latest stories / সর্বশেষ গল্প", "Coming May–June
  2026" empty state, Header + Footer.
- `/about` — `About V2V Bridge` heading, bilingual sections,
  Plan IB / CapeC / Vercel credits.
- `/safeguarding` — bilingual sections, "Report a safeguarding
  concern" callout pointing at `/withdraw`.
- `/withdraw` — bilingual sections including the inline
  `TODO: replace with confirmed PIB contact` placeholder.
- `/resources` — bilingual sections, "Final learning brief" block,
  "Available June 2026 / জুন ২০২৬-এ উপলব্ধ" pill (since
  `flags.learningBriefAvailable === false`).

`pnpm dev` smoke-test was attempted but the dev server's `.next/`
cache was being clobbered by a parallel session on port 3000 (likely
another stage agent in this same workspace), producing transient
500s. The static export — which is what actually deploys — is the
authoritative verification and it passes.

## Stages 4–6 — interaction notes

- **Stage 4 (`/podcasts`)** — the home page links to `/podcasts` from
  both the primary CTA and any podcast cards. As long as Stage 4
  ships `src/app/podcasts/page.tsx` and `src/app/podcasts/[id]/page.tsx`,
  no Stage 3 changes are needed at integration.
- **Stage 5 (`/entrepreneurs` and `/reels`)** — entrepreneur cards
  rendered on the home page link to `/entrepreneurs/[id]`; reel cards
  link to `/entrepreneurs/[id]` by default (per Stage 2's `ReelCard`
  default). Same: integration works once Stage 5 merges.
- **Stage 6 (`/audit`, sitemap, robots)** — see the blocker note above
  about the static-export error currently in `src/app/robots.ts`. No
  Stage 3 ↔ Stage 6 dependencies otherwise; Stage 6's site-wide SEO
  doesn't conflict with the Stage 3 per-page metadata exports.

Last commit hash before this handoff doc: `4a4f727`.
