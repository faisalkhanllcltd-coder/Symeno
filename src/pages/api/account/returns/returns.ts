import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    
    // Fetch returns specific to this customer
    const { results } = await env.DB.prepare(`
      SELECT id, created_at, status, total, rma_reason 
      FROM orders 
      WHERE customer_id = ?1 AND status LIKE '%RETURN%'
      ORDER BY created_at DESC
    `).bind(locals.user.id).all();
    
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const data = await request.json() as any;
    
    // Validate order belongs to user
    const order = await env.DB.prepare('SELECT id FROM orders WHERE id = ?1 AND customer_id = ?2').bind(data.orderId, locals.user.id).first();
    if (!order) throw new Error('Invalid Order ID');

    // 1. Update Order Status to RETURN_REQUESTED
    // 2. (In production) Insert into a dedicated `returns` table mapping specific items and photo URLs.
    // We update the orders table here to trigger the RMA flow in the Admin Panel.
    await env.DB.prepare(
      "UPDATE orders SET status = 'RETURN_REQUESTED', rma_reason = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2"
    ).bind(data.items[0]?.reason || 'General Return', data.orderId).run();

    return new Response(JSON.stringify({ success: true, rma_id: data.orderId }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};