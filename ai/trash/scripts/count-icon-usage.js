#!/usr/bin/env node

// Scans a corpus of Semantic UI classic HTML files for <i class="... icon">
// patterns, strips known modifiers, and counts icon name prevalence.
//
// Usage:
//   node count-icon-usage.js [glob]
//   node count-icon-usage.js ~/dev/qualia/services/**/*.html

import { readFileSync, writeFileSync } from 'fs';
import { globSync } from 'fs';
import { resolve } from 'path';

// -- Config ------------------------------------------------------------------

const SUI_MODIFIERS = new Set([
  // sizes
  'mini',
  'tiny',
  'small',
  'medium',
  'large',
  'big',
  'huge',
  'massive',
  // colors
  'red',
  'orange',
  'yellow',
  'olive',
  'green',
  'teal',
  'blue',
  'violet',
  'purple',
  'pink',
  'brown',
  'grey',
  'gray',
  'black',
  'white',
  // states
  'disabled',
  'loading',
  'active',
  // variations
  'fitted',
  'link',
  'circular',
  'bordered',
  'inverted',
  'flipped',
  'rotated',
  'corner',
  'clockwise',
  'counterclockwise',
  'spin',
  'outline',
  'floated',
  'styled',
  'recessed',
  // other class noise
  'ui',
  'icon',
  'icons',
  'flat',
]);

// Matches <i class="...icon..."> — the class must contain the word "icon"
const ICON_TAG_RE = /<i\s+class="([^"]*\bicon\b[^"]*)"/g;

// Template expressions like {{...}}
const TEMPLATE_RE = /\{\{[^}]*\}\}/g;

// -- Helpers -----------------------------------------------------------------

function extractIconName(classStr) {
  // strip template expressions
  let cleaned = classStr.replace(TEMPLATE_RE, ' ');

  // tokenize and strip modifiers
  const tokens = cleaned
    .split(/\s+/)
    .map(t => t.trim().toLowerCase())
    .filter(t => t && !SUI_MODIFIERS.has(t));

  const name = tokens.join(' ').trim();
  return name || null;
}

// -- Main --------------------------------------------------------------------

const args = process.argv.slice(2);
const globPattern = args[0] || `${process.env.HOME}/dev/qualia/services/**/*.html`;

// Use child_process to expand glob since Node's fs.globSync may not exist
import { execSync } from 'child_process';

const files = execSync(`find ${globPattern.replace('/**/*.html', '')} -name "*.html" -type f`, {
  encoding: 'utf-8',
  maxBuffer: 50 * 1024 * 1024,
}).trim().split('\n').filter(Boolean);

console.log(`Scanning ${files.length} HTML files...\n`);

const counts = new Map(); // icon name → count
const fileHits = new Map(); // icon name → Set<filePath>
let totalHits = 0;
let dynamicHits = 0;

for (const file of files) {
  let html;
  try {
    html = readFileSync(file, 'utf-8');
  }
  catch {
    continue;
  }

  let match;
  ICON_TAG_RE.lastIndex = 0;
  while ((match = ICON_TAG_RE.exec(html)) !== null) {
    totalHits++;
    const classStr = match[1];
    const name = extractIconName(classStr);

    if (!name) {
      dynamicHits++;
      continue;
    }

    counts.set(name, (counts.get(name) || 0) + 1);
    if (!fileHits.has(name)) { fileHits.set(name, new Set()); }
    fileHits.get(name).add(file);
  }
}

// Sort by count descending
const sorted = [...counts.entries()].sort((a, b) => b[1] - a[1]);

// -- Output ------------------------------------------------------------------

const lines = [];
lines.push(`# Icon Usage Report`);
lines.push(`# Corpus: ${globPattern}`);
lines.push(`# Files scanned: ${files.length}`);
lines.push(`# Total <i class="...icon"> hits: ${totalHits}`);
lines.push(`# Unique icon names: ${sorted.length}`);
lines.push(`# Dynamic (template-only, unresolvable): ${dynamicHits}`);
lines.push(`#`);
lines.push(`# count | files | icon name`);
lines.push(`# ------+-------+----------`);

for (const [name, count] of sorted) {
  const numFiles = fileHits.get(name).size;
  lines.push(`${String(count).padStart(7)} | ${String(numFiles).padStart(5)} | ${name}`);
}

const report = lines.join('\n') + '\n';

// Write to stdout and to file
process.stdout.write(report);

const outPath = resolve(import.meta.dirname, '../artifacts/icon-usage-report.txt');
writeFileSync(outPath, report);
console.log(`\nWritten to ${outPath}`);
