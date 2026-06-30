// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// TODO: replace with the real production URL once the domain is finalized.
const SITE = process.env.PUBLIC_SITE_URL || 'https://sourcing-agency-site.pages.dev';

// Static output. The contact form is served by a Cloudflare Pages Function
// directly out of `/functions/`, not via an Astro adapter — this keeps the
// build Node-free and the output a plain static dir.
export default defineConfig({
  site: SITE,
  output: 'static',
  trailingSlash: 'ignore',
  integrations: [
    tailwind({ applyBaseStyles: false, nesting: true }),
    mdx(),
    sitemap({
      filter: (page) => !page.includes('/api/'),
    }),
  ],
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport',
  },
});
