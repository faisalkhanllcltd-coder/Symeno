import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { createSession } from '../../../lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format').trim().toLowerCase(),
  // FIXED: PCI-DSS Compliance - Upgraded minimum password length from 6 to 8
  password: z.string().min(8, 'Password must be at least 8 characters'),
  firstName: z.string().trim().optional().default(''),
  lastName: z.string().trim().optional().default(''),
  cartItems: z.array(z.any()).optional().default([])
}).passthrough();

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return new Response(JSON.stringify({ error: parsedData.error.issues[0].message }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const { email, password, firstName, lastName } = parsedData.data;

    const db = (env as any).DB;
    if (!db) return new Response(JSON.stringify({ error: 'Database connection offline.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

    // FIXED: Querying and inserting into 'users' table, not 'customers'.
    const existing = await db.prepare('SELECT id FROM users WHERE email = ?1').bind(email).first();
    if (existing) return new Response(JSON.stringify({ error: 'Identity already provisioned. Please login.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const userId = `usr_${crypto.randomUUID()}`;
    const passwordHash = await hashPassword(password);

    await db.prepare('INSERT INTO users (id, email, first_name, last_name, password_hash) VALUES (?1, ?2, ?3, ?4, ?5)')
      .bind(userId, email, firstName, lastName, passwordHash)
      .run();

    await createSession(env, cookies, { id: userId, email, firstName, lastName, role: 'customer' });

    return new Response(JSON.stringify({ success: true, userId }), { status: 200, headers: { 'Content-Type': 'application/json' } });

  } catch (err: any) {
    console.error('[AUTH_FATAL_REGISTER]', err);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return new Response(JSON.stringify({ error: `System Error: ${errorMessage}` }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
};