import { Time, time } from '../time.js';
import { clock, family, VALUE } from './protocol.js';

Time[VALUE] = Object.freeze({ kind: 'time', parse: time, decode: time, key: clock, ordered: true, family });
