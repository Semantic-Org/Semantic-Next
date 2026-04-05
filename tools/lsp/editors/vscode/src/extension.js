import { resolve } from 'path';
import { LanguageClient, TransportKind } from 'vscode-languageclient/node.js';

let client;

export function activate() {
  const serverModule = resolve(import.meta.dirname, '../../../src/server.js');

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
