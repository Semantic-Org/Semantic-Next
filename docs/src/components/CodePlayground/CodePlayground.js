import { defineComponent } from '@semantic-ui/component';
import { firstMatch, get, each, moveToFront, inArray, sortBy } from '@semantic-ui/utils';

import { CodePlaygroundPanel } from './CodePlaygroundPanel.js';
import { CodePlaygroundFile } from './CodePlaygroundFile.js';
import { CodePlaygroundPreview } from './CodePlaygroundPreview.js';

import '@semantic-ui/core/src/components/button';

import '../Panels/Panels.js';
import '../Panels/Panel.js';

import template from './CodePlayground.html?raw';
import css from './CodePlayground.css?raw';

import { addSearch } from './lib/codemirror-search.js';

import 'playground-elements/playground-project.js';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';

const settings = {

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
  maxHeight: 0,

  // order of code
  sortOrder: [
    'component.js',
    'component.html',
    'component.css',
    'page.html',
    'page.css',
    'page.js',
  ],

  // types to use
  scriptTypes: {
    'text/css': 'sample/css',
    'text/html': 'sample/html',
    'text/javascript': 'sample/js',
  },

  // titles to appear to users
  fileTitles: {
    'component.js': 'component.js',
    'component.html': 'component.html',
    'component.css': 'component.css',
    'page.html': 'page.html',
    'page.css': 'page.css',
    'page.js': 'page.js',
  },

  // which panel should code appear in 0 is left and 1 is right
  panelIndexes: {
    'component.js': 0,
    'component.html': 0,
    'component.css': 0,
    'page.html': 1,
    'page.css': 1,
    'page.js': 1,
  },

  // how to split up code in panel view
  panelSizes: {
    'component.js': 'grow',
    'component.html': 'grow',
    'component.css': 'grow',
    'page.html': (1 / 9 * 100),
    'page.css': (1 / 9 * 100),
    'page.js': (1 / 9 * 100),
  },

  // default left right panel width
  panelGroupWidth: [50, 50]
};

const state = {
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

const createComponent = ({afterFlush, self, reaction, state, data, settings, $, $$}) => ({

  mobileMenu: [
    { label: 'Code', value: 'code' },
    { label: 'Preview', value: 'preview' },
  ],

  initialize() {

    const initialFile = self.getFirstFile({
      selectedFile: settings.selectedFile,
      filter: 'main'
    });

    const initialPageFile = self.getFirstFile({
      selectedFile: settings.selectedFile,
      filter: 'page'
    });

    // only allow layout swap on pages that panels would work
    if(settings.allowLayoutSwap) {
      settings.useTabs = localStorage.getItem('codeplayground-tabs') == 'yes';
    }

    state.activeFile.set(initialFile);
    state.activePageFile.set(initialPageFile);
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
  getFileArray({filter} = {}) {
    let files = [];
    each(settings.files, (file, filename) => {
      const fileData = self.getFile(file, filename);
      if(filter == 'main' && fileData?.filename?.startsWith('page')) {
        return;
      }
      if(filter == 'page' && !fileData?.filename?.startsWith('page')) {
        return;
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
  getFileMenuItems({ filter } = {}) {
    let menu = self.getFileArray({filter}).map(file => {
      if(!settings.includeGeneratedInline && file?.generated) {
        return;
      }
      return {
        label: file.filename,
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
    const menu = $('ui-menu.files').getComponent();
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

});

const onCreated = ({self, attachEvent}) => {
  self.setDisplayMode();
};

const onRendered = ({ self, state }) => {
  addSearch(CodeMirror);

  self.addPanelSettings();
  requestIdleCallback(() => {
    state.resizing.set(false);
    self.addPanelSettings()
  });
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
  'deep click .CodeMirror-foldmarker'({target, self}) {
    console.log('zz');
    const $target = $(target);
    console.log($target);
    $comment = $target.parent().prev('.cm-comment');
    self.removeFoldComment();
  }
};

const CodePlayground = defineComponent({
  tagName: 'code-playground',
  delegatesFocus: true,
  template,
  css,
  createComponent,
  settings,
  onCreated,
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
