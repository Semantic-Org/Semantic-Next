import { buildFullManifest, getAIManifestData } from '@helpers/ai-manifest.js';

export async function GET() {
  const pages = await getAIManifestData();
  const manifest = buildFullManifest(pages);

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
