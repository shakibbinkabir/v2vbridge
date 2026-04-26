# Stage 5 — People Surface — Done

Branch: `stage-5-people-surface`
Build commits:
- `daccfb1` (stage-5: build people surface - entrepreneurs index, detail, reels gallery)
- `6d8bf76` (stage-5: include unpublished entrepreneurs in generateStaticParams)

This handoff doc is the next commit on the branch.

## Definition of Done — checked

- [x] `/entrepreneurs`, `/entrepreneurs/[id]`, and `/reels` all render real
      seed content during `pnpm dev`. All four routes return HTTP 200 and
      include the expected bilingual copy and cross-links.
- [x] Photo gating verified end-to-end: `sample-001` (photoConsent: true)
      renders `<Image>` with the SVG portrait; `sample-002`
      (photoConsent: false) renders the `SectorIcon` SVG with the
      `aria-label` "fish drying sector icon (no portrait shown)". No face
      ever falls back to a generic stock photo.
- [x] Cross-links work both directions: detail page → `/podcasts/sample-ep01`
      (when the linked podcast exists) and → each linked reel via embedded
      `<InstagramEmbed>` / `<TikTokEmbed>` / `<FacebookEmbed>` per
      `reel.platform`. Reels gallery → entrepreneur (default `linkTo`),
      with the small platform badge in the corner of every `ReelCard`.
- [x] `pnpm typecheck`, `pnpm lint`, and `pnpm build` all clean in an
      isolated worktree. Build emits 5 SSG entrepreneur detail pages
      (`sample-001` … `sample-005`) plus the index and reels gallery.
- [x] `STAGE-5-DONE.md` committed (this commit).

## Files added (the entire stage)

```
src/app/entrepreneurs/page.tsx          # index — flat grid of EntrepreneurCard
src/app/entrepreneurs/[id]/page.tsx     # detail — hero, podcast embed, reels grid, About cross-link
src/app/reels/page.tsx                  # gallery — CSS-columns masonry of ReelCard
STAGE-5-DONE.md                         # this file
```

No new dependencies. No changes to Stage 1 foundation files, Stage 2
primitives/loaders/types, or seed content. No edits outside `src/app/`.

`public/og/entrepreneurs.png` and `public/og/reels.png` were optional in
the prompt and are deferred. Both pages reference these paths in their
`metadata.openGraph.images` so Stage 6's per-page OG generator (or a
future asset script run) can drop the files in without code changes.

## Page-by-page notes

### `/entrepreneurs/page.tsx`

- Hero with bilingual title + kicker + intro.
- Grid: `sm:grid-cols-2 lg:grid-cols-3`, semantic `<ul>`/`<li>` so screen
  readers announce the count.
- Sort order: `publishedAt desc`, with rows lacking `publishedAt` falling
  to `id asc` (the prompt's tiebreaker). Records with `publishedAt` always
  precede records without — that way real launches don't get pushed below
  pre-launch placeholders once content publishes.
- Empty state copy is inline (not loaded from `content/pages/*.json`)
  because Stage 2 did not seed an `entrepreneurs.json` page-copy file and
  Stage 5 may not extend `content/`.
- Filter UI explicitly out of scope — flat grid only.

### `/entrepreneurs/[id]/page.tsx`

- Hero is a 2-column `Container` grid (image left, headline + tags +
  bilingual summary right).
- Photo: `<Image>` only when `entrepreneur.photoConsent === true && entrepreneur.photo`.
  Otherwise a `<SectorIcon>` (`brand-coral` glyph on `brand-cream`)
  scaled to ~14rem inside a rounded card. The check duplicates the rule
  enforced inside `EntrepreneurCard` per the prompt's "re-verify it for
  the detail page hero" requirement.
- Bilingual summary uses `<Prose>` for typography. English `<p>` first,
  then a Bangla `<p>` with `font-bangla text-brand-mute`. (Two `<p>`
  tags rather than `BilingualText` so each language reads as a full
  paragraph in screen readers.)
- "Listen to her story" section appears whenever `podcastId` is set on
  the entrepreneur record. If the linked podcast is published (or in dev)
  it renders `<SpotifyEmbed>` plus a "Open the full episode page →" link
  to `/podcasts/[id]`. If it isn't, the bilingual "Story coming soon /
  শীঘ্রই আসছে" placeholder shows. If the entrepreneur has no `podcastId`
  at all, the entire section is omitted.
- "Watch the reels" section uses `getReelsByEntrepreneur(id)` and a
  2-column grid of inline embeds picked by `reel.platform`. Section is
  hidden entirely (no heading, no chrome) when zero reels exist, per
  the prompt.
- Closing block: short About-V2V-Bridge pitch with a link to `/about`
  (the page Stage 3 owns).
- Page metadata uses `generateMetadata` so each entrepreneur gets a
  unique `<title>` and a 160-char-truncated description from the English
  summary.

### `/reels/page.tsx`

- Hero + masonry-ish grid via CSS multi-column (`columns-1 sm:columns-2 lg:columns-3`)
  with `break-inside-avoid` per item, so each `ReelCard` stays intact
  but variable caption lengths give the gallery a natural masonry feel.
  No masonry library needed.
- Each card uses `<ReelCard reel={reel} linkTo="entrepreneur" />`, so
  the click target is `/entrepreneurs/[entrepreneurId]`. The platform
  link survives as the small `Open on …` row at the bottom of each card
  and as the platform badge in the upper-right corner of the visual
  block — both are part of the Stage 2 `ReelCard` and were not modified.
- Empty state is the same flat bilingual notice pattern used on the
  index.

## Decisions you should know about

1. **`generateStaticParams` includes unpublished entrepreneurs.**
   Next.js 15 `output: 'export'` rejects an empty result from
   `generateStaticParams` with the error
   *"Page '/entrepreneurs/[id]' is missing 'generateStaticParams()'"*.
   At build time today, every seed entrepreneur has `published: false`,
   so a strict "published only" filter would emit zero params and break
   the build. The fix: enumerate all entrepreneurs in
   `generateStaticParams`, then `notFound()` inside the page when the
   record is unpublished and we are not in dev (matching Stage 2's
   `devFallback` philosophy from `src/lib/content.ts`). The result:
   - In production, `/entrepreneurs/sample-XXX/index.html` for an
     unpublished record is the 404 HTML — accessible URL, but content
     is gated. As records flip to `published: true`, the next build
     outputs real story HTML at the same path with no router changes.
   - In `pnpm dev`, the dev fallback path lets the page render so that
     Stage 5's pages can be visually verified against the seed content.

   **Stage 4 will hit this exact issue** with `/podcasts/[id]` —
   `getAllPublishedPodcasts()` returns `[]` in production. The same
   pattern (enumerate all, notFound() in production for unpublished)
   should resolve it. I noticed Stage 4's `podcasts/[id]/page.tsx` was
   in flight in the shared working tree but has not yet been verified
   against `pnpm build`; flagging it here so integration catches it.

2. **`isDev` constant is module-scoped.** Reading `process.env.NODE_ENV`
   once at module load is fine because Next.js builds with the env baked
   in; there is no per-request env we need to revalidate. This mirrors
   how `src/lib/content.ts` reads `isDev`.

3. **Detail page is `async` + `await params`.** Next.js 15 typed
   `params` as a `Promise` for App-Router server components. The
   `Params = Promise<{ id: string }>` alias and `await params` pattern
   keep the type narrowed without adding a runtime cost (the build's
   "Generating static pages" step resolves them up front).

4. **Reels detail-section uses `<InstagramEmbed>` / `<TikTokEmbed>` /
   `<FacebookEmbed>` directly**, not `ReelCard`. The prompt asked for
   the embeds inline on the detail page (a deeper engagement context),
   while the gallery uses the card. A small dispatch helper
   (`ReelEmbed`) switches on `reel.platform` so the page body stays
   readable.

5. **Hero uses raw `<section>` + `Container`** rather than the Stage 2
   `Hero` primitive. The `Hero` primitive is single-column and centred
   around a `BilingualText` headline; the entrepreneur detail page
   needs a 2-column layout (portrait + headline+tags+summary) and the
   `displayName` is a single-language proper noun, not a bilingual
   phrase. Using the primitive would have required either contorting
   it or extending it — both off-limits for a parallel stage.

6. **No edits to Stage 2 components.** Photo gating, sector icon
   rendering, reel card layout, and embed loading were all already
   correct in Stage 2's components. The detail page re-applies the
   `photoConsent && photo` check in its hero only because the prompt
   explicitly required re-verification at that surface.

## Safeguarding enforcement — checked

- No identifiable face renders without `photoConsent: true`. Verified
  by HTML inspection of `/entrepreneurs/sample-001/` (consent yes,
  shows `<Image>` with `Portrait of Rina`) vs `/entrepreneurs/sample-002/`
  (consent no, shows `<svg role="img" aria-label="fish drying sector
  icon (no portrait shown)">`).
- No personal contact, no location below district. The detail page only
  surfaces `displayName`, `sector`, and `district` (Satkhira) from each
  record; other fields (consent form filename, reviewers, etc.) are not
  rendered on this stage's surfaces.
- No follow/subscribe widgets, no comment threads, no follower counts.
  The Stage 2 embed components (`InstagramEmbed`, `TikTokEmbed`,
  `FacebookEmbed`) load the official platform `embed.js` scripts which
  render the platforms' standard post embeds — those embeds already do
  not surface profile UI, comment input, or follower stats. No blocker
  raised.
- No minor's face or name. Stage 5 surfaces only entrepreneur records
  loaded via `getAllEntrepreneurs()`, which read from
  `content/entrepreneurs/*.json`. Adolescent participants never have
  records under that directory; they appear collectively as the
  "Youth Steering Committee" only on `/about` (Stage 3's responsibility).

## Coordination notes for integration

- The shared working tree was extremely active during this stage — at
  multiple points another parallel agent (Stage 3, 4, or 6) ran
  `git checkout` or `git stash`, swapping files out from under in-flight
  operations. To verify `pnpm build` cleanly I created
  `git worktree add /tmp/v2v-build stage-5-build-verify` (a sibling
  branch ref pointing at the stage-5 commit) and ran the build there in
  isolation. The worktree and the temporary `stage-5-build-verify`
  branch are both safe to delete during integration:
  ```
  git worktree remove /tmp/v2v-build
  git branch -D stage-5-build-verify
  ```
  Stage 5's published commits live on `stage-5-people-surface` only.

- I did not write to `coordination/blockers.md` because Stage 5 raised
  no inter-stage blockers — every issue was either inside my own
  directory ownership or worked around in this handoff. The Stage 4
  `generateStaticParams` empty-array problem is flagged here in the
  decisions section above (item 1) rather than as a blocker.

## Verification recap

```
# In an isolated worktree on the stage-5 commit:
cd /tmp/v2v-build

pnpm install        # 318 packages
pnpm typecheck      # 0 errors
pnpm lint           # 0 issues
pnpm build          # 12 static pages, including:
                    #   /entrepreneurs/sample-001 .. /sample-005
                    #   /entrepreneurs/
                    #   /reels/
pnpm dev            # localhost:3002:
                    #   GET /                          → 200
                    #   GET /entrepreneurs/            → 200
                    #   GET /entrepreneurs/sample-001/ → 200
                    #   GET /reels/                    → 200
                    #   sample-001 hero: <Image src="/sample-photos/sample-001.svg">
                    #   sample-002 hero: <SectorIcon aria-label="… (no portrait shown)">
                    #   sample-001 detail: link to /podcasts/sample-ep01,
                    #                      "Listen to her story", "Watch the reels",
                    #                      both reel IDs (sample-r01, sample-r02)
                    #   /reels: links to all 5 entrepreneurs
```

Last commit hash before this handoff doc: `6d8bf76`.
