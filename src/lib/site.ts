// Single source of truth for brand metadata, nav links, and legal entity.
// Sourced from the IFW Automation Master Brief (29 June 2026) + the
// existing indofolkwellness.com Wix site's live contact details.
// TODO: confirm contactEmail (brief's outreach templates sign off with
// hello@indofolkwellness.com; the live site's contact page currently shows
// divyanshu@indofolkwellness.com — using divyanshu@ as the verified live
// inbox until you confirm which one should be the public-facing default).

export const site = {
  name: 'IndoFolk Wellness',
  parent: 'IndoFolk Wellness',
  domain: 'indofolkwellness.com',
  url: 'https://www.indofolkwellness.com',
  contactEmail: 'divyanshu@indofolkwellness.com',
  phone: '+91 9977313509',
  tagline: 'We source pet care and Ayurvedic products from India — so you don’t have to.',
  description:
    'IndoFolk Wellness is a sourcing agency connecting pet care and Ayurvedic wellness brands in the US, UK, and EU to vetted Indian manufacturers — from factory matching and quality control to export documentation and logistics, fully managed end to end.',
  ogImage: '/og-default.png', // TODO: add a real 1200x630 OG image at public/og-default.png
  locale: 'en-US',
  markets: ['US', 'UK', 'EU'] as const,
  calendlyUrl: 'https://calendly.com/divyanshu-indofolkwellness',
  address: {
    line1: 'S-258, basement, S Block, Greater Kailash I',
    line2: 'New Delhi, Delhi 110048, India',
  },
  locations: ['India', 'Singapore'],
} as const;

export const nav = [
  { href: '/pet-care-sourcing', label: 'Pet Care Sourcing' },
  { href: '/ayurveda-sourcing', label: 'Ayurveda Sourcing' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
] as const;

export type NavItem = (typeof nav)[number];

// TODO: confirm registered entity type (Pvt Ltd / sole prop / etc.) and
// jurisdiction before publishing /legal/privacy or /legal/terms — only the
// address below is verified (it's live on the current site's contact page).
export const legalEntity = {
  name: 'IndoFolk Wellness',
  type: 'TODO — entity type',
  address: `${site.address.line1}, ${site.address.line2}`,
  email: site.contactEmail,
  jurisdiction: 'TODO — jurisdiction (India?)',
} as const;

export const socialLinks: { name: string; handle: string; href: string; icon: string }[] = [
  { name: 'Instagram', handle: 'indofolkwellness', href: 'https://instagram.com/indofolkwellness/', icon: '/icons/social/instagram.svg' },
  { name: 'LinkedIn', handle: 'ifw-indofolk-wellness', href: 'https://linkedin.com/company/ifw-indofolk-wellness/', icon: '/icons/social/linkedin.svg' },
  { name: 'Facebook', handle: 'IndoFolk Wellness', href: 'https://facebook.com/profile.php?id=61561400919179', icon: '/icons/social/facebook.svg' },
];
