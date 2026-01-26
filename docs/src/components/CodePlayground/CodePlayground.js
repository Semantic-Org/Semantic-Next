import { defineComponent } from '@semantic-ui/component';
import { each, firstMatch, get, idleCallback, inArray, moveToFront, sortBy } from '@semantic-ui/utils';

import { CodePlaygroundFile } from './CodePlaygroundFile.js';
import { CodePlaygroundPanel } from './CodePlaygroundPanel.js';
import { CodePlaygroundPreview } from './CodePlaygroundPreview.js';

import '@semantic-ui/core/button';

import { Panel, Panels } from '@semantic-ui/core';

import css from './CodePlayground.css?raw';
import template from './CodePlayground.html?raw';

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

  // text to use for preview tab
  previewText: 'Preview',

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
    'text/javascript': 'sample/js',
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
  panelGroupWidth: [50, 50],
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
  displayMode: 'computer',

  // whether to use panels or tabs
  layout: 'tabs',

  currentFiles: [],

  projectFiles: [],
};

const createComponent = (
  { afterFlush, self, findChildren, isServer, reaction, nonreactive, state, data, settings, $, $$ },
) => ({
  mobileMenu: [
    { label: 'Code', value: 'code' },
    { label: settings.previewText, value: 'preview' },
  ],

  initialize() {
    self.setFiles(settings.files);

    // only allow layout swap on pages that panels would work
    if (settings.allowLayoutSwap) {
      settings.useTabs = localStorage.getItem('codeplayground-tabs') !== 'no';
    }

    // adjust layout when details of components change
    reaction(self.calculateLayout);
    reaction(self.calculateLayoutChange);
  },

  setFiles(files) {
    // project files tracks changes in files setting
    state.projectFiles.set(files);

    // current files tracks file modifications
    state.currentFiles.set(files);

    // select first file for left tabs
    const initialFile = self.getFirstFile({
      selectedFile: settings.selectedFile,
      filter: 'main',
    });
    state.activeFile.set(initialFile);

    // select first file for right tabs
    const initialPageFile = self.getFirstFile({
      selectedFile: settings.selectedFile,
      filter: 'page',
    });
    state.activePageFile.set(initialPageFile);
  },

  addPanelSettings() {
    $('ui-panel').settings({
      getNaturalSize: self.getNaturalPanelSize,
    });
  },

  setMobileView(layout) {
    state.mobileView.set(layout);
  },

  calculateLayout() {
    let layout = settings.useTabs
      ? 'tabs'
      : 'panels';
    // force tabs for small screens or inline examples
    const displayMode = state.displayMode.get();
    if (inArray(displayMode, ['tablet', 'mobile']) || settings.inline) {
      layout = 'tabs';
    }
    self.setLayout(layout);
  },

  calculateLayoutChange(reaction) {
    // if the layout changes from tabs to panels
    // or we change to mobile layout
    // we will need update layout configuration
    const displayMode = state.displayMode.get();
    const layout = state.layout.get();
    if (!reaction.firstRun) {
      afterFlush(self.configureLayout);
    }
  },

  configureLayout() {
    // this will update <playground-project> to reference current file values
    // this wil be read by playground-elements causing values to be reset otherwise
    state.projectFiles.set(state.currentFiles.peek());

    // we will need to rerun code editor config on each file
    const playgroundFiles = findChildren('CodePlaygroundFile');
    each(playgroundFiles, (component) => {
      component.configureCodeEditors();
    });
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
    if (displayMode == 'mobile') {
      classMap[`mobile-${mobileView}`] = true;
    }
    return classMap;
  },
  getStyle() {
    if (settings.maxHeight > 0) {
      return `height: ${settings.maxHeight}px;`;
    }
  },

  getPagePanel() {
    return {
      type: 'file',
      filename: state.activePageFile, // pass through signal
    };
  },

  canShowButtons() {
    return !settings.inline && state.displayMode.get() !== 'mobile';
  },

  canShowPageFiles() {
    const pageFiles = nonreactive(() => self.getFileArray({ filter: 'page' }));
    if (pageFiles.length === 0) {
      return false;
    }
    if (pageFiles.every(file => file.generated)) {
      return false;
    }
    if (self.shouldCombineMenus()) {
      return false;
    }
    return true;
  },

  getNaturalPanelSize(panel, { direction, minimized }) {
    const $panel = $$(panel);
    if (direction === 'horizontal') {
      const $menu = $panel.find('ui-menu .menu').first();
      const $gutter = $panel.find('.cm-gutters').first();
      const $lines = $panel.find('.cm-line');

      const extraSpacing = 5; // DO NOT DECREASE from testing with inline playground to avoid scrollbars in all cases.
      const menuWidth = $menu.width() + 11 || 0;
      const minWidths = [200, menuWidth];
      const gutterWidth = $gutter.width();

      if ($lines.count() > 0) {
        const lineWidths = $lines.outerWidth();
        minWidths.push(...lineWidths);
      }

      const size = Math.max(...minWidths) + gutterWidth + extraSpacing;
      return size;
    }
    else {
      // gutters gets minheight which is code height
      const $gutter = $panel.find('.cm-gutters').first();

      // label height and menu need to be added to code height
      const $label = $panel.find('.label').first();
      const $menu = $panel.find('.menu').first();

      const extraSpacing = 2; // rounding
      const labelHeight = $label.height() || 0;
      const menuHeight = $menu.height() || 0;
      let size;
      if (minimized) {
        size = labelHeight;
      }
      else {
        const codeHeight = parseFloat($gutter.css('min-height'));
        const height = codeHeight + labelHeight + menuHeight + extraSpacing;
        size = Math.max(height, 100);
      }
      return size;
    }
  },

  getScriptType(type) {
    return get(settings.scriptTypes, type);
  },
  getPanelSize(file) {
    let size = get(settings.panelSizes, file.filename);
    if (size === 'natural' && !file.content) {
      size = 'grow';
    }
    return size;
  },
  getTabPanelsClass() {
    const classes = {
      inline: settings.inline,
      tabs: state.layout.get() == 'tabs',
    };
    // defer to preference unless its tablet
    if (state.displayMode.value === 'tablet') {
      classes.vertical = true;
    }
    else {
      classes[settings.inlineDirection] = true;
    }
    return classes;
  },
  getTabDirection() {
    if (state.displayMode.value === 'tablet') {
      return 'vertical';
    }
    if (settings.inline) {
      return settings.inlineDirection;
    }
    return 'horizontal';
  },
  // when inline or on mobile or stacked we want only one menu
  shouldCombineMenus() {
    return settings.inline || self.getTabDirection() === 'vertical' || state.displayMode.value === 'mobile';
  },
  getProjectFiles() {
    return self.getFileArray({ files: state.projectFiles.get() });
  },
  getFileArray({ files = state.currentFiles.value, filter } = {}) {
    let fileArray = [];

    // convert file object into an array of data
    each(files, (file, filename) => {
      fileArray.push(self.getFile(file, filename));
    });
    fileArray = sortBy(fileArray, 'sortIndex');

    // if we have only 'page' files this becomes the 'main' menu
    // and the right pane is just the iframe preview
    if (filter && self.onlyPageFiles(fileArray)) {
      if (filter === 'main') {
        return fileArray.filter(file => self.isPageFile(file.filename));
      }
      else if (filter === 'page') {
        return [];
      }
    }

    // filter by 'page' or 'main' filter
    // 'main' menu generally appears on left and shows component
    // 'page' menu appears above the iframe rendering content and shows the rendering page

    fileArray = fileArray.filter((file) => {
      if (filter && file.generated) {
        return false;
      }
      // only have left/right menus if the menus arent conmbined
      if (!self.shouldCombineMenus()) {
        if (filter == 'main' && self.isPageFile(file?.filename)) {
          return false;
        }
        if (filter == 'page' && !self.isPageFile(file?.filename)) {
          return false;
        }
      }
      return true;
    });

    return fileArray;
  },
  onlyPageFiles(fileArray) {
    return fileArray.filter(file => !file.generated).every(file => self.isPageFile(file?.filename));
  },
  isPageFile(filename) {
    return (filename.startsWith('page') || inArray(filename, settings.additionalPageFiles));
  },
  getFile(file, filename) {
    return {
      _id: filename,
      filename,
      ...file,
      scriptType: self.getScriptType(file.contentType),
      panelIndex: self.getPanelIndex(filename),
      sortIndex: self.getSort(filename),
      label: self.getFileLabel(filename),
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
    if (settings.inline && self.getFileMenuItems().length <= 1) {
      return false;
    }
    return true;
  },
  getFileMenuItems({ filter } = {}) {
    let menu = self.getFileArray({ filter }).map(file => {
      if (!settings.includeGeneratedInline && file?.generated) {
        return;
      }
      const label = (settings.hideTypescriptExtensions)
        ? file.filename.replace('ts', 'js')
        : file.filename;
      return {
        label: label,
        value: file.filename,
      };
    }).filter(({ value } = {}) => {
      return Boolean(value);
    });
    if (settings.selectedFile) {
      menu = moveToFront(menu, file => file.value == settings.selectedFile);
    }
    return menu;
  },
  getFirstFile({ selectedFile = '', filter } = {}) {
    const files = self.getFileArray({ filter });
    const matchingFile = firstMatch(files, file => (file.filename == selectedFile));
    if (matchingFile) {
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
    let files = nonreactive(() => self.getFileArray().filter(file => !file.hidden));
    each(files, file => {
      if (file.panelIndex >= 0) {
        panels[file.panelIndex].push({
          type: 'file',
          ...file,
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
    if (iframe) {
      iframe.contentWindow.location.reload();
    }
  },

  toggleTabs() {
    const newLayout = (state.layout.get() == 'tabs')
      ? 'panels'
      : 'tabs';
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
    if (menu) {
      menu.selectIndex(number - 1);
    }
  },
  selectFilename(filename) {
    if (state.layout.get() == 'tabs') {
      const menu = self.getFileMenuItems();
      each(menu, (item, index) => {
        if (item.value == filename) {
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
    if (width < 1200) {
      displayMode = 'tablet';
    }
    if (width < 768) {
      displayMode = 'mobile';
    }
    state.displayMode.set(displayMode);
  },

  setupComponents() {
    idleCallback(() => {
      state.resizing.set(false);
      self.addPanelSettings();
    });
  },

  setNaturalHeight() {
    if (isServer) {
      return;
    }
    const codeHeight = parseFloat($$('.cm-gutters').first().css('min-height')) || 100;
    const menuHeight = $$('ui-panel .menu').first().height() || 0;
    const offset = 5; // from trial & error avoids tiny scrollbars
    let panelHeight = menuHeight + codeHeight + offset;
    panelHeight = Math.min(panelHeight, 600);
    panelHeight = Math.max(panelHeight, 50);
    $('ui-panels').first().css('height', `${panelHeight + 15}px`);
  },

  updateCurrentFiles(currentFilesArray = []) {
    const currentFiles = state.currentFiles.peek();
    each(currentFilesArray, (file) => {
      if (currentFiles[file.name]) {
        currentFiles[file.name].content = file.content;
      }
    });
    state.currentFiles.set(currentFiles);
  },
});

const onCreated = ({ self, attachEvent }) => {
  self.setDisplayMode();
};

const onRendered = ({ isClient, self, state, $, settings }) => {
  // TODO: CM6 Migration - these plugins need to be rewritten as CM6 extensions
  // addSearch(CodeMirror);

  self.addPanelSettings();
  self.setupComponents();

  if (settings.inline && settings.maxHeight == 'natural') {
    requestAnimationFrame(() => self.setNaturalHeight());
  }
};

const onThemeChanged = ({ self }) => {
  self.reloadPreview();
};

const keys = {
  // select file with keyboard
  'ctrl + 1': ({ self }) => self.selectFile(1),
  'ctrl + 2': ({ self }) => self.selectFile(2),
  'ctrl + 3': ({ self }) => self.selectFile(3),
  'ctrl + 4': ({ self }) => self.selectFile(4),
  'ctrl + 5': ({ self }) => self.selectFile(5),
  'ctrl + 6': ({ self }) => self.selectFile(6),
  'ctrl + 7': ({ self }) => self.selectFile(7),
  'ctrl + 8': ({ self }) => self.selectFile(8),
  'ctrl + 9': ({ self }) => self.selectFile(9),
};

const events = {
  'global resize window'({ self, state }) {
    requestAnimationFrame(self.setDisplayMode);
  },
  'change ui-menu.component.files'({ state, data }) {
    state.activeFile.set(data.value);
  },
  'change ui-menu.page.files'({ state, data }) {
    state.activePageFile.set(data.value);
  },
  'change ui-menu.mobile'({ self, data }) {
    self.setMobileView(data.value);
  },
  'click ui-button.tabs'({ self }) {
    self.toggleTabs();
  },
  'resizeStart ui-panel'({ state }) {
    state.resizing.set(true);
  },
  'resizeEnd ui-panel'({ state }) {
    state.resizing.set(false);
  },
  'bind compileStart playground-project'({ self, target }) {
    const currentFilesArray = target._files;
    self.updateCurrentFiles(currentFilesArray);
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
  },
});

export default CodePlayground;
export { CodePlayground };
