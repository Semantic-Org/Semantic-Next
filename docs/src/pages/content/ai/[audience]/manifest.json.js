import { execSync } from 'child_process';
import matter from 'gray-matter';

export const prerender = true;

const audienceGlobs = {
  ui: '../../../../../../../ai/ui/**/*.md',
  framework: '../../../../../../../ai/framework/**/*.md',
  contributing: '../../../../../../../ai/contributing/**/*.md',
  research: '../../../../../../../ai/research/**/*.md',
};

export async function getStaticPaths() {
  return Object.keys(audienceGlobs).map(audience => ({
    params: { audience },
  }));
}

export async function GET({ params }) {
  const { audience } = params;

  // Dynamic glob based on audience
  let docs;
  if (audience === 'ui') {
    docs = import.meta.glob('../../../../../../ai/ui/**/*.md', { query: '?raw', eager: true });
  } else if (audience === 'framework') {
    docs = import.meta.glob('../../../../../../ai/framework/**/*.md', { query: '?raw', eager: true });
  } else if (audience === 'contributing') {
    docs = import.meta.glob('../../../../../../ai/contributing/**/*.md', { query: '?raw', eager: true });
  } else if (audience === 'research') {
    docs = import.meta.glob('../../../../../../ai/research/**/*.md', { query: '?raw', eager: true });
  } else {
    docs = {};
  }

  const pages = Object.entries(docs).map(([filePath, module]) => {
    const content = module.default;
    const { data: frontmatter } = matter(content);

    const match = filePath.match(/ai\/[^/]+\/(.+)\.md$/);
    const slug = match ? match[1] : filePath;

    const urlPath = `/content/ai/${audience}/${slug}.md`;
    const tokens = Math.ceil(content.length / 4);

    let lastModified = null;
    try {
      const gitPath = `ai/${audience}/${slug}.md`;
      lastModified = execSync(`git log -1 --format=%cI -- "${gitPath}"`, {
        encoding: 'utf-8',
        cwd: process.cwd().replace('/docs', ''),
      }).trim();
    } catch (e) {
      // Git command failed
    }

    return {
      path: urlPath,
      title: frontmatter.title || slug,
      description: frontmatter.description || '',
      keywords: frontmatter.keywords || [],
      tokens,
      lastModified,
    };
  });

  pages.sort((a, b) => a.title.localeCompare(b.title));

  const manifest = {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    audience,
    totalPages: pages.length,
    totalTokens: pages.reduce((sum, p) => sum + p.tokens, 0),
    pages,
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
