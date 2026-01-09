import fs from 'fs';
import { glob } from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Recursively search for a folder and return all files within it
 * Replaces import.meta.glob() with targeted file loading
 */
export const getFolder = async (folderName, baseFolder, { depth = 3 } = {}) => {
  if (!folderName) {
    return {};
  }

  // Convert to absolute path for glob search
  // Strip all leading '../' and resolve from docs/src/
  const strippedBase = baseFolder.replace(/^(\.\.\/)+/, '');
  const searchBase = path.resolve(__dirname, '..', strippedBase);

  // Generate search patterns dynamically based on depth
  const globPatterns = [];

  // Direct match (0 levels deep)
  globPatterns.push(`${searchBase}/${folderName}/**/*`);

  // Add patterns for each depth level
  for (let i = 1; i <= depth; i++) {
    const wildcards = '*/'.repeat(i);
    globPatterns.push(`${searchBase}/${wildcards}${folderName}/**/*`);
  }

  const files = {};

  for (const pattern of globPatterns) {
    const matchedFiles = await glob(pattern, { nodir: true });

    for (const filePath of matchedFiles) {
      // Convert absolute path back to the relative format that getExampleFiles expects
      const relativePath = path.relative(searchBase, filePath);
      const globStylePath = (baseFolder + relativePath).replace(/\\/g, '/');

      files[globStylePath] = async () => {
        const content = fs.readFileSync(filePath, 'utf8');
        return { default: content };
      };
    }
  }

  return files;
};
