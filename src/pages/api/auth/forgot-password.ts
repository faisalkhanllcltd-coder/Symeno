import type { APIRoute } from 'astro';
import { z } from 'zod';
import { env } from 'cloudflare:workers';
import { sendEmail } from '../../../lib/email';

const schema = z.object({ email: z.string().email().trim().toLowerCase() });

export const POST: APIRoute = async (context) => {
  try {
    const body = await context.request.json() as any;
    const { email } = schema.parse(body);
    const db = env?.DB;
    const kv = env?.SESSION;

    if (!db || !kv) return new Response(JSON.stringify({ error: 'Database Offline' }), { status: 500 });

    // FIXED: Target 'users' table, not 'customers'
    const user = await db.prepare('SELECT id FROM users WHERE email = ?1').bind(email).first();

    // Always return 200 to prevent email enumeration attacks
    if (!user) return new Response(JSON.stringify({ success: true }), { status: 200 });

    const resetToken = crypto.randomUUID();

    // Store in KV for exactly 15 minutes (900 seconds)   
    await kv.put(`reset:${resetToken}`, user.id as string, { expirationTtl: 900 });

    try {
      await sendEmail(env, {
        to: email,
        subject: "Reset your Symeno password",
        html: `<p>Click the link below to reset your Symeno password. This link expires in 15 minutes.</p>
               <p><a href="${new URL(context.request.url).origin}/auth/reset-password?token=${resetToken}">Reset Password</a></p>`
      });
    } catch (e) { console.error("Email failed, silently continuing."); }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Invalid request' }), { status: 400 });
  }
};