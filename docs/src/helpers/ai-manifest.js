import { statSync } from 'fs';
import matter from 'gray-matter';
import { resolve } from 'path';

const AUDIENCE_ORDER = ['ui', 'authoring', 'skills', 'contributing', 'workflows', 'research'];

function getAudience(frontmatter, relativePath) {
  if (frontmatter.audience) { return frontmatter.audience; }
  // Fall back to first directory segment
  const dir = relativePath.split('/')[0];
  return dir || 'unknown';
}

export async function getAIManifestData() {
  const allDocs = import.meta.glob(
    ['../../../ai/**/*.md', '!../../../ai/workspace/**/*.md'],
    { query: '?raw', eager: true },
  );
  const rootDir = process.cwd().replace('/docs', '');

  const pages = Object.entries(allDocs).map(([filePath, module]) => {
    const content = module.default;
    const { data: frontmatter } = matter(content);

    const match = filePath.match(/ai\/(.+)\.md$/);
    const relativePath = match ? match[1] : filePath;
    const audience = getAudience(frontmatter, relativePath);

    const urlPath = `/content/ai/${relativePath}.md`;
    const tokens = Math.ceil(content.length / 4);

    let lastModified = null;
    try {
      const fsPath = resolve(rootDir, `ai/${relativePath}.md`);
      lastModified = statSync(fsPath).mtime.toISOString();
    }
    catch {
      // File stat failed, leave as null
    }

    return {
      path: urlPath,
      title: frontmatter.title || relativePath.split('/').pop(),
      description: frontmatter.description || '',
      keywords: frontmatter.keywords || [],
      audience,
      tokens,
      lastModified,
      ...(frontmatter.skill && { skill: frontmatter.skill }),
    };
  });

  // Sort by audience order, then by title
  pages.sort((a, b) => {
    const aIdx = AUDIENCE_ORDER.indexOf(a.audience);
    const bIdx = AUDIENCE_ORDER.indexOf(b.audience);
    const aOrder = aIdx === -1 ? AUDIENCE_ORDER.length : aIdx;
    const bOrder = bIdx === -1 ? AUDIENCE_ORDER.length : bIdx;
    if (aOrder !== bOrder) {
      return aOrder - bOrder;
    }
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
    pages: pages.map(({ path, title, audience, tokens, skill }) => ({
      path,
      title,
      audience,
      tokens,
      ...(skill && { skill }),
    })),
  };
}
