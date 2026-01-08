import { getExampleFiles, getExampleID } from '@helpers/playground.js';
import { asyncMap, each } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';

export async function GET() {
  const allExampleFiles = await import.meta.glob('../../../examples/**', {
    query: '?raw',
  });
  const examples = await getCollection('examples', ({ data }) => !data.hidden);

  const items = await asyncMap(examples, async (example) => {
    const contentID = getExampleID(example);
    const files = await getExampleFiles({
      contentID: contentID,
      allFiles: allExampleFiles,
      basePath: '../../../examples',
      includeFolder: example.exampleType == 'folder',
      hideBoilerplate: false,
      includePlaygroundInjections: false,
      includeLog: false,
      includeImportMap: false,
    });

    // Calculate total tokens from file contents
    let tokens = 0;
    const fileList = [];
    each(files, (file, filename) => {
      if (!file.generated && file.content) {
        tokens += Math.ceil(file.content.length / 4);
        fileList.push(filename);
      }
    });

    const slug = example.slug.replace('mdx', '');

    return {
      id: slug,
      path: `/examples/${slug}`,
      raw: `/content/examples/${slug}.json`,
      title: example.data.title || '',
      description: example.data.description || '',
      category: example.data.category || '',
      files: fileList,
      tokens,
    };
  });

  const manifest = {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalExamples: items.length,
    totalTokens: items.reduce((sum, e) => sum + e.tokens, 0),
    examples: items,
  };

  return new Response(JSON.stringify(manifest, null, 2), {
    headers: { 'Content-Type': 'application/json' },
  });
}
