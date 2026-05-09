import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const PUT: APIRoute = async ({ request, params, locals }) => {
  if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'staff')) {
    return new Response('Unauthorized', { status: 401 });
  }

  try {
    const data = await request.json() as any;
    const db = env.DB as any;

    // 100% CLAUDE SCHEMA: Updating only the specific edge columns
    await db.prepare(`
      UPDATE catalog_cache 
      SET name = ?1, slug = ?2, brand = ?3, category = ?4, price = ?5, description = ?6, in_stock = ?7, scraped_at = ?8 
      WHERE id = ?9
    `).bind(
      data.name,
      data.slug,
      data.brand,
      data.category,
      data.price,
      data.description,
      data.in_stock,
      Math.floor(Date.now() / 1000), // Refresh the timestamp on edit
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
    const db = env.DB as any;

    // Direct deletion from the singular unified cache table
    await db.prepare('DELETE FROM catalog_cache WHERE id = ?1').bind(params.id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};