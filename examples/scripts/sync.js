#!/usr/bin/env node
/*
  Sync curriculum examples from docs/src/examples/ into examples/<id>/.

  - Discovers each ID's source folder by walking docs/src/examples/.
  - Wipes the destination, copies files verbatim.
  - Rewrites `getText` imports to Vite-style `?raw` imports.
  - Wraps page.html in a standalone HTML document so the dev server can serve each.
  - Regenerates examples/index.html with links to every synced example.

  Usage:
    node scripts/sync.js                    # sync all CURRICULUM_IDS
    node scripts/sync.js todo-list clock    # sync just the named IDs
*/

import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = resolve(__dirname, '..');
const REPO_ROOT = resolve(EXAMPLES_DIR, '..');
const DOCS_EXAMPLES = resolve(REPO_ROOT, 'docs/src/examples');
const DOCS_METADATA = resolve(REPO_ROOT, 'docs/src/content/examples');

// The example-curriculum.md ranking, in order.
/*
  Docs assets (avatars under /images/, etc.) aren't served by the examples
  dev server. Rewrite root-relative paths to absolute URLs that point at the
  published docs site. Change DOCS_ORIGIN if docs ever move to a new host.
*/
const DOCS_ORIGIN = 'https://next.semantic-ui.com';

const CURRICULUM_IDS = [
  'minimal',
  'emoji-reactions',
  'todo-list',
  'async-search',
  'context-menu',
  'card-search',
  'tailwind',
  'dynamic-table',
  'external-calls',
  'maximal',
  'component-specs',
  'advanced-keybinding',
  'rating-slider',
  'advanced-ball-simulation',
  'event-data',
  'dropdown',
  'setting-types',
  'progress-bar',
  'clock',
];

/*
  Inline pre-paint script that reads the stored theme and applies `dark` or
  `light` to <html> before any module script runs. Matches the localStorage
  key used by src/components/theme-switcher (`theme`).
*/
const THEME_BOOTSTRAP = `    <script>
      (function () {
        var t = null;
        try { t = localStorage.getItem('theme'); } catch (e) {}
        if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        var html = document.documentElement;
        html.classList.add(t);
        html.setAttribute('data-theme', t);
      })();
    </script>`;

/*
  Shared layout for every generated page. The example fragment is wrapped in
  `.example container` so position:absolute children resolve to the container
  (via position: relative) and position:fixed children resolve to it too (the
  `transform` declaration creates a new containing block). The theme-switcher
  lives outside the container so it stays anchored to the viewport.
*/
const PAGE_LAYOUT = `      html { scrollbar-gutter: stable; }
      body { font-family: var(--page-font, system-ui, sans-serif); max-width: 720px; margin: 2rem auto; padding: 0 1rem; }
      .example.container { position: relative; transform: translateZ(0); }
      .example.theme { position: fixed; top: 1rem; right: 1rem; z-index: 1000; }
      .example.header { margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--standard-15, #e5e5e5); }
      .example.header .back { display: inline-block; font-size: 0.8em; color: var(--standard-50, #888); text-decoration: none; letter-spacing: 0.02em; }
      .example.header .back:hover { color: var(--primary-color, #2185d0); }
      .example.header .title { margin: 0.4rem 0 0.2rem; font-size: 1.25rem; font-weight: 600; }
      .example.header .description { margin: 0; color: var(--standard-60, #666); font-size: 0.9em; line-height: 1.5; }`;

/* Convert kebab-case tag → PascalCase, preserving `ui` as `UI`. */
function kebabToPascal(kebab) {
  return kebab
    .split('-')
    .map((part) => (part === 'ui' ? 'UI' : part[0].toUpperCase() + part.slice(1)))
    .join('');
}

/* Walk a directory tree, return absolute paths matching `predicate(name, isDir)`. */
async function walk(dir, predicate, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const full = join(dir, entry.name);
    if (predicate(entry.name, entry.isDirectory())) { results.push(full); }
    if (entry.isDirectory()) { await walk(full, predicate, results); }
  }
  return results;
}

/* Locate the source folder for a curriculum ID. Exactly one match expected. */
async function findSourceFolder(id) {
  const matches = await walk(DOCS_EXAMPLES, (name, isDir) => isDir && name === id);
  if (matches.length === 0) { throw new Error(`No docs source for "${id}" under ${DOCS_EXAMPLES}`); }
  if (matches.length > 1) { throw new Error(`Multiple docs sources for "${id}": ${matches.join(', ')}`); }
  return matches[0];
}

/* Parse the YAML-ish frontmatter from a docs metadata .mdx file. Returns {} if missing. */
async function readMetadata(id) {
  const path = join(DOCS_METADATA, `${id}.mdx`);
  if (!existsSync(path)) { return {}; }
  const raw = await readFile(path, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---/);
  if (!match) { return {}; }
  const out = {};
  for (const line of match[1].split('\n')) {
    const m = line.match(/^([a-zA-Z]+):\s*(.+)$/);
    if (!m) { continue; }
    let value = m[2].trim();
    // Strip surrounding quotes (single or double).
    if ((value.startsWith("'") && value.endsWith("'")) || (value.startsWith('"') && value.endsWith('"'))) {
      value = value.slice(1, -1);
    }
    out[m[1]] = value;
  }
  return out;
}

/* Recursively copy a directory's contents (one level deep covers every example). */
async function copyDir(src, dest) {
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const from = join(src, entry.name);
    const to = join(dest, entry.name);
    if (entry.isDirectory()) { await copyDir(from, to); }
    else { await copyFile(from, to); }
  }
}

/*
  Transform getText-style imports to ?raw imports.

  - Strip `getText` from `@semantic-ui/component` named imports.
  - `const X = await getText('./path')` → `import X from './path?raw'` (hoisted).
  - `key: await getText('./path')` → `key,` with `import key from './path?raw'` hoisted.

  The hoist appends new imports after the last existing top-level import so files
  stay readable when re-run.
*/
function transformJS(src) {
  let out = src;
  const hoisted = [];

  // 1. Remove `getText` from the @semantic-ui/component named import list.
  out = out.replace(
    /import\s*\{([^}]*)\}\s*from\s*(['"])@semantic-ui\/component\2/g,
    (full, names, quote) => {
      const cleaned = names
        .split(',')
        .map((n) => n.trim())
        .filter((n) => n && n !== 'getText')
        .join(', ');
      return `import { ${cleaned} } from ${quote}@semantic-ui/component${quote}`;
    },
  );

  // 2. `const X = await getText('./path');`  →  hoisted `import X from './path?raw';`
  out = out.replace(
    /^const\s+(\w+)\s*=\s*await\s+getText\((['"])(\.[^'"]+)\2\);?\s*\n/gm,
    (_, name, _q, path) => {
      hoisted.push(`import ${name} from '${path}?raw';`);
      return '';
    },
  );

  // 3. Inline `key: await getText('./path'),` inside object literals.
  //    Becomes `key,` plus a hoisted `import key from './path?raw';`.
  out = out.replace(
    /(\b\w+)\s*:\s*await\s+getText\((['"])(\.[^'"]+)\2\)(,?)/g,
    (_, name, _q, path, comma) => {
      hoisted.push(`import ${name} from '${path}?raw';`);
      return `${name}${comma}`;
    },
  );

  if (hoisted.length === 0) { return out; }

  // Insert hoisted imports after the last existing top-level import statement.
  const importLine = /^import\s.+;\s*$/gm;
  let lastEnd = 0;
  let match;
  while ((match = importLine.exec(out)) !== null) { lastEnd = match.index + match[0].length; }
  const block = '\n' + hoisted.join('\n');
  return lastEnd > 0 ? out.slice(0, lastEnd) + block + out.slice(lastEnd) : block.trimStart() + '\n\n' + out;
}

/*
  Ensure each example's `defineComponent({...})` call is exported as a
  named const. Bare side-effect calls are wrapped; already-exported
  forms are left alone. Returns the exported name (or null if none).
*/
function ensureExport(src, pascalName) {
  // Already exported — `export const X = defineComponent(...)` or `export default ...`
  const existing = src.match(/export\s+(?:default\s+)?(?:const\s+(\w+)\s*=\s*)?defineComponent\(/);
  if (existing) { return existing[1] || pascalName; }

  // Assigned but not exported — `const X = defineComponent(...)`. Add export keyword.
  if (/^const\s+\w+\s*=\s*defineComponent\(/m.test(src)) {
    return [src.replace(/^(const\s+\w+\s*=\s*defineComponent\()/m, 'export $1'), src.match(/^const\s+(\w+)/m)[1]];
  }

  // Bare side-effect call at top level — wrap with export const.
  const bare = /^defineComponent\(/m;
  if (bare.test(src)) {
    return [src.replace(bare, `export const ${pascalName} = defineComponent(`), pascalName];
  }

  return null;
}

/*
  Rewrite root-relative docs asset paths (e.g. "/images/avatar/jenny.jpg")
  to absolute URLs on DOCS_ORIGIN. Matches both quote styles so it catches
  HTML attributes and JS string literals.
*/
function prefixDocsAssets(src) {
  return src.replace(/(['"])\/images\//g, `$1${DOCS_ORIGIN}/images/`);
}

/* Minimal HTML escape for text injected from .mdx frontmatter. */
function escapeHTML(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  }[c]));
}

/* Wrap a docs-style page.html fragment in a complete HTML document. */
function wrapPageHTML({ id, title, description, fragment, hasPageCSS, hasPageJS }) {
  // blocking="render" defers paint until each module is parsed + executed,
  // so custom elements are upgraded before the first frame (no FOUC flash).
  const scripts = [
    `    <script type="module" blocking="render" src="/dist/sui.js"></script>`,
    `    <script type="module" blocking="render" src="/dist/${id}/component.js"></script>`,
  ];
  if (hasPageJS) { scripts.push(`    <script type="module" blocking="render" src="/dist/${id}/page.js"></script>`); }

  const links = [`    <link rel="stylesheet" href="/dist/sui.css" />`];
  if (hasPageCSS) { links.push(`    <link rel="stylesheet" href="./page.css" />`); }

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${title} — ${id}</title>
${THEME_BOOTSTRAP}
${links.join('\n')}
${scripts.join('\n')}
    <style>
${PAGE_LAYOUT}
    </style>
  </head>
  <body>
    <theme-switcher class="example theme"></theme-switcher>
    <header class="example header">
      <a class="back" href="/">← Examples</a>
      <h1 class="title">${escapeHTML(title)}</h1>${
    description
      ? `
      <p class="description">${escapeHTML(description)}</p>`
      : ''
  }
    </header>
    <div class="example container">
${fragment.trimEnd().replace(/^/gm, '      ')}
    </div>
  </body>
</html>
`;
}

async function syncOne(id) {
  const source = await findSourceFolder(id);
  const dest = join(EXAMPLES_DIR, id);
  const meta = await readMetadata(id);
  const title = meta.title || id;
  const description = meta.description || '';

  // Idempotency: wipe and recreate.
  await rm(dest, { recursive: true, force: true });
  await copyDir(source, dest);

  // Transform every .js file in the example folder.
  const jsFiles = (await readdir(dest)).filter((f) => f.endsWith('.js'));
  for (const file of jsFiles) {
    const path = join(dest, file);
    const original = await readFile(path, 'utf8');
    const transformed = prefixDocsAssets(transformJS(original));
    if (transformed !== original) { await writeFile(path, transformed); }
  }

  // Ensure component.js exports a named const for the registered element,
  // and capture the tag name so we can fall back to <tag></tag> if no
  // page.html fragment was provided.
  let exportName = null;
  let tagName = null;
  const componentJS = join(dest, 'component.js');
  if (existsSync(componentJS)) {
    const src = await readFile(componentJS, 'utf8');
    const tagMatch = src.match(/tagName:\s*['"]([\w-]+)['"]/);
    if (tagMatch) {
      tagName = tagMatch[1];
      const pascal = kebabToPascal(tagName);
      const result = ensureExport(src, pascal);
      if (Array.isArray(result)) {
        await writeFile(componentJS, result[0]);
        exportName = result[1];
      }
      else if (typeof result === 'string') {
        exportName = result;
      }
    }
  }

  // Wrap page.html. When the docs source omits one, generate the same
  // <tag-name></tag-name> fallback the playground would render.
  const pageHTML = join(dest, 'page.html');
  const fragment = existsSync(pageHTML)
    ? prefixDocsAssets(await readFile(pageHTML, 'utf8'))
    : tagName
    ? `<${tagName}></${tagName}>\n`
    : null;
  if (fragment !== null) {
    const wrapped = wrapPageHTML({
      id,
      title,
      description,
      fragment,
      hasPageCSS: existsSync(join(dest, 'page.css')),
      hasPageJS: existsSync(join(dest, 'page.js')),
    });
    await writeFile(pageHTML, wrapped);
  }

  return { id, title, exportName, source: relative(REPO_ROOT, source) };
}

/* Generate the top-level barrel re-exporting every synced component. */
async function writeBarrel(synced) {
  const lines = synced
    .filter((s) => s.exportName)
    .map((s) => `export { ${s.exportName} } from './${s.id}/component.js';`);
  const content = `/* Generated by scripts/sync.js. Do not edit by hand. */\n${lines.join('\n')}\n`;
  await writeFile(join(EXAMPLES_DIR, 'index.js'), content);
}

async function writeIndex(synced) {
  const items = synced
    .map(({ id, title }) => `      <li><a href="./${id}/page.html">${title}</a> <code>${id}</code></li>`)
    .join('\n');
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Semantic UI Examples</title>
${THEME_BOOTSTRAP}
    <link rel="stylesheet" href="/dist/sui.css" />
    <script type="module" blocking="render" src="/dist/sui.js"></script>
    <style>
${PAGE_LAYOUT}
      h1 { margin-bottom: 0.25rem; }
      p.lede { color: var(--standard-60, #666); margin-top: 0; }
      ul { list-style: none; padding: 0; }
      li { padding: 0.5rem 0; border-bottom: 1px solid var(--standard-10, #eee); }
      li a { font-weight: 600; text-decoration: none; color: var(--primary-color, #2185d0); }
      li a:hover { text-decoration: underline; }
      code { color: var(--standard-50, #888); font-size: 0.85em; margin-left: 0.5rem; }
    </style>
  </head>
  <body>
    <theme-switcher class="example theme"></theme-switcher>
    <h1>Semantic UI Examples</h1>
    <p class="lede">Canonical curriculum examples mirroring <code>docs/src/examples/</code>. Run <code>npm run dev</code> in <code>examples/</code> to start the esbuild server.</p>
    <ul>
${items}
    </ul>
  </body>
</html>
`;
  await writeFile(join(EXAMPLES_DIR, 'index.html'), html);
}

async function main() {
  const ids = process.argv.slice(2);
  const targets = ids.length > 0 ? ids : CURRICULUM_IDS;
  const synced = [];
  for (const id of targets) {
    try {
      const result = await syncOne(id);
      synced.push(result);
      console.log(`✓ ${id.padEnd(28)}  ← ${result.source}`);
    }
    catch (err) {
      console.error(`✗ ${id}: ${err.message}`);
      process.exitCode = 1;
    }
  }
  if (ids.length === 0) {
    await writeIndex(synced);
    await writeBarrel(synced);
  }
}

main();
