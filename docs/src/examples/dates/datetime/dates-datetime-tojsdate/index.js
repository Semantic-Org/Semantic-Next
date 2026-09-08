import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'UTC');
const jsDate = moment.toJSDate();

console.log(jsDate instanceof Date);
console.log(jsDate.toISOString());
console.log(jsDate.getTime() === moment.epoch);
