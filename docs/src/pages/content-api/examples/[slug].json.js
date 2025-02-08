import { getCollection } from 'astro:content';
import {
  getLessonContent,
  getPreviousLesson,
  getNextLesson,
} from '@helpers/navigation.js';
import { asyncMap, each, mapObject } from '@semantic-ui/utils';
import { getExampleFiles, getExampleID } from '@helpers/playground.js';

const examples = await getCollection('examples');
const allExampleFiles = await import.meta.glob(`../../../examples/**`, {
  query: '?raw',
});

export async function getStaticPaths() {
  const paths = await asyncMap(examples, async (example) => {
    let files = await getExampleFiles({
      contentID: getExampleID(example),
      allFiles: allExampleFiles,
      basePath: '../../../examples/',
      includeFolder: example.exampleType == 'folder',
      hideBoilerplate: false,
      includePlaygroundInjections: true,
      includeLog: false,
      includeImportMap: false,
    });
    files = mapObject(files, file => (file.generated) ? '' : file.content);
    each(files, (content, name) => {
      if(content == '') {
        delete files[name];
      }
    });
    const path = {
      params: { slug: example.slug.replace('mdx', '') },
      props: {
        ...example.data,
        files,
      }
    };
    return path;
  });

  const allProps = {};
  each(paths, (path) => {
    allProps[path.params.slug] = path.props;
  });

  paths.push({
    params: { slug: 'all'},
    props: allProps
  });
  return paths;
}

export function GET({ props }) {
  return new Response(JSON.stringify(props), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
