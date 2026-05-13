const fs = require('fs');
const path = require('path');

const adminPagesDir = 'src/pages/admin';
const adminApiDir = 'src/pages/api/admin';
const adminComponentsDir = 'src/components/admin';

function walkDir(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const report = {
  rbac: [],
  db: [],
  typeSafety: [],
  orphans: []
};

const allApiRoutes = [];
const allComponents = [];

walkDir(adminApiDir, (filePath) => {
  if (filePath.endsWith('.ts')) {
    const route = filePath.replace(/\\/g, '/').replace('src/pages/api/admin', '/api/admin').replace('.ts', '');
    allApiRoutes.push(route);
  }
});

walkDir(adminComponentsDir, (filePath) => {
  if (filePath.endsWith('.svelte')) {
    allComponents.push(filePath.replace(/\\/g, '/'));
  }
});

walkDir(adminPagesDir, (filePath) => {
  if (filePath.endsWith('.astro')) {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // 1. RBAC check
    if (!content.includes('Astro.locals.user') && !content.includes("role !== 'admin'")) {
      report.rbac.push(filePath);
    }

    // 2. DB check
    if (!content.includes('env.DB') && !content.includes('fetch(')) {
      report.db.push(filePath);
    }
    
    if (content.includes('const dummy') || content.includes('const mock') || content.includes('mockData')) {
      report.db.push(filePath + ' (MOCK DATA)');
    }
    
    // 3. Type Safety (NaN crashes) - checking for raw Number conversions vs strings, or missing empty checks
    // We just flag it for manual review if it passes `products={products}` but products might be undefined
  }
});

console.log("=== MISSING RBAC ===");
console.log(report.rbac.join('\n'));

console.log("\n=== MISSING DB (POSSIBLE DUMMY DATA) ===");
console.log(report.db.join('\n'));

console.log("\n=== ALL API ROUTES ===");
console.log(allApiRoutes.join('\n'));
