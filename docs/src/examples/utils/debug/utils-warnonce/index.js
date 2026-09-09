import { createLogger, isDevelopment } from '@semantic-ui/utils';

const { warnOnce, errorOnce, infoOnce } = createLogger({ namespace: 'sync' });

// the key names the condition: the first sight prints, every later one is silent
warnOnce('plainCookie', 'the session cookie is set over plain http');
warnOnce('plainCookie', 'the session cookie is set over plain http');

// the key decides, never the text
warnOnce('plainCookie', 'a different wording of the same condition');

// a template of stable parts keys a condition per entity
for (const collection of ['todos', 'todos', 'posts']) {
  warnOnce(`search:${collection}`, `"${collection}" falls back to the reference floor`);
}

// one memory for the whole family, so a storm at error is one line
for (let attempt = 1; attempt <= 50; attempt += 1) {
  errorOnce('redis:pubsub', 'redis pubsub failed');
}

// a key alone is its own message
infoOnce('booted from the in-memory adapter');

// development advice keeps its guard at the callsite, so a bundler folds call and message together
isDevelopment && warnOnce('unmounted', 'no accounts key was named, so the accounts plane did not mount');

// a fresh logger is a clean slate
const { warnOnce: fresh } = createLogger({ namespace: 'sync' });
fresh('plainCookie', 'prints again on the new logger');
