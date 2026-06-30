# indofolkwellness-site

Astro 4 (static) + Tailwind 3 marketing site for **IndoFolk Wellness (IFW)** —
a sourcing agency connecting pet care and Ayurvedic wellness brands across
the US, UK, and EU to vetted Indian manufacturers.

Built from the `glitch-grow-site` design system (Nuraveda-Labs), then
re-themed and re-written for IFW per the **IFW Automation Master Brief**
(29 June 2026, section 4 — Website Revamp Structure).

## Stack

- **Astro** (`output: 'static'`) + **Tailwind 3**, MDX content collections
- **Contact form**: posts to `/api/contact`, a Cloudflare Pages Function
  (`functions/api/contact.ts` + `functions/_email.ts`) — Turnstile-verified,
  emails via Resend. Form fields (Name, Email, Company, Country, Category,
  Message) match the brief's spec exactly.
- **Deployment target: Cloudflare Pages.** Not deployed yet.

## Local dev

```
pnpm install
pnpm dev
```

## Pages

- `/` — Home (hero, trust bar, how it works, category lanes, why IFW,
  social proof, footer CTA)
- `/pet-care-sourcing` — Pet Care lane (products, process, FAQ)
- `/ayurveda-sourcing` — Ayurveda lane (ingredients, products, certs, FAQ)
- `/about` — Story, founder (Divyanshu), values
- `/contact` — Form + Calendly + direct contact info
- `/blog`, `/case-studies` — content-collection driven, one placeholder
  entry each (`draft: true`)

## Visual direction

Deep forest green (`--color-brand`, `#1E3B29`), warm ivory background
(`--color-bg`, `#FAF7F2`), copper accent (`--color-copper`, `#B5651D`) — per
the brief's "not a generic B2B grey-and-blue" direction. Tokens live in
`src/styles/tokens.css`. The brief also calls for **real photography over
illustration** (factory shots, product shots, no stock imagery) — no images
are wired into the site yet; that's the next visual pass.

## Where the content came from

- Brand positioning, page structure, hero copy, FAQ topics, and the
  Pet Care / Ayurveda category split: the **IFW Automation Master Brief**.
- Contact details, address, social links, and Calendly URL: scraped from
  the **live site** (indofolkwellness.com, a Wix site) on 2026-06-30.
- The live site's "About" team section was Wix template placeholder content
  (fake names like "Sarah Suarez" with generic boilerplate bios) — **not**
  carried over. Only Divyanshu (the actual founder, per the brief and the
  live contact page's email) is named on the new About page.

## Domain plan (unchanged from the original scaffold)

`indofolkwellness.com` is on Wix, which doesn't allow changing nameservers
— so the zone can't move to Cloudflare for an apex custom domain on Pages.
Plan: serve at `www.indofolkwellness.com` (CNAME to the Pages project),
apex-forwarded to `www` via Wix's domain-forwarding feature.

## What's still placeholder — fill in before launch

- **Numbers**: manufacturer-network size, orders fulfilled, and any client
  quote on the homepage's Social Proof section are `TODO` — the brief
  explicitly says not to fabricate these.
- **Certifications**: the Pet Care and Ayurveda pages both have `TODO`
  markers where specific certifications (GMP, AYUSH, export standards)
  should be named — confirm with the manufacturer network before publishing.
- **MOQs / lead times**: `TODO` on the Pet Care FAQ — confirm current
  ranges.
- **Founder bio**: About page has a placeholder Divyanshu intro — have him
  rewrite it in his own voice per the brief ("light and real").
- **Legal**: `legalEntity` in `src/lib/site.ts` has the verified live
  address but `TODO`s for entity type and jurisdiction — `/legal/privacy`
  and `/legal/terms` are stub templates, not real policies.
- **Contact email**: using `divyanshu@indofolkwellness.com` (the live
  site's current contact) as the default; the brief's outreach templates
  consistently sign off with `hello@indofolkwellness.com` instead — confirm
  which should be public-facing.
- **Photography**: no real images yet (factory shots, product shots per
  the brief's visual direction).
- **Secrets**: `.env.example` lists variable names only.
- Cloudflare Pages project itself isn't created/connected yet.
