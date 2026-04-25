import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, product_id, sku, title, image_url, price_adjustment, wholesale_cost, retail_price, inventory_quantity, stock_quantity, created_at, updated_at FROM product_variants WHERE id = ?1'
    )
      .bind(params.id)
      .all();
    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};
