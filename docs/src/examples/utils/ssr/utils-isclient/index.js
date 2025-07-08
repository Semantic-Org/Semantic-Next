import { isClient } from '@semantic-ui/utils';

// Check if running in browser
console.log('Is running in browser:', isClient);

// Conditional client-side logic
if (isClient) {
  console.log('Running in browser...');
  console.log('- DOM is available');
  console.log('- Can use browser APIs');
  console.log('- Window object exists');
  console.log('- Perfect for user interactions, animations, local storage');
}
else {
  console.log('Running on server...');
  console.log('- No DOM available');
  console.log('- No window object');
  console.log('- Node.js environment');
  console.log('- Perfect for SSR, data fetching, file operations');
}

// Browser-specific features
console.log('\nBrowser-specific checks:');
if (isClient) {
  console.log('Window dimensions available:', typeof window !== 'undefined');
  console.log('LocalStorage available:', typeof localStorage !== 'undefined');
  console.log('Geolocation available:', typeof navigator !== 'undefined' && 'geolocation' in navigator);
}
else {
  console.log('Browser APIs not available on server');
}

// Safe browser API usage
const getClientInfo = () => {
  if (isClient) {
    return {
      userAgent: navigator?.userAgent || 'Unknown',
      language: navigator?.language || 'Unknown',
      cookieEnabled: navigator?.cookieEnabled || false,
      onLine: navigator?.onLine || false,
    };
  }
  return { message: 'Client info only available in browser' };
};

console.log('Client info:', getClientInfo());
