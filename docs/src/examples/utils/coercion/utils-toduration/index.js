import { toDuration } from '@semantic-ui/utils';

console.log(toDuration('5s'));
console.log(toDuration('1.5h'));
console.log(toDuration('10 minutes'));
console.log(toDuration('300msecs'));
console.log(toDuration(1500));
console.log(toDuration('1h 30m'));
console.log(toDuration('soon') ?? 1000);
