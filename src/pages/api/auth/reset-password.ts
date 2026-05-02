import type { APIRoute } from 'astro';
import { hashPassword } from '../../../lib/crypto';
import { z } from 'zod';
import { env } from 'cloudflare:workers';

const schema = z.object({
  token: z.string().min(10),
  newPassword: z.string().min(8)
});

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json() as any;
    const { token, newPassword } = schema.parse(body);
    const db = env?.DB;
    const kv = env?.SESSION;

    if (!db || !kv) return new Response(JSON.stringify({ error: 'Database Offline' }), { status: 500 });

    const userId = await kv.get(`reset:${token}`);
    if (!userId) {
      return new Response(JSON.stringify({ error: 'Reset token is invalid or has expired.' }), { status: 400 });
    }

    const newSalt = crypto.getRandomValues(new Uint8Array(16));
    const newHash = await hashPassword(newPassword, newSalt);

    await db.prepare('UPDATE customers SET password_hash = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2')
      .bind(newHash, userId)
      .run();

    // Invalidate the token immediately so it cannot be reused
    await kv.delete(`reset:${token}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid Request' }), { status: 400 });
  }
};