import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (
    !locals.user ||
    (locals.user.role !== 'admin' && locals.user.role !== 'staff')
  )
    throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    enforceAdmin(locals);
    const { results } = await env.DB.prepare(
      'SELECT * FROM brands WHERE id = ?1'
    )
      .bind(params.id)
      .all();
    if (results.length === 0) return new Response('Not Found', { status: 404 });
    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request, params, locals }) => {
  try {
    enforceAdmin(locals);
    const data = (await request.json()) as any;

    await env.DB.prepare(
      `UPDATE brands SET 
        name = ?1, slug = ?2, description = ?3, logo_url = ?4, cover_url = ?5, 
        country = ?6, website_url = ?7, is_featured = ?8, 
        seo_title = ?9, seo_description = ?10, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?11`
    )
      .bind(
        data.name,
        data.slug,
        data.description,
        data.logo_url,
        data.cover_url,
        data.country,
        data.website_url,
        data.is_featured ? 1 : 0,
        data.seo_title,
        data.seo_description,
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
    // Note: In production, ensure no products are orphaned before deletion
    await env.DB.prepare('DELETE FROM brands WHERE id = ?1')
      .bind(params.id)
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Deletion failed' }), {
      status: 500,
    });
  }
};
