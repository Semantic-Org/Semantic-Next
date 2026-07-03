import { toDate } from '@semantic-ui/utils';

console.log(toDate('2024-01-01'));
console.log(toDate(1700000000000));
console.log(toDate('01/15/2024'));
console.log(toDate('banana'));
console.log(toDate('nonsense') ?? new Date());
