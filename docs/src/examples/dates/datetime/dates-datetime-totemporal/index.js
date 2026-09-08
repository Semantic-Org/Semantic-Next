import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'Asia/Tokyo');
const zoned = moment.toTemporal();

console.log(zoned instanceof Temporal.ZonedDateTime);
console.log(zoned.toString());
console.log(zoned.timeZoneId);
console.log(datetime(zoned).equals(moment));
