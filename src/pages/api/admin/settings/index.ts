import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (!locals.user || locals.user.role !== 'admin')
    throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    enforceAdmin(locals);
    // Fetch global configuration (JSON) from D1 settings table
    const { results } = await env.DB.prepare(
      "SELECT value FROM settings WHERE key = 'global_config'"
    ).all();
    const config =
      results.length > 0 ? JSON.parse(results[0].value as string) : {};
    return new Response(JSON.stringify(config), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const payload = await request.json();
    await env.DB.prepare(
      "INSERT INTO settings (key, value) VALUES ('global_config', ?1) ON CONFLICT(key) DO UPDATE SET value = ?1"
    )
      .bind(JSON.stringify(payload))
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
