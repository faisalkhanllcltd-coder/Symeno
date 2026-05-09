import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    const brand = url.searchParams.get('brand');
    const sort = url.searchParams.get('sort') || 'newest';

    // 100% CLAUDE SCHEMA: Querying catalog_cache with new column names
    let query = `SELECT id, name, slug, price, in_stock, category, brand, images_json, rating, review_count FROM catalog_cache WHERE 1=1`;
    const params: any[] = [];

    // Search Query Matrix (Updated to search 'name' instead of 'title')
    if (q) {
      query += ` AND (name LIKE ? OR brand LIKE ? OR id LIKE ?)`;
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Faceted Filtering
    if (brand) {
      query += ` AND brand = ?`;
      params.push(brand);
    }

    // Sort Protocols (Updated to sort by 'price' instead of 'basePrice')
    if (sort === 'price_asc') query += ` ORDER BY price ASC`;
    else if (sort === 'price_desc') query += ` ORDER BY price DESC`;
    else query += ` ORDER BY scraped_at DESC`;

    // Strict Edge Optimization: Limit payload size
    query += ` LIMIT 50`;

    const db = env.DB as any;
    const { results } = await db
      .prepare(query)
      .bind(...params)
      .all();

    return new Response(JSON.stringify(results), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Search telemetry failed.' }), {
      status: 500,
    });
  }
};