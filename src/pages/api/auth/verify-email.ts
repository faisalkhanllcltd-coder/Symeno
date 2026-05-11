import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ url, redirect }) => {
  const token = url.searchParams.get('token');
  if (!token) return new Response('Missing token.', { status: 400 });

  try {
    const db = env.DB;
    if (!db) return new Response('Database missing.', { status: 500 });

    const user = await db.prepare('SELECT id, pending_email FROM customers WHERE verification_token = ?1').bind(token).first();

    if (!user) return new Response('Invalid or expired token.', { status: 400 });

    // Promote pending_email to primary email and verify
    await db.prepare('UPDATE customers SET email = ?1, pending_email = NULL, verification_token = NULL, is_verified = 1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2')
      .bind(user.pending_email, user.id)
      .run();

    // THE FIX: Redirect back to the auth terminal rather than showing a dead plain-text page
    return redirect('/auth/login?verified=true');
  } catch (err) {
    console.error('[AUTH_VERIFY_EMAIL_ERROR]', err);
    return new Response('Failed to verify email.', { status: 500 });
  }
};