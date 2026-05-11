import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { createSession } from '../../../lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email().transform(val => val.toLowerCase().trim()),
  password: z.string().min(1),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // The login form uses FormData, not JSON
    const formData = await request.formData();
    const parsedData = loginSchema.safeParse(Object.fromEntries(formData));

    if (!parsedData.success) {
      return new Response(JSON.stringify({ error: 'Invalid input' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { email, password } = parsedData.data;
    const db = (env as any).DB;

    if (!db) {
      return new Response(JSON.stringify({ error: 'Database offline.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }

    // 1. Fetch user from our newly forged database schema
    const user = await db.prepare('SELECT id, email, password_hash FROM customers WHERE email = ?1').bind(email).first();

    if (!user || !user.password_hash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 2. Cryptographic verification
    const [saltHex] = (user.password_hash as string).split(':');
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)));
    const hashCheck = await hashPassword(password, saltBytes);

    if (hashCheck !== user.password_hash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // 3. Establish Edge Session
    await createSession(env, cookies, {
      id: user.id as string,
      email: user.email as string,
      role: 'customer'
    });

    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[AUTH_LOGIN_ERROR]', err);
    // THE FIX: Pipe the exact error message to the frontend telemetry box
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `System Error: ${errorMessage}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};