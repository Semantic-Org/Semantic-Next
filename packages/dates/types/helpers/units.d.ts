import type { Weekday } from '../inputs.js';

/**
 * The ISO number of a weekday from its name, `weekday('sunday')` is 7, a number passing through
 * @see https://next.semantic-ui.com/docs/api/dates/helpers#weekday
 */
export function weekday(day: Weekday): number;
