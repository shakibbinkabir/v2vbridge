# Stage 4 — Podcast Surface — Done

Branch: `stage-4-podcast-surface`
Branched from: `stage-2-core-system` @ `dd8fc3f`

## What was built

Two routes that consume Stage 2 primitives and the published-podcasts
loader. Nothing in Stage 2 was modified.

```
src/app/podcasts/page.tsx          # index — Hero + responsive PodcastCard grid
src/app/podcasts/[id]/page.tsx     # detail — Spotify player, bilingual title +
                                   # summary, featured entrepreneur, related reels
coordination/blockers.md           # raised B-001 (see below)
```

`public/og/podcasts.png` was deferred — Stage 6's site-wide OG default
already sits in `public/og-default.png` and is wired into the root
layout. A podcast-specific OG can ship later without touching Stage 4.

### Verification (in an isolated `git worktree` at `../v2v-stage4`)

```
pnpm typecheck    # 0 errors
pnpm build        # 9 routes — / · /_not-found · /dev · /podcasts · /podcasts/[id]
                  #   /podcasts/sample-ep01
                  #   /podcasts/sample-ep02
                  #   /podcasts/sample-ep03
```

`out/podcasts/index.html` (26 KB) renders the empty-state copy
("Episodes publishing May–June 2026 / এপিসোডগুলি মে–জুন ২০২৬-এ প্রকাশ
হবে") because every seed record is `published: false`.
`out/podcasts/sample-ep0*/index.html` each renders the framework's 404
content with the page-level title "Episode not found | V2V Bridge",
because each detail page calls `notFound()` for any record that is not
`published === true`. Once any podcast flips to `published: true`, that
URL will render the real player + bilingual content + cross-links.

`pnpm dev` was **not** smoke-tested visually for this stage — concurrent
parallel agents kept rewriting the shared working tree, so visual QA
needs to happen after merge into `main`. Code paths are covered by
typecheck + build.

## Decisions worth flagging

1. **`generateStaticParams` has a fallback to `_getAllPodcastsRaw()`**
   when `getAllPublishedPodcasts()` returns `[]`. This is needed because
   `output: "export"` refuses an empty params list on a `[id]` route.
   The page itself still calls `notFound()` for every unpublished
   record, so the safeguarding gate stays intact at render time —
   unpublished IDs emit the not-found page, not the episode content.
   See `coordination/blockers.md` **B-001** for the proper fix
   (Stage 2 maintainers' call). When B-001 is resolved, the fallback
   line in `src/app/podcasts/[id]/page.tsx` can be deleted and the
   import of `_getAllPodcastsRaw` along with it.

2. **Bangla numerals via Stage 2's `formatBanglaNumber`.** Stage 2
   already shipped `formatBanglaNumber(n)` in `src/lib/format.ts`
   (their handoff explicitly notes it was added "for Stage 4's
   'এপিসোড {n}' use-case"). I used it directly — no Stage-4-local
   helper was added, since duplicating the wrapper would just create
   drift.

3. **`getAllPublishedPodcasts()` already sorts by `episodeNumber`
   descending** (per the Stage 2 loader). Per the prompt's "if loaders
   sort already, do not re-sort", the index page does not re-sort.

4. **Featured-entrepreneur sidebar** uses `<EntrepreneurCard>` only when
   `entrepreneur.published === true`; otherwise it renders a plain
   `<Card>` with just `displayName` and a "Profile not yet published"
   note (no link). This matches the prompt: "If the entrepreneur is
   unpublished, show display name only, no link." With current seed,
   every featured entrepreneur is unpublished, so every detail page
   would render the unlinked card variant once the podcast itself is
   published.

5. **Related reels** call `getReelsByEntrepreneur(podcast.entrepreneurId)`
   (which already filters by `published`) and `.slice(0, 4)`. The reels
   section is omitted entirely when zero match — no empty heading.

6. **Detail-page metadata** follows the prompt verbatim:
   - `title: ${p.title.en} | V2V Bridge Podcast`
   - `description: ${p.summary.en.slice(0, 160)}…`
   For unpublished records, `generateMetadata` returns
   `{ title: "Episode not found" }` so the rendered 404 carries a
   sensible page title rather than the layout's default.

7. **Index-page metadata.** `title: "Podcasts"` relies on the root
   layout's title template (`%s | V2V Bridge`), so the rendered title
   resolves to "Podcasts | V2V Bridge" without me hardcoding it.

8. **No new dependencies.** Pure consumption of Stage 1 + Stage 2.

## Coordination notes

- I worked from a `git worktree` at `../v2v-stage4` because the shared
  main working tree at `C:\Users\shaki\Desktop\v2v\` was being mutated
  by the parallel Stage 3 / Stage 5 / Stage 6 agents (uncommitted files
  for their own routes appeared and disappeared while I was building).
  My commits land on `stage-4-podcast-surface` cleanly. The worktree
  itself can be removed with `git worktree remove ../v2v-stage4` once
  this branch is merged.

- B-001 in `coordination/blockers.md` affects Stage 5 the same way
  (`/entrepreneurs/[id]` will hit the same `output: "export"` empty
  `generateStaticParams` failure). Stage 5 may want to apply the same
  `_getAllEntrepreneursRaw` fallback pattern, *or* wait for the proper
  fix — but if Stage 5 raises a separate copy of the blocker, please
  consolidate.

- Stage 6 owns sitemap + structured data. Once published podcasts
  exist, Stage 6's `sitemap.ts` should pick up `/podcasts/[id]` via
  the same `getAllPublishedPodcasts()` loader, and PodcastEpisode
  JSON-LD on the detail page is Stage 6's task per the PRD.

## Definition of Done — checked

- [x] Index renders all published episodes (currently 0 → empty state
      shows correctly; will populate once content publishes)
- [x] Each detail page is statically generated; SpotifyEmbed +
      bilingual content + cross-links wired in
- [x] `pnpm typecheck` clean
- [x] `pnpm build` succeeds and produces
      `out/podcasts/sample-ep01/index.html` (and `ep02`, `ep03`) for
      each episode — currently emitting the 404 page until the seed
      flag flips
- [x] `STAGE-4-DONE.md` committed (this file)
- [x] B-001 raised in `coordination/blockers.md`
