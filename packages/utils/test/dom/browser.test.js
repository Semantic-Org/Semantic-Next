import { copyText, getText } from '@semantic-ui/utils';

import { describe, expect, it, vi } from 'vitest';

describe('Browser Utilities', () => {
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
});