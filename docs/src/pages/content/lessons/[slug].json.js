import { getLessonContent, getNextLesson, getPreviousLesson } from '@helpers/navigation.js';
import { addPlaygroundInjections } from '@helpers/injections.js';
import { getExampleFiles, getSandboxURL, getPanelIndexes } from '@helpers/playground.js';
import { getFolder } from '@helpers/loading.js';
import { asyncMap, asyncEach, isEmpty } from '@semantic-ui/utils';
import { getCollection, render } from 'astro:content';
import { markdown } from '@astropub/md'

export async function getStaticPaths() {
  const lessons = await getCollection('lessons');

  const paths = await asyncMap(lessons, async (lessonDoc) => {
    const lesson = getLessonContent(lessonDoc);

    /* Get associated example files for this specific lesson */
    const allLessonFiles = await getFolder(lesson.id, '../../../content/lessons/');
    // can either be an example or a problem/solution set
    const fileFolders = ['problem', 'example'];
    let files;
    let panelIndexes;
    await asyncEach(fileFolders, async (folder) => {
      files = await getExampleFiles({
        contentID: lesson.id,
        allFiles: allLessonFiles,
        basePath: '../../../content/lessons/',
        subFolder: folder,
        includeFolder: true,
        hideBoilerplate: false,
        includePlaygroundInjections: true,
        includeLog: false,
        emptyIfAllGenerated: true,
      });
      if(isEmpty(files)) {
        return true;
      }
      panelIndexes = getPanelIndexes(files);
      return false;
    });

    let solutionFiles = await getExampleFiles({
      contentID: lesson.id,
      allFiles: allLessonFiles,
      basePath: '../../../content/lessons/',
      subFolder: 'solution',
      includeFolder: true,
      hideBoilerplate: false,
      includePlaygroundInjections: true,
      includeLog: false,
      emptyIfAllGenerated: true,
    });
    return {
      params: { slug: lesson.id },
      props: {
        lesson,
        lessonHTML: `<pageContent>${await markdown.inline(lessonDoc.body)}</pageContent>`,
        files,
        solutionFiles,
        previousLesson: getPreviousLesson(lesson),
        nextLesson: getNextLesson(lesson),
      },
    };
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
