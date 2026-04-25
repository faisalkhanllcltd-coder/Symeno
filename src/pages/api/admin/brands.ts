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
      'SELECT id, name, slug, created_at, updated_at FROM brands ORDER BY name ASC'
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

    await env.DB.prepare(
      `INSERT INTO brands (
        id, name, slug, description, logo_url, cover_url, 
        country, website_url, is_featured, seo_title, seo_description
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11)`
    )
      .bind(
        crypto.randomUUID(),
        data.name,
        data.slug,
        data.description || '',
        data.logo_url || null,
        data.cover_url || null,
        data.country || null,
        data.website_url || null,
        data.is_featured ? 1 : 0,
        data.seo_title || null,
        data.seo_description || null
      )
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
