import { bindTextExpression, hydrateTextExpression } from '../reactive-data.js';
import { registerBlock } from './registry.js';

/*

  Text-position expression dispatch. Routes through the block registry
  so every AST node type (expression, rawText, if, each, async, rerender,
  template) reaches the renderer through one primitive: getBlock(type).

  Attribute-position expressions are NOT dispatched here — they're walked
  by bindAttribute in reactive-data.js as part of an attribute's combined
  parts evaluation (one Reaction owns the full attribute string regardless
  of how many markers it contains). bindAttribute handles both expression
  and block-type markers in that position via evaluateMarkerToString.

  This file is a thin dispatch shim today. A follow-up may inline the
  text-position binding logic here and retire reactive-data.js entirely;
  the registry-routed dispatch is the prerequisite.

*/

const expression = function expression({ comment, entry, data, scope, renderer, hydrating }) {
  if (hydrating) {
    hydrateTextExpression({ comment, entry, data, scope, renderer });
    return;
  }
  bindTextExpression({ comment, entry, data, scope, renderer });
};

registerBlock('expression', expression);

export default expression;
