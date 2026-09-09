/*
  The import map the examples run under: every package an example may import,
  mapped to the file its build mode serves. Production points at the CDN, a
  static build at the packages it deploys, local dev at the monorepo through
  Vite. The playground keeps a mapped specifier bare for the browser to resolve.
*/

export const npmPackages = [
  '@semantic-ui/core',
  '@semantic-ui/component',
  '@semantic-ui/dates',
  '@semantic-ui/reactivity',
  '@semantic-ui/templating',
  '@semantic-ui/renderer',
  '@semantic-ui/query',
  '@semantic-ui/specs',
  '@semantic-ui/tailwind',
  '@semantic-ui/utils',
];

// monorepo is symlinked as @semantic-ui/core
// when developing locally
export const localPackages = [
  '@semantic-ui/core',
  '@semantic-ui/core/packages/component',
  '@semantic-ui/core/packages/dates',
  '@semantic-ui/core/packages/templating',
  '@semantic-ui/core/packages/renderer',
  '@semantic-ui/core/packages/query',
  '@semantic-ui/core/packages/specs',
  '@semantic-ui/core/packages/utils',
  '@semantic-ui/core/packages/reactivity',
  '@semantic-ui/core/packages/tailwind',
];

// bundle entry filenames for self-hosted packages
const bundleNames = {
  '@semantic-ui/core': 'semantic-ui',
  '@semantic-ui/component': 'component',
  '@semantic-ui/dates': 'dates',
  '@semantic-ui/reactivity': 'reactivity',
  '@semantic-ui/templating': 'templating',
  '@semantic-ui/renderer': 'renderer',
  '@semantic-ui/query': 'query',
  '@semantic-ui/specs': 'specs',
  '@semantic-ui/tailwind': 'tailwind',
  '@semantic-ui/utils': 'utils',
};

// subpath entries an example imports, with the file each mode serves. The browser
// matches an import map key exactly, so a subpath is its own line
export const subpaths = {
  '@semantic-ui/component/server': { local: 'src/server.js', static: 'dist/cdn/server.js' },
};

// mode is production, static or local. readPackage returns a package.json for a
// local package name, or null when it is not installed
export const buildImportMap = ({ mode, packageBase, version, readPackage }) => {
  const importPackages = mode === 'local' ? localPackages : npmPackages;
  const imports = {};

  for (const pkg of importPackages) {
    try {
      // production CDN
      if (mode === 'production') {
        imports[pkg] = `${packageBase}/${pkg}@${version}/+esm`;
        continue;
      }

      // self-hosted from build artifacts
      if (mode === 'static') {
        const name = bundleNames[pkg];
        imports[pkg] = `${packageBase}/${pkg}/dist/bundle/${name}.js`;
        continue;
      }

      // local dev — resolve from node_modules via Vite
      const pkgJson = readPackage(pkg);
      if (!pkgJson) {
        console.warn(`Pkg not found: ${pkg}`);
        continue;
      }

      let entry = pkgJson.module || pkgJson.main;
      if (!entry) {
        console.warn(`No entry point found for package: ${pkg}`);
        continue;
      }

      // Normalize entry path
      entry = entry.startsWith('./') ? entry : `./${entry}`;

      // Generate URL-safe path
      imports[pkgJson.name] = `${packageBase}/${pkg}/${entry.replace('./', '')}`;
    }
    catch (error) {
      console.error(`Error processing package ${pkg}:`, error);
    }
  }

  for (const [specifier, files] of Object.entries(subpaths)) {
    const pkg = specifier.split('/').slice(0, 2).join('/');
    const subpath = specifier.slice(pkg.length + 1);
    if (mode === 'production') {
      imports[specifier] = `${packageBase}/${pkg}@${version}/${subpath}/+esm`;
      continue;
    }
    if (mode === 'static') {
      imports[specifier] = `${packageBase}/${pkg}/${files.static}`;
      continue;
    }
    const local = localPackages.find((name) => name.endsWith(`/packages/${pkg.split('/')[1]}`));
    if (!local) {
      console.warn(`No local package for ${specifier}`);
      continue;
    }
    imports[specifier] = `${packageBase}/${local}/${files.local}`;
  }

  // production CDN: tailwind needs the bundle (has external deps)
  if (mode === 'production') {
    imports['@semantic-ui/tailwind'] = 'https://cdn.jsdelivr.net/npm/@semantic-ui/tailwind/dist/bundle/tailwind.js';
  }

  return { imports };
};
