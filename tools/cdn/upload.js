/**
 * Upload CDN artifacts to Cloudflare R2.
 *
 * Usage:
 *   node upload.js --version 0.18.0              # tagged release
 *   node upload.js --version canary              # canary from main
 *   node upload.js --version 0.18.0 --latest     # also update latest pointer
 *
 * Environment:
 *   R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT, R2_BUCKET_NAME
 */

import { GetObjectCommand, HeadObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { existsSync, readdirSync, readFileSync } from 'fs';
import { extname, join, resolve } from 'path';
import { gt, valid } from 'semver';
import { parseArgs } from 'util';

const ROOT = resolve(import.meta.dirname, '../..');

const SUI_SCOPE = '@semantic-ui/';

// Asset set directories live inside dist/cdn/ but are uploaded under their own
// top-level R2 prefix (icons/, fonts/) — exclude from core package upload.
const ASSET_SET_DIRS = ['icons', 'fonts'];

// Discover SUI packages from packages/*, plus core (root package)
const SUI_PACKAGES = [
  'core',
  ...readdirSync(join(ROOT, 'packages'), { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name),
];

function getSuiEntrypoint(name) {
  if (name === 'core') { return 'semantic-ui.min.js'; }
  return `${name}.min.js`;
}

// Vendor packages are discovered from dist/vendor-cdn/ (built by build-vendor-cdn.js)

const CONTENT_TYPES = {
  '.js': 'application/javascript',
  '.mjs': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.html': 'text/html',
  '.wasm': 'application/wasm',
  '.map': 'application/json',
  '.svg': 'image/svg+xml',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
};

function getContentType(filepath) {
  const ext = extname(filepath);
  return CONTENT_TYPES[ext] || 'application/octet-stream';
}

function createS3Client() {
  const { R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT } = process.env;
  if (!R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY || !R2_ENDPOINT) {
    throw new Error('Missing R2 credentials. Set R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, R2_ENDPOINT');
  }
  return new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
      accessKeyId: R2_ACCESS_KEY_ID,
      secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
  });
}

const bucket = process.env.R2_BUCKET_NAME || 'semantic-ui-cdn';

async function objectExists(s3, key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: bucket, Key: key }));
    return true;
  }
  catch {
    return false;
  }
}

async function uploadFile(s3, key, body, contentType) {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: body,
      ContentType: contentType,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
  );
}

async function uploadText(s3, key, text, contentType = 'text/plain') {
  await s3.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: text,
      ContentType: contentType,
    }),
  );
}

// Recursively collect all files in a directory
// skipDirs: top-level directory names to exclude (e.g., 'icons', 'fonts')
function collectFiles(dir, prefix = '', skipDirs = []) {
  const files = [];
  if (!existsSync(dir)) { return files; }
  for (const entry of readdirSync(dir, { withFileTypes: true })) {
    if (!prefix && skipDirs.includes(entry.name)) { continue; }
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.isDirectory()) {
      files.push(...collectFiles(join(dir, entry.name), rel));
    }
    else {
      files.push({ path: join(dir, entry.name), key: rel });
    }
  }
  return files;
}

// Upload SUI packages
async function uploadSuiPackages(s3, version, { force = false } = {}) {
  console.log(`\nUploading SUI packages @ ${version}`);

  for (const name of SUI_PACKAGES) {
    const cdnDir = name === 'core'
      ? join(ROOT, 'dist', 'cdn')
      : join(ROOT, 'packages', name, 'dist', 'cdn');

    if (!existsSync(cdnDir)) {
      console.warn(`  Skipping ${name}: no CDN dist`);
      continue;
    }

    const r2Prefix = `@semantic-ui/${name}/${version}/dist/cdn`;
    const skipDirs = name === 'core' ? ASSET_SET_DIRS : [];
    const files = collectFiles(cdnDir, '', skipDirs);

    // Check if this version already exists (skip immutable versions)
    if (!force && version !== 'canary') {
      const firstKey = `${r2Prefix}/${files[0]?.key}`;
      if (files.length > 0 && await objectExists(s3, firstKey)) {
        console.log(`  ${name}@${version} — already exists, skipping`);
        continue;
      }
    }

    for (const file of files) {
      const key = `${r2Prefix}/${file.key}`;
      await uploadFile(s3, key, readFileSync(file.path), getContentType(file.key));
    }
    console.log(`  ${name}@${version} — ${files.length} files`);
  }

  // Also upload core CSS (full bundle + sub-layers)
  const cssFiles = [
    'semantic-ui.css',
    'semantic-ui.css.map',
    'semantic-ui.min.css',
    'semantic-ui.min.css.map',
    'tokens.css',
    'tokens.css.map',
    'tokens.min.css',
    'tokens.min.css.map',
    'reset.css',
    'reset.css.map',
    'reset.min.css',
    'reset.min.css.map',
    'base.css',
    'base.css.map',
    'base.min.css',
    'base.min.css.map',
  ];
  for (const cssFile of cssFiles) {
    const cssPath = join(ROOT, 'dist', cssFile);
    if (existsSync(cssPath)) {
      const key = `@semantic-ui/core/${version}/dist/${cssFile}`;
      await uploadFile(s3, key, readFileSync(cssPath), getContentType(cssFile));
    }
  }
  console.log(`  core CSS uploaded`);
}

// Upload vendor packages from pre-built dist/vendor-cdn/
async function uploadVendorPackages(s3, { force = false } = {}) {
  console.log('\nUploading vendor packages' + (force ? ' (force)' : ''));

  const vendorDir = join(ROOT, 'dist', 'vendor-cdn');
  if (!existsSync(vendorDir)) {
    console.warn('  dist/vendor-cdn/ not found — run build-vendor-cdn.js first');
    return;
  }

  // Walk dist/vendor-cdn/{package}/{version}/... structure
  for (const entry of readdirSync(vendorDir, { withFileTypes: true })) {
    if (!entry.isDirectory()) { continue; }

    // Handle scoped packages (@scope/name)
    const scopeOrName = entry.name;
    if (scopeOrName.startsWith('@')) {
      const scopeDir = join(vendorDir, scopeOrName);
      for (const subEntry of readdirSync(scopeDir, { withFileTypes: true })) {
        if (!subEntry.isDirectory()) { continue; }
        const packageName = `${scopeOrName}/${subEntry.name}`;
        await uploadVendorPackage(s3, vendorDir, packageName, force);
      }
    }
    else {
      await uploadVendorPackage(s3, vendorDir, scopeOrName, force);
    }
  }
}

async function uploadVendorPackage(s3, vendorDir, packageName, force = false) {
  const pkgDir = join(vendorDir, ...packageName.split('/'));
  // Version is the directory name inside the package dir
  for (const versionEntry of readdirSync(pkgDir, { withFileTypes: true })) {
    if (!versionEntry.isDirectory()) { continue; }
    const version = versionEntry.name;
    const versionDir = join(pkgDir, version);
    const r2Prefix = `vendor/${packageName}/${version}`;

    const files = collectFiles(versionDir);
    if (files.length === 0) { continue; }

    // Check if already uploaded (skip unless forced)
    if (!force) {
      const firstKey = `${r2Prefix}/${files[0].key}`;
      if (await objectExists(s3, firstKey)) {
        console.log(`  ${packageName}@${version} — already exists, skipping`);
        continue;
      }
    }

    for (const file of files) {
      const key = `${r2Prefix}/${file.key}`;
      await uploadFile(s3, key, readFileSync(file.path), getContentType(file.key));
    }
    console.log(`  ${packageName}@${version} — ${files.length} files`);
  }
}

// Read preset manifest generated by build-ui-deps from bundle fields in specs
async function uploadPresets(s3) {
  const presetsPath = join(ROOT, 'dist', 'presets.json');
  if (!existsSync(presetsPath)) {
    console.warn('\n  dist/presets.json not found — run build:ui-deps first');
    return;
  }
  console.log('\nUploading preset manifest');
  const json = readFileSync(presetsPath, 'utf-8');
  await uploadText(s3, '_meta/presets.json', json, 'application/json');
  console.log('  _meta/presets.json uploaded');
}

function buildImportMap(version) {
  const cdnRoot = process.env.CDN_ROOT || 'https://cdn.semantic-ui.com';
  const imports = {};
  for (const name of SUI_PACKAGES) {
    imports[`${SUI_SCOPE}${name}`] = `${cdnRoot}/${name}@${version}`;
  }
  const json = JSON.stringify({ imports }, null, 2);
  const js = `(function(){var s=document.createElement('script');s.type='importmap';s.textContent=${
    JSON.stringify(JSON.stringify({ imports }))
  };document.currentScript.after(s)})();`;
  return { json, js };
}

// Build the version-agnostic loader script.
// The loader reads `version` from its own script tag attribute at runtime.
// Package names are baked in from SUI_PACKAGES — the only build-time dependency.
function buildLoader() {
  const cdnRoot = process.env.CDN_ROOT || 'https://cdn.semantic-ui.com';

  // Package names baked into the loader (derived from SUI_PACKAGES)
  const pkgNames = JSON.stringify(SUI_PACKAGES);

  // Bare package attributes the loader checks
  // 'core' is loaded via components, 'component' is loaded via authoring
  const bareAttrs = JSON.stringify(
    SUI_PACKAGES.filter(n => n !== 'core' && n !== 'component'),
  );

  const js = `(function(){
  var s=document.currentScript;
  var b=${JSON.stringify(cdnRoot)};
  var v=s.getAttribute('version')||'latest';
  if(v!=='latest'&&v!=='canary'&&!/^\d+\.\d+\.\d+/.test(v)){
    console.error('SUI: Invalid version "'+v+'". Use a semver version (e.g. "0.18.0"), "canary", or omit for latest.');
    return;
  }
  var scope='@semantic-ui/';

  // Build import map from package list + version
  var pkgs=${pkgNames};
  var imports={};
  pkgs.forEach(function(n){imports[scope+n]=b+'/'+n+'@'+v});
  var mapJson=JSON.stringify({imports:imports});

  // Inject import map (browsers support multiple, later entries win for collisions)
  if(document.querySelector('script[type="module"]')){
    console.warn('SUI: <script src="/load"> must appear before any <script type="module"> for import map resolution.');
  }
  if(s.parentElement&&s.parentElement!==document.head&&s.closest('body')){
    console.warn('SUI: Place <script src="/load"> in <head> for reliable import map registration.');
  }
  var m=document.createElement('script');
  m.type='importmap';
  m.textContent=mapJson;
  document.head.appendChild(m);

  var hc=s.hasAttribute('components'),ha=s.hasAttribute('authoring');

  // CSS injection — css="none" suppresses, css="tokens"|"reset"|"base" selects layer, bare css = full page
  var cv=s.getAttribute('css');
  if(cv!=='none'){
    if(cv==='tokens'||cv==='reset'||cv==='base')inject(b+'/css@'+v+'/'+cv);
    else if(s.hasAttribute('css'))inject(b+'/css@'+v);
    else if(hc||ha)inject(b+'/css@'+v+'/tokens');
  }

  // Icons — auto-inject lucide with components, bare icons attr defaults to lucide
  var ia=s.getAttribute('icons');
  if(ia!=='none'){
    var ic=ia||(s.hasAttribute('icons')||hc?'lucide':null);
    if(ic)ic.split(',').forEach(function(x){inject(b+'/icons@'+v+'/'+x.trim())});
  }

  // Fonts — auto-inject lato with components, bare fonts attr defaults to lato
  var fa=s.getAttribute('fonts');
  if(fa!=='none'){
    var fc=fa||(s.hasAttribute('fonts')||hc?'lato':null);
    if(fc)fc.split(',').forEach(function(x){inject(b+'/fonts@'+v+'/'+x.trim())});
  }

  // Components — bare = standard preset
  var co=s.getAttribute('components')||'';
  if(hc&&!co)co='standard';
  if(co)load(b+'/core@'+v+'/'+co.split(',').map(function(x){return x.trim()}).join(','));

  // Authoring lib
  if(ha)load(b+'/component@'+v);

  // Bare package attributes
  ${bareAttrs}.forEach(function(p){
    if(s.hasAttribute(p))load(b+'/'+p+'@'+v);
  });

  function load(u){import(u).catch(function(e){console.error('SUI: Failed to load '+u,e)})}
  function inject(h){var l=document.createElement('link');l.rel='stylesheet';l.href=h;l.setAttribute('blocking','render');document.head.appendChild(l)}
})();`;

  // Validate the generated script is syntactically valid
  try {
    new Function(js);
  }
  catch (e) {
    throw new Error(`Generated loader has syntax error: ${e.message}`);
  }

  return { js };
}

async function uploadLoader(s3) {
  console.log('\nGenerating loader');
  const { js } = buildLoader();
  await uploadText(s3, '_meta/load.js', js, 'application/javascript');
  console.log('  _meta/load.js uploaded');
}

async function uploadImportMaps(s3, version) {
  console.log(`\nGenerating import maps @ ${version}`);
  const { json, js } = buildImportMap(version);
  await uploadText(s3, `_meta/importmap@${version}.json`, json, 'application/json');
  await uploadText(s3, `_meta/importmap@${version}.js`, js, 'application/javascript');
  console.log(`  importmap@${version}.json + .js uploaded`);
}

async function updateVersionPointer(s3, alias, version) {
  // Prevent accidental downgrade of the latest pointer
  if (alias === 'latest' && valid(version)) {
    try {
      const res = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: '_versions/latest' }));
      const current = (await res.Body.transformToString()).trim();
      if (valid(current) && gt(current, version)) {
        console.error(`  Refusing to downgrade latest from ${current} to ${version}`);
        process.exit(1);
      }
    }
    catch { /* no existing pointer — first release */ }
  }

  await uploadText(s3, `_versions/${alias}`, version);
  console.log(`  _versions/${alias} → ${version}`);

  const { json: mapJson, js: mapJs } = buildImportMap(version);
  await uploadText(s3, `_meta/importmap@${alias}.json`, mapJson, 'application/json');
  await uploadText(s3, `_meta/importmap@${alias}.js`, mapJs, 'application/javascript');

  // Unversioned endpoints always point to latest
  if (alias === 'latest') {
    await uploadText(s3, `_meta/importmap.js`, mapJs, 'application/javascript');
    await uploadText(s3, `_meta/importmap.json`, mapJson, 'application/json');
  }

  console.log(`  importmap@${alias} updated`);
}

// Upload CDN asset sets (icons + fonts) — top-level R2 prefixes
async function uploadAssetSets(s3, version, { force = false } = {}) {
  for (const assetType of ASSET_SET_DIRS) {
    const assetDir = join(ROOT, 'dist', 'cdn', assetType);
    if (!existsSync(assetDir)) {
      continue;
    }

    console.log(`\nUploading ${assetType} @ ${version}`);
    const r2Prefix = `${assetType}/${version}`;
    const files = collectFiles(assetDir);

    if (files.length === 0) {
      console.log(`  No ${assetType} files found`);
      continue;
    }

    // Asset sets rarely change — skip if already uploaded (even canary).
    // Use --force-assets when icons or fonts source changes.
    if (!force) {
      const firstKey = `${r2Prefix}/${files[0].key}`;
      if (await objectExists(s3, firstKey)) {
        console.log(`  ${assetType}@${version} — already exists, skipping`);
        continue;
      }
    }

    for (const file of files) {
      const key = `${r2Prefix}/${file.key}`;
      await uploadFile(s3, key, readFileSync(file.path), getContentType(file.key));
    }
    console.log(`  ${assetType}@${version} — ${files.length} files`);
  }
}

async function main() {
  const { values } = parseArgs({
    options: {
      version: { type: 'string' },
      latest: { type: 'boolean', default: false },
      'force-vendor': { type: 'boolean', default: false },
      'force-assets': { type: 'boolean', default: false },
    },
  });

  const version = values.version;
  if (!version) {
    console.error('Usage: node upload.js --version <version> [--latest]');
    process.exit(1);
  }

  const s3 = createS3Client();

  const isCanary = version === 'canary';
  const suiVersion = isCanary ? 'canary' : version;

  await uploadSuiPackages(s3, suiVersion, { force: isCanary });
  await uploadAssetSets(s3, suiVersion, { force: values['force-assets'] });
  await uploadVendorPackages(s3, { force: values['force-vendor'] });
  await uploadImportMaps(s3, suiVersion);
  await uploadLoader(s3);
  await uploadPresets(s3);

  if (isCanary) {
    await updateVersionPointer(s3, 'canary', 'canary');
  }

  if (values.latest) {
    await updateVersionPointer(s3, 'latest', version);
  }

  console.log('\nDone.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
