import { $ } from '@semantic-ui/query';
import { reaction } from '@semantic-ui/reactivity';
import { Renderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { LitEngine } from '../../src/engines/lit/register.js';
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
    it('renders, attaches component properties to the element, and returns the live instance', async () => {
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
      expect(el.isLightDOM).toBe(true);
      expect(el.isCustomElement).toBe(false);
      expect(el.isMounted).toBe(true);
      expect(el.isRendered).toBe(true);
      await el.rendered;
    });

    it('adopts css onto the document and the rule reaches the mounted content', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      Row.mount(el);
      expect(rowColor(el)).toBe('rgb(1, 2, 3)');
    });

    it('mounts into a detached element, its css adopted onto the document', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      const row = Row.mount(el, { settings: { label: 'detached' } });
      expect(el.textContent).toContain('detached');
      document.body.append(el);
      expect(rowColor(el)).toBe('rgb(1, 2, 3)');
      row.unmount();
    });

    it('falls back to declared defaults and accepts undeclared settings', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const item = { type: 'invoice', noAccessor: true };
      const row = Row.mount(el, { settings: { extra: 'yes', item } });
      expect(el.textContent).toContain('default');
      expect(row.getDataContext().extra).toBe('yes');
      expect(el.extra).toBe('yes');
      expect(el.item).toBe(item);
      expect(row.settings.item).toBe(item);
    });

    it('refuses an undeclared setting named like something the element already has', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      // an attached template property, a base method, and a native DOM property
      for (const name of ['component', 'render', 'title']) {
        expect(() => Row.mount(el, { settings: { [name]: 'taken' } }))
          .toThrow(expect.objectContaining({ code: 'reservedSetting', at: 'Template.mount' }));
      }
      // a refused mount leaves the element untouched so a subsequent mount succeeds
      expect(Object.getPrototypeOf(el)).toBe(HTMLDivElement.prototype);
      expect(el.title).toBe('');
      const row = Row.mount(el, { settings: { label: 'after' } });
      expect(el.textContent).toContain('after');
      row.unmount();
    });

    it('refuses the same reserved name on a fresh element and on one that was unmounted', () => {
      const Row = defineRow();
      const refused = expect.objectContaining({ code: 'reservedSetting', at: 'Template.mount' });
      // pendingRender is only assigned on update, so construct() must pre-initialize it
      const fresh = document.createElement('div');
      document.body.append(fresh);
      expect(() => Row.mount(fresh, { settings: { pendingRender: true } })).toThrow(refused);
      const used = document.createElement('div');
      document.body.append(used);
      Row.mount(used, { settings: { label: 'once' } }).unmount();
      expect(() => Row.mount(used, { settings: { pendingRender: true } })).toThrow(refused);
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

    it('updates an undeclared setting passed at mount, through the proxy and through Query', async () => {
      const Row = defineComponent({
        template: '<p class="row">{route}</p>',
        defaultSettings: { label: 'declared' },
      });
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { route: 'home' } });
      expect(el.textContent).toContain('home');

      row.settings.route = 'about';
      await tick();
      expect(el.textContent).toContain('about');

      $(el).settings({ route: 'contact' });
      await tick();
      expect(el.textContent).toContain('contact');
    });

    it('renders the data a render call carries, on a mounted template and on a tag', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'mounted' } });
      row.render({ label: 'carried' });
      expect(el.pendingRender).toBeFalsy();
      await tick();
      expect(el.textContent).toContain('carried');
      expect(el.settings.label).toBe('carried');

      const Tagged = defineComponent({
        tagName: uniqueTag('mount-render'),
        template: '<p class="row">{label}</p>',
        defaultSettings: { label: 'tag' },
      });
      const tag = document.createElement(Tagged.componentTagName);
      document.body.append(tag);
      await tag.rendered;
      tag.render({ label: 'carried too' });
      expect(tag.pendingRender).toBeFalsy();
      await tick();
      expect(tag.shadowRoot.textContent).toContain('carried too');
      expect(tag.label).toBe('carried too');

      tag.update({ label: 'updated too' });
      expect(tag.pendingRender).toBeFalsy();
      await tick();
      expect(tag.shadowRoot.textContent).toContain('updated too');
      expect(tag.label).toBe('updated too');

      // undeclared settings passed at mount are updated too
      const Route = defineComponent({ template: '<p>{route}</p>' });
      const outlet = document.createElement('div');
      document.body.append(outlet);
      Route.mount(outlet, { settings: { route: 'home' } });
      outlet.update({ route: 'about' });
      expect(outlet.pendingRender).toBeFalsy();
      await tick();
      expect(outlet.textContent).toContain('about');

      // a state key with the same name as a declared setting does not write its Signal into the property
      const Colliding = defineComponent({
        template: '<p>{count}</p>',
        defaultSettings: { count: 1 },
        defaultState: { count: 10 },
      });
      const host = document.createElement('div');
      document.body.append(host);
      Colliding.mount(host);
      expect(host.count).toBeUndefined();
      expect(host.settings.count).toBe(1);
    });

    it('renders the default again when a setting is cleared, mounted, native tag, and lit tag', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'set', extra: 'ephemeral' } });
      row.settings.label = null;
      row.settings.extra = undefined;
      expect(row.settings.label).toBe('default');
      await tick();
      expect(el.textContent).toContain('default');
      expect(row.settings.extra).toBeUndefined();
      expect(el.extra).toBeUndefined();

      for (const engine of ['native', LitEngine]) {
        const Tagged = defineComponent({
          tagName: uniqueTag('mount-clear'),
          renderingEngine: engine,
          template: '<p>{label}</p>',
          defaultSettings: { label: 'default' },
        });
        const tag = document.createElement(Tagged.componentTagName);
        tag.setAttribute('label', 'set');
        document.body.append(tag);
        await tag.rendered;
        await tick();
        expect(tag.shadowRoot.textContent).toContain('set');
        tag.removeAttribute('label');
        await tick();
        await tick();
        expect(tag.shadowRoot.textContent).toContain('default');
      }
    });

    it('renders a write that bypassed the accessor at the next render, on a tag', async () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-bypass'),
        template: '<p>{foo}</p>',
        properties: { foo: { type: String, noAccessor: true } },
        defaultSettings: { foo: 'a' },
      });
      const tag = document.createElement(Tagged.componentTagName);
      document.body.append(tag);
      await tag.rendered;
      expect(tag.shadowRoot.textContent).toContain('a');
      tag.foo = 'b';
      tag.requestUpdate();
      await tick();
      await tick();
      expect(tag.shadowRoot.textContent).toContain('b');
    });

    it('reaches a reaction on settings by the render a property write schedules', async () => {
      const seen = [];
      const Row = defineComponent({
        template: '<p>{label}</p>',
        defaultSettings: { label: 'start' },
        createComponent: ({ settings, reaction }) => {
          reaction(() => {
            seen.push(settings.label);
          });
          return {};
        },
      });
      const el = document.createElement('div');
      document.body.append(el);
      Row.mount(el);
      expect(seen).toEqual(['start']);
      el.label = 'written';
      await tick();
      expect(seen).toEqual(['start', 'written']);
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

    it('finds its host from createComponent on and is found by the host', async () => {
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
      expect(host.template.findChildren().length).toBe(1);
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

    it('is no longer found by the host after unmount', async () => {
      const Host = defineHost();
      const Row = defineRow();
      const host = document.createElement(Host.componentTagName);
      document.body.append(host);
      await host.rendered;
      const row = Row.mount(host.shadowRoot.querySelector('.area'));
      expect(host.template.findChildren().length).toBe(1);
      row.unmount();
      expect(host.template.findChildren().length).toBe(0);
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
    it('removes rendered content, attached properties, and accessors, and is idempotent', () => {
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
      expect(row.mounted).toBe(false);
      expect(() => row.unmount()).not.toThrow();
    });

    it('unmounts directly from the element', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'gone' } });

      el.unmount();

      expect(el.childNodes.length).toBe(0);
      expect(el.template).toBeUndefined();
      expect(el.unmount).toBeUndefined();
      expect(row.destroyed).toBe(true);
      expect(row.mounted).toBe(false);
    });

    it('reads settings as nothing after unmount instead of throwing', () => {
      let captured;
      const Row = defineRow({
        createComponent: ({ settings }) => {
          captured = settings;
          return {};
        },
      });
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'gone' } });
      expect(captured.label).toBe('gone');
      row.unmount();
      expect(row.settings).toBeUndefined();
      // a proxy captured in a callback before unmount returns undefined and ignores writes
      expect(captured.label).toBeUndefined();
      captured.label = 'late';
      expect(captured.label).toBeUndefined();
      expect(Object.hasOwn(el, 'label')).toBe(false);
    });

    it('keeps a custom element its own prototype when it unmounts from light dom', async () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-own-light'),
        template: '<p>{label}</p>',
        defaultSettings: { label: 'own' },
      });
      const el = document.createElement(Tagged.componentTagName);
      document.body.append(el);
      await el.rendered;
      // a defined element rendering into light dom is the roadmap's next rung and does not
      // exist yet, so its one visible state is set by hand: isLightDOM with an owned identity
      el.isLightDOM = true;
      expect(() => el.unmount()).not.toThrow();
      expect(el instanceof Tagged).toBe(true);
      expect(el.properties).toBeInstanceOf(Map);
      el.remove();
      document.body.append(el);
      await el.rendered;
      expect(el.shadowRoot.textContent).toBe('own');
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

    it('is a no-op on a template that was never mounted', () => {
      const Row = defineRow();
      expect(() => Row.unmount()).not.toThrow();
      const Bare = defineComponent({
        renderingEngine: { renderer: Renderer },
        template: '<i>bare</i>',
      });
      expect(() => Bare.unmount()).not.toThrow();
      expect(() => Bare.clone().unmount()).not.toThrow();
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

    it("keeps a mounted clone's own data under passed settings and above declared defaults", () => {
      const Row = defineRow();
      const a = document.createElement('div');
      const b = document.createElement('div');
      document.body.append(a, b);

      const own = Row.clone({ data: { label: 'custom' } }).mount(a);
      expect(a.textContent).toContain('custom');
      // darkMode stays a live getter on the merged data, not a flattened boolean
      expect(typeof Object.getOwnPropertyDescriptor(own.data, 'darkMode')?.get).toBe('function');

      Row.clone({ data: { label: 'custom' } }).mount(b, { settings: { label: 'passed' } });
      expect(b.textContent).toContain('passed');
    });

    it('mounts an instance once and refuses a second mount', () => {
      const Row = defineRow();
      const a = document.createElement('div');
      const b = document.createElement('div');
      document.body.append(a, b);
      const row = Row.mount(a);
      expect(() => row.mount(b)).toThrow(expect.objectContaining({ code: 'duplicateMount', at: 'Template.mount' }));
      row.unmount();
      // a destroyed instance cannot be remounted, only the prototype can mount again
      expect(() => row.mount(b)).toThrow(expect.objectContaining({ code: 'duplicateMount', at: 'Template.mount' }));
      expect(() => Row.mount(b)).not.toThrow();
    });

    it('refuses a target that already carries a mounted template', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const first = Row.mount(el, { settings: { label: 'first' } });
      expect(() => Row.mount(el)).toThrow(expect.objectContaining({ code: 'duplicateMount', at: 'Template.mount' }));
      expect(first.destroyed).toBe(false);
      expect(el.textContent).toContain('first');
      first.unmount();
      expect(() => Row.mount(el)).not.toThrow();
    });

    it('refuses through an engine that has no mount', () => {
      const Bare = defineComponent({
        renderingEngine: { renderer: Renderer },
        template: '<i>bare</i>',
      });
      const el = document.createElement('div');
      document.body.append(el);
      expect(() => Bare.mount(el)).toThrow(
        expect.objectContaining({ code: 'unsupportedEngine', at: 'Template.mount' }),
      );
    });

    it('leaves nothing on the element when createComponent throws, and a retry owns it', () => {
      let ticks = 0;
      const Broken = defineComponent({
        template: '<i>never</i>',
        defaultSettings: { label: 'first' },
        createComponent: ({ interval }) => {
          interval(() => ticks++, 1);
          throw new Error('boom');
        },
      });
      const el = document.createElement('div');
      document.body.append(el);
      expect(() => Broken.mount(el, { settings: { label: 'first' } })).toThrow('boom');
      expect(el.template).toBeUndefined();
      expect(el.component).toBeUndefined();
      expect(el.dataContext).toBeUndefined();
      expect(el.settings).toBeUndefined();
      expect(el.properties).toBeUndefined();
      expect('label' in el).toBe(false);
      expect(el.childNodes.length).toBe(0);

      const Row = defineRow();
      const row = Row.mount(el, { settings: { label: 'second' } });
      expect(el.textContent).toContain('second');
      row.unmount();
      expect('label' in el).toBe(false);
      return new Promise((resolve) => setTimeout(resolve, 10)).then(() => {
        expect(ticks).toBe(0);
      });
    });

    it('refuses an anchor until the range form exists', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      expect(() => Row.mount(el, { anchor: el })).toThrow(
        expect.objectContaining({ code: 'unsupportedAnchor', at: 'Template.mount' }),
      );
    });

    it("adopts a tagged component's css once, through mount", async () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-css'),
        template: '<p class="row">styled</p>',
        css: '.row { color: rgb(7, 8, 9); }',
      });
      const el = document.createElement(Tagged.componentTagName);
      document.body.append(el);
      await el.rendered;
      expect(rowColor(el.shadowRoot)).toBe('rgb(7, 8, 9)');
      expect(el.shadowRoot.adoptedStyleSheets.length).toBe(1);
    });

    it('mounts from a tagged class with its declared defaults and its spec', () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-tagged'),
        template: '<p class="tagged">{label}</p>',
        defaultSettings: { label: 'tagged' },
      });
      const el = document.createElement('dialog');
      document.body.append(el);
      const instance = Tagged.mount(el);
      expect(instance).toBeInstanceOf(Template);
      expect(el).toBeInstanceOf(HTMLDialogElement);
      expect(el).toBeInstanceOf(Tagged);
      expect(typeof el.showModal).toBe('function');
      // the default the class declared applies without being passed
      expect(el.textContent).toContain('tagged');
      instance.settings.label = 'via class';
      return tick().then(() => {
        expect(el.textContent).toContain('via class');
        instance.unmount();
        expect(el).toBeInstanceOf(HTMLDialogElement);
        expect(el).not.toBeInstanceOf(Tagged);

        const Primitive = defineComponent({
          tagName: uniqueTag('mount-primitive'),
          template: '<button class="{uiClasses}button">{label}</button>',
          defaultSettings: { label: 'go' },
          componentSpec: {
            attributes: ['emphasis'],
            properties: [],
            optionAttributes: { primary: 'emphasis', secondary: 'emphasis' },
            propertyTypes: { emphasis: 'string' },
            allowedValues: { emphasis: ['primary', 'secondary'] },
            attributeClasses: [],
          },
        });
        const host = document.createElement('div');
        document.body.append(host);
        Primitive.mount(host, { settings: { emphasis: 'primary' } });
        // the spec the class declared drives uiClasses on a plain element
        expect(host.querySelector('button').className).toBe('primary button');

        const clonedHost = document.createElement('div');
        document.body.append(clonedHost);
        Primitive.template.clone({ data: { emphasis: 'secondary' } }).mount(clonedHost);
        expect(clonedHost.querySelector('button').className).toBe('secondary button');
        expect(clonedHost.querySelector('button').textContent).toBe('go');
      });
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

      // custom elements upgrade synchronously during DOM insertion, so el.template must be set before rendering
      expect(child.component.parentSeenAtCreate).toBe('mountWrapper');
      expect(child.template.findParent()?.templateName).toBe('mountWrapper');
      expect(wrapper.findChildren().length).toBe(1);
    });
  });

  describe('walks through a mounted child', () => {
    it('reaches tagged children slotted into a host, not only its shadow tree', async () => {
      const Slotted = defineComponent({
        tagName: uniqueTag('mount-slotted'),
        templateName: 'slottedChild',
        template: '<i>slotted</i>',
      });
      const Host = defineComponent({
        tagName: uniqueTag('mount-slot-host'),
        template: '<section><slot></slot></section>',
      });
      const host = document.createElement(Host.componentTagName);
      host.append(document.createElement(Slotted.componentTagName), document.createElement(Slotted.componentTagName));
      document.body.append(host);
      await host.rendered;
      await Promise.all([...host.children].map((child) => child.rendered));

      expect(host.template.findChildren('slottedChild').length).toBe(2);
      expect(host.template.findChildren().length).toBe(2);
    });

    it('reaches the subtemplates of a mounted child with and without a name', async () => {
      const Host = defineComponent({
        tagName: uniqueTag('mount-walk-host'),
        template: '<section class="area"></section>',
      });
      const Item = defineComponent({ template: '<span class="item">{name}</span>' });
      const List = defineComponent({
        templateName: 'walkList',
        template: '<ul>{#each item in items}{> item name=item}{/each}</ul>',
        defaultSettings: { items: ['x', 'y'] },
        subTemplates: { item: Item },
      });
      const host = document.createElement(Host.componentTagName);
      document.body.append(host);
      await host.rendered;

      List.mount(host.shadowRoot.querySelector('.area'));

      const named = host.template.findChildren('item');
      const all = host.template.findChildren();
      expect(named.length).toBe(2);
      // the list once, its two items once each, nothing twice and nothing skipped
      expect(all.length).toBe(3);
      expect(all.filter((child) => child.templateName === 'walkList').length).toBe(1);
    });
  });

  describe('a shadow root as the target', () => {
    it("renders into a bare host's shadow root and still reaches tagged children", async () => {
      const Child = defineComponent({
        tagName: uniqueTag('mount-shadow-child'),
        template: '<i>child</i>',
      });
      const Wrapper = defineComponent({
        template: `<div class="row"><${Child.componentTagName}></${Child.componentTagName}></div>`,
        css: '.row { color: rgb(10, 11, 12); }',
      });
      const host = document.createElement('div');
      const shadow = host.attachShadow({ mode: 'open' });
      document.body.append(host);

      const wrapper = Wrapper.mount(shadow);
      await shadow.querySelector(Child.componentTagName).rendered;

      expect(wrapper.findChildren().length).toBe(1);
      expect(rowColor(shadow)).toBe('rgb(10, 11, 12)');
      expect(host.renderRoot).toBe(shadow);
      expect(wrapper.callParams.isHydrating).toBe(false);
    });
  });

  describe('teardown hygiene', () => {
    it('neither renders nor leaves a render pending after an unmount in the same tick', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el);
      row.settings.label = 'late';
      row.unmount();
      await tick();
      expect(el.childNodes.length).toBe(0);
      expect(el.updateScheduled).toBeFalsy();
      expect(el.pendingRender).toBeFalsy();
      expect(Object.getPrototypeOf(el)).toBe(HTMLDivElement.prototype);
    });

    it('clears pendingRender when a property is written before append across a task boundary', async () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-pre-write'),
        template: '<p>{label}</p>',
        defaultSettings: { label: 'initial' },
      });
      const el = document.createElement(Tagged.componentTagName);
      el.label = 'before-append';
      await tick();
      document.body.append(el);
      await el.rendered;
      expect(el.shadowRoot.textContent).toBe('before-append');

      el.label = 'after-append';
      await tick();
      expect(el.shadowRoot.textContent).toBe('after-append');
    });

    it('leaves a fresh element without the fields it has not written yet', async () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-fresh'),
        template: '<p>{label}</p>',
        defaultSettings: { label: 'initial' },
      });
      const el = document.createElement(Tagged.componentTagName);
      // names the base writes later, or only on a mount or a spec component, so a fresh
      // element shows none of them as undefined in devtools
      const unwritten = [
        'template',
        'component',
        'dataContext',
        'isHydrating',
        'uiClasses',
        'extraProperties',
        'updateScheduled',
        'pendingRender',
      ];
      for (const name of unwritten) {
        expect(Object.hasOwn(el, name)).toBe(false);
      }
      document.body.append(el);
      await el.rendered;
      for (const name of ['isHydrating', 'uiClasses', 'extraProperties']) {
        expect(Object.hasOwn(el, name)).toBe(false);
      }
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
