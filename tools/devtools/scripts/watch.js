import * as esbuild from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, watch as fsWatch } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'src');
const distDir = join(rootDir, 'dist');

// Ensure dist exists
mkdirSync(distDir, { recursive: true });

// Build configurations
const configs = [
  {
    entryPoints: [join(srcDir, 'content/bridge.js')],
    bundle: true,
    format: 'iife',
    outfile: join(distDir, 'content/bridge.js'),
    sourcemap: true,
    target: 'es2020',
  },
  {
    entryPoints: [join(srcDir, 'content/content-script.js')],
    bundle: true,
    format: 'iife',
    outfile: join(distDir, 'content/content-script.js'),
    sourcemap: true,
    target: 'es2020',
  },
  {
    entryPoints: [join(srcDir, 'background/service-worker.js')],
    bundle: true,
    format: 'esm',
    outfile: join(distDir, 'background/service-worker.js'),
    sourcemap: true,
    target: 'es2020',
  },
  {
    entryPoints: [join(srcDir, 'panel/panel.js')],
    bundle: true,
    format: 'esm',
    outfile: join(distDir, 'panel/panel.js'),
    sourcemap: true,
    target: 'es2020',
  },
  {
    entryPoints: [join(srcDir, 'devtools/devtools.js')],
    bundle: true,
    format: 'iife',
    outfile: join(distDir, 'devtools/devtools.js'),
    sourcemap: true,
    target: 'es2020',
  },
];

// Create esbuild contexts for watching
console.log('Starting watch mode...');

const contexts = await Promise.all(
  configs.map(config => esbuild.context(config)),
);

// Start watching
await Promise.all(contexts.map(ctx => ctx.watch()));

// Copy static files initially
function copyStaticFiles() {
  const staticFiles = [
    [join(rootDir, 'manifest.json'), join(distDir, 'manifest.json')],
    [join(srcDir, 'devtools/devtools.html'), join(distDir, 'devtools/devtools.html')],
    [join(srcDir, 'panel/panel.html'), join(distDir, 'panel/panel.html')],
    [join(srcDir, 'panel/panel.css'), join(distDir, 'panel/panel.css')],
  ];

  const iconSizes = ['16', '32', '48', '128'];
  for (const size of iconSizes) {
    const iconSrc = join(rootDir, `icons/icon${size}.png`);
    const iconDest = join(distDir, `icons/icon${size}.png`);
    if (existsSync(iconSrc)) {
      staticFiles.push([iconSrc, iconDest]);
    }
  }

  for (const [src, dest] of staticFiles) {
    try {
      mkdirSync(dirname(dest), { recursive: true });
      if (existsSync(src)) {
        copyFileSync(src, dest);
      }
    }
    catch (err) {
      // Ignore
    }
  }
}

copyStaticFiles();

// Watch for static file changes
const watchDirs = [
  join(srcDir, 'panel'),
  join(srcDir, 'devtools'),
  rootDir,
];

for (const dir of watchDirs) {
  if (existsSync(dir)) {
    fsWatch(dir, { recursive: false }, (eventType, filename) => {
      if (filename && (filename.endsWith('.html') || filename.endsWith('.css') || filename === 'manifest.json')) {
        console.log(`Static file changed: ${filename}`);
        copyStaticFiles();
      }
    });
  }
}

console.log('Watching for changes...');
console.log('Press Ctrl+C to stop.');
