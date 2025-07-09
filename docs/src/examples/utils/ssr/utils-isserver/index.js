import { isServer } from '@semantic-ui/utils';

console.log('isServer:', isServer);

if (isServer) {
  console.log('Running on server');
}
else {
  console.log('Running in browser');
}
