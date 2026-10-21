import { $ } from '@semantic-ui/query';
import { flush, signal } from '@semantic-ui/reactivity';
import { each, fill, get, isArray, isBoolean, isEmpty, isFunction, isPlainObject, isString } from '@semantic-ui/utils';
import { afterEach, describe, expect, it, vi } from 'vitest';
import {
  addPlugin,
  clearPlugins,
  defineComponent,
  extendParams,
  registerPlugin,
  removePlugin,
} from '../../src/index.js';

let tagCounter = 0;
const uniqueTag = (prefix = 'plugin-test') => `${prefix}-${++tagCounter}`;

const mountedElements = [];

const mount = async (config, attrs = {}) => {
  const tag = config.tagName || uniqueTag();
  const Component = defineComponent({ ...config, tagName: tag });
  const el = document.createElement(tag);
  each(attrs, (val, key) => el.setAttribute(key, val));
  document.body.appendChild(el);
  mountedElements.push(el);
  await $(el).onNext('rendered');
  return { el, Component, tag };
};

afterEach(() => {
  while (mountedElements.length) {
    const el = mountedElements.pop();
    el.remove();
  }
  clearPlugins();
});

describe('Component Plugins', () => {
  describe('registerPlugin, addPlugin, removePlugin & extendParams', () => {
    it('validates plugin namespace on registration', () => {
      expect(() => registerPlugin({})).toThrow(/pluginNamespaceRequired/);
      expect(() => registerPlugin({ namespace: '' })).toThrow(/pluginNamespaceRequired/);
    });

    it('accepts name as an alias for namespace', () => {
      const def = registerPlugin({ name: 'aliasTest' });
      expect(def.namespace).toBe('aliasTest');
    });

    it('supports addPlugin by definition object or registered namespace string', async () => {
      registerPlugin({
        namespace: 'byName',
        lifecycleParams: { injected: 42 },
      });
      addPlugin('byName');

      let captured;
      await mount({
        template: '<div>ok</div>',
        onCreated({ injected }) {
          captured = injected;
        },
      });
      expect(captured).toBe(42);
    });

    it('throws when addPlugin is called with an unregistered namespace string', () => {
      expect(() => addPlugin('nonExistentPlugin')).toThrow(/pluginNotRegistered/);
    });

    it('is immune to ESM import order (defineComponent before addPlugin)', async () => {
      const tag = uniqueTag('import-order');
      const Card = defineComponent({
        tagName: tag,
        template: '<span class="val">{label}</span>',
        defaultSettings: { title: 'Default' },
        latePlugin: 'custom-value',
      });

      // Unknown plugin option must not leak into component properties
      expect(Card.properties?.latePlugin).toBeUndefined();
      expect(Card.toDefinition().latePlugin).toBe('custom-value');

      const LatePlugin = registerPlugin({
        namespace: 'latePlugin',
        defaultSettings: { prefix: 'late' },
        resolveSettings: ({ settings, config }) => ({
          ...settings,
          value: `${settings.prefix}:${config}`,
        }),
        templateHelpers: ({ settings }) => ({
          label: () => settings.value,
        }),
      });

      addPlugin(LatePlugin, { prefix: 'boot' });

      const el = document.createElement(tag);
      document.body.appendChild(el);
      mountedElements.push(el);
      await $(el).onNext('rendered');

      expect(el.$('.val').text()).toBe('boot:custom-value');
    });

    it('supports extendParams with plain objects and functions', async () => {
      extendParams({ appName: 'Semantic' });
      extendParams(({ templateName }) => ({
        callerTag: `from:${templateName}`,
      }));

      let seen;
      await mount({
        templateName: 'myWidget',
        template: '<div></div>',
        onCreated({ appName, callerTag }) {
          seen = { appName, callerTag };
        },
      });

      expect(seen).toEqual({
        appName: 'Semantic',
        callerTag: 'from:myWidget',
      });
    });

    it('cleans up static templateHelpers when removePlugin or clearPlugins is called', async () => {
      const HelperPlugin = registerPlugin({
        namespace: 'tempHelper',
        templateHelpers: {
          customBanner: () => 'hello-banner',
        },
      });
      addPlugin(HelperPlugin);

      const { el: el1 } = await mount({
        template: '<span class="txt">{customBanner}</span>',
      });
      expect(el1.$('.txt').text()).toBe('hello-banner');

      removePlugin(HelperPlugin);

      const { el: el2 } = await mount({
        template: '<span class="txt">{customBanner}</span>',
      });
      expect(el2.$('.txt').text()).toBe('');
    });
  });

  describe('Settings Hierarchy, Reactive Proxy & resolveSettings', () => {
    it('resolves 3-tier settings and propagates shared setting writes across components while isolating overrides', async () => {
      const ThemePlugin = registerPlugin({
        namespace: 'themePlugin',
        defaultSettings: {
          accent: 'blue',
          density: 'comfortable',
          scale: 1,
        },
        resolveSettings: ({ settings, config }) => {
          if (isString(config)) {
            return { ...settings, density: config };
          }
          return settings;
        },
        setup: ({ settings }) => ({
          setAccent(next) {
            settings.accent = next;
          },
        }),
        templateHelpers: ({ settings }) => ({
          themeSummary: () => `${settings.accent}-${settings.density}-${settings.scale}`,
        }),
      });

      addPlugin(ThemePlugin, { accent: 'teal' });

      const { el: cardA } = await mount({
        template: '<div class="out">{themeSummary}</div>',
      });
      const { el: cardB } = await mount({
        template: '<div class="out">{themeSummary}</div>',
        themePlugin: 'compact',
      });
      const { el: cardC } = await mount({
        template: '<div class="out">{themeSummary}</div>',
        themePlugin: { accent: 'purple', scale: 2 },
      });

      expect(cardA.$('.out').text()).toBe('teal-comfortable-1');
      expect(cardB.$('.out').text()).toBe('teal-compact-1');
      expect(cardC.$('.out').text()).toBe('purple-comfortable-2');

      // Mutating shared setting updates cardA and cardB, while cardC keeps its overridden accent
      cardA.themePlugin.setAccent('amber');
      flush();

      expect(cardA.$('.out').text()).toBe('amber-comfortable-1');
      expect(cardB.$('.out').text()).toBe('amber-compact-1');
      expect(cardC.$('.out').text()).toBe('purple-comfortable-2');
    });
  });

  describe('Execution Order & Descriptor Preservation', () => {
    it('runs createPlugin + initialize() before createComponent and first render', async () => {
      const order = [];

      const OrderPlugin = registerPlugin({
        namespace: 'orderPlugin',
        createPlugin: ({ state }) => ({
          initialize() {
            order.push('plugin:initialize');
            state.count.set(10);
          },
        }),
        lifecycleParams: {
          pluginReady: true,
        },
        onCreated() {
          order.push('plugin:onCreated');
        },
        onRendered() {
          order.push('plugin:onRendered');
        },
        onDestroyed() {
          order.push('plugin:onDestroyed');
        },
      });

      addPlugin(OrderPlugin);

      let createComponentSawCount;
      let createComponentSawReady;
      const { el } = await mount({
        template: '<span class="count">{count}</span>',
        defaultState: { count: 0 },
        createComponent({ state, pluginReady }) {
          order.push('component:createComponent');
          createComponentSawCount = state.count.get();
          createComponentSawReady = pluginReady;
          return {
            initialize() {
              order.push('component:initialize');
            },
          };
        },
        onCreated() {
          order.push('component:onCreated');
        },
        onRendered() {
          order.push('component:onRendered');
        },
        onDestroyed() {
          order.push('component:onDestroyed');
        },
      });

      expect(createComponentSawCount).toBe(10);
      expect(createComponentSawReady).toBe(true);
      expect(el.$('.count').text()).toBe('10');

      el.remove();
      await new Promise((r) => queueMicrotask(r));

      expect(order).toEqual([
        'plugin:initialize',
        'component:createComponent',
        'component:initialize',
        'plugin:onCreated',
        'component:onCreated',
        'plugin:onRendered',
        'component:onRendered',
        'plugin:onDestroyed',
        'component:onDestroyed',
      ]);
    });

    it('preserves lazy getters in lifecycleParams and templateHelpers and never shadows component methods', async () => {
      const mode = signal('light');

      const ModePlugin = registerPlugin({
        namespace: 'modePlugin',
        lifecycleParams: () => ({
          get currentMode() {
            return mode.get();
          },
          setMode(next) {
            mode.set(next);
          },
          formatLabel: () => 'from-plugin',
        }),
        templateHelpers: () => ({
          get currentMode() {
            return mode.get();
          },
          formatLabel: () => 'from-plugin',
        }),
      });

      addPlugin(ModePlugin);

      const seenInClick = [];
      const { el } = await mount({
        template: '<button class="btn">{currentMode}:{formatLabel}</button>',
        createComponent() {
          return {
            formatLabel: () => 'from-component',
          };
        },
        events: {
          'click .btn'({ currentMode, setMode, formatLabel }) {
            seenInClick.push(`${currentMode}:${formatLabel()}`);
            setMode(currentMode === 'light' ? 'dark' : 'light');
          },
        },
      });

      expect(el.$('.btn').text()).toBe('light:from-component');

      el.$('.btn').click();
      flush();
      expect(seenInClick).toEqual(['light:from-component']);
      expect(el.$('.btn').text()).toBe('dark:from-component');

      el.$('.btn').click();
      flush();
      expect(seenInClick).toEqual(['light:from-component', 'dark:from-component']);
      expect(el.$('.btn').text()).toBe('light:from-component');
    });
  });

  describe('appliesTo Filtering & DOM Attachment', () => {
    it('supports components (default), all, configured, tagName string/array, and callback predicates', async () => {
      const hits = {
        defaultComp: [],
        allTargets: [],
        configuredOnly: [],
        tagMatch: [],
        predicateMatch: [],
      };

      addPlugin(registerPlugin({
        namespace: 'defaultComp',
        appliesTo: 'components',
        createPlugin: ({ templateName }) => ({
          initialize() {
            hits.defaultComp.push(templateName);
          },
        }),
      }));

      addPlugin(registerPlugin({
        namespace: 'allTargets',
        appliesTo: 'all',
        createPlugin: ({ templateName }) => ({
          initialize() {
            hits.allTargets.push(templateName);
          },
        }),
      }));

      addPlugin(registerPlugin({
        namespace: 'configuredOnly',
        appliesTo: 'configured',
        createPlugin: ({ templateName }) => ({
          initialize() {
            hits.configuredOnly.push(templateName);
          },
        }),
      }));

      const formTag = uniqueTag('ui-form');
      addPlugin(registerPlugin({
        namespace: 'tagMatch',
        appliesTo: [formTag],
        createPlugin: ({ templateName }) => ({
          initialize() {
            hits.tagMatch.push(templateName);
          },
        }),
      }));

      addPlugin(registerPlugin({
        namespace: 'predicateMatch',
        appliesTo: ({ isSubtemplate, componentSettings }) =>
          !isSubtemplate && componentSettings?.enableSpecial === true,
        createPlugin: ({ templateName }) => ({
          initialize() {
            hits.predicateMatch.push(templateName);
          },
        }),
      }));

      const plainSub = defineComponent({
        templateName: 'plainSub',
        template: '<span>plain</span>',
      });
      const configuredSub = defineComponent({
        templateName: 'configuredSub',
        template: '<span>configured</span>',
        defaultComp: true,
        configuredOnly: true,
      });

      await mount({
        tagName: formTag,
        templateName: 'hostForm',
        template: '<div>{>plainSub}{>configuredSub}</div>',
        subTemplates: { plainSub, configuredSub },
        defaultSettings: { enableSpecial: true },
      });

      await mount({
        templateName: 'otherComp',
        template: '<div>other</div>',
        configuredOnly: { active: true },
        defaultSettings: { enableSpecial: false },
      });

      expect(hits.defaultComp).toEqual(['hostForm', 'configuredSub', 'otherComp']);
      expect(hits.allTargets).toEqual(['hostForm', 'plainSub', 'configuredSub', 'otherComp']);
      expect(hits.configuredOnly).toEqual(['configuredSub', 'otherComp']);
      // Subtemplates inside formTag must NOT match appliesTo: [formTag]
      expect(hits.tagMatch).toEqual(['hostForm']);
      expect(hits.predicateMatch).toEqual(['hostForm']);
    });

    it('attaches el[namespace] and el.plugins[namespace], protects native HTMLElement props, and cleans up on destroy', async () => {
      addPlugin(registerPlugin({
        namespace: 'customApi',
        createPlugin: () => ({
          ping: () => 'pong',
        }),
      }));

      // 'title' is a native HTMLElement.prototype property and must not be clobbered on el.title
      addPlugin(registerPlugin({
        namespace: 'title',
        createPlugin: () => ({
          ping: () => 'title-plugin',
        }),
      }));

      const { el } = await mount({
        template: '<div>ok</div>',
      }, { title: 'native-tooltip' });

      expect(el.customApi.ping()).toBe('pong');
      expect(el.plugins.customApi.ping()).toBe('pong');
      expect(el.title).toBe('native-tooltip');
      expect(el.plugins.title.ping()).toBe('title-plugin');

      el.remove();
      await new Promise((r) => queueMicrotask(r));

      expect(el.customApi).toBeUndefined();
      expect(el.plugins.customApi).toBeUndefined();
      expect(el.plugins.title).toBeUndefined();
    });

    it('protects WebComponentBase and component settings properties on el and fires subtemplate onDestroyed', async () => {
      const destroyedTemplates = [];

      addPlugin(registerPlugin({
        namespace: 'theme',
        appliesTo: 'all',
        createPlugin: () => ({
          id: 'theme-plugin-instance',
        }),
        onDestroyed({ templateName }) {
          destroyedTemplates.push(templateName);
        },
      }));

      const ChildSub = defineComponent({
        templateName: 'childSub',
        template: '<span class="sub">child</span>',
      });

      const { el } = await mount({
        templateName: 'parentHost',
        template: '<div>{#if showChild}{>childSub}{/if}</div>',
        defaultSettings: { theme: 'dark' },
        defaultState: { showChild: true },
        subTemplates: { childSub: ChildSub },
      });

      // Component setting 'theme' on el must not be overwritten by plugin namespace 'theme'
      expect(el.settings.theme).toBe('dark');
      expect(el.theme).toBeUndefined();
      expect(el.plugins.theme.id).toBe('theme-plugin-instance');
      expect(el.$('.sub').text()).toBe('child');

      // Toggling off the subtemplate runs the plugin's onDestroyed for childSub
      el.template.state.showChild.set(false);
      flush();

      expect(destroyedTemplates).toEqual(['childSub']);
      expect(el.plugins.theme.id).toBe('theme-plugin-instance');
    });

    it('does not leak lifecycleParams getters onto data or shadow templateHelpers when createComponent is omitted', async () => {
      let getterCalls = 0;

      addPlugin(registerPlugin({
        namespace: 'noLeak',
        lifecycleParams: () => ({
          get lazySecret() {
            getterCalls++;
            return 'from-lifecycle';
          },
          sharedName: () => 'lifecycle-fn',
        }),
        templateHelpers: () => ({
          sharedName: () => 'helper-fn',
        }),
      }));

      const { el } = await mount({
        template: '<span class="out">{sharedName}</span>',
      });

      // Render should not have evaluated lazySecret or shadowed templateHelpers with lifecycleParams
      expect(getterCalls).toBe(0);
      expect(el.template.data.lazySecret).toBeUndefined();
      expect(el.$('.out').text()).toBe('helper-fn');
    });

    it('preserves explicit resolveSettings overrides matching initial defaults and deep-clones nested config objects', async () => {
      const entry = addPlugin(registerPlugin({
        namespace: 'isolatedConfig',
        defaultSettings: {
          on: false,
          meta: { count: 0 },
        },
        resolveSettings: ({ settings, config }) => {
          if (isBoolean(config)) {
            return { ...settings, on: config };
          }
          return settings;
        },
        templateHelpers: ({ settings }) => ({
          status: () => `${settings.on}:${settings.meta.count}`,
        }),
      }));

      // Component 1 explicitly sets isolatedConfig: false (matching defaultSettings.on === false)
      const { el: optOutEl } = await mount({
        template: '<span class="s">{status}</span>',
        isolatedConfig: false,
      });

      // Component 2 & 3 share a component definition with a nested object in config
      const sharedTag = uniqueTag('shared-nested');
      defineComponent({
        tagName: sharedTag,
        template: '<span class="s">{status}</span>',
        isolatedConfig: { meta: { count: 1 } },
      });

      const elA = document.createElement(sharedTag);
      const elB = document.createElement(sharedTag);
      document.body.append(elA, elB);
      mountedElements.push(elA, elB);
      await $(elA).onNext('rendered');
      await $(elB).onNext('rendered');

      // Mutating nested config on elA's plugin settings must not mutate elB's config
      elA.isolatedConfig; // instance exists
      const bagA = elA.template._activePlugins[0].pluginBag;
      bagA.settings.meta.count = 99;

      expect(elB.$('.s').text()).toBe('false:1');

      // Mutating app-level pluginSettings.on at runtime must NOT override optOutEl's explicit `false`
      entry.pluginSettings.on = 'rendered';
      flush();

      expect(optOutEl.$('.s').text()).toBe('false:0');
      expect(elB.$('.s').text()).toBe('rendered:1');
    });

    it('tracks dynamic undeclared keys on instance settings proxy', async () => {
      addPlugin(registerPlugin({
        namespace: 'dynamicSettings',
        createPlugin: ({ settings }) => ({
          computeLabel(suffix) {
            return `${settings.dynamicKey || 'init'}:${suffix}`;
          },
          setDynamic(val) {
            settings.dynamicKey = val;
          },
        }),
        templateHelpers: ({ self }) => ({
          dynLabel: () => self.computeLabel('ok'),
        }),
      }));

      const { el } = await mount({
        template: '<span class="dyn">{dynLabel}</span>',
      });

      expect(el.$('.dyn').text()).toBe('init:ok');

      el.dynamicSettings.setDynamic('updated');
      flush();

      expect(el.$('.dyn').text()).toBe('updated:ok');
    });
  });

  describe('5 Grounding Consumers', () => {
    it('1. I18n plugin: reactive locale, namespace shorthand, setup methods, template helper and event bag', async () => {
      const I18n = registerPlugin({
        namespace: 'i18n',
        defaultSettings: {
          locale: 'en',
          fallbackLocale: 'en',
          namespace: '',
          strings: {},
        },
        resolveSettings: ({ settings, config }) => {
          if (isString(config)) {
            return { ...settings, namespace: config };
          }
          return settings;
        },
        setup: ({ settings: appSettings }) => ({
          addStrings(localeMap) {
            const next = { ...appSettings.strings };
            each(localeMap, (messages, loc) => {
              next[loc] = { ...next[loc], ...messages };
            });
            appSettings.strings = next;
          },
          setLocale(nextLocale) {
            appSettings.locale = nextLocale;
          },
        }),
        createPlugin: ({ settings }) => ({
          t(key, values = {}) {
            const { locale, fallbackLocale, namespace, strings } = settings;
            const fullKey = namespace ? `${namespace}.${key}` : key;
            const template = get(strings?.[locale], fullKey)
              ?? get(strings?.[locale], key)
              ?? get(strings?.[fallbackLocale], fullKey)
              ?? get(strings?.[fallbackLocale], key)
              ?? key;
            return isString(template) ? fill(template, values) : template;
          },
        }),
        lifecycleParams: ({ self, settings }) => ({
          t: self.t,
          setLocale: self.setLocale,
          get locale() {
            return settings.locale;
          },
        }),
        templateHelpers: ({ self, settings }) => ({
          t: self.t,
          get locale() {
            return settings.locale;
          },
        }),
      });

      addPlugin(I18n, {
        locale: 'fr',
        fallbackLocale: 'en',
        strings: {
          en: {
            days: 'days',
            checkout: { title: 'Plan {plan}' },
          },
          fr: {
            days: 'jours',
            checkout: { title: 'Forfait {plan}' },
          },
        },
      });

      const { el } = await mount({
        template: "<h2>{t 'title' { plan: plan }}</h2><p>30 {t 'days'}</p><button class=\"lang\">{locale}</button>",
        defaultSettings: { plan: 'Pro' },
        i18n: 'checkout',
        events: {
          'click .lang'({ locale, setLocale }) {
            setLocale(locale === 'fr' ? 'en' : 'fr');
          },
        },
      });

      expect(el.$('h2').text()).toBe('Forfait Pro');
      expect(el.$('p').text()).toBe('30 jours');
      expect(el.$('.lang').text()).toBe('fr');

      el.$('.lang').click();
      flush();

      expect(el.$('h2').text()).toBe('Plan Pro');
      expect(el.$('p').text()).toBe('30 days');
      expect(el.$('.lang').text()).toBe('en');

      // Runtime bundle injection via setup's addStrings
      el.i18n.addStrings({
        en: { checkout: { title: 'Upgraded {plan}' } },
      });
      flush();
      expect(el.$('h2').text()).toBe('Upgraded Pro');
    });

    it('2. Subscriptions plugin: declarative reactive subscriptions, imperative subscribe, and abortSignal cleanup', async () => {
      const activeSubs = [];
      const mockClient = {
        subscribe(name, args) {
          const readySignal = signal(true);
          const sub = {
            name,
            args,
            unsubscribed: false,
            get ready() {
              return readySignal.get();
            },
            unsubscribe() {
              this.unsubscribed = true;
            },
          };
          activeSubs.push(sub);
          return sub;
        },
      };

      const Subscriptions = registerPlugin({
        namespace: 'subscriptions',
        createPlugin: ({ self, config: declarations, componentSettings, reaction, abortSignal, ...bag }) => ({
          handles: {},
          initialize() {
            if (declarations) {
              reaction(() => {
                const spec = isFunction(declarations)
                  ? declarations({ ...bag, settings: componentSettings, subscribe: self.subscribe })
                  : declarations;
                if (isPlainObject(spec)) {
                  each(self.handles, (handle, key) => {
                    if (!(key in spec)) {
                      handle?.unsubscribe?.();
                      delete self.handles[key];
                    }
                  });
                  each(spec, (entry, key) => {
                    self.handles[key]?.unsubscribe?.();
                    self.handles[key] = isString(entry)
                      ? self.subscribe(entry)
                      : self.subscribe(entry.name, entry.args);
                  });
                }
              });
            }
            abortSignal.addEventListener('abort', () => {
              each(self.handles, (handle) => handle?.unsubscribe?.());
            });
          },
          subscribe(name, args) {
            const handle = mockClient.subscribe(name, args);
            abortSignal.addEventListener('abort', () => handle.unsubscribe());
            return handle;
          },
        }),
        lifecycleParams: ({ self }) => ({
          subscribe: self.subscribe,
          subscriptions: self.handles,
        }),
        templateHelpers: ({ self }) => ({
          subscriptions: self.handles,
        }),
      });

      addPlugin(Subscriptions);

      const { el } = await mount({
        template: "<div class=\"status\">{subscriptions.board.ready ? 'ready' : 'loading'}</div>",
        defaultState: { boardId: 'b1' },
        subscriptions: ({ state }) => ({
          board: { name: 'board', args: { id: state.boardId.get() } },
        }),
      });

      expect(el.$('.status').text()).toBe('ready');
      expect(activeSubs).toHaveLength(1);
      expect(activeSubs[0].args).toEqual({ id: 'b1' });
      expect(activeSubs[0].unsubscribed).toBe(false);

      // Reactive change re-subscribes and unsubscribes previous handle
      el.template.state.boardId.set('b2');
      flush();

      expect(activeSubs).toHaveLength(2);
      expect(activeSubs[0].unsubscribed).toBe(true);
      expect(activeSubs[1].args).toEqual({ id: 'b2' });
      expect(activeSubs[1].unsubscribed).toBe(false);

      // Component teardown unsubscribes active handles via abortSignal
      el.remove();
      await new Promise((r) => queueMicrotask(r));
      expect(activeSubs[1].unsubscribed).toBe(true);
    });

    it('3. Router plugin: static ambient lifecycleParams and templateHelpers across components and subtemplates', async () => {
      const routeSignal = signal('/home');

      const RouterPlugin = registerPlugin({
        namespace: 'router',
        appliesTo: 'all',
        lifecycleParams: {
          currentRoute: () => routeSignal.get(),
          navigate: (path) => routeSignal.set(path),
        },
        templateHelpers: {
          currentRoute: () => routeSignal.get(),
          isCurrent: (path) => routeSignal.get() === path,
        },
      });

      addPlugin(RouterPlugin);

      const NavLink = defineComponent({
        templateName: 'navLink',
        template: '<span class="sub">{currentRoute}:{isCurrent \'/about\'}</span>',
      });

      const { el } = await mount({
        template: '<button class="go">Go</button>{>navLink}',
        subTemplates: { navLink: NavLink },
        events: {
          'click .go'({ navigate }) {
            navigate('/about');
          },
        },
      });

      expect(el.$('.sub').text()).toBe('/home:false');
      el.$('.go').click();
      flush();
      expect(el.$('.sub').text()).toBe('/about:true');
    });

    it('4. Analytics plugin: resolveSettings shorthands, opt-out, and lifecycle hooks', async () => {
      const events = [];

      const Analytics = registerPlugin({
        namespace: 'track',
        defaultSettings: {
          on: false,
          name: '$template',
          delay: 0,
          meta: {},
        },
        resolveSettings: ({ settings, config }) => {
          if (isBoolean(config)) {
            return { ...settings, on: config ? (settings.on || 'rendered') : false };
          }
          if (isString(config)) {
            return { ...settings, name: config, on: settings.on || 'rendered' };
          }
          if (isPlainObject(config) && config.on === undefined) {
            return { ...settings, on: settings.on || 'rendered' };
          }
          return settings;
        },
        createPlugin: ({ self, settings, templateName }) => ({
          getEventName(event) {
            const base = settings.name === '$template' ? templateName : settings.name;
            return event ? `${base}:${event}` : base;
          },
          track(event, props = {}) {
            events.push({ name: self.getEventName(event), props: { ...settings.meta, ...props } });
          },
        }),
        lifecycleParams: ({ self }) => ({
          track: self.track,
        }),
        onCreated({ self, settings }) {
          if (settings.on === 'created') {
            self.track('created');
          }
        },
        onRendered({ self, settings, isServer }) {
          if (!isServer && settings.on === 'rendered') {
            self.track('viewed');
          }
        },
        onDestroyed({ self, settings }) {
          if (settings.on === 'destroyed') {
            self.track('destroyed');
          }
        },
      });

      addPlugin(Analytics, { on: 'rendered' });

      // Component 1: string shorthand overrides name
      await mount({
        templateName: 'checkoutPage',
        template: '<div>1</div>',
        track: 'Checkout',
      });

      // Component 2: boolean false opts out of app-level 'rendered'
      await mount({
        templateName: 'quietWidget',
        template: '<div>2</div>',
        track: false,
      });

      // Component 3: plain object with meta
      await mount({
        templateName: 'pricingCard',
        template: '<div>3</div>',
        track: { meta: { tier: 'pro' } },
      });

      expect(events).toEqual([
        { name: 'Checkout:viewed', props: {} },
        { name: 'pricingCard:viewed', props: { tier: 'pro' } },
      ]);
    });

    it('5. Persist plugin: appliesTo configured, hydrates state before createComponent & render, and writes back reactively', async () => {
      const store = new Map();

      const Persist = registerPlugin({
        namespace: 'persist',
        appliesTo: 'configured',
        defaultSettings: {
          keys: [],
          prefix: 'sui:',
        },
        resolveSettings: ({ settings, config }) => {
          if (isString(config)) {
            return { ...settings, keys: [config] };
          }
          if (isArray(config)) {
            return { ...settings, keys: config };
          }
          return settings;
        },
        createPlugin: ({ self, settings, state, reaction, templateName, isServer }) => ({
          getStorageKey(key) {
            return `${settings.prefix}${templateName}.${key}`;
          },
          initialize() {
            if (isServer || isEmpty(settings.keys)) {
              return;
            }
            each(settings.keys, (key) => {
              const sig = state[key];
              if (!sig) {
                return;
              }
              if (store.has(self.getStorageKey(key))) {
                sig.set(JSON.parse(store.get(self.getStorageKey(key))));
              }
              reaction((comp) => {
                const val = sig.get();
                if (!comp.firstRun && val !== undefined) {
                  store.set(self.getStorageKey(key), JSON.stringify(val));
                }
              });
            });
          },
        }),
      });

      addPlugin(Persist);

      store.set('sui:filterBar.sort', JSON.stringify('price-desc'));

      let initialSortInCreateComponent;
      const { el } = await mount({
        templateName: 'filterBar',
        template: '<span class="sort">{sort}</span>',
        defaultState: { sort: 'relevance' },
        persist: 'sort',
        createComponent({ state }) {
          initialSortInCreateComponent = state.sort.get();
          return {};
        },
      });

      expect(initialSortInCreateComponent).toBe('price-desc');
      expect(el.$('.sort').text()).toBe('price-desc');

      el.template.state.sort.set('newest');
      flush();

      expect(store.get('sui:filterBar.sort')).toBe(JSON.stringify('newest'));
    });
  });
});
