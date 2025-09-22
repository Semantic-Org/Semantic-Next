import { log } from '@semantic-ui/utils';

// Basic usage
console.log('=== Basic Usage ===');
log('Application started', 'info');
log('Debug information', 'debug');
log('Warning message', 'warn');
log('Error occurred', 'error');

// With namespace and data
console.log('\n=== With Namespace and Data ===');
log('User login successful', 'info', {
  namespace: 'UserService',
  data: [{ userId: 123, timestamp: new Date() }],
});

log('Database query executed', 'debug', {
  namespace: 'Database',
  data: [{ query: 'SELECT * FROM users', duration: '45ms' }],
});

// Custom styling
console.log('\n=== Custom Styling ===');
log('Custom title color', 'info', {
  title: 'SYSTEM',
  titleColor: '#FF6B35',
});

log('With timestamp', 'warn', {
  title: 'NOTICE',
  timestamp: true,
  data: [{ severity: 'medium' }],
});

// JSON format for structured logging
console.log('\n=== JSON Format ===');
log('API response received', 'info', {
  format: 'json',
  namespace: 'ApiClient',
  timestamp: true,
  data: [{
    status: 200,
    endpoint: '/api/users',
    responseTime: 150,
  }],
});

// Silent mode (won't output anything)
console.log('\n=== Silent Mode ===');
console.log("The next log call is silent and won't appear:");
log('This will not appear', 'info', { silent: true });

// Multiple data items
console.log('\n=== Multiple Data Items ===');
log('Processing complete', 'info', {
  title: 'BATCH',
  data: [
    { processed: 100 },
    { errors: 2 },
    { duration: '5.2s' },
  ],
});
