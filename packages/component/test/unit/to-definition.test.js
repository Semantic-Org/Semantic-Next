import { describe, expect, it } from 'vitest';
import '@semantic-ui/component';
import { defineComponent } from '../../src/define-component.js';

describe('Template.toDefinition()', () => {
  it('should include defaultSettings when no tagName', () => {
    const result = defineComponent({
      template: '<div>test</div>',
      defaultSettings: { color: 'red' },
    });
    const def = result.toDefinition();
    expect(def.defaultSettings).toEqual({ color: 'red' });
  });

  it('should be undefined when tagName is set', () => {
    const result = defineComponent({
      tagName: 'ui-test-to-def',
      template: '<div>test</div>',
      defaultSettings: { color: 'red' },
    });
    const def = result.toDefinition();
    expect(def.defaultSettings).toBeUndefined();
  });
});
