
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params }) => {
  try {
    const db = env.DB;
    const { results } = await db.prepare('SELECT * FROM products WHERE id = ?1').bind(params.id).all();
    if (!results.length) return new Response('Not Found', { status: 404 });
    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) { return new Response('Error', { status: 500 }); }
};

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const data = await request.json() as any;
    await env.DB.prepare(
      UPDATE products SET title = ?1, base_price = ?2, retail_price = ?3, description = ?4, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?5
    ).bind(data.title, data.base_price, data.retail_price, data.description, params.id).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) { return new Response('Error', { status: 500 }); }
};

export const DELETE: APIRoute = async ({ params }) => {
  try {
    await env.DB.prepare('DELETE FROM products WHERE id = ?1').bind(params.id).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) { return new Response('Error', { status: 500 }); }
};
