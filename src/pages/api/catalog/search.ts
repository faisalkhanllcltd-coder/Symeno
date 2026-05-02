import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ request }) => {
  try {
    const url = new URL(request.url);
    const q = url.searchParams.get('q') || '';
    const brand = url.searchParams.get('brand');
    const sort = url.searchParams.get('sort') || 'newest';

    let query = `SELECT slug AS id, title, slug, basePrice AS base_price, retailPrice AS retail_price, stockStatus AS stock_status, category, categorySlug, brand FROM products WHERE 1=1`;
    const params: any[] = [];

    // Search Query Matrix
    if (q) {
      query += ` AND (title LIKE ? OR brand LIKE ? OR slug LIKE ?)`;
      const searchTerm = `%${q}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    // Faceted Filtering
    if (brand) {
      query += ` AND brand = ?`;
      params.push(brand);
    }

    // Sort Protocols
    if (sort === 'price_asc') query += ` ORDER BY basePrice ASC`;
    else if (sort === 'price_desc') query += ` ORDER BY basePrice DESC`;
    else query += ` ORDER BY created_at DESC`;

    // Strict Edge Optimization: Limit payload size
    query += ` LIMIT 50`;

    const db = env.DB;
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
