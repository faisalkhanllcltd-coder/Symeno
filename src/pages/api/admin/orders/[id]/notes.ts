import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request, params, locals }) => {
  try {
    if (
      !locals.user ||
      (locals.user.role !== 'admin' && locals.user.role !== 'staff')
    )
      throw new Error('UNAUTHORIZED');
    const { note } = (await request.json()) as any;

    await env.DB.prepare(
      'INSERT INTO order_notes (id, order_id, author_id, note) VALUES (?1, ?2, ?3, ?4)'
    )
      .bind(crypto.randomUUID(), params.id, locals.user.id, note)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
