/**
 * Cloudflare Pages Function — POST /api/contact
 *
 * Responsibilities:
 *   1. Verify Turnstile token server-side (required — server trusts nothing from the client).
 *   2. Validate + sanitize form fields.
 *   3. Drop honeypot submissions silently.
 *   4. Deliver the message to any configured sink (Resend email, Slack, generic
 *      webhook). Multiple sinks can be active at once; each fires in parallel.
 *
 * Env (wire in Cloudflare Pages dashboard):
 *   TURNSTILE_SECRET      — Turnstile secret key (required in prod).
 *   RESEND_API_KEY        — Resend API key. When set, sends the message to RESEND_TO.
 *   RESEND_FROM           — optional override; default uses BRAND from _email.ts.
 *   RESEND_TO             — optional override; default = BRAND.supportEmail.
 *   RESEND_AUTOREPLY      — when "true", also sends the submitter a thank-you email.
 *   SLACK_WEBHOOK_URL     — optional; POSTs a formatted Block Kit message.
 *   CONTACT_FORWARD_URL   — optional; POSTs raw JSON to any endpoint.
 *
 * No third-party SDKs — just `fetch`.
 */

import {
  BRAND,
  renderNotification,
  renderAutoReply,
  type ContactPayload,
  type RequestContext,
  type RenderedEmail,
} from '../_email';

export interface Env {
  TURNSTILE_SECRET?: string;
  RESEND_API_KEY?: string;
  RESEND_FROM?: string;
  RESEND_TO?: string;
  RESEND_AUTOREPLY?: string;
  SLACK_WEBHOOK_URL?: string;
  CONTACT_FORWARD_URL?: string;
}

interface FormFields extends ContactPayload {
  token: string;
}

const MAX_LEN = { name: 200, email: 200, company: 200, country: 100, category: 100, message: 4000 } as const;

export const onRequestPost: PagesFunction<Env> = async ({ request, env }) => {
  const eventId = crypto.randomUUID();
  const contentType = request.headers.get('content-type') ?? '';
  let form: FormData;
  try {
    form = contentType.includes('application/json')
      ? jsonToForm(await request.json())
      : await request.formData();
  } catch {
    return json({ ok: false, error: 'bad-request' }, 400);
  }

  // Honeypot: drop silently.
  if (form.get('company_url')) {
    return json({ ok: true }, 200);
  }

  const payload: FormFields = {
    name:     clean(form.get('name'),     MAX_LEN.name),
    email:    clean(form.get('email'),    MAX_LEN.email),
    company:  clean(form.get('company'),  MAX_LEN.company),
    country:  clean(form.get('country'),  MAX_LEN.country),
    category: clean(form.get('category'), MAX_LEN.category),
    message:  clean(form.get('message'),  MAX_LEN.message),
    token:    clean(form.get('cf-turnstile-response'), 4096),
  };

  if (!payload.name || !payload.email || !payload.message) {
    return json({ ok: false, error: 'missing-fields' }, 400);
  }
  if (!isEmail(payload.email)) {
    return json({ ok: false, error: 'bad-email' }, 400);
  }

  if (env.TURNSTILE_SECRET) {
    const ok = await verifyTurnstile(payload.token, env.TURNSTILE_SECRET, clientIp(request));
    if (!ok) return json({ ok: false, error: 'turnstile-failed' }, 403);
  }

  await forward(payload, env, request, eventId);
  return json({ ok: true, event_id: eventId });
};

function jsonToForm(obj: unknown): FormData {
  const fd = new FormData();
  if (obj && typeof obj === 'object') {
    for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
      fd.set(k, typeof v === 'string' ? v : JSON.stringify(v));
    }
  }
  return fd;
}

function clean(v: FormDataEntryValue | null, max: number): string {
  if (typeof v !== 'string') return '';
  return v.trim().slice(0, max);
}

function isEmail(s: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

async function verifyTurnstile(token: string, secret: string, ip: string): Promise<boolean> {
  if (!token) return false;
  const body = new FormData();
  body.set('secret', secret);
  body.set('response', token);
  if (ip) body.set('remoteip', ip);
  const r = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST', body,
  });
  if (!r.ok) return false;
  const data = (await r.json()) as { success: boolean };
  return data.success === true;
}

async function forward(p: FormFields, env: Env, req: Request, eventId: string): Promise<void> {
  const ref = req.headers.get('referer') ?? '';
  const ua  = req.headers.get('user-agent') ?? '';
  const ip  = clientIp(req);
  const ts  = new Date().toISOString();

  let site = BRAND.siteUrl.replace(/^https?:\/\//, '').replace(/\/$/, '');
  try {
    if (ref) site = new URL(ref).hostname;
    else site = (req.headers.get('host') || '').replace(/^www\./, '') || site;
  } catch { /* ignore bad referer */ }

  const ctx: RequestContext = { ip, ua, ref, ts, site };
  const contactData: ContactPayload = {
    name: p.name,
    email: p.email,
    company: p.company,
    country: p.country,
    category: p.category,
    message: p.message,
  };

  const tasks: Promise<unknown>[] = [];

  if (env.RESEND_API_KEY) {
    const defaultFrom = `${BRAND.name} <${BRAND.supportEmail}>`;
    const from = env.RESEND_FROM || defaultFrom;
    const to   = env.RESEND_TO   || BRAND.supportEmail;

    const notification = renderNotification(contactData, ctx);
    tasks.push(sendEmail(env.RESEND_API_KEY, {
      from, to: [to], reply_to: p.email, ...notification,
    }));

    if (env.RESEND_AUTOREPLY === 'true') {
      const auto = renderAutoReply(contactData);
      tasks.push(sendEmail(env.RESEND_API_KEY, {
        from, to: [p.email], reply_to: BRAND.supportEmail, ...auto,
      }));
    }
  }

  if (env.SLACK_WEBHOOK_URL) {
    tasks.push(fetch(env.SLACK_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        text: `New inquiry on ${site}: *${p.name}* (${p.email})`,
        blocks: [
          { type: 'header', text: { type: 'plain_text', text: `New inquiry on ${site}` } },
          { type: 'section', fields: [
            { type: 'mrkdwn', text: `*Name*\n${p.name}` },
            { type: 'mrkdwn', text: `*Email*\n${p.email}` },
            { type: 'mrkdwn', text: `*Company*\n${p.company || '—'}` },
            { type: 'mrkdwn', text: `*Country*\n${p.country || '—'}` },
            { type: 'mrkdwn', text: `*Category*\n${p.category || '—'}` },
          ]},
          { type: 'section', text: { type: 'mrkdwn', text: `*Message*\n${p.message}` } },
          { type: 'context', elements: [{ type: 'mrkdwn', text: `ref: ${ref} · ua: ${ua}` }] },
        ],
      }),
    }));
  }

  if (env.CONTACT_FORWARD_URL) {
    tasks.push(fetch(env.CONTACT_FORWARD_URL, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ ...p, token: undefined, site, ref, ua, ip, ts }),
    }));
  }

  await Promise.allSettled(tasks);
}

function sendEmail(apiKey: string, payload: {
  from: string;
  to: string[];
  reply_to?: string;
} & RenderedEmail): Promise<Response> {
  return fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}

function clientIp(req: Request): string {
  return req.headers.get('cf-connecting-ip')
      ?? req.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
      ?? '';
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });
}
