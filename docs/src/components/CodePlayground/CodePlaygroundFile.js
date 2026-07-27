import { defineComponent } from '@semantic-ui/component';
import { isHTMLFile, isScriptFile } from '@semantic-ui/playground';
import { createEditor, intelligence } from '@semantic-ui/playground/editor';
import { debounce } from '@semantic-ui/utils';

import css from './CodePlaygroundFile.css?raw';
import template from './CodePlaygroundFile.html?raw';
import codeMirrorCSS from './lib/codemirror.css?raw';
import { getClient } from './lib/lsp-client.js';

const defaultSettings = {
  lineNumbers: true,
};

const createComponent = ({ self, settings, state, data, reaction, findParent, dispatchEvent, $ }) => ({
  getFilename() {
    return data.filename;
  },

  getParent() {
    if (!self.parent) {
      self.parent = findParent('codePlayground');
    }
    return self.parent;
  },

  getFileExtensions(filename) {
    const parent = self.getParent();
    if (isHTMLFile(filename)) {
      return [getClient().plugin(filename)];
    }
    if (isScriptFile(filename)) {
      return intelligence({
        fileName: filename,
        completions: (file, offset) => parent.project.getCompletions(file, offset),
        completionDetail: (file, offset, name) => parent.project.getCompletionDetail(file, offset, name),
        signatures: (file, offset) => parent.project.getSignatureHelp(file, offset),
        hover: (file, offset) => parent.project.getHover(file, offset),
        // jsdoc @link urls point at production docs; serve them from the current host
        resolveLink: (url) => url.replace(/^https:\/\/next\.semantic-ui\.com(?=\/)/, ''),
      });
    }
    return [];
  },

  createEditor() {
    const parent = $('.file-editor').el();
    if (!parent) {
      return;
    }
    self.refreshDiagnostics = debounce(self.requestDiagnostics, 600);
    self.editor = createEditor({
      parent,
      lineNumbers: Boolean(data.lineNumbers),
      lineWrapping: Boolean(data.lineWrapping),
      tabSize: 2,
      onChange: (filename, content) => {
        self.getParent()?.fileEdited(filename, content);
        self.refreshDiagnostics(filename);
      },
      onSizeChange: (size) => {
        const filename = self.getFilename();
        self.getParent()?.fileSizeChanged(filename, size);
        dispatchEvent('fileSizeChanged', { filename, ...size });
      },
      getFileExtensions: self.getFileExtensions,
      theme: codeMirrorCSS,
    });
    // lsp tooltips render markdown links; open them in a new tab so the session survives
    parent.addEventListener('click', (event) => {
      const anchor = event.target.closest?.('a');
      if (anchor && anchor.closest('.cm-lsp-documentation')) {
        event.preventDefault();
        window.open(anchor.getAttribute('href'), '_blank', 'noopener');
      }
    });
  },

  syncFile() {
    const filename = self.getFilename();
    const content = self.getParent()?.getFileContent(filename);
    if (!self.editor) {
      self.createEditor();
    }
    if (!filename || !self.editor) {
      return;
    }
    self.editor.openFile(filename, content ?? '');
  },

  async requestDiagnostics(filename) {
    if (!isScriptFile(filename)) {
      return;
    }
    const parent = self.getParent();
    const diagnostics = await parent?.project?.getDiagnostics(filename).catch(() => null);
    if (diagnostics && self.editor?.fileName === filename) {
      self.editor.setDiagnostics(diagnostics);
    }
  },

  configureCodeEditors() {
    self.editor?.setLineNumbers(Boolean(data.lineNumbers));
    self.editor?.setLineWrapping(Boolean(data.lineWrapping));
  },

  measure() {
    return self.editor?.measure();
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

const onRendered = ({ self, reaction }) => {
  reaction(() => {
    // tracks the parent's files signal too, so external resets reach the open editor
    self.getParent()?.currentFiles?.get();
    self.syncFile();
  });
};

const onDestroyed = ({ self }) => {
  self.refreshDiagnostics?.cancel();
  self.editor?.destroy();
};

const CodePlaygroundFile = defineComponent({
  template,
  css,
  createComponent,
  onRendered,
  onDestroyed,
  events,
  defaultSettings,
});

export default CodePlaygroundFile;
export { CodePlaygroundFile };
