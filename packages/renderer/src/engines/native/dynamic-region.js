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
    if (this.endAnchor) {
      this.endAnchor.remove();
      this.endAnchor = null;
    }
  }

  setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    if (scope) { this.childScopes.push(scope); }
    this.anchor.after(fragment);
    // Place end sentinel after content for template boundary detection.
    // isNodeInTemplate uses strict "between" comparisons, so a trailing
    // sentinel ensures the last content node is included in the range.
    if (!this.endAnchor) {
      this.endAnchor = document.createTextNode('');
    }
    const lastNode = this.ownedNodes[this.ownedNodes.length - 1];
    if (lastNode) {
      lastNode.after(this.endAnchor);
    }
  }

  getLastNode() {
    if (this.ownedNodes.length > 0) {
      return this.ownedNodes[this.ownedNodes.length - 1];
    }
    return this.anchor;
  }
}
