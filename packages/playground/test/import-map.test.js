import { readFileSync } from 'node:fs';

import { describe, expect, it } from 'vitest';

import { buildImportMap } from '../../../docs/src/helpers/import-map.js';
import { rewriteBareImports } from '../src/worker/resolve.js';

const cdnBaseUrl = 'https://cdn.jsdelivr.net/npm';
const dependencies = { '@semantic-ui/component': '0.18.0' };
const example = readFileSync(
  new URL('../../../docs/src/examples/framework/lifecycle/server-rendering/server.js', import.meta.url),
  'utf8',
);

// local mode reads a package.json per entry, the monorepo entries carry their published names
const readPackage = (pkg) => ({
  name: pkg.replace('@semantic-ui/core/packages/', '@semantic-ui/'),
  module: 'src/index.js',
});
const mapFor = (mode) => buildImportMap({ mode, packageBase: '/base', version: '0.18.0', readPackage });

describe('the examples import map', () => {
  it('keeps the server-rendering example on the mapped server entry in every mode', () => {
    for (const mode of ['local', 'static', 'production']) {
      expect(rewriteBareImports({ source: example, importMap: mapFor(mode), cdnBaseUrl, dependencies })).toBe(example);
    }
  });

  it('serves the component server entry from the file each mode ships', () => {
    const entry = (mode) => mapFor(mode).imports['@semantic-ui/component/server'];
    expect(entry('local')).toBe('/base/@semantic-ui/core/packages/component/src/server/index.js');
    expect(entry('static')).toBe('/base/@semantic-ui/component/dist/cdn/server.js');
    expect(entry('production')).toBe('/base/@semantic-ui/component@0.18.0/server/+esm');
  });
});
