import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    const { results } = await env.DB.prepare(
      `
      SELECT id, status, rma_reason, updated_at 
      FROM orders 
      WHERE id = ?1 AND customer_id = ?2
    `
    )
      .bind(params.id, locals.user.id)
      .all();

    if (results.length === 0) return new Response('Not Found', { status: 404 });
    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};
