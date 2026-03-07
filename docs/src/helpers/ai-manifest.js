import { statSync } from 'fs';
import matter from 'gray-matter';
import { resolve } from 'path';

const VALID_AUDIENCES = ['usage', 'authoring', 'essentials', 'contributing', 'research'];
const AUDIENCE_ORDER = VALID_AUDIENCES;

// Folders excluded from AI context manifests
// Note: also listed as static glob negations below (Vite requires static strings)
export const EXCLUDED_AI_FOLDERS = ['workspace', 'old'];

function getAudience(frontmatter, relativePath) {
  if (frontmatter.audience) { return frontmatter.audience; }
  // Fall back to first directory segment
  const dir = relativePath.split('/')[0];
  return dir || 'unknown';
}

export async function getAIManifestData() {
  const allDocs = import.meta.glob(
    ['../../../ai/**/*.md', '!../../../ai/workspace/**/*.md', '!../../../ai/old/**/*.md'],
    { query: '?raw', eager: true },
  );
  const rootDir = process.cwd().replace('/docs', '');

  const excludePattern = new RegExp(`ai/(${EXCLUDED_AI_FOLDERS.join('|')})/`);

  const pages = Object.entries(allDocs)
    .filter(([filePath]) => !excludePattern.test(filePath))
    .map(([filePath, module]) => {
      const content = module.default;
      const { data: frontmatter } = matter(content);

      const match = filePath.match(/ai\/(.+)\.md$/);
      const relativePath = match ? match[1] : filePath;
      const audience = getAudience(frontmatter, relativePath);

      if (!VALID_AUDIENCES.includes(audience)) {
        console.warn(
          `[ai-manifest] Unknown audience "${audience}" in ai/${relativePath}.md — expected one of: ${
            VALID_AUDIENCES.join(', ')
          }`,
        );
      }

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
        ...(frontmatter.type && { contentType: frontmatter.type }),
        ...(frontmatter.workflow && { workflow: frontmatter.workflow }),
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

export function buildMarkdownManifest(pages) {
  const groups = {};
  for (const p of pages) {
    const key = p.audience || 'other';
    if (!groups[key]) { groups[key] = []; }
    groups[key].push(p);
  }
  const sections = Object.entries(groups).map(([audience, items]) => {
    const lines = items.map(p => {
      const shortPath = p.path.replace('/content/ai/', '').replace('.md', '');
      return `* ${shortPath} - ${p.title}`;
    });
    return `## ${audience}\n${lines.join('\n')}`;
  });
  return `# AI Context\n\n${pages.length} documents\n\nFetch content: /content/ai/{path}.md\n\n${
    sections.join('\n\n')
  }\n`;
}

export function buildSlimManifest(pages) {
  return {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalPages: pages.length,
    totalTokens: pages.reduce((sum, p) => sum + p.tokens, 0),
    pages: pages.map(({ path, title, description, audience, tokens, skill, contentType, workflow }) => ({
      path,
      title,
      ...(description && { description }),
      audience,
      tokens,
      ...(skill && { skill }),
      ...(contentType && { contentType }),
      ...(workflow && { workflow }),
    })),
  };
}
