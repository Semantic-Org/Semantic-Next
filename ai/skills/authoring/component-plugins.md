---
title: Component Plugins
description: Guide for extending defineComponent and templates with custom plugins, lifecycle parameters, and template data context using registerPlugin, addPlugin, extendParams, and extendData.
keywords: [registerPlugin, addPlugin, extendParams, extendData, templateData, templateHelpers, lifecycleParams, plugin, resolveSettings, appliesTo, createPlugin, defineComponent]
audience: authoring
skill: component-plugins
type: skill
---

# Component Plugins

> **Skill:** `component-plugins`
> **Purpose:** Extending `defineComponent` and templates with reusable plugins (`registerPlugin`, `addPlugin`), callback parameters (`extendParams`), and template data context (`extendData`).
> **Last Updated:** 2026-10-22

---

**Golden rule: Match the mechanism to the scope.** Use `extendParams` to add callback parameters, `extendData` to add template data context, `registerHelpers` to add template functions that take arguments, and `registerPlugin` when a feature needs its own `defineComponent` option, 3-tier reactive settings, or lifecycle hooks.

---

## Choosing the Right Extension Seam

`@semantic-ui/component` (and `@semantic-ui/component/server`) provides four extension seams at increasing levels of structure:

```
Need to extend components?
│
├─ Inject helpers/services into JS callbacks (createComponent, events, lifecycle)?
│  └─ extendParams(params)
│
├─ Inject values or reactive 0-arg reads into template expressions ({user.name}, {#if is locale 'en'})?
│  └─ extendData(data)
│
├─ Inject template functions that take arguments ({formatCurrency price 'USD'})?
│  └─ registerHelper(name, fn) / registerHelpers(helpers)
│
└─ Full feature with a defineComponent option, 3-tier settings, setup(), or lifecycle hooks?
   └─ registerPlugin(definition) + addPlugin(Plugin, appSettings)
```

| Export | Package | What It Extends | Per-Component Config? |
|--------|---------|-----------------|-----------------------|
| `extendParams(params)` | `@semantic-ui/component` | Destructured callback bag (`createComponent`, `onCreated`, `onRendered`, `onDestroyed`, `events`, `keys`) | No |
| `extendData(data)` | `@semantic-ui/component` | Template data context (`{key}`, `{#if is key 'val'}`, `{>sub prop=key}`) | No |
| `registerHelpers(helpers)` | `@semantic-ui/component` | Global template helpers (`{helperName arg1 arg2}`) | No |
| `registerPlugin(spec)` / `addPlugin(Plugin, settings)` | `@semantic-ui/component` | All of the above + top-level `defineComponent({ [namespace]: config })`, 3-tier reactive `settings`, `setup`, `createPlugin`, lifecycle hooks, and `el.plugins[namespace]` | Yes |

### Core Source Files

| File | Purpose |
|------|---------|
| `packages/component/src/plugins/plugin.js` | `Plugin` class: prototype vs instance lifecycle, reactive settings proxy, `applyTo(template, config)` |
| `packages/component/src/plugins/register-plugin.js` | `registerPlugin` definition normalization and registry |
| `packages/component/src/plugins/add-plugin.js` | `addPlugin` activation and prototype `Plugin` creation |
| `packages/component/src/plugins/extend-params.js` | Standalone `extendParams` registry |
| `packages/component/src/plugins/extend-data.js` | Standalone `extendData` registry |
| `packages/templating/src/template.js` | `Template` integration (`initializeParams`, `initializeData`, `initializePlugins`, `addParams`, `addData`, `addHelpers`) |

---

## registerPlugin

`registerPlugin` defines a reusable plugin (typically exported by a library or shared module). Defining a plugin has no side effects until the app activates it with `addPlugin(Plugin, appSettings)`.

```js
import { registerPlugin } from '@semantic-ui/component';

export const I18n = registerPlugin({
  // Required: top-level key on defineComponent and property on el.plugins[namespace]
  namespace: 'i18n',

  // Which templates receive this plugin:
  // 'components' (default) | 'all' | 'templates' | 'configured' | 'ui-input' | ['ui-input', 'ui-select'] | (bag) => boolean
  appliesTo: 'all',

  // Tier 1 settings (overridden by addPlugin, then by per-component config)
  defaultSettings: {
    locale: 'en',
    fallbackLocale: 'en',
    namespace: null,
    messages: {},
  },

  // Runs ONCE when addPlugin(I18n, appSettings) is called.
  // Returned properties are merged onto `self` for all component instances.
  setup({ settings, isServer, isClient, namespace }) {
    return {
      catalog: { ...settings.messages },
      setLocale(nextLocale) {
        settings.locale = nextLocale;
      },
    };
  },

  // Normalizes per-component shorthand config (e.g. `i18n: 'checkout'`) into settings.
  // May either mutate `settings` in place or return an object of overrides.
  resolveSettings({ settings, config, componentSettings, isServer, isClient }) {
    if (typeof config === 'string') {
      settings.namespace = config;
    }
  },

  // Runs per matching component/template BEFORE createComponent and BEFORE first render.
  createPlugin({ self, settings, config, componentSettings, state, reaction, abortSignal, el, data }) {
    return {
      initialize() {
        if (config?.messages) {
          Object.assign(self.catalog, config.messages);
        }
      },
      t(key, values = {}) {
        const prefix = settings.namespace ? `${settings.namespace}.` : '';
        const table = self.catalog[settings.locale] || self.catalog[settings.fallbackLocale] || {};
        const raw = table[prefix + key] ?? table[key] ?? key;
        return raw.replace(/\{(\w+)\}/g, (_, k) => values[k] ?? '');
      },
    };
  },

  // Injected into JS callbacks (createComponent, lifecycle hooks, events, keys)
  lifecycleParams: ({ self, settings }) => ({
    t: self.t,
    setLocale: self.setLocale,
    locale: () => settings.locale,
  }),

  // Injected into the template data context (usable as values inside any expression)
  templateData: ({ settings }) => ({
    locale: () => settings.locale,
  }),

  // Injected as template helper functions (callable with arguments in templates)
  templateHelpers: ({ self }) => ({
    t: self.t,
  }),

  // Per-component lifecycle hooks
  onCreated({ self, settings, state, reaction, abortSignal }) {},
  onRendered({ self, settings, el, $, $$ }) {},
  onDestroyed({ self, settings }) {},
});
```

---

## addPlugin

`addPlugin(pluginOrNamespace, userSettings)` activates a plugin across the application and supplies Tier 2 application-level settings. Calling `addPlugin` again with the same plugin replaces its prototype instance cleanly (idempotent).

```js
import { addPlugin } from '@semantic-ui/component';
import { I18n } from './i18n-plugin.js';

addPlugin(I18n, {
  locale: 'en',
  messages: {
    en: { 'checkout.pay': 'Pay {amount}' },
    fr: { 'checkout.pay': 'Payer {amount}' },
  },
});
```

Import order between `addPlugin` and `defineComponent` does not matter: `defineComponent` passes a live reference to `availablePlugins` into `Template`, which resolves active plugins when each component instance initializes.

---

## extendParams

Use `extendParams` when you only need to inject utilities, clients, or `abortSignal`-bound helpers into component JS callbacks (`createComponent`, `onCreated`, `onRendered`, `onDestroyed`, `events`, `keys`) without a full plugin.

```js
import { extendParams } from '@semantic-ui/component';

// Static object form
extendParams({
  api: apiClient,
});

// Callback form — receives the component's base callParams (including abortSignal, el, state, settings)
extendParams(({ abortSignal, el }) => ({
  confirmLeave(guardFn) {
    const release = router.confirmLeave(guardFn);
    abortSignal?.addEventListener('abort', release, { once: true });
    return release;
  },
}));
```

---

## extendData

Use `extendData` when you want every template to have direct access to ambient values or reactive zero-argument functions in its data context (`{user.name}`, `{#if session}`, `{#if is currentRoute.name 'board'}`).

```js
import { extendData } from '@semantic-ui/component';
import { user, session } from '@semantic-ui/accounts';

// user() and session() are zero-arg reactive functions — templates read {user.name} and {#if session} directly
extendData({
  user,
  session,
});
```

---

## Critical Rules & Non-Obvious Patterns

### 1. `templateData` vs `templateHelpers`: Values vs Function Calls

In SUI templates, `templateHelpers` are looked up when an expression is invoked with arguments (`{t 'key'}`). Inside sub-expressions like `{#if is locale 'en'}` or `{>avatar user=user}`, the expression evaluator looks up `locale` and `user` in the **data context**, not `helpers` (unless called with parens).

- Put **values and zero-arg reactive reads** (`locale`, `dir`, `user`, `session`, `currentRoute`, `subscriptions`) in **`templateData`** (or `extendData`).
- Put **functions that take arguments** (`t`, `href`, `hasPermission`, `formatCurrency`) in **`templateHelpers`** (or `registerHelpers`).

```js
// ❌ WRONG — putting a 0-arg value in templateHelpers breaks {#if is locale 'en'}
templateHelpers: ({ settings }) => ({
  t: self.t,
  locale: () => settings.locale, // undefined in {#if is locale 'en'}!
}),

// ✅ RIGHT — values go in templateData; functions taking arguments go in templateHelpers
templateData: ({ settings }) => ({
  locale: () => settings.locale,
}),
templateHelpers: ({ self }) => ({
  t: self.t,
}),
```

### 2. Reactive `templateData`: Plain Zero-Arg Functions Over Getters

Every template expression (`{locale}`, `{#if is locale 'en'}`) already evaluates inside its own `Reaction` in the renderer, and `ExpressionEvaluator` automatically calls zero-argument functions found in the data context. Reading `settings.locale` inside `() => settings.locale` registers the reactive dependency on that expression's reaction directly.

```js
// ❌ UNNECESSARY — defensive getter out of fear that a function won't be reactive
templateData: ({ settings }) => ({
  get locale() {
    return settings.locale;
  },
}),

// ✅ RIGHT — plain zero-arg function; evaluated inside the template expression's Reaction
templateData: ({ settings }) => ({
  locale: () => settings.locale,
}),
```

### 3. Three-Tier Reactive Settings & `resolveSettings`

Plugin `settings` merge across three tiers:
1. `defaultSettings` in `registerPlugin`
2. `userSettings` passed to `addPlugin(Plugin, userSettings)`
3. Per-component `defineComponent({ [namespace]: config })`, normalized by `resolveSettings`

Both the global plugin settings and per-component `ownSettings` are wrapped in `Plugin.createReactiveProxy`. Any key not overridden on a component's `ownSettings` forwards `get` and `set` to the plugin's base `settings` proxy:
- Mutating `el.plugins.i18n. setLocale('fr')` (which sets `settings.locale = 'fr'` on the shared plugin settings) reactively updates every component that did not override `locale` locally.
- `resolveSettings({ settings, config, componentSettings, isServer, isClient })` can either **mutate `settings` in place** or **return a new object**.

```js
// Both styles work in resolveSettings:
resolveSettings({ settings, config }) {
  if (typeof config === 'string') {
    settings.namespace = config; // in-place mutation
  }
}
```

### 4. Initialization Ordering: Hydrating State Before First Render

During `Template.prototype.initialize()`, plugin initialization runs **after** `state` and `settings` are created, but **before** `createComponent` and **before** the initial render:

```
1. createReactiveState() (defaultState signals created)
2. initializeParams()    (extendParams merged into customParams)
3. initializeData()      (extendData merged into customData)
4. initializePlugins()   (resolveSettings → createPlugin → plugin.initialize() → lifecycleParams / templateData / templateHelpers)
5. createComponent()     (receives plugin lifecycleParams and sees any state mutated by plugin.initialize())
6. onCreated()           (component onCreated, then plugin.onCreated())
7. render()              (first render sees hydrated state, templateData, and templateHelpers)
8. onRendered()          (component onRendered, then plugin.onRendered())
```

This ordering allows a persistence or subscription plugin to synchronously hydrate `state` inside `createPlugin().initialize()` so that both `createComponent` and the first render see the hydrated value with zero flash.

```js
// Example: Persist plugin hydrating state before createComponent and first render
export const Persist = registerPlugin({
  namespace: 'persist',
  appliesTo: 'configured',
  defaultSettings: { prefix: 'app:', keys: [] },

  resolveSettings({ settings, config }) {
    if (Array.isArray(config)) {
      settings.keys = config;
    }
  },

  createPlugin({ settings, state, reaction, isClient }) {
    return {
      initialize() {
        if (!isClient) return;
        for (const key of settings.keys) {
          const saved = localStorage.getItem(`${settings.prefix}${key}`);
          if (saved !== null && state[key]) {
            state[key].set(JSON.parse(saved));
          }
          reaction((comp) => {
            const val = state[key]?.get();
            if (!comp.firstRun) {
              localStorage.setItem(`${settings.prefix}${key}`, JSON.stringify(val));
            }
          });
        }
      },
    };
  },
});
```

### 5. Precedence & DOM Attachment

Component properties **always win** over plugin-injected properties:
- **Callback bag (`buildCallParams`)**: `{ ...this.customParams, ...baseParams }` — built-in params (`self`, `state`, `settings`, `el`, `reaction`, etc.) cannot be clobbered by `extendParams` or `lifecycleParams`.
- **Template data (`getDataContext`)**: `extend({}, this.customData, this.data, this.state, this.instance)` — component `settings`/`data`, `state`, and `createComponent` methods always take precedence over `extendData` and `templateData`.
- **Template helpers (`addHelpers`)**: Only fills helper names not already defined on `this.helpers`.
- **DOM element attachment**: When a plugin's `createPlugin` returns an instance on a web component (`el`), it is attached at `el.plugins[namespace]` (and `el[namespace]` if not already defined on the element) while mounted, and removed automatically in `onDestroyed`.

---

## Quick Reference

```js
import {
  defineComponent,
  registerPlugin,
  addPlugin,
  extendParams,
  extendData,
  registerHelpers,
} from '@semantic-ui/component';

// 1. Standalone callback params
extendParams(({ abortSignal }) => ({ ... }));

// 2. Standalone template data context (values & 0-arg reactive functions)
extendData({ user, session });

// 3. Full plugin
export const MyPlugin = registerPlugin({
  namespace: 'myPlugin',
  appliesTo: 'components', // 'components' | 'all' | 'templates' | 'configured' | tagName | [tagNames] | fn
  defaultSettings: { enabled: true },
  setup({ settings, isServer, isClient, namespace }) { return {}; },
  resolveSettings({ settings, config, componentSettings }) {},
  createPlugin({ self, settings, config, state, reaction, abortSignal, el }) {
    return { initialize() {} };
  },
  lifecycleParams: ({ self, settings }) => ({}),
  templateData: ({ self, settings }) => ({}),    // 0-arg values in {expr}
  templateHelpers: ({ self, settings }) => ({}), // 1+ arg functions in {fn arg}
  onCreated(bag) {},
  onRendered(bag) {},
  onDestroyed(bag) {},
});

addPlugin(MyPlugin, { enabled: true });
```

---

## Related Skills

| Skill | Use when... |
|-------|-------------|
| `component-authoring` | Building components with `defineComponent`, `createComponent`, `settings`, and `state` |
| `component-lifecycle` | Understanding lifecycle hook execution order, `reaction`, and `abortSignal` cleanup |
| `component-templating` | Template expression syntax, subtemplates, and data context resolution |
| `reactive-state` | Signals, `Reaction`, and reactive dependency tracking |
| `query-behaviors` | Extending `$` (`Query`) with DOM behaviors (`registerBehavior`) rather than component plugins |
