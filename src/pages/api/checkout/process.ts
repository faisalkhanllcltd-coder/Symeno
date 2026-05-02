import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json() as any;
    const db = env.DB;
    if (!db) throw new Error("DB Offline");

    const orderId = `ORD-${Date.now()}`;
    await db.prepare("INSERT INTO orders (id, user_id, customer_email, shipping_name, shipping_address, total_amount, status) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending_processing')")
      .bind(orderId, context.locals.user?.id || 'guest', body.customer_email, body.shipping_name, body.shipping_address, 0)
      .run();

    return new Response(JSON.stringify({ success: true, orderId }));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
}