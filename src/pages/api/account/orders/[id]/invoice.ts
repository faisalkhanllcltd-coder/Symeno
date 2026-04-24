import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ params, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    // Verify ownership
    const order = await env.DB.prepare(
      'SELECT id FROM orders WHERE id = ?1 AND customer_id = ?2'
    )
      .bind(params.id, locals.user.id)
      .first();
    if (!order) return new Response('Forbidden', { status: 403 });

    // Edge PDF generation is complex. For Edge environments, the standard is to
    // return a formatted HTML receipt with print styling, rather than a heavy PDF buffer.
    const html = `
      <html>
        <head><title>Invoice ${params.id}</title></head>
        <body onload="window.print()" style="font-family: monospace; padding: 40px; background: white; color: black;">
          <h1>SYMENO INVOICE</h1>
          <p>Order ID: ${params.id}</p>
          <hr/>
          <p>Receipt rendering logic goes here.</p>
        </body>
      </html>
    `;

    return new Response(html, {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  } catch (e) {
    return new Response('Invoice Generation Failed', { status: 500 });
  }
};
