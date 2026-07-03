import { generateID } from '@semantic-ui/utils';

import { normalizeFiles } from './files.js';
import { createServingAdapter } from './serving/sw-adapter.js';
import { getToolingWorker } from './worker/client.js';

/*
  PlaygroundProject — headless sandbox session. Files in, live preview URL and
  diagnostics out. UI components (and agents) are both consumers of this API.
*/

const servingAdapters = new Map();

const getServingAdapter = ({ sandboxUrl }) => {
  const scope = sandboxUrl.endsWith('/') ? sandboxUrl : `${sandboxUrl}/`;
  let adapter = servingAdapters.get(scope);
  if (!adapter) {
    adapter = createServingAdapter({
      scope,
      serviceWorkerUrl: `${scope}service-worker.js`,
    });
    servingAdapters.set(scope, adapter);
  }
  return adapter;
};

export class PlaygroundProject {
  constructor({
    files = {},
    importMap,
    cdnBaseUrl = 'https://cdn.jsdelivr.net/npm',
    sandboxUrl = '/sandbox/',
    workerUrl,
    serving,
    sessionId = generateID(),
  } = {}) {
    this.sessionId = sessionId;
    this.importMap = importMap;
    this.cdnBaseUrl = cdnBaseUrl;
    this.files = normalizeFiles(files);
    this.diagnostics = {};
    this.listeners = new Map();
    this.buildCounter = 0;
    this.worker = getToolingWorker({ workerUrl });
    this.serving = serving ?? getServingAdapter({ sandboxUrl });
    this.session = this.serving.createSession(this.sessionId, {
      onRecover: () => this.emit('recovered'),
    });
    this.previewUrl = undefined;
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  emit(event, payload) {
    for (const callback of this.listeners.get(event) ?? []) {
      callback(payload);
    }
  }

  getFile(name) {
    return this.files.find(file => file.name === name);
  }

  setFiles(files) {
    this.files = normalizeFiles(files);
    this.emit('filesChanged');
    return this.build();
  }

  editFile(name, content) {
    const file = this.getFile(name);
    if (!file) {
      return;
    }
    file.content = content;
    this.worker.notify('updateFile', { sessionId: this.sessionId, name, content });
    this.emit('filesChanged');
    this.buildDebounced();
  }

  buildDebounced() {
    clearTimeout(this.buildTimer);
    this.buildTimer = setTimeout(() => this.build(), 250);
  }

  async build() {
    this.buildCounter += 1;
    const sequence = this.buildCounter;
    this.emit('buildStart');
    try {
      const result = await this.worker.request('build', {
        sessionId: this.sessionId,
        files: this.files,
        importMap: this.importMap,
        cdnBaseUrl: this.cdnBaseUrl,
      }, { timeout: 30000 });
      if (sequence !== this.buildCounter) {
        return;
      }
      this.diagnostics = result.diagnostics;
      await this.session.setFiles(result.files);
      if (!this.previewUrl) {
        this.previewUrl = this.session.baseUrl;
        this.emit('urlChanged', this.previewUrl);
      }
      this.emit('buildDone', result);
      return result;
    }
    catch (error) {
      if (sequence === this.buildCounter) {
        this.emit('buildError', error);
        console.error('[playground] build failed', error);
      }
    }
  }

  async getCompletions(file, offset) {
    return this.worker.request('getCompletions', { sessionId: this.sessionId, file, offset });
  }

  async getHover(file, offset) {
    return this.worker.request('getHover', { sessionId: this.sessionId, file, offset });
  }

  async getDiagnostics(file) {
    return this.worker.request('getDiagnostics', { sessionId: this.sessionId, file });
  }

  destroy() {
    clearTimeout(this.buildTimer);
    this.buildCounter += 1;
    this.worker.notify('destroySession', { sessionId: this.sessionId });
    this.session.destroy();
    this.listeners.clear();
  }
}
