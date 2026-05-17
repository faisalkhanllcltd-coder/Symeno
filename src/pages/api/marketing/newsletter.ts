import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    let email = '';
    let source = 'footer_capture';
    let turnstileToken = ''; // THE FIX: State container for the token

    // Universal parser for both JSON and standard HTML Form Data
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as any;
      email = body.email;
      source = body.source || source;
      turnstileToken = body['cf-turnstile-response'] || '';
    } else {
      const formData = await request.formData();
      email = formData.get('email')?.toString() || '';
      source = formData.get('source')?.toString() || 'hero_banner_html';
      turnstileToken = formData.get('cf-turnstile-response')?.toString() || '';
    }

    // Edge-native regex validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email protocol.' }), { status: 400 });
    }

    // THE FIX: Strict fail-closed Turnstile verification to protect the DB from spam bots
    if (!turnstileToken) {
      return new Response(JSON.stringify({ error: 'Security token missing. Are you a bot?' }), { status: 403 });
    }

    const turnstileSecret = (env as any).TURNSTILE_SECRET_KEY;
    if (!turnstileSecret) {
      return new Response(JSON.stringify({ error: 'System Error: Turnstile secret missing from environment.' }), { status: 500 });
    }

    const verifyRes = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `secret=${turnstileSecret}&response=${turnstileToken}`
    });
    const verifyData = await verifyRes.json() as any;

    if (!verifyData.success) {
      return new Response(JSON.stringify({ error: 'Transmission rejected. Security verification failed.' }), { status: 403 });
    }

    const db = (env as any).DB;
    if (!db) return new Response(JSON.stringify({ error: 'DB Offline' }), { status: 503 });

    // Insert safely, ignoring if already subscribed (UNIQUE constraint handles this)
    await db
      .prepare(
        `
      INSERT INTO newsletter_subscribers (id, email, source, created_at)
      VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP)
      ON CONFLICT(email) DO UPDATE SET status = 'SUBSCRIBED', updated_at = CURRENT_TIMESTAMP
    `
      )
      .bind(
        crypto.randomUUID(),
        email.toLowerCase(),
        source
      )
      .run();

    // If it was a raw HTML form submission, execute a clean redirect
    if (contentType.includes('form')) {
      return redirect('/?status=subscribed', 302);
    }

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};