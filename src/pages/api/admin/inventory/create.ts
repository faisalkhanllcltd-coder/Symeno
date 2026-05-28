import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async (context) => {
  try {
    const data = (await context.request.json()) as Record<string, any>;

    // Validate required fields
    const { title, slug, brand, category, basePrice } = data;
    if (!title || !slug || !brand || !category || basePrice == null) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, slug, brand, category, basePrice.' }),
        { status: 400 }
      );
    }

    const db = (env as any).DB;
    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database connection unavailable.' }),
        { status: 503 }
      );
    }

    const productId = crypto.randomUUID();

    // FIXED: Mapped the camelCase JSON payload to the correct snake_case D1 columns
    // FIXED: Added 'brand_id' because the schema expects a foreign key, not a raw 'brand' string.
    await db.prepare(
      `INSERT INTO products (id, slug, title, brand_id, category, base_price, retail_price, stock_status, is_active, description, image_url)
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
    ).bind(
      productId,
      slug,
      title,
      brand,
      category,
      Number(basePrice),
      Number(data.retailPrice || basePrice),
      data.stockStatus || 'IN_STOCK',
      data.is_active !== undefined ? (data.is_active ? 1 : 0) : 1,
      data.description || '',
      data.image_url || ''
    ).run();

    return new Response(
      JSON.stringify({ success: true, productId }),
      { status: 201 }
    );
  } catch (error: unknown) {
    console.error('[INVENTORY_CREATE_ERROR]', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({ error: `Failed to create product: ${message}` }),
      { status: 500 }
    );
  }
};