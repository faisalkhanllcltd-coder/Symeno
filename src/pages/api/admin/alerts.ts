import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    if (
      !locals.user ||
      (locals.user.role !== 'admin' && locals.user.role !== 'staff')
    )
      throw new Error('UNAUTHORIZED');
    const { id } = (await request.json()) as any;

    const db = env.DB;
    if (id === 'ALL') {
      await db
        .prepare('UPDATE admin_alerts SET is_read = 1 WHERE is_read = 0')
        .run();
    } else {
      await db
        .prepare('UPDATE admin_alerts SET is_read = 1 WHERE id = ?1')
        .bind(id)
        .run();
    }
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
