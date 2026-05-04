import { isArray, isFunction, isPlainObject } from '@semantic-ui/utils';
import { isBlockClose, isBlockOpen, isExpressionMarker } from '../../build-html-string.js';

/*

  Expression-position bindings (attribute + text + raw-text). These are
  NOT blocks — no DynamicRegion, no opening/closing markers, no owned
  region. They are inline bindings: a single Reaction per marker that
  updates the DOM in place when its tracked Signals change.

  Dispatches happen at the call-site level (bindMarkers / hydrateMarkers
  in renderer.js) via entry.classification.type computed during
  buildHTMLString. `skipFirstWrite` is the hydration flag — register deps
  on firstRun, skip the DOM write because server content is trusted.

*/

// Attribute binding — handles property (.foo=), event (@foo=), boolean/
// ifDefined single-expression, single-expression string, and interpolated
// string attributes. The `skipFirstWrite` flag is used during hydration to
// establish Signal dependencies without re-writing server-authored values.
// `firstMarkerID` is the first dynamic-part marker ID in `parts`; cached
// during `populateAttributeBindings` so callers don't `parts.find` per setup.
export function bindAttribute({
  element,
  attrName,
  parts,
  firstMarkerID,
  entries,
  data,
  scope,
  renderer,
  skipFirstWrite = false,
}) {
  const { classification } = entries[firstMarkerID] || {};
  const bindingType = classification?.type;

  if (bindingType === 'property') {
    const realAttrName = classification.attribute;
    const expr = entries[parts[0].markerID];
    scope.reaction(element, (comp) => {
      const value = renderer.evaluator.lookupTokenValue(expr.node.value, data);
      if (skipFirstWrite && comp.firstRun) { return; }
      element[realAttrName] = value;
    });
    element.removeAttribute(attrName);
    return;
  }

  if (bindingType === 'event') {
    const realAttrName = classification.attribute;
    const expr = entries[parts[0].markerID];
    const handler = (...args) => {
      const value = renderer.evaluator.lookupTokenValue(expr.node.value, data);
      if (isFunction(value)) { value(...args); }
    };
    element.addEventListener(realAttrName, handler);
    scope.onDispose(() => element.removeEventListener(realAttrName, handler));
    element.removeAttribute(attrName);
    return;
  }

  const isSingleExpr = parts.length === 1 && parts[0].markerID !== undefined;
  const singleEntry = isSingleExpr ? entries[parts[0].markerID] : null;
  const isIfDefined = singleEntry?.node.ifDefined || singleEntry?.classification.type === 'boolean';

  if (isSingleExpr) {
    scope.reaction(element, (comp) => {
      const value = renderer.lookupExpression(singleEntry.node.value, data);
      if (skipFirstWrite && comp.firstRun) { return; }

      if (isIfDefined && !value) {
        element.removeAttribute(attrName);
      }
      else {
        const strValue = (isArray(value) || isPlainObject(value))
          ? JSON.stringify(value)
          : String(value ?? '');
        if (element.getAttribute(attrName) !== strValue) {
          element.setAttribute(attrName, strValue);
        }
      }
      if (attrName === 'checked' || attrName === 'selected') {
        const boolValue = Boolean(value);
        if (element[attrName] !== boolValue) {
          element[attrName] = boolValue;
        }
      }
      else if (attrName === 'value') {
        const newValue = value ?? '';
        if (element[attrName] !== newValue) {
          element[attrName] = newValue;
        }
      }
    });
  }
  else {
    scope.reaction(element, (comp) => {
      if (skipFirstWrite && comp.firstRun) {
        // Evaluate all expressions to register Signal dependencies,
        // but skip the DOM write — server content is trusted.
        for (const part of parts) {
          if (part.markerID !== undefined) {
            renderer.lookupExpression(entries[part.markerID].node.value, data);
          }
        }
        return;
      }
      let value = '';
      for (const part of parts) {
        if (part.static !== undefined) {
          value += part.static;
        }
        else {
          value += renderer.lookupExpression(entries[part.markerID].node.value, data) ?? '';
        }
      }
      element.setAttribute(attrName, value);
    });
  }
}

// Fresh text-expression binding. Three shapes:
// • unsafeHTML  — parse value as HTML, replace owned nodes on each run
// • literalValue — static text node, no reaction
// • default      — reactive text node, update .data on each run
export function bindTextExpression({ comment, entry, data, scope, renderer }) {
  const exprNode = entry.node;
  const parent = comment.parentNode;

  if (exprNode.unsafeHTML) {
    const anchor = document.createTextNode('');
    comment.replaceWith(anchor);
    const ownedNodes = [];
    scope.reaction(anchor, () => {
      for (const n of ownedNodes) { n.remove(); }
      ownedNodes.length = 0;
      const value = renderer.lookupExpression(exprNode.value, data);
      if (value != null && value !== '') {
        const parsed = renderer.parseHTML(String(value));
        const nodes = [...parsed.childNodes];
        anchor.after(parsed);
        ownedNodes.push(...nodes);
      }
    });
  }
  else if (exprNode.literalValue) {
    const value = renderer.evaluator.lookupTokenValue(exprNode.value, data);
    const textNode = document.createTextNode(value ?? '');
    parent.replaceChild(textNode, comment);
  }
  else {
    const textNode = document.createTextNode('');
    parent.replaceChild(textNode, comment);
    scope.reaction(textNode, () => {
      const value = renderer.lookupExpression(exprNode.value, data);
      textNode.data = value ?? '';
    });
  }
}

// Hydrating text-expression binding — adopts server-rendered DOM instead
// of creating fresh nodes. The server output merges the value with any
// following static text into a single text node; we split it at the
// server-value boundary and adopt the first part as the reactive node.
export function hydrateTextExpression({ comment, entry, data, scope, renderer }) {
  const exprNode = entry.node;

  if (exprNode.unsafeHTML) {
    // Collect server-rendered nodes after the comment until next marker
    const ownedNodes = [];
    let next = comment.nextSibling;
    while (
      next && !(next.nodeType === Node.COMMENT_NODE
        && (isExpressionMarker(next.data) || isBlockOpen(next.data) || isBlockClose(next.data)))
    ) {
      ownedNodes.push(next);
      next = next.nextSibling;
    }

    const anchor = document.createTextNode('');
    comment.replaceWith(anchor);

    scope.reaction(anchor, (comp) => {
      const value = renderer.lookupExpression(exprNode.value, data);
      if (comp.firstRun) { return; } // skip expensive reparse — server DOM is trusted
      for (const n of ownedNodes) { n.remove(); }
      ownedNodes.length = 0;
      if (value != null && value !== '') {
        const parsed = renderer.parseHTML(String(value));
        const nodes = [...parsed.childNodes];
        anchor.after(parsed);
        ownedNodes.push(...nodes);
      }
    });
    return;
  }

  // Safe text expression — the browser merges VALUE with any following
  // static text into one text node. Split at the boundary so the reactive
  // text node only covers the value portion.
  const nextNode = comment.nextSibling;
  let textNode;
  if (nextNode && nextNode.nodeType === Node.TEXT_NODE) {
    const serverValue = String(renderer.lookupExpression(exprNode.value, data) ?? '');
    const fullText = nextNode.data;
    if (fullText.length > serverValue.length && fullText.startsWith(serverValue)) {
      nextNode.splitText(serverValue.length);
      textNode = nextNode;
    }
    else {
      textNode = nextNode;
    }
    comment.remove();
  }
  else {
    textNode = document.createTextNode('');
    comment.replaceWith(textNode);
  }

  scope.reaction(textNode, (comp) => {
    if (comp.firstRun) {
      renderer.lookupExpression(exprNode.value, data);
      return;
    }
    const value = renderer.lookupExpression(exprNode.value, data);
    textNode.data = value ?? '';
  });
}

// Raw-text element binding (script, style, textarea, title). These
// elements parse their content as text, not markup — so we can't use
// comment markers inside them. Instead the entire content is evaluated
// from the collected AST nodes into a string, set via textContent.
export function bindRawTextContent({ comment, entry, data, scope, renderer }) {
  let element = comment.previousSibling;
  while (element && element.nodeType === Node.TEXT_NODE) {
    element = element.previousSibling;
  }
  if (!element || element.nodeType !== Node.ELEMENT_NODE) {
    comment.remove();
    return;
  }

  comment.remove();

  scope.reaction(element, () => {
    element.textContent = renderer.evaluateRawTextNodes(entry.nodes, data);
  });
}
