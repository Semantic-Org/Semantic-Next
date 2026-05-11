import { isArray, isFunction, isPlainObject } from '@semantic-ui/utils';
import { renderASTToString } from './commit-hooks.js';

// Evaluate a marker entry to its attribute-value string. Expression entries
// take today's lookupExpression path; block entries (if/rerender) walk the
// matched-branch content via renderASTToString. each/async/template/etc.
// throw via renderASTToString — see commit-hooks.js for the supported set.
function evaluateMarkerToString(entry, data, renderer) {
  if (entry.type === 'expression') {
    return renderer.lookupExpression(entry.node.value, data);
  }
  return renderASTToString([entry.node], data, renderer);
}

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
export function bindAttribute({
  element,
  attrName,
  parts,
  entries,
  data,
  scope,
  renderer,
  skipFirstWrite = false,
}) {
  const firstMarker = parts.find((p) => p.markerID !== undefined);
  const firstEntry = entries[firstMarker?.markerID];
  const { classification } = firstEntry || {};
  const bindingType = classification?.type;
  const firstIsBlock = firstEntry && firstEntry.type !== 'expression';

  if (bindingType === 'property') {
    if (firstIsBlock) {
      throw new Error(`{#${firstEntry.type}} cannot be used in property position (.${classification.attribute}=).`);
    }
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
    if (firstIsBlock) {
      throw new Error(`{#${firstEntry.type}} cannot be used in event position (@${classification.attribute}=).`);
    }
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
  const singleIsBlock = isSingleExpr && singleEntry.type !== 'expression';
  const isIfDefined = singleEntry?.node.ifDefined || singleEntry?.classification.type === 'boolean';

  if (isSingleExpr) {
    scope.reaction(element, (comp) => {
      const value = singleIsBlock
        ? renderASTToString([singleEntry.node], data, renderer)
        : renderer.lookupExpression(singleEntry.node.value, data);
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
        // Evaluate all markers to register Signal dependencies, skip DOM
        // write — server content is trusted. Block markers register the
        // same deps via the branch evaluation inside renderASTToString.
        for (const part of parts) {
          if (part.markerID !== undefined) {
            evaluateMarkerToString(entries[part.markerID], data, renderer);
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
          value += evaluateMarkerToString(entries[part.markerID], data, renderer) ?? '';
        }
      }
      element.setAttribute(attrName, value);
    });
  }
}

// Text-position expression bindings (fresh + hydrating) moved to
// blocks/expression.js. Raw-text bindings moved to blocks/raw-text.js.
// Both dispatched via the block registry as `'expression'` / `'rawText'`.
