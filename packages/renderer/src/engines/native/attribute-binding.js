import { isFunction } from '@semantic-ui/utils';
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
    // This reaction is the sole writer of the attribute, so we shadow the
    // last value we wrote and diff in JS rather than reading it back with
    // getAttribute (a Blink boundary call) on every re-run. undefined means
    // "currently absent" — never written, or cleared by an ifDefined miss.
    // The first run always applies, clearing the parsed marker attribute.
    let lastWritten;
    scope.reaction(element, (comp) => {
      const value = singleIsBlock
        ? renderASTToString([singleEntry.node], data, renderer)
        : renderer.lookupExpression(singleEntry.node.value, data);
      if (skipFirstWrite && comp.firstRun) {
        // Server already rendered the attribute; seed the shadow so the first
        // reactive re-run diffs honestly against what's in the DOM.
        lastWritten = (isIfDefined && !value) ? undefined : stringifyAttrValue(value);
        return;
      }

      if (isIfDefined && !value) {
        if (comp.firstRun || lastWritten !== undefined) {
          element.removeAttribute(attrName);
          lastWritten = undefined;
        }
      }
      else {
        const strValue = stringifyAttrValue(value);
        if (comp.firstRun || strValue !== lastWritten) {
          element.setAttribute(attrName, strValue);
          lastWritten = strValue;
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
          value += evaluateMarkerToString(entries[part.markerID], data, renderer);
        }
      }
      element.setAttribute(attrName, value);
    });
  }
}
