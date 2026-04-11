import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

/*
  Builds CDN-ready icon and font asset sets.

  Icons: reads CSS from src/primitives/icon/sets/{lib}/, rewrites url() paths
  to absolute CDN URLs, copies SVGs flat alongside the CSS.

  Fonts: reads CSS from src/fonts/{name}/, rewrites url() paths
  to absolute CDN URLs, copies font files alongside the CSS.

  Output:
    dist/cdn/icons/{lib}.css       — CSS with absolute CDN urls
    dist/cdn/icons/{lib}/*.svg     — flat SVG files
    dist/cdn/fonts/{name}.css      — @font-face CSS with absolute CDN urls
    dist/cdn/fonts/{name}/*.woff2  — font files
*/

const ROOT = process.env.BASE_DIR || process.cwd();
const PKG = JSON.parse(readFileSync(join(ROOT, 'package.json'), 'utf-8'));
const CDN_ROOT = process.env.CDN_ROOT || 'https://cdn.semantic-ui.com';
const VERSION = process.env.CDN_CHANNEL === 'canary' ? 'canary' : PKG.version;
const ICON_SETS_DIR = join(ROOT, 'src', 'primitives', 'icon', 'sets');
const FONTS_DIR = join(ROOT, 'src', 'fonts');
const ICONS_OUT = join(ROOT, 'dist', 'cdn', 'icons');
const FONTS_OUT = join(ROOT, 'dist', 'cdn', 'fonts');

// Icon sets and their CSS entry file
// Most sets use {lib}.css with SVGs in svg/, brands uses index.css with SVGs alongside
function discoverIconSets() {
  const sets = [];
  if (!existsSync(ICON_SETS_DIR)) { return sets; }

  for (const entry of readdirSync(ICON_SETS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) { continue; }
    const name = entry.name;
    const dir = join(ICON_SETS_DIR, name);

    // Try {name}.css first, then index.css
    const cssFile = existsSync(join(dir, `${name}.css`))
      ? `${name}.css`
      : existsSync(join(dir, 'index.css'))
      ? 'index.css'
      : null;

    if (!cssFile) { continue; }

    // Find SVG files — either in svg/ subfolder or alongside CSS
    const svgDir = existsSync(join(dir, 'svg')) ? join(dir, 'svg') : dir;
    const svgs = readdirSync(svgDir)
      .filter(f => f.endsWith('.svg'));

    sets.push({ name, dir, cssFile, svgDir, svgs });
  }
  return sets;
}

function discoverFontSets() {
  const sets = [];
  if (!existsSync(FONTS_DIR)) { return sets; }

  for (const entry of readdirSync(FONTS_DIR, { withFileTypes: true })) {
    if (!entry.isDirectory()) { continue; }
    const name = entry.name;
    const dir = join(FONTS_DIR, name);

    // Try {name}.css first, then index.css
    const cssFile = existsSync(join(dir, `${name}.css`))
      ? `${name}.css`
      : existsSync(join(dir, 'index.css'))
      ? 'index.css'
      : null;

    if (!cssFile) { continue; }

    // Find font files (.woff2, .woff, .ttf, .otf)
    const fontFiles = readdirSync(dir)
      .filter(f => /\.(woff2?|ttf|otf)$/.test(f));

    sets.push({ name, dir, cssFile, fontFiles });
  }
  return sets;
}

// Rewrite relative url() paths to absolute CDN URLs
// CSS custom properties don't resolve url() relative to the declaring stylesheet,
// so we must use fully qualified URLs for cross-origin usage.
// e.g., url('./svg/house.svg') → url('https://cdn.semantic-ui.com/icons@0.18.0/lucide/house.svg')
function rewriteUrls(css, assetType, setName) {
  const base = `${CDN_ROOT}/${assetType}@${VERSION}/${setName}`;
  return css.replace(/url\(['"]?\.\/(?:svg\/)?([^'")\s]+)['"]?\)/g, (_match, filename) => {
    return `url('${base}/${filename}')`;
  });
}

function buildIconSets() {
  const sets = discoverIconSets();
  if (sets.length === 0) {
    console.log('  No icon sets found');
    return;
  }

  mkdirSync(ICONS_OUT, { recursive: true });

  for (const set of sets) {
    // Read and rewrite CSS
    const css = readFileSync(join(set.dir, set.cssFile), 'utf-8');
    const rewritten = rewriteUrls(css, 'icons', set.name);
    writeFileSync(join(ICONS_OUT, `${set.name}.css`), rewritten);

    // Copy SVGs flat
    const svgOut = join(ICONS_OUT, set.name);
    mkdirSync(svgOut, { recursive: true });
    for (const svg of set.svgs) {
      copyFileSync(join(set.svgDir, svg), join(svgOut, svg));
    }

    console.log(`  ${set.name}: ${set.svgs.length} SVGs`);
  }
}

function buildFontSets() {
  const sets = discoverFontSets();
  if (sets.length === 0) {
    console.log('  No font sets found');
    return;
  }

  mkdirSync(FONTS_OUT, { recursive: true });

  for (const set of sets) {
    // Read and rewrite CSS
    const css = readFileSync(join(set.dir, set.cssFile), 'utf-8');
    const rewritten = rewriteUrls(css, 'fonts', set.name);
    writeFileSync(join(FONTS_OUT, `${set.name}.css`), rewritten);

    // Copy font files
    const fontOut = join(FONTS_OUT, set.name);
    mkdirSync(fontOut, { recursive: true });
    for (const file of set.fontFiles) {
      copyFileSync(join(set.dir, file), join(fontOut, file));
    }

    console.log(`  ${set.name}: ${set.fontFiles.length} files`);
  }
}

console.log('Building CDN asset sets');
console.log('\nIcons:');
buildIconSets();
console.log('\nFonts:');
buildFontSets();
console.log('\nDone.');
