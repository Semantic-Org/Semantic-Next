import { isFunction } from '@semantic-ui/utils';
import { computeExpressionValue } from './blocks/expression.js';
import { renderASTToString, stringifyAttrValue } from './commit-hooks.js';

/*

  Attribute-position bindings — single Reaction per marker, DOM updated in
  place. Dispatched from bindMarkers / hydrateMarkers via entry.classification.
  skipFirstWrite is the hydration flag: register deps, skip the write.

*/

// renderASTToString throws for each/async/template/svg/slot since those can't appear in attribute position
function evaluateMarkerToString(entry, data, renderer) {
  if (entry.type === 'expression') {
    return stringifyAttrValue(renderer.lookupExpression(entry.node.value, data));
  }
  return renderASTToString([entry.node], data, renderer);
}

// Handles property (.foo=), event (@foo=), boolean / ifDefined single-
// expression, single-expression string, and interpolated string attrs.
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
  const firstMarker = parts.find((p) => p.markerId !== undefined);
  const firstEntry = entries[firstMarker?.markerId];
  const { classification } = firstEntry || {};
  const bindingType = classification?.type;
  const firstIsBlock = firstEntry && firstEntry.type !== 'expression';

  if (bindingType === 'property') {
    if (firstIsBlock) {
      throw new Error(`{#${firstEntry.type}} cannot be used in property position (.${classification.attribute}=).`);
    }
    const realAttrName = classification.attribute;
    const expr = entries[parts[0].markerId];
    scope.reaction(element, (comp) => {
      const value = computeExpressionValue({ node: expr.node, data, renderer });
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
    const expr = entries[parts[0].markerId];
    const handler = (...args) => {
      const value = computeExpressionValue({ node: expr.node, data, renderer, literal: true });
      if (isFunction(value)) { value(...args); }
    };
    element.addEventListener(realAttrName, handler);
    scope.onDispose(() => element.removeEventListener(realAttrName, handler));
    element.removeAttribute(attrName);
    return;
  }

  const isSingleExpr = parts.length === 1 && parts[0].markerId !== undefined;
  const singleEntry = isSingleExpr ? entries[parts[0].markerId] : null;
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
        const strValue = stringifyAttrValue(value);
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
    let lastValue; // remembered rather than read back, a getAttribute on mount can only miss
    scope.reaction(element, (comp) => {
      if (skipFirstWrite && comp.firstRun) {
        // Evaluate all markers to register Signal dependencies, skip DOM
        // write — server content is trusted. Block markers register the
        // same deps via the branch evaluation inside renderASTToString.
        for (const part of parts) {
          if (part.markerId !== undefined) {
            evaluateMarkerToString(entries[part.markerId], data, renderer);
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
          value += evaluateMarkerToString(entries[part.markerId], data, renderer);
        }
      }
      if (lastValue === value) { return; }
      lastValue = value;
      element.setAttribute(attrName, value);
    });
  }
}
