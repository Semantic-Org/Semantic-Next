# @semantic-ui/esbuild-resolve-bare-imports

An esbuild plugin that resolves bare module imports to fully qualified URLs, perfect for creating CDN-compatible builds.

[![npm version](https://img.shields.io/npm/v/@semantic-ui/esbuild-resolve-bare-imports.svg)](https://www.npmjs.com/package/@semantic-ui/esbuild-resolve-bare-imports)
[![license](https://img.shields.io/npm/l/@semantic-ui/esbuild-resolve-bare-imports.svg)](https://github.com/semantic-org/esbuild-resolve-bare-imports/blob/main/LICENSE)

## Features

- Transforms bare module imports to CDN URLs
- Smart entrypoint detection using jsDelivr's API
- Persistent caching for better build performance
- Handles scoped packages and subpath imports correctly
- Supports direct URL mapping for specific packages
- Customizable resolver function for complete control

## Installation

```bash
npm install --save-dev @semantic-ui/esbuild-resolve-bare-imports
```

## Basic Usage

```javascript
import * as esbuild from 'esbuild';
import { resolveBareImports } from '@semantic-ui/esbuild-resolve-bare-imports';
import fs from 'fs/promises';

// Read package.json
const packageJson = JSON.parse(await fs.readFile('./package.json', 'utf-8'));

// Build with CDN imports
await esbuild.build({
  entryPoints: ['src/index.js'],
  bundle: true,
  format: 'esm',
  outfile: 'dist/cdn/index.js',
  plugins: [
    resolveBareImports({ packageJson })
  ],
});
```

## Configuration Options

```javascript
resolveBareImports({
  // Package.json content (for dependency resolution)
  packageJson: {},
  
  // Optional: Only transform these dependencies (default: all dependencies)
  onlyDependencies: null,
  
  // Directory to store cache in (default: '.cache')
  cacheDir: '.cache',
  
  // Base CDN URL (default: 'https://cdn.jsdelivr.net/npm')
  cdnRoot: 'https://cdn.jsdelivr.net/npm',
  
  // Logging verbosity: 'silent', 'minimal', 'normal', or 'verbose'
  logging: 'normal',
  
  // Custom resolver function (packageName, version, entrypoint) => string
  resolver: null,
  
  // Direct replacements for packages - bypasses resolution
  directReplacements: {
    'lodash': 'https://cdn.example.com/lodash.js'
  }
})
```

### Using Different CDNs with cdnRoot

You can easily switch between popular CDNs by changing the `cdnRoot` option:

| CDN | cdnRoot Value | Notes |
|-----|---------------|-------|
| jsDelivr | `'https://cdn.jsdelivr.net/npm'` | Default, optimized global CDN |
| Unpkg | `'https://unpkg.com'` | Popular alternative CDN |
| Skypack | `'https://cdn.skypack.dev'` | Modern ESM-focused CDN |
| CDNJS | `'https://cdnjs.cloudflare.com/ajax/libs'` | Cloudflare's CDN (requires custom resolver) |
| Google Hosted Libraries | `'https://ajax.googleapis.com/ajax/libs'` | Limited package selection (requires custom resolver) |
| Custom CDN | `'https://your-cdn.example.com/packages'` | Your own CDN solution |

Example with Unpkg:

```javascript
resolveBareImports({
  packageJson,
  cdnRoot: 'https://unpkg.com'
})
```

**Note:** For CDNs with different path structures, you may need a custom resolver function.

## Advanced Usage

### Custom Resolver

You can completely customize how URLs are generated:

```javascript
resolveBareImports({
  packageJson,
  resolver: (packageName, version, entrypoint) => {
    // Special handling for specific packages
    if (packageName === 'react') {
      return `https://unpkg.com/${packageName}@${version}/umd/react.production.min.js`;
    }
    
    // Default CDN URL pattern for other packages
    return `https://cdn.jsdelivr.net/npm/${packageName}@${version}/${entrypoint}`;
  }
})
```

### Direct Replacements

You can explicitly map certain packages to specific URLs:

```javascript
resolveBareImports({
  packageJson,
  directReplacements: {
    'jquery': 'https://code.jquery.com/jquery-3.6.0.min.js',
    '@semantic-ui/utils': 'https://custom-cdn.com/semantic-ui-utils.js'
  }
})
```

### Subpath Handling

The plugin correctly handles subpath imports:

```javascript
// Input:
import map from 'lodash/map';
import { helpers } from '@semantic-ui/utils/helpers';

// Output (after transformation):
import map from 'https://cdn.jsdelivr.net/npm/lodash@4.17.21/map.js';
import { helpers } from 'https://cdn.jsdelivr.net/npm/@semantic-ui/utils@0.10.0/helpers.js';
```

## License

MIT
