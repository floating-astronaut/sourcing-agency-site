# sourcing-agency-site

Astro 4 (static) + Tailwind 3 marketing site for a B2B sourcing agency.
Derived from the `glitch-grow-site` design system, stripped of all
commerce/OAuth/competitive-SEO functionality and rewritten with placeholder
sourcing-agency content.

## Stack

- **Astro** (`output: 'static'`) + **Tailwind 3**, MDX content collections
- **Contact form**: posts to `/api/contact`, a Cloudflare Pages Function
  (`functions/api/contact.ts` + `functions/_email.ts`) — Turnstile-verified,
  emails via Resend, optional Slack/webhook/Meta CAPI sinks. No Node server,
  no database.
- **Deployment target: Cloudflare Pages.** Not deployed yet — needs a CF
  Pages project created and connected to this repo, plus the env vars in
  `.env.example` set in the dashboard.

## Local dev

```
pnpm install
pnpm dev
```

## Content

Blog posts live in `src/content/blog/*.mdx`, case studies in
`src/content/case-studies/*.mdx`. Both currently contain one placeholder
entry with `draft: true` — delete or rewrite it, set `draft: false` to
publish. Schema is defined in `src/content/config.ts`.

## Domain plan (Wix DNS constraint)

The buyer's current domain is registered/managed on Wix, and Wix doesn't
allow changing nameservers — so the zone can't move to Cloudflare. That
rules out a Cloudflare-managed apex (bare `domain.com`) custom domain on
Pages, since apex CNAME-flattening requires the zone to be on Cloudflare.

Plan: serve the site at **`www.<domain>`** — add a CNAME at Wix DNS pointing
`www` to the Cloudflare Pages project's `*.pages.dev` hostname, then use
Wix's domain-forwarding feature to redirect the bare apex to `www`.

## What's placeholder — fill in before launch

- **Brand**: `src/lib/site.ts` (`name`, `tagline`, `description`,
  `contactEmail`, `legalEntity`, `socialLinks`), and `functions/_email.ts`
  (`BRAND` object — kept in sync manually, same pattern as the upstream repo).
- **Copy**: every section on `src/pages/index.astro` (services, process
  steps, FAQ answers) is placeholder text.
- **Legal**: `src/pages/legal/privacy.astro` and `terms.astro` are stub
  templates with `TODO` markers — not real policies. Do not publish as-is.
- **Content**: the one sample blog post and one sample case study are
  drafts proving the collections render — replace them.
- **Assets**: `public/favicon.svg` and `public/og-default.png` (referenced
  by `site.ts` but not yet created) are placeholders.
- **Domain**: `astro.config.mjs` and `site.ts` default to a `*.pages.dev`
  URL until the real domain is wired up (see above).
- **Secrets**: `.env.example` lists variable names only — no real
  Turnstile/Resend/etc. keys are configured anywhere in this repo.

## Not ported from the upstream template (v1 scope cut)

`LeadFormModal`, `MobileStickyCta`, `AnnouncementBar`, `YouTubeEmbed`, the
satori-based `/api/og/[slug].png` OG-image generator, and the
products/vs/alternatives/glossary/tools pSEO pages were all dropped as
out-of-scope for a first sourcing-agency scaffold. Re-add from
`Nuraveda-Labs/glitch-grow-site` if needed later.
