import { createComponent } from '@semantic-ui/component';
import { get, each, sortBy } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';

import UIPanels from '../Panels/Panels.js';
import UIPanel from '../Panels/Panel.js';

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
  fileLabels: {
    'component.js': 'Component JS',
    'component.html': 'Component Template',
    'component.css': 'Component CSS',
    'index.html': 'Page HTML',
    'index.css': 'Page CSS',
    'index.js': 'Page JS',
  },
  paneIndex: {
    'component.js': 0,
    'component.html': 0,
    'component.css': 0,
    'index.html': 1,
    'index.css': 1,
    'index.js': 1,
  },
  sortIndex: {
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
      files.push(fileData);
    });
    return files;
  },
  getFile(file, filename) {
    return {
      _id: filename,
      filename,
      ...file,
      scriptType: tpl.getScriptType(file.contentType),
      paneIndex: tpl.getDefaultPanel(filename),
      sortIndex: tpl.getDefaultSort(filename),
      label: tpl.getFileLabel(filename)
    };
  },
  getDefaultPanel(filename) {
    return get(tpl.paneIndex, filename);
  },
  getDefaultSort(filename) {
    return get(tpl.sortIndex, filename);
  },
  getFileLabel(filename) {
    return get(tpl.fileLabels, filename);
  },
  getPanels() {
    let panels = [[], []];
    let files = tpl.getFileArray();
    each(files, file => {
      panels[file.paneIndex].push({
        type: 'file',
        ...file
      });
    });
    panels = panels.map(pane => sortBy(pane, 'sortIndex'));
    panels[1].push({
      type: 'preview',
    });
    console.log(panels);
    return panels;
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
