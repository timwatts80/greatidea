import { z } from "zod";
import { kv } from "@/lib/kv";
import { env } from "@/lib/env";
import { json, preflight } from "@/lib/cors";

export const runtime = "nodejs";

const KEY = "content:hero";

/**
 * The hero is structured as 3 named phrases. Make currently uses them as the
 * 3 rotating headline phrases in the hero (eyebrow + subhead are hard-coded
 * in Make for now). Generic naming keeps the API decoupled from layout choices.
 */
const FALLBACK = {
  phrase1: "Elevate Your Business with AI",
  phrase2: "Create Your Next Innovation",
  phrase3: "Transform Your Digital Vision",
};

const HeroSchema = z.object({
  phrase1: z.string().trim().min(1).max(200),
  phrase2: z.string().trim().min(1).max(200),
  phrase3: z.string().trim().min(1).max(200),
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
