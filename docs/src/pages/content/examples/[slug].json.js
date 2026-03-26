import { getLessonContent, getNextLesson, getPreviousLesson } from '@helpers/navigation.js';
import { getExampleFiles, getExampleID } from '@helpers/playground.js';
import { getFolder } from '@helpers/loading.js';
import { asyncMap, each, mapObject } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';

const examples = await getCollection('examples', ({ data }) => !data.hidden);

export async function getStaticPaths() {
  const paths = await asyncMap(examples, async (example) => {
    const contentID = getExampleID(example);
    const allExampleFiles = await getFolder(contentID, '../../../examples/');
    let files = await getExampleFiles({
      contentID: contentID,
      allFiles: allExampleFiles,
      basePath: '../../../examples/',
      includeFolder: example.data.exampleType == 'folder',
      hideBoilerplate: false,
      includePlaygroundInjections: false,
      includeLog: example.data.exampleType == 'log',
      includeError: false,
      includeImportMap: false,
    });
    files = mapObject(files, file => (file.generated) ? '' : file.content);
    each(files, (content, name) => {
      if (content == '') {
        delete files[name];
      }
    });
    const path = {
      params: { slug: example.id.replace('mdx', '') },
      props: {
        ...example.data,
        files,
      },
    };
    return path;
  });

  const allProps = {};
  each(paths, (path) => {
    allProps[path.params.slug] = path.props;
  });
  paths.push({
    params: { slug: 'all' },
    props: allProps,
  });
  return paths;
}

export function GET({ props }) {
  return new Response(JSON.stringify(props), {
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
