import { defineComponent } from '@semantic-ui/component';
import { $ } from '@semantic-ui/query';
import { afterEach, describe, expect, it } from 'vitest';

let counter = 0;
const uniqueTag = () => `update-test-${++counter}`;
const tick = () => new Promise((resolve) => setTimeout(resolve, 0));
const text = (el) => el.shadowRoot.textContent.replace(/\s+/g, ' ').trim();

async function mountTag(definition) {
  const tag = uniqueTag();
  defineComponent({ tagName: tag, ...definition });
  const el = document.createElement(tag);
  document.body.append(el);
  await el.rendered;
  return el;
}

afterEach(() => {
  document.body.innerHTML = '';
});

describe('el.update', () => {
  it('reaches an expression, a conditional, and a loop that read a plain key', async () => {
    const el = await mountTag({
      template: '<p>{title}</p>{#if showList}<ul>{#each item in items}<li>{item}</li>{/each}</ul>{/if}',
    });
    expect(el.update({ title: 'first', showList: true, items: ['a', 'b'] })).toBeUndefined();
    await tick();
    expect(el.shadowRoot.querySelector('p').textContent).toBe('first');
    expect(el.shadowRoot.querySelectorAll('li').length).toBe(2);

    el.update({ title: 'second', showList: false });
    await tick();
    expect(el.shadowRoot.querySelector('p').textContent).toBe('second');
    expect(el.shadowRoot.querySelector('ul')).toBeNull();
  });

  it('reaches a subtemplate prop bound to a plain key', async () => {
    const child = defineComponent({ template: '<span class="label">{label}</span>' });
    const el = await mountTag({
      template: '{>child label=heading}',
      subTemplates: { child },
    });
    el.update({ heading: 'one' });
    await tick();
    expect(el.shadowRoot.querySelector('.label').textContent).toBe('one');

    el.update({ heading: 'two' });
    await tick();
    expect(el.shadowRoot.querySelector('.label').textContent).toBe('two');
  });

  it('moves a declared setting through its signal without touching unrelated bindings', async () => {
    let marks = 0;
    const el = await mountTag({
      template: '<p>{label}</p><b>{mark}</b>',
      defaultSettings: { label: 'start' },
      createComponent: () => ({
        mark: () => {
          marks++;
          return '';
        },
      }),
    });
    const marksAfterRender = marks;
    const updated = $(el).onNext('updated');
    el.update({ label: 'next' });
    await updated;
    expect(el.shadowRoot.querySelector('p').textContent).toBe('next');
    expect(el.label).toBe('next');
    expect(marks).toBe(marksAfterRender);
  });

  it('fires updated after a property write', async () => {
    const el = await mountTag({
      template: '<p>{label}</p>',
      defaultSettings: { label: 'start' },
    });
    const updated = $(el).onNext('updated');
    el.label = 'written';
    await updated;
    expect(el.shadowRoot.querySelector('p').textContent).toBe('written');
  });
});

describe('rerender', () => {
  async function mountWithRerender(definition) {
    let rerender;
    const el = await mountTag({
      ...definition,
      createComponent: (params) => {
        rerender = params.rerender;
        return definition.createComponent ? definition.createComponent(params) : {};
      },
    });
    return { el, rerender };
  }

  it('re-evaluates every binding in place and rebuilds rerender regions', async () => {
    let reads = 0;
    let builds = 0;
    const { el, rerender } = await mountWithRerender({
      template: '<p>{stamp}</p>{#rerender version}<b>{built}</b>{/rerender}',
      createComponent: () => ({
        stamp: () => `s${++reads}`,
        built: () => `b${++builds}`,
      }),
    });
    expect(text(el)).toBe('s1b1');
    const paragraph = el.shadowRoot.querySelector('p');
    const region = el.shadowRoot.querySelector('b');

    rerender();
    await tick();
    expect(text(el)).toBe('s2b2');
    expect(el.shadowRoot.querySelector('p')).toBe(paragraph);
    expect(el.shadowRoot.querySelector('b')).not.toBe(region);
  });

  it('reads a property written behind the accessor', async () => {
    const { el, rerender } = await mountWithRerender({
      template: '<p>{label}</p>',
      properties: { label: { type: String, noAccessor: true } },
      defaultSettings: { label: 'start' },
    });
    el.label = 'bypassed';
    rerender();
    await tick();
    expect(el.shadowRoot.querySelector('p').textContent).toBe('bypassed');
  });

  it('resolves el.updated after a rerender that changes nothing', async () => {
    const { el, rerender } = await mountWithRerender({
      template: '<p>{label}</p>',
      defaultSettings: { label: 'start' },
    });
    rerender();
    await tick();
    rerender();
    await tick();
    const result = await Promise.race([
      el.updated.then(() => 'resolved'),
      new Promise((resolve) => setTimeout(() => resolve('hung'), 50)),
    ]);
    expect(result).toBe('resolved');
  });
});
