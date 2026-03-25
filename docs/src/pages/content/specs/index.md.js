import { buildMarkdownManifest, getSpecsManifestData } from '@helpers/specs-manifest.js';

export async function GET() {
  const specs = await getSpecsManifestData();
  return new Response(buildMarkdownManifest(specs), {
    headers: { 'Content-Type': 'text/markdown' },
  });
}
