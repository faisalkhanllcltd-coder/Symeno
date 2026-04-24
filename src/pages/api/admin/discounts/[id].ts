import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const DELETE: APIRoute = async ({ params }) => {
  try {
    await env.DB.prepare('DELETE FROM discounts WHERE id = ?1')
      .bind(params.id)
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response('Error', { status: 500 });
  }
};
