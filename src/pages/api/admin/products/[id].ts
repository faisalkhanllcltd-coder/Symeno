import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const PUT: APIRoute = async ({ request, params, locals }) => {
  if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'staff')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const data = await request.json();
    const db = env.DB;

    await db.prepare(`
      UPDATE products 
      SET title = ?1, base_price = ?2, retail_price = ?3, description = ?4, updated_at = CURRENT_TIMESTAMP 
      WHERE id = ?5
    `).bind(
      data.title,
      data.base_price,
      data.retail_price,
      data.description,
      params.id
    ).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'staff')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const db = env.DB;

    await db.batch([
      db.prepare('DELETE FROM product_variants WHERE product_id = ?1').bind(params.id),
      db.prepare('DELETE FROM products WHERE id = ?1').bind(params.id)
    ]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};