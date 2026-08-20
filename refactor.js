const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src', 'app', '(dashboard)');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    const dirPath = path.join(dir, f);
    const isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const replacements = [
  // Standard layout backgrounds
  { regex: /bg-slate-50 dark:bg-slate-950 p-6/g, replacement: 'p-6' },
  { regex: /bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-200 dark:border-slate-800/g, replacement: 'clay-card p-6' },
  { regex: /border-b border-slate-200 dark:border-slate-800/g, replacement: '' },
  
  // Invoice/Cashflow specific removals (stripping 3D/legacy dark mode)
  { regex: /bg-slate-950 text-white w-full overflow-y-auto/g, replacement: 'text-white w-full overflow-y-auto' },
  { regex: /bg-slate-900\/20 backdrop-blur-md/g, replacement: '' },
  { regex: /bg-slate-900\/40 backdrop-blur-xl border border-white\/10 p-1\.5 rounded-xl/g, replacement: 'neo-pressed p-1 rounded-2xl' },
  { regex: /bg-slate-900\/40 backdrop-blur-xl rounded-2xl border border-white\/10 p-2 shadow-2xl/g, replacement: 'clay-card p-6' }
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
