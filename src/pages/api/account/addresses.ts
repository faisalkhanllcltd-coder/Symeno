import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { addressSchema, validatePayload } from '../../../lib/validations';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    const { results } = await env.DB.prepare(
      `
      SELECT id, customer_id, label, full_name, phone, country, state, city, line1, line2, landmark, is_default FROM addresses 
      WHERE customer_id = ?1 
      ORDER BY is_default DESC, created_at DESC
    `
    )
      .bind(locals.user.id)
      .all();

    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const rawData = (await request.json()) as any;

    // --- ZOD SECURITY LAYER ---
    const validation = validatePayload(addressSchema, rawData);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
      });
    }
    // --------------------------

    const data = rawData; // Payload is now verified safe
    const db = env.DB;
    const id = crypto.randomUUID();

    const statements = [];
    if (data.is_default) {
      statements.push(
        db
          .prepare('UPDATE addresses SET is_default = 0 WHERE customer_id = ?1')
          .bind(locals.user.id)
      );
    }

    statements.push(
      db
        .prepare(
          `
        INSERT INTO addresses (id, customer_id, label, full_name, phone, country, state, city, line1, line2, landmark, is_default)
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10, ?11, ?12)
      `
        )
        .bind(
          id,
          locals.user.id,
          data.label || 'Other',
          data.full_name,
          data.phone,
          data.country,
          data.state,
          data.city,
          data.line1,
          data.line2 || '',
          data.landmark || '',
          data.is_default ? 1 : 0
        )
    );

    await db.batch(statements);
    return new Response(JSON.stringify({ success: true, id }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const rawData = (await request.json()) as any;

    // --- ZOD SECURITY LAYER ---
    const validation = validatePayload(addressSchema, rawData);
    if (!validation.success) {
      return new Response(JSON.stringify({ error: validation.error }), {
        status: 400,
      });
    }
    // --------------------------

    const data = rawData; // Payload is now verified safe
    const db = env.DB;

    const exists = await db
      .prepare('SELECT id FROM addresses WHERE id = ?1 AND customer_id = ?2')
      .bind(data.id, locals.user.id)
      .first();
    if (!exists) throw new Error('Forbidden');

    const statements = [];
    if (data.is_default) {
      statements.push(
        db
          .prepare('UPDATE addresses SET is_default = 0 WHERE customer_id = ?1')
          .bind(locals.user.id)
      );
    }

    statements.push(
      db
        .prepare(
          `
        UPDATE addresses SET 
          label = ?1, full_name = ?2, phone = ?3, country = ?4, state = ?5, 
          city = ?6, line1 = ?7, line2 = ?8, landmark = ?9, is_default = ?10, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?11
      `
        )
        .bind(
          data.label || 'Other',
          data.full_name,
          data.phone,
          data.country,
          data.state,
          data.city,
          data.line1,
          data.line2,
          data.landmark,
          data.is_default ? 1 : 0,
          data.id
        )
    );

    await db.batch(statements);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};

export const DELETE: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { id } = (await request.json()) as any;

    await env.DB.prepare(
      'DELETE FROM addresses WHERE id = ?1 AND customer_id = ?2'
    )
      .bind(id, locals.user.id)
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'Deletion failed' }), {
      status: 500,
    });
  }
};
