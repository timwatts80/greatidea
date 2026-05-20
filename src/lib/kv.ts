import { createClient } from "@vercel/kv";
import { env } from "./env";

/**
 * Vercel KV client. Lazy-initialized so env throws happen at first use,
 * not at import time (keeps build/test friendly).
 */
let _kv: ReturnType<typeof createClient> | null = null;

export function kv() {
  if (!_kv) {
    _kv = createClient({
      url: env.KV_REST_API_URL,
      token: env.KV_REST_API_TOKEN,
    });
  }
  return _kv;
}
