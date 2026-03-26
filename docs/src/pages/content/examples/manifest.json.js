import { buildFullManifest, getExamplesManifestData } from '@helpers/examples-manifest.js';

export async function GET() {
  const examples = await getExamplesManifestData();
  const manifest = buildFullManifest(examples);

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
