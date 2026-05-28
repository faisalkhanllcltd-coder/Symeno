import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { password } = (await request.json()) as any;

    // Note: Add real password verification logic here against password_hash
    if (!password) throw new Error('Password verification required');

    // Soft Delete
    await env.DB.prepare(
      'UPDATE users SET is_suspended = 1, deleted_at = CURRENT_TIMESTAMP WHERE id = ?1'
    )
      .bind(locals.user.id)
      .run();

    // Trigger session invalidation (cookie clearing) via headers in production
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 400 });
  }
};
