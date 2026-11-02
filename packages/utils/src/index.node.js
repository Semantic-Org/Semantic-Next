import { formatServerLog } from './debug-server.js';
import { setServerLogFormatter } from './debug.js';

// the install is this entry's one side effect, listed in package.json
// sideEffects so a bundler's re-export shortcut keeps it
setServerLogFormatter(formatServerLog);

export * from './index.js';
