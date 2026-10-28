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

// the container is the template's element and the enclosing component its parent, the two
// things the subtemplate block gives, so events, walks and settings take a {>child}'s paths
function mountRange(template, target, { data, anchor, signal }) {
  if (template.tagName) {
    throwError('unsupportedAnchor', 'Template.mount', {
      explanation: isDevelopment
        ? `<${template.tagName}> renders itself. Create the element and insert it before \`anchor\``
        : 0,
    });
  }
  // both anchors go in first, so a bad anchor fails before anything is cloned or linked
  // and the range is closed before the template attaches
  const region = new DynamicRegion(target);
  target.insertBefore(region.anchor, anchor);
  region.placeEndAnchor();

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
  if (instance.css) {
    adoptStylesheet(instance.css, target);
  }
  try {
    instance.initialize();
    instance.attach(target, { region });
    region.setContent(instance.render());
  }
  catch (error) {
    if (instance.initialized) {
      instance.onDestroyed();
    }
    else {
      instance.removeParent();
      instance.abortController.abort('mount failed');
    }
    // a throw before attach leaves the region unowned, and clearing twice is a no-op
    region.clear();
    region.anchor.remove();
    throw error;
  }
  instance.mounted = true;

  if (signal) {
    signal.addEventListener('abort', () => instance.unmount(), { once: true, signal: instance.abortSignal });
  }
  return instance;
}

function findHost(node) {
  while (node) {
    if (node.template) {
      return node;
    }
    node = node.parentNode || node.host;
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
