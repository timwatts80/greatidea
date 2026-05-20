import { env } from "./env";

/**
 * Verify a Cloudflare Turnstile token server-side.
 * Returns true if valid. Logs failure reasons in dev.
 */
export async function verifyTurnstile(
  token: string | undefined,
  remoteIp?: string | null,
): Promise<boolean> {
  if (!token) return false;

  const body = new URLSearchParams({
    secret: env.TURNSTILE_SECRET,
    response: token,
  });
  if (remoteIp) body.set("remoteip", remoteIp);

  const res = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    { method: "POST", body },
  );

  if (!res.ok) return false;
  const data = (await res.json()) as { success: boolean; "error-codes"?: string[] };

  if (!data.success && env.NODE_ENV !== "production") {
    console.warn("Turnstile verify failed:", data["error-codes"]);
  }
  return data.success;
}
