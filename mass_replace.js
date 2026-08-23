const fs = require('fs');
const path = require('path');

const REPLACEMENTS = [
  { regex: /\bbg-white\b/g, replacement: 'bg-[var(--color-paper)]' },
  { regex: /\bbg-gray-50\b/g, replacement: 'bg-[var(--color-paper-2)]' },
  { regex: /\bbg-gray-100\b/g, replacement: 'bg-[var(--color-paper-2)]' },
  { regex: /\bbg-gray-800\b/g, replacement: 'bg-[var(--color-ink)]' },
  { regex: /\bbg-gray-900\b/g, replacement: 'bg-[var(--color-ink)]' },
  
  { regex: /\btext-gray-900\b/g, replacement: 'text-[var(--color-ink)]' },
  { regex: /\btext-gray-800\b/g, replacement: 'text-[var(--color-ink)]' },
  { regex: /\btext-gray-700\b/g, replacement: 'text-[var(--color-neutral)]' },
  { regex: /\btext-gray-600\b/g, replacement: 'text-[var(--color-neutral)]' },
  { regex: /\btext-gray-500\b/g, replacement: 'text-[var(--color-muted)]' },
  { regex: /\btext-gray-400\b/g, replacement: 'text-[var(--color-muted)]' },
  
  { regex: /\bborder-gray-100\b/g, replacement: 'border-[var(--color-rule)]' },
  { regex: /\bborder-gray-200\b/g, replacement: 'border-[var(--color-rule)]' },
  { regex: /\bborder-gray-300\b/g, replacement: 'border-[var(--color-rule)]' },
  
  { regex: /\bdivide-gray-100\b/g, replacement: 'divide-[var(--color-rule)]' },
  { regex: /\bdivide-gray-200\b/g, replacement: 'divide-[var(--color-rule)]' },
  { regex: /\bdivide-gray-300\b/g, replacement: 'divide-[var(--color-rule)]' },

  { regex: /\bhover:bg-gray-50\b/g, replacement: 'hover:bg-[var(--color-paper-2)]' },
  { regex: /\bhover:bg-gray-100\b/g, replacement: 'hover:bg-[var(--color-paper-2)]' },
  { regex: /\bhover:text-gray-900\b/g, replacement: 'hover:text-[var(--color-ink)]' },
];

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

let modifiedFiles = 0;

walkDir('./src', (filePath) => {
  if (!filePath.endsWith('.tsx') && !filePath.endsWith('.ts')) return;
  // Exclude map/page.tsx because it has custom complex logic we already handled
  if (filePath.includes(path.join('map', 'page.tsx'))) return;
  if (filePath.includes(path.join('login', 'page.tsx'))) return;
  if (filePath.includes('page.tsx') && filePath === path.join('src', 'app', 'page.tsx')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let newContent = content;

  REPLACEMENTS.forEach(({ regex, replacement }) => {
    newContent = newContent.replace(regex, replacement);
  });

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, 'utf8');
    console.log(`Updated: ${filePath}`);
    modifiedFiles++;
  }
});

console.log(`Mass replace complete. Modified ${modifiedFiles} files.`);
