import { $ } from '@semantic-ui/query';
import { reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { defineComponent } from '../../src/index.js';

// Template.mount through the native engine: a caller hands over an element and the
// template takes it. Every test goes through defineComponent and a real element.

let tagCounter = 0;
const uniqueTag = (base) => `${base}-${String.fromCharCode(97 + (tagCounter++ % 26))}${tagCounter}`;

const tick = () => new Promise((resolve) => setTimeout(resolve, 0));

const defineRow = (extra = {}) =>
  defineComponent({
    template: '<div class="row">{label}<button class="bump">+</button></div>',
    css: '.row { color: rgb(1, 2, 3); }',
    defaultSettings: { label: 'default' },
    defaultState: { bumps: 0 },
    createComponent: ({ state, findParent }) => ({
      hostSeenAtCreate: findParent()?.templateName,
      bump() {
        state.bumps.increment();
      },
    }),
    events: {
      'click .bump'({ self }) {
        self.bump();
      },
    },
    ...extra,
  });

const rowColor = (root) => getComputedStyle(root.querySelector('.row')).color;

beforeEach(() => {
  document.body.innerHTML = '';
});

afterEach(() => {
  Template.renderedTemplates.clear();
});

describe('Template.mount', () => {
  describe('into an element in the document', () => {
    it('renders, stamps the element, and returns the live instance', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);

      const row = Row.mount(el, { settings: { label: 'first' } });

      expect(row).toBeInstanceOf(Template);
      expect(row).not.toBe(Row);
      expect(row.isPrototype).toBe(false);
      expect(row.isSubtemplate()).toBe(false);
      expect(el.textContent).toContain('first');
      expect(el.template).toBe(row);
      expect(el.component).toBe(row.instance);
      expect(el.dataContext.label).toBe('first');
      expect(el.settings.label).toBe('first');
      await row.lifecyclePromise('rendered');
    });

    it('adopts css onto the document and the rule reaches the mounted content', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      Row.mount(el);
      expect(rowColor(el)).toBe('rgb(1, 2, 3)');
    });

    it('falls back to declared defaults and accepts undeclared settings', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { extra: 'yes' } });
      expect(el.textContent).toContain('default');
      expect(row.getDataContext().extra).toBe('yes');
      expect(el.extra).toBe('yes');
    });

    it('registers in the template registry and leaves it on unmount', () => {
      const Row = defineRow({ templateName: 'registryRow' });
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el);
      expect(Template.getTemplates('registryRow')).toContain(row);
      row.unmount();
      expect(Template.getTemplates('registryRow')).not.toContain(row);
    });
  });

  describe('settings write paths', () => {
    it('updates the DOM through the settings proxy', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'one' } });
      row.settings.label = 'two';
      await tick();
      expect(el.textContent).toContain('two');
      expect(el.settings.label).toBe('two');
    });

    it('updates the DOM through Query, the same way a tag does', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'one' } });
      $(el).settings({ label: 'three' });
      await tick();
      expect(el.textContent).toContain('three');
      expect(row.settings.label).toBe('three');
    });

    it('delegates events on the element and keeps state per instance', async () => {
      const Row = defineRow();
      const a = document.createElement('div');
      const b = document.createElement('div');
      document.body.append(a, b);
      const rowA = Row.mount(a);
      const rowB = Row.mount(b);
      a.querySelector('.bump').click();
      a.querySelector('.bump').click();
      expect(rowA.state.bumps.get()).toBe(2);
      expect(rowB.state.bumps.get()).toBe(0);
    });
  });

  describe('inside a sui host', () => {
    const defineHost = () =>
      defineComponent({
        tagName: uniqueTag('mount-host'),
        template: '<section class="area"></section>',
      });

    it('registers the host before createComponent runs and finds it from both sides', async () => {
      const Host = defineHost();
      const Row = defineRow();
      const host = document.createElement(Host.componentTagName);
      document.body.append(host);
      await host.rendered;
      const area = host.shadowRoot.querySelector('.area');

      const row = Row.mount(area);

      expect(row.instance.hostSeenAtCreate).toBe(host.template.templateName);
      expect(row.findParent()?.templateName).toBe(host.template.templateName);
      expect(host.template.findChildren()).toContainEqual(expect.objectContaining({ templateName: row.templateName }));
      expect(host.template._childTemplates).toContain(row);
    });

    it("adopts css onto the host's shadow root, not the document", () => {
      const Host = defineHost();
      // a colour no other test adopts, since document sheets outlive a test
      const Row = defineRow({ css: '.row { color: rgb(4, 5, 6); }' });
      const host = document.createElement(Host.componentTagName);
      const outside = document.createElement('div');
      outside.innerHTML = '<div class="row">outside</div>';
      document.body.append(host, outside);
      const area = host.shadowRoot.querySelector('.area');

      Row.mount(area);

      expect(rowColor(host.shadowRoot)).toBe('rgb(4, 5, 6)');
      expect(rowColor(outside)).not.toBe('rgb(4, 5, 6)');
    });

    it('unregisters from the host on unmount', async () => {
      const Host = defineHost();
      const Row = defineRow();
      const host = document.createElement(Host.componentTagName);
      document.body.append(host);
      await host.rendered;
      const row = Row.mount(host.shadowRoot.querySelector('.area'));
      row.unmount();
      expect(host.template._childTemplates).not.toContain(row);
    });
  });

  describe('inside a foreign shadow root', () => {
    it('renders, finds no sui parent, and adopts css onto that root', () => {
      const Row = defineRow();
      const foreign = document.createElement('div');
      const shadow = foreign.attachShadow({ mode: 'open' });
      const area = document.createElement('div');
      shadow.append(area);
      document.body.append(foreign);

      const row = Row.mount(area, { settings: { label: 'inside' } });

      expect(area.textContent).toContain('inside');
      expect(row.findParent()).toBeUndefined();
      expect(rowColor(shadow)).toBe('rgb(1, 2, 3)');
    });
  });

  describe('lifecycle events', () => {
    it('dispatches rendered and destroyed from the element', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const seen = [];
      el.addEventListener('rendered', () => seen.push('rendered'));
      el.addEventListener('destroyed', () => seen.push('destroyed'));

      const row = Row.mount(el);
      await row.lifecyclePromise('rendered');
      row.unmount();

      expect(seen).toEqual(['rendered', 'destroyed']);
    });
  });

  describe('unmount', () => {
    it('removes the content, the stamps, and the accessors, and is idempotent', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'gone' } });

      row.unmount();

      expect(el.childNodes.length).toBe(0);
      expect(el.template).toBeUndefined();
      expect(el.component).toBeUndefined();
      expect(el.dataContext).toBeUndefined();
      expect(el.settings).toBeUndefined();
      expect('label' in el).toBe(false);
      expect(row.destroyed).toBe(true);
      expect(row.mounted).toBeNull();
      expect(() => row.unmount()).not.toThrow();
    });

    it('leaves adopted css in place for siblings', () => {
      const Row = defineRow();
      const a = document.createElement('div');
      const b = document.createElement('div');
      document.body.append(a, b);
      const rowA = Row.mount(a);
      Row.mount(b);
      rowA.unmount();
      expect(rowColor(b)).toBe('rgb(1, 2, 3)');
    });

    it('cascades from an AbortSignal', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const controller = new AbortController();
      const row = Row.mount(el, { signal: controller.signal });
      controller.abort();
      expect(row.destroyed).toBe(true);
      expect(el.childNodes.length).toBe(0);
    });

    it('refuses a signal that is already aborted', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const controller = new AbortController();
      controller.abort();
      expect(() => Row.mount(el, { signal: controller.signal }))
        .toThrow(expect.objectContaining({ code: 'expiredSignal', at: 'Template.mount' }));
      expect(el.template).toBeUndefined();
    });
  });

  describe('prototype and instance', () => {
    it('mounts a prototype many times with independent instances', () => {
      const Row = defineRow();
      const a = document.createElement('div');
      const b = document.createElement('div');
      document.body.append(a, b);
      const rowA = Row.mount(a, { settings: { label: 'a' } });
      const rowB = Row.mount(b, { settings: { label: 'b' } });
      expect(rowA).not.toBe(rowB);
      expect(a.textContent).toContain('a');
      expect(b.textContent).toContain('b');
    });

    it('mounts an instance once and refuses a second mount', () => {
      const Row = defineRow();
      const a = document.createElement('div');
      const b = document.createElement('div');
      document.body.append(a, b);
      const row = Row.mount(a);
      expect(() => row.mount(b)).toThrow(expect.objectContaining({ code: 'duplicateMount', at: 'Template.mount' }));
    });

    it('refuses an anchor until the range form exists', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      expect(() => Row.mount(el, { anchor: el })).toThrow(
        expect.objectContaining({ code: 'unsupportedAnchor', at: 'Template.mount' }),
      );
    });

    it('mounts from a tagged class through its prototype template', () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-tagged'),
        template: '<p class="tagged">{label}</p>',
        defaultSettings: { label: 'tagged' },
      });
      const el = document.createElement('div');
      document.body.append(el);
      const instance = Tagged.mount(el, { settings: { label: 'via class' } });
      expect(instance).toBeInstanceOf(Template);
      expect(el.textContent).toContain('via class');
    });
  });

  describe('content composition', () => {
    it('attaches subtemplates rendered inside the mounted content', () => {
      const Item = defineComponent({
        template: '<span class="item">{name}</span>',
        events: {
          'click .item'({ self }) {
            self.clicked = true;
          },
        },
      });
      const List = defineComponent({
        template: '<ul>{#each item in items}{> item name=item}{/each}</ul>',
        defaultSettings: { items: ['x', 'y'] },
        subTemplates: { item: Item },
      });
      const el = document.createElement('div');
      document.body.append(el);

      const list = List.mount(el);
      const items = el.querySelectorAll('.item');
      expect(items.length).toBe(2);
      items[1].click();
      const children = list.findChildren();
      expect(children.length).toBe(2);
      expect(children.some((child) => child.clicked)).toBe(true);
    });

    it('is found by tagged children upgrading inside its content, from their createComponent on', async () => {
      const Child = defineComponent({
        tagName: uniqueTag('mount-child'),
        template: '<i>child</i>',
        createComponent: ({ findParent }) => ({
          parentSeenAtCreate: findParent()?.templateName,
        }),
      });
      const Wrapper = defineComponent({
        templateName: 'mountWrapper',
        template: `<div><${Child.componentTagName}></${Child.componentTagName}></div>`,
      });
      const el = document.createElement('div');
      document.body.append(el);

      const wrapper = Wrapper.mount(el);
      const child = el.querySelector(Child.componentTagName);
      await child.rendered;

      // a defined element upgrades during insertion, so the parent must be stamped before render
      expect(child.component.parentSeenAtCreate).toBe('mountWrapper');
      expect(child.template.findParent()?.templateName).toBe('mountWrapper');
      expect(wrapper.findChildren().length).toBe(1);
    });
  });

  describe('reactivity hygiene', () => {
    it('does not register the render on an enclosing reaction', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      let runs = 0;
      let row;
      reaction(() => {
        runs++;
        row = Row.mount(el);
      });
      row.settings.label = 'changed';
      row.state.bumps.increment();
      await tick();
      expect(runs).toBe(1);
      expect(el.textContent).toContain('changed');
    });
  });
});
