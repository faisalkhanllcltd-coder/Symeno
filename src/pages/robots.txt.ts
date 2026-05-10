import type { APIRoute } from 'astro';

export const GET: APIRoute = ({ site }) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /account/
Disallow: /api/
Disallow: /auth/
Disallow: /checkout/

Sitemap: https://symeno.com/sitemap.xml`.trim();

  return new Response(robotsTxt, { headers: { 'Content-Type': 'text/plain' } });
};