import { createComponent } from '@semantic-ui/component';
import { firstMatch, get, each, sortBy } from '@semantic-ui/utils';

import { CodePlaygroundPanel } from './CodePlaygroundPanel.js';
import { CodePlaygroundFile } from './CodePlaygroundFile.js';
import { CodePlaygroundPreview } from './CodePlaygroundPreview.js';

import '../Panels/Panels.js';
import '../Panels/Panel.js';
import '@semantic-ui/core/src/components/button';

import template from './CodePlayground.html?raw';
import css from './CodePlayground.css?raw';

import { addSearch } from './lib/codemirror-search.js';

import 'playground-elements/playground-project.js';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';

const settings = {
  files: {},
  sandboxURL: '/sandbox',
  exampleURL: '',
  includeGeneratedInline: false,
  useTabs: localStorage.getItem('codeplayground-tabs') == 'yes' || false,
  saveState: true,
  saveID: 'sandbox',
  example: {},
  tabSize: 2,
  inline: false,
  inlineDirection: 'vertical',
  sortOrder: [
    'component.js',
    'component.html',
    'component.css',
    'index.html',
    'index.css',
    'index.js',
  ],
  scriptTypes: {
    'text/css': 'sample/css',
    'text/html': 'sample/html',
    'text/javascript': 'sample/js',
    'text/typescript': 'sample/ts',
  },
  fileTitles: {
    'component.js': 'component.js',
    'component.html': 'component.html',
    'component.css': 'component.css',
    'index.html': 'index.html',
    'index.css': 'index.css',
    'index.js': 'index.js',
  },
  panelIndexes: {
    'component.js': 0,
    'component.html': 0,
    'component.css': 0,
    'index.html': 1,
    'index.css': 1,
    'index.js': 1,
  },
  panelSizes: {
    'component.js': 'grow',
    'component.html': 'grow',
    'component.css': 'grow',
    'index.html': (1 / 9 * 100),
    'index.css': (1 / 9 * 100),
    'index.js': (1 / 9 * 100),
  },
  panelGroupWidth: [50, 50]
};

const state = {
  activeFile: undefined,
  resizing: true,
};

const createInstance = ({afterFlush, tpl, state, settings, $, $$}) => ({
  initialize() {
    state.activeFile.set(tpl.getFirstFile()?.filename);
  },
  initializePanels() {
    $('ui-panel').settings({
      getNaturalSize: tpl.getNaturalPanelSize
    });
  },
  getNaturalPanelSize(panel, { direction, minimized }) {
    if(direction == 'horizontal') {
      const scrollbarWidth = $$(panel).find('.CodeMirror-vscrollbar').width() ? 17 : 0;
      const minWidths = [200];
      $$(panel).find('.CodeMirror-sizer').each(sizer => {
        const sizerMargin = parseFloat($(sizer).css('margin-left'));
        const sizerWidth = parseFloat($(sizer).css('min-width'));
        minWidths.push(sizerMargin + sizerWidth + scrollbarWidth);
      });
      const size = Math.max(...minWidths);
      return size;
    }
    else {
      const labelHeight = $$(panel).find('.label').first().height() || 0;
      const menuHeight = $$(panel).find('.menu').first().height() || 0;
      if(minimized) {
        return labelHeight;
      }
      else {
        const extraSpacing = 5;
        const codeHeight = parseFloat($$(panel).find('.CodeMirror-sizer').first().css('min-height'));
        const size = codeHeight + labelHeight + menuHeight + extraSpacing;
        return Math.max(size, 100);
      }
    }
  },
  getScriptType(type) {
    return get(settings.scriptTypes, type);
  },
  getPanelSize(file) {
    let size = get(settings.panelSizes, file.filename);
    if(size == 'natural' && !file.content) {
      size = 'grow';
    }
    return size;
  },
  getTabPanelsClass() {
    return {
      inline: settings.inline,
      tabs: settings.useTabs
    };
  },
  getTabDirection() {
    if(settings.inline) {
      return settings.inlineDirection;
    }
    return 'horizontal';
  },
  getFileArray() {
    let files = [];
    each(settings.files, (file, filename) => {
      const fileData = tpl.getFile(file, filename);
      files.push(fileData);
    });
    return sortBy(files, 'sortIndex');
  },
  getFile(file, filename) {
    return {
      _id: filename,
      filename,
      ...file,
      scriptType: tpl.getScriptType(file.contentType),
      panelIndex: tpl.getPanelIndex(filename),
      sortIndex: tpl.getSort(filename),
      label: tpl.getFileLabel(filename)
    };
  },
  getPanelIndex(filename) {
    return get(settings.panelIndexes, filename);
  },
  getSort(filename) {
    return settings.sortOrder.indexOf(filename);
  },
  getFileLabel(filename) {
    return get(settings.fileTitles, filename);
  },
  getPanelGroupWidth(index) {
    return settings.panelGroupWidth[index];
  },
  getFileMenuItems({indexOnly = false } = {}) {
    const menu = tpl.getFileArray().map(file => {
      if(file.generated && !settings.includeGeneratedInline) {
        return false;
      }
      return {
        label: file.filename,
        value: file.filename,
      };
    }).filter(value => {
      if(indexOnly) {
        return file.filename && file.filename.includes('index');
      }
      return Boolean(value);
    });
    return menu;
  },
  getFirstFile() {
    return firstMatch(tpl.getFileArray(), file => !file.generated && !file.hidden);
  },
  getSaveID(group, index) {
    return [settings.saveID, group, index].filter(val => val !== undefined).join('-');
  },
  getPanels() {
    let panels = [[], []];
    let files = tpl.getFileArray().filter(file => !file.hidden);
    each(files, file => {
      if(file.panelIndex >= 0) {
        panels[file.panelIndex].push({
          type: 'file',
          ...file
        });
      }
    });
    panels = panels.map(pane => sortBy(pane, 'sortIndex'));
    // preview always last on second pane
    panels[1].push({
      type: 'preview',
    });
    return panels;
  },

  reloadPreview() {
    const iframe = $$('playground-preview').find('iframe').get(0);
    if(iframe) {
      iframe.contentWindow.location.reload();
    }
  },

  toggleTabs() {
    const useTabs = !settings.useTabs;
    const storedValue = useTabs ? 'yes' : 'no';
    localStorage.setItem('codeplayground-tabs', storedValue);
    settings.useTabs = useTabs;
    afterFlush(() => {
      tpl.initializePanels();
    });
  }

});

const onRendered = ({ $, $$, tpl, state, settings }) => {
  addSearch(CodeMirror);
  requestIdleCallback(() => {
    tpl.initializePanels();
    state.resizing.set(false);
  });
};

const onThemeChanged = ({tpl}) => {
  tpl.reloadPreview();
};

const keys = {
  'tab'({state, $}) {
    console.log('hi');
  }
};

const events = {
  'change ui-menu.files'({state, data}) {
    state.activeFile.set(data.value);
  },
  'click ui-button.tabs'({tpl}) {
    tpl.toggleTabs();
  },
  'resizeStart ui-panel'({state}) {
    state.resizing.set(true);
  },
  'resizeEnd ui-panel'({state}) {
    state.resizing.set(false);
  },
};

const CodePlayground = createComponent({
  tagName: 'code-playground',
  template,
  css,
  createInstance,
  settings,
  onRendered,
  events,
  state,
  keys,
  onThemeChanged,
  subTemplates: {
    CodePlaygroundPanel,
    CodePlaygroundPreview,
    CodePlaygroundFile,
  }
});

export default CodePlayground;
export { CodePlayground };
