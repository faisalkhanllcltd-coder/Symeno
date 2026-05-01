import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('product_id');

    if (!productId) return new Response('Missing Product ID', { status: 400 });

    const { results } = await env.DB.prepare(
      `
      SELECT r.id, r.rating, r.title, r.comment, r.created_at, r.is_verified_buyer,
             u.first_name, u.last_name 
      FROM reviews r
      LEFT JOIN customers u ON r.customer_id = u.id
      WHERE r.product_id = ?1 AND r.status = 'APPROVED'
      ORDER BY r.created_at DESC
    `
    )
      .bind(productId)
      .all();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response('Fetch Failed', { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    const data = (await request.json()) as any;
    const db = env.DB;
    let customerId = null;
    let isVerified = 0;

    if (locals.user) {
      customerId = locals.user.id;
      // Trust Mechanism: Verify purchase history
      const hasPurchased = await db
        .prepare(
          `
        SELECT o.id FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN product_variants v ON oi.variant_id = v.id
        WHERE o.customer_id = ?1 AND v.product_id = ?2 AND o.status IN ('SHIPPED', 'DELIVERED')
      `
        )
        .bind(customerId, data.product_id)
        .first();

      if (hasPurchased) isVerified = 1;
    } else {
      // Must be logged in to review in the $10M standard to prevent spam
      return new Response(
        JSON.stringify({
          error: 'Authentication required to submit trusted reviews.',
        }),
        { status: 401 }
      );
    }

    await db
      .prepare(
        `
      INSERT INTO reviews (id, product_id, customer_id, rating, title, comment, is_verified_buyer, status)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'PENDING')
    `
      )
      .bind(
        crypto.randomUUID(),
        data.product_id,
        customerId,
        data.rating,
        data.title,
        data.comment,
        isVerified
      )
      .run();

    return new Response(
      JSON.stringify({ success: true, verified: isVerified === 1 }),
      { status: 201 }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
