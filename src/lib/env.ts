/**
 * Typed env access. Throws on missing required vars at first use.
 * Add NEW keys to .env.example AND here.
 */

function required(name: string): string {
  const v = process.env[name];
  if (!v) throw new Error(`Missing required env var: ${name}`);
  return v;
}

function optional(name: string): string | undefined {
  return process.env[name];
}

export const env = {
  // Email
  get RESEND_API_KEY() { return required("RESEND_API_KEY"); },
  EMAIL_FROM: process.env.EMAIL_FROM ?? "Great Idea CS <hello@send.greatidea-cs.com>",
  EMAIL_NOTIFY_TO: process.env.EMAIL_NOTIFY_TO ?? "tim@onemorelight.cc",

  // Spam
  get TURNSTILE_SECRET() { return required("TURNSTILE_SECRET"); },

  // Storage (Vercel KV / Upstash)
  get KV_REST_API_URL() { return required("KV_REST_API_URL"); },
  get KV_REST_API_TOKEN() { return required("KV_REST_API_TOKEN"); },

  // Admin (PATCH endpoints)
  get ADMIN_TOKEN() { return required("ADMIN_TOKEN"); },

  // CRM (Notion)
  get NOTION_TOKEN() { return required("NOTION_TOKEN"); },
  get NOTION_LEADS_DB_ID() { return required("NOTION_LEADS_DB_ID"); },

  // CORS
  ALLOWED_ORIGINS: (process.env.ALLOWED_ORIGINS ??
    "https://greatidea-cs.com,https://www.greatidea-cs.com")
    .split(",")
    .map((s) => s.trim()),

  // Site
  SITE_URL: process.env.SITE_URL ?? "https://greatidea-cs.com",

  // Optional
  NODE_ENV: optional("NODE_ENV") ?? "development",
};
