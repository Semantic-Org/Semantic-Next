import { readdirSync } from 'fs';
import fs from 'fs/promises';
import path from 'path';

/*
  Copies built package artifacts into docs/public/packages/
  so they can be served as static assets alongside the docs site.

  This allows playground examples to resolve imports from the
  same build rather than relying on a CDN for tagged releases.

  Packages are discovered from packages/*, not hardcoded.
*/

const BASE_DIR = process.env.BASE_DIR || process.cwd();
const DOCS_PACKAGES_DIR = path.resolve(BASE_DIR, 'docs/public/packages');

const packages = readdirSync(path.resolve(BASE_DIR, 'packages'), { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    }
    else {
      await fs.copyFile(srcPath, destPath);
    }
  }
}

async function copyPackages() {
  // clean previous output
  await fs.rm(DOCS_PACKAGES_DIR, { recursive: true, force: true });

  // copy core bundle + CSS
  const coreSrc = path.resolve(BASE_DIR, 'dist');
  const coreDest = path.resolve(DOCS_PACKAGES_DIR, '@semantic-ui/core/dist');

  // bundle dir (semantic-ui.js, semantic-ui.css, etc.)
  await copyDir(
    path.join(coreSrc, 'bundle'),
    path.join(coreDest, 'bundle'),
  );

  // top-level CSS (semantic-ui.css used by headLibraryJS)
  for (const file of await fs.readdir(coreSrc)) {
    if (file.endsWith('.css') || file.endsWith('.css.map')) {
      await fs.cp(
        path.join(coreSrc, file),
        path.join(coreDest, file),
      );
    }
  }

  // icon-set CSS is loaded by a raw <link> in the playground (headLibraryJS),
  // not through the bundle, so the source files and their svgs have to ship too
  const iconSetsSubPath = '@semantic-ui/core/src/primitives/icon/sets';
  const iconSetsDest = path.resolve(DOCS_PACKAGES_DIR, iconSetsSubPath);
  await copyDir(path.resolve(BASE_DIR, 'src/primitives/icon/sets'), iconSetsDest);

  // a relative url() inside a custom property resolves against the document, not
  // the stylesheet (Chrome), so './svg/x.svg' 404s in the playground sandbox.
  // rewrite to the absolute path each deploy serves its own copied svgs from.
  for (const entry of await fs.readdir(iconSetsDest, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    const setDir = path.join(iconSetsDest, entry.name);
    const webBase = `/packages/${iconSetsSubPath}/${entry.name}`;
    for (const file of await fs.readdir(setDir)) {
      if (!file.endsWith('.css')) {
        continue;
      }
      const cssPath = path.join(setDir, file);
      const css = await fs.readFile(cssPath, 'utf8');
      await fs.writeFile(cssPath, css.replaceAll("url('./", `url('${webBase}/`));
    }
  }

  // copy each package's bundle dir (skip packages without dist/bundle)
  for (const pkg of packages) {
    const pkgSrc = path.resolve(BASE_DIR, 'packages', pkg, 'dist', 'bundle');
    try {
      await fs.access(pkgSrc);
    }
    catch {
      continue;
    }
    const pkgDest = path.resolve(DOCS_PACKAGES_DIR, `@semantic-ui/${pkg}/dist/bundle`);
    await copyDir(pkgSrc, pkgDest);
  }

  console.log(`Copied package artifacts to ${DOCS_PACKAGES_DIR}`);
}

copyPackages();
