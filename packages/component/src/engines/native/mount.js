import { adoptStylesheet, createErrors, each, isDevelopment, isServer, keys, noop } from '@semantic-ui/utils';

import { defineAccessors, getProperties } from '../../component-helpers.js';
import { WebComponentBase } from './base.js';
import { createComponent } from './factory.js';

const { throwError } = createErrors({ namespace: 'component' });
const baseDescriptors = Object.getOwnPropertyDescriptors(WebComponentBase.prototype);

/*
  Mounts a template into an element the caller owns. A plain element is upgraded with the
  component's class for as long as it is mounted, so it carries the accessors, the spec and
  the methods a tag carries and adding a tag later changes nothing from inside. The walks
  find it through the element like any host, and the lifetime stays the caller's through
  unmount or an AbortSignal.
*/

export function mount(template, target, { settings = {}, anchor, signal } = {}) {
  if (isServer) {
    throwError('unsupportedServerMount', 'Template.mount', {
      explanation: isDevelopment ? '`mount()` requires a DOM environment. Use `renderToString()` on the server' : 0,
    });
  }
  if (anchor !== undefined) {
    throwError('unsupportedAnchor', 'Template.mount', {
      explanation: isDevelopment ? '`anchor` is not supported. `mount()` replaces the contents of `target`' : 0,
    });
  }
  if (signal?.aborted) {
    throwError('expiredSignal', 'Template.mount', {
      explanation: isDevelopment ? '`signal` is already aborted' : 0,
    });
  }
  // an instance mounts once, from fresh: mounted, unmounted, or living elsewhere all refuse
  if (!template.isPrototype && template.initialized) {
    throwError('duplicateMount', 'Template.mount', {
      explanation: isDevelopment
        ? `template instance '${template.templateName}' is already initialized. Call \`mount()\` on the prototype template to mount another instance`
        : 0,
    });
  }

  const renderRoot = target;
  const el = target.host ?? target;
  if (el.template?.mounted) {
    throwError('duplicateMount', 'Template.mount', {
      explanation: isDevelopment ? '`target` already carries a mounted template. Call `unmount()` on it first' : 0,
    });
  }

  // a bare element has no property store, a host built its own in its constructor
  const upgrade = el.properties ? null : upgradeElement(el, template, settings, renderRoot);
  let instance = template;
  try {
    // a prototype mounts a copy built on the element's data, an instance mounts itself
    const data = el.getData();
    if (template.isPrototype) {
      instance = template.clone({ data, element: el });
    }
    else {
      instance.setElement(el);
      instance.data = data;
    }

    // the settings a callback sees are the element's, handed to the instance so the
    // returned handle talks the same way
    instance.settings = el.settings;

    // a host adopted its own css when it connected, a bare element has nobody else to
    if (upgrade && instance.css) {
      adoptStylesheet(instance.css, renderRoot);
    }

    instance.initialize();
    // stamped before anything renders: a defined child element upgrades during insertion
    // and reads these to find its parent
    el.template = instance;
    el.component = instance.instance;
    el.dataContext = instance.getDataContext();

    instance.attach(renderRoot);
    const fragment = instance.render(data);
    renderRoot.replaceChildren(fragment);
  }
  catch (error) {
    discard(instance, el, upgrade);
    throw error;
  }
  instance.mounted = { el, renderRoot, upgrade };

  if (signal) {
    signal.addEventListener('abort', () => instance.unmount(), { once: true, signal: instance.abortSignal });
  }
  return instance;
}

// a mount that fails partway leaves nothing behind: the instance's timers and reactions
// end, the element is as it was, and the error reaches the caller
function discard(instance, el, upgrade) {
  if (!instance.isPrototype) {
    if (instance.initialized) {
      instance.onDestroyed();
    }
    else {
      instance.clearReactions();
      instance.abortController.abort('mount failed');
    }
  }
  delete el.template;
  delete el.component;
  delete el.dataContext;
  if (upgrade) {
    restoreElement(el, upgrade);
  }
}

export function unmount(instance) {
  const mounted = instance.mounted;
  if (!mounted) {
    return;
  }
  instance.mounted = null;
  // the handle's settings were the element's, and the element is about to be restored
  instance.settings = undefined;
  // fire destroyed before clearing the DOM so listeners can still read the rendered nodes
  instance.onDestroyed();
  mounted.renderRoot.replaceChildren();
  delete mounted.el.template;
  delete mounted.el.component;
  delete mounted.el.dataContext;
  if (mounted.upgrade) {
    restoreElement(mounted.el, mounted.upgrade);
  }
}

/*******************************
        Element Upgrade
*******************************/

// a plain element inherits the component class's prototype while mounted, the way the
// custom elements polyfill upgraded an element: prototype swapped in, the constructor's
// work run, nothing copied onto the element (benched at 33us vs 54us for per-mount
// property and method assignment). keys an instance carries or a mount passes beyond
// the class's declaration get accessors of their own and a signal through the defaults
function upgradeElement(el, template, settings, renderRoot) {
  const ComponentClass = template.componentClass ??= createComponentClass(template);
  const original = Object.getPrototypeOf(el);
  const upgrade = { original, extras: null };
  Object.setPrototypeOf(el, getUpgradePrototype(ComponentClass, original));
  el.construct();
  el.renderRoot = renderRoot;

  const carried = { ...template.data, ...settings };
  const undeclared = {};
  each(carried, (value, name) => {
    if (!(name in ComponentClass.properties)) {
      undeclared[name] = value;
    }
  });
  if (keys(undeclared).length) {
    upgrade.extras = getProperties({ defaultSettings: undeclared });
    defineAccessors(el, upgrade.extras);
    each(keys(undeclared), (name) => {
      el.defaultSettings[name] = undefined;
    });
  }
  // seeded in the store rather than through the accessors, so nothing renders early
  each(carried, (value, name) => {
    el.properties.set(name, value);
  });
  return upgrade;
}

// layers the component class over the element's native tag prototype so a mounted
// <dialog> can still call native methods like showModal() and close() while taking on
// the custom element's properties and methods like settings, requestUpdate(), and $,
// acting as a facsimile of the custom element without losing its native behavior
function getUpgradePrototype(ComponentClass, original) {
  const cache = ComponentClass.upgradePrototypes ??= new WeakMap();
  let proto = cache.get(original);
  if (!proto) {
    proto = Object.create(original, {
      ...baseDescriptors,
      ...Object.getOwnPropertyDescriptors(ComponentClass.prototype),
    });
    cache.set(original, proto);
  }
  return proto;
}

// the class defineComponent would have handed a tag, made on first mount for a template
// that never got one: the same factory, minus the registration
function createComponentClass(template) {
  return createComponent({
    prototypeTemplate: template,
    resolvedProperties: getProperties({ defaultSettings: template.defaultSettings }),
    css: template.css,
    delegatesFocus: false,
    componentSpec: false,
    defaultSettings: template.defaultSettings,
    plural: false,
    onAttributeChanged: noop,
  });
}

// the constructor's fields stay as names holding nothing: a delete would leave the
// element in dictionary mode for the rest of its life
function restoreElement(el, { original, extras }) {
  if (extras) {
    each(extras, (config, name) => {
      if (!config.noAccessor) {
        delete el[name];
      }
    });
  }
  Object.setPrototypeOf(el, original);
  each([
    'renderCallbacks',
    'properties',
    'css',
    'componentSpec',
    'settings',
    'settingsVars',
    'uiClasses',
    'defaultSettings',
    'renderRoot',
    'updateScheduled',
    '_pendingRender',
  ], (name) => {
    el[name] = undefined;
  });
}
