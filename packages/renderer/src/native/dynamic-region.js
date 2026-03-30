export class DynamicRegion {
  constructor(parentNode, referenceNode) {
    this.parentNode = parentNode;
    this.referenceNode = referenceNode;
    this.ownedNodes = [];
    this.childScopes = [];
    // Persistent anchor — always stays in the DOM as a positional marker
    this.anchor = document.createTextNode('');
  }

  // Place the anchor in the DOM
  placeAnchor() {
    if (this.referenceNode) {
      this.referenceNode.after(this.anchor);
    }
    else {
      this.parentNode.appendChild(this.anchor);
    }
  }

  clear() {
    for (const scope of this.childScopes) { scope.dispose(); }
    this.childScopes = [];
    for (const node of this.ownedNodes) { node.remove(); }
    this.ownedNodes = [];
  }

  setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    if (scope) { this.childScopes.push(scope); }
    // Insert after the persistent anchor
    this.anchor.after(fragment);
  }

  getLastNode() {
    if (this.ownedNodes.length > 0) {
      return this.ownedNodes[this.ownedNodes.length - 1];
    }
    return this.anchor;
  }
}
