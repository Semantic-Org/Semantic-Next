// src/pages/importmap.json.js
import fs from 'fs';
import path from 'path';

import { isStaticBuild, packageBase } from '@helpers/injections.js';

export const npmPackages = [
  '@semantic-ui/core',
  '@semantic-ui/component',
  '@semantic-ui/reactivity',
  '@semantic-ui/templating',
  '@semantic-ui/renderer',
  '@semantic-ui/query',
  '@semantic-ui/specs',
  '@semantic-ui/utils',
];

// monorepo is symlinked as @semantic-ui/core
// when developing locally
export const localPackages = [
  '@semantic-ui/core',
  '@semantic-ui/core/packages/component',
  '@semantic-ui/core/packages/templating',
  '@semantic-ui/core/packages/renderer',
  '@semantic-ui/core/packages/query',
  '@semantic-ui/core/packages/specs',
  '@semantic-ui/core/packages/utils',
  /*
  '@semantic-ui/core/packages/reactivity',
  */
];

const importPackages = (isStaticBuild)
  ? npmPackages
  : localPackages
;

const packageImports = { imports: {} };

for (const pkg of importPackages) {
  try {
    const pkgPath = path.resolve(
      process.cwd(),
      'node_modules',
      pkg.replace(/\//g, path.sep),
      'package.json'
    );

    if (!fs.existsSync(pkgPath)) {
      console.warn(`Package not found: ${pkg}`);
      continue;
    }

    const pkgJson = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
    let entry = pkgJson.module || pkgJson.main;

    if (!entry) {
      console.warn(`No entry point found for package: ${pkg}`);
      continue;
    }

    // Normalize entry path
    entry = entry.startsWith('./') ? entry : `./${entry}`;

    // Generate URL-safe path
    const mappedUrl = `${packageBase}/${pkg}/${entry.replace('./', '')}`;

    // Add to import map
    packageImports.imports[pkgJson.name] = mappedUrl;
  } catch (error) {
    console.error(`Error processing package ${pkg}:`, error);
  }
}

export const importMap = packageImports;
export const importMapJSON = JSON.stringify(packageImports, null, 2);

export const GET = async () => {
  return new Response(importMapJSON, {
    headers: {
      'Content-Type': 'application/importmap+json',
      'Cache-Control': 'public, max-age=31536000',
    }
  });
};
