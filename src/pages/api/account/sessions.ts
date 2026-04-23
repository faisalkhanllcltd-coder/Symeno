import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    // Assumes a 'sessions' table exists. 
    const { results } = await env.DB.prepare(`
      SELECT id, device, location, ip_address, last_active 
      FROM sessions WHERE user_id = ?1 ORDER BY last_active DESC
    `).bind(locals.user.id).all();
    
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), { status: 500 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { session_id } = await request.json() as any;
    
    await env.DB.prepare('DELETE FROM sessions WHERE id = ?1 AND user_id = ?2')
      .bind(session_id, locals.user.id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Revocation failed' }), { status: 500 });
  }
};