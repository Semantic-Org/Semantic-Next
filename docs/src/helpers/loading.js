import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

/**
 * Dev: read from disk. Vite's ?raw module graph caches aggressively and doesn't
 * invalidate on source-file change in Astro 6 / Vite 7 — so the JSON endpoint
 * serves stale content and the playground editor shows pre-edit code.
 * Prod build: eager glob bakes all file contents into the bundle at parse time;
 * building ~370 examples × several files each becomes property reads, not I/O.
 */
const isDev = import.meta.env.DEV;

// Prod only — dev uses fs.readFile (see below). Empty object in dev avoids
// Vite emitting a lazy glob that conflicts with the eager one.
const globCache = isDev ? {} : {
  examples: import.meta.glob('/src/examples/**', { query: '?raw', eager: true }),
  lessons: import.meta.glob('/src/content/lessons/**', { query: '?raw', eager: true }),
};

const devRoots = {
  examples: fileURLToPath(new URL('../examples/', import.meta.url)),
  lessons: fileURLToPath(new URL('../content/lessons/', import.meta.url)),
};

const getGlobKey = (basePath) => {
  if (basePath.includes('examples')) { return 'examples'; }
  if (basePath.includes('lessons')) { return 'lessons'; }
  return null;
};

const walk = async (dir) => {
  const out = [];
  let entries;
  try {
    entries = await fs.readdir(dir, { withFileTypes: true });
  }
  catch {
    return out;
  }
  for (const entry of entries) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) { out.push(...(await walk(full))); }
    else { out.push(full); }
  }
  return out;
};

const getFolderFromDisk = async (folderName, basePath, globKey) => {
  const root = devRoots[globKey];
  const files = await walk(root);
  const filtered = {};
  const folderPattern = new RegExp(`\\${path.sep}${folderName}\\${path.sep}`);
  for (const abs of files) {
    if (!folderPattern.test(abs)) { continue; }
    const rel = path.relative(root, abs).split(path.sep).join('/');
    filtered[basePath + rel] = async () => ({
      default: await fs.readFile(abs, 'utf-8'),
    });
  }
  return filtered;
};

const getFolderFromGlob = (folderName, basePath, globKey) => {
  const allFiles = globCache[globKey];
  const filtered = {};
  const folderPattern = new RegExp(`/${folderName}/`);
  for (const [filePath, entry] of Object.entries(allFiles)) {
    if (folderPattern.test(filePath)) {
      const relativePath = basePath + filePath.replace(/^\/src\/(examples|content\/lessons)\//, '');
      // eager: entry is the module object; lazy: entry is a loader function
      filtered[relativePath] = typeof entry === 'function' ? entry : async () => entry;
    }
  }
  return filtered;
};

/**
 * Filter shared files to only those matching a specific folder
 */
export const getFolder = async (folderName, basePath) => {
  if (!folderName) { return {}; }
  const globKey = getGlobKey(basePath);
  if (!globKey) {
    console.warn(`[getFolder] Unknown basePath: ${basePath}`);
    return {};
  }
  if (isDev) { return getFolderFromDisk(folderName, basePath, globKey); }
  return getFolderFromGlob(folderName, basePath, globKey);
};

const getAllFromDisk = async (basePath, globKey) => {
  const root = devRoots[globKey];
  const files = await walk(root);
  const out = {};
  for (const abs of files) {
    const rel = path.relative(root, abs).split(path.sep).join('/');
    out[basePath + rel] = async () => ({
      default: await fs.readFile(abs, 'utf-8'),
    });
  }
  return out;
};

const getAllFromGlob = (basePath, globKey) => {
  const allFiles = globCache[globKey];
  const out = {};
  for (const [filePath, entry] of Object.entries(allFiles)) {
    const relativePath = basePath + filePath.replace(/^\/src\/(examples|content\/lessons)\//, '');
    out[relativePath] = typeof entry === 'function' ? entry : async () => entry;
  }
  return out;
};

/**
 * Get every file under the shared glob — used by manifest/aggregator endpoints
 * that need all examples or all lessons, not a single folder.
 */
export const getAllFiles = async (basePath) => {
  const globKey = getGlobKey(basePath);
  if (!globKey) {
    console.warn(`[getAllFiles] Unknown basePath: ${basePath}`);
    return {};
  }
  if (isDev) { return getAllFromDisk(basePath, globKey); }
  return getAllFromGlob(basePath, globKey);
};
