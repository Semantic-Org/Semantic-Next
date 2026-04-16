import { Reaction, Signal } from '@semantic-ui/reactivity';

export class ReactionScope {
  constructor() {
    this.reactions = [];
    this.children = [];
    this.disposers = [];
  }

  track(reaction) {
    this.reactions.push(reaction);
  }

  // Create a Reaction that auto-stops when `node` is disconnected from the DOM.
  // Combines the track + isConnected guard that every renderer binding uses.
  // Optional `context` is forwarded to Reaction for dev-mode tracing.
  reaction(node, callback, context) {
    this.track(Reaction.create((comp) => {
      if (!comp.firstRun && !node.isConnected) {
        comp.stop();
        return;
      }
      callback(comp);
    }, Signal.tracing ? { context } : undefined));
    // Signal.tracing gate prevents flamecharts from resolving as reaction.context.context.context
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
