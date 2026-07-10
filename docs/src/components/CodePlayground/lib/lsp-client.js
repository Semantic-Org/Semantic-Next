// Singleton wrapper — both CodePlayground (setFiles) and CodePlaygroundFile
// (plugin) need the same LSP client instance. This module is the shared reference.
import { createClient } from '@semantic-ui/lsp/browser-client';

let client = null;

export function getClient() {
  if (!client) {
    client = createClient();
    // tearing down an editor cancels in-flight LSP requests; the client's
    // internal promises reject with cancellations nothing can catch
    window.addEventListener('unhandledrejection', (event) => {
      if (event.reason?.message === 'The operation was cancelled.') {
        event.preventDefault();
      }
    });
  }
  return client;
}
