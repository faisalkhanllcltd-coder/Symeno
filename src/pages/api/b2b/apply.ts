import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request }) => {
  try {
    const data = (await request.json()) as any;

    if (!data.company_name || !data.trade_license || !data.contact_email) {
      throw new Error('Missing critical corporate telemetry.');
    }

    const db = env.DB;
    if (!db) return new Response(JSON.stringify({ error: 'DB Offline' }), { status: 503 });
    const id = crypto.randomUUID();

    await db
      .prepare(
        `
      INSERT INTO b2b_applications (id, company_name, trade_license, tax_id, contact_email)
      VALUES (?1, ?2, ?3, ?4, ?5)
    `
      )
      .bind(
        id,
        data.company_name,
        data.trade_license,
        data.tax_id || null,
        data.contact_email
      )
      .run();

    return new Response(JSON.stringify({ success: true, id }), { status: 201 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: 'An unexpected error occurred.' }), { status: 400 });
  }
};
