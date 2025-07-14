import { fatal } from '@semantic-ui/utils';

console.log('About to throw async error...');

fatal('Something went wrong!');

fatal('Custom error', {
  errorType: TypeError,
  metadata: { code: 'CUSTOM_ERROR' },
});

console.log('This runs before errors are thrown');
