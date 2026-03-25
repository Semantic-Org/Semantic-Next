import { buildMarkdownManifest, getDocsManifestData } from '@helpers/docs-manifest.js';

export async function GET() {
  const pages = await getDocsManifestData();
  return new Response(buildMarkdownManifest(pages), {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
