import { formatDate } from '@semantic-ui/utils';

const date = new Date('2023-12-25T15:30:00');

console.log(formatDate(date, 'YYYY-MM-DD'));
console.log(formatDate(date, 'MMM DD, YYYY'));
console.log(formatDate(date, 'HH:mm:ss'));

// with locale
console.log(formatDate(date, 'MMMM DD, YYYY', { locale: 'fr-FR' }));

// with timezone
console.log(formatDate(date, 'YYYY-MM-DD HH:mm', { timezone: 'America/New_York' }));
console.log(formatDate(date, 'YYYY-MM-DD HH:mm', { timezone: 'PT' }));
