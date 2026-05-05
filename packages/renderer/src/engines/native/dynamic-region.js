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
  }

  setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    if (scope) { this.childScopes.push(scope); }
    this.anchor.after(fragment);
    this.placeEndAnchor();
  }

  // Boundary sentinel after the last owned node. isNodeInTemplate uses
  // strict "between" compareDocumentPosition so the trailing anchor ensures
  // the last content node is included in the range.
  placeEndAnchor() {
    const lastNode = this.ownedNodes[this.ownedNodes.length - 1];
    if (!lastNode) { return; }
    if (!this.endAnchor) {
      this.endAnchor = document.createTextNode('');
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
