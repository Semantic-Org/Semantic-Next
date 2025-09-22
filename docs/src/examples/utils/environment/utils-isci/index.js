import { isCI } from '@semantic-ui/utils';

console.log(isCI);

if (isCI) {
  console.log('CI environment detected');
}
