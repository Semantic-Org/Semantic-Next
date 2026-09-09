import { defineComponent } from '@semantic-ui/component';
import { describe, expect, it } from 'vitest';

import { render, renderHTML, renderStatic } from '../src/index.js';

const Card = defineComponent({
  tagName: 'test-card',
  template: '<div class="card">{title}</div>',
  css: '.card { padding: 8px; }',
});

describe('@semantic-ui/server', () => {
  it('renders a component class to DSD', () => {
    const html = render(Card, { title: 'Hello' });
    expect(html).toContain('<test-card');
    expect(html).toContain('<template shadowrootmode="open">');
    expect(html).toContain('Hello');
  });

  it('renders by registered tag name', () => {
    const html = render('test-card', { title: 'Tagged' });
    expect(html).toContain('<test-card');
    expect(html).toContain('Tagged');
  });

  it('throws for an unregistered tag', () => {
    expect(() => render('not-registered')).toThrow(/not a registered component/);
  });

  it('expands registered tags inside an HTML string', () => {
    const html = renderHTML('<main><test-card title="In Page"></test-card></main>');
    expect(html).toContain('<main>');
    expect(html).toContain('<template shadowrootmode="open">');
    expect(html).toContain('In Page');
  });

  it('marks hydrate:false output with the ssr attribute', () => {
    const html = render(Card, { title: 'Static' }, { hydrate: false });
    expect(html).toMatch(/<test-card\s+ssr/);
  });

  it('renders a component to static markup without a shadow root', () => {
    expect(renderStatic(Card, { title: 'Plain' })).toBe('<div class="card">Plain</div>');
  });

  it('renders static markup by registered tag name, with css on request', () => {
    expect(renderStatic('test-card', { title: 'Tagged' }, { css: true })).toEqual({
      html: '<div class="card">Tagged</div>',
      css: '.card { padding: 8px; }',
    });
  });
});
