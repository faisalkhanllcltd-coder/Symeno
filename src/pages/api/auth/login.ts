import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { createSession } from '../../../lib/auth';
import { z } from 'zod';

// Dummy hash prevents timing attacks when email is not found.
// Format: {32-hex-char salt}:{64-hex-char PBKDF2-SHA256 hash} — matches hashPassword() output.
const DUMMY_HASH = '0000000000000000000000000000000000000000000000000000000000000000:0000000000000000000000000000000000000000000000000000000000000000';

const loginSchema = z.object({
  email: z.string().email().trim().toLowerCase(),
  password: z.string().min(1)
}).passthrough();

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const parsedData = loginSchema.safeParse(body);

    if (!parsedData.success) {
      return new Response(JSON.stringify({ error: 'Security token missing or invalid input. Are you a bot?' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { email, password } = parsedData.data;

    const db = (env as any).DB;
    if (!db) return new Response(JSON.stringify({ error: 'Database offline.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // FIXED: Querying the unified 'users' table, not the deleted 'customers' table.
    const user = await db.prepare('SELECT id, email, password_hash, role FROM users WHERE email = ?1').bind(email).first();

    // Timing-safe: always run hashPassword regardless of whether user exists.
    // Using DUMMY_HASH when no user found ensures constant-time response.
    const hashStr = (user?.password_hash as string | undefined) ?? DUMMY_HASH;
    const [saltHex] = hashStr.split(':');
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g)!.map((byte: any) => parseInt(byte, 16)));
    const hashCheck = await hashPassword(password, saltBytes);

    if (!user || hashCheck !== hashStr) {
      return new Response(JSON.stringify({ error: 'Invalid credentials.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

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