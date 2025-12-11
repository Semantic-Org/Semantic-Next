import { log } from '@semantic-ui/utils';

// Basic: message + level
log('User clicked button', 'info');
log('Missing required field', 'warn');
log('Connection failed', 'error');

// With namespace and data
log('Request completed', 'info', {
  namespace: 'API',
  data: [{ endpoint: '/users', status: 200 }],
});
