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

  // Notification email is the only hard requirement. If it failed, tell the client.
  if (notify.status === "rejected") {
    console.error("notify email failed:", notify.reason);
    return json(req, { ok: false, error: "email_failed" }, { status: 502 });
  }

  if (confirm.status === "rejected") console.error("confirm email failed:", confirm.reason);
  if (crmResult.status === "rejected") console.error("notion write failed:", crmResult.reason);

  return json(req, {
    ok: true,
    id: notify.status === "fulfilled" ? notify.value.data?.id : null,
  });
}
