import { StringScanner } from '@semantic-ui/templating';
import { describe, it, expect, test, vi } from 'vitest';

describe('string scanner', () => {
  
  describe('fatal', () => {

    it('fatal should log error to page in debug mode', () => {
      StringScanner.debugMode = true;
      const scanner = new StringScanner(`
        <div>
          {{#if someCondition}}

          {{/if}}
          {{/if}}
        </div>
      `);
      const consoleError = console.error;
      console.error = vi.fn();
      StringScanner.DEBUG_MODE = true;

      scanner.consumeUntil('{{/if}}');
      scanner.consumeUntil('{{/if}}');

      try {
        expect(scanner.fatal('Unclosed if tag')).toThrow('Unclosed if tag');
      }
      catch(e) {
        // nothing
      }
      expect(console.error).toHaveBeenCalled();
      
      const html = document.body.innerHTML;
      expect(html.search('h3')).toBeGreaterThan(-1);

      console.error = consoleError;
      StringScanner.debugMode = false;
    });
  });


});
