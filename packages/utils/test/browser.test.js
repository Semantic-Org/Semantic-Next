import { getIPAddress, getKeyFromEvent, isClient, isServer } from '@semantic-ui/utils';

import { describe, expect, it } from 'vitest';

describe('Browser Utilities', () => {
  describe('getKeyFromEvent', () => {
    it('should return an empty string if the event.key is not defined', () => {
      const event = { ctrlKey: true };
      expect(getKeyFromEvent(event)).toBe('');
    });

    it('should return an empty string if the event has no key property', () => {
      const event = {};
      expect(getKeyFromEvent(event)).toBe('');
    });

    it('should return the lowercase key for a simple key press', () => {
      const event = { key: 'A' };
      expect(getKeyFromEvent(event)).toBe('a');
    });

    it('should return the correct key for a special key press', () => {
      const event = { key: 'ArrowUp' };
      expect(getKeyFromEvent(event)).toBe('up');
    });

    it('should include the "ctrl" modifier when the ctrlKey is pressed', () => {
      const event = { key: 'a', ctrlKey: true };
      expect(getKeyFromEvent(event)).toBe('ctrl+a');
    });

    it('should include the "alt" modifier when the altKey is pressed', () => {
      const event = { key: 'b', altKey: true };
      expect(getKeyFromEvent(event)).toBe('alt+b');
    });

    it('should include the "shift" modifier when the shiftKey is pressed', () => {
      const event = { key: 'c', shiftKey: true };
      expect(getKeyFromEvent(event)).toBe('shift+c');
    });

    it('should include the "meta" modifier when the metaKey is pressed', () => {
      const event = { key: 'd', metaKey: true };
      expect(getKeyFromEvent(event)).toBe('meta+d');
    });

    it('should include multiple modifiers when multiple modifier keys are pressed', () => {
      const event = { key: 'e', ctrlKey: true, altKey: true, shiftKey: true, metaKey: true };
      expect(getKeyFromEvent(event)).toBe('ctrl+alt+shift+meta+e');
    });

    it('should return the correct key for the space key', () => {
      const event = { key: ' ' };
      expect(getKeyFromEvent(event)).toBe('space');
    });
  });

  describe('getIPAddress', () => {
    it('should reject in non-client environment', async () => {
      await expect(getIPAddress()).rejects.toThrow();
    });

    it('should include client error message when not in browser', async () => {
      await expect(getIPAddress()).rejects.toThrow('IP address can only be determined on client');
    });
  });

  describe('isServer', () => {
    it('should return true if window is undefined', () => {
      expect(isServer).toBe(true);
    });
  });

  describe('isClient', () => {
    it('should return false if window is undefined', () => {
      expect(isClient).toBe(false);
    });
  });
});
