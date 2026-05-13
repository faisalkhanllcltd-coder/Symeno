import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { createSession } from '../../../lib/auth';
import { z } from 'zod';

const loginSchema = z.object({
  email: z.string().email().transform(val => val.toLowerCase().trim()),
  password: z.string().min(1),
  'cf-turnstile-response': z.string().optional()
}).passthrough();

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const parsedData = loginSchema.safeParse(body);

    if (!parsedData.success) {
      return new Response(JSON.stringify({ error: 'Invalid input data.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { email, password, 'cf-turnstile-response': turnstileToken } = parsedData.data;

    // THE FIX: Enforce Turnstile validation securely on the Edge
    const turnstileSecret = (env as any).TURNSTILE_SECRET_KEY;
    if (turnstileSecret && turnstileToken) {
      const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${turnstileSecret}&response=${turnstileToken}`
      });
      const verifyData = await verifyRes.json() as any;
      if (!verifyData.success) {
        return new Response(JSON.stringify({ error: 'Security verification failed. Are you a bot?' }), { status: 403, headers: { 'Content-Type': 'application/json' } });
      }
    }

    const db = (env as any).DB;
    if (!db) return new Response(JSON.stringify({ error: 'Database offline.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // THE UPGRADE: Fetch the 'role' from the database so Admins keep their privileges!
    const user = await db.prepare('SELECT id, email, password_hash, role FROM customers WHERE email = ?1').bind(email).first();

    if (!user || !user.password_hash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // THE FIX: Check for the delimiter before splitting to prevent fatal destructuring crashes
    const hashStr = user.password_hash as string;
    if (!hashStr.includes(':')) {
      return new Response(JSON.stringify({ error: 'Invalid credentials. (Legacy Hash)' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    const [saltHex] = hashStr.split(':');
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)));
    const hashCheck = await hashPassword(password, saltBytes);

    if (hashCheck !== user.password_hash) {
      return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    // Apply the actual database role to the JWT session
    const role = ((user.role as string) || 'customer').toLowerCase();
    await createSession(env, cookies, {
      id: user.id as string,
      email: user.email as string,
      role: role
    });

    let redirectUrl = '/account/orders';
    if (role === 'admin' || role === 'manager' || role === 'staff') {
      redirectUrl = '/admin';
    }

    return new Response(JSON.stringify({ success: true, redirectUrl }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[AUTH_LOGIN_ERROR]', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `System Error: ${errorMessage}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};