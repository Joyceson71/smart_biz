const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', '(dashboard)');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    if (fs.statSync(dirPath).isDirectory()) {
      walkDir(dirPath, callback);
    } else {
      callback(path.join(dir, f));
    }
  });
}

const replacements = [
  // CashFlow and complex dashboard backgrounds
  { regex: /bg-slate-950 text-white overflow-y-auto/g, replacement: 'text-white overflow-y-auto' },
  { regex: /bg-slate-900\/60 backdrop-blur-xl border-b border-white\/10/g, replacement: '' },
  { regex: /bg-slate-900\/40 border border-white\/10 rounded-2xl/g, replacement: 'clay-card' },
  { regex: /bg-slate-900\/40 border border-white\/10 p-6 rounded-2xl/g, replacement: 'clay-card p-6' },
  { regex: /bg-emerald-950\/20 border border-emerald-500\/20 rounded-2xl/g, replacement: 'clay-card border border-emerald-500/20' },
  { regex: /bg-red-950\/20 border border-red-500\/20 rounded-2xl/g, replacement: 'clay-card border border-red-500/20' },
  
  // Settings layout
  { regex: /bg-white\/30 dark:bg-slate-950\/20/g, replacement: 'clay-card' },
  { regex: /bg-white\/50 dark:bg-slate-950\/50/g, replacement: 'neo-pressed border-none bg-transparent' },
  { regex: /bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800/g, replacement: 'clay-card' },
  { regex: /border-slate-200 dark:border-slate-800/g, replacement: 'border-white/5' },
  
  // Standard buttons
  { regex: /className="gap-2"/g, replacement: 'className="gap-2 clay-btn-primary px-4"' },
  { regex: /className="w-full"/g, replacement: 'className="w-full clay-btn-primary"' },
  
  // Clean up stray backgrounds
  { regex: /flex flex-col h-full bg-slate-50 dark:bg-slate-950 p-6/g, replacement: 'flex flex-col h-full p-6' },
  { regex: /bg-white dark:bg-slate-900/g, replacement: 'clay-card' }
];

walkDir(directoryPath, (filePath) => {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    let original = content;
    
    replacements.forEach(({ regex, replacement }) => {
      content = content.replace(regex, replacement);
    });

    if (content !== original) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`Updated: ${filePath}`);
    }
  }
});
