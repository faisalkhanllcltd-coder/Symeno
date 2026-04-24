import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (
      !locals.user ||
      (locals.user.role !== 'admin' && locals.user.role !== 'staff')
    )
      throw new Error('UNAUTHORIZED');
    const { results } = await env.DB.prepare(
      "SELECT * FROM orders WHERE status LIKE '%RETURN%' ORDER BY updated_at DESC"
    ).all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};
