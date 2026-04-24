import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { getStripeClient } from '../../../lib/stripe';
import type Stripe from 'stripe';

interface CartItem {
  productId: string;
  variantId?: string | null;
  quantity: number;
}

interface DBProduct {
  id: string;
  title: string;
  base_price: number;
}

interface DBVariant {
  id: string;
  product_id: string;
  title: string;
  price_adjustment: number;
}

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const payload = (await request.json()) as { items?: CartItem[] };
    const items = payload?.items;

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cart payload is empty.' }), { status: 400 });
    }

    const db = env.DB;
    if (!db) throw new Error('Database connection failed.');

    const productIds = [...new Set(items.map((item) => item.productId))];
    const productPlaceholders = productIds.map(() => '?').join(', ');

    const variantIds = [...new Set(items.filter((item) => item.variantId).map((item) => item.variantId as string))];
    const variantPlaceholders = variantIds.map(() => '?').join(', ');

    const { results: products } = await db
      .prepare(`SELECT id, title, base_price FROM products WHERE id IN (${productPlaceholders})`)
      .bind(...productIds)
      .all<DBProduct>();

    if (!products || products.length === 0) {
      return new Response(JSON.stringify({ error: 'Invalid SKUs detected.' }), { status: 400 });
    }

    let variants: DBVariant[] = [];
    if (variantIds.length > 0) {
      const { results } = await db
        .prepare(`SELECT id, product_id, title, price_adjustment FROM product_variants WHERE id IN (${variantPlaceholders})`)
        .bind(...variantIds)
        .all<DBVariant>();
      variants = results;
    }

    const lineItems: any[] = [];

    for (const item of items) {
      const dbProduct = products.find((p: DBProduct) => p.id === item.productId);
      if (!dbProduct) continue;

      let finalPrice = dbProduct.base_price;
      let titleSuffix = '';

      if (item.variantId) {
        const variantResult = variants.find((v) => v.id === item.variantId && v.product_id === item.productId);
        if (variantResult) {
          finalPrice += variantResult.price_adjustment;
          titleSuffix = ` - ${variantResult.title}`;
        }
      }

      const unitAmountInCents = Math.round(finalPrice * 100);

      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${dbProduct.title}${titleSuffix}`,
            metadata: {
              productId: item.productId,
              variantId: item.variantId || 'base',
            },
          },
          unit_amount: unitAmountInCents,
        },
        quantity: item.quantity,
      });
    }

    if (lineItems.length === 0) {
      return new Response(JSON.stringify({ error: 'No valid products mapped to checkout.' }), { status: 400 });
    }

    const user = locals.user;
    const cartHashString = JSON.stringify(items) + (user?.id || 'guest_checkout');
    const hashBuffer = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(cartHashString));
    const idempotencyKey = Array.from(new Uint8Array(hashBuffer)).map((b) => b.toString(16).padStart(2, '0')).join('');

    const origin = new URL(request.url).origin;
    const stripe = getStripeClient();

    const sessionPayload: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'payment',
      success_url: `${origin}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/cart`,
      automatic_tax: { enabled: true },
      metadata: { source: 'symeno_storefront_v1' },
    };

    if (user?.email) {
      sessionPayload.customer_email = user.email;
    }

    const session = await stripe.checkout.sessions.create(sessionPayload, { idempotencyKey });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: unknown) {
    if (error instanceof Error) console.error('[STRIPE_SESSION_ERROR]', error.message);
    return new Response(JSON.stringify({ error: 'Checkout initialization failed. Please try again.' }), { status: 500 });
  }
};