import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    // FIXED: Targeting user_notifications table and user_id column
    const { results } = await env.DB.prepare(
      `
      SELECT id, type, title, message, is_read, action_url, created_at 
      FROM user_notifications 
      WHERE user_id = ?1 
      ORDER BY is_read ASC, created_at DESC 
      LIMIT 50
    `
    )
      .bind(locals.user.id)
      .all();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { id, action } = (await request.json()) as any;

    const db = env.DB;

    if (action === 'MARK_ALL_READ') {
      await db
        .prepare(
          // FIXED: Targeting user_notifications table and user_id column
          'UPDATE user_notifications SET is_read = 1 WHERE user_id = ?1 AND is_read = 0'
        )
        .bind(locals.user.id)
        .run();
    } else if (id) {
      // Mark specific notification
      await db
        .prepare(
          // FIXED: Targeting user_notifications table and user_id column
          'UPDATE user_notifications SET is_read = 1 WHERE id = ?1 AND user_id = ?2'
        )
        .bind(id, locals.user.id)
        .run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 400 });
  }
};