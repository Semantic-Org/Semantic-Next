import { isClient } from '@semantic-ui/utils';

console.log('isClient:', isClient);

if (isClient) {
  console.log('Running in browser');
}
else {
  console.log('Running on server');
}
