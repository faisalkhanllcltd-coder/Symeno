import type { APIRoute } from 'astro';
import { getStripeClient } from '../../../../../lib/stripe';

export const POST: APIRoute = async ({ request, params, locals }) => {
  try {
    if (!locals.user || locals.user.role !== 'admin')
      throw new Error('UNAUTHORIZED: Admin only.');

    // Removed unused 'reason' to clear TS warnings
    const { amount, stripe_payment_id } = (await request.json()) as any;

    // Extract dynamic env from locals safely
    const env = (locals as any).runtime?.env;
    if (!env || !env.DB) {
      return new Response(JSON.stringify({ error: 'Database Offline' }), { status: 503 });
    }

    // Process via Stripe by injecting env
    const stripe = getStripeClient(env);
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