import { copyFileSync, existsSync, mkdirSync, readFileSync } from 'fs';
import { dirname, join, resolve } from 'path';
import { fileURLToPath } from 'url';
const scriptsDir = dirname(fileURLToPath(import.meta.url));
const specsDir = join(scriptsDir, '..');
const setsDir = join(specsDir, '../../src/primitives/icon/sets');

// Resolve package paths (handles monorepo hoisting and strict exports)
function pkgDir(name) {
  const candidates = [
    join(specsDir, 'node_modules', name),
    join(specsDir, '../../node_modules', name),
  ];
  for (const dir of candidates) {
    if (existsSync(join(dir, 'package.json'))) { return dir; }
  }
  return null;
}

const libraries = {
  lucide: {
    dir: 'lucide',
    pkg: 'lucide-static',
    svgPath: (name) => `icons/${name}.svg`,
  },
  phosphor: {
    dir: 'phosphor',
    pkg: '@phosphor-icons/core',
    svgPath: (name) => `assets/regular/${name}.svg`,
  },
  tabler: {
    dir: 'tabler',
    pkg: '@tabler/icons',
    svgPath: (name) => `icons/outline/${name}.svg`,
  },
  materialSymbols: {
    dir: 'material-symbols',
    pkg: '@material-symbols/svg-400',
    svgPath: (name) => `outlined/${name}.svg`,
  },
  heroicons: {
    dir: 'heroicons',
    pkg: 'heroicons',
    svgPath: (name) => `24/outline/${name}.svg`,
  },
};

// Extract native icon names from the generated CSS files
function getNativeNames(cssPath) {
  const css = readFileSync(cssPath, 'utf8');
  const names = [];
  const re = /url\('\.\/svg\/([^']+)\.svg'\)/g;
  let match;
  while ((match = re.exec(css)) !== null) {
    names.push(match[1]);
  }
  return names;
}

let totalCopied = 0;
let totalMissing = 0;

for (const [libKey, lib] of Object.entries(libraries)) {
  const cssPath = join(setsDir, lib.dir, `${lib.dir}.css`);
  if (!existsSync(cssPath)) {
    console.warn(`SKIP ${lib.dir}: no CSS file found (run generate:icons first)`);
    continue;
  }

  const svgDir = join(setsDir, lib.dir, 'svg');
  mkdirSync(svgDir, { recursive: true });

  const pkg = pkgDir(lib.pkg);
  if (!pkg) {
    console.warn(`SKIP ${lib.dir}: package '${lib.pkg}' not installed`);
    continue;
  }

  const names = getNativeNames(cssPath);
  let copied = 0;
  let missing = 0;

  for (const name of names) {
    const srcPath = join(pkg, lib.svgPath(name));
    const destPath = join(svgDir, `${name}.svg`);

    if (existsSync(srcPath)) {
      copyFileSync(srcPath, destPath);
      copied++;
    }
    else {
      console.warn(`  MISSING: ${lib.dir}/${name}.svg (expected at ${lib.svgPath(name)})`);
      missing++;
    }
  }

  totalCopied += copied;
  totalMissing += missing;
  console.log(`${lib.dir}: ${copied} copied, ${missing} missing (of ${names.length} needed)`);
}

console.log(`\nTotal: ${totalCopied} copied, ${totalMissing} missing`);
