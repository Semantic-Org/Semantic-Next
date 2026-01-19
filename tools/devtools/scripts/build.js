import * as esbuild from 'esbuild';
import { copyFileSync, existsSync, mkdirSync, rmSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const rootDir = join(__dirname, '..');
const srcDir = join(rootDir, 'src');
const distDir = join(rootDir, 'dist');

const isProd = process.env.NODE_ENV === 'production';

// Clean dist
if (existsSync(distDir)) {
  rmSync(distDir, { recursive: true });
}
mkdirSync(distDir, { recursive: true });

// Build configurations
const configs = [
  // Bridge script - IIFE for page context injection
  {
    entryPoints: [join(srcDir, 'content/bridge.js')],
    bundle: true,
    format: 'iife',
    outfile: join(distDir, 'content/bridge.js'),
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },

  // Content script - IIFE (content scripts can't use ESM)
  {
    entryPoints: [join(srcDir, 'content/content-script.js')],
    bundle: true,
    format: 'iife',
    outfile: join(distDir, 'content/content-script.js'),
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },

  // Service worker - ESM (supported in MV3)
  {
    entryPoints: [join(srcDir, 'background/service-worker.js')],
    bundle: true,
    format: 'esm',
    outfile: join(distDir, 'background/service-worker.js'),
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },

  // Panel - ESM (loaded in panel.html as type="module")
  {
    entryPoints: [join(srcDir, 'panel/panel.js')],
    bundle: true,
    format: 'esm',
    outfile: join(distDir, 'panel/panel.js'),
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },

  // DevTools entry - IIFE
  {
    entryPoints: [join(srcDir, 'devtools/devtools.js')],
    bundle: true,
    format: 'iife',
    outfile: join(distDir, 'devtools/devtools.js'),
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },
];

// Build all
console.log('Building extension...');

try {
  await Promise.all(configs.map(config => esbuild.build(config)));
  console.log('JavaScript bundles built.');
}
catch (err) {
  console.error('Build failed:', err);
  process.exit(1);
}

// Copy static files
const staticFiles = [
  [join(rootDir, 'manifest.json'), join(distDir, 'manifest.json')],
  [join(srcDir, 'devtools/devtools.html'), join(distDir, 'devtools/devtools.html')],
  [join(srcDir, 'panel/panel.html'), join(distDir, 'panel/panel.html')],
  [join(srcDir, 'panel/panel.css'), join(distDir, 'panel/panel.css')],
];

// Copy icons if they exist
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
    else {
      console.warn(`Warning: Source file not found: ${src}`);
    }
  }
  catch (err) {
    console.warn(`Warning: Could not copy ${src}: ${err.message}`);
  }
}

console.log('Static files copied.');
console.log(`Build complete! Output in ${distDir}`);
