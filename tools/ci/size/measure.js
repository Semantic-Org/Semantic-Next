/*
  Compression sizing for built artifacts. brotli quality 11 and gzip level 9
  match what a CDN serves, so the brotli column is the real over-the-wire cost
  and the one the headline tracks. Sizes are exact bytes — a built file is
  deterministic, so any nonzero delta is a real change, not measurement noise.
*/
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const GZIP = { level: 9 };
const BROTLI = { params: { [zlib.constants.BROTLI_PARAM_QUALITY]: 11 } };

export function measureBuffer(buf) {
  return {
    raw: buf.length,
    gzip: zlib.gzipSync(buf, GZIP).length,
    brotli: zlib.brotliCompressSync(buf, BROTLI).length,
  };
}

export function measureTargets(repoRoot, targets) {
  const out = {};
  for (const t of targets) {
    const descriptor = { id: t.id, label: t.label, group: t.group, file: t.file, headline: !!t.headline };
    const abs = path.join(repoRoot, t.file);
    if (!fs.existsSync(abs)) {
      out[t.id] = { ...descriptor, exists: false };
      continue;
    }
    out[t.id] = { ...descriptor, exists: true, ...measureBuffer(fs.readFileSync(abs)) };
  }
  return out;
}
