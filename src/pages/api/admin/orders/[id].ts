import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT * FROM orders WHERE id = ?1'
    )
      .bind(params.id)
      .all();
    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { status, tracking_url } = (await request.json()) as any;
    await env.DB.prepare(
      'UPDATE orders SET status = ?1, tracking_url = ?2 WHERE id = ?3'
    )
      .bind(status, tracking_url, params.id)
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};
