import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (
    !locals.user ||
    (locals.user.role !== 'admin' && locals.user.role !== 'staff')
  )
    throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    enforceAdmin(locals);
    // Fetch slug-level data by joining products and variants
    const { results } = await env.DB.prepare(
      `
      SELECT v.id as variant_id, p.title as product_title, v.slug, v.title as variant_title, 
             v.inventory_quantity as stock, p.is_active, p.id as product_id, p.category, p.brand
      FROM product_variants v
      JOIN products p ON v.product_id = p.id
      ORDER BY p.title ASC, v.slug ASC
    `
    ).all();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};
