import fs from 'fs';

// ==========================================
// DEPLOYMENT CONTROL CENTER
// Armed for Phase 3: The Final 12 Categories (Organic Randomizer)
// ==========================================
const ACTIVE_PHASE = 3;

let HASDATA_KEY = '';
try {
    const envFile = fs.readFileSync('.dev.vars', 'utf-8');
    HASDATA_KEY = envFile.split('HASDATA_API_KEY=')[1].split('\n')[0].trim();
} catch (e) {
    console.error("FATAL: Could not read .dev.vars file. Make sure it exists.");
    process.exit(1);
}

const INGEST_URL = "http://localhost:4321/api/ingest";

// The complete 37-category payload, mathematically verified.
const PHASED_QUERIES = {
    1: {
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
        "Men's Grooming": ["safety razor double edge kit", "beard grooming set"]
    },
    2: {
        "Wall & Décor": ["command hook variety pack", "floating corner shelves"],
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
        "Travel Accessories": ["packing cubes compression set", "RFID passport holder"]
    },
    3: {
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
        "Cable & Device Management": ["cable management box desk", "magnetic cable clips"]
    }
};

const delay = (ms) => new Promise(res => setTimeout(res, ms));

async function getAsinsFromSearch(keyword, retryCount = 0) {
    try {
        // UPGRADED: maxResults=12 to ensure we have a large enough pool for the randomizer
        const searchUrl = `https://api.hasdata.com/scrape/amazon/search?q=${encodeURIComponent(keyword)}&domain=www.amazon.com&maxResults=12&location=US`;
        const res = await fetch(searchUrl, { headers: { 'x-api-key': HASDATA_KEY } });

        if (!res.ok) {
            if (res.status === 429) {
                console.log(`\n  ⚠️ [RATE LIMIT HIT] HasData is throttling us. Cooling down for 10 seconds...`);
                await delay(10000);
                return retryCount < 3 ? getAsinsFromSearch(keyword, retryCount + 1) : [];
            }
            if (res.status === 402 || res.status === 403) {
                console.error(`\n  🛑 [FATAL ERROR] HasData API Credits Exhausted or Key Invalid! Status: ${res.status}`);
                process.exit(1);
            }
            console.log(`  ❌ HasData Search API Error: HTTP ${res.status}`);
            return [];
        }

        const json = await res.json();
        if (json.productResults && json.productResults.length > 0) {
            // THE RANDOMIZER: Generates a random number between 6 and 10
            const randomCount = Math.floor(Math.random() * (10 - 6 + 1)) + 6;
            return json.productResults.slice(0, randomCount).map(item => item.asin);
        }
        return [];
    } catch (e) {
        console.error(`  ❌ Critical Network Failure for "${keyword}": ${e.message}`);
        return [];
    }
}

async function ingestAsin(asin, targetCategory) {
    try {
        const res = await fetch(INGEST_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: [asin], type: "asin", targetCategory: targetCategory })
        });

        const data = await res.json();
        if (res.ok && data.success) {
            return true;
        } else {
            console.error(`\n  ❌ DB Reject: ${data.error || 'Unknown Error'}`);
            return false;
        }
    } catch (e) {
        return false;
    }
}

async function executeDeployment() {
    if (!PHASED_QUERIES[ACTIVE_PHASE]) {
        console.error(`🛑 FATAL: Phase ${ACTIVE_PHASE} does not exist. Please set ACTIVE_PHASE to 1, 2, or 3.`);
        process.exit(1);
    }

    const currentTarget = PHASED_QUERIES[ACTIVE_PHASE];

    console.log(`🚀 INITIATING SYMENO BULK DEPLOYMENT: PHASE ${ACTIVE_PHASE} OF 3`);
    console.log(`📦 Injecting ${Object.keys(currentTarget).length} core categories. Target: 6 to 10 random products per query.`);
    console.log("⚠️  Using Enterprise Rate-Limiting Protocols...");
    console.log("---------------------------------------------------------------");

    let successCount = 0;

    for (const [category, terms] of Object.entries(currentTarget)) {
        console.log(`\n📂 TARGETING CATEGORY: [${category}]`);

        for (const term of terms) {
            console.log(`  🔍 Querying Amazon for: "${term}"...`);
            const asins = await getAsinsFromSearch(term);

            if (asins.length > 0) {
                console.log(`  🎯 Found ${asins.length} top ASINs. Routing to Astro Ingestion Engine...`);

                for (const asin of asins) {
                    const ingested = await ingestAsin(asin, category);
                    if (ingested) {
                        successCount++;
                        process.stdout.write(`+`);
                    } else {
                        process.stdout.write(`-`);
                    }
                    // SAFE DELAY: 3.5 seconds per product to keep HasData happy
                    await delay(3500);
                }
                console.log('');
            } else {
                console.log(`  ❌ Zero ASINs returned for: "${term}"`);
            }

            // SAFE DELAY: 5 seconds between search queries
            await delay(5000);
        }
    }

    console.log("\n---------------------------------------------------------------");
    console.log(`✅ SYMENO PHASE ${ACTIVE_PHASE} COMPLETE.`);
    console.log(`Total Products Successfully Indexed Today: ${successCount}`);
}

executeDeployment();