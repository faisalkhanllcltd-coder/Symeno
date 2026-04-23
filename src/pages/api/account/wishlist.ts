import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    
    // Join wishlist with active products and variants
    const { results } = await env.DB.prepare(`
      SELECT w.id, w.product_id, w.notify_price_drop, w.notify_restock,
             p.title, p.slug, p.base_price, p.image_url, v.inventory_quantity as stock
      FROM wishlists w
      JOIN products p ON w.product_id = p.id
      LEFT JOIN product_variants v ON p.id = v.product_id AND v.is_default = 1
      WHERE w.customer_id = ?1
      ORDER BY w.created_at DESC
    `).bind(locals.user.id).all();
    
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { product_id, notify_price_drop, notify_restock } = await request.json() as any;
    
    // Upsert logic (Add if new, update toggles if existing)
    await env.DB.prepare(`
      INSERT INTO wishlists (id, customer_id, product_id, notify_price_drop, notify_restock)
      VALUES (?1, ?2, ?3, ?4, ?5)
      ON CONFLICT(customer_id, product_id) 
      DO UPDATE SET notify_price_drop = ?4, notify_restock = ?5, updated_at = CURRENT_TIMESTAMP
    `).bind(
      crypto.randomUUID(), locals.user.id, product_id, 
      notify_price_drop ? 1 : 0, notify_restock ? 1 : 0
    ).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { product_id } = await request.json() as any;
    
    await env.DB.prepare('DELETE FROM wishlists WHERE customer_id = ?1 AND product_id = ?2')
      .bind(locals.user.id, product_id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Deletion failed' }), { status: 500 });
  }
};