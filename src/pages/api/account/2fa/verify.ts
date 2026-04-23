import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { verifyTOTP } from "@oslojs/otp";
import { decodeBase64 } from "@oslojs/encoding";

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { code } = await request.json() as { code: string };
    
    // 1. Retrieve the stored secret
    const userRow = await env.DB.prepare("SELECT totp_secret FROM users WHERE id = ?1").bind(locals.user.id).first();
    if (!userRow || !userRow.totp_secret) throw new Error('2FA not initialized');

    // 2. Decode and verify the 6-digit code
    const key = decodeBase64(userRow.totp_secret as string);
    
    // Validates code with a 30-second window tolerance
    const isValid = verifyTOTP(key, 30, 6, code);
    
    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid or expired code.' }), { status: 400 });
    }

    // 3. Mark 2FA as fully enabled (Assumes a 'totp_enabled' boolean column)
    await env.DB.prepare("UPDATE users SET totp_enabled = 1 WHERE id = ?1").bind(locals.user.id).run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });

  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};