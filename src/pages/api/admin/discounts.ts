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
    // Fetch discounts and calculate current usage
    const { results } = await env.DB.prepare(
      `
      SELECT id, code, type, value, min_order_amount, uses_count, is_active, created_at, updated_at FROM discounts ORDER BY created_at DESC
    `
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
      `INSERT INTO discounts (
        id, code, type, value, minimum_order, usage_limit, 
        current_usage, start_date, end_date, is_active, stackable
      ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, 0, ?7, ?8, 1, ?9)`
    )
      .bind(
        crypto.randomUUID(),
        data.code.toUpperCase(),
        data.type,
        data.value,
        data.minimum_order || 0,
        data.usage_limit || null,
        data.start_date || null,
        data.end_date || null,
        data.stackable ? 1 : 0
      )
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
