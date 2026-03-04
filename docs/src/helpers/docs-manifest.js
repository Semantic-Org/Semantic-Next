import { statSync } from 'fs';
import matter from 'gray-matter';
import { resolve } from 'path';
import { buildDocCategoryLookup } from './doc-menu-items.js';

export async function getDocsManifestData() {
  const allDocs = import.meta.glob('../pages/docs/**/*.mdx', {
    query: '?raw',
    eager: true,
  });

  const rootDir = process.cwd();
  const categoryLookup = buildDocCategoryLookup();

  const pages = Object.entries(allDocs).map(([filePath, module]) => {
    const content = module.default;
    const { data: frontmatter } = matter(content);

    const relativePath = filePath.replace('../pages/docs/', '');
    const url = '/docs/' + relativePath.replace('.mdx', '');
    const path = '/content/docs/' + relativePath.replace('.mdx', '.md');

    const tokens = Math.ceil(content.length / 4);

    // Last modified from filesystem
    let lastModified = null;
    try {
      const fsPath = resolve(rootDir, `src/pages/docs/${relativePath}`);
      lastModified = statSync(fsPath).mtime.toISOString();
    }
    catch {
      // File stat failed, leave as null
    }

    // Menu metadata for ordering and grouping
    const docPath = relativePath.replace('.mdx', '');
    const menuInfo = categoryLookup[docPath];

    return {
      path,
      url,
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      keywords: frontmatter.keywords || [],
      package: frontmatter.package || null,
      methods: frontmatter.methods || [],
      tokens,
      lastModified,
      ...(menuInfo && { section: menuInfo.section, category: menuInfo.category, order: menuInfo.order }),
    };
  });

  // Sort by menu order when available, then alphabetically
  pages.sort((a, b) => {
    if (a.order != null && b.order != null) { return a.order - b.order; }
    if (a.order != null) { return -1; }
    if (b.order != null) { return 1; }
    return a.title.localeCompare(b.title);
  });

  return pages;
}

export function buildFullManifest(pages) {
  return {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalPages: pages.length,
    totalTokens: pages.reduce((sum, p) => sum + p.tokens, 0),
    pages,
  };
}

export function buildSlimManifest(pages) {
  return {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalPages: pages.length,
    totalTokens: pages.reduce((sum, p) => sum + p.tokens, 0),
    pages: pages.map(({ path, title, tokens, package: pkg, methods, section, category, order }) => ({
      path,
      title,
      tokens,
      ...(pkg && { package: pkg }),
      ...(methods?.length > 0 && { methods }),
      ...(section && { section }),
      ...(category && { category }),
      ...(order != null && { order }),
    })),
  };
}
