import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    // Aggregate user data for GDPR compliance
    const [userReq, ordersReq] = await env.DB.batch([
      env.DB.prepare('SELECT id, first_name, last_name, email, created_at FROM customers WHERE id = ?1').bind(locals.user.id),
      env.DB.prepare(
        'SELECT id, total, status, created_at FROM orders WHERE customer_id = ?1'
      ).bind(locals.user.id),
    ]);

    const exportData = {
      identity: userReq.results[0],
      operational_history: ordersReq.results,
    };

    // Return as downloadable JSON (CSV requires more complex formatting)
    return new Response(JSON.stringify(exportData, null, 2), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Content-Disposition':
          'attachment; filename="symeno_personal_data_export.json"',
      },
    });
  } catch (e) {
    return new Response('Export Failed', { status: 500 });
  }
};
