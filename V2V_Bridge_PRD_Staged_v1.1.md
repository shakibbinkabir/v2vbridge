# V2V Bridge Project Hub — Staged Technical PRD v1.1

> Companion to `V2V_Bridge_PRD_v1.0.docx` (the full functional PRD). This file specifies **how** the build is divided into stages, which run sequentially, which run in parallel, and how to keep parallel agents from stepping on each other.

---

## 1. Build philosophy

The hub is a static site. Static sites parallelize cleanly along page routes — two agents working on `/podcasts` and `/entrepreneurs` never touch each other's files. The constraint is shared infrastructure: types, primitives, content schema, fonts, theme tokens. If those aren't locked in before agents fan out, you get four agents inventing four different `Card` components and four different `BilingualText` patterns.

So the staging is:

1. **Stages 1 and 2 are sequential and blocking.** They create everything that is shared. Nothing else can start until they're done.
2. **Stages 3, 4, 5, 6 run in parallel** on four separate git branches. Each owns a disjoint set of directories. They consume — never modify — what Stage 2 produced.
3. **A short integration pass** after the four parallel branches merge.

```
Stage 1 (Foundation)  ──►  Stage 2 (Core System)  ──┬──►  Stage 3 (Static Pages)        ──┐
                                                    ├──►  Stage 4 (Podcast Surface)     ──┤
                                                    ├──►  Stage 5 (People Surface)      ──┼──► Integration
                                                    └──►  Stage 6 (Compliance & Polish) ──┘
                                                                                                 │
                                                                                                 ▼
                                                                                              Live
```

---

## 2. Locked-in tech stack

These are not up for debate during stage builds. Agents must use exactly these:

| Layer | Choice | Rationale |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Static export, file-based routing, Vercel-native |
| Language | **TypeScript (strict)** | Catches contract violations across parallel work |
| Build mode | **Static export** (`output: 'export'`) | No server, ultra-cheap, fits free Vercel tier |
| Styling | **Tailwind CSS v4** | Utility-first, no shared CSS files for agents to fight over |
| Fonts | **Hind Siliguri** (Bangla) + **Inter** (English), both via `next/font/google` | CapeC. standard set on Boithok Khana |
| Smooth scroll | Native CSS `scroll-behavior: smooth` | CapeC. standard — do NOT add Lenis |
| SkipLink | None | CapeC. standard — do NOT add |
| Content store | JSON files in `/content/` validated by Zod schemas | No CMS, no DB, editable via GitHub web UI by non-devs |
| Audio | Spotify for Podcasters embed | Free, distributes everywhere, no bandwidth cost on us |
| Reels | Native social embeds (IG, TikTok, FB) | Platform handles bandwidth, captions, moderation |
| Hosting | Vercel Hobby (free) | Already in use for Boithok Khana |
| Source control | GitHub private repo under CapeC. org | Audit trail per content publication |
| Package manager | **pnpm** (fall back to npm if unavailable) | Faster, deterministic |
| Node version | **20 LTS** | Vercel default |

**Brand tokens** (all stages must reference these via Tailwind config — no hardcoded hex):

```
--brand-teal:   #0F4C5C  (primary)
--brand-coral:  #E76F51  (accent)
--brand-cream:  #F4F1ED  (page neutral)
--brand-ink:    #1A1A1A  (body text)
--brand-mute:   #555555  (muted text)
--brand-rule:   #D0D0D0  (borders)
```

---

## 3. Directory ownership map

This is the most important table in this document. **Agents must not write outside their assigned columns.** If a parallel agent finds it needs to modify a Stage 2 primitive, it stops and reports back rather than editing.

| Path | Owner | Notes |
|---|---|---|
| `package.json`, `pnpm-lock.yaml` | Stage 1 | Locked after Stage 2; parallel stages must not add deps without flagging |
| `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `postcss.config.mjs` | Stage 1 | Locked after Stage 2 |
| `src/app/globals.css` | Stage 1 | Locked after Stage 2 |
| `src/app/layout.tsx` | Stage 2 | Locked after Stage 2 |
| `src/components/layout/*` (Header, Footer, Container, Section) | Stage 2 | Locked |
| `src/components/ui/*` (Button, Card, BilingualText, Hero, Tag, Prose) | Stage 2 | Locked |
| `src/components/embeds/*` (SpotifyEmbed, IGEmbed, TikTokEmbed, FBEmbed) | Stage 2 | Locked |
| `src/components/content/*` (PodcastCard, EntrepreneurCard, ReelCard) | Stage 2 | Locked |
| `src/lib/types.ts` | Stage 2 | Locked |
| `src/lib/content.ts` (loaders) | Stage 2 | Locked |
| `src/lib/schemas.ts` (Zod) | Stage 2 | Locked |
| `content/entrepreneurs/*.json` | Stage 2 (seed); content team after launch | Stages 3-6 read only |
| `content/podcasts/*.json` | Stage 2 (seed); content team after launch | Stages 3-6 read only |
| `content/reels/*.json` | Stage 2 (seed); content team after launch | Stages 3-6 read only |
| `content/pages/*.json` (page copy in Bangla + English) | Stage 2 (seed); editor after launch | Stages 3-6 read only |
| `src/app/page.tsx` (Home) | **Stage 3** | |
| `src/app/about/page.tsx` | **Stage 3** | |
| `src/app/safeguarding/page.tsx` | **Stage 3** | |
| `src/app/withdraw/page.tsx` | **Stage 3** | |
| `src/app/resources/page.tsx` | **Stage 3** | |
| `src/app/podcasts/page.tsx` | **Stage 4** | |
| `src/app/podcasts/[id]/page.tsx` | **Stage 4** | |
| `src/app/entrepreneurs/page.tsx` | **Stage 5** | |
| `src/app/entrepreneurs/[id]/page.tsx` | **Stage 5** | |
| `src/app/reels/page.tsx` | **Stage 5** | |
| `src/app/audit/page.tsx` | **Stage 6** | |
| `src/app/sitemap.ts` | **Stage 6** | |
| `src/app/robots.ts` | **Stage 6** | |
| `src/app/not-found.tsx` | **Stage 6** | |
| `public/og/<stage-name>.png` | Each stage owns its own OG image folder | No collisions |

**Cross-cutting concern:** every page file owns its own `export const metadata` (page title + description). Stage 6 only handles site-wide SEO (sitemap, robots, structured data, OG defaults).

---

## 4. Stage definitions

### Stage 1 — Foundation (sequential, primary dependency)

**Goal:** A working `pnpm dev` and `pnpm build` on a clean Next.js 15 + TS + Tailwind v4 project, with brand tokens, fonts, deploy config, and an empty homepage that renders the project name in both languages on the brand background.

**Deliverables:**
- `package.json` with exact dep versions pinned
- `next.config.ts` with `output: 'export'` and `images: { unoptimized: true }`
- `tsconfig.json` (strict)
- `tailwind.config.ts` with brand tokens and font families wired up
- `postcss.config.mjs`
- `src/app/globals.css` with CSS custom properties for brand tokens, `scroll-behavior: smooth` on `html`, base typography
- `src/app/layout.tsx` (minimal — Stage 2 fleshes it out)
- `src/app/page.tsx` (placeholder — Stage 3 replaces it)
- `public/logo-placeholder.svg` (simple stylized "V2V" mark — replaced with real logo before deploy)
- `public/favicon.ico`
- `vercel.json` (if needed) and `.gitignore`
- `README.md` with run instructions

**Acceptance:** `pnpm install && pnpm build && pnpm start` runs without errors. Homepage shows "V2V Bridge / ভয়েস টু ভেঞ্চার ব্রিজ" on a cream background with teal heading.

---

### Stage 2 — Core System (sequential, primary dependency)

**Goal:** Every primitive, type, schema, loader, embed component, and content card that Stages 3-6 will consume. Plus seed content so the parallel stages have something to render.

**Deliverables:**

*Layout primitives*
- `src/components/layout/Header.tsx` — site nav with all 6 public routes, mobile burger menu
- `src/components/layout/Footer.tsx` — Plan IB credit, CapeC. credit, withdrawal link, safeguarding link, last-updated date
- `src/components/layout/Container.tsx` — max-width wrapper
- `src/components/layout/Section.tsx` — section spacing helper

*UI primitives*
- `src/components/ui/Button.tsx` — primary, secondary, link variants
- `src/components/ui/Card.tsx` — base card with hover state
- `src/components/ui/BilingualText.tsx` — renders an `{en, bn}` pair, with language labels for screen readers
- `src/components/ui/Hero.tsx` — page hero block with optional image
- `src/components/ui/Tag.tsx` — sector / district pill
- `src/components/ui/Prose.tsx` — typography wrapper for long-form content

*Embeds*
- `src/components/embeds/SpotifyEmbed.tsx` — iframe wrapper for Spotify episode
- `src/components/embeds/InstagramEmbed.tsx` — IG post embed
- `src/components/embeds/TikTokEmbed.tsx` — TikTok post embed
- `src/components/embeds/FacebookEmbed.tsx` — FB post embed

*Content cards*
- `src/components/content/PodcastCard.tsx`
- `src/components/content/EntrepreneurCard.tsx`
- `src/components/content/ReelCard.tsx`

*Types & loaders*
- `src/lib/types.ts` — TypeScript interfaces for `Entrepreneur`, `PodcastEpisode`, `Reel`, `PageCopy`, `BilingualString`
- `src/lib/schemas.ts` — Zod schemas for runtime validation
- `src/lib/content.ts` — `getAllEntrepreneurs()`, `getEntrepreneur(id)`, `getAllPublishedPodcasts()`, etc. — all read-time, file-based, Zod-validated
- `src/lib/format.ts` — date helpers, locale-aware number formatting

*Layout integration*
- Update `src/app/layout.tsx` to wrap all pages in Header + Footer

*Seed content* (5 entrepreneurs, 3 podcasts, 6 reels — all flagged `published: false` so they don't render publicly until real content replaces them; Stages 3-6 set a build-time flag to render them in dev)
- `content/entrepreneurs/sample-001.json` through `sample-005.json`
- `content/podcasts/sample-ep01.json` through `sample-ep03.json`
- `content/reels/sample-r01.json` through `sample-r06.json`
- `content/pages/about.json`, `safeguarding.json`, `withdraw.json`, `resources.json`, `home.json` (Bangla + English copy for static pages)

**Acceptance:**
- `pnpm build` succeeds; `pnpm typecheck` clean
- Storybook is **not** required (out of scope)
- A test page (`src/app/_dev/page.tsx`, gitignored if possible) renders one of each card to verify they render correctly. Delete this before merge.

---

### Stages 3–6 — Parallel work

All four stages branch from `main` after Stage 2 merges. Each runs on its own branch. Each PRs back into `main` independently.

#### Stage 3 — Static Pages (Agent A)

**Owns:** Home, About, Safeguarding, Withdraw, Resources

**Goal:** Five static pages, all reading copy from `content/pages/*.json`, all rendering bilingual content via `<BilingualText>`, all with their own `metadata` exports.

**Acceptance:** All 5 pages render at correct routes with no hydration warnings, build succeeds, Lighthouse Performance ≥85 on each.

#### Stage 4 — Podcast Surface (Agent B)

**Owns:** Podcast index and detail pages

**Goal:** `/podcasts` lists all `published: true` episodes with `<PodcastCard>`. `/podcasts/[id]` renders the embedded Spotify player, episode summary in both languages, and a link to the entrepreneur profile.

**Routing constraint:** `[id]` page must use `generateStaticParams` to pre-render every published episode at build.

**Acceptance:** All published episodes render at predictable URLs. 404 returns for unpublished episodes (non-published entries are not in `generateStaticParams`).

#### Stage 5 — People Surface (Agent C)

**Owns:** Entrepreneurs index, entrepreneur detail, reels gallery

**Goal:** `/entrepreneurs` and `/entrepreneurs/[id]` (with cross-links to podcasts and reels). `/reels` shows all published reels in a responsive grid.

**Routing constraint:** Same `generateStaticParams` pattern as Stage 4.

**Photo gating:** `<EntrepreneurCard>` and detail page must respect the `photoConsent` flag on the entrepreneur record. If false, show a default sector icon, not a face.

**Acceptance:** Entrepreneur detail pages link both to their podcast (if any) and to their reels (if any). Reels gallery shows correct platform badge per item.

#### Stage 6 — Compliance & Polish (Agent D)

**Owns:** `/audit`, sitemap, robots, 404 page, accessibility/Lighthouse polish, structured data

**Tasks:**
- `/audit` page lists every published item with publish date, reviewer 1, reviewer 2, project lead signoff, and consent form filename. Sets `noindex` via metadata.
- `src/app/sitemap.ts` generates a complete sitemap from all published content
- `src/app/robots.ts` allows all bots except on `/audit`
- `src/app/not-found.tsx` — branded 404
- Add JSON-LD structured data: `Organization` site-wide, `PodcastSeries` on `/podcasts`, `PodcastEpisode` on each detail
- Add OG default image to root layout metadata
- Run Lighthouse against all routes; fix anything below 85 Performance, 95 Accessibility
- Add `aria-label` audit pass on all interactive elements

**Acceptance:** Lighthouse scores meet targets; sitemap.xml resolves; robots.txt resolves; `/audit` returns `noindex` header; structured data validates against schema.org validator.

---

## 5. Coordination protocol

### Branching

```
main
├── stage-1-foundation         (sequential)
├── stage-2-core-system        (sequential, branched from stage-1 merged main)
├── stage-3-static-pages       (parallel, branched from stage-2 merged main)
├── stage-4-podcast-surface    (parallel, branched from stage-2 merged main)
├── stage-5-people-surface     (parallel, branched from stage-2 merged main)
└── stage-6-compliance-polish  (parallel, branched from stage-2 merged main)
```

### Merge order after parallel work
1. Stage 3 first (smallest surface, lowest conflict risk)
2. Stage 4
3. Stage 5
4. Stage 6 (touches sitemap which depends on what published items exist — merge last so it sees everything)

### Conflict-handling rule for parallel agents
> If you (parallel agent) need to modify a file you do not own per the directory ownership map, **stop and write a short note** in `coordination/blockers.md` explaining what you need and why. Do not modify it. The user resolves blockers between stages.

### Per-stage handoff checklist
Each stage must produce, on its branch:
- Working `pnpm build`
- Working `pnpm typecheck`
- A `STAGE-N-DONE.md` file at repo root with: what was done, what was skipped and why, anything the next stage needs to know
- A clean git history (squash if necessary before PR)

---

## 6. Open decisions still pending (from the docx PRD)

These do not block Stage 1 or 2 but must be answered before Stage 3 finishes:

| # | Decision | Owner | Needed by |
|---|---|---|---|
| 1 | Domain — `.org` vs `.com.bd` | Manager + Project Lead | Before Stage 6 deploy |
| 2 | Plan IB Bangladesh contact for consent withdrawal (replace global form's PH contact) | Project Lead | Before Stage 3 finishes (`/withdraw` content) |
| 3 | First names vs pseudonyms vs contributor's choice | YSC + Project Lead | Before real content production starts (19 May) |
| 4 | Photo-use opt-in vs opt-out default | Project Lead | Before consent forms are reissued |
| 5 | Plan IB sign-off on PRD itself | Project Lead | Before Stage 1 starts |

---

## 7. Definition of "live"

The site is live when:
- All 6 routes from the public sitemap return 200 with real content (not placeholders)
- Lighthouse mobile Performance ≥85 across all routes
- Lighthouse Accessibility ≥95 across all routes
- All featured entrepreneurs have signed `Media Consent Form` PDFs in Drive `/Consent/`
- The `/audit` page reflects the live state for Plan IB
- The site's withdrawal page names a real Bangladesh contact (not the global form's default)
- Stage 6 has merged and final smoke test passes

Target live date: **15 May 2026** (skeleton with empty indices labelled "Coming May–June 2026")
Full content live: **rolling, completing 30 June 2026**

---

*End of staged technical PRD v1.1*
