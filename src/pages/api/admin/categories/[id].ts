import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (
    !locals.user ||
    (locals.user.role !== 'admin' && locals.user.role !== 'staff')
  )
    throw new Error('UNAUTHORIZED');
};

export const PUT: APIRoute = async ({ request, params, locals }) => {
  try {
    enforceAdmin(locals);
    const data = (await request.json()) as any;

    await env.DB.prepare(
      `UPDATE categories SET 
        parent_id = ?1, name = ?2, slug = ?3, description = ?4, image_url = ?5, 
        is_active = ?6, seo_title = ?7, seo_description = ?8, sort_order = ?9, 
        updated_at = CURRENT_TIMESTAMP
       WHERE id = ?10`
    )
      .bind(
        data.parent_id || null,
        data.name,
        data.slug,
        data.description,
        data.image_url,
        data.is_active ? 1 : 0,
        data.seo_title,
        data.seo_description,
        data.sort_order,
        params.id
      )
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ params, locals }) => {
  try {
    enforceAdmin(locals);

    // Safety check: Prevent deleting categories with children
    const children = await env.DB.prepare(
      'SELECT id FROM categories WHERE parent_id = ?1'
    )
      .bind(params.id)
      .all();
    if (children.results.length > 0)
      throw new Error('Cannot delete category with nested subcategories.');

    await env.DB.prepare('DELETE FROM categories WHERE id = ?1')
      .bind(params.id)
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
