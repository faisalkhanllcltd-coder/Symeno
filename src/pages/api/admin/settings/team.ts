import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (!locals.user || locals.user.role !== 'admin')
    throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ locals }) => {
  try {
    enforceAdmin(locals);
    const { results } = await env.DB.prepare(
      "SELECT id, email, first_name, role, created_at FROM users WHERE role IN ('admin', 'staff')"
    ).all();
    return new Response(JSON.stringify(results), { status: 200 });
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const { email, role } = (await request.json()) as any;
    // In production: Send invitation email. Here we just create a shell account.
    await env.DB.prepare(
      "INSERT INTO users (id, email, role, password_hash) VALUES (?1, ?2, ?3, 'INVITED')"
    )
      .bind(crypto.randomUUID(), email, role)
      .run();
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
