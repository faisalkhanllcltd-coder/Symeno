import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json() as any;
    const db = env.DB as any;
    const queue = (env as any).EMAIL_QUEUE; // The binding to your new Mailroom

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
    const productIds = items.map((i: any) => i.productId);
    const placeholders = productIds.map(() => '?').join(',');

    // 3. QUERY THE EDGE DATABASE
    const { results: realProducts } = await db.prepare(
      `SELECT id, price, name FROM catalog_cache WHERE id IN (${placeholders})`
    ).bind(...productIds).all();

    // 4. SERVER-SIDE CRYPTOGRAPHIC CALCULATION
    let verifiedSubtotal = 0;
    const verifiedLineItems = [];

    for (const clientItem of items) {
      const realProduct = realProducts.find((p: any) => p.id === clientItem.productId);

      if (!realProduct) {
        return new Response(JSON.stringify({
          error: `An item in your cart is no longer available. Please refresh.`
        }), { status: 409 });
      }

      const qty = Math.min(10, Math.max(1, parseInt(clientItem.qty, 10) || 1));
      const securePrice = Number(realProduct.price) || 0;

      verifiedSubtotal += securePrice * qty;

      verifiedLineItems.push({
        productId: realProduct.id,
        name: realProduct.name,
        price: securePrice,
        qty: qty
      });
    }

    const shipping = verifiedSubtotal > 150 ? 0 : 15;
    const verifiedTotal = verifiedSubtotal + shipping;

    // 5. TRANSACTION PREPARATION
    const orderId = `SYM-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    const userId = context.locals.user?.id || 'guest';

    // 6. BATCH EXECUTION
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

    // 7. ASYNC NOTIFICATION (The Mailroom Handoff)
    if (queue) {
      await queue.send({
        type: 'ORDER_CONFIRMATION',
        to: customer_email,
        subject: `Deployment Secured: ${orderId}`,
        htmlBody: `
          <div style="font-family: monospace; background: #0a0a0a; color: #e5e5e5; padding: 40px;">
            <h1 style="color: #36F4A4; text-transform: uppercase; letter-spacing: 2px;">Deployment Secured</h1>
            <p style="color: #a3a3a3;">Order Reference: <strong>${orderId}</strong></p>
            <p>Your hardware acquisition has been logged in the master ledger.</p>
            <p>Total Authorized: <strong>$${verifiedTotal.toFixed(2)}</strong></p>
            <p>Logistics will dispatch to ${shipping_name} at ${shipping_address} within 24 hours.</p>
            <br/>
            <p style="font-size: 10px; color: #525252; text-transform: uppercase;">Symeno Secure Logistics</p>
          </div>
        `
      });
      console.log(`[QUEUE] Pushed order ${orderId} to email workers.`);
    }

    // 8. SECURE HANDOFF
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