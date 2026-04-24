import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');

    const db = env.DB;
    // 1. Calculate Balances via Ledger Aggregation
    // 2. Fetch recent ledger history
    const [balanceReq, historyReq] = await db.batch([
      db
        .prepare(
          `
        SELECT 
          SUM(points) as current_balance,
          SUM(CASE WHEN points > 0 THEN points ELSE 0 END) as lifetime_earned
        FROM points_ledger WHERE user_id = ?1
      `
        )
        .bind(locals.user.id),
      db
        .prepare(
          'SELECT * FROM points_ledger WHERE user_id = ?1 ORDER BY created_at DESC LIMIT 20'
        )
        .bind(locals.user.id),
    ]);

    const stats = {
      current_balance: balanceReq.results[0]?.current_balance || 0,
      lifetime_earned: balanceReq.results[0]?.lifetime_earned || 0,
    };

    return new Response(
      JSON.stringify({ stats, history: historyReq.results }),
      { status: 200 }
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: 'Fetch failed' }), {
      status: 500,
    });
  }
};

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user) throw new Error('UNAUTHENTICATED');
    const { points_to_redeem } = (await request.json()) as any;
    const points = Number(points_to_redeem);

    if (!points || points < 100 || points % 100 !== 0) {
      throw new Error('Invalid redemption amount. Must be multiples of 100.');
    }

    const db = env.DB;

    // Safety Check: Verify current balance
    const { results } = await db
      .prepare(
        'SELECT SUM(points) as balance FROM points_ledger WHERE user_id = ?1'
      )
      .bind(locals.user.id)
      .all();
    const currentBalance = results[0]?.balance || 0;

    if (currentBalance < points)
      throw new Error('Insufficient points balance.');

    const discountValue = points / 100; // 100 pts = $1
    const code = `RWD-${crypto.randomUUID().substring(0, 8).toUpperCase()}`;

    // Atomic Transaction: Deduct points AND issue discount code
    await db.batch([
      db
        .prepare(
          `
        INSERT INTO points_ledger (id, user_id, points, reason, created_at)
        VALUES (?1, ?2, ?3, ?4, CURRENT_TIMESTAMP)
      `
        )
        .bind(
          crypto.randomUUID(),
          locals.user.id,
          -Math.abs(points),
          `Redeemed for $${discountValue} discount`
        ),

      db
        .prepare(
          `
        INSERT INTO discounts (id, code, type, value, usage_limit, current_usage, is_active, stackable, customer_id_lock)
        VALUES (?1, ?2, 'FIXED_AMOUNT', ?3, 1, 0, 1, 1, ?4)
      `
        )
        .bind(crypto.randomUUID(), code, discountValue, locals.user.id),
    ]);

    return new Response(
      JSON.stringify({
        success: true,
        discount_code: code,
        value: discountValue,
      }),
      { status: 201 }
    );
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};
