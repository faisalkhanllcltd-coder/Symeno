// src/pages/api/checkout/process.ts
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json() as any;
    const db = env.DB as any;

    if (!db) {
      console.error('[CHECKOUT_FATAL] Database binding offline.');
      return new Response(JSON.stringify({ error: "Checkout services currently unavailable." }), { status: 503 });
    }

    const { items, customer_email, shipping_name, shipping_address } = body;

    // 1. INPUT VALIDATION
    if (!items || !Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: 'Cannot process an empty cart.' }), { status: 400 });
    }
    if (!customer_email || !shipping_name || !shipping_address) {
      return new Response(JSON.stringify({ error: 'Missing required shipping information.' }), { status: 400 });
    }

    // 2. EXTRACT IDs FOR BATCH QUERY
    // We only trust the productId and the requested quantity from the client.
    const productIds = items.map((i: any) => i.productId);
    const placeholders = productIds.map(() => '?').join(',');

    // 3. QUERY THE EDGE DATABASE (The Absolute Source of Truth)
    const { results: realProducts } = await db.prepare(
      `SELECT id, basePrice, title FROM rapidapi_cache WHERE id IN (${placeholders})`
    ).bind(...productIds).all();

    // 4. SERVER-SIDE CRYPTOGRAPHIC CALCULATION
    let verifiedTotal = 0;
    const verifiedLineItems = [];

    for (const clientItem of items) {
      const realProduct = realProducts.find((p: any) => p.id === clientItem.productId);

      // Defend against stale data (user trying to buy a product that was deleted from the catalog)
      if (!realProduct) {
        return new Response(JSON.stringify({
          error: `Item "${clientItem.name}" is no longer available in our catalog. Please update your cart.`
        }), { status: 409 });
      }

      // Defend against negative numbers or string injection in quantity
      const qty = Math.max(1, parseInt(clientItem.qty, 10) || 1);
      const securePrice = realProduct.basePrice || 0;

      verifiedTotal += securePrice * qty;

      verifiedLineItems.push({
        productId: realProduct.id,
        title: realProduct.title,
        price: securePrice,
        qty: qty
      });
    }

    // 5. TRANSACTION PREPARATION
    const orderId = `SYM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const userId = context.locals.user?.id || 'guest';

    // 6. BATCH EXECUTION (Atomic Write)
    // We use D1 batching to ensure both the Order and the Order Items write together, or fail together.
    const statements = [
      db.prepare(`
        INSERT INTO orders (id, user_id, customer_email, shipping_name, shipping_address, total_amount, status) 
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, 'pending_payment')
      `).bind(orderId, userId, customer_email, shipping_name, shipping_address, verifiedTotal)
    ];

    for (const item of verifiedLineItems) {
      statements.push(
        db.prepare(`
           INSERT INTO order_items (order_id, product_id, quantity, price_at_purchase) 
           VALUES (?1, ?2, ?3, ?4)
         `).bind(orderId, item.productId, item.qty, item.price)
      );
    }

    await db.batch(statements);

    // 7. SECURE HANDOFF
    // This payload is what your frontend will use to initialize the Stripe Payment Intent
    return new Response(JSON.stringify({
      success: true,
      orderId,
      verifiedTotal,
      currency: 'usd'
    }), { status: 200 });

  } catch (e: any) {
    console.error('[CHECKOUT_PROCESS_ERROR]', e);
    return new Response(JSON.stringify({ error: 'A critical error occurred processing your transaction.' }), { status: 500 });
  }
}