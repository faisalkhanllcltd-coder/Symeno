import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (
    !locals.user ||
    (locals.user.role !== 'admin' && locals.user.role !== 'staff')
  )
    throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    enforceAdmin(locals);
    const { results } = await env.DB.prepare(
      'SELECT * FROM products ORDER BY created_at DESC'
    ).all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const data = (await request.json()) as any;

    // D1 Insert with parameterized bindings to prevent SQL injection
    const { success } = await env.DB.prepare(
      `INSERT INTO products (id, title, slug, base_price, description, stock_status, is_active) 
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7)`
    )
      .bind(
        crypto.randomUUID(),
        data.title,
        data.slug,
        data.base_price || 0,
        data.description || '',
        data.stock_status || 'IN_STOCK',
        1
      )
      .run();

    if (!success) throw new Error('DB Insert Failed');
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const { id } = (await request.json()) as { id: string };

    // Using D1 Batch for transaction-like atomic deletion (Products + Variants)
    await env.DB.batch([
      env.DB.prepare('DELETE FROM product_variants WHERE product_id = ?1').bind(
        id
      ),
      env.DB.prepare('DELETE FROM products WHERE id = ?1').bind(id),
    ]);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Deletion failed' }), {
      status: 500,
    });
  }
};
