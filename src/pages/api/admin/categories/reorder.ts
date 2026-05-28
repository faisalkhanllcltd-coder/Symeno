import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (
      !locals.user ||
      (locals.user.role !== 'admin' && locals.user.role !== 'staff')
    )
      throw new Error('UNAUTHORIZED');
    const { updates } = (await request.json()) as {
      updates: { id: string; sort_order: number; parent_id: string | null }[];
    };

    const db = env.DB;
    const statements = updates.map((u) =>
      db
        .prepare(
          'UPDATE categories SET sort_order = ?1, parent_id = ?2 WHERE id = ?3'
        )
        .bind(u.sort_order, u.parent_id, u.id)
    );

    await db.batch(statements);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 400 });
  }
};
