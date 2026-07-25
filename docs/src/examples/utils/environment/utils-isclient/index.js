import { isClient, isServer } from '@semantic-ui/utils';

// two constants, always opposite
console.log('isClient:', isClient);
console.log('isServer:', isServer);

if (isClient) {
  console.log('Running in browser');
}
