const fs = require('fs');
const path = require('path');

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

const allApiRoutes = [];
walkDir(adminApiDir, (filePath) => {
  if (filePath.endsWith('.ts')) {
    // e.g. src/pages/api/admin/alerts.ts -> /api/admin/alerts
    // e.g. src/pages/api/admin/brands/index.ts -> /api/admin/brands
    // e.g. src/pages/api/admin/orders/[id]/refund.ts -> /api/admin/orders
    let route = filePath.replace(/\\/g, '/').replace('src/pages/', '/').replace('.ts', '').replace('/index', '');
    // just store the raw file path for now
    allApiRoutes.push({ file: filePath, route, used: false });
  }
});

walkDir(adminComponentsDir, (filePath) => {
  if (filePath.endsWith('.svelte')) {
    const content = fs.readFileSync(filePath, 'utf8');
    allApiRoutes.forEach(api => {
      // Very basic usage check: does the Svelte file contain a string that looks like the route?
      // Extract the base route name without dynamic parameters
      const baseRoute = api.route.split(/\/[\[]/)[0];
      if (content.includes(baseRoute)) {
        api.used = true;
      }
    });
  }
});

const orphans = allApiRoutes.filter(a => !a.used);
console.log("=== ORPHAN API ROUTES ===");
console.log(orphans.map(a => a.file).join('\n'));

// Now let's check for orphan components (components not imported in any astro or svelte file)
const allComponents = [];
walkDir(adminComponentsDir, (filePath) => {
  if (filePath.endsWith('.svelte')) {
    allComponents.push({
      file: filePath,
      name: path.basename(filePath),
      used: false
    });
  }
});

const allFiles = [];
walkDir('src/pages/admin', f => { if (f.endsWith('.astro')) allFiles.push(f); });
walkDir('src/components/admin', f => { if (f.endsWith('.svelte')) allFiles.push(f); });

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  allComponents.forEach(c => {
    if (content.includes(c.name)) {
      c.used = true;
    }
  });
});

const orphanComponents = allComponents.filter(c => !c.used);
console.log("\n=== ORPHAN SVELTE COMPONENTS ===");
console.log(orphanComponents.map(c => c.file).join('\n'));

