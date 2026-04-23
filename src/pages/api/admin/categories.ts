import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'staff')) throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    enforceAdmin(locals);
    // Fetch all categories, ordered by sort_order for hierarchy building
    const { results } = await env.DB.prepare('SELECT * FROM categories ORDER BY parent_id ASC, sort_order ASC, name ASC').all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const data = await request.json() as any;
    
    // Prevent nesting deeper than 2 levels
    if (data.parent_id) {
      const parent = await env.DB.prepare('SELECT parent_id FROM categories WHERE id = ?1').bind(data.parent_id).first();
      if (parent && parent.parent_id) throw new Error('Maximum depth reached (2 levels)');
    }

    await env.DB.prepare(
      `INSERT INTO categories (
        id, parent_id, name, slug, description, image_url, 
        is_active, seo_title, seo_description, sort_order
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)`
    ).bind(
      crypto.randomUUID(), data.parent_id || null, data.name, data.slug, 
      data.description || '', data.image_url || null, data.is_active ? 1 : 0, 
      data.seo_title || null, data.seo_description || null, data.sort_order || 0
    ).run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};