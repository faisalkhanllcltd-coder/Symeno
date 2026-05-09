import type { APIRoute } from 'astro';
import { env } from 'cloudflare:workers';

// STEP 3: CLAUDE'S SEARCH TERMS PER CATEGORY GROUP
const CATEGORY_QUERIES = {
  "Kitchen Tools": ["kitchen gadgets tools set", "cooking utensils silicone"],
  "Spice & Pantry Tools": ["spice rack organizer", "magnetic spice jars set"],
  "Coffee & Tea": ["pour over coffee set", "gooseneck kettle barista"],
  "Dining & Entertaining": ["bamboo serving board set", "cocktail shaker set"],
  "Meal Prep & Storage": ["glass meal prep containers set", "silicone food storage bags"],
  "Home Organization": ["bamboo drawer organizer", "stackable storage bins"],
  "Cleaning & Laundry": ["microfibre cleaning cloths set", "laundry mesh bags"],
  "Bedroom & Sleep": ["silk pillowcase mulberry", "contoured sleep mask"],
  "Candles & Aromatherapy": ["soy wax candle gift set", "reed diffuser home"],
  "Desk & Office": ["bamboo desk organizer", "wireless charging stand"],
  "Bath & Shower": ["bamboo shower caddy", "teak bath tray"],
  "Men's Grooming": ["safety razor double edge kit", "beard grooming set"],
  "Skincare Tools": ["gua sha rose quartz set", "jade roller face"],
  "Hair Care & Accessories": ["satin scrunchie set silk", "claw clip hair set"],
  "Wellness Accessories": ["acupressure mat set", "foam roller massage"],
  "Women's Accessories": ["silk scarf square 90cm", "compact umbrella windproof"],
  "Men's Accessories": ["leather card holder slim", "tie clip set men"],
  "Jewellery Accessories": ["jewellery tray organizer velvet", "travel jewellery case"],
  "Bags & Pouches": ["cosmetic bag pouch vegan", "packing cubes travel set"],
  "Socks & Comfort Wear": ["bamboo socks set men women", "compression socks travel"],
  "Outdoor & Picnic": ["waterproof picnic blanket", "collapsible water bottle"],
  "Fitness Accessories": ["resistance band set gym", "ab wheel roller"],
  "Yoga & Mindfulness": ["non slip yoga mat 6mm", "meditation cushion buckwheat"],
  "Travel Accessories": ["packing cubes compression set", "RFID passport holder"],
  "Cycling & Urban Mobility": ["bike phone mount handlebar", "cycling gloves padded"],
  "Baby Accessories": ["silicone bib baby set", "muslin swaddle blanket"],
  "Kids Toys & Learning": ["magnetic drawing board kids", "sensory fidget toys"],
  "Pet Accessories": ["collapsible dog bowl", "pet grooming glove"],
  "Gift Boxes & Packaging": ["kraft gift box set", "satin ribbon gift wrapping"],
  "Party & Gifting": ["balloon arch kit party", "photo booth props set"],
  "Stationery & Journaling": ["bullet journal dotted A5", "washi tape set variety"],
  "Eid & Festive": ["eid decoration set lights", "islamic geometric gift wrap"],
  "Plant Care": ["self watering pot terracotta", "plant mister copper"],
  "Sustainable Living": ["bamboo toothbrush set eco", "beeswax food wrap reusable"],
  "Everyday Carry": ["titanium key multi tool", "slim RFID card holder"],
  "Cable & Device Management": ["cable management box desk", "magnetic cable clips"],
};

// Utility functions required by Claude's code
function slugify(text: string) {
  return text.toString().toLowerCase().trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
}

function extractBrand(title: string) {
  return title.split(' ')[0] || 'Unknown';
}

// STEP 2: CLAUDE'S HASDATA SCRAPE STRATEGY
async function scrapeCategory(categoryName: string, searchTerms: string[], apiKey: string) {
  const results = [];

  for (const term of searchTerms) {
    const res = await fetch(
      `https://api.hasdata.com/scrape/amazon/search?` +
      new URLSearchParams({ q: term, domain: 'www.amazon.com', maxResults: '10', location: 'US' }),
      { headers: { 'x-api-key': apiKey } }
    );

    if (!res.ok) continue; // Skip on failure to prevent crashes
    const data = await res.json() as any;

    for (const product of data.productResults ?? data.results ?? []) {
      results.push({
        id: crypto.randomUUID(),
        name: product.title,
        slug: slugify(product.title),
        brand: product.brand ?? extractBrand(product.title),
        category: categoryName,
        price: parseFloat(product.price?.currentPrice?.toString().replace(/[^0-9.]/g, '') ?? '0'),
        description: product.description ?? product.featureBullets?.join(' ') ?? '',
        images_json: JSON.stringify(product.images ?? [product.imageUrl]),
        rating: product.reviewsInfo?.rating ?? null,
        review_count: product.reviewsInfo?.totalReviews ?? 0,
        source: 'hasdata',
        source_url: product.url,
        scraped_at: Math.floor(Date.now() / 1000),
        in_stock: 1,
      });
    }
  }
  return results;
}

// STEP 4: CLAUDE'S DB SYNC EXECUTION
export const POST: APIRoute = async ({ locals }) => {
  try {
    // Claude uses locals.runtime.env.DB, falling back to env.DB for local dev
    const db = (locals as any).runtime?.env?.DB || (env as any).DB;
    const HASDATA_KEY = (env as any).HASDATA_API_KEY;

    if (!HASDATA_KEY) throw new Error("Missing HasData API Key");

    for (const [category, terms] of Object.entries(CATEGORY_QUERIES)) {
      const products = await scrapeCategory(category, terms, HASDATA_KEY);

      for (const p of products) {
        await db.prepare(`
          INSERT INTO catalog_cache
            (id, name, slug, brand, category, price, description,
             images_json, rating, review_count, source, source_url, scraped_at, in_stock)
          VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)
          ON CONFLICT(slug) DO UPDATE SET
            price       = excluded.price,
            images_json = excluded.images_json,
            scraped_at  = excluded.scraped_at,
            in_stock    = excluded.in_stock
        `).bind(
          p.id, p.name, p.slug, p.brand, p.category, p.price, p.description,
          p.images_json, p.rating, p.review_count, p.source, p.source_url, p.scraped_at, p.in_stock
        ).run();
      }
    }

    return new Response(JSON.stringify({ ok: true }), { status: 200 });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }
};