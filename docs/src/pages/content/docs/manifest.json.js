import { execSync } from 'child_process';
import matter from 'gray-matter';

export async function GET() {
  const allDocs = import.meta.glob('../../docs/**/*.mdx', {
    query: '?raw',
    eager: true,
  });

  const pages = Object.entries(allDocs).map(([filePath, module]) => {
    const content = module.default;
    const { data: frontmatter } = matter(content);

    // Path transformations
    const relativePath = filePath.replace('../../docs/', '');
    const urlPath = '/docs/' + relativePath.replace('.mdx', '');
    const rawPath = '/content/docs/' + relativePath.replace('.mdx', '.md');

    // Token count (chars / 4 rough estimate)
    const tokens = Math.ceil(content.length / 4);

    // Last modified from git
    let lastModified = null;
    try {
      const gitPath = `docs/src/pages/docs/${relativePath}`;
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
      raw: rawPath,
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      keywords: frontmatter.keywords || [],
      tokens,
      lastModified,
    };
  });

  const manifest = {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalPages: pages.length,
    totalTokens: pages.reduce((sum, p) => sum + p.tokens, 0),
    pages,
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
