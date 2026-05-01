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
      'SELECT id, customer_id, total, status, created_at, updated_at FROM orders ORDER BY created_at DESC LIMIT 100'
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
    const { id, status } = (await request.json()) as {
      id: string;
      status: string;
    };

    await env.DB.prepare(
      'UPDATE orders SET status = ?1, updated_at = CURRENT_TIMESTAMP WHERE id = ?2'
    )
      .bind(status, id)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Update failed' }), {
      status: 500,
    });
  }
};
