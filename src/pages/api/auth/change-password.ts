import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { z } from 'zod';

const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(6), // THE FIX: Down from 8 to 6
});

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const data = await request.json();
    const parsed = passwordSchema.safeParse(data);
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid input.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const db = (env as any).DB;
    if (!db) return new Response(JSON.stringify({ error: 'Database missing.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    const user = await db.prepare('SELECT password_hash FROM customers WHERE id = ?1').bind(locals.user.id).first();

    if (!user || !user.password_hash) {
      return new Response(JSON.stringify({ error: 'User not found or password not set.' }), { status: 404, headers: { 'Content-Type': 'application/json' } });
    }

    const [saltHex] = (user.password_hash as string).split(':');
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)));
    const oldHashCheck = await hashPassword(parsed.data.currentPassword, saltBytes);

    if (oldHashCheck !== user.password_hash) {
      return new Response(JSON.stringify({ error: 'Incorrect current password.' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }

    const newSalt = crypto.getRandomValues(new Uint8Array(16));
    const newHash = await hashPassword(parsed.data.newPassword, newSalt);

    await db.prepare('UPDATE customers SET password_hash = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2')
      .bind(newHash, locals.user.id)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[AUTH_CHANGE_PASSWORD_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Password update failed.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};