# V2V Bridge — content

Everything that appears on the public V2V Bridge site lives in this
directory as JSON files. The site is rebuilt every time a JSON file
changes; you do not need a developer to publish a story. You do need
the right reviews and a signed Media Consent Form on file.

This page explains what each folder is and how to add or change a
record using only the GitHub website (no code editor required).

## Folders

```
content/
├── entrepreneurs/    one JSON file per profile          (sample-NNN.json)
├── podcasts/         one JSON file per podcast episode  (sample-epNN.json)
├── reels/            one JSON file per reel             (sample-rNN.json)
└── pages/
    ├── home.json           bilingual copy for /
    ├── about.json          bilingual copy for /about
    ├── safeguarding.json   bilingual copy for /safeguarding
    ├── withdraw.json       bilingual copy for /withdraw
    ├── resources.json      bilingual copy for /resources
    └── site.json           nav labels + footer text shown across all pages
```

Every record is validated against a Zod schema at build time. If a
field is missing or the wrong type, the build fails with a clear
message and the change is **not** published. This is intentional — it
is the project's last line of defence against accidentally publishing
unreviewed content.

## Editing on github.com (no code editor)

1. Sign in to GitHub and open this repository.
2. Click the file you want to change (for example
   `content/entrepreneurs/sample-001.json`).
3. Click the pencil icon (top-right of the file view) to edit it.
4. Make your change.
5. **Set `"published": true` only after both YSC reviewers and the
   project lead have signed off, and the consent form is filed in
   Drive `/Consent/`.**
6. Scroll to the bottom and write a short commit message
   (e.g., "publish entrepreneur ent-002").
7. Choose "Create a new branch and start a pull request".
8. The continuous-integration check will validate the JSON against the
   schema. If it passes, an editor merges the pull request.
9. The site rebuilds in about a minute. The new content is live.

## Field cheat-sheet

### Entrepreneurs (`content/entrepreneurs/<id>.json`)

| Field | Notes |
|---|---|
| `id` | Stable identifier, e.g., `ent-001`. Cannot be reused after retirement. |
| `displayName` | First name only or pseudonym. Never a full name. |
| `sector` | Lower-case sector slug — `tailoring`, `fish drying`, `dairy`, `handicraft`, `organic farming`. |
| `district` | Always `"Satkhira"` for v1 — never thana, ward, or household. |
| `photo` | Path under `/public` (e.g., `/photos/ent-001.jpg`). Optional. |
| `photoConsent` | `true` only if the consent form opts in to photo use. If `false` (or absent), the site shows a sector icon, not the photo. |
| `summary` | Bilingual `{ en, bn }`. Up to 300 words each. |
| `podcastId` | Optional id of the linked podcast episode. |
| `reelIds` | Array of reel ids. May be empty. |
| `consentFormFilename` | Filename of the signed PDF in Drive `/Consent/`. |
| `published` | Must be `true` for the record to appear publicly. |
| `publishedAt` | ISO date — set when first published. |
| `reviewers` | `{ ysc1, ysc2, projectLead }` — names of the three reviewers. |

### Podcast episodes (`content/podcasts/<id>.json`)

| Field | Notes |
|---|---|
| `id` | Stable id, e.g., `ep-002`. |
| `episodeNumber` | Integer, ascending. |
| `title`, `summary` | Bilingual `{ en, bn }`. |
| `embed.provider` | `spotify`, `anchor`, or `youtube`. |
| `embed.embedId` | The id from the platform URL (the part after `/episode/` for Spotify). |
| `durationSeconds` | Integer seconds. The site formats it as `m:ss`. |
| `recordedOn` | ISO date. |
| `entrepreneurId` | Id of the linked entrepreneur. |
| `transcriptUrl` | Optional. |
| `published`, `publishedAt` | Same rules as entrepreneurs. |

### Reels (`content/reels/<id>.json`)

| Field | Notes |
|---|---|
| `id` | Stable id, e.g., `r-007`. |
| `platform` | `instagram`, `tiktok`, or `facebook`. |
| `embedUrl` | Full public URL of the post. |
| `caption` | Bilingual `{ en, bn }`. |
| `entrepreneurId` | Id of the linked entrepreneur. |
| `podcastId` | Optional — set when the reel ties to a specific episode. |
| `published`, `publishedAt` | Same rules. |

### Page copy (`content/pages/<slug>.json`)

| Field | Notes |
|---|---|
| `slug` | Must match the file name without `.json`. |
| `title` | Bilingual page heading. |
| `sections` | Array of `{ heading?, body }` blocks, each bilingual. |
| `metadata.title` | English page title used by browsers and search. |
| `metadata.description` | One-sentence English description for search. |
| `flags` | Optional `{ key: boolean }` — used by /resources for `learningBriefAvailable`. |

### Site copy (`content/pages/site.json`)

Site-wide bilingual labels — nav items, footer headings, the withdraw
and audit link labels, and the last-updated label. Edit if the wording
needs to change site-wide; the change appears on every page after the
next rebuild.

## Sample records

The `sample-*` files in each folder are placeholders shipped with the
build so the layout, primitives, and routes have something to render
during development. They all have `"published": false`, so they do
**not** appear on the public site — they only appear in development
mode (running `pnpm dev` locally).

Stage 6 will eventually move these to a separate `content/_samples/`
folder. For now, simply create a new file alongside (e.g.,
`content/entrepreneurs/ent-001.json`) when you are ready to publish a
real record.

## Photos

Real entrepreneur portraits go in `public/photos/<id>.jpg` and the
JSON references that path. The placeholder SVGs used by the sample
records live in `public/sample-photos/` so the build resolves without
real photo assets — these are stylised abstract icons, not photos of
real people.
