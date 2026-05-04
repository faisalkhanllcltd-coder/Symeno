// scripts/sync-amazon.js
import 'dotenv/config';
import { execSync } from 'child_process';
import fs from 'fs'; // Added for file-based SQL execution

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const DB_NAME = "symeno-prod-db";

if (!RAPIDAPI_KEY) {
  console.error("❌ FATAL: RAPIDAPI_KEY is missing from your .env file.");
  process.exit(1);
}

async function fetchRealAmazonData(asin) {
  console.log(`[NETWORK] Fetching ASIN: ${asin}...`);

  const url = `https://real-time-amazon-data.p.rapidapi.com/product-details?asin=${asin}&country=US`;
  const options = {
    method: 'GET',
    headers: {
      'x-rapidapi-key': RAPIDAPI_KEY,
      'x-rapidapi-host': 'real-time-amazon-data.p.rapidapi.com'
    }
  };

  try {
    const response = await fetch(url, options);
    const result = await response.json();

    if (result.status !== "OK") {
      throw new Error(result.message || "API rate limit or connection error.");
    }

    const data = result.data;
    return {
      images: data.product_photos || [],
      bullets: data.about_product || []
    };
  } catch (error) {
    console.error(`[ERROR] ASIN ${asin} failed:`, error.message);
    return null;
  }
}

async function syncCatalog() {
  console.log('🚀 INITIALIZING SYMENO DYNAMIC ENRICHMENT PIPELINE...');

  try {
    const query = "SELECT slug, id FROM rapidapi_cache WHERE images_json IS NULL LIMIT 10;";
    console.log("📡 Querying edge datastore...");

    let output;
    try {
      output = execSync(`npx wrangler d1 execute ${DB_NAME} --local --command="${query}" --json`, { stdio: ['pipe', 'pipe', 'pipe'] }).toString();
    } catch (execError) {
      console.error("❌ SQLITE EXECUTION FAILED. Raw Error:");
      console.error(execError.stderr ? execError.stderr.toString() : execError.message);
      return;
    }

    const jsonStartIndex = output.indexOf('[');
    if (jsonStartIndex === -1) {
      console.error("❌ FATAL: Could not detect JSON payload in Wrangler output.");
      console.log("RAW OUTPUT:", output);
      return;
    }

    const cleanJson = output.substring(jsonStartIndex);
    const parsedOutput = JSON.parse(cleanJson);
    const products = parsedOutput[0].results;

    if (!products || products.length === 0) {
      console.log("✅ Catalog is fully enriched. Zero pending assets.");
      return;
    }

    console.log(`📦 Found ${products.length} assets pending enrichment in this batch...`);

    for (const product of products) {
      const targetAsin = product.id;

      if (!targetAsin) {
        console.log(`[SKIPPED] 🟡 No ID/ASIN found for: ${product.slug}`);
        continue;
      }

      const richData = await fetchRealAmazonData(targetAsin);

      if (richData && richData.images.length > 0) {
        // Sanitize single quotes for SQLite
        const imagesJson = JSON.stringify(richData.images).replace(/'/g, "''");
        const bulletsJson = JSON.stringify(richData.bullets).replace(/'/g, "''");

        const updateSql = `UPDATE rapidapi_cache SET images_json = '${imagesJson}', features_json = '${bulletsJson}' WHERE slug = '${product.slug}';`;

        // THE FIX: Write to a file to bypass Windows CMD string escaping destruction
        const tempFileName = `temp-update-${product.id}.sql`;

        try {
          fs.writeFileSync(tempFileName, updateSql, 'utf8');
          execSync(`npx wrangler d1 execute ${DB_NAME} --local --file=${tempFileName}`, { stdio: 'ignore' });
          console.log(`[SUCCESS] 🟢 Secured data for: ${product.slug}`);
        } catch (e) {
          console.error(`[FAILED] 🔴 Database write error for: ${product.slug}`);
        } finally {
          // Always clean up the temp file
          if (fs.existsSync(tempFileName)) {
            fs.unlinkSync(tempFileName);
          }
        }

      } else {
        console.log(`[FAILED] 🔴 API returned no media for: ${product.slug} (ASIN: ${targetAsin})`);
      }

      console.log("⏳ Enforcing rate limit delay...");
      await new Promise(r => setTimeout(r, 2000));
    }

    console.log('\n✅ BATCH COMPLETE. Run the script again to process the next 10 items.');

  } catch (error) {
    console.error("❌ PIPELINE FATAL ERROR:", error.message);
  }
}

syncCatalog();