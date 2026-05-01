import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Resolve directory paths for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dataDir = path.resolve(__dirname, '../src/data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const API_KEY = process.env.RAPIDAPI_KEY;

if (!API_KEY) {
  console.error("🚨 FATAL: RAPIDAPI_KEY environment variable is missing.");
  process.exit(1);
}

// THE ZERO-RISK MATIRX: 20 Categories mapped to search queries and believable B2B supplier brands.
const SEARCH_TARGETS = [
  // Kitchen, Coffee & Dining
  { cat: "Coffee & Tea", brand: "AeroBrew", query: "reusable pour over coffee filter stainless" },
  { cat: "Drinkware", brand: "SipSecure", query: "silicone spill proof tumbler lids" },
  { cat: "Baking", brand: "CulinaPrep", query: "silicone baking mat set premium" },
  { cat: "Kitchen Gadgets", brand: "ChefCore", query: "magnetic measuring spoons stainless" },

  // Home, Desk & Organization
  { cat: "Home Organization", brand: "TidySpace", query: "fabric packing cubes travel luggage" },
  { cat: "Desk & Workspace", brand: "ModaDesk", query: "faux leather desk mat extended" },
  { cat: "Plant Care", brand: "Verdant Supply", query: "brass soil moisture meter indoor plants" },
  { cat: "Shoe Care", brand: "Cobbler Select", query: "cedar shoe trees adjustable" },

  // Lifestyle, Travel & EDC
  { cat: "Everyday Carry", brand: "Apex Minimal", query: "minimalist slim wallet front pocket" },
  { cat: "Travel Accessories", brand: "AeroTravel", query: "RFID passport wallet travel document" },
  { cat: "Reading Accessories", brand: "Lumina Home", query: "clip on amber book light reading" },
  { cat: "Stationery", brand: "Draft & Forge", query: "dotted grid notebook journal premium" },

  // Wellness, Fitness & Focus
  { cat: "Fitness", brand: "CoreFit", query: "fabric resistance bands set workout" },
  { cat: "Meditation", brand: "Aura Rest", query: "premium sleep mask silk blackout" },
  { cat: "Hair Accessories", brand: "Velvet & Twine", query: "durable acetate hair claw clips" },
  { cat: "Bathroom Org", brand: "Zenith Bath", query: "silicone toiletry organizer shower" },

  // Pets & Hobbies
  { cat: "Pet Walking", brand: "Paws & Trek", query: "reflective dog leash heavy duty" },
  { cat: "Pet Travel", brand: "Paws & Trek", query: "collapsible silicone dog bowl travel" },
  { cat: "Tabletop Gaming", brand: "Forge Tabletop", query: "premium metal dice set polyhedral" },
  { cat: "Tech Care", brand: "OpticClear", query: "microfiber lens cleaning cloth camera" }
];

const TARGET_FILE = path.join(dataDir, 'rapidapi-catalog.json');

// Utility function to pause execution (prevents RapidAPI Rate Limiting)
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function fetchCatalog() {
  console.log(`[INGEST] Initiating Phase 1: The Zero-Risk Matrix Ingestion...`);
  let unifiedCatalog = [];

  for (const target of SEARCH_TARGETS) {
    console.log(`[INGEST] Fetching Category: ${target.cat} | Query: ${target.query}`);
    try {
      const url = `https://real-time-amazon-data.p.rapidapi.com/search?query=${encodeURIComponent(target.query)}&page=1&country=US&sort_by=REVIEWS`;

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com',
          'x-rapidapi-key': API_KEY
        }
      });

      const json = await response.json();

      if (!json.data || !json.data.products) {
        console.error(`[INGEST] API Failed for ${target.cat}`, json);
        continue;
      }

      // Process top 7 items per category (Total catalog will be ~140 products)
      const mappedProducts = json.data.products.slice(0, 7).map(item => {
        // Clean up the messy Amazon title for the UI
        let cleanTitle = item.product_title.split(',')[0].split('-')[0].trim();
        if (cleanTitle.length > 60) cleanTitle = cleanTitle.substring(0, 60) + '...';

        return {
          id: item.asin,
          slug: item.product_title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '').slice(0, 50),
          category: target.cat,
          categorySlug: target.cat.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
          brand: target.brand,
          title: cleanTitle,
          description: `Premium ${target.cat.toLowerCase()} hardware sourced directly from our verified independent supply chain. Authentic quality, factory sealed.`,
          basePrice: item.product_price ? parseFloat(item.product_price.replace('$', '')) : Math.floor(Math.random() * (49 - 15 + 1) + 15) + 0.99, // Fallback realistic pricing
          retailPrice: item.product_original_price ? parseFloat(item.product_original_price.replace('$', '')) : null,
          stockStatus: 'OUT_OF_STOCK', // Preserved for Painted Door logic
          images: [item.product_photo]
        };
      });

      unifiedCatalog = [...unifiedCatalog, ...mappedProducts];

      // Crucial: Wait 1.5 seconds before hitting the API again to avoid rate limits
      await delay(1500);

    } catch (error) {
      console.error(`[INGEST] Network Error on ${target.cat}:`, error);
    }
  }

  fs.writeFileSync(TARGET_FILE, JSON.stringify(unifiedCatalog, null, 2));
  console.log(`\n✅ [INGEST COMPLETE] Secured ${unifiedCatalog.length} products across 20 categories.`);
  console.log(`Matrix saved to ${TARGET_FILE}`);
}

fetchCatalog();