// Singleton wrapper — both CodePlayground (setFiles) and CodePlaygroundFile
// (plugin) need the same LSP client instance. This module is the shared reference.
import { createClient } from '@semantic-ui/lsp/browser-client';

let client = null;

export function getClient() {
  if (!client) {
    client = createClient();
  }
  return client;
}
