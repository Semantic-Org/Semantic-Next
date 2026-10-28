import { $ } from '@semantic-ui/query';
import { reaction, signal } from '@semantic-ui/reactivity';
import { Renderer } from '@semantic-ui/renderer';
import { Template } from '@semantic-ui/templating';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { LitEngine } from '../../src/engines/lit/register.js';
import { NativeEngine } from '../../src/engines/native/register.js';
import { defineComponent } from '../../src/index.js';
import { createIconLikeSpec } from './fixtures.js';

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

    it('falls back to declared defaults and passes undeclared keys to the template as data', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const item = { type: 'invoice' };
      const row = Row.mount(el, { settings: { extra: 'yes', item } });
      expect(el.textContent).toContain('default');
      // data lands in the template's context and nowhere else: no accessor, no setting
      expect(row.getDataContext().extra).toBe('yes');
      expect(row.getDataContext().item).toBe(item);
      expect(el.extra).toBeUndefined();
      expect(row.settings.extra).toBeUndefined();
    });

    it('passes a key named like an element property as data, touching neither the element nor its stamps', () => {
      const Titled = defineComponent({ template: '<p>{title}</p>' });
      const el = document.createElement('div');
      document.body.append(el);
      const row = Titled.mount(el, { settings: { title: 'Home', component: 'other' } });
      expect(el.textContent).toBe('Home');
      expect(el.title).toBe('');
      expect(el.component).toBe(row.instance);
      expect(row.getDataContext().component).toBe('other');
    });

    it('keeps a declared noAccessor setting on the element itself', () => {
      const el = document.createElement('div');
      document.body.append(el);
      // declared without an accessor, the element's own property is the setting
      const Titled = defineComponent({
        template: '<p>{title}</p>',
        defaultSettings: { title: { type: String, default: '', noAccessor: true } },
      });
      const titled = Titled.mount(el, { settings: { title: 'Home' } });
      expect(el.title).toBe('Home');
      expect(el.textContent).toBe('Home');
      titled.unmount();
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

    it('hands undeclared data to the template once, and a signal passed as data reacts on its own', async () => {
      const Row = defineComponent({
        template: '<p class="row">{route}</p>',
        defaultSettings: { label: 'declared' },
      });
      const el = document.createElement('div');
      document.body.append(el);
      Row.mount(el, { settings: { route: 'home' } });
      expect(el.textContent).toContain('home');

      // a value that must move is a signal, the way any data moves
      const other = document.createElement('div');
      document.body.append(other);
      const route = signal('x');
      Row.mount(other, { data: { route } });
      expect(other.textContent).toContain('x');
      route.set('y');
      await tick();
      expect(other.textContent).toContain('y');
    });

    it('renders the data a render call carries, on a mounted template and on a tag', async () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'mounted' } });
      row.render({ label: 'carried' });
      expect(el.isUpdatePending).toBeFalsy();
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
      tag.update({ label: 'carried too' });
      expect(tag.isUpdatePending).toBeFalsy();
      await tick();
      expect(tag.shadowRoot.textContent).toContain('carried too');
      expect(tag.label).toBe('carried too');

      tag.update({ label: 'updated too' });
      expect(tag.isUpdatePending).toBeFalsy();
      await tick();
      expect(tag.shadowRoot.textContent).toContain('updated too');
      expect(tag.label).toBe('updated too');

      // data a router passes moves through update, the way any data moves
      const Route = defineComponent({ template: '<p>{route}</p>' });
      const outlet = document.createElement('div');
      document.body.append(outlet);
      Route.mount(outlet, { settings: { route: 'home' } });
      outlet.update({ route: 'about' });
      expect(outlet.isUpdatePending).toBeFalsy();
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

  describe('settings dialects', () => {
    it('resolves a kebab key to its declared camelCase setting', () => {
      const Row = defineComponent({
        template: '<p>{maxItems}</p>',
        defaultSettings: { maxItems: 10 },
      });
      const el = document.createElement('div');
      document.body.append(el);
      Row.mount(el, { settings: { 'max-items': 5 } });
      expect(el.textContent).toBe('5');
      expect(el.maxItems).toBe(5);
    });

    it('speaks the three spec dialects a tag speaks', () => {
      const Icon = defineComponent({
        tagName: uniqueTag('mount-icon-spec'),
        template: '<i class="{icon}"></i>',
        componentSpec: createIconLikeSpec(),
      });
      const mountWith = (settings) => {
        const el = document.createElement('div');
        document.body.append(el);
        Icon.mount(el, { settings });
        return el;
      };
      // verbose, with the value fuzzed
      expect(mountWith({ icon: 'down chevron' }).settings.icon).toBe('chevron-down');
      // concise, a bare attribute and a compound alias
      expect(mountWith({ 'chevron-down': true }).settings.icon).toBe('chevron-down');
      expect(mountWith({ 'link-icon': true }).settings.icon).toBe('link');
      // classic, a class string
      const classic = mountWith({ class: 'chevron-down large' });
      expect(classic.settings.icon).toBe('chevron-down');
      expect(classic.settings.size).toBe('large');
    });
  });

  describe('attributes on a mounted element', () => {
    it('reads the attributes the element carries and follows their changes, the way a tag does', async () => {
      const Icon = defineComponent({
        tagName: uniqueTag('mount-icon-attrs'),
        template: '<i class="{icon}">{maxItems}</i>',
        defaultSettings: { maxItems: 10 },
        componentSpec: createIconLikeSpec(),
      });
      const el = document.createElement('unregistered-card');
      el.setAttribute('chevron-down', '');
      el.setAttribute('max-items', '5');
      document.body.append(el);
      const row = Icon.mount(el);
      // present at mount, replayed through the same hook the browser fires on a tag
      expect(el.settings.icon).toBe('chevron-down');
      expect(el.settings.maxItems).toBe(5);
      expect(el.querySelector('i').textContent).toBe('5');
      // changed after mount, observed into the same hook a microtask later
      el.setAttribute('icon', 'home');
      el.setAttribute('max-items', '7');
      await tick();
      expect(el.settings.icon).toBe('home');
      expect(el.querySelector('i').textContent).toBe('7');
      el.removeAttribute('max-items');
      await tick();
      expect(el.querySelector('i').textContent).toBe('10');
      // after unmount the element is plain again and attributes mean nothing to it
      row.unmount();
      el.setAttribute('max-items', '3');
      await tick();
      expect(el.maxItems).toBeUndefined();
    });

    it("lets the markup win over a tagless definition's own default, and the call win over both", () => {
      // a tagless definition carries its defaults on the template's data, which must seed
      // the settings beneath the markup rather than overwrite it
      const Row = defineComponent({
        template: '<i>{maxItems}</i>',
        defaultSettings: { maxItems: 10 },
      });
      const fromMarkup = document.createElement('unregistered-card');
      fromMarkup.setAttribute('max-items', '5');
      document.body.append(fromMarkup);
      Row.mount(fromMarkup);
      expect(fromMarkup.querySelector('i').textContent).toBe('5');

      const fromCall = document.createElement('unregistered-card');
      fromCall.setAttribute('max-items', '5');
      document.body.append(fromCall);
      Row.mount(fromCall, { settings: { maxItems: 7 } });
      expect(fromCall.querySelector('i').textContent).toBe('7');
    });

    it('lets a setting passed to mount win over the attribute the element carries', () => {
      const Row = defineComponent({
        tagName: uniqueTag('mount-precedence'),
        template: '<i>{maxItems}</i>',
        defaultSettings: { maxItems: 10 },
      });
      const el = document.createElement('unregistered-card');
      el.setAttribute('max-items', '5');
      document.body.append(el);
      Row.mount(el, { settings: { maxItems: 7 } });
      expect(el.querySelector('i').textContent).toBe('7');
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

    it('refuses a defined custom element as a target and leaves it as it was', () => {
      const Row = defineRow();
      const refused = expect.objectContaining({ code: 'definedElement', at: 'Template.mount' });
      // a native tag that never connected has no render root to take the content
      const Native = defineComponent({
        tagName: uniqueTag('mount-native-target'),
        template: '<p>{label}</p>',
        defaultSettings: { label: 'native' },
      });
      const native = document.createElement(Native.componentTagName);
      expect(() => Row.mount(native, { settings: { label: 'x' } })).toThrow(refused);
      expect(native.template).toBeUndefined();
      expect(native instanceof Native).toBe(true);
      // a lit element renders itself and never set the flag the old gate read
      const Lit = defineComponent({
        tagName: uniqueTag('mount-lit-target'),
        renderingEngine: LitEngine,
        template: '<p>{label}</p>',
        defaultSettings: { label: 'lit' },
      });
      const lit = document.createElement(Lit.componentTagName);
      const proto = Object.getPrototypeOf(lit);
      expect(() => Row.mount(lit, { settings: { label: 'x' } })).toThrow(refused);
      expect(Object.getPrototypeOf(lit)).toBe(proto);
    });

    it('mounts into a custom tag that is not defined, the light dom rendering target', () => {
      const Row = defineRow();
      const el = document.createElement('unregistered-card');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'undefined tag' } });
      expect(el.textContent).toContain('undefined tag');
      expect(el instanceof Row.componentClass).toBe(true);
      row.unmount();
      expect(Object.getPrototypeOf(el)).toBe(HTMLElement.prototype);
    });

    it('gives a subclass of a component class its own upgrade prototype', () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-subclass'),
        template: '<p>{label}</p>',
        defaultSettings: { label: 'parent' },
      });
      class Fancy extends Tagged {
        extra() {
          return 'extra';
        }
      }
      // mount always upgrades with the defined class, so the static is the one door a
      // subclass reaches the cache through: the parent's entry must not serve the child
      const parent = document.createElement('div');
      const child = document.createElement('div');
      Tagged.upgradeElement(parent, { renderRoot: parent });
      Fancy.upgradeElement(child, { renderRoot: child });
      expect(child.extra()).toBe('extra');
      expect(parent.extra).toBeUndefined();
      parent.restoreElement();
      child.restoreElement();
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

    it('refuses unmount through an engine that has no unmount, and leaves the engine object as it was', () => {
      const engine = { renderer: Renderer, mount: NativeEngine.mount };
      const Half = defineComponent({
        renderingEngine: engine,
        template: '<i>half</i>',
      });
      const el = document.createElement('div');
      document.body.append(el);
      const half = Half.mount(el);
      expect(el.textContent).toBe('half');
      expect(() => half.unmount()).toThrow(
        expect.objectContaining({ code: 'unsupportedEngine', at: 'Template.unmount' }),
      );
      el.unmount();
      // resolution reads the engine, it does not write a fallback onto it
      const bare = { renderer: Renderer };
      const Bare = defineComponent({ renderingEngine: bare, template: '<i>bare</i>' });
      expect(() => Bare.mount(document.createElement('div'))).toThrow(
        expect.objectContaining({ code: 'unsupportedEngine', at: 'Template.mount' }),
      );
      expect(Object.hasOwn(bare, 'mount')).toBe(false);
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

    it('restores the element when a failed mount hits a destroy callback that throws', () => {
      const Broken = defineComponent({
        template: '<p>broken</p>',
        onCreated() {
          throw new Error('created boom');
        },
        onDestroyed() {
          throw new Error('destroyed boom');
        },
      });
      const el = document.createElement('div');
      document.body.append(el);
      expect(() => Broken.mount(el)).toThrow();
      // the discard ran the throwing callback, and the element still came back
      expect(Object.getPrototypeOf(el)).toBe(HTMLDivElement.prototype);
      expect(el.template).toBeUndefined();
      const row = defineRow().mount(el, { settings: { label: 'after' } });
      expect(el.textContent).toContain('after');
      row.unmount();
    });

    it('restores the element when unmount hits a destroy callback that throws', () => {
      const Row = defineRow({
        onDestroyed() {
          throw new Error('destroyed boom');
        },
      });
      const el = document.createElement('div');
      document.body.append(el);
      const row = Row.mount(el, { settings: { label: 'first' } });
      expect(() => row.unmount()).toThrow('destroyed boom');
      // the throw reached the caller, and the element is as it was: no content, no stamps
      expect(el.textContent).toBe('');
      expect(el.template).toBeUndefined();
      expect(Object.getPrototypeOf(el)).toBe(HTMLDivElement.prototype);
      const again = Row.mount(el, { settings: { label: 'again' } });
      expect(el.textContent).toContain('again');
      expect(() => again.unmount()).toThrow('destroyed boom');
    });

    it('discards a mount whose event binding throws, and the throw reaches the caller', () => {
      const Row = defineRow();
      const el = document.createElement('div');
      document.body.append(el);
      const bind = vi.spyOn(Template.prototype, 'attachEvents').mockImplementation(() => {
        throw new Error('bind boom');
      });
      try {
        expect(() => Row.mount(el)).toThrow('bind boom');
      }
      finally {
        bind.mockRestore();
      }
      expect(Object.getPrototypeOf(el)).toBe(HTMLDivElement.prototype);
      expect(el.template).toBeUndefined();
      expect(el.textContent).toBe('');
      const row = Row.mount(el, { settings: { label: 'after' } });
      expect(el.textContent).toContain('after');
      row.unmount();
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

  describe('at an anchor', () => {
    // with anchor the target is a container: nothing is upgraded, the template renders as a
    // range before the anchor, and the caller's own children stay where they are
    const definePage = () =>
      defineComponent({
        template: '<p class="row">{label} {bumps}</p>{>kid}',
        css: '.row { color: rgb(1, 2, 3); }',
        defaultSettings: { label: 'a' },
        defaultState: { bumps: 0 },
        subTemplates: {
          kid: defineComponent({
            template: '<button class="kid">kid {kicks}</button>',
            defaultState: { kicks: 0 },
            events: {
              'click .kid'({ state }) {
                state.kicks.increment();
              },
            },
          }),
        },
        createComponent: ({ findParent }) => ({ hostAtCreate: findParent()?.templateName, clicks: 0 }),
        events: {
          'click .row'({ state }) {
            state.bumps.increment();
          },
          'click'({ self }) {
            self.clicks += 1;
          },
        },
      });
    const shapeOf = (container) => [...container.children].map((child) => child.className || child.localName);
    const mainWith = () => {
      document.body.innerHTML = '<main><nav>n</nav><footer>f</footer></main>';
      const main = document.querySelector('main');
      return { main, footer: main.querySelector('footer') };
    };

    it("renders before the anchor between the container's own children, and leaves it as it was on unmount", () => {
      const { main, footer } = mainWith();
      const page = definePage().mount(main, { anchor: footer, settings: { label: 'x' } });
      expect(shapeOf(main)).toEqual(['nav', 'row', 'kid', 'footer']);
      expect(main.querySelector('.row').textContent).toBe('x 0');
      expect(getComputedStyle(main.querySelector('.row')).color).toBe('rgb(1, 2, 3)');
      expect(page.element).toBe(main);
      expect(page.mounted).toBe(true);
      expect(main.template).toBeUndefined();
      expect(Object.getPrototypeOf(main)).toBe(HTMLElement.prototype);

      page.unmount();
      expect(shapeOf(main)).toEqual(['nav', 'footer']);
      expect(main.childNodes.length).toBe(2);
      expect(page.mounted).toBe(false);
      page.unmount();
    });

    it('appends with a null anchor', () => {
      const { main } = mainWith();
      definePage().mount(main, { anchor: null });
      expect(shapeOf(main)).toEqual(['nav', 'footer', 'row', 'kid']);
    });

    it('moves a declared setting through its own store and the rest through update', async () => {
      const { main, footer } = mainWith();
      const page = definePage().mount(main, { anchor: footer, settings: { label: 'x' }, data: { extra: 'e' } });
      const text = () => main.querySelector('.row').textContent;
      expect(page.settings.label).toBe('x');
      expect(page.getDataContext().extra).toBe('e');

      page.settings.label = 'y';
      await tick();
      expect(text()).toBe('y 0');

      page.update({ label: 'z' });
      await tick();
      expect(text()).toBe('z 0');
      expect(page.settings.label).toBe('z');
    });

    it('delegates events inside the range only, and a {>child} takes its own clicks', async () => {
      const { main, footer } = mainWith();
      const page = definePage().mount(main, { anchor: footer });
      main.querySelector('nav').click();
      expect(page.instance.clicks).toBe(0);
      main.querySelector('.row').click();
      await tick();
      expect(page.instance.clicks).toBe(1);
      expect(main.querySelector('.row').textContent).toBe('a 1');
      main.querySelector('.kid').click();
      await tick();
      expect(main.querySelector('.kid').textContent).toBe('kid 1');
    });

    it('holds two mounts at one anchor, each with its own events and its own unmount', async () => {
      const { main, footer } = mainWith();
      const first = definePage().mount(main, { anchor: footer, settings: { label: 'one' } });
      const second = definePage().mount(main, { anchor: footer, settings: { label: 'two' } });
      expect(shapeOf(main)).toEqual(['nav', 'row', 'kid', 'row', 'kid', 'footer']);
      main.querySelectorAll('.row')[1].click();
      await tick();
      expect(first.instance.clicks).toBe(0);
      expect(second.instance.clicks).toBe(1);
      first.unmount();
      expect(shapeOf(main)).toEqual(['nav', 'row', 'kid', 'footer']);
      expect(main.querySelector('.row').textContent).toBe('two 1');
      second.unmount();
      expect(shapeOf(main)).toEqual(['nav', 'footer']);
    });

    it('fires rendered and destroyed from the range, through the container', async () => {
      const { main, footer } = mainWith();
      const seen = [];
      const record = (event) => seen.push([event.type, event.detail.templateName, event.target.className]);
      main.addEventListener('rendered', record);
      main.addEventListener('destroyed', record);
      const page = definePage().mount(main, { anchor: footer });
      await tick();
      page.unmount();
      // the page raises its own from its first element, the {>kid} raises its own from its button
      const of = (name) =>
        seen.filter(([, templateName]) => templateName === name).map(([type, , from]) => [type, from]);
      expect(of(page.templateName)).toEqual([['rendered', 'row'], ['destroyed', 'row']]);
      expect(of('kid')).toEqual([['rendered', 'kid'], ['destroyed', 'kid']]);
    });

    it('leaves the container and the host clean when the mount throws', async () => {
      const Host = defineComponent({ tagName: uniqueTag('anchor-throws'), template: '<div class="outlet"></div>' });
      document.body.innerHTML = '';
      const host = document.createElement(Host.componentTagName);
      document.body.append(host);
      await host.rendered;
      const outlet = host.shadowRoot.querySelector('.outlet');
      const Broken = defineComponent({
        template: '<p>never</p>',
        createComponent: () => {
          throw new Error('setup failed');
        },
      });
      expect(() => Broken.mount(outlet, { anchor: null })).toThrow('setup failed');
      expect(outlet.childNodes.length).toBe(0);
      expect(host.template._childTemplates).toHaveLength(0);
    });

    it('cascades from an AbortSignal and refuses one that is already aborted', () => {
      const { main, footer } = mainWith();
      const controller = new AbortController();
      const page = definePage().mount(main, { anchor: footer, signal: controller.signal });
      controller.abort();
      expect(page.mounted).toBe(false);
      expect(shapeOf(main)).toEqual(['nav', 'footer']);
      expect(() => definePage().mount(main, { anchor: footer, signal: controller.signal })).toThrow(
        expect.objectContaining({ code: 'expiredSignal', at: 'Template.mount' }),
      );
    });

    it('refuses a second mount of the same instance, a tagged component, and an anchor outside the container', () => {
      const { main, footer } = mainWith();
      const page = definePage().mount(main, { anchor: footer });
      expect(() => page.mount(main, { anchor: footer })).toThrow(
        expect.objectContaining({ code: 'duplicateMount', at: 'Template.mount' }),
      );
      const Tagged = defineComponent({ tagName: uniqueTag('anchor-tagged'), template: '<i></i>' });
      expect(() => Tagged.mount(main, { anchor: footer })).toThrow(
        expect.objectContaining({ code: 'unsupportedAnchor', at: 'Template.mount' }),
      );
      // the DOM's own refusal, nothing of ours in the way
      expect(() => definePage().mount(main, { anchor: document.body })).toThrow(DOMException);
      expect(shapeOf(main)).toEqual(['nav', 'row', 'kid', 'footer']);
    });

    it('inside a sui host: finds it from createComponent on, is found by it, adopts css onto its shadow root', async () => {
      const Host = defineComponent({
        tagName: uniqueTag('anchor-host'),
        template: '<div class="outlet"><span class="static">s</span></div>',
      });
      document.body.innerHTML = '';
      const host = document.createElement(Host.componentTagName);
      document.body.append(host);
      await host.rendered;
      const outlet = host.shadowRoot.querySelector('.outlet');
      const sheetsBefore = document.adoptedStyleSheets.length;

      const page = definePage().mount(outlet, { anchor: null });
      expect(page.element).toBe(outlet);
      expect(outlet.template).toBeUndefined();
      expect(page.instance.hostAtCreate).toBe(host.template.templateName);
      expect(page.findParent()?.templateName).toBe(host.template.templateName);
      expect(host.template.findChildren().map((child) => child.templateName)).toContain(page.templateName);
      expect(getComputedStyle(outlet.querySelector('.row')).color).toBe('rgb(1, 2, 3)');
      expect(document.adoptedStyleSheets.length).toBe(sheetsBefore);

      outlet.querySelector('.static').click();
      expect(page.instance.clicks).toBe(0);
      outlet.querySelector('.row').click();
      await tick();
      expect(page.instance.clicks).toBe(1);

      page.unmount();
      expect(host.template.findChildren()).toHaveLength(0);
      expect([...outlet.childNodes].map((node) => node.nodeType)).toEqual([Node.ELEMENT_NODE]);
    });

    it('inside nested hosts, an unnamed findParent names the host the range sits in', async () => {
      const innerTag = uniqueTag('anchor-inner');
      defineComponent({ tagName: innerTag, template: '<div class="outlet"></div>' });
      const Outer = defineComponent({ tagName: uniqueTag('anchor-outer'), template: `<${innerTag}></${innerTag}>` });
      document.body.innerHTML = '';
      const outer = document.createElement(Outer.componentTagName);
      document.body.append(outer);
      await outer.rendered;
      const inner = outer.shadowRoot.querySelector(innerTag);
      await inner.rendered;

      const page = definePage().mount(inner.shadowRoot.querySelector('.outlet'), { anchor: null });
      expect(page.findParent()?.templateName).toBe(inner.template.templateName);
      expect(page.findParent(outer.template.templateName)?.templateName).toBe(outer.template.templateName);
      page.unmount();
    });

    it('takes a defined custom element and a shadow root as containers', async () => {
      const Host = defineComponent({ tagName: uniqueTag('anchor-container'), template: '<slot></slot>' });
      document.body.innerHTML = '';
      const host = document.createElement(Host.componentTagName);
      document.body.append(host);
      await host.rendered;

      const light = definePage().mount(host, { anchor: null, settings: { label: 'light' } });
      expect(shapeOf(host)).toEqual(['row', 'kid']);
      expect(host.querySelector('.row').textContent).toBe('light 0');

      const shadow = definePage().mount(host.shadowRoot, { anchor: null, settings: { label: 'shadow' } });
      expect(host.shadowRoot.querySelector('.row').textContent).toBe('shadow 0');
      expect(getComputedStyle(host.shadowRoot.querySelector('.row')).color).toBe('rgb(1, 2, 3)');

      light.unmount();
      shadow.unmount();
      expect(host.childNodes.length).toBe(0);
      expect(host.shadowRoot.querySelector('.row')).toBeNull();
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
      expect(el.isUpdatePending).toBeFalsy();
      expect(Object.getPrototypeOf(el)).toBe(HTMLDivElement.prototype);
    });

    it('clears isUpdatePending when a property is written before append across a task boundary', async () => {
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

    it('renders a tag created with attributes once, not again for the writes before it connected', async () => {
      const Tagged = defineComponent({
        tagName: uniqueTag('mount-pre-attr'),
        template: '<p>{label}</p>',
        defaultSettings: { label: 'initial' },
      });
      const el = document.createElement(Tagged.componentTagName);
      // the browser delivers attributes before connectedCallback, so these writes land on an
      // element with no template yet and must not queue a render for after the first one
      el.setAttribute('label', 'from-attribute');
      const render = vi.spyOn(Template.prototype, 'render');
      try {
        document.body.append(el);
        await tick();
        expect(el.shadowRoot.textContent).toBe('from-attribute');
        expect(render.mock.contexts.filter((template) => template.element === el).length).toBe(1);
      }
      finally {
        render.mockRestore();
      }
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
        'attributeObserver',
        'updateScheduled',
        'isUpdatePending',
      ];
      for (const name of unwritten) {
        expect(Object.hasOwn(el, name)).toBe(false);
      }
      document.body.append(el);
      await el.rendered;
      for (const name of ['isHydrating', 'uiClasses', 'attributeObserver']) {
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
