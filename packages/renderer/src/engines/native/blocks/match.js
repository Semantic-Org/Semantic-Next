import { isDevelopment } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#match} / {is} / {else} — value-based branching compiled as a single AST
  node with node.discriminant + node.branches[]. The discriminant is
  evaluated once, then each {is} case matches when the discriminant loosely
  equals (==, like the `is` helper) any of its values; {else} is the
  fallback. First match wins, no fall-through.

  matchIndex is the index of the chosen branch in node.branches (-1 when
  nothing matched). Unlike {#if} there's no main body, so no MAIN_BRANCH
  sentinel — every case lives in branches[].

  Hydration mirrors conditional: the server writes serverMeta.branchIndex on
  the closing marker; on mount the block rebuilds the region if server and
  client disagree.

  Helpers live on the config object — defineBlock invokes hooks as
  config.hook(bag), so `this === config` and selectBranch is reachable as
  this.selectBranch(...).

*/

const match = defineBlock({
  name: 'match',
  syntax: (node) => `{#match ${node.discriminant}}`,

  // Pick the matched branch. Returns the branch's content AST array as a
  // stable reference (same branch wins → same array), which bag.place's
  // reference-equality dedup relies on.
  selectBranch(node, lookupExpression) {
    const discriminant = lookupExpression(node.discriminant);
    if (node.branches?.length) {
      for (let i = 0; i < node.branches.length; i++) {
        const branch = node.branches[i];
        if (branch.type === 'is') {
          for (let v = 0; v < branch.values.length; v++) {
            if (lookupExpression(branch.values[v]) == discriminant) {
              return { matchIndex: i, contentAST: branch.content };
            }
          }
        }
        else if (branch.type === 'else') {
          return { matchIndex: i, contentAST: branch.content };
        }
      }
    }
    return { matchIndex: -1, contentAST: null };
  },

  compute({ node, lookupExpression }) {
    return this.selectBranch(node, lookupExpression).contentAST;
  },

  hydrate({ node, place, region, serverMeta, lookupExpression, hydrateInto }) {
    const clientBranch = this.selectBranch(node, lookupExpression);
    const serverBranchIndex = serverMeta?.branchIndex;
    const hasMismatch = serverBranchIndex !== undefined
      && serverBranchIndex !== clientBranch.matchIndex;

    if (hasMismatch) {
      if (isDevelopment) {
        console.warn(
          `[SUI] Hydration mismatch in {#match ${node.discriminant}}: `
            + `server rendered branch ${serverBranchIndex}, `
            + `client expects branch ${clientBranch.matchIndex}. `
            + `Client will re-render this block.`,
        );
      }
      place(clientBranch.contentAST);
      return;
    }

    if (region.ownedNodes.length > 0 && clientBranch.contentAST) {
      hydrateInto({ innerAST: clientBranch.contentAST });
    }

    return clientBranch.contentAST;
  },

  evaluateText({ node, data, renderer }) {
    const lookup = (expr) => renderer.lookupExpression(expr, data);
    const discriminant = lookup(node.discriminant);
    if (node.branches) {
      for (const branch of node.branches) {
        if (branch.type === 'is') {
          for (const value of branch.values) {
            if (lookup(value) == discriminant) {
              return renderer.evaluateRawTextNodes(branch.content, data);
            }
          }
        }
        else if (branch.type === 'else') {
          return renderer.evaluateRawTextNodes(branch.content, data);
        }
      }
    }
    return '';
  },
});

registerBlock('match', match);

export default match;
