import { createComponent } from '@semantic-ui/component';
import { get } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './CodePlayground.html?raw';
import css from './CodePlayground.css?raw';

import 'playground-elements/playground-project.js';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';

const settings = {
  files: {},
  sandboxURL: '/sandbox'
};

const createInstance = ({tpl, settings, $}) => ({
  getFileType(type) {
    const types = {
      'text/css': 'sample/css',
      'text/html': 'sample/html',
      'text/javascript': 'sample/js',
      'text/typescript': 'sample/ts',
    };
    console.log(type, get(types, type));
    return get(types, type);
  }
});

const onCreated = ({ tpl }) => {

};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, tpl, settings }) => {
  console.log(settings);
};

const events = {
};

const CodePlayground = createComponent({
  tagName: 'code-playground',
  template,
  css,
  createInstance,
  settings,
  onCreated,
  onDestroyed,
  onRendered,
  events,
});

export default CodePlayground;
export { CodePlayground };
