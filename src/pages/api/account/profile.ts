import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const db = env.DB;
    // Fetch user and preferences
    const { results } = await db
      .prepare(
        'SELECT first_name, last_name, phone, dob, gender, avatar_url, preferences FROM users WHERE id = ?1'
      )
      .bind(locals.user.id)
      .all();

    return new Response(JSON.stringify(results[0]), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const PUT: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const {
      first_name,
      last_name,
      phone,
      dob,
      gender,
      avatar_url,
      preferences,
    } = (await request.json()) as any;

    await env.DB.prepare(
      `
      UPDATE users SET 
        first_name = ?1, last_name = ?2, phone = ?3, dob = ?4, 
        gender = ?5, avatar_url = ?6, preferences = ?7, updated_at = CURRENT_TIMESTAMP
      WHERE id = ?8
    `
    )
      .bind(
        first_name,
        last_name,
        phone,
        dob,
        gender,
        avatar_url,
        JSON.stringify(preferences || {}),
        locals.user.id
      )
      .run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
