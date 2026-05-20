import { z } from "zod";
import { kv } from "@/lib/kv";
import { env } from "@/lib/env";
import { json, preflight } from "@/lib/cors";

export const runtime = "nodejs";

const KEY = "content:hero";

/**
 * Editable hero content. Currently the API only controls the subhead paragraph.
 * The hero headline + cycling animation are owned by Make (hardcoded in their
 * component). Add more fields here as the editing surface grows.
 */
const FALLBACK = {
  subhead:
    "Custom AI solutions powered by Claude for creative projects, business workflows, and digital innovation. From intelligent automation to cutting-edge interactive experiences.",
};

const HeroSchema = z.object({
  subhead: z.string().trim().min(1).max(500),
});

type Hero = z.infer<typeof HeroSchema>;

export async function OPTIONS(req: Request) {
  return preflight(req);
}

export async function GET(req: Request) {
  const stored = (await kv().get<Hero>(KEY)) ?? FALLBACK;
  return json(req, stored, {
    headers: {
      // No cache: admin edits should reflect on the very next reload.
      // KV reads are fast enough that we don't need an edge cache here.
      "Cache-Control": "no-store, must-revalidate",
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
