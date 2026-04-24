import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

const enforceAdmin = (locals: App.Locals) => {
  if (
    !locals.user ||
    (locals.user.role !== 'admin' && locals.user.role !== 'staff')
  )
    throw new Error('UNAUTHORIZED');
};

export const GET: APIRoute = async ({ request, locals }) => {
  try {
    enforceAdmin(locals);
    const db = env.DB;
    const url = new URL(request.url);
    const range = url.searchParams.get('range') || '30d'; // Future: use this to filter dates

    // Run parallel queries for maximum edge performance
    const [revenueRes, ordersRes, productsRes, customersRes] = await db.batch([
      // 1. Revenue Overview
      db.prepare(
        "SELECT DATE(created_at) as date, SUM(total) as amount FROM orders WHERE status != 'CANCELLED' GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30"
      ),
      // 2. Order Metrics
      db.prepare(
        'SELECT status, COUNT(*) as count FROM orders GROUP BY status'
      ),
      // 3. Top Products (Approximated from variants if order_items table isn't heavily structured yet)
      db.prepare(
        'SELECT title, base_price as revenue FROM products WHERE is_active = 1 ORDER BY base_price DESC LIMIT 5'
      ),
      // 4. Customer Acquisition
      db.prepare(
        'SELECT DATE(created_at) as date, COUNT(*) as count FROM users GROUP BY DATE(created_at) ORDER BY date DESC LIMIT 30'
      ),
    ]);

    const payload = {
      revenue: revenueRes.results,
      orders: ordersRes.results,
      products: productsRes.results,
      customers: customersRes.results,
    };

    return new Response(JSON.stringify(payload), { status: 200 });
  } catch (e) {
    return new Response(
      JSON.stringify({ error: 'Analytics Aggregation Failed' }),
      { status: 500 }
    );
  }
};
