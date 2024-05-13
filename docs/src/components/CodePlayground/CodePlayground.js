import { createComponent, adoptStylesheet } from '@semantic-ui/component';
import { first, get, each, sortBy, inArray } from '@semantic-ui/utils';
import { ReactiveVar } from '@semantic-ui/reactivity';

import { addSearch } from './codemirror-search.js';

import UIPanels from '../Panels/Panels.js';
import UIPanel from '../Panels/Panel.js';
import { UIButton } from '@semantic-ui/core';

import template from './CodePlayground.html?raw';
import css from './CodePlayground.css?raw';
import codeMirrorCSS from './codemirror.css?raw';

import 'playground-elements/playground-project.js';
import 'playground-elements/playground-file-editor.js';
import 'playground-elements/playground-preview.js';

const settings = {
  files: {},
  sandboxURL: '/sandbox',
  exampleURL: '',
  includeGeneratedInline: false,
  example: {},
  tabSize: 2,
  inline: false,
};

const createInstance = ({tpl, settings, $}) => ({
  activeFile: new ReactiveVar(),
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
  panelSizes: {
    'component.js': 'grow',
    'component.html': 'grow',
    'component.css': 'grow',
    'index.html': (1 / 9 * 100),
    'index.css': (1 / 9 * 100),
    'index.js': (1 / 9 * 100),
  },
  naturalPanels: ['component.js'],
  resizing: new ReactiveVar(false),
  getScriptType(type) {
    return get(tpl.scriptTypes, type);
  },
  getPanelSize(file) {
    let size = get(tpl.panelSizes, file.filename);
    if(size == 'natural' && !file.content) {
      size = 'grow';
    }
    return size;
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
      paneIndex: tpl.getDefaultPanel(filename),
      sortIndex: tpl.getDefaultSort(filename),
      label: tpl.getFileLabel(filename)
    };
  },
  getDefaultPanel(filename) {
    return get(tpl.paneIndex, filename);
  },
  getDefaultSort(filename) {
    return tpl.sortOrder.indexOf(filename);
  },
  getFileLabel(filename) {
    return filename;
  },
  getPanelGroupWidth(index) {
    if(index == 0) {
      return 40;
    }
  },
  getFileMenuItems() {
    const menu = tpl.getFileArray().map(file => {
      if(file.generated && settings.inline && !settings.includeGeneratedInline) {
        return false;
      }
      return {
        label: file.filename,
        id: file.filename,
      }
    }).filter(Boolean);
    return menu;
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
    // preview always last on second pane
    panels[1].push({
      type: 'preview',
    });
    return panels;
  },
  configureCodeEditors() {
    addSearch(CodeMirror);
    $('playground-code-editor').each(function(el) {
      adoptStylesheet(codeMirrorCSS, el.shadowRoot);
      tpl.modifyCodeMirror(el._codemirror);
    });
  },
  reloadPreview() {
    const iframe = $('playground-preview').find('iframe').get(0);
    if(iframe) {
      iframe.contentWindow.location.reload()
    }
  },
  modifyCodeMirror(cm) {

    cm.refresh();

    cm.setOption('tabSize', settings.tabSize);

    // Enable multiple selections
    cm.setOption('allowMultipleSelections', true);

    // Use the drawSelection extension to display multiple selections
    cm.setOption('drawSelectionMatches', true);

    cm.setOption('extraKeys', {
      ...cm.getOption('extraKeys'),
      Tab: (cm) => {
        if (cm.somethingSelected()) {
          cm.indentSelection('add');
        } else {
          cm.execCommand('insertSoftTab');
        }
      },
      'Ctrl+Tab': () => {
        console.log('got here');
      },
      'Shift-Tab': () => {
        const indentUnit = cm.getOption('indentUnit') ?? 2;
        const selections = cm.listSelections();
        cm.operation(() => {
          selections.forEach((selection) => {
            const fromLine = selection.from().line;
            const toLine = selection.to().line;
            for (let i = fromLine; i <= toLine; i++) {
              const lineContent = cm.getLine(i);
              const trimmedLine = lineContent.trimStart();
              const outdentSize = Math.min(lineContent.length - trimmedLine.length, indentUnit);
              cm.replaceRange('', { line: i, ch: 0 }, { line: i, ch: outdentSize });
            }
          });
        });
      },
      'Ctrl-D': () => {
        // Get the current selection
        const selection = cm.getSelection();
        // Find all occurrences of the selected text
        const cursor = cm.getSearchCursor(selection);
        const matches = [];
        while (cursor.findNext()) {
          matches.push({ anchor: cursor.from(), head: cursor.to() });
        }

        // Add the occurrences as selections
        cm.setSelections(matches);
      },
    });
  }
});

const onCreated = ({ tpl, settings }) => {
  const firstFilename = first(tpl.getFileArray())?.filename;
  tpl.activeFile.set(firstFilename)
};

const onDestroyed = ({ tpl }) => {
};

const onRendered = ({ $, tpl, settings }) => {
  tpl.configureCodeEditors();
  $('ui-menu').settings({
    onChange: function(value) {
      tpl.activeFile.set(value);
    }
  });
  $('ui-panel').settings({
    getNaturalSize: function(panel, direction) {
      let size;
      if(direction == 'horizontal') {
        const extraSpacing = 20; // scrollbar width and spacing
        const minWidths = [];
        $(panel).find('.CodeMirror-sizer').each(sizer => {
          const sizerMargin = parseFloat($(sizer).css('margin-left'));
          const sizerWidth = parseFloat($(sizer).css('min-width'));
          minWidths.push(sizerMargin + sizerWidth + extraSpacing);
        });
        size = Math.max(...minWidths);
      }
      else if(direction == 'vertical') {
        const extraSpacing = 5;
        const codeHeight = parseFloat($(panel).find('.CodeMirror-sizer').first().css('min-height'));
        const labelHeight = $(panel).children('label').height();
        size = codeHeight + labelHeight + extraSpacing;
      }
      return size;
    }
  });
};

const onThemeChanged = ({tpl}) => {
  tpl.reloadPreview();
};

const events = {
  'resizeStart ui-panel'({tpl, event, data}) {
    tpl.resizing.set(true);
  },
  'resizeEnd ui-panel'({tpl, event, data}) {
    tpl.resizing.set(false);
  },
  'click label': function({event}) {
    const $panel = $(this).closest('ui-panel');
    const $codeEditor = $panel.find('playground-code-editor');
    $codeEditor.focus();
  },
  'click ui-panel': function({event}) {
    $('label').removeClass('active');
    $(this).children('label').addClass('active');
  }
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
  onThemeChanged,
});

export default CodePlayground;
export { CodePlayground };
