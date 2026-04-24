import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import Stripe from 'stripe';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const { items, currency = 'usd' } = (await request.json()) as any;
    if (!items || !Array.isArray(items) || items.length === 0) {
      throw new Error('Cart is empty or corrupted.');
    }

    const db = env.DB;
    const productIds = items.map((i: any) => String(i.productId));

    const { results } = await db
      .prepare(`
        SELECT id, base_price
        FROM products
        JOIN json_each(?1) ON products.id = json_each.value
      `)
      .bind(JSON.stringify(productIds))
      .all();

    let totalCents = 0;
    for (const clientItem of items) {
      const dbProduct = results.find((r: any) => r.id === clientItem.productId);
      if (dbProduct) {
        totalCents += Math.round(dbProduct.base_price * clientItem.quantity * 100);
      }
    }

    if (totalCents < 15000) {
      totalCents += 1500; // Flat $15 shipping
    }

    const stripe = new Stripe(env.STRIPE_SECRET_KEY as string);

    const paymentIntent = await stripe.paymentIntents.create({
      amount: totalCents,
      currency: currency.toLowerCase(),
      automatic_payment_methods: { enabled: true },
      metadata: {
        customer_id: locals.user ? locals.user.id : 'guest',
        cart_data: JSON.stringify(items.map((i: any) => ({ id: i.productId, qty: i.quantity }))),
      },
    });

    return new Response(JSON.stringify({ clientSecret: paymentIntent.client_secret }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};