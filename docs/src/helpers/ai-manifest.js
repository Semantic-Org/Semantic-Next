import { execSync } from 'child_process';
import matter from 'gray-matter';

const AUDIENCE_ORDER = ['ui', 'framework', 'contributing', 'research'];

export async function getAIManifestData() {
  // Glob from all ai/ subdirectories
  const uiDocs = import.meta.glob('../../../ai/ui/**/*.md', {
    query: '?raw',
    eager: true,
  });
  const frameworkDocs = import.meta.glob('../../../ai/framework/**/*.md', {
    query: '?raw',
    eager: true,
  });
  const contributingDocs = import.meta.glob('../../../ai/contributing/**/*.md', {
    query: '?raw',
    eager: true,
  });
  const researchDocs = import.meta.glob('../../../ai/research/**/*.md', {
    query: '?raw',
    eager: true,
  });

  const allDocs = { ...uiDocs, ...frameworkDocs, ...contributingDocs, ...researchDocs };

  const pages = Object.entries(allDocs).map(([filePath, module]) => {
    const content = module.default;
    const { data: frontmatter } = matter(content);

    // Extract audience and filename from path
    const match = filePath.match(/ai\/(ui|framework|contributing|research)\/(.+)\.md$/);
    const audience = match ? match[1] : 'unknown';
    const slug = match ? match[2] : filePath;

    const urlPath = `/content/ai/${audience}/${slug}.md`;

    // Token count (chars / 4 rough estimate)
    const tokens = Math.ceil(content.length / 4);

    // Last modified from git
    let lastModified = null;
    try {
      const gitPath = `ai/${audience}/${slug}.md`;
      lastModified = execSync(`git log -1 --format=%cI -- "${gitPath}"`, {
        encoding: 'utf-8',
        cwd: process.cwd().replace('/docs', ''),
      }).trim();
    }
    catch (e) {
      // Git command failed, leave as null
    }

    return {
      path: urlPath,
      title: frontmatter.title || slug,
      description: frontmatter.description || '',
      keywords: frontmatter.keywords || [],
      audience,
      tokens,
      lastModified,
    };
  });

  // Sort by audience order, then by title
  pages.sort((a, b) => {
    const aOrder = AUDIENCE_ORDER.indexOf(a.audience);
    const bOrder = AUDIENCE_ORDER.indexOf(b.audience);
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
    pages: pages.map(({ path, title, audience, tokens }) => ({
      path,
      title,
      audience,
      tokens,
    })),
  };
}
