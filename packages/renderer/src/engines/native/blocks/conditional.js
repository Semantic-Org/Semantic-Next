import { isDevelopment } from '@semantic-ui/utils';
import { MAIN_BRANCH_INDEX } from '../../../build-html-string.js';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#if} / {:elseif} / {:else} — compiled as a single AST node with
  node.condition + node.branches[]. Branch matching is linear: the first
  truthy branch wins; matchIndex MAIN_BRANCH_INDEX is reserved for the
  main {#if} body and any numeric index i refers to node.branches[i].

  Hydration: the server writes serverMeta.branchIndex on the closing block
  marker. On mount, the block compares server vs. client branch choice
  and rebuilds the region if they disagree. The environment-guard escape
  (isClient / isServer) is exempted from the mismatch warning because it
  is the documented way to diverge intentionally.

*/

function selectBranch(node, lookupExpression) {
  if (lookupExpression(node.condition)) {
    return { matchIndex: MAIN_BRANCH_INDEX, contentAST: node.content };
  }
  if (node.branches?.length) {
    for (let i = 0; i < node.branches.length; i++) {
      const branch = node.branches[i];
      if (branch.type === 'elseif') {
        if (lookupExpression(branch.condition)) {
          return { matchIndex: i, contentAST: branch.content };
        }
      }
      else if (branch.type === 'else') {
        return { matchIndex: i, contentAST: branch.content };
      }
    }
  }
  return { matchIndex: -1, contentAST: null };
}

const conditional = defineBlock({
  name: 'conditional',
  syntax: (node) => `{#if ${node.condition}}`,

  // compute synthesizes render and update — bag.place owns the
  // child-scope + renderAST + region.setContent sequence and dedups via
  // reference equality on selectBranch's contentAST (stable across calls
  // for the same matched branch). hydrate stays explicit because adopting
  // server DOM via hydrateInto has a distinct contract.
  compute({ node, lookupExpression }) {
    return selectBranch(node, lookupExpression).contentAST;
  },

  hydrate({ node, place, region, serverMeta, lookupExpression, hydrateInto }) {
    const clientBranch = selectBranch(node, lookupExpression);
    const serverBranchIndex = serverMeta?.branchIndex;
    const hasMismatch = serverBranchIndex !== undefined
      && serverBranchIndex !== clientBranch.matchIndex;

    if (hasMismatch) {
      if (isDevelopment) {
        const isEnvironmentGuard = node.condition === 'isClient' || node.condition === 'isServer';
        if (!isEnvironmentGuard) {
          console.warn(
            `[SUI] Hydration mismatch in {#if ${node.condition}}: `
              + `server rendered branch ${serverBranchIndex}, `
              + `client expects branch ${clientBranch.matchIndex}. `
              + `Client will re-render this block.`,
          );
        }
      }
      place(clientBranch.contentAST);
      return;
    }

    if (region.ownedNodes.length > 0 && clientBranch.contentAST) {
      // Server DOM matches the client branch — hydrate inner markers
      // against the chosen branch's AST, then move nodes into the region.
      hydrateInto({ innerAST: clientBranch.contentAST });
    }

    // Return the matched-branch AST so defineBlock records it on `place`:
    // the first compute-driven update tick will dedup against this rather
    // than re-rendering over the server bytes.
    return clientBranch.contentAST;
  },

  evaluateText({ node, data, renderer }) {
    const lookup = (expr) => renderer.lookupExpression(expr, data);
    if (lookup(node.condition) && node.content) {
      return renderer.evaluateRawTextNodes(node.content, data);
    }
    if (node.branches) {
      for (const branch of node.branches) {
        if (branch.type === 'elseif' && lookup(branch.condition)) {
          return renderer.evaluateRawTextNodes(branch.content, data);
        }
        if (branch.type === 'else') {
          return renderer.evaluateRawTextNodes(branch.content, data);
        }
      }
    }
    return '';
  },
});

registerBlock('if', conditional);

export default conditional;
