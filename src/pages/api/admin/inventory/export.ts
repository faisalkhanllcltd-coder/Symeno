import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

export const GET: APIRoute = async ({ locals }) => {
  try {
    if (
      !locals.user ||
      (locals.user.role !== 'admin' && locals.user.role !== 'staff')
    )
      throw new Error('UNAUTHORIZED');

    const { results } = await env.DB.prepare(
      `
      SELECT v.slug, p.title as product, v.title as variant, v.inventory_quantity, p.is_active, p.category, p.brand
      FROM product_variants v JOIN products p ON v.product_id = p.id
    `
    ).all();

    let csv = 'Slug,Product,Variant,Category,Brand,Stock,Active\n';
    results.forEach((row: any) => {
      csv += `"${row.slug}","${row.product}","${row.variant}","${row.category}","${row.brand}",${row.inventory_quantity},${row.is_active ? 'YES' : 'NO'}\n`;
    });

    return new Response(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="inventory_export.csv"',
      },
    });
  } catch (e) {
    return new Response('Export Failed', { status: 500 });
  }
};
