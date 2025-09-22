import { getIPAddress } from '@semantic-ui/utils';

// Get public IP address (default)
const publicIP = await getIPAddress();
console.log('Public IP:', publicIP);

// Get local IP addresses
const localIPs = await getIPAddress({ type: 'local' });
console.log('Local IPs:', localIPs);

// Get all IP addresses
const allIPs = await getIPAddress({ type: 'all' });
console.log('All IPs:', allIPs);
