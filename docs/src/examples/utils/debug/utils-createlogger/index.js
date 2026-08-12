import { createLogger } from '@semantic-ui/utils';

// bind the defaults once, destructure the bundle flat
const { log, info, warn, error } = createLogger({ namespace: 'sync' });

// each level helper absorbs the level slot, nothing else changes
info('connected');
warn('reconnecting', { data: { attempt: 2 } });
error('gave up after 3 attempts');

// the bound log keeps its level slot for the occasional dynamic level
log('handshake detail', 'debug');

// callsite options merge over the factory defaults and win
info('first entry after waking', { timestamp: true });

// the namespace prints verbatim, so the casing you bind is the casing that shows
const { info: dbInfo } = createLogger({ namespace: 'db', timestamp: true });
dbInfo('booted');
