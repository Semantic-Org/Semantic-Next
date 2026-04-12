import { isDevelopment } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { registerBlock } from './registry.js';

/*

  {#if} / {:elseif} / {:else} — compiled as a single AST node with
  node.condition + node.branches[]. Branch matching is linear: the first
  truthy branch wins; matchIndex of 1000 is reserved for the main {#if}
  body and any numeric index i refers to node.branches[i].

  Hydration: the server writes serverMeta.branchIndex on the closing block
  marker. On mount, the block compares server vs. client branch choice
  and rebuilds the region if they disagree. The environment-guard escape
  (isClient / isServer) is exempted from the mismatch warning because it
  is the documented way to diverge intentionally.

*/

function selectBranch(node, lookupExpression) {
  if (lookupExpression(node.condition)) {
    // matchIndex 1000 distinguishes the main {#if} body from any {:elseif}
    // or {:else} branch whose index starts at 0. See update's equality check.
    return { matchIndex: 1000, contentAST: node.content };
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

function branchASTByIndex(node, matchIndex) {
  if (matchIndex === 1000) { return node.content; }
  if (matchIndex >= 0 && node.branches?.[matchIndex]) {
    return node.branches[matchIndex].content;
  }
  return null;
}

const conditional = defineBlock({
  name: 'conditional',

  create() {
    return { currentBranchIndex: -1 };
  },

  render({ scope, region, node, renderAST, lookupExpression, self }) {
    const result = selectBranch(node, lookupExpression);
    self.currentBranchIndex = result.matchIndex;
    if (result.contentAST) {
      const branchScope = scope.child();
      const fragment = renderAST({ ast: result.contentAST, scope: branchScope });
      region.setContent(fragment, branchScope);
    }
  },

  hydrate({ node, data, scope, region, serverMeta, renderAST, lookupExpression, hydrateInnerContent, self }) {
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
      if (clientBranch.contentAST) {
        const branchScope = scope.child();
        const fragment = renderAST({ ast: clientBranch.contentAST, scope: branchScope });
        region.setContent(fragment, branchScope);
      }
      else {
        region.clear();
      }
    }
    else if (region.ownedNodes.length > 0) {
      // Server DOM matches the client branch — hydrate inner markers
      // against the chosen branch's AST, then move nodes into the region.
      const innerAST = branchASTByIndex(node, clientBranch.matchIndex);
      if (innerAST) {
        const innerScope = scope.child();
        region.childScopes.push(innerScope);
        hydrateInnerContent({ ownedNodes: region.ownedNodes, innerAST, data, scope: innerScope });
        const frag = document.createDocumentFragment();
        for (const n of region.ownedNodes) { frag.appendChild(n); }
        region.anchor.after(frag);
      }
    }

    self.currentBranchIndex = clientBranch.matchIndex;
  },

  update({ node, scope, region, renderAST, lookupExpression, self }) {
    const result = selectBranch(node, lookupExpression);
    if (result.matchIndex === self.currentBranchIndex) { return; }
    self.currentBranchIndex = result.matchIndex;
    if (result.contentAST) {
      const branchScope = scope.child();
      const fragment = renderAST({ ast: result.contentAST, scope: branchScope });
      region.setContent(fragment, branchScope);
    }
    else {
      region.clear();
    }
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
