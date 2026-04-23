import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email().toLowerCase().trim(),
  password: z.string().min(1)
});

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  try {
    const formData = await request.formData();
    const parsedData = loginSchema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
      return new Response('Invalid credentials structure.', { status: 400 });
    }

    const { email, password } = parsedData.data;
    const db = (env as any).DB;
    if (!db) return new Response('Database missing.', { status: 500 });

    const user = await db.prepare('SELECT * FROM customers WHERE email = ?1').bind(email).first();
    if (!user || !user.password_hash) return new Response('Authentication failed.', { status: 401 });

    const [saltHex, storedHash] = (user.password_hash as string).split(':');
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
    const attemptHash = await hashPassword(password, saltBytes);

    if (attemptHash !== user.password_hash) return new Response('Authentication failed.', { status: 401 });

    const sessionId = crypto.randomUUID();
    const kv = (env as any).KV;
    const role = email.includes('@symeno.com') ? 'admin' : 'customer';

    if (kv && kv.put) {
      await kv.put(`session:${sessionId}`, JSON.stringify({ id: user.id, email: user.email, role }), { expirationTtl: 604800 });
    }

    cookies.set('auth_session', sessionId, {
      path: '/',
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      maxAge: 604800
    });

    return redirect(role === 'admin' ? '/admin/categories' : '/account/orders');
  } catch (err: unknown) {
    console.error('[AUTH_FATAL_LOGIN]', err);
    return new Response('Server error.', { status: 500 });
  }
};