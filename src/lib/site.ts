// Single source of truth for brand metadata, nav links, and legal entity.
// TODO: every value in this file is a placeholder pending real branding
// from the business owner — replace before launch.

export const site = {
  name: 'Placeholder Sourcing Co.', // TODO: real agency name
  parent: 'Placeholder Sourcing Co.',
  domain: 'sourcing-agency-site.pages.dev', // TODO: real domain (see README — Wix DNS plan)
  url: 'https://sourcing-agency-site.pages.dev',
  contactEmail: 'hello@example.com', // TODO: real inbox
  tagline: 'We find, vet, and manage the factories that make your product.',
  description:
    'A sourcing agency that finds vetted manufacturers, runs factory audits and quality inspections, manages samples, and coordinates freight — so brands can launch and scale a physical product without an in-house sourcing team.',
  ogImage: '/og-default.png', // TODO: add a real 1200x630 OG image at public/og-default.png
  twitter: '', // TODO
  locale: 'en-US',
} as const;

export const nav = [
  { href: '/#services', label: 'Services' },
  { href: '/#how-it-works', label: 'How It Works' },
  { href: '/case-studies', label: 'Case Studies' },
  { href: '/blog', label: 'Blog' },
  { href: '/#contact', label: 'Get a Quote' },
] as const;

export type NavItem = (typeof nav)[number];

// TODO: real legal entity details before publishing /legal/privacy or /legal/terms.
export const legalEntity = {
  name: 'TODO — legal entity name',
  type: 'TODO — entity type',
  address: 'TODO — registered address',
  email: site.contactEmail,
  jurisdiction: 'TODO — jurisdiction',
} as const;

// TODO: fill in real profiles, or remove unused platforms. Empty href is
// intentionally left out of the array rather than rendered as a dead link.
export const socialLinks: { name: string; handle: string; href: string; icon: string }[] = [
  // { name: 'LinkedIn', handle: 'placeholder-sourcing-co', href: 'https://www.linkedin.com/company/placeholder', icon: '/icons/social/linkedin.svg' },
];
