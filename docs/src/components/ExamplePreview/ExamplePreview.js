import { defineComponent } from '@semantic-ui/component';
import { each, get } from '@semantic-ui/utils';

import css from './ExamplePreview.css?raw';
import template from './ExamplePreview.html?raw';

import 'playground-elements/playground-project.js';
import 'playground-elements/playground-preview.js';

const defaultSettings = {
  files: {},
  sandboxURL: '/sandbox',
};

const scriptTypes = {
  'text/css': 'sample/css',
  'text/importmap': 'sample/importmap',
  'text/html': 'sample/html',
  'text/javascript': 'sample/js',
};

const createComponent = ({ settings }) => ({
  getProjectFiles() {
    const files = [];
    each(settings.files, (file, filename) => {
      let content = file.content;
      // playground-elements convention: html file content is raw except
      // closing tags, which it decodes from &lt;/ when reading the script
      if (file.contentType == 'text/html') {
        content = content.replace(/<\//g, '&lt;/');
      }
      files.push({
        filename,
        content,
        scriptType: get(scriptTypes, file.contentType),
      });
    });
    return files;
  },
});

const ExamplePreview = defineComponent({
  tagName: 'example-preview',
  template,
  css,
  defaultSettings,
  createComponent,
});

export default ExamplePreview;
export { ExamplePreview };
