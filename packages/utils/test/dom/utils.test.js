import { describe, expect, beforeEach, afterEach, afterAll, beforeAll, it, vi } from 'vitest';
import { clone, copyText, getText, isDOM, fatal } from '@semantic-ui/utils';

beforeAll(() => {
  vi.spyOn(console, 'error').mockImplementation((...args) => {
    throw new Error(`Unhandled Console Error: ${args.join(' ')}`);
  });
});

afterAll(() => {
  console.error.mockRestore();
});


describe('clone', () => {

  it('should clone dom nodes', () => {
    const div = document.createElement('div');
    const clonedDiv = clone(div);
    expect(clonedDiv).not.toBe(div);
  });
    
});

describe('copyText', () => {
  it('should call navigator.clipboard.writeText with the provided text', () => {
    const writeTextMock = vi.fn();
    global.navigator = {
      clipboard: {
        writeText: writeTextMock,
      },
    };
    const text = 'Test text';
    copyText(text);
    expect(writeTextMock).toHaveBeenCalledWith(text);
  });
});

describe('getText', () => {
  it('should fetch the text content from the provided source', async () => {
    const mockResponse = 'Test text';
    global.fetch = vi.fn().mockResolvedValue({
      text: () => Promise.resolve(mockResponse),
    });
    const src = 'https://example.com/test.txt';
    const result = await getText(src);
    expect(fetch).toHaveBeenCalledWith(src);
    expect(result).toBe(mockResponse);
  });
});

describe('isDOM', () => {
  it('should return true for Element instances', () => {
    const element = document.createElement('div');
    expect(isDOM(element)).toBe(true);
  });

  it('should return true for Document instances', () => {
    expect(isDOM(document)).toBe(true);
  });

  it('should return true for window', () => {
    expect(isDOM(window)).toBe(true);
  });

  it('should return true for DocumentFragment instances', () => {
    const fragment = document.createDocumentFragment();
    expect(isDOM(fragment)).toBe(true);
  });
});

/* Need to fix this

describe('fatal', () => {
  let originalOnError;
  beforeEach(() => {
    originalOnError = global.onError;
    global.onError = vi.fn();
  });

  afterEach(() => {
    global.onError = originalOnError;
  });

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
});

*/
