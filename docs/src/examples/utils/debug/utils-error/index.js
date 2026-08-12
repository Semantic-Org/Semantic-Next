import { error, isDevelopment } from '@semantic-ui/utils';

// report through the error channel and continue — log's sibling for errors.
// the raise is asynchronous: it routes to globalThis.onError when an app
// installs one, and falls back to console.error otherwise
globalThis.onError = (reported) => console.log(`onError: ${reported.message}`);

// the namespace rides the options bag per call, exactly as log takes it
const reported = error('writeRejected', 'todos:a7f2', {
  namespace: 'sync',
  explanation: isDevelopment ? 'the server refused the write, the optimistic value was rolled back' : 0,
  detail: { docId: 'a7f2', reason: 'version-conflict' },
});
console.log(reported.code, reported.at);
console.log(reported.detail);

// report: false builds and returns without reporting — the error as a value,
// for a rejection or a result envelope where reporting is the consumer's job
const rejection = error('timedOut', 'todos:pull', { namespace: 'sync', report: false });
console.log(rejection.message);

// error.line renders the production line alone, for console seats. the verb is
// any word — your own classification of the line — and refused is the default
console.log(error.line('storageChanged', 'db-1 -> db-2', { namespace: 'sync' }));
console.log(error.line('cursorReset', 'todos@41', { namespace: 'sync', verb: 'recovered' }));

// without a namespace the line composes clean, no leading token
console.log(error.line('unknownField', 'select()'));
