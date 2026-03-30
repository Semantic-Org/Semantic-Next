export class DynamicRegion {
  constructor(parentNode, referenceNode) {
    this.parentNode = parentNode;
    this.referenceNode = referenceNode;
    this.ownedNodes = [];
    this.childScopes = [];
    this.anchor = document.createTextNode('');
  }

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
    this.anchor.after(fragment);
  }

  getLastNode() {
    if (this.ownedNodes.length > 0) {
      return this.ownedNodes[this.ownedNodes.length - 1];
    }
    return this.anchor;
  }
}
