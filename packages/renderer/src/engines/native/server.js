/*
  Server-side renderer for the native engine.
  Same interface as the client Renderer — Template.initialize() creates
  one or the other based on isServer. The only difference is render()
  returns an HTML string instead of a DocumentFragment.

  No DOM, no Reactions, no DynamicRegion. Pure string manipulation.
  Runs in Node, Deno (--allow-eval), Bun, Cloudflare Workers (unsafe-eval).
*/

import {
  arrayFromObject,
  assignInPlace,
  each,
  escapeHTML,
  filterObject,
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

export class ServerRenderer {
  constructor(
    { ast, data, template, subTemplates, snippets, helpers, isSVG = false, inheritsData = true, protectedKeys } = {},
  ) {
    this.ast = ast || [];
    this.data = data;
    this.template = template;
    this.subTemplates = subTemplates;
    this.snippets = snippets || {};
    this.helpers = helpers || {};
    this.isSVG = isSVG;
    this.inheritsData = inheritsData;
    this.protectedKeys = protectedKeys;

    this.evaluator = new ExpressionEvaluator({
      data: this.data,
      helpers: this.helpers,
    });
  }

  render() {
    let html = this.renderNodes(this.ast, this.data);
    return html.replace(REMOVE_ATTR_REGEX, '');
  }

  setData(newData) {
    this.updateData(newData, { preserveExistingData: false });
    this.evaluator.setData(this.data);
  }

  updateData(newData, { preserveExistingData = true, respectProtectedKeys = false } = {}) {
    if (respectProtectedKeys && this.protectedKeys) {
      newData = filterObject(newData, (value, key) => !inArray(key, this.protectedKeys));
    }
    assignInPlace(this.data, newData, { preserveExistingKeys: preserveExistingData });
  }

  bumpDataVersion() {
    // No-op on server — no reactive subscriptions to notify
  }

  /*******************************
      AST → HTML String
  *******************************/

  renderNodes(ast, data, scope) {
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
          html += this.renderExpression(node, data, scope);
          break;

        case 'svg':
          html += this.renderNodes(node.content, data, scope);
          break;

        case 'snippet':
          this.snippets[node.name] = node;
          break;

        case 'slot':
          html += node.name ? `<slot name="${node.name}"></slot>` : '<slot></slot>';
          scope.htmlBuffer += '<slot>';
          break;

        case 'if':
          html += this.renderConditional(node, data, scope);
          break;

        case 'each':
          html += this.renderEach(node, data, scope);
          break;

        case 'async':
          html += this.renderAsync(node, data, scope);
          break;

        case 'rerender':
          html += this.renderRerender(node, data, scope);
          break;

        case 'template':
          html += this.renderTemplate(node, data, scope);
          break;
      }
    }

    return html;
  }

  /*******************************
      Expression Rendering
  *******************************/

  renderExpression(node, data, scope) {
    const id = scope.entryId++;
    const classification = analyzePosition(scope.htmlBuffer);
    const value = this.evaluator.lookupExpressionValue(node.value, data);

    if (classification.insideTag) {
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

      let strValue = (isArray(value) || isPlainObject(value))
        ? JSON.stringify(value)
        : String(value ?? '');
      strValue = strValue.replace(/&/g, '&amp;').replace(/"/g, '&quot;');

      // Check if we're inside a quoted attribute value by counting quotes
      // in the current tag fragment. Odd count = inside quotes, even = unquoted.
      const tagStart = scope.htmlBuffer.lastIndexOf('<');
      const tagFragment = scope.htmlBuffer.slice(tagStart);
      const doubleQuotes = (tagFragment.match(/"/g) || []).length;
      const insideQuotes = doubleQuotes % 2 === 1;

      // Unquoted attribute (e.g. style={expr}) — wrap in quotes so the
      // value survives HTML parsing when it contains spaces or newlines
      if (!insideQuotes) {
        scope.htmlBuffer += `"${strValue}"`;
        return `"${strValue}"`;
      }

      scope.htmlBuffer += strValue;
      return strValue;
    }

    // Text position — hydration marker + evaluated value
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

  renderConditional(node, data, scope) {
    const id = scope.entryId++;
    let html = `<!--${BLOCK_MARKER}${id}-->`;
    let branchIndex = -1;

    const condition = this.evaluator.lookupExpressionValue(node.condition, data);
    if (condition && node.content) {
      branchIndex = 1000;
      html += this.renderNodes(node.content, data);
    }
    else if (node.branches) {
      for (let i = 0; i < node.branches.length; i++) {
        const branch = node.branches[i];
        if (branch.type === 'elseif') {
          if (this.evaluator.lookupExpressionValue(branch.condition, data)) {
            branchIndex = i;
            html += this.renderNodes(branch.content, data);
            break;
          }
        }
        else if (branch.type === 'else') {
          branchIndex = i;
          html += this.renderNodes(branch.content, data);
          break;
        }
      }
    }

    html += `<!--/sui-block:v1:${id}:b${branchIndex}-->`;
    return html;
  }

  renderEach(node, data, scope) {
    const id = scope.entryId++;
    let html = `<!--${BLOCK_MARKER}${id}-->`;

    const rawItems = this.evaluator.lookupExpressionValue(node.over, data) || [];
    const collectionType = isArray(rawItems) ? 'array' : 'object';
    const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

    if (isEmpty(items) && node.elseContent) {
      html += this.renderNodes(node.elseContent, data);
    }
    else {
      for (let i = 0; i < items.length; i++) {
        const eachData = this.getEachData(items[i], i, collectionType, node);
        const itemData = { ...data, ...eachData };
        const itemEvaluator = new ExpressionEvaluator({ data: itemData, helpers: this.helpers });
        const savedEvaluator = this.evaluator;
        this.evaluator = itemEvaluator;
        html += this.renderNodes(node.content, itemData);
        this.evaluator = savedEvaluator;
      }
    }

    html += `<!--/sui-block:v1:${id}-->`;
    return html;
  }

  renderAsync(node, data, scope) {
    const id = scope.entryId++;
    let html = `<!--${BLOCK_MARKER}${id}-->`;

    // SSR: render loading content only, never await
    if (node.loadingContent?.length) {
      html += this.renderNodes(node.loadingContent, data);
    }

    html += `<!--/sui-block:v1:${id}-->`;
    return html;
  }

  renderRerender(node, data, scope) {
    const id = scope.entryId++;
    let html = `<!--${BLOCK_MARKER}${id}-->`;

    if (node.content) {
      html += this.renderNodes(node.content, data);
    }

    html += `<!--/sui-block:v1:${id}-->`;
    return html;
  }

  /*******************************
      Template / Snippet
  *******************************/

  renderTemplate(node, data, scope) {
    const id = scope.entryId++;
    let html = `<!--${BLOCK_MARKER}${id}-->`;

    const templateName = this.evaluator.lookupExpressionValue(node.name, data);

    if (this.snippets[templateName]) {
      const snippet = this.snippets[templateName];
      const snippetData = this.resolveNodeData(node, data);
      const savedEvaluator = this.evaluator;
      this.evaluator = new ExpressionEvaluator({ data: snippetData, helpers: this.helpers });
      html += this.renderNodes(snippet.content, snippetData);
      this.evaluator = savedEvaluator;
    }
    else {
      let template;
      if (isString(templateName)) {
        template = this.subTemplates?.[templateName];
      }
      else {
        template = templateName;
      }

      if (template) {
        const templateData = this.resolveNodeData(node, data);
        html += this.renderSubtemplate(template, templateData);
      }
    }

    html += `<!--/sui-block:v1:${id}-->`;
    return html;
  }

  renderSubtemplate(template, data) {
    // For subtemplates that have their own lifecycle (createComponent, state),
    // use Template.clone().initialize() which will create another ServerRenderer.
    // This is the correct path — the Template handles everything.
    if (isFunction(template.clone)) {
      const instance = template.clone({
        data,
        subTemplates: this.subTemplates,
        parentTemplate: this.template,
      });
      instance.initialize();
      return instance.render();
    }

    // Plain AST object — render directly
    if (template.ast) {
      const savedEvaluator = this.evaluator;
      this.evaluator = new ExpressionEvaluator({ data, helpers: this.helpers });
      const html = this.renderNodes(template.ast, data);
      this.evaluator = savedEvaluator;
      return html;
    }

    return '';
  }

  /*******************************
      Data Helpers
  *******************************/

  getEachData(item, indexOrKey, collectionType, node) {
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

  resolveNodeData(node, data) {
    let resolved = { ...data };

    if (node.data) {
      if (isString(node.data)) {
        const evaluated = this.evaluator.lookupExpressionValue(node.data, data);
        if (isPlainObject(evaluated)) {
          Object.assign(resolved, evaluated);
        }
      }
      else if (isPlainObject(node.data)) {
        each(node.data, (expr, key) => {
          resolved[key] = this.evaluator.lookupExpressionValue(expr, data);
        });
      }
    }
    if (node.reactiveData) {
      each(node.reactiveData, (expr, key) => {
        resolved[key] = this.evaluator.lookupExpressionValue(expr, data);
      });
    }

    return resolved;
  }
}
