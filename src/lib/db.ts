// src/lib/db.ts
// @ts-ignore - Bypass TS warnings if cloudflare types aren't fully synced yet
import { env } from "cloudflare:workers";

export function getDb(context: any) {
  // The new Astro v6 / Cloudflare standard for accessing bindings
  return (env as any).DB;
}
