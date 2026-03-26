import { getAIManifestData } from '@helpers/ai-manifest.js';

export async function getStaticPaths() {
  const pages = await getAIManifestData();
  const audiences = [...new Set(pages.map(p => p.audience))];
  return audiences.map(audience => ({ params: { audience } }));
}

export async function GET({ params }) {
  const pages = await getAIManifestData();
  const filtered = pages.filter(p => p.audience === params.audience);

  const lines = filtered.map(p => {
    const shortPath = p.path.replace('/content/ai/', '').replace('.md', '');
    return `* ${shortPath} - ${p.title}`;
  });

  const md = `# AI Context: ${params.audience}\n\n${filtered.length} documents\n\nFetch content: /content/ai/{path}.md\n\n${lines.join('\n')}\n`;

  return new Response(md, {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
