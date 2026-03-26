import { readFileSync, writeFileSync } from 'fs';

const promotions = JSON.parse(readFileSync('ai/research/icons/icon-mappings/pass5-promotions.json', 'utf8')).promotions;
let src = readFileSync('packages/specs/src/icons/mappings.js', 'utf8');

for (const p of promotions) {
  // Rename the key (handle both single and double quotes)
  src = src.replace(`'${p.old}':`, `'${p.new}':`);
  src = src.replace(`"${p.old}":`, `"${p.new}":`);

  // Add old name as alias
  const escaped = p.new.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const re = new RegExp(`('${escaped}': \\{[\\s\\S]*?aliases: \\[)`);
  src = src.replace(re, (match) => {
    if (match.includes('aliases: []')) {
      return match.replace('aliases: []', `aliases: ['${p.old}']`);
    }
    return match.replace('aliases: [', `aliases: ['${p.old}', `);
  });

  // Apply family renames
  for (const [oldMember, newMember] of Object.entries(p.family_renames || {})) {
    src = src.replace(`'${oldMember}':`, `'${newMember}':`);
    src = src.replace(`"${oldMember}":`, `"${newMember}":`);
    const mEscaped = newMember.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const mRe = new RegExp(`('${mEscaped}': \\{[\\s\\S]*?aliases: \\[)`);
    src = src.replace(mRe, (match) => {
      if (match.includes('aliases: []')) {
        return match.replace('aliases: []', `aliases: ['${oldMember}']`);
      }
      return match.replace('aliases: [', `aliases: ['${oldMember}', `);
    });
  }
}

writeFileSync('packages/specs/src/icons/mappings.js', src);
console.log(`Applied ${promotions.length} promotions`);

const count = (src.match(/aliases:/g) || []).length;
console.log(`Total entries: ${count}`);
