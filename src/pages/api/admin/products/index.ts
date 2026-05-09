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
    // 100% CLAUDE SCHEMA: Direct connection to the unified edge cache
    const { results } = await env.DB.prepare(
      'SELECT id, name, slug, price, description, in_stock, category, brand FROM catalog_cache ORDER BY scraped_at DESC LIMIT 250'
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
    const newId = crypto.randomUUID();

    const { success } = await env.DB.prepare(
      `INSERT INTO catalog_cache (id, name, slug, brand, category, description, price, in_stock, images_json, tags_json, source, scraped_at) 
       VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)`
    )
      .bind(
        newId,
        data.name,
        data.slug || newId,
        data.brand || 'Symeno Select',
        data.category || 'Uncategorized',
        data.description || '',
        data.price || 0,
        data.in_stock || 0,
        '[]', // Empty JSON array for images on manual creation
        '[]', // Empty JSON array for features
        'manual_admin',
        Math.floor(Date.now() / 1000)
      )
      .run();

    if (!success) throw new Error('DB Insert Failed');
    return new Response(JSON.stringify({ success: true, id: newId }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const { id } = (await request.json()) as { id: string };

    await env.DB.prepare('DELETE FROM catalog_cache WHERE id = ?1').bind(id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Deletion failed' }), {
      status: 500,
    });
  }
};