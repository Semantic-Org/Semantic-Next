import { adoptStylesheet, createErrors, each, isDevelopment, isServer, mapObject } from '@semantic-ui/utils';

import {
  createSettingsProxy,
  defineAccessors,
  getProperties,
  getSettingsFromConfig,
  isDarkMode,
  setDefaultSettings,
} from '../../component-helpers.js';

const { throwError } = createErrors({ namespace: 'component' });

/*
  Mounts a template into an element the caller owns. A bare element is set up with what
  a host's constructor gives a custom element, so adding a tag later changes nothing from
  inside. The walks find it through the element like any host, and the lifetime stays the
  caller's through unmount or an AbortSignal.
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
  const bare = !el.properties;
  const properties = bare ? setupElement(el, template, settings, renderRoot) : null;
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

    if (instance.css) {
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
    discard(instance, el, properties);
    throw error;
  }
  instance.mounted = { el, renderRoot, properties };

  if (signal) {
    signal.addEventListener('abort', () => instance.unmount(), { once: true, signal: instance.abortSignal });
  }
  return instance;
}

// a mount that fails partway leaves nothing behind: the instance's timers and reactions
// end, the element is as it was, and the error reaches the caller
function discard(instance, el, properties) {
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
  if (properties) {
    restoreElement(el, properties);
  }
}

export function unmount(instance) {
  const mounted = instance.mounted;
  if (!mounted) {
    return;
  }
  instance.mounted = null;
  // fire destroyed before clearing the DOM so listeners can still read the rendered nodes
  instance.onDestroyed();
  mounted.renderRoot.replaceChildren();
  delete mounted.el.template;
  delete mounted.el.component;
  delete mounted.el.dataContext;
  if (mounted.properties) {
    restoreElement(mounted.el, mounted.properties);
  }
}

/*******************************
         Element Setup
*******************************/

// what a host's constructor gives a custom element, given to a bare element instead.
// keys an instance carries or a mount passes count as declared, under the template's own
// defaults, so each gets an accessor, a seeded store, and a shadow signal the overlay
// forces, and the element is the one source every render reads
function setupElement(el, template, settings, renderRoot) {
  const declared = { ...template.defaultSettings, ...template.data, ...settings };
  const properties = getProperties({ defaultSettings: declared });
  el.properties = new Map();
  each({ ...template.data, ...settings }, (value, name) => {
    el.properties.set(name, value);
  });
  el.renderRoot = renderRoot;
  el.setSetting = function(name, value) {
    this[name] = value;
  };
  el.isDarkMode = function() {
    return isDarkMode(this);
  };
  el.requestUpdate = function() {
    this.updateScheduled = true;
    if (this.pendingRender) {
      return;
    }
    this.pendingRender = true;
    queueMicrotask(() => {
      // unmounted in the meantime: the element was restored, leave it that way
      if (!this.template) {
        return;
      }
      this.pendingRender = false;
      this.template.render(this.getData());
    });
  };
  // the data a host builds per render
  el.getData = function() {
    const element = this;
    const data = getSettingsFromConfig(element, { properties });
    Object.defineProperty(data, 'darkMode', {
      get() {
        return element.isDarkMode();
      },
      enumerable: true,
      configurable: true,
    });
    return data;
  };
  // every declared key, with the template's own default as its value. a key the mount
  // declared has none, so clearing it reads as empty rather than as the value it arrived with
  const defaults = mapObject(declared, (value, name) => template.defaultSettings?.[name]);
  setDefaultSettings(el, { defaultSettings: defaults });
  defineAccessors(el, properties);
  el.settings = createSettingsProxy(el);
  return properties;
}

function restoreElement(el, properties) {
  each(properties, (config, name) => {
    if (!config.noAccessor) {
      delete el[name];
    }
  });
  each([
    'properties',
    'renderRoot',
    'setSetting',
    'isDarkMode',
    'requestUpdate',
    'getData',
    'defaultSettings',
    'settings',
    'settingsVars',
    'updateScheduled',
    'pendingRender',
  ], (name) => {
    delete el[name];
  });
}
