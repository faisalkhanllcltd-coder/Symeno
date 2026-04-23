// src/lib/catalog.ts
import { getDb } from './db';

export async function getActiveProducts(context: any) {
  const db = getDb(context);
  
  // Joins the core product data with the active variant pricing/stock.
  // Note: 'brand' is stubbed until we build the Brands relation table.
  // We simulate the 'was' (RRP) price by adding a 30% markup to our retail price for the UI.
  const { results } = await db.prepare(`
    SELECT 
      p.id as productId, 
      p.slug, 
      p.title as name, 
      p.description, 
      v.id as variantId,
      v.retail_price as price, 
      (v.retail_price * 1.30) as was, 
      v.stock_quantity as stock,
      'Verified Brand' as brand
    FROM products p
    JOIN variants v ON p.id = v.product_id
    WHERE p.is_active = 1 AND v.stock_quantity > 0
    ORDER BY p.id DESC
  `).all();
  
  return results;
}

export async function getProductBySlug(context: any, slug: string) {
  const db = getDb(context);
  
  const product = await db.prepare(`
    SELECT 
      p.id as productId, 
      p.slug, 
      p.title as name, 
      p.description, 
      v.id as variantId,
      v.retail_price as price, 
      (v.retail_price * 1.30) as was, 
      v.stock_quantity as stock,
      'Verified Brand' as brand
    FROM products p
    JOIN variants v ON p.id = v.product_id
    WHERE p.slug = ? AND p.is_active = 1
  `).bind(slug).first();
  
  return product;
}
