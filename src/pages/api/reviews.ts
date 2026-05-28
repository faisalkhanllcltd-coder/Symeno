import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const productId = url.searchParams.get('product_id');

    if (!productId) return new Response('Missing Product ID', { status: 400 });

    // FIXED: Target 'users' table via 'user_id' instead of 'customers'
    const { results } = await env.DB.prepare(
      `
      SELECT r.id, r.rating, r.title, r.comment, r.created_at, r.is_verified_buyer,
             u.first_name, u.last_name 
      FROM reviews r
      LEFT JOIN users u ON r.user_id = u.id
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
    let userId = null;
    let isVerified = 0;

    if (locals.user) {
      userId = locals.user.id;
      // FIXED: Trust Mechanism purchase history check targets 'user_id', not 'customer_id'
      const hasPurchased = await db
        .prepare(
          `
        SELECT o.id FROM orders o
        JOIN order_items oi ON o.id = oi.order_id
        JOIN product_variants v ON oi.variant_id = v.id
        WHERE o.user_id = ?1 AND v.product_id = ?2 AND o.status IN ('SHIPPED', 'DELIVERED')
      `
        )
        .bind(userId, data.product_id)
        .first();

      if (hasPurchased) isVerified = 1;
    } else {
      return new Response(
        JSON.stringify({
          error: 'Authentication required to submit trusted reviews.',
        }),
        { status: 401 }
      );
    }

    // FIXED: Inserting into 'user_id' column, not 'customer_id'
    await db
      .prepare(
        `
      INSERT INTO reviews (id, product_id, user_id, rating, title, comment, is_verified_buyer, status)
      VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, 'PENDING')
    `
      )
      .bind(
        crypto.randomUUID(),
        data.product_id,
        userId,
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
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 400 });
  }
};