
import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params }) => {
  try {
    const { results } = await env.DB.prepare('SELECT * FROM product_variants WHERE id = ?1').bind(params.id).all();
    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) { return new Response('Error', { status: 500 }); }
};
