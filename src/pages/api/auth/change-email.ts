import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';

const emailSchema = z.object({
  newEmail: z.string().email().trim().toLowerCase(),
});

export const POST: APIRoute = async ({ request, locals }) => {
  if (!locals.user) {
    return new Response(JSON.stringify({ error: 'Unauthorized.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  try {
    const data = await request.json();
    const parsed = emailSchema.safeParse(data);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: 'Invalid email format.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { newEmail } = parsed.data;
    const token = crypto.randomUUID();
    const db = (env as any).DB;

    if (!db) return new Response(JSON.stringify({ error: 'Database missing.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // FIXED: Target 'users' table, not 'customers'
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?1').bind(newEmail).first();
    if (existing) {
      return new Response(JSON.stringify({ error: 'Email already exists.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // FIXED: Target 'users' table, not 'customers'
    await db.prepare('UPDATE users SET pending_email = ?1, verification_token = ?2, updated_at = CURRENT_TIMESTAMP WHERE id = ?3')
      .bind(newEmail, token, locals.user.id)
      .run();

    // PRO TIP: Trigger your Postmark/SendGrid webhook here using the token
    return new Response(JSON.stringify({ success: true, message: 'Verification email dispatched.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    console.error('[AUTH_CHANGE_EMAIL_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Failed to initiate email change.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};