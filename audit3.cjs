const fs = require('fs');
const path = require('path');

const adminApiDir = 'src/pages/api/admin';
const adminComponentsDir = 'src/components/admin';
const allSrcDir = 'src';

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
    let route = filePath.replace(/\\/g, '/').replace('src/pages/', '/').replace('.ts', '').replace('/index', '');
    allApiRoutes.push({ file: filePath, route, used: false });
  }
});

const allComponents = [];
walkDir(adminComponentsDir, (filePath) => {
  if (filePath.endsWith('.svelte')) {
    allComponents.push({
      file: filePath,
      name: path.basename(filePath).replace('.svelte', ''),
      used: false
    });
  }
});

const allFiles = [];
walkDir(allSrcDir, f => { 
  if (f.endsWith('.astro') || f.endsWith('.svelte') || f.endsWith('.ts')) {
    allFiles.push(f); 
  }
});

allFiles.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  allComponents.forEach(c => {
    if (content.includes(c.name)) {
      c.used = true;
    }
  });
  allApiRoutes.forEach(api => {
    const baseRoute = api.route.split(/\/[\[]/)[0];
    if (content.includes(baseRoute)) {
      api.used = true;
    }
  });
});

const orphanComponents = allComponents.filter(c => !c.used);
console.log("\n=== TRUE ORPHAN SVELTE COMPONENTS ===");
console.log(orphanComponents.map(c => c.file).join('\n'));

const orphans = allApiRoutes.filter(a => !a.used);
console.log("\n=== TRUE ORPHAN API ROUTES ===");
console.log(orphans.map(a => a.file).join('\n'));

