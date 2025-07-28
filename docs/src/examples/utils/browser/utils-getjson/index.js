import { getJSON } from '@semantic-ui/utils';

// Fetch example JSON data
const data = await getJSON('/fixtures/example-data.json');
console.log('Example data:', data);
console.log('First user:', data.users[0]);
console.log('App config:', data.config);
