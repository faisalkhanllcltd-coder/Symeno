import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    const { results } = await env.DB.prepare(
      `
      SELECT id, created_at, total, status, tracking_url 
      FROM orders 
      WHERE customer_id = ?1 
      ORDER BY created_at DESC
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
