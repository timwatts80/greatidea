import { z } from "zod";
import { kv } from "@/lib/kv";
import { env } from "@/lib/env";
import { json, preflight } from "@/lib/cors";

export const runtime = "nodejs";

const KEY = "content:hero";

/**
 * The hero is structured as 3 named phrases. Make is free to render them
 * however the design calls for — typically:
 *   phrase1 → eyebrow / small label above the headline
 *   phrase2 → main headline
 *   phrase3 → subhead paragraph
 * The naming is intentionally generic so the API doesn't constrain layout.
 */
const FALLBACK = {
  phrase1: "Creative Services · Tech that fits",
  phrase2: "Your great idea, built right.",
  phrase3:
    "We design websites, apps, and the quiet systems that run your business — so you can spend your time on the part only you can do.",
};

const HeroSchema = z.object({
  phrase1: z.string().trim().min(1).max(200),
  phrase2: z.string().trim().min(1).max(200),
  phrase3: z.string().trim().min(1).max(500),
});

type Hero = z.infer<typeof HeroSchema>;

export async function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request) {
  const stored = (await kv().get<Hero>(KEY)) ?? FALLBACK;
  return json(req, stored, {
    headers: {
      // Short cache: lets Make fetch fresh content reasonably often.
      "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300",
    },
  });
}

export async function PATCH(req: Request) {
  // Bearer-token auth
  const auth = req.headers.get("authorization") ?? "";
  const token = auth.startsWith("Bearer ") ? auth.slice(7) : "";
  if (!token || token !== env.ADMIN_TOKEN) {
    return json(req, { ok: false, error: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return json(req, { ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Merge over current to allow partial updates
  const current = (await kv().get<Hero>(KEY)) ?? FALLBACK;
  const merged = { ...current, ...(body as Partial<Hero>) };

  const parsed = HeroSchema.safeParse(merged);
  if (!parsed.success) {
    const errors: Record<string, string> = {};
    for (const issue of parsed.error.issues) errors[issue.path.join(".")] = issue.message;
    return json(req, { ok: false, errors }, { status: 400 });
  }

  await kv().set(KEY, parsed.data);
  return json(req, { ok: true, hero: parsed.data });
}
