export class DynamicRegion {
  constructor(parentNode, referenceNode) {
    this.parentNode = parentNode;
    this.referenceNode = referenceNode;
    this.ownedNodes = [];
    this.childScopes = [];
    this.anchor = null;
  }

  // Place an initial anchor when the region starts empty
  placeAnchor() {
    if (!this.anchor) {
      this.anchor = document.createTextNode('');
      if (this.referenceNode) {
        this.referenceNode.after(this.anchor);
      }
      else {
        this.parentNode.appendChild(this.anchor);
      }
    }
  }

  clear() {
    for (const scope of this.childScopes) { scope.dispose(); }
    this.childScopes = [];

    if (this.ownedNodes.length === 0) { return; }

    // Create anchor to remember position before removing nodes
    if (!this.anchor) {
      this.anchor = document.createTextNode('');
      this.ownedNodes[0].before(this.anchor);
    }

    for (const node of this.ownedNodes) { node.remove(); }
    this.ownedNodes = [];
  }

  setContent(fragment, scope) {
    this.clear();
    this.ownedNodes = [...fragment.childNodes];
    if (scope) { this.childScopes.push(scope); }

    if (this.anchor) {
      this.anchor.after(fragment);
      this.anchor.remove();
      this.anchor = null;
    }
    else if (this.referenceNode) {
      this.referenceNode.after(fragment);
    }
    else {
      this.parentNode.appendChild(fragment);
    }
  }

  getLastNode() {
    if (this.ownedNodes.length > 0) {
      return this.ownedNodes[this.ownedNodes.length - 1];
    }
    return this.anchor || this.referenceNode;
  }
}
