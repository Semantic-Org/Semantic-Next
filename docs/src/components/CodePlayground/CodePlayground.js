import { createComponent } from '@semantic-ui/component';
import { } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';

import template from './CodePlayground.html?raw';
import css from './CodePlayground.css?raw';

import 'playground-elements/playground-project.js';
import 'playground-elements/playground-typescript-worker.js?worker';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';

const settings = {
  config: {},
  sandboxURL: '/sandbox'
};

const createInstance = ({tpl, settings, $}) => ({

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
