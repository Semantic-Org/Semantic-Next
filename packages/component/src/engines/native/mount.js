import { createErrors, isDevelopment, isServer, noop } from '@semantic-ui/utils';

import { getProperties } from '../../component-helpers.js';
import { createComponent } from './factory.js';

const { throwError } = createErrors({ namespace: 'component' });

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

  if (!el.isCustomElement) {
    const source = template.prototypeTemplate || template;
    const ComponentClass = template.componentClass ??= source.componentClass ??= createComponentClass(source);
    ComponentClass.upgradeElement(el, {
      settings: { ...template.data, ...settings },
      renderRoot,
    });
  }

  return el.mount(template, { signal });
}

export function unmount(template) {
  template.element?.unmount?.();
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
