import type { APIRoute } from 'astro';
import { z } from 'zod';
import { env } from 'cloudflare:workers';

const schema = z.object({ email: z.string().email().transform(val => val.toLowerCase().trim()) });

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json() as any;
    const { email } = schema.parse(body);
    const db = env?.DB;
    const kv = env?.SESSION;

    if (!db || !kv) return new Response(JSON.stringify({ error: 'Database Offline' }), { status: 500 });

    const user = await db.prepare('SELECT id FROM customers WHERE email = ?1').bind(email).first();

    // Always return 200 to prevent email enumeration attacks
    if (!user) return new Response(JSON.stringify({ success: true }), { status: 200 });

    const resetToken = crypto.randomUUID();

    // Store in KV for exactly 15 minutes (900 seconds)   
    await kv.put(`reset:${resetToken}`, user.id as string, { expirationTtl: 900 });

    // PRO TIP: Trigger your transactional email webhook here, passing the resetToken
    console.log(`[DEV] Password reset token for: ${resetToken}`);

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
};