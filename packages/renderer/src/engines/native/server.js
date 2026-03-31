/*
  Server-side renderer for the native engine.
  Pure string manipulation — no DOM, no Signals, no Reactions.
  Runs in Node, Deno (--allow-eval), Bun, Cloudflare Workers (unsafe-eval).

  Input: AST + data context + CSS
  Output: HTML string with Declarative Shadow DOM
*/

import { Signal } from '@semantic-ui/reactivity';
import {
  arrayFromObject,
  each,
  inArray,
  isArray,
  isEmpty,
  isFunction,
  isPlainObject,
  isString,
} from '@semantic-ui/utils';

import { analyzePosition, BLOCK_MARKER, COMMENT_MARKER } from '../../build-html-string.js';
import { ExpressionEvaluator } from '../../expression-evaluator.js';

const REMOVE_ATTR = '__SUI_REMOVE__';
const REMOVE_ATTR_REGEX = /\s+[\w.@-]+\s*=\s*["']?__SUI_REMOVE__["']?/g;

function escapeHTML(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

/*******************************
      Public API
*******************************/

export function renderToString({ ast, data = {}, css = '', subTemplates = {}, helpers = {} }) {
  const snippets = {};
  const evaluator = new ExpressionEvaluator({ data, helpers });

  let content = renderNodes(ast, data, evaluator, snippets, subTemplates, helpers);
  content = content.replace(REMOVE_ATTR_REGEX, '');

  let result = '';
  if (css) {
    result += `<style>${css}</style>`;
  }
  result += content;

  return `<template shadowrootmode="open">${result}</template>`;
}

/*******************************
      AST → HTML String
*******************************/

function renderNodes(ast, data, evaluator, snippets, subTemplates, helpers, scope) {
  if (!scope) {
    scope = { entryId: 0, htmlBuffer: '' };
  }

  let html = '';

  for (const node of ast) {
    switch (node.type) {
      case 'html':
        html += node.html;
        scope.htmlBuffer += node.html;
        break;

      case 'expression':
        html += renderExpression(node, data, evaluator, scope);
        break;

      case 'svg':
        // SVG content is flattened inline — shares the parent scope
        html += renderNodes(node.content, data, evaluator, snippets, subTemplates, helpers, scope);
        break;

      case 'snippet':
        snippets[node.name] = node;
        break;

      case 'slot':
        html += node.name ? `<slot name="${node.name}"></slot>` : '<slot></slot>';
        scope.htmlBuffer += '<slot>';
        break;

      case 'if':
        html += renderConditional(node, data, evaluator, snippets, subTemplates, helpers, scope);
        break;

      case 'each':
        html += renderEach(node, data, evaluator, snippets, subTemplates, helpers, scope);
        break;

      case 'async':
        html += renderAsync(node, data, evaluator, snippets, subTemplates, helpers, scope);
        break;

      case 'rerender':
        html += renderRerender(node, data, evaluator, snippets, subTemplates, helpers, scope);
        break;

      case 'template':
        html += renderTemplate(node, data, evaluator, snippets, subTemplates, helpers, scope);
        break;
    }
  }

  return html;
}

/*******************************
      Expression Rendering
*******************************/

function renderExpression(node, data, evaluator, scope) {
  const id = scope.entryId++;
  const classification = analyzePosition(scope.htmlBuffer);
  const value = evaluator.lookupExpressionValue(node.value, data);

  if (classification.insideTag) {
    // Property (.prop=) and event (@event=) bindings don't exist in server HTML
    if (classification.type === 'property' || classification.type === 'event') {
      scope.htmlBuffer += REMOVE_ATTR;
      return REMOVE_ATTR;
    }

    const isBoolean = node.ifDefined || node.booleanAttribute || classification.type === 'boolean';
    const isFalsy = inArray(value, ['', undefined, null, false, 0]);

    if (isBoolean && isFalsy) {
      scope.htmlBuffer += REMOVE_ATTR;
      return REMOVE_ATTR;
    }

    const strValue = (isArray(value) || isPlainObject(value))
      ? JSON.stringify(value)
      : String(value ?? '');
    scope.htmlBuffer += strValue;
    return strValue;
  }

  // Text position — insert hydration marker + value
  let result = `<!--${COMMENT_MARKER}${id}-->`;
  if (node.unsafeHTML) {
    result += String(value ?? '');
  }
  else {
    result += escapeHTML(String(value ?? ''));
  }
  return result;
}

/*******************************
      Block Directives
*******************************/

function renderConditional(node, data, evaluator, snippets, subTemplates, helpers, scope) {
  const id = scope.entryId++;
  let html = `<!--${BLOCK_MARKER}${id}-->`;

  const condition = evaluator.lookupExpressionValue(node.condition, data);
  if (condition && node.content) {
    html += renderNodes(node.content, data, evaluator, snippets, subTemplates, helpers);
  }
  else if (node.branches) {
    for (const branch of node.branches) {
      if (branch.type === 'elseif') {
        if (evaluator.lookupExpressionValue(branch.condition, data)) {
          html += renderNodes(branch.content, data, evaluator, snippets, subTemplates, helpers);
          break;
        }
      }
      else if (branch.type === 'else') {
        html += renderNodes(branch.content, data, evaluator, snippets, subTemplates, helpers);
        break;
      }
    }
  }

  html += `<!--/sui-block:v1:${id}-->`;
  return html;
}

function renderEach(node, data, evaluator, snippets, subTemplates, helpers, scope) {
  const id = scope.entryId++;
  let html = `<!--${BLOCK_MARKER}${id}-->`;

  const rawItems = evaluator.lookupExpressionValue(node.over, data) || [];
  const collectionType = isArray(rawItems) ? 'array' : 'object';
  const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

  if (isEmpty(items) && node.elseContent) {
    html += renderNodes(node.elseContent, data, evaluator, snippets, subTemplates, helpers);
  }
  else {
    for (let i = 0; i < items.length; i++) {
      const eachData = getEachData(items[i], i, collectionType, node);
      const itemData = { ...data, ...eachData };
      const itemEvaluator = new ExpressionEvaluator({ data: itemData, helpers });
      html += renderNodes(node.content, itemData, itemEvaluator, snippets, subTemplates, helpers);
    }
  }

  html += `<!--/sui-block:v1:${id}-->`;
  return html;
}

function renderAsync(node, data, evaluator, snippets, subTemplates, helpers, scope) {
  const id = scope.entryId++;
  let html = `<!--${BLOCK_MARKER}${id}-->`;

  // SSR: render loading content only, never await
  if (node.loadingContent?.length) {
    html += renderNodes(node.loadingContent, data, evaluator, snippets, subTemplates, helpers);
  }

  html += `<!--/sui-block:v1:${id}-->`;
  return html;
}

function renderRerender(node, data, evaluator, snippets, subTemplates, helpers, scope) {
  const id = scope.entryId++;
  let html = `<!--${BLOCK_MARKER}${id}-->`;

  if (node.content) {
    html += renderNodes(node.content, data, evaluator, snippets, subTemplates, helpers);
  }

  html += `<!--/sui-block:v1:${id}-->`;
  return html;
}

/*******************************
      Template / Snippet
*******************************/

function renderTemplate(node, data, evaluator, snippets, subTemplates, helpers, scope) {
  const id = scope.entryId++;
  let html = `<!--${BLOCK_MARKER}${id}-->`;

  const templateName = evaluator.lookupExpressionValue(node.name, data);

  if (snippets[templateName]) {
    const snippet = snippets[templateName];
    const snippetData = resolveNodeData(node, data, evaluator);
    const snippetEvaluator = new ExpressionEvaluator({ data: snippetData, helpers });
    html += renderNodes(snippet.content, snippetData, snippetEvaluator, snippets, subTemplates, helpers);
  }
  else {
    let template;
    if (isString(templateName)) {
      template = subTemplates[templateName];
    }
    else {
      template = templateName;
    }

    if (template) {
      const templateData = resolveNodeData(node, data, evaluator);
      html += renderSubtemplate(template, templateData, snippets, subTemplates, helpers);
    }
  }

  html += `<!--/sui-block:v1:${id}-->`;
  return html;
}

function renderSubtemplate(template, data, parentSnippets, parentSubTemplates, helpers) {
  const ast = template.ast;
  const subTemplates = template.subTemplates || parentSubTemplates;
  const snippets = { ...parentSnippets };
  let mergedData = { ...data };

  // Initialize state as Signals (createComponent expects .get()/.set())
  const state = {};
  if (template.defaultState) {
    each(template.defaultState, (config, name) => {
      const initialValue = data[name] !== undefined ? data[name] : (config?.value ?? config);
      state[name] = new Signal(initialValue, config?.options);
      mergedData[name] = state[name];
    });
  }

  // Run createComponent to get instance methods/computed values
  if (isFunction(template.createComponent)) {
    const instance = {};
    const noop = () => {};
    const params = {
      el: undefined,
      self: instance,
      tpl: instance,
      component: instance,
      $: () => ({ length: 0, on: noop, off: noop }),
      $$: () => ({ length: 0 }),
      reaction: noop,
      signal: (value, options) => new Signal(value, options),
      afterFlush: noop,
      nonreactive: (fn) => fn(),
      flush: noop,
      data: mergedData,
      settings: mergedData,
      state,
      isServer: true,
      isClient: false,
      isRendered: () => false,
      rerender: noop,
      dispatchEvent: noop,
      attachEvent: noop,
      bindKey: noop,
      unbindKey: noop,
      interval: noop,
      timeout: noop,
      abortSignal: { addEventListener: noop },
      helpers,
      template: null,
      templateName: template.templateName || '',
      templates: new Map(),
      findTemplate: () => undefined,
      findParent: () => undefined,
      findChild: () => undefined,
      findChildren: () => [],
      get darkMode() {
        return undefined;
      },
    };

    const result = template.createComponent.call(instance, params) || {};
    Object.assign(instance, result);

    if (isFunction(instance.initialize)) {
      params.self = instance;
      params.tpl = instance;
      params.component = instance;
      instance.initialize.call(instance, params);
    }

    Object.assign(mergedData, instance);
  }

  const evaluator = new ExpressionEvaluator({ data: mergedData, helpers });
  return renderNodes(ast, mergedData, evaluator, snippets, subTemplates, helpers);
}

/*******************************
      Data Helpers
*******************************/

function getEachData(item, indexOrKey, collectionType, node) {
  let { as, indexAs } = node;
  if (!indexAs) {
    indexAs = (collectionType === 'array') ? 'index' : 'key';
  }
  if (collectionType === 'object') {
    indexOrKey = item.key;
    item = item.value;
  }
  return as
    ? { [as]: item, [indexAs]: indexOrKey }
    : { ...item, this: item, [indexAs]: indexOrKey };
}

function resolveNodeData(node, data, evaluator) {
  let resolved = { ...data };

  if (node.data) {
    if (isString(node.data)) {
      const evaluated = evaluator.lookupExpressionValue(node.data, data);
      if (isPlainObject(evaluated)) {
        Object.assign(resolved, evaluated);
      }
    }
    else if (isPlainObject(node.data)) {
      each(node.data, (expr, key) => {
        resolved[key] = evaluator.lookupExpressionValue(expr, data);
      });
    }
  }
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      resolved[key] = evaluator.lookupExpressionValue(expr, data);
    });
  }

  return resolved;
}
