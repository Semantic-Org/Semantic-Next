import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

let client;

export function activate(context) {
  const serverModule = resolve(__dirname, 'server', 'server.js');

  const serverOptions = {
    run: { module: serverModule, transport: TransportKind.ipc },
    debug: { module: serverModule, transport: TransportKind.ipc },
  };

  const clientOptions = {
    documentSelector: [
      { scheme: 'file', language: 'html' },
    ],
  };

  client = new LanguageClient(
    'semanticUI',
    'Semantic UI Language Server',
    serverOptions,
    clientOptions,
  );

  client.start();
}

export function deactivate() {
  if (client) {
    return client.stop();
  }
}
