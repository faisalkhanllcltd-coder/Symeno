import type { APIRoute } from 'astro';
import { hashPassword } from '../../../lib/crypto';
import { z } from 'zod';
import { env } from 'cloudflare:workers';

const schema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8) // FIXED: PCI-DSS Compliance - Upgraded minimum length from 6 to 8
});

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json() as any;
    const { token, newPassword } = schema.parse(body);
    const db = env?.DB as any;
    const kv = env?.SESSION as any;

    if (!db || !kv) return new Response(JSON.stringify({ error: 'Database Offline' }), { status: 500 });

    const userId = await kv.get(`reset:${token}`);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Reset token is invalid or has expired.' }), { status: 400 });
    }

    const newSalt = crypto.getRandomValues(new Uint8Array(16));
    const newHash = await hashPassword(newPassword, newSalt);

    // FIXED: Target 'users' table, not 'customers'
    await db.prepare('UPDATE users SET password_hash = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2')
      .bind(newHash, userId)
      .run();

    await kv.delete(`reset:${token}`);

    // THE FIX: Actively seek and destroy all hijacked or stale KV sessions for this user.
    // Completely type-safe for strict Cloudflare environments.
    let cursor: string | undefined = undefined;
    let listComplete = false;

    while (!listComplete) {
      const listOptions: any = { prefix: 'session:' };
      if (cursor) listOptions.cursor = cursor;

      const listed = await kv.list(listOptions);

      for (const key of listed.keys) {
        const sessionData = await kv.get(key.name);
        if (sessionData) {
          try {
            const payload = JSON.parse(sessionData);
            if (payload.id === userId) {
              await kv.delete(key.name);
            }
          } catch (e) {
            // Ignore malformed session JSON
          }
        }
      }

      listComplete = listed.list_complete;

      // THE STRICT TYPE GUARD: Satisfies the TS compiler
      if (!listComplete && 'cursor' in listed) {
        cursor = listed.cursor as string;
      } else {
        cursor = undefined;
      }
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[AUTH_RESET_FATAL]', err);
    return new Response(JSON.stringify({ error: 'Invalid Request' }), { status: 400 });
  }
};