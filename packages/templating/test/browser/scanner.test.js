import { Scanner } from '@semantic-ui/templating';
import { describe, expect, it, test, vi } from 'vitest';

describe('scanner', () => {
  describe('fatal', () => {
    it('fatal should log error to page in debug mode', () => {
      Scanner.debugMode = true;
      const scanner = new Scanner(`
        <div>
          {{#if someCondition}}

          {{/if}}
          {{/if}}
        </div>
      `);
      const consoleError = console.error;
      console.error = vi.fn();
      Scanner.DEBUG_MODE = true;

      scanner.consumeUntil('{{/if}}');
      scanner.consumeUntil('{{/if}}');

      try {
        expect(scanner.fatal('Unclosed if tag')).toThrow('Unclosed if tag');
      }
      catch (e) {
        // nothing
      }
      expect(console.error).toHaveBeenCalled();

      const html = document.body.innerHTML;
      expect(html.search('h3')).toBeGreaterThan(-1);

      console.error = consoleError;
      Scanner.debugMode = false;
    });
  });
});
