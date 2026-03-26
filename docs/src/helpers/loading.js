/**
 * Shared file caches - evaluated once at build time via Vite's import.meta.glob
 * Each content directory needs its own static glob pattern
 */
const globCache = {
  examples: import.meta.glob('/src/examples/**', { query: '?raw' }),
  lessons: import.meta.glob('/src/content/lessons/**', { query: '?raw' }),
};

/**
 * Map relative paths to their canonical glob key
 */
const getGlobKey = (basePath) => {
  if (basePath.includes('examples')) { return 'examples'; }
  if (basePath.includes('lessons')) { return 'lessons'; }
  return null;
};

/**
 * Filter shared files to only those matching a specific folder
 */
export const getFolder = (folderName, basePath) => {
  if (!folderName) {
    return {};
  }

  const globKey = getGlobKey(basePath);
  if (!globKey) {
    console.warn(`[getFolder] Unknown basePath: ${basePath}`);
    return {};
  }

  const allFiles = globCache[globKey];
  const filtered = {};

  // Match folder anywhere in path structure
  const folderPattern = new RegExp(`/${folderName}/`);

  for (const [filePath, loader] of Object.entries(allFiles)) {
    if (folderPattern.test(filePath)) {
      // Convert absolute glob path back to relative path format expected by consumers
      const relativePath = basePath + filePath.replace(/^\/src\/(examples|content\/lessons)\//, '');
      filtered[relativePath] = loader;
    }
  }

  return filtered;
};
