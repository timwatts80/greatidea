import { env } from "./env";

/**
 * Build CORS headers for a request. Echoes back the Origin only if it's
 * in the allowlist; otherwise omits ACAO (browser will block the response).
 */
export function corsHeaders(origin: string | null): HeadersInit {
  const allow = origin && env.ALLOWED_ORIGINS.includes(origin) ? origin : "";
  return {
    "Access-Control-Allow-Origin": allow,
    "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization",
    "Access-Control-Max-Age": "86400",
    Vary: "Origin",
  };
}

/** Standard preflight response. */
export function preflight(req: Request): Response {
  return new Response(null, {
    status: 204,
    headers: corsHeaders(req.headers.get("origin")),
  });
}

/** JSON response with CORS headers attached. */
export function json(
  req: Request,
  body: unknown,
  init: ResponseInit = {},
): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...corsHeaders(req.headers.get("origin")),
      ...(init.headers ?? {}),
    },
  });
}
