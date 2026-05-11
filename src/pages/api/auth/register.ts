import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { createSession } from '../../../lib/auth';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Invalid email format').transform(val => val.toLowerCase().trim()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().trim().optional().default(''),
  lastName: z.string().trim().optional().default(''),
  cartItems: z.array(z.any()).optional().default([]),
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const body = await request.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return new Response(
        JSON.stringify({ error: parsedData.error.issues[0].message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, password, firstName, lastName } = parsedData.data;

    const db = (env as any).DB;

    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database connection offline.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existing = await db.prepare('SELECT id FROM customers WHERE email = ?1').bind(email).first();
    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Identity already provisioned. Please login.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const userId = `cus_${crypto.randomUUID()}`;
    const passwordHash = await hashPassword(password);

    // THE FIX: Names are back in the SQL execution because your database is now ready for them.
    await db
      .prepare('INSERT INTO customers (id, email, first_name, last_name, password_hash) VALUES (?1, ?2, ?3, ?4, ?5)')
      .bind(userId, email, firstName, lastName, passwordHash)
      .run();

    await createSession(env, cookies, {
      id: userId,
      email,
      firstName,
      lastName,
      role: 'customer'
    });

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        message: 'Identity provisioned. Rerouting to checkout.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: any) {
    console.error('[AUTH_FATAL_REGISTER]', err);
    const errorMessage = err instanceof Error ? err.message : String(err);

    return new Response(
      JSON.stringify({ error: `System Error: ${errorMessage}` }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};