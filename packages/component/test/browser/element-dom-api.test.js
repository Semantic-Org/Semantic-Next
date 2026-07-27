import { $ } from '@semantic-ui/query';
import { describe, expect, it, vi } from 'vitest';
import { defineComponent } from '../../src/index.js';

/*
  el.$ / el.$$ are the DOM API for people consuming the elements this framework
  ships, as opposed to Template.$ / Template.$$ which serve people authoring in
  it. Both element methods delegate to the template so a consumer gets the same
  scoping an author gets. That delegation has been lost twice in engine
  refactors, so it is pinned here.
*/

let tagCounter = 0;
const uniqueTag = () => `element-dom-api-${++tagCounter}`;

const mount = async (config) => {
  const tag = uniqueTag();
  defineComponent({ tagName: tag, ...config });
  const el = document.createElement(tag);
  document.body.appendChild(el);
  await $(el).onNext('rendered');
  return el;
};

describe('element DOM API', () => {
  describe('el.$', () => {
    it('finds elements in the rendered tree', async () => {
      const el = await mount({ template: '<div class="content">hello</div>' });
      expect(el.$('.content').text()).toBe('hello');
      el.remove();
    });

    it('does not reach into a nested component shadow root', async () => {
      const innerTag = uniqueTag();
      defineComponent({ tagName: innerTag, template: '<span class="buried">deep</span>' });
      const el = await mount({ template: `<${innerTag}></${innerTag}>` });
      await $(el.shadowRoot.querySelector(innerTag)).onNext('rendered');
      expect(el.$('.buried').length).toBe(0);
      el.remove();
    });
  });

  describe('el.$$', () => {
    it('pierces into a nested component shadow root', async () => {
      const innerTag = uniqueTag();
      defineComponent({ tagName: innerTag, template: '<span class="buried">deep</span>' });
      const el = await mount({ template: `<${innerTag}></${innerTag}>` });
      await $(el.shadowRoot.querySelector(innerTag)).onNext('rendered');
      const found = Array.from(el.$$('.buried'));
      expect(found.length).toBe(1);
      expect(found[0].textContent).toBe('deep');
      el.remove();
    });
  });

  describe('before the element upgrades', () => {
    it('reports that the element has not rendered rather than failing silently', async () => {
      const tag = uniqueTag();
      defineComponent({ tagName: tag, template: '<div class="content">hi</div>' });
      const el = document.createElement(tag);
      const error = vi.spyOn(console, 'error').mockImplementation(() => {});
      try {
        // never appended, so no template exists yet
        expect(el.$('.content')).toBeUndefined();
        expect(el.$$('.content')).toBeUndefined();
        expect(error).toHaveBeenCalledTimes(2);
        expect(error.mock.calls[0][0]).toContain('rendered');
      }
      finally {
        error.mockRestore();
      }
    });
  });
});
