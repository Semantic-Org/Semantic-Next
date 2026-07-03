import { adoptStylesheet, defineComponent } from '@semantic-ui/component';
import { createEditor, intelligence } from '@semantic-ui/playground/editor';

import css from './CodePlaygroundFile.css?raw';
import template from './CodePlaygroundFile.html?raw';
import codeMirrorCSS from './lib/codemirror.css?raw';
import { getClient } from './lib/lsp-client.js';

const defaultSettings = {
  lineNumbers: true,
};

const defaultState = {
  initialized: false,
};

const createComponent = ({ self, el, settings, state, data, reaction, findParent, $ }) => ({
  getFilename() {
    return data.filename?.get ? data.filename.get() : data.filename;
  },

  getParent() {
    if (!self.parent) {
      self.parent = findParent('codePlayground');
    }
    return self.parent;
  },

  getFileExtensions(filename) {
    const parent = self.getParent();
    if ((filename || '').endsWith('.html')) {
      return [getClient().plugin(filename)];
    }
    if (/\.(ts|js|mjs|jsx|tsx)$/.test(filename || '')) {
      return intelligence({
        fileName: filename,
        completions: (file, offset) => parent.project.getCompletions(file, offset),
        hover: (file, offset) => parent.project.getHover(file, offset),
      });
    }
    return [];
  },

  createEditor() {
    self.editor = createEditor({
      parent: $('.file-editor').el(),
      lineNumbers: Boolean(data.lineNumbers),
      lineWrapping: Boolean(data.lineWrapping),
      tabSize: 2,
      onChange: (filename, content) => {
        self.getParent()?.fileEdited(filename, content);
        self.refreshDiagnostics(filename);
      },
      getFileExtensions: self.getFileExtensions,
    });
    adoptStylesheet(codeMirrorCSS, el.shadowRoot);
  },

  syncFile() {
    const filename = self.getFilename();
    if (!filename || !self.editor) {
      return;
    }
    const content = self.getParent()?.getFileContent(filename) ?? '';
    self.editor.openFile(filename, content);
  },

  refreshDiagnostics(filename) {
    if (!/\.(ts|js|mjs)$/.test(filename || '')) {
      return;
    }
    clearTimeout(self.diagnosticsTimer);
    self.diagnosticsTimer = setTimeout(async () => {
      const parent = self.getParent();
      const diagnostics = await parent?.project?.getDiagnostics(filename).catch(() => null);
      if (diagnostics && self.editor?.fileName === filename) {
        self.editor.setDiagnostics(diagnostics);
      }
    }, 600);
  },

  configureCodeEditors() {
    self.editor?.setLineNumbers(Boolean(data.lineNumbers));
    self.editor?.setLineWrapping(Boolean(data.lineWrapping));
  },

  setCodeSize({ width = null, height = null } = {}) {
    if (self.editor) {
      self.editor.view.dom.style.width = width;
      self.editor.view.dom.style.height = height;
    }
  },

  focus() {
    self.editor?.focus();
  },
});

const events = {
  'click .label'({ self }) {
    self.focus();
  },
  'focus ui-panel'({ $$ }) {
    $$('.label').addClass('active');
  },
  'blur ui-panel'({ $$ }) {
    $$('.label').removeClass('active');
  },
};

const onRendered = ({ self, reaction, state }) => {
  self.createEditor();
  reaction(() => self.syncFile());
  state.initialized.set(true);
};

const onDestroyed = ({ self }) => {
  clearTimeout(self.diagnosticsTimer);
  self.editor?.destroy();
};

const CodePlaygroundFile = defineComponent({
  template,
  css,
  createComponent,
  onRendered,
  onDestroyed,
  events,
  defaultState,
  defaultSettings,
});

export default CodePlaygroundFile;
export { CodePlaygroundFile };
