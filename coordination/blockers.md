Cross-stage blockers parallel agents flag here.

## Open blockers

(none — see Resolved below)

## Resolved during integration

### B-001 — `generateStaticParams` returns empty under `output: "export"`
- Raised by: Stage 4 (Agent B), 2026-04-26
- Affected: Stage 4 (`/podcasts/[id]`), Stage 5 (`/entrepreneurs/[id]`)
- Status: resolved by in-stage workaround (no code change in integration)

`next.config.ts` sets `output: "export"`. Next 15 refuses to build a
`[id]` route whose `generateStaticParams()` returns `[]`. With every
seed record currently `published: false`, `getAllPublishedPodcasts()`
and the published-only entrepreneur loader both return `[]` in
production builds.

Both Stage 4 and Stage 5 land the same fix: `generateStaticParams`
enumerates all records (including unpublished) so the build succeeds,
and the page itself calls `notFound()` for any record with
`published !== true`. The emitted HTML at unpublished IDs is the
project 404, so the safeguarding gate is preserved end-to-end.

This is fine for launch. When at least one entrepreneur and one
podcast flip to `published: true`, the workaround keeps working
unchanged — published IDs render real content, unpublished IDs keep
emitting 404. A future cleanup can drop the unpublished branch from
`generateStaticParams` once seed-only content is gone, but it is not
required.

## Stage 3 historical notes

* **Workspace was thrashing between stage branches** during Stage 3 work:
  page.tsx in the working tree was reverted to the Stage 1 placeholder
  multiple times by external orchestration (branch checkouts triggered
  by parallel Stage 4 / Stage 5 / Stage 6 sessions sharing this clone).
  The actual Stage 3 home page is committed on `stage-3-static-pages`
  (commit `4a4f727`) and is now merged into `integration-v1`. Future
  multi-stage work should use one `git worktree` per agent (Stage 6
  did this and avoided the issue entirely).

* **Structural labels not in /content/pages/*.json.** Several small
  bilingual strings the spec asks Stage 3 to render are not present in
  the JSON copy: the home-page CTAs ("Listen to the stories", "About
  the project"), the section headings ("Latest stories", "Latest
  reels"), the "Coming May–June 2026" empty state, and equivalents on
  /resources ("Available June 2026") and /safeguarding ("Report a
  safeguarding concern"). They are inlined as `BilingualString`
  literals in the Stage 3 page files — the bilingual contract is
  preserved, but CONVENTIONS.md says "all user-facing strings live in
  /content/pages/*.json". A future content edit should add a
  `cta` / `headings` map to home.json, resources.json, and
  safeguarding.json, then Stage 3 replaces the inline literals with
  `home.cta.listen` etc. Not blocking launch.
