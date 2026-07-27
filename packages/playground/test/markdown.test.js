// @vitest-environment jsdom
import { describe, expect, it } from 'vitest';

import { renderMarkdown } from '../src/editor/intelligence.js';

const render = (text, resolveLink) => renderMarkdown(text, resolveLink);

describe('renderMarkdown', () => {
  it('renders the shape TypeScript hands over for a lib symbol', () => {
    const dom = render(
      'The **`console.log()`** static method outputs a message to the console.\n\n'
        + '[MDN Reference](https://developer.mozilla.org/docs/Web/API/console/log_static)',
    );
    expect(dom.querySelectorAll('p')).toHaveLength(2);
    expect(dom.querySelector('strong code').textContent).toBe('console.log()');
    const link = dom.querySelector('a');
    expect(link.textContent).toBe('MDN Reference');
    expect(link.target).toBe('_blank');
    expect(dom.textContent).not.toContain('**');
  });

  it('terminates on repeated emphasis, which recurses', () => {
    // a shared /g/ regex would rematch the first span forever and exhaust memory
    const dom = render('**one** then **two** then *three*');
    expect([...dom.querySelectorAll('strong')].map(node => node.textContent)).toEqual(['one', 'two']);
    expect(dom.querySelector('em').textContent).toBe('three');
    expect(dom.textContent).toBe('one then two then three');
  });

  it('soft-wraps single newlines and breaks on blank lines', () => {
    const dom = render('Creates a reaction.\nThe callback re-runs when signals change.\n\nSecond paragraph.');
    const paragraphs = [...dom.querySelectorAll('p')].map(p => p.textContent);
    expect(paragraphs).toEqual([
      'Creates a reaction. The callback re-runs when signals change.',
      'Second paragraph.',
    ]);
  });

  it('renders fenced code verbatim, without inline parsing', () => {
    const dom = render('Example:\n\n```js\nconst a = **b**;\n```');
    expect(dom.querySelector('pre').textContent).toBe('const a = **b**;');
    expect(dom.querySelector('pre strong')).toBeNull();
  });

  it('renders bullet lists', () => {
    const dom = render('Options:\n\n- `clone` copies values\n- `reference` stores by reference');
    const items = [...dom.querySelectorAll('li')].map(item => item.textContent);
    expect(items).toEqual(['clone copies values', 'reference stores by reference']);
    expect(dom.querySelector('li code').textContent).toBe('clone');
  });

  it('routes links through resolveLink', () => {
    const dom = render(
      '[docs](https://next.semantic-ui.com/docs/api/reactivity/reaction)',
      (url) => url.replace('https://next.semantic-ui.com', ''),
    );
    expect(dom.querySelector('a').getAttribute('href')).toBe('/docs/api/reactivity/reaction');
  });

  it('never builds markup from the source text', () => {
    const dom = render('Sets <img src=x onerror=alert(1)> as the value');
    expect(dom.querySelector('img')).toBeNull();
    expect(dom.textContent).toContain('<img src=x onerror=alert(1)>');
  });
});
