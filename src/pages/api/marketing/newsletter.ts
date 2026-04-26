import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    let email = '';
    let source = 'footer_capture';

    // Universal parser for both JSON and standard HTML Form Data
    const contentType = request.headers.get('content-type') || '';

    if (contentType.includes('application/json')) {
      const body = (await request.json()) as any;
      email = body.email;
      source = body.source || source;
    } else {
      const formData = await request.formData();
      email = formData.get('email')?.toString() || '';
      source = formData.get('source')?.toString() || 'hero_banner_html';
    }

    // Edge-native regex validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Invalid email protocol.' }), { status: 400 });
    }

    const db = env.DB;

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