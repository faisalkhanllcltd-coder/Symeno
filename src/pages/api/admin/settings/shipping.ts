import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user || locals.user.role !== 'admin') throw new Error('UNAUTHORIZED');
    const payload = await request.json();
    await env.DB.prepare("INSERT INTO settings (key, value) VALUES ('shipping_config', ?1) ON CONFLICT(key) DO UPDATE SET value = ?1")
      .bind(JSON.stringify(payload)).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};