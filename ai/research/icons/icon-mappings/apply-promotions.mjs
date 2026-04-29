// Apply a promotion table to packages/specs/src/icons/mappings.js.
//
// Each promotion renames a canonical key (old -> new) and pushes the old name into the
// new entry's aliases array. Optional family_renames apply the same rename to related
// canonicals (e.g. message-circle-more -> chat-more when message-circle is promoted to chat).
//
// Promotion file format:
//   { "promotions": [{ "old": "house", "new": "home", "family_renames": { ... } }, ...] }
//
// Usage:
//   node apply-promotions.mjs [path/to/promotions.json]
// Defaults to pass5-promotions.json next to this script.

import { readFileSync, writeFileSync } from 'fs';
import { dirname, isAbsolute, join, resolve } from 'path';
import { fileURLToPath } from 'url';

const dir = dirname(fileURLToPath(import.meta.url));
const repoRoot = resolve(dir, '../../../..');
const mappingsPath = join(repoRoot, 'packages/specs/src/icons/mappings.js');

const arg = process.argv[2] || join(dir, 'pass5-promotions.json');
const promotionsPath = isAbsolute(arg) ? arg : resolve(process.cwd(), arg);

const { promotions } = JSON.parse(readFileSync(promotionsPath, 'utf8'));
let src = readFileSync(mappingsPath, 'utf8');

function escapeRegex(s) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyRename(source, oldName, newName) {
  let out = source.replace(`'${oldName}':`, `'${newName}':`);
  out = out.replace(`"${oldName}":`, `"${newName}":`);
  const re = new RegExp(`('${escapeRegex(newName)}': \\{[\\s\\S]*?aliases: \\[)`);
  return out.replace(re, (match) => {
    if (match.includes('aliases: []')) {
      return match.replace('aliases: []', `aliases: ['${oldName}']`);
    }
    return match.replace('aliases: [', `aliases: ['${oldName}', `);
  });
}

let count = 0;
for (const p of promotions) {
  src = applyRename(src, p.old, p.new);
  count++;
  for (const [oldMember, newMember] of Object.entries(p.family_renames || {})) {
    src = applyRename(src, oldMember, newMember);
    count++;
  }
}

writeFileSync(mappingsPath, src);

console.log(`Applied ${count} renames from ${promotionsPath}`);
console.log(`Total entries: ${(src.match(/aliases:/g) || []).length}`);
