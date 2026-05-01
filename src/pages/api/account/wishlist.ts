import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { z } from 'zod';

// POST SCHEMA
const schema = z.object({
  productId: z.string(),
  action: z.enum(['add', 'remove'])
});

export const GET: APIRoute = async ({ locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    const db = (env as any).DB;
    // We fetch all product IDs saved by this specific user
    const results = await db.prepare('SELECT product_id FROM wishlists WHERE customer_id = ?1').bind(user.id).all();
    const items = results.results.map((row: any) => row.product_id);
    
    return new Response(JSON.stringify({ items }), { status: 200 });
  } catch (err) {
    console.error('[WISHLIST_GET_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Database query failed.' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  const user = locals.user;
  if (!user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });

  try {
    const { productId, action } = schema.parse(await request.json());
    const db = (env as any).DB;

    if (action === 'add') {
      // INSERT OR IGNORE prevents database crashes if they double-click the button
      await db.prepare('INSERT OR IGNORE INTO wishlists (customer_id, product_id) VALUES (?1, ?2)')
        .bind(user.id, productId)
        .run();
    } else {
      await db.prepare('DELETE FROM wishlists WHERE customer_id = ?1 AND product_id = ?2')
        .bind(user.id, productId)
        .run();
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error('[WISHLIST_POST_ERROR]', err);
    return new Response(JSON.stringify({ error: 'Invalid payload or database error.' }), { status: 400 });
  }
};
