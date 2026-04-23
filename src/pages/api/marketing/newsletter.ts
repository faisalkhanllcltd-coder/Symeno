import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const { email, source } = await request.json() as any;
    
    // Edge-native regex validation
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      throw new Error('Invalid email protocol.');
    }

    const db = env.DB;
    
    // Insert safely, ignoring if already subscribed (UNIQUE constraint handles this)
    await db.prepare(`
      INSERT INTO newsletter_subscribers (id, email, source, created_at)
      VALUES (?1, ?2, ?3, CURRENT_TIMESTAMP)
      ON CONFLICT(email) DO UPDATE SET status = 'SUBSCRIBED', updated_at = CURRENT_TIMESTAMP
    `).bind(crypto.randomUUID(), email.toLowerCase(), source || 'footer_capture').run();

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};