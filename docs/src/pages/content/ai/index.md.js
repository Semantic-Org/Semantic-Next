import { buildMarkdownManifest, getAIManifestData } from '@helpers/ai-manifest.js';

export async function GET() {
  const pages = await getAIManifestData();
  return new Response(buildMarkdownManifest(pages), {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
