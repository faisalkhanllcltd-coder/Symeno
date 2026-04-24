import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { order_id, email } = (await request.json()) as any;

    if (!order_id || !email)
      throw new Error('Order ID and Email are strictly required.');

    // JOIN users to verify the email matches the order owner
    const order = await env.DB.prepare(
      `
      SELECT o.id, o.status, o.created_at, o.tracking_url 
      FROM orders o
      JOIN users u ON o.customer_id = u.id
      WHERE o.id = ?1 AND LOWER(u.email) = LOWER(?2)
    `
    )
      .bind(order_id, email)
      .first();

    if (!order) {
      // Intentionally vague error to prevent email harvesting
      return new Response(
        JSON.stringify({
          error: 'No matching records found for this combination.',
        }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(order), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
