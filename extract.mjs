import fs from 'fs';

console.log("⚙️  INITIATING SURGICAL DATA EXTRACTION...");

try {
    // 1. Read the massive 300+ product file you just generated locally
    const rawSql = fs.readFileSync('verified-migration.sql', 'utf-8');

    // 2. Find the exact point where the new catalog data begins
    const targetPoint = 'CREATE TABLE catalog_cache';
    const splitIndex = rawSql.indexOf(targetPoint);

    if (splitIndex === -1) {
        console.error("🛑 FATAL: Could not locate catalog_cache in the SQL dump.");
        process.exit(1);
    }

    // 3. Slice everything from that point downward (capturing all 302 products safely)
    const payload = rawSql.slice(splitIndex);

    // 4. Armor the payload with the DROP TABLE command
    const armoredSql = 'DROP TABLE IF EXISTS catalog_cache;\n' + payload;

    // 5. Write the final, production-ready patch file
    fs.writeFileSync('edge-catalog-patch.sql', armoredSql);

    console.log("✅ EXTRACTION COMPLETE. 'edge-catalog-patch.sql' is ready for deployment.");
} catch (e) {
    console.error("🛑 ERROR:", e.message);
}