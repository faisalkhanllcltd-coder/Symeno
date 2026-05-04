import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async (context) => {
  const url = new URL(context.request.url);
  const orderId = url.searchParams.get('orderId');

  if (!orderId) {
    return new Response(JSON.stringify([]), { status: 200 });
  }

  try {
    const db = (env as any).DB;
    if (!db) {
      return new Response(JSON.stringify([]), { status: 200 });
    }

    const { results } = await db.prepare(
      `SELECT oi.id, oi.quantity, oi.unit_price, oi.locked_price,
              COALESCE(p.title, 'Unknown Item') as title
       FROM order_items oi
       LEFT JOIN products p ON oi.product_id = p.id
       WHERE oi.order_id = ?1`
    ).bind(orderId).all();

    return new Response(JSON.stringify(results || []), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[ORDER_ITEMS_API_ERROR]', e);
    return new Response(JSON.stringify([]), { status: 200 });
  }
};
