import { env } from "cloudflare:workers";
import type { APIRoute } from 'astro';

// UTILITY: Edge-native slug generator for dynamic URLs
function generateSlug(title: string, id: string): string {
  const baseSlug = title.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');

  // Truncate to 60 chars and append the unique ASIN/ID to guarantee zero database collisions
  return `${baseSlug.substring(0, 60).replace(/-$/, '')}-${id.toLowerCase()}`;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json() as { items: string[], type: string, targetCategory?: string };
    const db = env.DB as any;

    const apiKey = (env as any).HASDATA_API_KEY;

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "HasData API Key missing from environment." }), { status: 500 });
    }

    if (!body.items || !Array.isArray(body.items)) {
      return new Response(JSON.stringify({ error: "Invalid payload format." }), { status: 400 });
    }

    const processed = [];

    for (const id of body.items) {
      const type = body.type || 'asin';
      const apiUrl = `https://api.hasdata.com/scrape/amazon/product?${type}=${id}`;

      const response = await fetch(apiUrl, {
        headers: { 'x-api-key': apiKey }
      });

      if (!response.ok) {
        console.error(`HasData API error for ${id}: ${response.status}`);
        continue;
      }

      const json: any = await response.json();

      if (json.product) {
        const product = json.product;

        // 100% CLAUDE SCHEMA MAPPING
        const productId = product.asin || id;
        const name = product.title || 'Unknown Product';
        const slug = generateSlug(name, productId);
        const brand = product.brand || 'Symeno Select';

        // Target Category Override
        const category = body.targetCategory || (product.breadcrumbs && product.breadcrumbs.length > 0
          ? product.breadcrumbs.join(' > ')
          : 'Uncategorized');

        // Feature array merged gracefully into description if a raw description is missing
        const description = product.description || (product.featureBullets ? product.featureBullets.join('. ') : '');

        // SECURE PARSING: Strips currency symbols and commas before converting to float
        const rawPrice = product.price?.currentPrice?.toString() || '0';
        const price = parseFloat(rawPrice.replace(/[^0-9.]/g, '')) || 0;

        const in_stock = product.isAvailable ? 1 : 0;
        const images_json = JSON.stringify(product.images || []);
        const tags_json = JSON.stringify(product.featureBullets || []); // Store raw features as tags

        // Claude's Extended Metadata
        const rating = product.reviewsInfo?.rating || null;
        const review_count = product.reviewsInfo?.totalReviews || 0;
        const source_url = product.url || `https://www.amazon.com/dp/${productId}`;
        const scraped_at = Math.floor(Date.now() / 1000);

        // ATOMIC D1 TRANSACTION
        await db.prepare(`
          INSERT INTO catalog_cache 
          (id, name, slug, brand, category, price, description, images_json, rating, review_count, source, source_url, scraped_at, in_stock, tags_json)
          VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, 'hasdata', ?11, ?12, ?13, ?14)
          ON CONFLICT(id) DO UPDATE SET 
            name = excluded.name,
            slug = excluded.slug,
            brand = excluded.brand,
            category = excluded.category,
            price = excluded.price,
            description = excluded.description,
            images_json = excluded.images_json,
            rating = excluded.rating,
            review_count = excluded.review_count,
            source_url = excluded.source_url,
            scraped_at = excluded.scraped_at,
            in_stock = excluded.in_stock,
            tags_json = excluded.tags_json
        `).bind(
          productId, name, slug, brand, category, price, description, images_json, rating, review_count, source_url, scraped_at, in_stock, tags_json
        ).run();

        processed.push(productId);
        console.log(`[SUCCESS] Ingested Node: ${name.substring(0, 40)}... -> ${category}`);
      }
    }

    return new Response(JSON.stringify({ success: true, processed }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error('[INGESTION_ERROR]', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};