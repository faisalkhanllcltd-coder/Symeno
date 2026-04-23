import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ params, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    
    // In a real implementation, this queries order_items and returns an array 
    // of variant IDs and quantities that the client-side cart store will ingest.
    // Assuming a structured order_items table exists:
    const { results } = await env.DB.prepare(`
      SELECT variant_id, quantity 
      FROM order_items 
      WHERE order_id = ?1
    `).bind(params.id).all();

    return new Response(JSON.stringify({ items: results }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Reorder Failed' }), { status: 500 });
  }
};