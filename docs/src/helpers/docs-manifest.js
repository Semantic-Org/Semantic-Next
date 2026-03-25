import { statSync } from 'fs';
import matter from 'gray-matter';
import { resolve } from 'path';

export async function getDocsManifestData() {
  const allDocs = import.meta.glob('../pages/docs/**/*.mdx', {
    query: '?raw',
    eager: true,
  });

  const rootDir = process.cwd();

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
    };
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
    pages: pages.map(({ path, title, tokens, package: pkg, methods }) => ({
      path,
      title,
      tokens,
      ...(pkg && { package: pkg }),
      ...(methods?.length > 0 && { methods }),
    })),
  };
}
