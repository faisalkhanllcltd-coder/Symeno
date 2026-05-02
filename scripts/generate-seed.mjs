import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const jsonPath = path.resolve(__dirname, '../src/data/rapidapi-catalog.json');
const sqlPath = path.resolve(__dirname, '../seed.sql');

const catalog = JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));

// Rebuild the table schema to perfectly match our new UI routing logic
let sql = `
DROP TABLE IF EXISTS rapidapi_cache;
CREATE TABLE rapidapi_cache (
  id TEXT PRIMARY KEY,
  slug TEXT,
  category TEXT,
  categorySlug TEXT,
  brand TEXT,
  title TEXT,
  description TEXT,
  basePrice REAL,
  retailPrice REAL,
  stockStatus TEXT,
  image_url TEXT
);

`;

for (const item of catalog) {
    // Escape single quotes for SQL insertion
    const escape = (str) => str ? str.replace(/'/g, "''") : '';
    const imageUrl = item.images && item.images.length > 0 ? item.images[0] : '';
    const retail = item.retailPrice ? item.retailPrice : 'NULL';

    sql += `INSERT INTO rapidapi_cache (id, slug, category, categorySlug, brand, title, description, basePrice, retailPrice, stockStatus, image_url) VALUES ('${escape(item.id)}', '${escape(item.slug)}', '${escape(item.category)}', '${escape(item.categorySlug)}', '${escape(item.brand)}', '${escape(item.title)}', '${escape(item.description)}', ${item.basePrice}, ${retail}, '${escape(item.stockStatus)}', '${escape(imageUrl)}');\n`;
}

fs.writeFileSync(sqlPath, sql);
console.log(`✅ Generated seed.sql with ${catalog.length} secured products ready for D1 injection.`);