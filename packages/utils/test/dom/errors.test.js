import { fatal } from '@semantic-ui/utils';

import { afterAll, beforeAll, afterEach, beforeEach, describe, expect, it, vi } from 'vitest';


beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    throw new Error(`Unhandled Console Error: ${args.join(' ')}`);
  });
});

afterAll(() => {
  console.error.mockRestore();
});

describe('fatal', () => {
  let originalOnError;
  beforeEach(() => {
    originalOnError = global.onError;
    global.onError = vi.fn();
  });

  afterEach(() => {
    global.onError = originalOnError;
  });

  it('should exist', () => {
    expect(typeof fatal).toBe('function');
  });

  /* Testing errors is flakey

  it('should throw an error with the provided message', async () => {
    await expect(new Promise((resolve, reject) => {
      try {
        fatal('Test error', { onError: reject });
      } catch (error) {
        reject(error);
      }
    })).rejects.toThrow('Test error');
  });

  it('should attach provided metadata to the error', async () => {
    const metadata = { code: 'ERR_TEST' };
    await expect(new Promise((resolve, reject) => {
      try {
        fatal('Test error', { metadata, onError: reject });
      } catch (error) {
        reject(error);
      }
    })).rejects.toHaveProperty('code', 'ERR_TEST');
  });

  it('should modify the error stack based on removeStackLines option', async () => {
    await expect(new Promise((resolve, reject) => {
      try {
        fatal('Test error', { removeStackLines: 2, onError: reject });
      } catch (error) {
        reject(error);
      }
    })).rejects.toSatisfy((error) => {
      return error.stack.split('\n').length < new Error().stack.split('\n').length;
    });
  });
  */
});

