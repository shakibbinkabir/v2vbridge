# V2V Bridge

V2V Bridge (Voice to Venture Bridge) is a 3-month youth-led storytelling
project under Plan International Bangladesh's Youth Equality Award 2026,
implemented by CapeC. Consulting in Satkhira and Dhaka. The site is a
curated public showcase of women entrepreneurs' podcasts, reels, and
profiles, with a Plan IB audit surface for monitoring.

**Status:** all six build stages complete and merged to
`integration-v1`. See [`INTEGRATION-DONE.md`](./INTEGRATION-DONE.md)
for the integration report and [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md)
for the remaining business-team items before public launch.

## Run locally

```
pnpm install
pnpm dev          # localhost:3000
pnpm build        # static export to /out
pnpm typecheck
pnpm lint
```

Falls back to `npm` if `pnpm` is unavailable. Node 20 LTS recommended;
Node 24 also works for local dev.

## Stack

- Next.js 15 (App Router, `output: "export"` static build)
- TypeScript strict, `noUncheckedIndexedAccess`
- Tailwind CSS v4 with brand tokens via `@theme`
- Hind Siliguri (Bangla) + Inter (English) via `next/font/google`
- Native CSS smooth scroll — no Lenis
- File-based content in `/content/`, validated with Zod
- Spotify embed for podcasts; Instagram / TikTok / Facebook for reels
- Hosted on Vercel (static export, free tier)

Brand tokens are defined once in `src/app/globals.css` and surface as
both CSS custom properties and Tailwind utilities (`bg-brand-teal`,
`text-brand-coral`, `font-bangla`, `font-sans`).

## Routes

| Route | Owner stage | Notes |
|---|---|---|
| `/` | 3 | Bilingual hero, latest stories, latest reels |
| `/about` | 3 | Project, partners, team |
| `/safeguarding` | 3 | Safeguarding policy + cross-link to /withdraw |
| `/withdraw` | 3 | Plan IB contact placeholder — see launch checklist |
| `/resources` | 3 | Final learning brief slot, gated by content flag |
| `/podcasts` | 4 | Index of published episodes |
| `/podcasts/[id]` | 4 | Spotify player + featured entrepreneur + related reels |
| `/entrepreneurs` | 5 | Index of published profiles |
| `/entrepreneurs/[id]` | 5 | Detail with photo gating, podcast embed, reels |
| `/reels` | 5 | Cross-platform masonry |
| `/audit` | 6 | Plan IB compliance table (`noindex`) |
| `/audit/log.json` | 6 | Machine-readable audit log |
| `/sitemap.xml` | 6 | Auto-generated from published content |
| `/robots.txt` | 6 | Disallows /audit, /dev, /_dev |
| `*` (any 404) | 6 | Branded bilingual not-found page |

Unpublished entrepreneur and podcast IDs are emitted as the branded 404
in production, not as placeholder content. Once a record flips to
`published: true`, the same URL renders the real story on the next
build with no code change.

## Add content

Content lives in `/content/`:

- `/content/entrepreneurs/<id>.json`
- `/content/podcasts/<id>.json`
- `/content/reels/<id>.json`
- `/content/pages/<slug>.json`
- `/content/pages/site.json` (site-wide bilingual labels)

Non-developers can edit these via the GitHub web UI:

1. Open the relevant file on GitHub.
2. Click the pencil icon to edit in-browser.
3. Change the JSON. Set `published: true` only after both YSC reviewers
   and the project lead have signed off and the consent form is filed
   in Drive `/Consent/`.
4. Commit straight to a branch and open a pull request. CI typechecks
   the JSON against its Zod schema; a failed validation blocks merge.
5. Merge → Vercel rebuilds → live within a minute.

Safeguarding rules baked into the build (enforced regardless of JSON):

- No identifiable face of any minor anywhere on the public layer.
- No personal contact details of any contributor on the public layer.
- No location below district level (Satkhira) on the public layer.
- Photos appear only when the entrepreneur record sets
  `photoConsent: true`.
- Items render publicly only when `published: true`.

## Deploy

The repo is set up for Vercel static export.

```
# from a Vercel-linked repo
git push                    # triggers a Vercel build
# or, manually
vercel --prod
```

Set `NEXT_PUBLIC_SITE_URL` in Vercel project env once the production
domain is decided (defaults to `https://www.v2vbridge.org` if unset).
Sitemap and structured data both read this variable.

## Open decisions

See [`V2V_Bridge_PRD_Staged_v1.1.md`](./V2V_Bridge_PRD_Staged_v1.1.md) §6
for the full list. The launch-blocking ones are tracked in
[`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md):

- Real logo SVG (placeholder in `public/logo-placeholder.svg`)
- Plan IB Bangladesh focal-point contact (TODO marker on /withdraw)
- Production domain (.org vs .com.bd) and DNS
- Real Spotify show + episode IDs (placeholders in seed content)
- At least one real, consented entrepreneur record set to `published: true`
- PIB sign-off on public pages, if required
- /audit URL shared with PIB monitor contact

## Project documents

- [`V2V_Bridge_PRD_Staged_v1.1.md`](./V2V_Bridge_PRD_Staged_v1.1.md) —
  the staged technical PRD that drove this build.
- [`CONVENTIONS.md`](./CONVENTIONS.md) — repo conventions every agent
  reads before touching code.
- [`V2V_Bridge_ClaudeCode_Prompts.md`](./V2V_Bridge_ClaudeCode_Prompts.md)
  — per-stage prompts.
- `STAGE-N-DONE.md` files at the repo root — handoff notes per stage.
- [`INTEGRATION-DONE.md`](./INTEGRATION-DONE.md) — final integration
  report.
- [`CHANGELOG.md`](./CHANGELOG.md) — release history.
- [`LAUNCH_CHECKLIST.md`](./LAUNCH_CHECKLIST.md) — pre-launch
  business-team items.
- [`coordination/blockers.md`](./coordination/blockers.md) — historical
  cross-stage blocker log.
