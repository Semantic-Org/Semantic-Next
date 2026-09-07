import { datetime } from '@semantic-ui/dates';

const moment = datetime('2026-09-06T14:30', 'America/New_York');

console.log(moment.toJSON());
console.log(JSON.stringify({ at: moment }));

const parsed = JSON.parse(JSON.stringify({ at: moment }));
console.log(datetime(parsed.at).equals(moment));

// the zone is a view and does not travel, the reading side chooses it
console.log(datetime(parsed.at, 'America/New_York').format('long'));
