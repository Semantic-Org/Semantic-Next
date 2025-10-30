#!/usr/bin/env node

/**
 * Check and fix broken markdown links in ai/ directory
 *
 * Usage:
 *   node check-markdown-links.js                    # Dry run (reports only)
 *   node check-markdown-links.js --fix              # Auto-fix links
 *   node check-markdown-links.js --threshold 0.8    # Custom threshold (default 0.85)
 *   node check-markdown-links.js --fix --verbose    # Fix with detailed output
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const AI_DIR = path.resolve(__dirname, '../../');
const DOCS_DIR = path.resolve(__dirname, '../../../docs/src/pages');
const THRESHOLD = parseFloat(process.argv.find(arg => arg.startsWith('--threshold='))?.split('=')[1]) || 0.85;
const AUTO_FIX = process.argv.includes('--fix');
const VERBOSE = process.argv.includes('--verbose');

// Stats
const stats = {
  filesScanned: 0,
  linksFound: 0,
  brokenLinks: 0,
  fixed: 0,
  couldNotFix: 0,
};

/**
 * Calculate Levenshtein distance between two strings
 */
function levenshteinDistance(str1, str2) {
  const matrix = [];

  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }

  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }

  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      }
      else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1, // substitution
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j] + 1, // deletion
        );
      }
    }
  }

  return matrix[str2.length][str1.length];
}

/**
 * Calculate similarity score (0-1) between two strings
 */
function similarity(str1, str2) {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;

  if (longer.length === 0) { return 1.0; }

  const distance = levenshteinDistance(longer, shorter);
  return (longer.length - distance) / longer.length;
}

// Directories to skip when scanning for markdown files
const SKIP_DIRS = ['node_modules', 'artifacts'];

/**
 * Find all markdown files in directory recursively
 */
function findMarkdownFiles(dir, files = []) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      // Skip hidden directories and excluded directories
      if (!entry.name.startsWith('.') && SKIP_DIRS.indexOf(entry.name) === -1) {
        findMarkdownFiles(fullPath, files);
      }
    }
    else if (entry.name.endsWith('.md')) {
      files.push(fullPath);
    }
  }

  return files;
}

/**
 * Find all potential target files in ai/ directory and docs/pages
 */
function buildFileIndex(baseDir, docsDir) {
  const index = new Map();

  function indexDirectory(dir, base) {
    if (!fs.existsSync(dir)) { return; }

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);

      if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
        indexDirectory(fullPath, base);
      }
      else if (entry.isFile()) {
        const relativePath = path.relative(base, fullPath);
        const filename = entry.name;

        // Index by full relative path
        index.set(relativePath, fullPath);

        // Also index by filename for fuzzy matching
        if (!index.has(filename)) {
          index.set(filename, fullPath);
        }
      }
    }
  }

  // Index ai/ directory
  indexDirectory(baseDir, baseDir);

  // Index docs/pages directory for .mdx files
  if (fs.existsSync(docsDir)) {
    function indexDocsDirectory(dir) {
      const entries = fs.readdirSync(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
          indexDocsDirectory(fullPath);
        }
        else if (entry.isFile() && entry.name.endsWith('.mdx')) {
          // Index by URL path (e.g., /components/rendering)
          const relativePath = path.relative(docsDir, fullPath);
          const urlPath = '/' + relativePath.replace(/\.mdx$/, '').replace(/\\/g, '/');

          index.set(urlPath, fullPath);

          // Also index by filename
          if (!index.has(entry.name)) {
            index.set(entry.name, fullPath);
          }
        }
      }
    }

    indexDocsDirectory(docsDir);
  }

  return index;
}

/**
 * Extract markdown links from content
 * Matches both [text](url) and [text]: url patterns
 */
function extractLinks(content, filePath) {
  const links = [];

  // Inline links: [text](url)
  const inlineRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match;

  while ((match = inlineRegex.exec(content)) !== null) {
    const [fullMatch, text, url] = match;

    // Skip external links and anchors
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
      continue;
    }

    links.push({
      type: 'inline',
      text,
      url,
      fullMatch,
      index: match.index,
    });
  }

  // Reference links: [text]: url
  const referenceRegex = /^\[([^\]]+)\]:\s*(.+)$/gm;

  while ((match = referenceRegex.exec(content)) !== null) {
    const [fullMatch, text, url] = match;

    // Skip external links and anchors
    if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('#')) {
      continue;
    }

    links.push({
      type: 'reference',
      text,
      url: url.trim(),
      fullMatch,
      index: match.index,
    });
  }

  return links;
}

/**
 * Resolve link path relative to source file
 */
function resolveLink(sourceFile, linkUrl, fileIndex) {
  const sourceDir = path.dirname(sourceFile);

  // Remove anchor if present
  const urlWithoutAnchor = linkUrl.split('#')[0];

  // Handle absolute paths that might be docs URLs (e.g., /components/rendering)
  if (urlWithoutAnchor.startsWith('/')) {
    // Check if this is a docs URL path
    if (fileIndex.has(urlWithoutAnchor)) {
      return fileIndex.get(urlWithoutAnchor);
    }

    // Otherwise treat as project root path
    return path.join(AI_DIR, '..', urlWithoutAnchor);
  }

  // Handle relative paths
  return path.resolve(sourceDir, urlWithoutAnchor);
}

/**
 * Find best matching file using Levenshtein distance
 */
function findBestMatch(targetPath, fileIndex) {
  const targetFilename = path.basename(targetPath);
  const targetRelative = path.relative(AI_DIR, targetPath);

  let bestMatch = null;
  let bestScore = 0;

  for (const [indexedPath, fullPath] of fileIndex.entries()) {
    // Compare both filename and relative path
    const filenameScore = similarity(targetFilename, path.basename(indexedPath));
    const pathScore = similarity(targetRelative, path.relative(AI_DIR, fullPath));

    // Weighted score: filename more important than path
    const combinedScore = (filenameScore * 0.7) + (pathScore * 0.3);

    if (combinedScore > bestScore) {
      bestScore = combinedScore;
      bestMatch = fullPath;
    }
  }

  return { path: bestMatch, score: bestScore };
}

/**
 * Process a single markdown file
 */
function processFile(filePath, fileIndex) {
  stats.filesScanned++;

  const content = fs.readFileSync(filePath, 'utf-8');
  const links = extractLinks(content, filePath);

  if (links.length === 0) { return; }

  stats.linksFound += links.length;

  let modifiedContent = content;
  let hasChanges = false;
  const changes = [];

  // Process links in reverse order to maintain correct indices
  for (let i = links.length - 1; i >= 0; i--) {
    const link = links[i];
    const resolvedPath = resolveLink(filePath, link.url, fileIndex);

    // Check if target exists
    if (fs.existsSync(resolvedPath)) {
      if (VERBOSE) {
        console.log(`  ✓ ${link.url}`);
      }
      continue;
    }

    stats.brokenLinks++;

    // Try to find best match
    const match = findBestMatch(resolvedPath, fileIndex);

    if (match.score >= THRESHOLD) {
      // Use absolute paths - /ai/ for ai/ directory, relative for others
      let newPath = path.relative(AI_DIR, match.path);

      // If path is within ai/ directory and not already absolute, add /ai/ prefix
      if (!newPath.startsWith('/') && !newPath.startsWith('..')) {
        newPath = '/ai/' + newPath;
      }

      // Replace the link in content
      const oldLink = link.fullMatch;
      let newLink;

      if (link.type === 'inline') {
        newLink = `[${link.text}](${newPath})`;
      }
      else {
        newLink = `[${link.text}]: ${newPath}`;
      }

      changes.push({
        old: link.url,
        new: newPath,
        score: match.score,
      });

      if (AUTO_FIX) {
        modifiedContent = modifiedContent.substring(0, link.index)
          + newLink
          + modifiedContent.substring(link.index + oldLink.length);

        hasChanges = true;
        stats.fixed++;
      }
    }
    else {
      stats.couldNotFix++;

      console.log(`  ✗ BROKEN: ${link.url}`);
      if (match.path) {
        console.log(
          `    Best match: ${path.relative(AI_DIR, match.path)} (${
            (match.score * 100).toFixed(1)
          }% confidence - below ${(THRESHOLD * 100).toFixed(0)}% threshold)`,
        );
      }
      else {
        console.log(`    No similar file found`);
      }
    }
  }

  // Report changes for this file
  if (changes.length > 0) {
    const relPath = path.relative(AI_DIR, filePath);
    console.log(`\n📄 ${relPath}`);

    for (const change of changes) {
      if (AUTO_FIX) {
        console.log(`  ✓ FIXED (${(change.score * 100).toFixed(1)}%): ${change.old} → ${change.new}`);
      }
      else {
        console.log(`  → WOULD FIX (${(change.score * 100).toFixed(1)}%): ${change.old} → ${change.new}`);
      }
    }
  }

  // Write changes if auto-fix enabled
  if (AUTO_FIX && hasChanges) {
    fs.writeFileSync(filePath, modifiedContent, 'utf-8');
  }
}

/**
 * Main execution
 */
function main() {
  console.log('🔍 Scanning markdown links in ai/ directory...\n');
  console.log(`Mode: ${AUTO_FIX ? '🔧 AUTO-FIX' : '👀 DRY RUN'}`);
  console.log(`Confidence threshold: ${(THRESHOLD * 100).toFixed(0)}%\n`);

  // Build file index
  console.log('Building file index...');
  const fileIndex = buildFileIndex(AI_DIR, DOCS_DIR);
  console.log(`Indexed ${fileIndex.size} files\n`);

  // Find all markdown files
  const mdFiles = findMarkdownFiles(AI_DIR);
  console.log(`Found ${mdFiles.length} markdown files\n`);

  // Process each file
  for (const filePath of mdFiles) {
    processFile(filePath, fileIndex);
  }

  // Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Summary');
  console.log('='.repeat(60));
  console.log(`Files scanned:     ${stats.filesScanned}`);
  console.log(`Links found:       ${stats.linksFound}`);
  console.log(`Broken links:      ${stats.brokenLinks}`);
  console.log(`Fixed:             ${stats.fixed}`);
  console.log(`Could not fix:     ${stats.couldNotFix}`);

  if (!AUTO_FIX && stats.fixed > 0) {
    console.log('\n💡 Run with --fix flag to apply changes automatically');
  }

  if (stats.brokenLinks > 0 && stats.couldNotFix > 0) {
    console.log('\n⚠️  Some broken links could not be fixed automatically');
    console.log('   Review them manually or try lowering --threshold');
  }

  // Exit with error code if there are unfixed broken links
  if (stats.couldNotFix > 0) {
    process.exit(1);
  }
}

main();
