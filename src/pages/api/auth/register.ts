import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { hashPassword } from '../../../lib/crypto';
import { createSession } from '../../../lib/auth';
import { z } from 'zod';

// THE FIX: Relaxed the password validation to 6 characters, no special requirements
const registerSchema = z.object({
  email: z.string().email('Invalid email format').transform(val => val.toLowerCase().trim()),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().trim().optional().default(''),
  lastName: z.string().trim().optional().default(''),
  cartItems: z.array(z.any()).optional().default([]), // Catch the active cart state
});

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // THE FIX: Parse JSON instead of FormData
    const body = await request.json();
    const parsedData = registerSchema.safeParse(body);

    if (!parsedData.success) {
      return new Response(
        JSON.stringify({ error: parsedData.error.issues[0].message }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { email, password, firstName, lastName, cartItems } = parsedData.data;
    const db = env.DB;

    if (!db) {
      return new Response(
        JSON.stringify({ error: 'Database connection offline.' }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 1. Verify email availability
    const existing = await db.prepare('SELECT id FROM customers WHERE email = ?1').bind(email).first();
    if (existing) {
      return new Response(
        JSON.stringify({ error: 'Identity already provisioned. Please login.' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // 2. Provision new identity
    const userId = `cus_${crypto.randomUUID()}`;
    const passwordHash = await hashPassword(password);

    await db
      .prepare('INSERT INTO customers (id, email, first_name, last_name, password_hash) VALUES (?1, ?2, ?3, ?4, ?5)')
      .bind(userId, email, firstName, lastName, passwordHash)
      .run();

    // 3. Delegate KV storage and secure HttpOnly cookie creation
    await createSession(env, cookies, {
      id: userId,
      email,
      firstName,
      lastName,
      role: 'customer'
    });

    // Note: Because the frontend CartStore (`cart.svelte.ts`) relies on localStorage, 
    // the cart survives the auth process perfectly. We simply acknowledge the cart payload 
    // here and let the frontend initiate the checkout sequence immediately upon success.

    // 4. Return success to trigger the frontend dynamic routing
    return new Response(
      JSON.stringify({
        success: true,
        userId,
        message: 'Identity provisioned. Rerouting to checkout.'
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );

  } catch (err: unknown) {
    console.error('[AUTH_FATAL_REGISTER]', err);
    return new Response(
      JSON.stringify({ error: 'Secure gateway error. Please try again.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
};