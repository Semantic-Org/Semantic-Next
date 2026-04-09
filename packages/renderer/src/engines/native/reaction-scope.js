export class ReactionScope {
  constructor() {
    this.reactions = [];
    this.children = [];
    this.disposers = [];
  }

  track(reaction) {
    this.reactions.push(reaction);
  }

  onDispose(fn) {
    this.disposers.push(fn);
  }

  child() {
    const childScope = new ReactionScope();
    childScope.parent = this;
    this.children.push(childScope);
    return childScope;
  }

  dispose() {
    for (const child of this.children) { child.dispose(); }
    this.children = [];
    for (const reaction of this.reactions) { reaction.stop(); }
    this.reactions = [];
    for (const fn of this.disposers) { fn(); }
    this.disposers = [];
    // Remove from parent to prevent accumulation across branch switches
    if (this.parent) {
      const idx = this.parent.children.indexOf(this);
      if (idx !== -1) { this.parent.children.splice(idx, 1); }
      this.parent = null;
    }
  }
}
