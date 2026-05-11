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

import {
  analyzePosition,
  BLOCK_MARKER,
  COMMENT_MARKER,
  DATA_SUI_BIND,
  formatBlockClose,
  MAIN_BRANCH_INDEX,
} from '../../build-html-string.js';
import { ExpressionEvaluator } from '../../expression-evaluator.js';
import { renderASTToString } from './commit-hooks.js';
import { childContext } from './define-block.js';
import { encodeItemKey, getEachData, getItemID, SUI_ITEM_MARKER } from './shared/each.js';

const REMOVE_ATTR = '__SUI_REMOVE__';
const REMOVE_ATTR_REGEX = /\s+[\w.@-]+\s*=\s*["']?__SUI_REMOVE__["']?/g;

// Character-stream tag scanner. Walks an incoming html chunk, tracks open /
// close boundaries, and injects `data-sui-bind="..."` just before the `>`
// (or `/`) that closes a tag carrying pending dynamic bindings.
//
// State lives on `scope`:
//   scope.insideTag        — true when the scanner has consumed `<tagname` but
//                            not yet the matching `>`.
//   scope.inQuote          — `"` or `'` when the scanner is inside a quoted
//                            attribute value, null otherwise. Persisted across
//                            html chunks because the open quote and close
//                            quote often live in different chunks with an
//                            expression between them (`attr="` / expr / `">`).
//   scope.currentAttrName  — raw attribute name (with any `.` / `@` prefix)
//                            of the attribute value we're currently inside.
//                            Persisted so expressions that land mid-value
//                            (multi-expression attrs like
//                            `class="card {x} bar {y}"`) can resolve the
//                            attr name analyzePosition can't recover from
//                            the tail of scope.htmlBuffer.
//   scope.tagBindings      — { rawAttrName: firstEntryId } for the
//                            currently-open tag. Cleared on tag open;
//                            flushed into data-sui-bind at tag close.
//
// The scanner is tolerant of raw text contexts (`<script>`, `<style>`, etc.):
// if a spurious `<` inside raw content is misread as a tag open, the worst
// case is an extra flush attempt with an empty tagBindings — no output change.

// Extract the attribute name that owns a just-opened quote. Called with the
// cumulative buffer up to (but not including) the opening quote char.
const ATTR_NAME_AT_OPEN = /\s([.@]?[\w:-]+)\s*=\s*$/;
function attrNameFromBuffer(buffer) {
  const match = ATTR_NAME_AT_OPEN.exec(buffer);
  return match ? match[1] : null;
}

function scanHtmlChunk(chunk, scope) {
  if (!scope.insideTag && chunk.indexOf('<') === -1) {
    scope.htmlBuffer += chunk;
    return chunk;
  }

  let output = '';
  let i = 0;
  const chunkLen = chunk.length;

  while (i < chunkLen) {
    if (!scope.insideTag) {
      const ltIdx = chunk.indexOf('<', i);
      if (ltIdx === -1) {
        output += chunk.slice(i);
        scope.htmlBuffer += chunk.slice(i);
        break;
      }
      const preTag = chunk.slice(i, ltIdx);
      output += preTag;
      scope.htmlBuffer += preTag;
      output += '<';
      scope.htmlBuffer += '<';
      i = ltIdx + 1;
      const next = chunk.charAt(i);
      // Element open: `<tagname`. Non-alpha follow-chars (`/`, `!`, `?`) are
      // close tags, comments, DOCTYPE, processing instructions — not something
      // that carries attribute bindings, so stay in non-tag state.
      if (next && /[a-zA-Z]/.test(next)) {
        scope.insideTag = true;
        scope.inQuote = null;
        scope.currentAttrName = null;
        scope.tagBindings = {};
      }
    }
    else {
      let j = i;
      while (j < chunkLen) {
        const c = chunk.charAt(j);
        if (scope.inQuote) {
          if (c === scope.inQuote) {
            scope.inQuote = null;
            scope.currentAttrName = null;
          }
        }
        else if (c === '"' || c === "'") {
          scope.inQuote = c;
          // Recover the attr name at the moment of the opening quote:
          // `scope.htmlBuffer` holds everything emitted before this chunk;
          // `chunk.slice(i, j)` is what the scanner has consumed from the
          // current chunk up to the quote. The regex looks back to
          // `\s attrname=` at the tail.
          scope.currentAttrName = attrNameFromBuffer(scope.htmlBuffer + chunk.slice(i, j));
        }
        else if (c === '>') {
          break;
        }
        j++;
      }

      if (j >= chunkLen) {
        // Tag does not close in this chunk — emit the rest, stay inside.
        output += chunk.slice(i);
        scope.htmlBuffer += chunk.slice(i);
        break;
      }

      const beforeClose = chunk.slice(i, j);
      output += beforeClose;
      scope.htmlBuffer += beforeClose;

      const selfClosing = j > 0 && chunk.charAt(j - 1) === '/';
      const bindingKeys = Object.keys(scope.tagBindings);
      if (bindingKeys.length > 0) {
        const payload = bindingKeys.map((k) => `${k}=${scope.tagBindings[k]}`).join(',');
        const bindAttr = ` ${DATA_SUI_BIND}="${payload}"`;
        if (selfClosing) {
          // Replace the trailing `/` with bindAttr + `/` so the injected
          // attribute lands before the self-close slash, not after.
          output = output.slice(0, -1) + bindAttr + '/';
          scope.htmlBuffer = scope.htmlBuffer.slice(0, -1) + bindAttr + '/';
        }
        else {
          output += bindAttr;
          scope.htmlBuffer += bindAttr;
        }
      }

      output += '>';
      scope.htmlBuffer += '>';
      scope.insideTag = false;
      scope.inQuote = null;
      scope.currentAttrName = null;
      scope.tagBindings = {};
      i = j + 1;
    }
  }

  return output;
}

export class ServerRenderer {
  constructor(
    { ast, data, template, subTemplates, snippets, helpers, isSVG = false, protectedKeys } = {},
  ) {
    this.ast = ast || [];
    this.data = data;
    this.template = template;
    this.subTemplates = subTemplates;
    this.snippets = snippets || {};
    this.helpers = helpers || {};
    this.isSVG = isSVG;
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
    assignInPlace(this.data, newData, { preserveExistingKeys: preserveExistingData, preserveGetters: true });
  }

  bumpDataVersion() {
    // No-op on server — no reactive subscriptions to notify
  }

  /*******************************
      AST → HTML String
  *******************************/

  renderNodes(ast, data, scope) {
    if (!scope) {
      scope = {
        entryId: 0,
        htmlBuffer: '',
        insideTag: false,
        inQuote: null,
        currentAttrName: null,
        tagBindings: {},
      };
    }

    let html = '';

    for (const node of ast) {
      switch (node.type) {
        case 'html':
          // scanHtmlChunk tracks tag boundaries so dynamic attribute bindings
          // get flushed into `data-sui-bind` just before the closing `>`.
          html += scanHtmlChunk(node.html, scope);
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
      // Record this entry as the first binding for its attribute, so the
      // tag-close scanner can emit data-sui-bind="attr=id,..." into the
      // element's open tag. Subsequent expressions in the same attribute
      // (multi-expression attrs like `class="a {x} b {y}"`) don't
      // overwrite — their marker IDs are reachable via the first entry's
      // parts structure on the client.
      //
      // When analyzePosition lands mid-value (buffer ends in `="card `,
      // not `="`), classification.attribute is empty. Fall back to the
      // persistent currentAttrName tracked by scanHtmlChunk, which was
      // captured at the opening-quote position.
      const resolvedAttr = classification.type === 'property'
        ? `.${classification.attribute}`
        : classification.type === 'event'
        ? `@${classification.attribute}`
        : (classification.attribute || scope.currentAttrName || '');
      if (resolvedAttr && scope.tagBindings && !(resolvedAttr in scope.tagBindings)) {
        scope.tagBindings[resolvedAttr] = id;
      }

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

  // Adapter so renderASTToString (shared with client) can call into the
  // server's ExpressionEvaluator. The walker only uses lookupExpression.
  stringRenderer() {
    return {
      lookupExpression: (expr, d) => this.evaluator.lookupExpressionValue(expr, d),
    };
  }

  // Emit a block's evaluated string value inline as an attribute value.
  // Mirrors renderExpression's insideTag branch: registers the entry in
  // scope.tagBindings so data-sui-bind gets stamped on the element, then
  // escapes and emits the value with the quote-aware wrapping.
  emitAttributeBlock(id, value, scope) {
    const classification = analyzePosition(scope.htmlBuffer);
    if (classification.type === 'property' || classification.type === 'event') {
      // Blocks produce strings; property/event positions need raw
      // values / function references. Refuse with the same REMOVE_ATTR
      // sentinel renderExpression uses for these positions so the
      // attribute disappears from the output rather than emitting a
      // string into a slot that expects something else.
      scope.htmlBuffer += REMOVE_ATTR;
      return REMOVE_ATTR;
    }
    const resolvedAttr = classification.attribute || scope.currentAttrName || '';
    if (resolvedAttr && scope.tagBindings && !(resolvedAttr in scope.tagBindings)) {
      scope.tagBindings[resolvedAttr] = id;
    }

    const strValue = String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');

    const tagStart = scope.htmlBuffer.lastIndexOf('<');
    const tagFragment = scope.htmlBuffer.slice(tagStart);
    const doubleQuotes = (tagFragment.match(/"/g) || []).length;
    const insideQuotes = doubleQuotes % 2 === 1;

    if (!insideQuotes) {
      scope.htmlBuffer += `"${strValue}"`;
      return `"${strValue}"`;
    }
    scope.htmlBuffer += strValue;
    return strValue;
  }

  renderConditional(node, data, scope) {
    const id = scope.entryId++;
    const classification = analyzePosition(scope.htmlBuffer);

    // Pick the matched branch's content AST. matchIndex tracking is only
    // useful in text position (server stamps it on the close marker for
    // client hydration); attribute position emits inline, no markers.
    let matchedAST = null;
    let branchIndex = -1;
    const condition = this.evaluator.lookupExpressionValue(node.condition, data);
    if (condition && node.content) {
      branchIndex = MAIN_BRANCH_INDEX;
      matchedAST = node.content;
    }
    else if (node.branches) {
      for (let i = 0; i < node.branches.length; i++) {
        const branch = node.branches[i];
        if (branch.type === 'elseif') {
          if (this.evaluator.lookupExpressionValue(branch.condition, data)) {
            branchIndex = i;
            matchedAST = branch.content;
            break;
          }
        }
        else if (branch.type === 'else') {
          branchIndex = i;
          matchedAST = branch.content;
          break;
        }
      }
    }

    if (classification.insideTag) {
      const inner = matchedAST
        ? renderASTToString(matchedAST, data, this.stringRenderer())
        : '';
      return this.emitAttributeBlock(id, inner, scope);
    }

    // Text position — today's marker-wrapped behavior.
    let html = `<!--${BLOCK_MARKER}${id}-->`;
    if (matchedAST) {
      html += this.renderNodes(matchedAST, data);
    }
    html += `<!--${formatBlockClose(id, { branchIndex })}-->`;
    return html;
  }

  renderEach(node, data, scope) {
    const id = scope.entryId++;
    if (analyzePosition(scope.htmlBuffer).insideTag) {
      throw new Error(
        '{#each} cannot be rendered inside an attribute value. '
          + 'Use a method or computed signal that returns a string.',
      );
    }
    let html = `<!--${BLOCK_MARKER}${id}-->`;

    const rawItems = this.evaluator.lookupExpressionValue(node.over, data) || [];
    const collectionType = isArray(rawItems) ? 'array' : 'object';
    const items = (collectionType === 'object') ? arrayFromObject(rawItems) : rawItems;

    if (isEmpty(items) && node.elseContent) {
      html += this.renderNodes(node.elseContent, data);
    }
    else {
      // Per-item key marker — client adopts the matching node range at hydrate time.
      for (let i = 0; i < items.length; i++) {
        const eachData = getEachData(items[i], i, collectionType, node);
        const itemData = childContext(data, eachData);
        const key = getItemID(items[i], i, collectionType);
        html += `<!--${SUI_ITEM_MARKER}${encodeItemKey(key)}-->`;
        html += this.renderNodes(node.content, itemData);
      }
    }

    html += `<!--${formatBlockClose(id)}-->`;
    return html;
  }

  renderAsync(node, data, scope) {
    const id = scope.entryId++;
    if (analyzePosition(scope.htmlBuffer).insideTag) {
      throw new Error(
        '{#async} cannot be rendered inside an attribute value. '
          + 'Use a method or computed signal that returns a string.',
      );
    }
    let html = `<!--${BLOCK_MARKER}${id}-->`;

    // SSR: render loading content only, never await
    if (node.loadingContent?.length) {
      html += this.renderNodes(node.loadingContent, data);
    }

    html += `<!--${formatBlockClose(id)}-->`;
    return html;
  }

  renderRerender(node, data, scope) {
    const id = scope.entryId++;
    const classification = analyzePosition(scope.htmlBuffer);

    if (classification.insideTag) {
      const inner = node.content
        ? renderASTToString(node.content, data, this.stringRenderer())
        : '';
      return this.emitAttributeBlock(id, inner, scope);
    }

    let html = `<!--${BLOCK_MARKER}${id}-->`;
    if (node.content) {
      html += this.renderNodes(node.content, data);
    }
    html += `<!--${formatBlockClose(id)}-->`;
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
      html += this.renderNodes(snippet.content, snippetData);
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

    html += `<!--${formatBlockClose(id)}-->`;
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

    if (template.ast) {
      return this.renderNodes(template.ast, data);
    }

    return '';
  }

  /*******************************
      Data Helpers
  *******************************/

  resolveNodeData(node, data) {
    let resolved = childContext(data);

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
