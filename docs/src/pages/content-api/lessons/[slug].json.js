import { getCollection } from 'astro:content';
import {
  getLessonContent,
  getPreviousLesson,
  getNextLesson,
} from '@helpers/navigation.js';

export async function getStaticPaths() {
  const lessons = await getCollection('lessons');

  return lessons.map(lessonDoc => {
    const lesson = getLessonContent(lessonDoc);
    return {
      params: { slug: lesson.id },
      props: {
        lesson,
        previousLesson: getPreviousLesson(lesson),
        nextLesson: getNextLesson(lesson),
      }
    };
  });
}

export function GET({ props }) {
  return new Response(JSON.stringify(props), {
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
