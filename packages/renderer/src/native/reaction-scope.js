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
  }
}
