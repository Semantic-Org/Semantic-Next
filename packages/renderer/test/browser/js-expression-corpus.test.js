import { defineComponent } from '@semantic-ui/component';
import { describe, expect, it } from 'vitest';

/*
  JS-style expressions taken verbatim from the shipped corpus — src/components,
  src/primitives, and docs/src/examples. Resolving a data-context function to its
  value changes what identifiers mean inside these, so this is the net the change
  has to pass through. Each renders in its own component because each came from
  one, and two of them name `items` with different shapes.
*/

const baseState = { index: 2, activeIndex: 1, width: 5, status: 'success', filter: 'all' };

const baseData = {
  scores: [10, 20, 30],
  prices: [1.5, 2.5, 3],
  items: ['Apple', 'Banana', 'Blueberry'],
  field: { placeholder: '' },
  item: { packed: true },
  user: { profile: { bio: 'Hi' } },
  stats: { successCount: 4 },
  formatScore: (n) => `#${n}`,
  getMax: (list) => Math.max(...list),
};

const cases = [
  ['{index + 1}', '3'],
  ['{scores.length * 2}', '6'],
  ['{width > 0 ? width : 0}', '5'],
  ['{status === "success" ? "Success" : "Failed"}', 'Success'],
  ['{activeIndex == index ? "0" : "-1"}', '-1'],
  ['{filter != "all" ? filter : "none"}', 'none'],
  ['{field.placeholder || "Select..."}', 'Select...'],
  ['{item.packed ? "circle-check" : "circle"}', 'circle-check'],
  ['{user?.profile?.bio ?? "No bio"}', 'Hi'],
  ['{stats[status + "Count"] || 0}', '4'],
  ['{Math.max(...scores)}', '30'],
  ['{items.filter(item => item.startsWith("B")).join(" and ")}', 'Banana and Blueberry'],
  ['{(prices.reduce((a, b) => a + b, 0) / prices.length).toFixed(2)}', '2.33'],
  ['{formatScore(scores[0])}', '#10'],
  ['{getMax(scores)}', '30'],
  ['{items.find(i => i.active).name}', 'B', { items: [{ active: false, name: 'A' }, { active: true, name: 'B' }] }],
];

const renderCase = async (index, expr, extraData) => {
  const tagName = `js-corpus-${index}`;
  defineComponent({
    tagName,
    template: `<b class="c">${expr}</b>`,
    defaultState: baseState,
    createComponent: () => ({ ...baseData, ...extraData }),
  });
  const element = document.createElement(tagName);
  document.body.appendChild(element);
  await element.rendered;
  const text = element.shadowRoot.querySelector('.c').textContent;
  element.remove();
  return text;
};

describe('native — JS expressions from the shipped corpus', () => {
  cases.forEach(([expr, want, extraData], index) => {
    it(`renders ${expr}`, async () => {
      expect(await renderCase(index, expr, extraData)).toBe(want);
    });
  });
});
