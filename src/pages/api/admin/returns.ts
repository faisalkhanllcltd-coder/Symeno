import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (
      !locals.user ||
      (locals.user.role !== 'admin' && locals.user.role !== 'staff')
    )
      throw new Error('UNAUTHORIZED');
    const { results } = await env.DB.prepare(
      "SELECT id, stripe_session_id, customer_email, user_id, customer_id, total_amount, amount_total, status, tracking_number, carrier, shipping_address, fulfilled_at, created_at, updated_at FROM orders WHERE status LIKE '%RETURN%' ORDER BY updated_at DESC"
    ).all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};
