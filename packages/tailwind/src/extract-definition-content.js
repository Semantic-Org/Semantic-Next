/**
 * Scans component definition and collects all content for Tailwind class extraction
 */

import { each, isFunction, isObject } from '@semantic-ui/utils';

export function extractDefinitionContent(definition) {
  const htmlContent = [];
  const jsContent = [];
  const cssContent = [];

  // 1. Template HTML
  if (definition.template) {
    htmlContent.push(definition.template);
  }

  // 1.5. Main component CSS
  if (definition.css) {
    cssContent.push(definition.css);
  }

  // 2. createComponent function
  if (isFunction(definition.createComponent)) {
    jsContent.push(definition.createComponent.toString());
  }

  // 3. Lifecycle functions
  if (isFunction(definition.onCreated)) {
    jsContent.push(definition.onCreated.toString());
  }
  if (isFunction(definition.onRendered)) {
    jsContent.push(definition.onRendered.toString());
  }
  if (isFunction(definition.onDestroyed)) {
    jsContent.push(definition.onDestroyed.toString());
  }
  if (isFunction(definition.onThemeChanged)) {
    jsContent.push(definition.onThemeChanged.toString());
  }
  if (isFunction(definition.onAttributeChanged)) {
    jsContent.push(definition.onAttributeChanged.toString());
  }

  // 4. Events object - functions as values
  if (isObject(definition.events)) {
    each(definition.events, (eventHandler) => {
      if (isFunction(eventHandler)) {
        jsContent.push(eventHandler.toString());
      }
    });
  }

  // 5. Keys object - functions as values
  if (isObject(definition.keys)) {
    each(definition.keys, (keyHandler) => {
      if (isFunction(keyHandler)) {
        jsContent.push(keyHandler.toString());
      }
    });
  }

  // 6. SubTemplates — recurse so nested subtemplates and their JS surfaces
  // (createComponent, lifecycle hooks, events, keys) are all scanned the same
  // way as the top-level definition.
  if (isObject(definition.subTemplates)) {
    each(definition.subTemplates, (subTemplate) => {
      const nested = extractDefinitionContent(subTemplate);
      if (nested.html) { htmlContent.push(nested.html); }
      if (nested.js) { jsContent.push(nested.js); }
      if (nested.css) { cssContent.push(nested.css); }
    });
  }

  const html = htmlContent.join('\n');
  const js = jsContent.join('\n');
  const css = cssContent.join('\n');
  const content = `${html}\n${js}`;

  return {
    html,
    js,
    css,
    content,
  };
}
