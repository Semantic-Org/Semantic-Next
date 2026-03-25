import { buildMarkdownManifest, getExamplesManifestData } from '@helpers/examples-manifest.js';

export async function GET() {
  const examples = await getExamplesManifestData();
  return new Response(buildMarkdownManifest(examples), {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
