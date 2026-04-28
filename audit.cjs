const fs = require('fs');
const path = require('path');

const srcDir = path.join('d:', 'Symeno LLC', 'Symeno Web', 'src');

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

const colorRegex = /\b(bg-(?:white|black|gray-\d+|slate-\d+)|text-(?:white|black|gray-\d+|slate-\d+)|(?:border|ring)-(?:gray-\d+|slate-\d+))\b/g;
const svgRegex = /(?:fill|stroke)\s*=\s*["']#[0-9a-fA-F]+["']/ig;
const shadowRegex = /\b(shadow-(?:md|lg|xl|2xl|inner)|drop-shadow(?:-\[.*?\])?)\b/g;

walk(srcDir, (filePath) => {
  if (!/\.(astro|svelte|ts|mdx)$/.test(filePath)) return;
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');
  lines.forEach((line, i) => {
    let match;
    let foundColor = false;
    // reset lastIndex
    colorRegex.lastIndex = 0;
    while ((match = colorRegex.exec(line)) !== null) {
      console.log(`COLOR|${filePath}|${i + 1}|${match[1]}`);
    }
    
    svgRegex.lastIndex = 0;
    while ((match = svgRegex.exec(line)) !== null) {
      console.log(`SVG|${filePath}|${i + 1}|${match[0]}`);
    }

    if (filePath.match(/(Modal|Drawer|Dropdown|Toast|Search|Mobile)\.(svelte|astro)$/i)) {
      shadowRegex.lastIndex = 0;
      while ((match = shadowRegex.exec(line)) !== null) {
        console.log(`SHADOW|${filePath}|${i + 1}|${match[1]}`);
      }
    }
  });
});
