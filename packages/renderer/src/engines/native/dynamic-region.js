import { SCOPE_END, SCOPE_OWNER } from './scope-context.js';

export class DynamicRegion {
  constructor(parentNode, marker) {
    this.parentNode = parentNode;
    this.ownedNodes = [];
    this.childScopes = [];
    this.anchor = document.createTextNode('');
    if (marker) {
      marker.replaceWith(this.anchor);
    }
  }

  clear() {
    for (const scope of this.childScopes) { scope.dispose(); }
    this.childScopes = [];
    for (const node of this.ownedNodes) { node.remove(); }
    this.ownedNodes = [];
    // endAnchor is reusable across fills.
    if (this.endAnchor) { this.endAnchor.remove(); }
    // the owner stamp dies with the content — the endAnchor's removal
    // takes the END jump with it, so a stale owner here would leak the
    // old layer into later siblings' scans
    this.anchor[SCOPE_OWNER] = undefined;
  }

  setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    if (scope) { this.childScopes.push(scope); }
    this.anchor.after(fragment);
    this.placeEndAnchor();
  }

  // isNodeInTemplate uses strict "between" compareDocumentPosition, so a
  // trailing anchor is required for the last content node to fall inside
  // the range.
  placeEndAnchor() {
    const lastNode = this.ownedNodes[this.ownedNodes.length - 1];
    if (!lastNode) { return; }
    if (!this.endAnchor) {
      this.endAnchor = document.createTextNode('');
      // closed regions are one backward hop for scope resolution — also
      // keeps scans out of region content that contains scope stamps
      this.endAnchor[SCOPE_END] = this.anchor;
    }
    lastNode.after(this.endAnchor);
  }

  getLastNode() {
    if (this.ownedNodes.length > 0) {
      return this.ownedNodes[this.ownedNodes.length - 1];
    }
    return this.anchor;
  }
}
