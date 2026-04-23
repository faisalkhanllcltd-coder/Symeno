import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (!locals.user || locals.user.role !== 'admin') throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const db = env.DB;
    const url = new URL(request.url);
    
    // Filtering logic
    const action = url.searchParams.get('action');
    const entity = url.searchParams.get('entity');
    const limit = Number(url.searchParams.get('limit')) || 50;

    let query = `
      SELECT a.*, u.email as actor_email 
      FROM audit_logs a 
      LEFT JOIN users u ON a.actor_id = u.id 
      WHERE 1=1
    `;
    const params: any[] = [];

    if (action) {
      query += ` AND a.action = ?${params.length + 1}`;
      params.push(action);
    }
    if (entity) {
      query += ` AND a.entity_type = ?${params.length + 1}`;
      params.push(entity);
    }

    query += ` ORDER BY a.created_at DESC LIMIT ?${params.length + 1}`;
    params.push(limit);

    const { results } = await db.prepare(query).bind(...params).all();
    
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Failed to fetch logs' }), { status: 500 });
  }
};