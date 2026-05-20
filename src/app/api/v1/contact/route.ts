import { z } from "zod";
import { Resend } from "resend";
import { env } from "@/lib/env";
import { json, preflight } from "@/lib/cors";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactLimiter, clientId } from "@/lib/rate-limit";
import { createLead } from "@/lib/notion";
import { NotificationEmail } from "@/emails/notification";
import { ConfirmationEmail } from "@/emails/confirmation";

export const runtime = "nodejs";

const BUSINESS_TYPES = [
  "Real estate",
  "Coach",
  "Fitness",
  "Creator",
  "Other",
] as const;

const ContactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().toLowerCase().email("Valid email required").max(200),
  business_type: z.enum(BUSINESS_TYPES).optional(),
  message: z.string().trim().max(2000).optional(),
  turnstile_token: z.string().min(1, "Spam check failed"),
});

export async function OPTIONS(req: Request) {
  return preflight(req);
}

export async function POST(req: Request) {
  // 1. Parse + validate body
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(req, { ok: false, error: "invalid_json" }, { status: 400 });
  }

  const parsed = ContactSchema.safeParse(body);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".");
      if (!errors[key]) errors[key] = issue.message;
    }
    return json(req, { ok: false, errors }, { status: 400 });
  }
  const data = parsed.data;
  const ip = clientId(req);

  // 2. Rate limit
  const { success: notLimited } = await contactLimiter().limit(ip);
  if (!notLimited) {
    return json(req, { ok: false, error: "rate_limited" }, { status: 429 });
  }

  // 3. Spam check
  const human = await verifyTurnstile(data.turnstile_token, ip);
  if (!human) {
    return json(req, { ok: false, error: "spam_check_failed" }, { status: 400 });
  }

  // 4. Fan out: emails + Notion. Fail soft on Notion; hard on email.
  const resend = new Resend(env.RESEND_API_KEY);
  const receivedAt = new Date().toLocaleString("en-US", {
    timeZone: "America/Denver",
    dateStyle: "medium",
    timeStyle: "short",
  });

  const [notify, confirm, crmResult] = await Promise.allSettled([
    resend.emails.send({
      from: env.EMAIL_FROM,
      to: env.EMAIL_NOTIFY_TO,
      replyTo: data.email,
      subject: `New lead — ${data.name}`,
      react: NotificationEmail({
        name: data.name,
        email: data.email,
        businessType: data.business_type,
        message: data.message,
        ip,
        receivedAt,
      }),
    }),
    resend.emails.send({
      from: env.EMAIL_FROM,
      to: data.email,
      subject: "Thanks — we got your note",
      react: ConfirmationEmail({ name: data.name, siteUrl: env.SITE_URL }),
    }),
    createLead({
      name: data.name,
      email: data.email,
      businessType: data.business_type,
      message: data.message,
      ip,
    }),
  ]);

  // Resend's SDK returns errors two ways:
  //   1. SDK-level rejection (network, auth) → Promise rejected
  //   2. API-level error (unverified domain, bad from address) → Promise fulfilled with { error }
  // Treat both as failure for the notification email.
  const notifyError = extractResendError(notify);
  if (notifyError) {
    console.error("notify email failed:", notifyError);
    return json(req, {
      ok: false,
      error: "email_failed",
      // Surface the actual reason in non-production for easier diagnosis.
      ...(env.NODE_ENV !== "production" ? { detail: notifyError } : {}),
    }, { status: 502 });
  }

  const confirmError = extractResendError(confirm);
  if (confirmError) console.error("confirm email failed:", confirmError);
  if (crmResult.status === "rejected") {
    console.error("notion write failed:", String(crmResult.reason), crmResult.reason);
  }

  const notifyId =
    notify.status === "fulfilled" && notify.value && "data" in notify.value
      ? notify.value.data?.id ?? null
      : null;

  return json(req, { ok: true, id: notifyId });
}

/**
 * Pull a structured error out of a Promise.allSettled result for resend.emails.send().
 * Returns null if the send succeeded.
 */
function extractResendError(
  settled: PromiseSettledResult<unknown>,
): { name?: string; message?: string; statusCode?: number; raw: string } | null {
  if (settled.status === "rejected") {
    const r = settled.reason as { name?: string; message?: string; statusCode?: number } | undefined;
    return {
      name: r?.name,
      message: r?.message,
      statusCode: r?.statusCode,
      raw: String(settled.reason),
    };
  }
  const value = settled.value as { error?: { name?: string; message?: string; statusCode?: number } | null } | null;
  if (value && value.error) {
    return {
      name: value.error.name,
      message: value.error.message,
      statusCode: value.error.statusCode,
      raw: JSON.stringify(value.error),
    };
  }
  return null;
}
