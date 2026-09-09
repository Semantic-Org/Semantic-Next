// src/pages/importmap.json.js
import fs from 'fs';
import path from 'path';

import { buildImportMap } from '@helpers/import-map.js';
import { isProductionBuild, isStaticBuild, packageBase } from '@helpers/injections.js';

export { localPackages, npmPackages } from '@helpers/import-map.js';

const mode = isProductionBuild ? 'production' : isStaticBuild ? 'static' : 'local';

const readPackage = (pkg) => {
  const pkgPath = path.resolve(process.cwd(), 'node_modules', pkg.replace(/\//g, path.sep), 'package.json');
  return fs.existsSync(pkgPath) ? JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) : null;
};

export const importMap = buildImportMap({ mode, packageBase, version: PACKAGE_VERSION, readPackage });
export const importMapJSON = JSON.stringify(importMap, null, 2);

export const GET = async () => {
  return new Response(importMapJSON, {
    headers: {
      'Content-Type': 'application/importmap+json',
      'Cache-Control': 'public, max-age=31536000',
    },
  });
};
