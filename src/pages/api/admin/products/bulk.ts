import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (
    !locals.user ||
    (locals.user.role !== 'admin' && locals.user.role !== 'staff')
  )
    throw new Error('UNAUTHORIZED');
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const { ids, action, payload } = (await request.json()) as {
      ids: string[];
      action: string;
      payload?: any;
    };

    if (!ids || ids.length === 0) throw new Error('No items selected');

    const placeholders = ids.map(() => '?').join(',');
    const statements = [];

    switch (action) {
      case 'ACTIVATE':
        statements.push(
          env.DB.prepare(
            `UPDATE products SET is_active = 1 WHERE id IN (${placeholders})`
          ).bind(...ids)
        );
        break;
      case 'DEACTIVATE':
        statements.push(
          env.DB.prepare(
            `UPDATE products SET is_active = 0 WHERE id IN (${placeholders})`
          ).bind(...ids)
        );
        break;
      case 'DELETE':
        statements.push(
          env.DB.prepare(
            `DELETE FROM product_variants WHERE product_id IN (${placeholders})`
          ).bind(...ids)
        );
        statements.push(
          env.DB.prepare(
            `DELETE FROM products WHERE id IN (${placeholders})`
          ).bind(...ids)
        );
        break;
      case 'ADJUST_PRICE':
        if (!payload?.percentage) throw new Error('Percentage required');
        const multiplier = 1 + payload.percentage / 100;
        statements.push(
          env.DB.prepare(
            `UPDATE products SET base_price = base_price * ?1 WHERE id IN (${placeholders})`
          ).bind(multiplier, ...ids)
        );
        break;
      default:
        throw new Error('Invalid bulk action');
    }

    await env.DB.batch(statements);
    return new Response(
      JSON.stringify({ success: true, affected: ids.length }),
      { status: 200 }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 400 });
  }
};
