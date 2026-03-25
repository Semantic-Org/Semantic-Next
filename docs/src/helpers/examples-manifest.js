import { getExampleFiles, getExampleID } from '@helpers/playground.js';
import { asyncMap, each } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';

export async function getExamplesManifestData() {
  const allExampleFiles = await import.meta.glob('../examples/**', {
    query: '?raw',
  });
  const examples = await getCollection('examples', ({ data }) => !data.hidden);

  const items = await asyncMap(examples, async (example) => {
    const contentID = getExampleID(example);
    const files = await getExampleFiles({
      contentID: contentID,
      allFiles: allExampleFiles,
      basePath: '../examples',
      includeFolder: example.exampleType == 'folder',
      hideBoilerplate: false,
      includePlaygroundInjections: false,
      includeLog: false,
      includeImportMap: false,
    });

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
      path: `/content/examples/${slug}.json`,
      url: `/examples/${slug}`,
      title: example.data.title || '',
      description: example.data.description || '',
      category: example.data.category || '',
      files: fileList,
      tokens,
    };
  });

  return items;
}

export function buildFullManifest(examples) {
  return {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalExamples: examples.length,
    totalTokens: examples.reduce((sum, e) => sum + e.tokens, 0),
    examples,
  };
}

export function buildSlimManifest(examples) {
  return {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalExamples: examples.length,
    totalTokens: examples.reduce((sum, e) => sum + e.tokens, 0),
    examples: examples.map(({ id, path, title, tokens, category }) => ({
      id,
      path,
      title,
      tokens,
      ...(category && { category }),
    })),
  };
}
