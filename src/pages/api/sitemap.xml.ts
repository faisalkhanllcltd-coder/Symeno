import type { APIRoute } from 'astro';

// This is a dynamic API route. Astro will intercept requests to /sitemap.xml and run this.
export const GET: APIRoute = async ({ request }) => {
  // Production Note: In a real environment, you would query your D1 Database here
  // to get all active product slugs, categories, and brands.
  
  const siteUrl = 'https://www.symeno.com';
  
  // Mock Database Query Results
  const products = ['sony-xm5', 'apple-airpods-max', 'lg-ultragear', 'logitech-mx', 'keychron-k8'];
  const categories = ['audio', 'displays', 'peripherals', 'components'];
  const brands = ['sony', 'apple', 'lg', 'logitech', 'keychron'];

  // Static core pages
  const staticPages = [
    '',
    '/shop',
    '/deals',
    '/new-arrivals',
    '/brands',
    '/about',
    '/faq',
    '/contact'
  ];

  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  // Inject Static Pages
  staticPages.forEach((page) => {
    xml += `  <url>\n    <loc>${siteUrl}${page}</loc>\n    <changefreq>daily</changefreq>\n    <priority>${page === '' ? '1.0' : '0.8'}</priority>\n  </url>\n`;
  });

  // Inject Dynamic Categories (Tier 1)
  categories.forEach((cat) => {
    xml += `  <url>\n    <loc>${siteUrl}/shop/${cat}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.9</priority>\n  </url>\n`;
  });

  // Inject Dynamic Brands (Tier 1)
  brands.forEach((brand) => {
    xml += `  <url>\n    <loc>${siteUrl}/brands/${brand}</loc>\n    <changefreq>weekly</changefreq>\n    <priority>0.8</priority>\n  </url>\n`;
  });

  // Inject Dynamic Products (Tier 3)
  products.forEach((slug) => {
    xml += `  <url>\n    <loc>${siteUrl}/shop/product/${slug}</loc>\n    <changefreq>daily</changefreq>\n    <priority>0.7</priority>\n  </url>\n`;
  });

  xml += `</urlset>`;

  return new Response(xml, {
    status: 200,
    headers: {
      'Content-Type': 'application/xml'
    }
  });
};