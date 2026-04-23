import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'staff')) throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    enforceAdmin(locals);
    const { results } = await env.DB.prepare('SELECT id, email, first_name, last_name, created_at, role FROM users ORDER BY created_at DESC').all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
  }
};