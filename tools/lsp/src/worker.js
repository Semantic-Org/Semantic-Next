import { LanguageService } from './language-service.js';
import { analyzeComponent } from './component-analyzer.js';

/*
  Browser Worker entry point for the SUI LSP.
  Thin JSON-RPC 2.0 transport over postMessage.

  Files are provided by the main thread via sui/setFiles notification.
  The resolver serves them from an in-memory map.
*/

const files = new Map(); // path → source text

const service = new LanguageService({
  resolver: {
    readFile: (p) => files.get(p) ?? null,
    exists: (p) => files.has(p),
    listDir: (dir) => [...files.keys()]
      .filter(k => k.startsWith(dir + '/') && !k.substring(dir.length + 1).includes('/'))
      .map(k => k.substring(k.lastIndexOf('/') + 1)),
    resolve: (from, rel) => {
      const dir = from.substring(0, from.lastIndexOf('/'));
      return dir + '/' + rel.replace(/^\.\//, '');
    },
    glob: () => [...files.keys()],
  },
  analyzer: (source, filePath) => analyzeComponent(source, filePath),
});

self.onmessage = async (event) => {
  try {
    const msg = JSON.parse(event.data);

    // Notification (no id)
    if (!('id' in msg)) {
      await handleNotification(msg.method, msg.params);
      return;
    }

    // Request (has id)
    const result = await handleRequest(msg.method, msg.params);
    send({ jsonrpc: '2.0', id: msg.id, result });
  }
  catch (e) {
    console.error('[LSP Worker]', e);
    // If we have an id, send an error response so the client doesn't time out
    try {
      const msg = JSON.parse(event.data);
      if ('id' in msg) {
        send({ jsonrpc: '2.0', id: msg.id, error: { code: -32603, message: e.message } });
      }
    }
    catch { /* can't even parse the message */ }
  }
};

async function handleRequest(method, params) {
  switch (method) {
    case 'initialize':
      return {
        capabilities: {
          textDocumentSync: 1, // Full
          completionProvider: {
            triggerCharacters: ['{', '#', '>', '<', '@', '"', "'", ' ', '.'],
          },
          hoverProvider: true,
        },
      };

    case 'textDocument/completion': {
      const completions = service.getCompletions(
        params.textDocument.uri,
        params.position,
      );
      return completions;
    }

    case 'textDocument/hover':
      return service.getHover(
        params.textDocument.uri,
        params.position,
      );

    default:
      return null;
  }
}

async function handleNotification(method, params) {
  switch (method) {
    case 'initialized':
      break;

    case 'textDocument/didOpen':
      service.didOpen(
        params.textDocument.uri,
        params.textDocument.text,
        params.textDocument.version,
      );
      await publishDiagnostics(params.textDocument.uri);
      break;

    case 'textDocument/didChange': {
      const changes = params.contentChanges;
      const text = changes[changes.length - 1]?.text;
      if (text != null) {
        service.didChange(
          params.textDocument.uri,
          text,
          params.textDocument.version,
        );
        await publishDiagnostics(params.textDocument.uri);
      }
      break;
    }

    case 'textDocument/didClose':
      service.didClose(params.textDocument.uri);
      break;

    // Custom: receive playground files from main thread
    case 'sui/setFiles': {
      files.clear();
      for (const [name, content] of Object.entries(params.files)) {
        files.set(`/${name}`, content);
      }
      // Invalidate all models so they re-analyze with new files
      service.models.clear();
      break;
    }
  }
}

async function publishDiagnostics(uri) {
  if (!uri.endsWith('.html')) { return; }
  const diagnostics = await service.getDiagnostics(uri);
  send({
    jsonrpc: '2.0',
    method: 'textDocument/publishDiagnostics',
    params: { uri, diagnostics },
  });
}

function send(msg) {
  self.postMessage(JSON.stringify(msg));
}
