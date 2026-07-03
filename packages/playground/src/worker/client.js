import { createRpc } from '../rpc.js';

/*
  One tooling worker per page, shared by every project — concurrent per-project
  workers are what raced the module graph under dev servers and left N-1 dead.
  The worker asset is a self-contained bundle, so booting it never touches the
  page's module pipeline.
*/

const workers = new Map();

export const getToolingWorker = ({ workerUrl = '/sandbox/tooling-worker.js' } = {}) => {
  let entry = workers.get(workerUrl);
  if (!entry) {
    const worker = new Worker(workerUrl, { type: 'module' });
    worker.addEventListener('error', (event) => {
      console.error('[playground] tooling worker failed to boot', workerUrl, event.message ?? '');
    });
    const rpc = createRpc({
      post: (message) => worker.postMessage(message),
      listen: (receive) => {
        worker.addEventListener('message', (event) => receive(event.data));
      },
    });
    entry = { worker, rpc };
    workers.set(workerUrl, entry);
  }
  return entry.rpc;
};
