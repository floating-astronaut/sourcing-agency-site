/**
 * Branded email templates used by CF Pages Functions.
 *
 * Files starting with `_` under /functions/ are not exposed as routes by
 * Cloudflare Pages — they're module-only.
 */

export interface BrandTheme {
  name: string;
  siteUrl: string;
  tagline: string;
  accent: string;
  accentInk: string;
  supportEmail: string;
}

export const BRAND: BrandTheme = {
  name:         'IndoFolk Wellness',
  siteUrl:      'https://www.indofolkwellness.com',
  tagline:      'We source pet care and Ayurvedic products from India — so you don’t have to.',
  accent:       '#1E3B29',
  accentInk:    '#FAF7F2',
  supportEmail: 'divyanshu@indofolkwellness.com',
};

export interface ContactPayload {
  name: string;
  email: string;
  company: string;
  country: string;
  category: string;
  message: string;
}

export interface RequestContext {
  ip: string;
  ua: string;
  ref: string;
  ts: string;
  site: string;
}

export interface RenderedEmail {
  subject: string;
  text: string;
  html: string;
}

export function renderNotification(p: ContactPayload, ctx: RequestContext): RenderedEmail {
  const subject = `[${BRAND.name}] New inquiry from ${p.name}${p.company ? ` (${p.company})` : ''}`;

  const text =
`New inquiry from ${BRAND.name} (${ctx.site})

Name:     ${p.name}
Email:    ${p.email}
Company:  ${p.company || '—'}
Country:  ${p.country || '—'}
Category: ${p.category || '—'}

Message:
${p.message}

────────────────────────────
Received: ${ctx.ts}
IP:       ${ctx.ip || '—'}
UA:       ${ctx.ua || '—'}
Referer:  ${ctx.ref || '—'}
Reply directly to this email to reach ${p.name}.
`;

  const html =
`<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1B2A20;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f5f2;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="600" style="max-width:600px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(27,42,32,0.08);">
        <tr>
          <td style="background:${BRAND.accent};padding:20px 28px;">
            <div style="font-size:13px;font-weight:600;letter-spacing:.04em;text-transform:uppercase;color:${BRAND.accentInk};">${esc(BRAND.name)}</div>
            <div style="font-size:11px;color:${BRAND.accentInk};opacity:.75;">${esc(ctx.site)} · New inquiry</div>
          </td>
        </tr>
        <tr><td style="padding:28px;">
          <h1 style="margin:0 0 4px 0;font-size:20px;font-weight:700;letter-spacing:-.01em;">${esc(p.name)}</h1>
          <p style="margin:0 0 20px 0;color:#5B6B5E;font-size:14px;">
            <a href="mailto:${esc(p.email)}" style="color:#B5651D;text-decoration:none;">${esc(p.email)}</a>${p.company ? ` · ${esc(p.company)}` : ''}${p.country ? ` · ${esc(p.country)}` : ''}
          </p>
          ${p.category ? `<p style="margin:0 0 16px 0;font-size:13px;color:#5B6B5E;"><strong style="color:#1B2A20;">Category:</strong> ${esc(p.category)}</p>` : ''}
          <div style="padding:16px 18px;background:#f6f5f2;border-left:3px solid ${BRAND.accent};border-radius:4px;white-space:pre-wrap;font-size:14px;line-height:1.6;color:#1B2A20;">${esc(p.message)}</div>
          <table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin-top:24px;">
            <tr><td style="padding:4px 0;">
              <a href="mailto:${esc(p.email)}?subject=Re%3A%20Your%20inquiry%20to%20${encodeURIComponent(BRAND.name)}"
                 style="display:inline-block;background:${BRAND.accent};color:${BRAND.accentInk};padding:10px 18px;border-radius:999px;font-size:14px;font-weight:600;text-decoration:none;">
                Reply to ${esc(p.name.split(' ')[0] || p.name)}
              </a>
            </td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:16px 28px 24px 28px;border-top:1px solid #e5e2da;font-size:11px;color:#8B9690;line-height:1.6;">
          Received ${esc(ctx.ts)}<br>
          IP: ${esc(ctx.ip || '—')} · Referer: ${esc(ctx.ref || '—')}<br>
          ${esc(ctx.ua || '—')}
        </td></tr>
      </table>
      <p style="margin:16px 0 0 0;font-size:11px;color:#8B9690;">
        Sent automatically by <a href="${BRAND.siteUrl}" style="color:#8B9690;text-decoration:underline;">${esc(BRAND.siteUrl.replace(/^https?:\/\//, ''))}</a>.
      </p>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

export function renderAutoReply(p: ContactPayload): RenderedEmail {
  const firstName = (p.name.split(' ')[0] || p.name).trim();
  const subject = `We got your inquiry — ${BRAND.name}`;

  const text =
`Hi ${firstName},

Thanks for reaching out to ${BRAND.name}. We've received your inquiry and a member of our team will reply within one business day.

For reference, here's what you sent:

    ${p.message.split('\n').join('\n    ')}

If it's urgent, reply to this email directly — replies land in our support inbox.

— The ${BRAND.name} team
${BRAND.siteUrl}
`;

  const html =
`<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f6f5f2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;color:#1B2A20;">
  <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%" style="background:#f6f5f2;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="560" style="max-width:560px;background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(27,42,32,0.08);">
        <tr>
          <td style="background:${BRAND.accent};padding:28px;" align="center">
            <div style="font-size:15px;font-weight:700;letter-spacing:.04em;text-transform:uppercase;color:${BRAND.accentInk};">${esc(BRAND.name)}</div>
          </td>
        </tr>
        <tr><td style="padding:32px 28px;">
          <h1 style="margin:0 0 12px 0;font-size:22px;font-weight:700;letter-spacing:-.01em;">Got it, ${esc(firstName)}</h1>
          <p style="margin:0 0 16px 0;font-size:15px;line-height:1.6;color:#374937;">
            Thanks for reaching out to <strong>${esc(BRAND.name)}</strong>. Your inquiry is in our queue and a member of our team will reply within one business day.
          </p>
          <p style="margin:0 0 24px 0;font-size:15px;line-height:1.6;color:#374937;">${esc(BRAND.tagline)}</p>
          <div style="padding:14px 18px;background:#f6f5f2;border-left:3px solid ${BRAND.accent};border-radius:4px;font-size:14px;line-height:1.6;color:#4b5563;white-space:pre-wrap;">
<strong style="color:#1B2A20;">Your message</strong>
${esc(p.message)}
          </div>
          <p style="margin:24px 0 0 0;font-size:13px;color:#5B6B5E;line-height:1.6;">
            If it's urgent, reply to this email directly — replies land in our support inbox.
          </p>
        </td></tr>
        <tr><td style="padding:16px 28px 24px 28px;border-top:1px solid #e5e2da;font-size:12px;color:#8B9690;text-align:center;">
          <a href="${BRAND.siteUrl}" style="color:#8B9690;text-decoration:none;">${esc(BRAND.siteUrl.replace(/^https?:\/\//, ''))}</a>
          &nbsp;·&nbsp;
          <a href="mailto:${esc(BRAND.supportEmail)}" style="color:#8B9690;text-decoration:none;">${esc(BRAND.supportEmail)}</a>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

function esc(s: string): string {
  return String(s).replace(/[&<>"']/g, (c) => (
    c === '&' ? '&amp;' :
    c === '<' ? '&lt;'  :
    c === '>' ? '&gt;'  :
    c === '"' ? '&quot;' :
                '&#39;'
  ));
}
