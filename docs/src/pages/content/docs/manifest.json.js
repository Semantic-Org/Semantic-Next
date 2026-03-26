import { buildFullManifest, getDocsManifestData } from '@helpers/docs-manifest.js';

export async function GET() {
  const pages = await getDocsManifestData();
  const manifest = buildFullManifest(pages);

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
