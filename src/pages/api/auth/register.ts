import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().trim().optional().default(''),
  lastName: z.string().trim().optional().default('')
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const parsedData = registerSchema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
      return new Response(JSON.stringify({ error: parsedData.error.errors[0].message }), { status: 400 });
    }

    const { email, password, firstName, lastName } = parsedData.data;
    const db = (env as any).DB;
    if (!db) return new Response('Database missing. Check wrangler.toml bindings.', { status: 500 });

    const existing = await db.prepare('SELECT id FROM customers WHERE email = ?1').bind(email).first();
    if (existing) return new Response('Email already exists.', { status: 400 });

    const userId = `cus_${crypto.randomUUID()}`;
    const passwordHash = await hashPassword(password);

    await db.prepare(
      'INSERT INTO customers (id, email, first_name, last_name, password_hash) VALUES (?1, ?2, ?3, ?4, ?5)'
    ).bind(userId, email, firstName, lastName, passwordHash).run();

    const sessionId = crypto.randomUUID();
    const kv = (env as any).KV;

    if (kv && kv.put) {
      await kv.put(`session:${sessionId}`, JSON.stringify({ id: userId, email, role: 'customer' }), { expirationTtl: 604800 });
    }

    cookies.set('auth_session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 604800
    });

    return redirect('/account/orders');
  } catch (err: unknown) {
    console.error('[AUTH_FATAL_REGISTER]', err);
    return new Response('Server Error', { status: 500 });
  }
};