import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { results } = await env.DB.prepare(
      'SELECT id, first_name, last_name, email, phone, created_at, is_suspended FROM users WHERE id = ?1'
    )
      .bind(params.id)
      .all();
    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};

export const PUT: APIRoute = async ({ request, params }) => {
  try {
    const { is_suspended } = (await request.json()) as any;
    await env.DB.prepare('UPDATE users SET is_suspended = ?1 WHERE id = ?2')
      .bind(is_suspended ? 1 : 0, params.id)
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};
