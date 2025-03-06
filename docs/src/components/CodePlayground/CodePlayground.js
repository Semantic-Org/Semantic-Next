import { defineComponent } from '@semantic-ui/component';
import { firstMatch, isFunction, get, each, moveToFront, inArray, sortBy } from '@semantic-ui/utils';

import { CodePlaygroundPanel } from './CodePlaygroundPanel.js';
import { CodePlaygroundFile } from './CodePlaygroundFile.js';
import { CodePlaygroundPreview } from './CodePlaygroundPreview.js';

import '@semantic-ui/core/src/components/button';

import '../Panels/Panels.js';
import '../Panels/Panel.js';

import template from './CodePlayground.html?raw';
import css from './CodePlayground.css?raw';

import { addSearch } from './lib/codemirror-search.js';
import { addSimpleMode } from './lib/codemirror-simple.js';
import { defineSyntax } from './lib/codemirror-syntax.js';

import 'playground-elements/playground-project.js';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';

const defaultSettings = {

  // an object containing the files for the project
  files: {},

  // use for security
  sandboxURL: '/sandbox',

  // a link to example that should appear in topbar
  exampleURL: '',

  // whether a file marked as generated (needed to execute code) should appear to user
  includeGeneratedInline: false,

  // the initial selected file
  selectedFile: '',

  // whether to use tabs or panels
  useTabs: true,

  // allow swapping between tabs and panels
  allowLayoutSwap: true,

  // whether to save the panel positions
  saveState: true,

  // prefix local storage values with this
  saveID: 'sandbox',

  // title to appear on top of example
  title: '',

  // description to appear on top of example
  description: '',

  // tip to appear below title and descripton
  tip: '',

  // tab size for code
  tabSize: 2,

  // whether code example is inline in the page
  inline: false,

  // direction of code when inline
  inlineDirection: 'horizontal',

  // max height when using inline
  maxHeight: 'natural',

  // whether to use ts under the hood for autocompletion
  // but show js to users in menu bar
  hideTypescriptExtensions: false,

  // order of code
  sortOrder: [
    'index.js',
    'index.ts',
    'component.js',
    'component.ts',
    'component.html',
    'component.css',
    'page.html',
    'page.css',
    'page.js',
    'page.ts',
  ],

  // types to use
  scriptTypes: {
    'text/css': 'sample/css',
    'text/importmap': 'sample/importmap',
    'text/html': 'sample/html',
    'text/javascript': 'sample/ts',
  },

  // titles to appear to users
  fileTitles: {
    'component.js': 'component.js',
    'component.ts': 'component.js',
    'index.js': 'index.js',
    'index.ts': 'index.js',
    'component.html': 'component.html',
    'component.css': 'component.css',
    'page.html': 'page.html',
    'page.css': 'page.css',
    'page.js': 'page.js',
    'page.ts': 'page.js',

  },

  // which panel should code appear in 0 is left and 1 is right
  panelIndexes: {
    'component.ts': 0,
    'component.js': 0,
    'index.ts': 0,
    'index.js': 0,
    'component.html': 0,
    'component.css': 0,
    'page.html': 1,
    'page.css': 1,
    'page.ts': 1,
    'page.js': 1,
  },

  // how to split up code in panel view
  panelSizes: {
    'component.ts': 'grow',
    'component.js': 'grow',
    'index.ts': 'grow',
    'index.js': 'grow',
    'component.html': 'grow',
    'component.css': 'grow',
    'page.html': (1 / 9 * 100),
    'page.css': (1 / 9 * 100),
    'page.ts': (1 / 9 * 100),
    'page.js': (1 / 9 * 100),
  },

  // additional files which should be considered page files
  // for purpose of separate menus
  additionalPageFiles: [],

  // default left right panel width
  panelGroupWidth: [50, 50]
};

const defaultState = {
  // which file is currently visible in tab component view
  activeFile: undefined,

  activePageFile: undefined,

  // current view in mobile code/preview
  mobileView: 'code',

  // currently resizing
  resizing: true,

  // current display mode
  displayMode: 'desktop',

  // whether to use panels or tabs
  layout: 'tabs',
};

const createComponent = ({afterFlush, self, isServer, reaction, state, data, settings, $, $$}) => ({

  mobileMenu: [
    { label: 'Code', value: 'code' },
    { label: 'Preview', value: 'preview' },
  ],

  initialize() {
    // select first file for left tabs
    const initialFile = self.getFirstFile({
      selectedFile: settings.selectedFile,
      filter: 'main'
    });
    state.activeFile.set(initialFile);

    // select first file for right tabs
    const initialPageFile = self.getFirstFile({
      selectedFile: settings.selectedFile,
      filter: 'page'
    });
    state.activePageFile.set(initialPageFile);

    // only allow layout swap on pages that panels would work
    if(settings.allowLayoutSwap) {
      settings.useTabs = localStorage.getItem('codeplayground-tabs') !== 'no';
    }

    // adjust layout when details of components change
    reaction(self.calculateLayout);
  },

  addPanelSettings() {
    $('ui-panel').settings({
      getNaturalSize: self.getNaturalPanelSize
    });
  },

  calculateLayout() {
    let layout = settings.useTabs
      ? 'tabs'
      : 'panels'
    ;
    // force tabs for small screens or inline examples
    const displayMode = state.displayMode.get();
    if(inArray(displayMode, ['tablet', 'mobile']) || settings.inline) {
      layout = 'tabs';
    }
    self.setLayout(layout);
  },

  getLayout() {
    return state.layout.get();
  },
  setLayout(layout) {
    state.layout.set(layout);
  },

  getClassMap() {
    const classMap = {
      inline: settings.inline,
      resizing: state.resizing.get(),
    };
    const mobileView = state.mobileView.get();
    const displayMode = state.displayMode.get();
    if(displayMode == 'mobile') {
      classMap[`mobile-${mobileView}`] = true;
    }
    return classMap;
  },
  getStyle() {
    if(settings.maxHeight > 0) {
      return `height: ${settings.maxHeight}px;`;
    }
  },

  canShowButtons() {
    return !settings.inline && state.displayMode.get() !== 'mobile';
  },

  canShowPageFiles() {
    let pageFiles = self.getFileArray({ filter: 'page' });
    if(pageFiles.length == 0) {
      return false;
    }
    if(pageFiles.every(file => file.generated)) {
      return false;
    }
    if(self.shouldCombineMenus()) {
      return false;
    }
    return true;
  },

  getNaturalPanelSize(panel, { direction, minimized }) {
    const extraSpacing = 2; // rounding
    if(direction == 'horizontal') {
      const scrollbarWidth = $$(panel).find('.CodeMirror-vscrollbar').width() ? 17 : 0;
      const minWidths = [200];
      $$(panel).find('.CodeMirror-sizer').each(sizer => {
        const sizerMargin = parseFloat($(sizer).css('margin-left'));
        const sizerWidth = parseFloat($(sizer).css('min-width'));
        minWidths.push(sizerMargin + sizerWidth + scrollbarWidth);
      });
      const size = Math.max(...minWidths) + extraSpacing;
      return size;
    }
    else {
      const labelHeight = $$(panel).find('.label').first().height() || 0;
      const menuHeight = $$(panel).find('.menu').first().height() || 0;
      if(minimized) {
        return labelHeight;
      }
      else {
        let height;
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
    const classes = {
      inline: settings.inline,
      tabs: state.layout.get() == 'tabs'
    };
    // defer to preference unless its tablet
    if(state.displayMode.value == 'tablet') {
      classes.vertical = true;
    }
    else {
      classes[settings.inlineDirection] = true;
    }
    return classes;
  },
  getTabDirection() {
    if(state.displayMode.value == 'tablet') {
      return 'vertical';
    }
    if(settings.inline) {
      return settings.inlineDirection;
    }
    return 'horizontal';
  },
  shouldCombineMenus() {
    return settings.inline || self.getTabDirection() === 'vertical' || state.displayMode.value == 'mobile';
  },
  getFileArray({filter} = {}) {
    let files = [];
    const isPageFile = (filename) => {
      return (filename.startsWith('page') || inArray(filename, settings.additionalPageFiles));
    };
    each(settings.files, (file, filename) => {
      const fileData = self.getFile(file, filename);
      if(!self.shouldCombineMenus()) {
        // only have left/right menus when its horizontally stacked
        if(filter == 'main' && isPageFile(fileData?.filename)) {
          return;
        }
        if(filter == 'page' && !isPageFile(fileData?.filename)) {
          return;
        }
      }
      files.push(fileData);
    });
    return sortBy(files, 'sortIndex');
  },
  getFile(file, filename) {
    return {
      _id: filename,
      filename,
      ...file,
      scriptType: self.getScriptType(file.contentType),
      panelIndex: self.getPanelIndex(filename),
      sortIndex: self.getSort(filename),
      label: self.getFileLabel(filename)
    };
  },
  getPanelIndex(filename) {
    return get(settings.panelIndexes, filename);
  },
  getSort(filename) {
    const index = settings.sortOrder.indexOf(filename);
    return (index == -1) ? Infinity : index;
  },
  getFileLabel(filename) {
    return get(settings.fileTitles, filename);
  },
  getPanelGroupWidth(index) {
    return settings.panelGroupWidth[index];
  },
  canShowMenu() {
    if(settings.inline && self.getFileMenuItems().length <= 1) {
      return false;
    }
    return true;
  },
  getFileMenuItems({ filter } = {}) {
    let menu = self.getFileArray({filter}).map(file => {
      if(!settings.includeGeneratedInline && file?.generated) {
        return;
      }
      const label = (settings.hideTypescriptExtensions)
        ? file.filename.replace('ts', 'js')
        : file.filename
      ;
      return {
        label: label,
        value: file.filename,
      };
    }).filter(({value} = {}) => {
      return Boolean(value);
    });
    if(settings.selectedFile) {
      menu = moveToFront(menu, file => file.value == settings.selectedFile);
    }
    return menu;
  },
  getFirstFile({ selectedFile = '', filter } = {}) {
    const files = self.getFileArray({ filter });
    const matchingFile = firstMatch(files, file => (file.filename == selectedFile));
    if(matchingFile) {
      return matchingFile?.filename;
    }
    return firstMatch(files, file => !file.hidden)?.filename;
  },
  getFirstPageFile() {

  },
  getSaveID(group, index) {
    return [settings.saveID, group, index].filter(val => val !== undefined).join('-');
  },
  getPanels() {
    let panels = [[], []];
    let files = self.getFileArray().filter(file => !file.hidden);
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
    const newLayout = (state.layout.get() == 'tabs')
      ? 'panels'
      : 'tabs'
    ;
    state.layout.set(newLayout);
    afterFlush(() => {
      self.addPanelSettings();
    });
    // store preference
    const storedValue = newLayout == 'tabs' ? 'yes' : 'no';
    localStorage.setItem('codeplayground-tabs', storedValue);
  },

  selectFile(number) {
    const menu = $('ui-menu.component').component();
    if(menu) {
      menu.selectIndex(number - 1);
    }
  },
  selectFilename(filename) {
    if(state.layout.get() == 'tabs') {
      const menu = self.getFileMenuItems();
      each(menu, (item, index) => {
        if(item.value == filename) {
          self.selectFile(index + 1);
          return false;
        }
      });
    }
    else {
      $$(`playground-file-editor[filename="${filename}"]`)
        .find('playground-code-editor')
        .focus();
    }
  },

  setDisplayMode() {
    const width = $('window').width();
    let displayMode = 'computer';
    if(width < 1200) {
      displayMode = 'tablet';
    }
    if(width < 768) {
      displayMode = 'mobile';
    }
    state.displayMode.set(displayMode);
  },

  setupComponents() {
    const doCallback = (callback) => {
      return isFunction(window.requestIdleCallback)
        ? requestIdleCallback(callback)
        : setTimeout(callback, 1)
      ;
    };
    doCallback(() => {
      state.resizing.set(false);
      self.addPanelSettings();
    });
  },

  setNaturalHeight() {
    if(isServer) {
      return;
    }
    const codeHeight = $$('.CodeMirror-sizer').first().height();
    const menuHeight = $$('ui-panel .menu').first().height() || 0;
    const offset = 5; // from trial & error avoids tiny scrollbars
    let panelHeight = menuHeight + codeHeight + offset;
    panelHeight = Math.min(panelHeight, 600);
    panelHeight = Math.max(panelHeight, 30);
    $('ui-panels').first().css('height', `${panelHeight}px`);
  }

});

const onCreated = ({self, attachEvent}) => {
  self.setDisplayMode();
};

const onRendered = ({ isClient, self, state, $, settings }) => {
  // external mods to codemirror
  addSearch(CodeMirror);
  addSimpleMode(CodeMirror);
  defineSyntax(CodeMirror);

  self.addPanelSettings();
  self.setupComponents();

  if(settings.inline && settings.maxHeight == 'natural') {
    self.setNaturalHeight();
  }
};

const onThemeChanged = ({self}) => {
  self.reloadPreview();
};

const keys = {
  // select file with keyboard
  'ctrl + 1': ({self}) => self.selectFile(1),
  'ctrl + 2': ({self}) => self.selectFile(2),
  'ctrl + 3': ({self}) => self.selectFile(3),
  'ctrl + 4': ({self}) => self.selectFile(4),
  'ctrl + 5': ({self}) => self.selectFile(5),
  'ctrl + 6': ({self}) => self.selectFile(6),
  'ctrl + 7': ({self}) => self.selectFile(7),
  'ctrl + 8': ({self}) => self.selectFile(8),
  'ctrl + 9': ({self}) => self.selectFile(9),
};

const events = {
  'global resize window'({self, state}) {
    requestAnimationFrame(self.setDisplayMode);
  },
  'change ui-menu.component.files'({state, data}) {
    state.activeFile.set(data.value);
  },
  'change ui-menu.page.files'({state, data}) {
    state.activePageFile.set(data.value);
  },
  'change ui-menu.mobile'({state, data}) {
    state.mobileView.set(data.value);
  },
  'click ui-button.tabs'({self}) {
    self.toggleTabs();
  },
  'resizeStart ui-panel'({state}) {
    state.resizing.set(true);
  },
  'resizeEnd ui-panel'({state}) {
    state.resizing.set(false);
  },
};

const CodePlayground = defineComponent({
  tagName: 'code-playground',
  delegatesFocus: true,
  template,
  css,
  createComponent,
  defaultSettings,
  onCreated,
  onRendered,
  events,
  defaultState,
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
