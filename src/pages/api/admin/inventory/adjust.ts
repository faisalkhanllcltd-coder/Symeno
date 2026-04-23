import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const POST: APIRoute = async ({ request, locals }) => {
  try {
    if (!locals.user || (locals.user.role !== 'admin' && locals.user.role !== 'staff')) throw new Error('UNAUTHORIZED');
    const { variant_id, adjustment, reason, notes } = await request.json() as any;
    
    const db = env.DB;
    
    // 1. Get current stock safely
    const current = await db.prepare('SELECT inventory_quantity FROM product_variants WHERE id = ?1').bind(variant_id).first();
    if (!current) throw new Error('Variant not found');
    
    const oldStock = current.inventory_quantity as number;
    const newStock = oldStock + Number(adjustment);

    if (newStock < 0) throw new Error('Stock cannot drop below zero.');

    // 2. Atomic Batch Update: Update Stock + Insert Audit Log
    await db.batch([
      db.prepare('UPDATE product_variants SET inventory_quantity = ?1 WHERE id = ?2').bind(newStock, variant_id),
      db.prepare(`
        INSERT INTO inventory_history (id, variant_id, actor_id, previous_stock, new_stock, adjustment, reason, notes) 
        VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8)
      `).bind(crypto.randomUUID(), variant_id, locals.user.id, oldStock, newStock, adjustment, reason, notes || '')
    ]);

    return new Response(JSON.stringify({ success: true, newStock }), { status: 200 });
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }
};