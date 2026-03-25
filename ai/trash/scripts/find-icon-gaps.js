#!/usr/bin/env node

// Cross-references corpus icon usage against the new SUI canonical icon names
// using token-order-insensitive Levenshtein distance. Uses icon.overrides from
// the original SUI Classic install to distinguish standard icons from custom ones.
//
// Usage: node find-icon-gaps.js

import { readFileSync, writeFileSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO = resolve(__dirname, '../../..');

// -- Levenshtein -------------------------------------------------------------

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1));
  for (let i = 0; i <= m; i++) { dp[i][0] = i; }
  for (let j = 0; j <= n; j++) { dp[0][j] = j; }
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      dp[i][j] = a[i - 1] === b[j - 1]
        ? dp[i - 1][j - 1]
        : 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);
    }
  }
  return dp[m][n];
}

function similarity(a, b) {
  if (a === b) { return 1.0; }
  const dist = levenshtein(a, b);
  return 1.0 - dist / Math.max(a.length, b.length);
}

// Token-order-insensitive similarity using combinatorics:
// 1. Direct Levenshtein on hyphenated strings
// 2. All permutations of corpus tokens vs canonical tokens
// 3. Subset matching — do the canonical tokens appear inside the corpus tokens?
function tokenSimilarity(corpusNormed, canonicalNormed) {
  const direct = similarity(corpusNormed, canonicalNormed);

  const corpusTokens = corpusNormed.split('-');
  const canonicalTokens = canonicalNormed.split('-');

  // try all permutations of the shorter side (capped at 5 tokens to avoid explosion)
  let best = direct;
  if (corpusTokens.length <= 5 && canonicalTokens.length <= 5) {
    for (const perm of permutations(corpusTokens)) {
      const sim = similarity(perm.join('-'), canonicalNormed);
      if (sim > best) { best = sim; }
    }
    for (const perm of permutations(canonicalTokens)) {
      const sim = similarity(corpusNormed, perm.join('-'));
      if (sim > best) { best = sim; }
    }
  }

  // subset matching: if canonical is a single token, check if corpus contains it
  // or vice versa (catches checkmark containing check, etc.)
  if (canonicalTokens.length === 1) {
    for (const ct of corpusTokens) {
      if (ct.includes(canonicalNormed) || canonicalNormed.includes(ct)) {
        const sub = similarity(ct, canonicalNormed);
        // boost: the matching token has high sim, scale by how much of the corpus it covers
        const coverage = ct.length / corpusNormed.length;
        const boosted = sub * (0.5 + 0.5 * coverage);
        if (boosted > best) { best = boosted; }
      }
    }
  }
  if (corpusTokens.length === 1) {
    for (const ct of canonicalTokens) {
      if (ct.includes(corpusNormed) || corpusNormed.includes(ct)) {
        const sub = similarity(corpusNormed, ct);
        const coverage = ct.length / canonicalNormed.length;
        const boosted = sub * (0.5 + 0.5 * coverage);
        if (boosted > best) { best = boosted; }
      }
    }
  }

  return best;
}

function* permutations(arr) {
  if (arr.length <= 1) {
    yield arr;
    return;
  }
  for (let i = 0; i < arr.length; i++) {
    const rest = [...arr.slice(0, i), ...arr.slice(i + 1)];
    for (const perm of permutations(rest)) {
      yield [arr[i], ...perm];
    }
  }
}

// -- Load canonical names + aliases from mappings.js -------------------------

async function loadCanonicalNames() {
  const { iconMappings } = await import(
    resolve(REPO, 'packages/specs/src/icons/mappings.js')
  );

  // Map of normalized name → canonical name
  const names = new Map();

  for (const [canonical, meta] of Object.entries(iconMappings)) {
    names.set(canonical, canonical);
    if (meta.aliases) {
      for (const alias of meta.aliases) {
        names.set(alias, canonical);
      }
    }
    // per-library native names give us more surface area for fuzzy matching
    for (const lib of ['lucide', 'phosphor', 'tabler', 'materialSymbols', 'heroicons']) {
      if (meta[lib] && !names.has(meta[lib])) {
        names.set(meta[lib], canonical);
      }
    }
  }

  return names;
}

// -- Load SUI Classic icon names from icon.overrides -------------------------

function loadClassicIcons() {
  const overridesPath = resolve(
    process.env.HOME,
    'dev/qualia/services/access/app/npm-packages-local/@qualia/semantic/lib/site/elements/icon.overrides.import.less',
  );
  const raw = readFileSync(overridesPath, 'utf-8');
  const icons = new Set();
  // matches i.icon.chevron.right:before, i.icon.x:before, etc.
  const re = /i\.icon\.([a-z0-9.]+?)(?::before|[\s{])/g;
  let m;
  while ((m = re.exec(raw)) !== null) {
    // convert dots to spaces (SUI Classic convention) then to hyphens
    const name = m[1].replace(/\./g, '-');
    icons.add(name);
  }
  return icons;
}

// -- Load corpus report ------------------------------------------------------

function loadCorpusReport() {
  const raw = readFileSync(
    resolve(__dirname, '../artifacts/icon-usage-report.txt'),
    'utf-8',
  );
  const entries = [];
  for (const line of raw.split('\n')) {
    const match = line.match(/^\s*(\d+)\s*\|\s*(\d+)\s*\|\s*(.+)$/);
    if (!match) { continue; }
    entries.push({
      count: parseInt(match[1]),
      files: parseInt(match[2]),
      name: match[3].trim(),
    });
  }
  return entries;
}

// -- Normalize: spaces → hyphens, lowercase ----------------------------------

function normalize(name) {
  return name.toLowerCase().replace(/\s+/g, '-').trim();
}

// -- Find best match ---------------------------------------------------------

function findBestMatch(corpusName, canonicalNames) {
  const normed = normalize(corpusName);

  // exact match
  if (canonicalNames.has(normed)) {
    return { match: canonicalNames.get(normed), similarity: 1.0, exact: true };
  }

  let bestSim = 0;
  let bestMatch = null;
  for (const [name, canonical] of canonicalNames) {
    const sim = tokenSimilarity(normed, normalize(name));
    if (sim > bestSim) {
      bestSim = sim;
      bestMatch = canonical;
    }
  }

  return { match: bestMatch, similarity: bestSim, exact: false };
}

// -- Main --------------------------------------------------------------------

const canonicalNames = await loadCanonicalNames();
const classicIcons = loadClassicIcons();
const corpus = loadCorpusReport();

const results = corpus.map(entry => {
  const normed = normalize(entry.name);
  const isClassic = classicIcons.has(normed);
  return {
    ...entry,
    ...findBestMatch(entry.name, canonicalNames),
    isClassic,
  };
});

// Filter to standard icons only, sort by similarity ascending
const standard = results.filter(r => r.isClassic);
standard.sort((a, b) => a.similarity - b.similarity || b.count - a.count);

// -- Output CSV --------------------------------------------------------------

const csvLines = [];
csvLines.push('uses,files,similarity,corpus_icon,best_match');
for (const r of standard) {
  const sim = r.exact ? '1.00' : r.similarity.toFixed(2);
  csvLines.push(`${r.count},${r.files},${sim},${r.name},${r.match}`);
}

const csvPath = resolve(__dirname, '../artifacts/icon-gap-analysis.csv');
writeFileSync(csvPath, csvLines.join('\n') + '\n');
console.log(`CSV written to ${csvPath}`);
console.log(`${standard.length} standard SUI Classic icons (${results.length - standard.length} custom excluded)\n`);
console.log(csvLines.join('\n'));
