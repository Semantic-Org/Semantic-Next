import { getExampleFiles, getExampleID } from '@helpers/playground.js';
import { getFolder } from '@helpers/loading.js';
import { asyncMap, each, mapObject } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';

const examples = await getCollection('examples', ({ data }) => !data.hidden);

export async function getStaticPaths() {
  const paths = examples.map((example) => ({
    params: { slug: example.id.replace('mdx', '') },
    props: { exampleData: example.data, exampleId: example.id, isAll: false },
  }));
  paths.push({ params: { slug: 'all' }, props: { isAll: true } });
  return paths;
}

// Read file contents per-request so dev HMR sees edits.
const loadFiles = async (example) => {
  const contentID = getExampleID(example);
  const allExampleFiles = await getFolder(contentID, '../../../examples/');
  let files = await getExampleFiles({
    contentID,
    allFiles: allExampleFiles,
    basePath: '../../../examples/',
    includeFolder: example.exampleType == 'folder',
    additionalFiles: example.additionalPageFiles || [],
    hideBoilerplate: false,
    includePlaygroundInjections: false,
    includeLog: example.exampleType == 'log',
    includeError: false,
    includeImportMap: false,
  });
  files = mapObject(files, (file) => (file.generated) ? '' : file.content);
  each(files, (content, name) => {
    if (content == '') { delete files[name]; }
  });
  return files;
};

export async function GET({ props }) {
  if (props.isAll) {
    const all = {};
    await asyncMap(examples, async (example) => {
      const files = await loadFiles(example.data);
      all[example.id.replace('mdx', '')] = { ...example.data, files };
    });
    return new Response(JSON.stringify(all), {
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const files = await loadFiles(props.exampleData);
  return new Response(JSON.stringify({ ...props.exampleData, files }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
