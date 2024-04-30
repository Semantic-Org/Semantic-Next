import { createComponent } from '@semantic-ui/component';
import { get, each } from '@semantic-ui/utils';
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
  scriptTypes: {
    'text/css': 'sample/css',
    'text/html': 'sample/html',
    'text/javascript': 'sample/js',
    'text/typescript': 'sample/ts',
  },
  panelIndex: {
    'component.js': 0,
    'component.html': 0,
    'component.css': 0,
    'index.html': 1,
    'index.css': 1,
    'index.js': 1,
  },
  positionIndex: {
    'component.js': 0,
    'component.html': 1,
    'component.css': 2,
    'index.html': 0,
    'index.css': 1,
    'index.js': 2,
  },
  getScriptType(type) {
    return get(tpl.scriptTypes, type);
  },
  getFileArray() {
    let files = [];
    each(settings.files, (file, filename) => {
      const fileData = tpl.getFile(file, filename);
      console.log(fileData);
      files.push(fileData);
    });
    console.log(files);
    return files;
  },
  getFile(file, filename) {
    return {
      _id: filename,
      filename,
      ...file,
      scriptType: tpl.getScriptType(file.contentType),
      panelIndex: tpl.getPanelIndex(filename),
      positionIndex: tpl.getPositionIndex(filename),
    };
  },
  getPanelIndex(filename) {
    console.log(tpl.panelIndex, filename, get(tpl.panelIndex, filename));
    return get(tpl.panelIndex, filename);
  },
  getPositionIndex(filename) {
    return get(tpl.positionIndex, filename);
  },
  getPanes() {
    let files = tpl.getFileArray();
    let panes = [];
    return panes;
  },
});

const onCreated = ({ tpl }) => {

};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, tpl, settings }) => {
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
