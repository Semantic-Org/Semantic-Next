import { existsSync, readdirSync, readFileSync } from 'fs';
import { join, resolve } from 'path';
import { describe, expect, it } from 'vitest';

const ROOT = resolve(import.meta.dirname, '../../..');
const CDN_ROOT = 'https://cdn.semantic-ui.com';

const SUI_PACKAGES = readdirSync(join(ROOT, 'packages'), { withFileTypes: true })
  .filter(d => d.isDirectory() && !d.name.startsWith('.'))
  .map(d => d.name);

// Collect declared subpath exports (e.g. "./template") from each package
function getSubpathExports(packageName) {
  const pkgPath = join(ROOT, 'packages', packageName, 'package.json');
  if (!existsSync(pkgPath)) { return new Set(); }
  const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'));
  if (!pkg.exports) { return new Set(); }
  return new Set(
    Object.keys(pkg.exports)
      .filter(k => k !== '.')
      .map(k => k.replace(/^\.\//, '')),
  );
}

function getCdnImports(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const imports = [];
  const re = /from\s+"(https:\/\/cdn\.semantic-ui\.com\/[^"]+)"/g;
  let match;
  while ((match = re.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function parseCdnUrl(url) {
  // SUI bare:   https://cdn.semantic-ui.com/utils@0.18.0
  // SUI w/file: https://cdn.semantic-ui.com/utils@0.18.0/some-file.js
  // Vendor:     https://cdn.semantic-ui.com/vendor/lit@3.0.0/index.js
  const path = url.replace(`${CDN_ROOT}/`, '');
  const isVendor = path.startsWith('vendor/');
  const cleanPath = isVendor ? path.replace('vendor/', '') : path;
  const atIndex = cleanPath.indexOf('@');
  const slashAfterVersion = cleanPath.indexOf('/', atIndex);
  const hasFile = slashAfterVersion !== -1;
  const name = cleanPath.slice(0, atIndex);
  const version = hasFile
    ? cleanPath.slice(atIndex + 1, slashAfterVersion)
    : cleanPath.slice(atIndex + 1);
  const file = hasFile ? cleanPath.slice(slashAfterVersion + 1) : '';
  return { name, version, file, isVendor };
}

// These tests validate CDN build output — skip if artifacts haven't been built
const hasBuilt = SUI_PACKAGES.some(pkg => existsSync(join(ROOT, 'packages', pkg, 'dist', 'cdn')));

describe.skipIf(!hasBuilt)('CDN format URL validation', () => {
  it('all SUI packages produce CDN dist files', () => {
    for (const pkg of SUI_PACKAGES) {
      const cdnDir = join(ROOT, 'packages', pkg, 'dist', 'cdn');
      expect(existsSync(cdnDir), `${pkg} missing dist/cdn/`).toBe(true);
    }
  });

  it('SUI imports use bare URLs or declared subpath exports', () => {
    for (const pkg of SUI_PACKAGES) {
      const cdnFile = join(ROOT, 'packages', pkg, 'dist', 'cdn', `${pkg}.js`);
      if (!existsSync(cdnFile)) { continue; }

      const imports = getCdnImports(cdnFile);
      for (const url of imports) {
        const parsed = parseCdnUrl(url);
        if (!parsed.isVendor) {
          const subpaths = getSubpathExports(parsed.name);
          if (parsed.file) {
            expect(
              subpaths.has(parsed.file),
              `${pkg}: SUI import has unexpected file path "${parsed.file}" in "${url}" — not a declared subpath export of ${parsed.name}`,
            ).toBe(true);
          }
          expect(url, `${pkg}: SUI import should not contain @semantic-ui/`)
            .not.toContain('@semantic-ui/');
        }
      }
    }
  });

  it('vendor imports use /vendor/ prefix', () => {
    for (const pkg of SUI_PACKAGES) {
      const cdnFile = join(ROOT, 'packages', pkg, 'dist', 'cdn', `${pkg}.js`);
      if (!existsSync(cdnFile)) { continue; }

      const imports = getCdnImports(cdnFile);
      for (const url of imports) {
        const parsed = parseCdnUrl(url);
        if (!SUI_PACKAGES.includes(parsed.name)) {
          expect(url, `${pkg}: third-party import "${parsed.name}" should use /vendor/`)
            .toContain('/vendor/');
        }
      }
    }
  });

  it('no jsdelivr URLs remain in CDN format', () => {
    for (const pkg of SUI_PACKAGES) {
      const cdnFile = join(ROOT, 'packages', pkg, 'dist', 'cdn', `${pkg}.js`);
      if (!existsSync(cdnFile)) { continue; }

      const content = readFileSync(cdnFile, 'utf-8');
      expect(content, `${pkg}: still has jsdelivr URLs`).not.toContain('jsdelivr');
    }
  });

  it('all versions are valid semver', () => {
    for (const pkg of SUI_PACKAGES) {
      const cdnFile = join(ROOT, 'packages', pkg, 'dist', 'cdn', `${pkg}.js`);
      if (!existsSync(cdnFile)) { continue; }

      const imports = getCdnImports(cdnFile);
      for (const url of imports) {
        const parsed = parseCdnUrl(url);
        expect(parsed.version, `${pkg}: invalid version in "${url}"`)
          .toMatch(/^\d+\.\d+\.\d+/);
      }
    }
  });
});
