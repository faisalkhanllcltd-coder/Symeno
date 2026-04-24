import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getStripeClient } from '../../../../../lib/stripe';

export const POST: APIRoute = async ({ request, params, locals }) => {
  try {
    if (!locals.user || locals.user.role !== 'admin')
      throw new Error('UNAUTHORIZED: Admin only.');
    const { amount, reason, stripe_payment_id } = (await request.json()) as any;

    // Process via Stripe
    const stripe = getStripeClient();
    await stripe.refunds.create({
      payment_intent: stripe_payment_id,
      amount: Math.round(amount * 100), // Convert to cents
      reason: 'requested_by_customer',
    });

    // Update DB status atomically
    await env.DB.prepare(
      "UPDATE orders SET status = 'REFUNDED', updated_at = CURRENT_TIMESTAMP WHERE id = ?1"
    )
      .bind(params.id)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
