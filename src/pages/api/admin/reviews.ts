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
    // Fetch reviews joined with product and customer data
    const { results } = await env.DB.prepare(
      `
      SELECT r.*, p.title as product_title, u.email as customer_email 
      FROM reviews r
      JOIN products p ON r.product_id = p.id
      LEFT JOIN users u ON r.customer_id = u.id
      ORDER BY r.created_at DESC
    `
    ).all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const { id, status } = (await request.json()) as any;
    await env.DB.prepare(
      'UPDATE reviews SET status = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2'
    )
      .bind(status, id)
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
