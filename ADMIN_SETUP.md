# V2V Bridge — Vercel deployment + admin panel setup

This guide walks through everything you need to do *once* to take the V2V Bridge codebase from this GitHub repo to a live, fully editable site:

- **Part 1** — deploy the static site to Vercel and connect the custom domain `v2vbridge.capec.consulting`.
- **Part 2** — wire the free, open-source admin panel at `/admin` so stakeholders can edit content through a friendly form (GitHub login, no code skills needed).

End state:

| What                                  | Lives at                                            |
| ------------------------------------- | --------------------------------------------------- |
| Public site (default Vercel domain)   | `https://v2vbridge.vercel.app`                      |
| Public site (canonical custom domain) | `https://v2vbridge.capec.consulting`                |
| Stakeholder admin panel               | `https://v2vbridge.capec.consulting/admin`          |
| OAuth proxy (Cloudflare Worker)       | `https://v2v-cms-auth.<you>.workers.dev` (you pick) |

Total cost: **$0**. Vercel Hobby covers the site, Cloudflare Workers free tier covers the OAuth proxy, Decap CMS is open source, GitHub OAuth Apps are free.

---

# Part 1 — Deploy the main site to Vercel

You'll only do this once. Budget about 10 minutes.

## Step 1.1 — Import the repo into Vercel

1. Sign in to https://vercel.com (or sign up with your GitHub account — free).
2. Click **Add New… → Project**.
3. Under **Import Git Repository**, find `shakibbinkabir/v2v` and click **Import**.
   - If the repo doesn't appear, click **Adjust GitHub App permissions** and grant Vercel access to the repo.
4. On the configure screen:
   - **Project Name**: `v2vbridge` *(this gives you the `v2vbridge.vercel.app` default URL)*
   - **Framework Preset**: Vercel will auto-detect **Next.js** — leave it.
   - **Root Directory**: leave as the repo root.
   - **Build Command**: leave default (`pnpm build`).
   - **Output Directory**: leave default (`out` — Next.js static export writes here).
   - **Install Command**: leave default (`pnpm install`).
5. Expand **Environment Variables** and add:
   - **Name**: `NEXT_PUBLIC_SITE_URL`
   - **Value**: `https://v2vbridge.capec.consulting`
   - Apply to: **Production, Preview, Development**.

   This tells the site what its canonical URL is — used for the sitemap, robots.txt, OpenGraph tags, and JSON-LD structured data.
6. Click **Deploy**. The first build takes ~2 minutes.

When it finishes, your site is live at `https://v2vbridge.vercel.app`.

## Step 1.2 — Pick the deployment branch

By default Vercel deploys whichever branch is set as the repo's default. Right now this repo's working branch is `integration-v1`.

In Vercel project → **Settings → Git → Production Branch**:

- If you intend `integration-v1` to stay the canonical branch, set production branch to `integration-v1`.
- Otherwise, merge `integration-v1` into `main` on GitHub first and set production branch to `main`.

Whatever you pick here, **also update `branch:` in `public/admin/config.yml` to match** (Part 2, Step 2.3) — the CMS commits to that branch.

## Step 1.3 — Connect `v2vbridge.capec.consulting`

In Vercel project → **Settings → Domains**:

1. Type `v2vbridge.capec.consulting` in the input and click **Add**.
2. Vercel will show one of two DNS instructions depending on your DNS provider for `capec.consulting`:
   - **CNAME (recommended for subdomains)**: add a CNAME record on `v2vbridge.capec.consulting` pointing to `cname.vercel-dns.com`.
   - **A record fallback**: add an A record pointing to the IP Vercel shows.
3. Add the record at your DNS provider (Cloudflare, Namecheap, GoDaddy, wherever `capec.consulting` is managed).
4. Back in Vercel, the domain status will go from **Invalid Configuration** to **Valid Configuration** within a few minutes (occasionally up to an hour for DNS propagation).
5. Vercel automatically provisions a free TLS certificate.

Once it's green, `https://v2vbridge.capec.consulting` serves the site. The default `v2vbridge.vercel.app` keeps working as a backup.

## Step 1.4 — (Optional) make the custom domain canonical

In Vercel → **Settings → Domains**, click the three-dot menu on `v2vbridge.capec.consulting` and **Set as Production Domain**. Vercel will then 308-redirect `v2vbridge.vercel.app` → `v2vbridge.capec.consulting`, so search engines settle on the custom URL.

## Step 1.5 — Sanity check

Visit:

- `https://v2vbridge.capec.consulting/` — should load the home page.
- `https://v2vbridge.capec.consulting/sitemap.xml` — should list every public route under the canonical URL.
- `https://v2vbridge.capec.consulting/robots.txt` — should reference the canonical URL.

If the URLs in `sitemap.xml` show `v2vbridge.org` instead of `v2vbridge.capec.consulting`, the `NEXT_PUBLIC_SITE_URL` env var didn't take. Re-check Step 1.1, redeploy from Vercel → **Deployments → … → Redeploy**.

---

# Part 2 — Wire up the admin panel

The admin static files (`public/admin/index.html`, `public/admin/config.yml`) are already in the repo. After Part 1, `https://v2vbridge.capec.consulting/admin` returns the admin shell — but you can't log in yet because the GitHub OAuth handshake needs a tiny proxy.

You will only do this once. It takes about 10 minutes.

## What you need

- The same GitHub account that owns the repo (or one with admin rights on it).
- A free [Cloudflare](https://dash.cloudflare.com/sign-up) account (Workers free tier covers this comfortably — 100,000 requests/day, way more than the CMS will ever produce).
- Node.js 18+ on your local machine (just for running `npx wrangler` once during deploy).

> **Heads-up on the proxy choice.** Decap CMS doesn't ship its own OAuth proxy — it links out to a list of community-maintained ones. We're going with **[`sterlingwes/decap-proxy`](https://github.com/sterlingwes/decap-proxy)** (Cloudflare Worker, ~100 stars, actively maintained, simple two-secret config). It has no LICENSE file in the repo, so for extra safety I recommend forking it into your own GitHub account first and deploying from your fork — you'll then own a copy you control regardless of what happens upstream.

## Step 2.1 — Create a GitHub OAuth App

1. Go to **GitHub → Settings → Developer settings → OAuth Apps → New OAuth App**.
   Direct link: https://github.com/settings/developers
2. Fill in:
   - **Application name**: `V2V Bridge CMS`
   - **Homepage URL**: `https://v2vbridge.capec.consulting`
   - **Authorization callback URL**: `https://YOUR-WORKER.workers.dev/callback`
     (you don't have this URL yet — put a placeholder, you'll edit it after Step 2.2.)
3. Click **Register application**.
4. On the next screen:
   - Copy the **Client ID** (visible).
   - Click **Generate a new client secret**, copy it. You won't see it again.

Keep the Client ID and Client Secret somewhere safe — you'll paste them into Cloudflare in Step 2.2.

## Step 2.2 — Deploy the OAuth proxy to Cloudflare Workers

You'll do this once on your own machine.

1. **(Recommended)** Fork [`sterlingwes/decap-proxy`](https://github.com/sterlingwes/decap-proxy) on GitHub into your own account so you own the copy you deploy from. (Click **Fork** in the top right.)

2. Clone your fork and install:
   ```bash
   git clone https://github.com/YOUR-GITHUB-USER/decap-proxy.git
   cd decap-proxy
   npm install        # or yarn install — the repo uses yarn.lock but npm works
   ```

3. Configure Wrangler (Cloudflare's deploy CLI):
   ```bash
   cp wrangler.toml.sample wrangler.toml
   ```
   Open `wrangler.toml` and set the worker name — for example:
   ```toml
   name = "v2v-cms-auth"
   ```
   That becomes the URL: `v2v-cms-auth.<your-cloudflare-subdomain>.workers.dev`.

4. Authenticate Wrangler against your Cloudflare account:
   ```bash
   npx wrangler login
   ```
   Browser window opens, you authorise, done.

5. Push the GitHub OAuth credentials in as Cloudflare secrets (these never get committed):
   ```bash
   npx wrangler secret put GITHUB_OAUTH_ID
   # Paste the Client ID from Step 2.1, press Enter

   npx wrangler secret put GITHUB_OAUTH_SECRET
   # Paste the Client Secret from Step 2.1, press Enter
   ```
   *Optional:* if your repo is private (it's currently public, so skip this), also run:
   ```bash
   npx wrangler secret put GITHUB_REPO_PRIVATE
   # Type 1, press Enter
   ```

6. Deploy:
   ```bash
   npx wrangler deploy
   ```
   At the end, Wrangler prints your Worker URL — something like:
   ```
   Published v2v-cms-auth (1.45 sec)
     https://v2v-cms-auth.YOUR-SUBDOMAIN.workers.dev
   ```
   Visiting that URL should show "Hello 👋". That's the proxy responding.

7. Go back to the GitHub OAuth App from Step 2.1 and update the **Authorization callback URL** to:
   ```
   https://v2v-cms-auth.YOUR-SUBDOMAIN.workers.dev/callback
   ```

## Step 2.3 — Point the admin at your proxy

Edit `public/admin/config.yml` in this repo and update the highlighted lines:

```yaml
backend:
  name: github
  repo: shakibbinkabir/v2v
  branch: integration-v1                                              # ← match your Vercel production branch
  base_url: https://v2v-cms-auth.YOUR-SUBDOMAIN.workers.dev           # ← your Worker URL from Step 2.2
  auth_endpoint: auth                                                 # sterlingwes/decap-proxy serves the handshake at /auth
```

> **Important — `auth_endpoint`**: different community proxies expose the handshake under different paths. `sterlingwes/decap-proxy` uses `/auth` (and `/callback`), so set `auth_endpoint: auth`. If you ever swap to a different proxy, read that proxy's source/README and update this line to match the path it serves.

Commit and push. Vercel rebuilds the main site automatically; once it's done, the admin handshake is wired up.

## Step 2.4 — Open `/admin` and log in

Visit `https://v2vbridge.capec.consulting/admin` — you'll see a **Login with GitHub** button. Click it, authorise the OAuth app for your repo, and you're in.

---

# Stakeholder onboarding

Anyone with **push access to the GitHub repo** can log in and save changes through the CMS. To add a stakeholder:

1. Add them as a collaborator on the GitHub repo: **Settings → Collaborators → Add people**.
2. Send them the link `https://v2vbridge.capec.consulting/admin`.

They will be prompted to authorise the OAuth app once, then they can edit. Their saves commit under their own GitHub account, so the audit trail in `git log` is real and per-person.

---

# Optional — turn on review workflow later

Out of the box, every save commits straight to the production branch. If you'd rather every change become a draft Pull Request that YSC + project lead review before merging, uncomment this line in `public/admin/config.yml`:

```yaml
publish_mode: editorial_workflow
```

Stakeholders then see a **Workflow** tab listing drafts in *In Review* / *Ready* columns.

---

# What stakeholders can edit

- **Entrepreneurs** — create / edit / delete profiles, set the `published` flag, link to podcast + reels.
- **Podcasts** — create / edit / delete episodes, paste in the Spotify embed ID.
- **Reels** — create / edit / delete reel embeds.
- **Pages** — edit the body copy of Home, About, Safeguarding, Withdraw, Resources.
- **Site (nav + footer)** — edit nav labels, footer copy, credit lines.

The CMS fully respects the bilingual (EN + BN) structure: every text field has both inputs side-by-side.

# What the CMS *cannot* do

- Upload PDF consent forms — those are kept off the public site by policy. Only the filename is recorded.
- Edit the language toggle behaviour, brand colours, or page layouts — those are code, not content.
- Skip Zod validation. If a stakeholder saves a record with missing required fields, the next Vercel build will fail and surface the error. Fix the record and rebuild.

---

# Cost

Free.
- Decap CMS itself is open source (MIT).
- Vercel Hobby plan covers the main site at $0.
- Cloudflare Workers free tier covers the OAuth proxy at $0 (100k requests/day; the CMS will use a handful per day at most).
- GitHub OAuth Apps are free.
- TLS certificates on `v2vbridge.capec.consulting` are auto-provisioned by Vercel at $0.

---

# Troubleshooting

**`v2vbridge.capec.consulting` shows "DNS_PROBE_FINISHED_NXDOMAIN"** — DNS hasn't propagated yet. Wait 10 minutes, try again. If it persists past an hour, double-check the CNAME record at your DNS provider.

**Sitemap / OG tags show the wrong URL** — `NEXT_PUBLIC_SITE_URL` is missing or wrong in Vercel project settings. Re-check Step 1.1, redeploy.

**"Failed to load entries" after CMS login** — the OAuth app callback URL doesn't match your deployed Worker URL. Re-check Step 2.1 / Step 2.2.

**Login popup opens, GitHub authorise screen never appears** — `auth_endpoint` in `config.yml` is wrong for your proxy. For `sterlingwes/decap-proxy` it must be `auth` (the Worker serves `/auth`). Different community proxies use different paths.

**Login popup closes with no error** — usually a popup blocker. Allow popups for `v2vbridge.capec.consulting`.

**Save succeeds but nothing changes on the live site** — Vercel is rebuilding. Wait ~60 seconds and refresh.

**"Branch not found"** — `config.yml` `branch:` doesn't match Vercel's production branch. Make sure both point at the same branch (Step 1.2 + Step 2.3).

**Worker URL returns "Hello 👋" only — never reaches the auth flow** — that's the Worker's default response when no path matches. The CMS hits `/auth` (which redirects to GitHub) and `/callback` (which finishes the handshake). If you visit those paths directly they'll error without query params, which is normal — only Decap should hit them.
