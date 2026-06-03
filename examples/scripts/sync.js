#!/usr/bin/env node
/*
  Sync curriculum examples from docs/src/examples/ into examples/<id>/.

  - Discovers each ID's source folder by walking docs/src/examples/.
  - Wipes the destination, copies files verbatim.
  - Rewrites `getText` imports to Vite-style `?raw` imports.
  - Wraps page.html in a standalone HTML document so the dev server can serve each.
  - Regenerates examples/index.html with links to every synced example.

  Usage:
    node scripts/sync.js                    # sync all CURRICULUM_IDS once
    node scripts/sync.js todo-list clock    # sync just the named IDs
    node scripts/sync.js --watch            # initial sync + watch docs/src/examples for changes
*/

import { existsSync, watch as fsWatch } from 'node:fs';
import { copyFile, mkdir, readdir, readFile, rm, stat, writeFile } from 'node:fs/promises';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import hljs from 'highlight.js/lib/core';
import hljsCSS from 'highlight.js/lib/languages/css';
import hljsJS from 'highlight.js/lib/languages/javascript';
import hljsJSON from 'highlight.js/lib/languages/json';
import hljsXML from 'highlight.js/lib/languages/xml';

import { CORE_COUNT, CURRICULUM } from '../curriculum.js';

hljs.registerLanguage('javascript', hljsJS);
hljs.registerLanguage('xml', hljsXML);
hljs.registerLanguage('html', hljsXML);
hljs.registerLanguage('css', hljsCSS);
hljs.registerLanguage('json', hljsJSON);

const __dirname = dirname(fileURLToPath(import.meta.url));
const EXAMPLES_DIR = resolve(__dirname, '..');
const SRC_DIR = resolve(EXAMPLES_DIR, 'src');
const REPO_ROOT = resolve(EXAMPLES_DIR, '..');
const DOCS_EXAMPLES = resolve(REPO_ROOT, 'docs/src/examples');
const DOCS_METADATA = resolve(REPO_ROOT, 'docs/src/content/examples');
const DOCS_FAVICON = resolve(REPO_ROOT, 'docs/public/favicon.ico');

/*
  Docs assets (avatars under /images/, etc.) aren't served by the examples
  dev server. Rewrite root-relative paths to absolute URLs that point at the
  published docs site. Change DOCS_ORIGIN if docs ever move to a new host.
*/
const DOCS_ORIGIN = 'https://next.semantic-ui.com';

/* Curriculum order drives sync iteration, prev/next nav, and landing-page sectioning. */
const CURRICULUM_IDS = CURRICULUM.map((e) => e.id);

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
  Shared stylesheet for every generated page. Loaded from scripts/page.css
  at sync time and inlined into each output. The HTML wraps each page's
  body in `<div class="example">`, so all selectors descend from `.example`
  and individual elements keep plain class names (`.header`, `.container`,
  `.notes`, `.theme`, `.lede`, …).
*/
const PAGE_STYLES = await readFile(resolve(__dirname, 'page.css'), 'utf8');

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

/* Inline-markdown rendering for curriculum prose: `code` and **bold**. Escape first so spans render safely. */
function renderInline(text) {
  return escapeHTML(text)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

/* Map a filename to a highlight.js language identifier. */
function languageFor(filename) {
  if (filename.endsWith('.js')) { return 'javascript'; }
  if (filename.endsWith('.html')) { return 'html'; }
  if (filename.endsWith('.css')) { return 'css'; }
  if (filename.endsWith('.json')) { return 'json'; }
  return null;
}

/*
  Pick the source files to expose in the per-example code viewer.
  Excludes the generated wrapper page.html and the page-only page.css.
  Order: component.js → component.html → component.css → other subfiles
  alphabetically → page.js last (since it's usage, not the component itself).
*/
async function collectSourceFiles(dest) {
  const entries = await readdir(dest);
  // Skip the synced page.html (it's the generated wrapper); the upstream
  // usage fragment is injected separately by renderSourceViewer.
  const excluded = new Set(['page.html']);
  const allowed = entries
    .filter((name) => !excluded.has(name) && languageFor(name) !== null);

  const order = (name) => {
    if (name === 'component.js') { return 0; }
    if (name === 'component.html') { return 1; }
    if (name === 'component.css') { return 2; }
    if (name === 'page.css') { return 95; }
    if (name === 'page.js') { return 100; }
    return 50;
  };
  return allowed.sort((a, b) => order(a) - order(b) || a.localeCompare(b));
}

/*
  Render the collapsible "View code" viewer with tabbed source files. Files
  on disk are read from `dest`; the upstream page.html usage fragment is
  passed in as `pageFragment` and injected as a virtual entry before any
  page.css / page.js files.
*/
async function renderSourceViewer(dest, id, pageFragment) {
  const diskFiles = await collectSourceFiles(dest);
  const files = [...diskFiles];
  if (pageFragment) {
    const pageIdx = files.findIndex((f) => f === 'page.css' || f === 'page.js');
    files.splice(pageIdx === -1 ? files.length : pageIdx, 0, 'page.html');
  }
  if (files.length === 0) { return ''; }

  const fileButtons = files.map((file, i) =>
    `          <li><button type="button" data-target="src-${id}-${i}"${i === 0 ? ' class="active"' : ''}>${
      escapeHTML(file)
    }</button></li>`
  ).join('\n');

  const panels = [];
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    const content = file === 'page.html' && pageFragment
      ? pageFragment
      : await readFile(join(dest, file), 'utf8');
    const lang = languageFor(file);
    const html = lang ? hljs.highlight(content, { language: lang }).value : escapeHTML(content);
    panels.push(
      `        <pre id="src-${id}-${i}"${
        i === 0 ? '' : ' hidden'
      }><code class="hljs language-${lang}">${html}</code></pre>`,
    );
  }

  return `
      <details class="source" open>
        <summary><ui-icon icon="chevron-right" class="caret"></ui-icon><span class="show">View code</span><span class="hide">Hide code</span></summary>
        <ul class="files">
${fileButtons}
        </ul>
${panels.join('\n')}
      </details>`;
}

/* Render the curriculum's lesson notes panel + prev/next walk for one example. */
function renderLessonNotes(entry, prev, next) {
  if (!entry) { return ''; }
  const bullets = entry.whatToNotice.map((b) => `          <li>${renderInline(b)}</li>`).join('\n');
  const prevLink = prev ? `<a href="../${prev.id}/page.html">← ${escapeHTML(prev.headline)}</a>` : '<span></span>';
  const nextLink = next ? `<a href="../${next.id}/page.html">${escapeHTML(next.headline)} →</a>` : '<span></span>';
  return `
      <aside class="notes">
        <h2>New patterns</h2>
        <p>${renderInline(entry.newPatterns)}</p>
        <h2>What to notice</h2>
        <ul>
${bullets}
        </ul>
        <nav class="walk">
          ${prevLink}
          ${nextLink}
        </nav>
      </aside>`;
}

/*
  Tiny client script that hooks up <details class="source"> tab switching.
  Embedded once per page (cheap, ~300 bytes minified inline).
*/
const SOURCE_SCRIPT = `    <script>
      document.querySelectorAll('details.source').forEach(function (root) {
        root.addEventListener('click', function (e) {
          var btn = e.target.closest('button[data-target]');
          if (!btn) return;
          root.querySelectorAll('button[data-target]').forEach(function (b) { b.classList.toggle('active', b === btn); });
          root.querySelectorAll('pre[id^="src-"]').forEach(function (p) { p.toggleAttribute('hidden', p.id !== btn.dataset.target); });
        });
      });
    </script>`;

/* Wrap a docs-style page.html fragment in a complete HTML document. */
function wrapPageHTML(
  { id, title, description, fragment, hasPageCSS, hasPageJS, entry, position, prev, next, sourceViewer },
) {
  // blocking="render" defers paint until each module is parsed + executed,
  // so custom elements are upgraded before the first frame (no FOUC flash).
  const scripts = [
    `    <script type="module" blocking="render" src="/dist/sui.js"></script>`,
    `    <script type="module" blocking="render" src="/dist/src/${id}/component.js"></script>`,
  ];
  if (hasPageJS) {
    scripts.push(
      `    <script type="module" blocking="render" src="/dist/src/${id}/page.js"></script>`,
    );
  }

  const links = [`    <link rel="stylesheet" href="/dist/sui.css" />`];
  if (hasPageCSS) { links.push(`    <link rel="stylesheet" href="./page.css" />`); }

  const headline = entry ? entry.headline : title;
  const intro = entry ? entry.intro : description;
  const total = CURRICULUM.length;

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHTML(title)} — ${id}</title>
    <link rel="icon" href="/favicon.ico" />
${THEME_BOOTSTRAP}
${links.join('\n')}
${scripts.join('\n')}
    <style>
${PAGE_STYLES}
    </style>
  </head>
  <body>
    <div class="example">
      <theme-switcher class="theme"></theme-switcher>
      <header class="header">
        <nav class="crumbs">
          <a class="back" href="/">← Examples</a>
          <span class="position">${position} / ${total}</span>
          ${prev ? `<a href="../${prev.id}/page.html">prev</a>` : '<span></span>'}
          ${next ? `<a href="../${next.id}/page.html">next</a>` : '<span></span>'}
        </nav>
        <h1 class="title">${escapeHTML(headline)}</h1>
        <p class="description">${renderInline(intro)}</p>
      </header>
      <div class="container">
${fragment.trimEnd().replace(/^/gm, '        ')}
      </div>${sourceViewer}${renderLessonNotes(entry, prev, next)}
    </div>
${SOURCE_SCRIPT}
  </body>
</html>
`;
}

async function syncOne(id, curriculumIndex) {
  const source = await findSourceFolder(id);
  const dest = join(SRC_DIR, id);
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
    const entry = CURRICULUM[curriculumIndex] ?? null;
    const prev = curriculumIndex > 0 ? CURRICULUM[curriculumIndex - 1] : null;
    const next = curriculumIndex >= 0 && curriculumIndex < CURRICULUM.length - 1
      ? CURRICULUM[curriculumIndex + 1]
      : null;
    const sourceViewer = await renderSourceViewer(dest, id, fragment);
    const wrapped = wrapPageHTML({
      id,
      title,
      description,
      fragment,
      hasPageCSS: existsSync(join(dest, 'page.css')),
      hasPageJS: existsSync(join(dest, 'page.js')),
      entry,
      position: curriculumIndex >= 0 ? curriculumIndex + 1 : 0,
      prev,
      next,
      sourceViewer,
    });
    await writeFile(pageHTML, wrapped);
  }

  return { id, title, exportName, source: relative(REPO_ROOT, source) };
}

/* Generate the top-level barrel re-exporting every synced component. */
async function writeBarrel(synced) {
  // stable id order so the barrel doesn't churn between syncs
  const lines = synced
    .filter((s) => s.exportName)
    .sort((a, b) => a.id.localeCompare(b.id))
    .map((s) => `export { ${s.exportName} } from './src/${s.id}/component.js';`);
  const content = `/* Generated by scripts/sync.js. Do not edit by hand. */\n${lines.join('\n')}\n`;
  await writeFile(join(EXAMPLES_DIR, 'index.js'), content);
}

async function writeIndex(synced) {
  // synced is in CURRICULUM_IDS (curriculum) order. Pair each with its entry,
  // then group into the introductory walkthrough (1..CORE_COUNT) and the
  // standalone pattern examples (rest).
  const byId = new Map(synced.map((s) => [s.id, s]));
  const enriched = CURRICULUM
    .map((entry, i) => ({ entry, position: i + 1, sync: byId.get(entry.id) }))
    .filter((row) => row.sync);

  const renderItem = ({ entry, position, sync }) =>
    `        <li>
          <a class="entry" href="./src/${entry.id}/page.html">
            <span class="position">${position}</span>
            <span class="headline">${escapeHTML(entry.headline)}</span>
            <span class="subtitle">${escapeHTML(sync.title)}</span>
          </a>
          <p class="intro">${renderInline(entry.intro)}</p>
        </li>`;

  const core = enriched.filter((r) => r.position <= CORE_COUNT).map(renderItem).join('\n');
  const rest = enriched.filter((r) => r.position > CORE_COUNT).map(renderItem).join('\n');

  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>Semantic UI Examples</title>
    <link rel="icon" href="/favicon.ico" />
${THEME_BOOTSTRAP}
    <link rel="stylesheet" href="/dist/sui.css" />
    <script type="module" blocking="render" src="/dist/sui.js"></script>
    <style>
${PAGE_STYLES}
    </style>
  </head>
  <body>
    <div class="example">
      <theme-switcher class="theme"></theme-switcher>
      <h1>Semantic UI Examples</h1>
      <p class="lede">A tour of the framework, from the smallest possible component to deeper patterns. The first ${CORE_COUNT} introduce the core concepts in order; the rest cover specific features and can be read standalone.</p>
      <h2 class="section">Start here</h2>
      <p class="section-lede">Each example builds on the previous one. Read in order.</p>
      <ul class="entries">
${core}
      </ul>
      <h2 class="section">More patterns</h2>
      <p class="section-lede">Standalone examples covering specific features.</p>
      <ul class="entries">
${rest}
      </ul>
      <footer class="footer">
        <a href="https://next.semantic-ui.com/">Docs</a>
        <span class="sep">·</span>
        <a href="https://github.com/Semantic-Org/Semantic-Next">GitHub</a>
      </footer>
    </div>
  </body>
</html>
`;
  await writeFile(join(EXAMPLES_DIR, 'index.html'), html);
}

/* Sync a list of IDs once. When `regenerateIndex` is true, refresh favicon + landing + barrel. */
async function syncIds(ids, { regenerateIndex }) {
  const synced = [];
  for (const id of ids) {
    try {
      const curriculumIndex = CURRICULUM_IDS.indexOf(id);
      const result = await syncOne(id, curriculumIndex);
      synced.push(result);
      console.log(`✓ ${id.padEnd(28)}  ← ${result.source}`);
    }
    catch (err) {
      console.error(`✗ ${id}: ${err.message}`);
      process.exitCode = 1;
    }
  }
  if (regenerateIndex) {
    // Prune any src/ folders that no longer correspond to a curriculum entry
    // (e.g. an example was removed from CURRICULUM in curriculum.js).
    await removeOrphans();
    // The landing + barrel describe every synced example, not just the ones
    // refreshed in this run. Reconstruct the full list from disk so partial
    // syncs (watch mode, single-id invocations) don't truncate them.
    const fullList = await fullSyncedList();
    await copyFile(DOCS_FAVICON, join(EXAMPLES_DIR, 'favicon.ico'));
    await writeIndex(fullList);
    await writeBarrel(fullList);
  }
}

async function removeOrphans() {
  if (!existsSync(SRC_DIR)) { return; }
  const keep = new Set(CURRICULUM_IDS);
  const entries = await readdir(SRC_DIR, { withFileTypes: true });
  for (const entry of entries) {
    if (!entry.isDirectory() || keep.has(entry.name)) { continue; }
    const orphan = join(SRC_DIR, entry.name);
    await rm(orphan, { recursive: true, force: true });
    console.log(`⌫ ${entry.name.padEnd(28)}  (orphaned, removed)`);
  }
}

/* When a watch event fires on a partial sync, we still need the full list to rebuild the landing. */
async function fullSyncedList() {
  // Reconstruct the synced descriptor list from disk + metadata so the landing
  // page can be regenerated after a partial re-sync.
  const out = [];
  for (const id of CURRICULUM_IDS) {
    const dest = join(SRC_DIR, id);
    if (!existsSync(dest)) { continue; }
    const meta = await readMetadata(id);
    const componentJS = join(dest, 'component.js');
    let exportName = null;
    if (existsSync(componentJS)) {
      const src = await readFile(componentJS, 'utf8');
      const m = src.match(/export\s+const\s+(\w+)\s*=\s*defineComponent\(/);
      if (m) { exportName = m[1]; }
    }
    out.push({ id, title: meta.title || id, exportName, source: '' });
  }
  return out;
}

/* Map a relative path under docs/src/examples (e.g. "component/context-menu/component.html") to a curriculum ID. */
function idFromWatchPath(relPath) {
  if (!relPath) { return null; }
  const parts = relPath.split(/[\\/]/);
  for (let i = parts.length - 1; i >= 0; i--) {
    if (CURRICULUM_IDS.includes(parts[i])) { return parts[i]; }
  }
  return null;
}

/*
  Watch docs/src/examples recursively. Reactive only — does not prime the
  on-disk state on startup; run `node scripts/sync.js` (or `npm run build`)
  for a one-shot full sync. Coalesces bursts of file events per-ID with a
  short debounce, then re-syncs each affected ID and regenerates the
  landing / barrel once at the end of the burst.
*/
async function watchMode() {
  console.log(`Watching ${relative(REPO_ROOT, DOCS_EXAMPLES)} …  (Ctrl+C to stop)`);

  const pending = new Set();
  let timer = null;

  const flush = async () => {
    const ids = [...pending];
    pending.clear();
    timer = null;
    await syncIds(ids, { regenerateIndex: true });
  };

  fsWatch(DOCS_EXAMPLES, { recursive: true }, (_event, filename) => {
    const id = idFromWatchPath(filename);
    if (!id) { return; }
    pending.add(id);
    if (timer) { clearTimeout(timer); }
    timer = setTimeout(flush, 200);
  });
}

async function main() {
  const args = process.argv.slice(2);
  if (args.includes('--watch')) {
    await watchMode();
    return;
  }
  const ids = args.filter((a) => !a.startsWith('-'));
  const targets = ids.length > 0 ? ids : CURRICULUM_IDS;
  await syncIds(targets, { regenerateIndex: ids.length === 0 });
}

main();
