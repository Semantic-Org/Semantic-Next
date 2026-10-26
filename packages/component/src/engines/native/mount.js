import { nonreactive } from '@semantic-ui/reactivity';
// direct import avoids circular chunk dependency between component and templating
import { Template } from '@semantic-ui/templating/template';
import { adoptStylesheet, createErrors, each, isDevelopment, isServer } from '@semantic-ui/utils';

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
  The el door. A caller hands over an element and the template takes it: the element
  gets the contract a host carries so adding a tag later changes nothing from inside,
  the nearest sui host is registered before anything runs so findParent works from
  onCreated, and the lifetime stays the caller's through unmount or an AbortSignal.
*/

export function mount(template, target, { settings = {}, anchor, signal } = {}) {
  if (isServer) {
    throwError('mountOnServer', 'Template.mount', {
      explanation: isDevelopment ? 'mount needs a DOM. Use renderToString on the server.' : 0,
    });
  }
  if (anchor !== undefined) {
    throwError('mountAnchor', 'Template.mount', {
      explanation: isDevelopment ? 'anchor is not supported. mount replaces the contents of target.' : 0,
    });
  }
  if (signal?.aborted) {
    throwError('mountAborted', 'Template.mount', {
      explanation: isDevelopment ? 'signal is already aborted.' : 0,
    });
  }
  if (!template.isPrototype && template.mounted) {
    throwError('mountTwice', template.templateName, {
      explanation: isDevelopment ? 'an instance mounts once. Mount the prototype to mount again.' : 0,
    });
  }

  const renderRoot = target;
  const el = target.host ?? target;

  // a bare element has no property store, a host built its own in its constructor
  const contracted = !el.properties;
  const properties = contracted ? contractElement(el, template, settings) : null;
  each(settings, (value, name) => {
    el[name] = value;
  });

  const data = dataFrom(el, properties);
  let instance = template;
  if (template.isPrototype) {
    instance = template.clone({ data, element: el });
  }
  else {
    instance.setElement(el);
    instance.setDataContext({ ...instance.data, ...data }, { rerender: false });
  }

  // the settings a callback sees are the element's, handed to the instance so the
  // returned handle talks the same way
  instance.settings = el.settings;

  const host = hostAbove(el);
  if (host) {
    instance.setParent(host);
  }
  if (instance.css) {
    adoptStylesheet(instance.css, renderRoot);
  }

  nonreactive(() => instance.initialize());
  instance.attach(renderRoot);
  const fragment = nonreactive(() => instance.render());
  renderRoot.replaceChildren(fragment);

  el.template = instance;
  el.component = instance.instance;
  el.dataContext = instance.getDataContext();
  instance.mounted = { el, renderRoot, properties };

  if (signal) {
    signal.addEventListener('abort', () => instance.unmount(), { once: true, signal: instance.abortSignal });
  }
  return instance;
}

export function unmount(instance) {
  const mounted = instance.mounted;
  if (!mounted) {
    return;
  }
  instance.mounted = null;
  // the destroyed event leaves from the element while its content still stands
  instance.onDestroyed();
  mounted.renderRoot.replaceChildren();
  delete mounted.el.template;
  delete mounted.el.component;
  delete mounted.el.dataContext;
  if (mounted.properties) {
    restoreElement(mounted.el, mounted.properties);
  }
}

// the nearest sui host above the element, read the way findParent reads it
function hostAbove(el) {
  for (let node = el.parentNode || el.host; node; node = node.parentNode || node.host) {
    if (node.template instanceof Template && !node.template.isPrototype) {
      return node.template;
    }
  }
}

/*******************************
        Element Contract
*******************************/

// what a host's constructor gives a custom element, given to a bare element instead.
// keys passed at mount count as declared so an undeclared value still reaches the
// data context and gets its own accessor
function contractElement(el, template, settings) {
  const properties = getProperties({
    defaultSettings: { ...template.defaultSettings, ...settings },
  });
  el.properties = new Map();
  el.renderRoot = el;
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
      this.pendingRender = false;
      this.template?.render(dataFrom(this, properties));
    });
  };
  setDefaultSettings(el, { defaultSettings: template.defaultSettings });
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
    'defaultSettings',
    'settings',
    'settingsVars',
    'updateScheduled',
    'pendingRender',
  ], (name) => {
    delete el[name];
  });
}

// the data a host builds per render, for an element that has no getData of its own
function dataFrom(el, properties) {
  if (!properties) {
    return el.getData();
  }
  const data = getSettingsFromConfig(el, { properties });
  Object.defineProperty(data, 'darkMode', {
    get() {
      return el.isDarkMode();
    },
    enumerable: true,
    configurable: true,
  });
  return data;
}
