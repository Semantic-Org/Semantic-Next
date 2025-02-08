import { getCollection } from 'astro:content';
import {
  getLessonContent,
  getPreviousLesson,
  getNextLesson,
} from '@helpers/navigation.js';
import { asyncMap, each, mapObject } from '@semantic-ui/utils';
import { getExampleFiles, getExampleID } from '@helpers/playground.js';

const allExampleFiles = await import.meta.glob(`../../../examples/**`, {
  query: '?raw',
});
const examples = await getCollection('examples');

export async function GET(settings) {
  let text = '';
  const removeComments = (text) => {
    text = text.replaceAll('<!-- playground-hide -->   ', '');
    text = text.replaceAll('<!-- playground-hide -->', '');
    text = text.replaceAll('<!-- playground-hide -->   ', '');
    text = text.replaceAll('<!-- playground-hide-end -->', '');
    text = text.replaceAll(`<script>  function dispatchCustomEvent(eventName) {    const event = new CustomEvent(eventName, { bubbles: true, cancelable: true, composed: true });    window.frameElement.dispatchEvent(event);  }  window.addEventListener('focus', function() {    dispatchCustomEvent('iframefocus');  }, true);  window.addEventListener('blur', function() {    dispatchCustomEvent('iframeblur');  }, true);  document.addEventListener('touchstart', function(){});</script>`, '');
    return text;
  }
  await asyncMap(examples, async (example) => {
    let files = await getExampleFiles({
      contentID: getExampleID(example),
      allFiles: allExampleFiles,
      basePath: '../../../examples',
      includeFolder: example.exampleType == 'folder',
      hideBoilerplate: false,
      includePlaygroundInjections: true,
      includeLog: false,
      includeImportMap: false,
      emptyIfAllGenerated: true,
    });

    text += `
## ${example.data.title}
${example.data.description}
    `
    each(files, (file, filename) => {
      if(file.generated || file.content == '') {
        return
      }
      const type = filename.split('.')[1];
      text += `
\`\`\`${type} title="${filename}"
${removeComments(file.content)}
\`\`\``;
    });
  });
  return new Response(text, {
    headers: {
      'Content-Type': 'text/plain'
    }
  });
}
