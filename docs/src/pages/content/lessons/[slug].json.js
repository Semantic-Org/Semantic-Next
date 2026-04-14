import { getLessonContent, getNextLesson, getPreviousLesson } from '@helpers/navigation.js';
import { getExampleFiles, getPanelIndexes } from '@helpers/playground.js';
import { getFolder } from '@helpers/loading.js';
import { asyncEach, isEmpty } from '@semantic-ui/utils';
import { getCollection } from 'astro:content';
import { markdown } from '@astropub/md';

const lessons = await getCollection('lessons');
const lessonDocsById = new Map(lessons.map((doc) => [doc.id, doc]));

export async function getStaticPaths() {
  return lessons.map((lessonDoc) => {
    const lesson = getLessonContent(lessonDoc);
    return {
      params: { slug: lesson.id },
      props: {
        lesson,
        previousLesson: getPreviousLesson(lesson),
        nextLesson: getNextLesson(lesson),
      },
    };
  });
}

// Read file contents per-request so dev HMR sees edits.
const loadFiles = async (lessonId, subFolderCandidates) => {
  const allLessonFiles = await getFolder(lessonId, '../../../content/lessons/');
  let files;
  let panelIndexes;
  await asyncEach(subFolderCandidates, async (folder) => {
    files = await getExampleFiles({
      contentID: lessonId,
      allFiles: allLessonFiles,
      basePath: '../../../content/lessons/',
      subFolder: folder,
      includeFolder: true,
      hideBoilerplate: false,
      includePlaygroundInjections: true,
      includeLog: false,
      emptyIfAllGenerated: true,
    });
    if (isEmpty(files)) { return true; }
    panelIndexes = getPanelIndexes(files);
    return false;
  });
  return { files, panelIndexes };
};

export async function GET({ props }) {
  const { lesson, previousLesson, nextLesson } = props;
  const lessonDoc = lessonDocsById.get(lesson.id);

  const { files } = await loadFiles(lesson.id, ['problem', 'example']);

  const solutionResult = await loadFiles(lesson.id, ['solution']);
  const solutionFiles = solutionResult.files;

  const lessonHTML = `<pageContent>${await markdown.inline(lessonDoc.body)}</pageContent>`;

  return new Response(JSON.stringify({
    lesson,
    lessonHTML,
    files,
    solutionFiles,
    previousLesson,
    nextLesson,
  }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
