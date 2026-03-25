import { writeFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const API = 'https://data.jsdelivr.com/v1';
const PERIOD = 'year';
const TOP_VERSIONS = 10;
const OUT_DIR = join(dirname(fileURLToPath(import.meta.url)), '../../../ai/workspace/memory');

async function fetchJSON(url) {
  const res = await fetch(url, {
    headers: { 'User-Agent': 'semantic-ui/icon-popularity-analysis' },
  });
  if (!res.ok) { throw new Error(`${res.status} ${url}`); }
  return { data: await res.json(), headers: res.headers };
}

// Get top versions by traffic
async function getTopVersions(pkg, count) {
  const { data } = await fetchJSON(
    `${API}/stats/packages/npm/${pkg}/versions?period=${PERIOD}&limit=${count}`,
  );
  return data.map(v => ({ version: v.version, hits: v.hits.total }));
}

// Get all file stats for a version (paginated)
async function getFileStats(pkg, version) {
  const files = {};
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const url = `${API}/stats/packages/npm/${pkg}@${version}/files?period=${PERIOD}&limit=100&page=${page}`;
    const { data, headers } = await fetchJSON(url);

    totalPages = parseInt(headers.get('x-total-pages') || '1', 10);

    for (const f of data) {
      const match = f.name.match(/^\/icons\/(.+)\.svg$/);
      if (!match) { continue; }
      const name = match[1];
      files[name] = (files[name] || 0) + f.hits.total;
    }

    page++;
  }
  return files;
}

async function main() {
  console.log('Fetching top lucide-static versions...');
  const versions = await getTopVersions('lucide-static', TOP_VERSIONS);

  for (const v of versions) {
    console.log(`  ${v.version}: ${v.hits.toLocaleString()} hits`);
  }

  // Aggregate file stats across versions
  const totals = {};
  for (const v of versions) {
    console.log(`Fetching file stats for v${v.version}...`);
    const files = await getFileStats('lucide-static', v.version);
    for (const [name, hits] of Object.entries(files)) {
      totals[name] = (totals[name] || 0) + hits;
    }
  }

  // Sort by hits descending
  const sorted = Object.entries(totals)
    .sort((a, b) => b[1] - a[1]);

  // Write CSV
  const csv = ['icon,hits', ...sorted.map(([name, hits]) => `${name},${hits}`)].join('\n') + '\n';
  const outPath = join(OUT_DIR, 'lucide-icon-popularity.csv');
  writeFileSync(outPath, csv);

  console.log(`\nWrote ${sorted.length} icons to ${outPath}`);
  console.log('\nTop 30:');
  sorted.slice(0, 30).forEach(([name, hits], i) =>
    console.log(`  ${String(i + 1).padStart(2)}. ${name.padEnd(25)} ${hits.toLocaleString()}`)
  );
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
