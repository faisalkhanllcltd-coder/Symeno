import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { orderId, email } = await request.json() as { orderId: string, email: string };
    const db = env?.DB;

    if (!db) {
      console.error('[DB_FATAL] Database binding offline during order tracking.');
      return new Response(JSON.stringify({ error: 'System offline. Please try again later.' }), { status: 500 });
    }

    // Secure query: Must match BOTH ID and Email to prevent enumeration attacks
    const order = await db.prepare(
      'SELECT id, status, created_at FROM orders WHERE id = ?1 AND customer_email = ?2 LIMIT 1'
    ).bind(orderId, email).first();

    if (!order) {
      // Intentional generic error to prevent data mining
      return new Response(JSON.stringify({ error: 'No order found matching those details.' }), { status: 404 });
    }

    return new Response(JSON.stringify(order), { 
      status: 200, 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid request payload.' }), { status: 400 });
  }
};
