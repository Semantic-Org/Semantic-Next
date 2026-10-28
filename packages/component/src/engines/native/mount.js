import { DynamicRegion } from '@semantic-ui/renderer';
import { adoptStylesheet, createErrors, isDevelopment, isServer, noop } from '@semantic-ui/utils';

import { getProperties } from '../../component-helpers.js';
import { createComponent } from './factory.js';

const { throwError } = createErrors({ namespace: 'component' });

/*
  Mounts a template into a caller-owned DOM element, upgrading plain elements
  with the component prototype for the lifetime of the mount. With `anchor` the
  element is a container instead: the template renders as a range before the
  anchor and the element is left as it is.
*/

export function mount(template, target, { settings = {}, data = {}, anchor, signal } = {}) {
  if (isServer) {
    throwError('unsupportedServerMount', 'Template.mount', {
      explanation: isDevelopment ? '`mount()` requires a DOM environment. Use `renderToString()` on the server' : 0,
    });
  }
  if (signal?.aborted) {
    throwError('expiredSignal', 'Template.mount', {
      explanation: isDevelopment ? '`signal` is already aborted' : 0,
    });
  }
  if (!template.isPrototype && template.initialized) {
    throwError('duplicateMount', 'Template.mount', {
      explanation: isDevelopment
        ? `template instance '${template.templateName}' is already initialized. Call \`mount()\` on the prototype template to mount another instance`
        : 0,
    });
  }
  if (anchor !== undefined) {
    return mountRange(template, target, { data: { ...template.data, ...data, ...settings }, anchor, signal });
  }

  const renderRoot = target;
  const el = target.host ?? target;
  if (el.template?.mounted) {
    throwError('duplicateMount', 'Template.mount', {
      explanation: isDevelopment ? '`target` already carries a mounted template. Call `unmount()` on it first' : 0,
    });
  }

  // refuse defined custom elements, which manage their own lifecycle (undefined custom tags are allowed for light DOM mounting)
  if (customElements.get(el.localName)) {
    throwError('definedElement', 'Template.mount', {
      explanation: isDevelopment
        ? `<${el.localName}> is a defined custom element and renders itself. Mount into a plain element or a tag that is not yet defined`
        : 0,
    });
  }

  const source = template.prototypeTemplate || template;
  const ComponentClass = template.componentClass ??= source.componentClass ??= createComponentClass(source);
  ComponentClass.upgradeElement(el, { renderRoot });
  return el.mount(template, {
    data: { ...template.data, ...data, ...settings },
    signal,
  });
}

export function unmount(template) {
  const { region } = template;
  if (!region) {
    template.element?.unmount?.();
    return;
  }
  template.mounted = false;
  // destroyed fires before the range leaves so callbacks can still query rendered nodes
  try {
    template.onDestroyed();
  }
  finally {
    region.clear();
    region.anchor.remove();
    template.region = undefined;
    template.renderRoot = undefined;
    template.parentNode = undefined;
    template.startNode = undefined;
    template.endNode = undefined;
  }
}

// a range mount is the subtemplate block's shape with javascript as the caller: the
// template's element is the container and its parent is the enclosing component's
// template, so the walks, events and settings all take the paths a {>child} takes
function mountRange(template, target, { data, anchor, signal }) {
  if (template.tagName) {
    throwError('unsupportedAnchor', 'Template.mount', {
      explanation: isDevelopment
        ? `<${template.tagName}> renders itself. Create the element and insert it before \`anchor\``
        : 0,
    });
  }
  let instance = template;
  if (template.isPrototype) {
    instance = template.clone({ data, element: target });
  }
  else {
    instance.setElement(target);
    instance.data = data;
  }
  const host = findHost(target);
  if (host) {
    instance.setParent(host.template);
  }

  // both anchors are in the tree before the template attaches, so the range is closed
  // from the first event and a {>child} rendering inside it finds this render root
  const region = new DynamicRegion(target);
  target.insertBefore(region.anchor, anchor);
  region.placeEndAnchor();
  if (instance.css) {
    adoptStylesheet(instance.css, target);
  }
  try {
    instance.initialize();
    instance.attach(target, { parentNode: target, startNode: region.anchor, endNode: region.endAnchor });
    region.setContent(instance.render());
  }
  catch (error) {
    region.clear();
    region.anchor.remove();
    if (instance.initialized) {
      instance.onDestroyed();
    }
    else {
      instance.removeParent();
      instance.abortController.abort('mount failed');
    }
    throw error;
  }
  instance.region = region;
  instance.mounted = true;

  if (signal) {
    signal.addEventListener('abort', () => instance.unmount(), { once: true, signal: instance.abortSignal });
  }
  return instance;
}

// the nearest element above the container that carries a mounted template
function findHost(node) {
  for (; node; node = node.parentNode || node.host) {
    if (node.template) {
      return node;
    }
  }
}

// lazily create an unregistered component class for tagless templates
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
