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

  it('updates a spec attribute and camelCases hyphenated defaultValues', async () => {
    const el = await mountTag({
      template: '<div class="{uiClasses}btn">{#if iconAfter}after{/if}</div>',
      componentSpec: {
        attributes: ['color', 'icon-after'],
        propertyTypes: { color: 'string', 'icon-after': 'boolean' },
        allowedValues: { color: ['blue', 'red'] },
        optionAttributes: { blue: 'color', red: 'color' },
        attributeClasses: ['color'],
        defaultValues: { 'icon-after': false },
      },
    });
    expect(el.defaultSettings.iconAfter).toBe(false);
    expect(el.defaultSettings['icon-after']).toBeUndefined();

    const updated = $(el).onNext('updated');
    el.update({ color: 'red', iconAfter: true });
    await updated;
    expect(el.color).toBe('red');
    expect(el.iconAfter).toBe(true);
    expect(el.shadowRoot.querySelector('.btn').className).toBe('red color icon-after btn');
    expect(el.shadowRoot.querySelector('.btn').textContent).toBe('after');
  });

  it('updates every matched element through $(selector).update()', async () => {
    const tag = uniqueTag();
    defineComponent({
      tagName: tag,
      template: '<p>{label}</p>',
      defaultSettings: { label: 'start' },
    });
    const first = document.createElement(tag);
    const second = document.createElement(tag);
    document.body.append(first, second);
    await Promise.all([first.rendered, second.rendered]);

    const $els = $(tag);
    expect($els.update({ label: 'all' })).toBe($els);
    await tick();
    expect(first.shadowRoot.querySelector('p').textContent).toBe('all');
    expect(second.shadowRoot.querySelector('p').textContent).toBe('all');
  });

  it('absorbs properties set before custom element upgrade so settings writes stay in sync', async () => {
    const childTag = uniqueTag();
    defineComponent({
      tagName: childTag,
      template: '<p>{value}</p>',
      defaultSettings: { value: '' },
      componentSpec: {
        attributes: ['value'],
        propertyTypes: { value: 'string' },
      },
      createComponent: ({ settings, dispatchEvent }) => ({
        setValue(val) {
          settings.value = val;
          dispatchEvent('change', { value: val });
        },
      }),
    });

    // parent template binds value={active} on child inside the inert template fragment before upgrade
    const parent = await mountTag({
      template: `<${childTag} value={active}></${childTag}>`,
      defaultState: { active: 'first' },
      events: {
        [`change ${childTag}`]({ state, data }) {
          state.active.set(data.value);
        },
      },
    });
    const child = parent.shadowRoot.querySelector(childTag);
    await child.rendered;

    expect(child.shadowRoot.querySelector('p').textContent).toBe('first');

    child.component.setValue('second');
    await tick();
    expect(child.value).toBe('second');
    expect(child.settingsVars.get('value').peek()).toBe('second');
    expect(child.shadowRoot.querySelector('p').textContent).toBe('second');

    child.component.setValue('first');
    await tick();
    expect(child.value).toBe('first');
    expect(child.settingsVars.get('value').peek()).toBe('first');
    expect(child.shadowRoot.querySelector('p').textContent).toBe('first');
    expect(Object.hasOwn(child, 'value')).toBe(false);
  });

  it('absorbs a property written before the definition exists', async () => {
    const tag = uniqueTag();
    const el = document.createElement(tag);
    el.value = 'pre';
    document.body.append(el);
    expect(Object.hasOwn(el, 'value')).toBe(true);

    defineComponent({
      tagName: tag,
      template: '<p>{value}</p>',
      defaultSettings: { value: '' },
      createComponent: ({ settings }) => ({
        setValue(val) {
          settings.value = val;
        },
      }),
    });
    await el.rendered;
    expect(Object.hasOwn(el, 'value')).toBe(false);
    expect(el.value).toBe('pre');
    expect(el.settingsVars.get('value').peek()).toBe('pre');
    expect(el.shadowRoot.querySelector('p').textContent).toBe('pre');

    el.component.setValue('next');
    await tick();
    expect(el.value).toBe('next');
    expect(el.settingsVars.get('value').peek()).toBe('next');
    expect(el.shadowRoot.querySelector('p').textContent).toBe('next');
  });

  it('absorbs .prop bindings set before custom element upgrade so later updates re-render', async () => {
    const childTag = uniqueTag();
    defineComponent({
      tagName: childTag,
      template: '<p>{item.label}</p>',
      defaultSettings: { item: { label: 'default' } },
    });

    const parent = await mountTag({
      template: `<${childTag} .item={item}></${childTag}>`,
      defaultState: { item: { label: 'first' } },
    });
    const child = parent.shadowRoot.querySelector(childTag);
    await child.rendered;

    expect(child.shadowRoot.querySelector('p').textContent).toBe('first');

    parent.template.state.item.set({ label: 'second' });
    await tick();
    await tick();
    expect(child.item).toEqual({ label: 'second' });
    expect(child.shadowRoot.querySelector('p').textContent).toBe('second');
    expect(Object.hasOwn(child, 'item')).toBe(false);
  });

  it('keeps el.dataContext and $(el).dataContext() live after updates and falls back to defaultSettings on null', async () => {
    const el = await mountTag({
      template: '<p>{label} {extra}</p>',
      defaultSettings: { label: 'default' },
    });
    expect(Object.hasOwn(el, 'dataContext')).toBe(true);
    expect(el.dataContext.label).toBe('default');

    el.update({ label: 'updated', extra: 'added' });
    expect(el.dataContext.label).toBe('updated');
    expect(el.dataContext.extra).toBe('added');
    expect($(el).dataContext().extra).toBe('added');

    el.settings.label = null;
    expect(el.dataContext.label).toBe('default');
    expect(el.template.getDataContext().label).toBe('default');
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

  it('syncs direct writes to template.data on a bare template', async () => {
    const Card = defineComponent({
      template: '<p>{title}</p>',
    });
    const tpl = Card.clone({ data: { title: 'first' } });
    tpl.initialize();
    const host = document.createElement('div');
    host.append(tpl.render());
    document.body.append(host);
    expect(host.querySelector('p').textContent).toBe('first');

    tpl.data.title = 'second';
    tpl.rerender();
    await tick();
    expect(host.querySelector('p').textContent).toBe('second');
  });
});

// getData() carries darkMode as a getter so a template reads the theme only when a
// binding asks. a data sync that reads it pays a getComputedStyle per update
describe('darkMode', () => {
  it('syncs a setting, plain data, and a rerender without reading isDarkMode', async () => {
    const el = await mountTag({
      template: '<p>{label}</p>',
      defaultSettings: { label: 'start' },
    });
    let reads = 0;
    el.isDarkMode = () => {
      reads++;
      return false;
    };

    el.label = 'next';
    await tick();
    expect(el.shadowRoot.querySelector('p').textContent).toBe('next');

    el.update({ aside: 1 });
    await tick();

    el.template.rerender();
    await tick();

    expect(reads).toBe(0);
  });

  it('reads isDarkMode each time a binding evaluates it', async () => {
    const tag = uniqueTag();
    defineComponent({ tagName: tag, template: '{#if darkMode}dark{else}light{/if}' });
    const el = document.createElement(tag);
    let dark = true;
    let reads = 0;
    el.isDarkMode = () => {
      reads++;
      return dark;
    };
    document.body.append(el);
    await el.rendered;
    expect(text(el)).toBe('dark');
    expect(reads).toBe(1);

    dark = false;
    el.template.rerender();
    await tick();
    expect(text(el)).toBe('light');
    expect(reads).toBe(2);
  });
});
