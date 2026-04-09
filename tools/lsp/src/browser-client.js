import { LSPClient, serverCompletion, hoverTooltips, serverDiagnostics } from '@codemirror/lsp-client';

/*
  Browser LSP client — connects to the SUI language server Worker.

  Usage:
    import { createClient } from '@semantic-ui/lsp/browser-client';
    const client = createClient();
    client.setFiles({ 'component.js': '...', 'component.html': '...' });
    const extension = client.plugin('component.html');
*/

function toURI(fileOrURI) {
  if (fileOrURI.includes('://')) { return fileOrURI; }
  return `file:///${fileOrURI.replace(/^\/+/, '')}`;
}

export function createClient({ timeout = 10000 } = {}) {
  const workerURL = new URL('./worker.js', import.meta.url);
  const worker = new Worker(workerURL, { type: 'module' });
  worker.onerror = (e) => console.error('[LSP] Worker error:', e);

  const listeners = new WeakMap();
  const transport = {
    send(message) {
      worker.postMessage(message);
    },
    subscribe(handler) {
      const wrapper = (e) => handler(e.data);
      listeners.set(handler, wrapper);
      worker.addEventListener('message', wrapper);
    },
    unsubscribe(handler) {
      const wrapper = listeners.get(handler);
      if (wrapper) {
        worker.removeEventListener('message', wrapper);
        listeners.delete(handler);
      }
    },
  };

  const lspClient = new LSPClient({
    timeout,
    extensions: [
      serverCompletion(),
      hoverTooltips(),
      serverDiagnostics(),
    ],
  }).connect(transport);

  const pluginCache = new Map();

  return {
    /*
      Get or create a CM6 extension for a file URI.
      Returns the extension to inject into an EditorView.
    */
    plugin(file) {
      const uri = toURI(file);
      if (pluginCache.has(uri)) {
        return pluginCache.get(uri);
      }
      const extension = lspClient.plugin(uri);
      pluginCache.set(uri, extension);
      return extension;
    },

    /*
      Send project files to the Worker for component analysis.
      files: { 'component.js': '...', 'component.html': '...' }
             or { 'component.js': { content: '...' }, ... }
    */
    setFiles(files) {
      const flat = {};
      for (const [name, file] of Object.entries(files)) {
        flat[name] = typeof file === 'string' ? file : file?.content ?? '';
      }
      worker.postMessage(JSON.stringify({
        jsonrpc: '2.0',
        method: 'sui/setFiles',
        params: { files: flat },
      }));
    },

    /*
      Send component specs to the Worker for tag/attribute completions.
      specs: array of compiled spec objects (each has tagName, attributes, etc.)
    */
    setSpecs(specs) {
      worker.postMessage(JSON.stringify({
        jsonrpc: '2.0',
        method: 'sui/setSpecs',
        params: { specs },
      }));
    },

    // Expose the underlying LSPClient for advanced use
    lspClient,
    worker,
  };
}
