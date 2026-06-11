import { describe, expect, it } from 'vitest';

import { defineComponent } from '@semantic-ui/component';

const template = `<ul>
  <li>a</li>
</ul>`;

describe('whitespace-sensitive css', () => {
  it('condenses template whitespace by default', () => {
    const component = defineComponent({ template });
    expect(component.ast[0].html).toBe('<ul><li>a</li></ul>');
  });

  it('preserves whitespace when css makes it significant', () => {
    const component = defineComponent({ template, css: 'li { white-space: pre-wrap; }' });
    expect(component.ast[0].html).toContain('\n');
  });

  it('explicit false overrides the css heuristic', () => {
    const component = defineComponent({
      template,
      css: 'li { white-space: pre-wrap; }',
      preserveWhitespace: false,
    });
    expect(component.ast[0].html).toBe('<ul><li>a</li></ul>');
  });

  it('preserves whitespace for white-space-collapse values', () => {
    const component = defineComponent({ template, css: '.code { white-space-collapse: preserve; }' });
    expect(component.ast[0].html).toContain('\n');
  });

  it('still condenses for non-sensitive white-space values', () => {
    const component = defineComponent({ template, css: 'li { white-space: nowrap; }' });
    expect(component.ast[0].html).toBe('<ul><li>a</li></ul>');
  });

  it('explicit true preserves without css', () => {
    const component = defineComponent({ template, preserveWhitespace: true });
    expect(component.ast[0].html).toContain('\n');
  });
});
