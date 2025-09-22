import { getIPAddress } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

// Helper to validate IP address format
const isValidIP = (ip) => {
  // IPv4 pattern
  const ipv4Pattern = /^(\d{1,3}\.){3}\d{1,3}$/;
  // Basic IPv6 pattern (simplified)
  const ipv6Pattern = /^[a-fA-F0-9:]+$/;

  return ipv4Pattern.test(ip) || ipv6Pattern.test(ip);
};

describe('Browser Utilities', () => {
  describe('getIPAddress', () => {
    it('should return a string for public IP', async () => {
      const publicIP = await getIPAddress();
      expect(typeof publicIP).toBe('string');
      expect(isValidIP(publicIP)).toBe(true);
      // Public IPs should typically be IPv4 addresses like 70.23.71.31
      expect(publicIP).toMatch(/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/);
    });

    it('should return an array of strings for local IPs', async () => {
      try {
        const localIPs = await getIPAddress({ type: 'local', timeout: 200 });
        expect(Array.isArray(localIPs)).toBe(true);
        expect(localIPs.length).toBeGreaterThan(0);
        localIPs.forEach(ip => {
          expect(typeof ip).toBe('string');
          expect(isValidIP(ip)).toBe(true);
        });
      }
      catch (error) {
        // In some test environments, local IPs might not be available
        expect(error.message).toMatch(/No local IP addresses found|Timed out/);
      }
    });

    it('should return an array for all IPs', async () => {
      const allIPs = await getIPAddress({ type: 'all', timeout: 200 });
      expect(Array.isArray(allIPs)).toBe(true);
      expect(allIPs.length).toBeGreaterThan(0);
      allIPs.forEach(ip => {
        expect(typeof ip).toBe('string');
        expect(isValidIP(ip)).toBe(true);
      });
    });

    it('should handle timeout properly', async () => {
      try {
        // Try with a very short timeout
        await getIPAddress({ type: 'local', timeout: 10 });
        // If it succeeds, that's fine
      }
      catch (error) {
        // Should timeout or fail to find IPs
        expect(error.message).toMatch(/No local IP addresses found|Timed out/);
      }
    });

    it('should handle invalid type gracefully', async () => {
      try {
        // @ts-ignore - testing invalid type
        await getIPAddress({ type: 'invalid', timeout: 200 });
      }
      catch (error) {
        expect(error).toBeDefined();
      }
    });
  });
});
