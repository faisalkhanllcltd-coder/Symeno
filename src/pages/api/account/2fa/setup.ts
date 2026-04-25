import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';
import { generateTOTP, createTOTPKeyURI } from '@oslojs/otp';
import { encodeBase64 } from '@oslojs/encoding';

export const POST: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    // 1. Generate cryptographic TOTP key (Edge safe via oslojs)
    const key = new Uint8Array(20);
    crypto.getRandomValues(key); // Standard Web Crypto API

    // 2. Create the provisioning URI for Authenticator apps
    const uri = createTOTPKeyURI(
      'Symeno Operator Panel',
      locals.user.email,
      key,
      30,
      6
    );

    // 3. Store the temporary key in the database (requires a 'totp_secret' column in users)
    const secretBase64 = encodeBase64(key);

    await env.DB.prepare('UPDATE users SET totp_secret = ?1 WHERE id = ?2')
      .bind(secretBase64, locals.user.id)
      .run();

    return new Response(
      JSON.stringify({
        success: true,
        uri,
        secret: secretBase64, // Optional: show to user for manual entry
      }),
      { status: 200 }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: '2FA generation failed' }), {
      status: 500,
    });
  }
};
