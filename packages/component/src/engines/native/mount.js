import { DynamicRegion } from '@semantic-ui/renderer';
import { createErrors, isDevelopment, isServer, noop } from '@semantic-ui/utils';

import { getProperties } from '../../component-helpers.js';
import { createComponent } from './factory.js';

const { throwError } = createErrors({ namespace: 'component' });

/*
  Mounts a template into a target element, either upgrading the element with
  the component prototype or rendering as a DOM range before `anchor`.
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

function mountRange(template, target, { data, anchor, signal }) {
  if (template.tagName) {
    throwError('unsupportedTagName', 'Template.mount', {
      explanation: isDevelopment
        ? `<${template.tagName}> renders itself. Create the element and insert it before \`anchor\``
        : 0,
    });
  }
  // place both anchors first so an invalid anchor throws before cloning or linking
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
  instance.attachStyles = Boolean(instance.css);
  // set before initialize so detach() cleans up the region if initialize throws
  instance.region = region;
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
      instance.clearReactions();
      instance.removeParent();
      instance.abortController.abort('mount failed');
      instance.detach();
    }
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
