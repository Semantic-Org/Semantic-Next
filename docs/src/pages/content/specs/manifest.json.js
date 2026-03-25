import { buildFullManifest, getSpecsManifestData } from '@helpers/specs-manifest.js';

export async function GET() {
  const specs = await getSpecsManifestData();
  const manifest = buildFullManifest(specs);

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
