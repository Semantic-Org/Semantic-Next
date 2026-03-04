import { getExampleFiles, getExampleID } from '@helpers/playground.js';
import { asyncMap, each } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';
import { execSync } from 'child_process';
import matter from 'gray-matter';

export async function GET() {
  // ========== AI CONTEXT ==========
  const allAiDocs = import.meta.glob(
    ['../../../../ai/**/*.md', '!../../../../ai/workspace/**/*.md'],
    { query: '?raw', eager: true },
  );

  const aiPages = Object.entries(allAiDocs).map(([filePath, module]) => {
    const content = module.default;
    const { data: frontmatter } = matter(content);
    const match = filePath.match(/ai\/(.+)\.md$/);
    const relativePath = match ? match[1] : filePath;
    const audience = frontmatter.audience || relativePath.split('/')[0];

    return {
      path: `/content/ai/${relativePath}.md`,
      title: frontmatter.title || relativePath.split('/').pop(),
      description: frontmatter.description || '',
      audience,
      tokens: Math.ceil(content.length / 4),
    };
  });

  // ========== USER DOCS ==========
  const allUserDocs = import.meta.glob('../docs/**/*.mdx', { query: '?raw', eager: true });

  const userPages = Object.entries(allUserDocs).map(([filePath, module]) => {
    const content = module.default;
    const { data: frontmatter } = matter(content);
    const relativePath = filePath.replace('../docs/', '');
    const urlPath = '/docs/' + relativePath.replace('.mdx', '');

    return {
      path: `/content/docs/${relativePath.replace('.mdx', '.md')}`,
      title: frontmatter.title || '',
      description: frontmatter.description || '',
      tokens: Math.ceil(content.length / 4),
    };
  });

  // ========== EXAMPLES ==========
  const allExampleFiles = await import.meta.glob('../../examples/**', { query: '?raw' });
  const examples = await getCollection('examples', ({ data }) => !data.hidden);

  const exampleItems = await asyncMap(examples, async (example) => {
    const contentID = getExampleID(example);
    const files = await getExampleFiles({
      contentID,
      allFiles: allExampleFiles,
      basePath: '../../examples',
      includeFolder: example.exampleType == 'folder',
      hideBoilerplate: false,
      includePlaygroundInjections: false,
      includeLog: false,
      includeImportMap: false,
    });

    let tokens = 0;
    each(files, (file) => {
      if (!file.generated && file.content) {
        tokens += Math.ceil(file.content.length / 4);
      }
    });

    const slug = example.slug.replace('mdx', '');

    return {
      path: `/content/examples/${slug}.json`,
      title: example.data.title || '',
      description: example.data.description || '',
      category: example.data.category || '',
      tokens,
    };
  });

  // ========== SPECS ==========
  const allSpecs = import.meta.glob('../../../../src/primitives/**/specs/*.spec.json', { eager: true });

  const specItems = Object.entries(allSpecs).map(([path, module]) => {
    const spec = module.default;
    const match = path.match(/\/([^/]+)\.spec\.json$/);
    const slug = match ? match[1] : path;
    const specString = JSON.stringify(spec);

    return {
      path: `/content/specs/${slug}.json`,
      name: spec.name || slug,
      tagName: spec.tagName || '',
      description: spec.description || '',
      tokens: Math.ceil(specString.length / 4),
    };
  });

  // ========== COMBINED MANIFEST ==========
  const manifest = {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    summary: {
      ai: { count: aiPages.length, tokens: aiPages.reduce((s, p) => s + p.tokens, 0) },
      docs: { count: userPages.length, tokens: userPages.reduce((s, p) => s + p.tokens, 0) },
      examples: { count: exampleItems.length, tokens: exampleItems.reduce((s, p) => s + p.tokens, 0) },
      specs: { count: specItems.length, tokens: specItems.reduce((s, p) => s + p.tokens, 0) },
    },
    totalTokens: aiPages.reduce((s, p) => s + p.tokens, 0)
      + userPages.reduce((s, p) => s + p.tokens, 0)
      + exampleItems.reduce((s, p) => s + p.tokens, 0)
      + specItems.reduce((s, p) => s + p.tokens, 0),
    ai: aiPages,
    docs: userPages,
    examples: exampleItems,
    specs: specItems,
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
