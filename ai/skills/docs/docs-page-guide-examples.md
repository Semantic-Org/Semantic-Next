---
title: Guide Page Rewrite Examples
description: Concrete before-and-after rewrites from Semantic UI guides showing how to model the audience, gloss unrelated code, keep snippets under 10 lines, avoid source-code narration, and pair actor code blocks.
keywords: [guide examples, before and after, rewrites, audience modeling, code snippets, glossing]
audience: docs
skill: docs-page-guide-examples
type: skill
---

# Guide Page Rewrite Examples

> **Skill:** `docs-page-guide-examples`
> **Purpose:** Real before-and-after rewrites showing the difference between an agent narrating source code and an expert teaching a newcomer

**Companion to:** [`docs-page-guide`](./docs-page-guide.md)

---

## 1. Audience Modeling & Section Ordering (`2 + Addendum`)

### ❌ Agent Draft: Ordered by internal architecture, interrupts consumers with author mechanics

```markdown
## Using Plugins
### Adding a Plugin
### Using in a Component

## Extending Callbacks (extendParams)
### Shared Parameters
### Per-Component Parameters

## Authoring Plugins
### Custom Component Options
### Instance Methods & Template Helpers
### Plugin Settings
```

**Why it fails:**
- A reader who came to learn how to **use** a plugin hits `extendParams` (a low-level escape hatch for injecting callback params) before seeing how plugins are authored.
- A reader who came to **author** a plugin has to scroll past `extendParams` first.

### ✅ Maintainer Rewrite: `Consumer → Author → Escape Hatch Addendum`

```markdown
## Using Plugins
### Adding a Plugin (Third-party NPM first, then Local)
### Using Plugins in Components
### Usage Example

## Authoring Plugins
### Registering Plugins (Commented config skeleton + Playground)
### Creating a Plugin (createPlugin + DOM Access)
### Specifying When Plugin Applies (Scoping table + Custom appliesTo pair)
### Callback Parameters (lifecycleParams)
### Template Helpers (templateHelpers)
### Plugin Settings (defaultSettings)
### Advanced Plugin Settings (resolveSettings)

## Extending Callbacks (Addendum: when you don't need a full plugin)
### Per-Component Parameters
### Extend Params Example
```

**Why it works:**
- **Bifurcates by audience**: 90% of readers only ever *consume* plugins (`## Using Plugins`). They get third-party npm usage first, local import second, and component usage third.
- **Orders authoring by progressive complexity**: Starts with the full `registerPlugin` skeleton, then instance creation, scoping, params/helpers, basic `defaultSettings`, and finally `resolveSettings` for custom shorthand resolution.
- **Places the escape hatch at the end (`2 + Addendum`)**: `extendParams` is framed explicitly as *"If you want to just provide additional component lifecycle params without writing a full plugin"*.

---

## 2. Separating Automatic Behavior from One Example's Idioms

### ❌ Agent Draft: Presents one example plugin's conventions as automatic framework behavior

```markdown
### Using in a Component

Once added, a plugin can be configured directly on `defineComponent` under its name (`i18n`), and any template helpers or callback arguments it provides are immediately available inside the component.

```javascript {2,9}
const events = {
  'click ui-button'({ i18n, data }) {
    i18n.setLocale(data.locale);
  },
};

defineComponent({
  tagName: 'checkout-summary',
  i18n: 'checkout', // uses checkout translations for this component
  template: `<h3>{t 'title'}</h3>`,
  events,
});
```
```

**Why it fails:**
- The agent had `i18n-plugin.js` open in its context and conflated three different things into one snippet:
  1. `defineComponent({ i18n: ... })` (which *is* automatic for every plugin's `namespace`)
  2. `({ i18n })` in `events` (which only exists if a plugin author explicitly wrote `lifecycleParams`)
  3. `{t 'title'}` in `template` (which only exists if a plugin author explicitly wrote `templateHelpers`)
- A reader trying another plugin will wonder why `({ myPlugin })` isn't automatically in their `events` callback.

### ✅ Maintainer Rewrite: Separates what every plugin does from what some plugins opt into

```markdown
### Using Plugins in Components

Plugins can be configured directly from `defineComponent` by passing a key with the plugin's name

```javascript {6-8}
defineComponent({
  tagName: 'my-component',
  createComponent,
  onCreated,
  onDestroyed,
  i18n: {
    locale: 'en',
  },
});
```

Some plugins might also expose new lifecycle arguments that you can access to interact with their APIs.

```javascript {3}
const events = {
  'click ui-button'({ i18n, data }) {
    i18n.setLocale(data.locale);
  },
};
```

Or custom template helpers that are enabled when you activate the plugin

```sui title='template.html'
<h3>{t 'title'}</h3>
<p>{t 'description'}</p>
```

You can also access the plugin from the DOM from any component

```javascript
document.querySelector('my-component').pluginName.method();
```
```

**Why it works:**
- Each mechanism gets its own 4–8 line snippet.
- Unrelated `defineComponent` keys (`createComponent, onCreated, onDestroyed`) are glossed as bare identifiers so the highlighted `i18n: { locale: 'en' }` stands out immediately.
- Optional plugin features are introduced accurately (*"Some plugins might also expose..."*, *"Or custom template helpers..."*).

---

## 3. Black-Box User Perspective vs. Source-Code Narration

### ❌ Agent Draft: Narrating the implementation (`Proxy`, prototype fallback)

```markdown
### Reactive Settings

`defaultSettings` merged in `addPlugin` are wrapped in a reactive proxy, while `resolveSettings` maps shorthand component config (like `i18n: 'checkout'`) onto that component's settings.

```javascript {8-13}
const defaultSettings = {
  locale: 'en',
  strings: {},
  prefix: '',
};

// allow shorthand config like i18n: 'checkout'
const resolveSettings = ({ settings, config }) => {
  if (isString(config)) {
    return { ...settings, prefix: config };
  }
  return settings;
};
```

Keys overridden by a component (`prefix: 'checkout'`) stay local to that component, while unoverridden keys (`locale`) read and write through to the shared plugin settings across the page.
```

**Why it fails:**
- Reads like someone with `plugin.js` open trying to describe the implementation in words (*"wrapped in a reactive proxy"*, *"read and write through to the shared plugin settings"*).
- Doesn't show what the **component user** actually writes! It only shows the plugin author's half.
- Combines basic `defaultSettings` and advanced `resolveSettings` into one section instead of teaching the simple case first.

### ✅ Maintainer Rewrite: Split into Basic + Advanced, paired `Plugin` / `User` blocks, zero internals

```markdown
### Plugin Settings

Plugin settings let you specify settings that a downstream user can set on their component.

```javascript title='Plugin' {3-5}
registerPlugin({
  name: 'i18n',
  defaultSettings: {
    lang: 'en',
  },
});
```

```javascript title='User' {2-4}
defineComponent({
  i18n: {
    lang: 'es', // component uses a diff lang
  },
  tagName,
  createComponent,
  // rest
});
```

### Advanced Plugin Settings

If you need to customize how a user's settings are applied to your plugin use [`resolveSettings`](/docs/api/component/plugins#options).

```javascript title='User' {2}
defineComponent({
  i18n: 'es', // shorthand use
  tagName,
  createComponent,
  // rest
});
```

```javascript title='Plugin' {6-11}
registerPlugin({
  name: 'i18n',
  defaultSettings: {
    lang: 'en',
  },
  // shorthand supported
  resolveSettings({ settings, config }) {
    if (isString(config)) {
      settings.lang = config;
    }
  },
});
```
```

**Why it works:**
- **Progressive complexity**: Teaches basic `defaultSettings` first, then `resolveSettings` in `Advanced Plugin Settings`.
- **Order of blocks matches causality**:
  - In `Plugin Settings`, the plugin defines `defaultSettings` first (`title='Plugin'`), then the user overrides it (`title='User'`).
  - In `Advanced Plugin Settings`, the motivation is the user wanting to write `i18n: 'es'` shorthand (`title='User'` first!), followed by how the plugin supports that shorthand (`title='Plugin'` second!).
- **Every block is ≤ 11 short lines** and glosses unrelated component options with `tagName, createComponent, // rest`.

---

## 4. Splitting Multi-Concept Blocks & Using Contrast Pairs

### ❌ Agent Draft: 3 bullets followed by one combined 20-line code block

```markdown
### Instance Methods & Template Helpers

A plugin can extend components in three places:
* **`createPlugin`** defines the plugin's per-component instance (`self`)...
* **`lifecycleParams`** adds properties to the component's callback arguments...
* **`templateHelpers`** registers custom template helpers...

```javascript
const createPlugin = ({ settings }) => ({
  t(key) {
    const { locale, prefix, strings } = settings;
    const path = prefix ? `${prefix}.${key}` : key;
    return get(strings[locale], path) ?? key;
  },
});

const lifecycleParams = ({ self }) => ({
  t: self.t,
  i18n: self,
});

const templateHelpers = ({ self }) => ({
  t: self.t,
});
```
```

**Why it fails:**
- Forces the reader to hold three concepts in working memory at once and mentally map each bullet to a slice of a large code block.
- Never shows the consumer side (`User` event handler or `User Template`) for `lifecycleParams` or `templateHelpers`.

### ✅ Maintainer Rewrite: Separate `###` sections, each pairing `Plugin` with `User`

```markdown
### Callback Parameters

`lifecycleParams` lets you pass your plugin's methods or properties to component's [callback arguments](/docs/guides/components/lifecycle#callback-arguments) received by lifecycle events like [`createComponent`](/docs/guides/components/instances#create-component), [event handlers](/docs/guides/components/events), [keybindings](/docs/guides/components/keys), and [lifecycle callbacks](/docs/guides/components/lifecycle)

```javascript title="Plugin" {3}
const lifecycleParams = ({ self }) => ({
  t: self.t,
  i18n: self, // expose whole plugin to user
});
```

Components can then destructure `{ t, i18n }` directly inside any callback alongside standard arguments like `state` and `data`:

```javascript title="User" {3}
const events = {
  'click ui-button'({ i18n, data }) {
    i18n.setLocale(data.locale); // call a plugin API
  },
};
```

### Template Helpers

Use `templateHelpers` to register [custom template helpers](/docs/guides/templates/helpers#custom-helpers) that components can call inside their [templates](/docs/guides/templates/expressions).

```javascript title="Plugin"
const templateHelpers = ({ self }) => ({
  t: self.t,
});
```

```sui title="User Template"
<h3>{t 'title'}</h3>
<p>{t 'subtotal'}</p>
```
```

And when teaching a conditional predicate like `appliesTo`, pair the `Plugin` with both the matching and non-matching `User` components:

```markdown
```js title='Plugin' {6-9}
registerPlugin({
  name: 'currencyLocale',
  defaultSettings: {
    language: 'en',
  },
  // apply if a user has `currency` in their own settings
  appliesTo({ componentSettings }) {
    return Boolean(componentSettings?.currency);
  },
});
```

```js title="User (Plugin Used)" {3-6}
defineComponent({
  tagName: 'money-input',
  // component has currency
  defaultSettings: {
    currency: 'usd',
  },
});
```

```js title="User (Plugin Not Used)" {3-6}
defineComponent({
  tagName: 'text-input',
  // not related to currency
  defaultSettings: {
    value: '',
  },
});
```
```
