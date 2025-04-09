# ESBuild Callback Plugin

A flexible esbuild plugin that executes callback functions at different stages of the build process. Supports all esbuild plugin hooks: `onResolve`, `onLoad`, `onStart`, and `onEnd`. Useful with `watch: true` and `write: false` to perform additional actions when files change.

## Installation

```bash
npm install @semantic-ui/esbuild-callback
```

## Usage

### Using Multiple Callbacks

```js
import { build } from 'esbuild';
import { callback } from '@semantic-ui/esbuild-callback';
import fs from 'fs/promises';

build({
  entryPoints: ['src/index.js'],
  outdir: 'dist',
  bundle: true,
  watch: true,
  plugins: [
    callback({
      
      onLoad: async (args) => {
        // Transform the data...
        // Return the transformed content
      },
      
      // Called when the build starts
      onStart: () => {
        console.log(`Build ${isInitial ? 'started' : 'restarted'}`);
      },
      
      // Called when the build ends
      onEnd: (result, { isInitial }) => {
        console.log(`Build ${isInitial ? 'completed' : 'updated'}`);
        
        if (result.errors.length > 0) {
          console.error('Build had errors:', result.errors);
        }
      }
    })
  ]
});
```

## Callback Hooks

The plugin supports all esbuild plugin hooks:

- `onResolve`: Called when esbuild is resolving import paths
- `onLoad`: Called when esbuild is loading a file
- `onStart`: Called when a build starts
- `onEnd`: Called when a build ends

Each callback receives context including `isInitial` indicating if this is the first build.

## License

MIT
