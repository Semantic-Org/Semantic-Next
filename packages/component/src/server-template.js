// direct import avoids circular chunk dependency between component ↔ templating
import { Template } from '@semantic-ui/templating/template';
import { each, kebabToCamel } from '@semantic-ui/utils';

import { getUIClasses, resolveAttributeAliases } from './component-helpers.js';

/*
  The server instance of a definition, the class a tagged defineComponent returns
  or the prototype Template a tag-less one does. Attributes arrive by their html
  names, so they are read as property names and aliased through the spec before
  the defaults merge under them. The prototype clones with that data and
  initializes, so createComponent runs with isServer. renderOptions reach the
  renderer as given.
*/
export function createServerTemplate(definition, attrs = {}, { renderOptions } = {}) {
  const isTemplate = definition instanceof Template;
  const proto = isTemplate ? definition : definition.template;
  if (!proto) {
    throw new Error(`Component ${definition.componentTagName} has no template`);
  }
  // a tag-less definition keeps its defaults and css on the template itself
  const config = isTemplate ? { defaultSettings: proto.defaultSettings, css: proto.css } : definition.config || {};
  const defaultSettings = config.defaultSettings || {};
  const componentSpec = config.componentSpec;
  const css = config.css || '';
  const resolvedProperties = config.resolvedProperties || definition.properties || {};

  // fromAttribute converters already ran wherever attributes came from markup
  const normalizedAttrs = {};
  each(attrs, (value, key) => {
    normalizedAttrs[kebabToCamel(key)] = value;
  });
  resolveAttributeAliases(normalizedAttrs, componentSpec);

  const specDefaults = componentSpec?.defaultValues || {};
  const data = { ...specDefaults, ...defaultSettings, ...normalizedAttrs };
  const template = proto.clone({ data, renderingEngine: 'native' });
  // no host element on the server, so the settings are the data itself, and the
  // render options sit on the instance for its renderer to read
  template.settings = data;
  template.renderOptions = renderOptions;
  template.initialize();

  // after initialize, since createComponent can change the settings {uiClasses} reads
  if (componentSpec) {
    data.uiClasses = getUIClasses(data, { componentSpec, properties: resolvedProperties });
  }
  return { template, normalizedAttrs, resolvedProperties, css };
}
