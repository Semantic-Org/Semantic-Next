import { isTracing, Reaction } from '@semantic-ui/reactivity';

export class ReactionScope {
  constructor() {
    this.reactions = [];
    this.children = [];
    this.disposers = [];
    this.parent = null;
    this.index = -1; // this scope's slot in parent.children, for O(1) detach
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
    }, isTracing() ? { context } : undefined));
    // isTracing() prevents flamecarts from resolving as reaction.context.context.context
  }

  onDispose(fn) {
    this.disposers.push(fn);
  }

  child() {
    const childScope = new ReactionScope();
    childScope.parent = this;
    childScope.index = this.children.push(childScope) - 1;
    return childScope;
  }

  // `fromParent` is set when the parent is tearing down all its children: the
  // child then skips the per-child parent-unlink (the parent clears its array
  // once), turning bulk teardown from O(n²) into O(n) and avoiding a splice
  // mid-iteration. Standalone dispose detaches via an O(1) swap-pop using the
  // stored slot index instead of indexOf + splice.
  dispose(fromParent = false) {
    for (const child of this.children) { child.dispose(true); }
    this.children = [];
    for (const reaction of this.reactions) { reaction.stop(); }
    this.reactions = [];
    for (const fn of this.disposers) { fn(); }
    this.disposers = [];
    if (!fromParent && this.parent) {
      const siblings = this.parent.children;
      const last = siblings.pop();
      if (last && last !== this && this.index < siblings.length) {
        siblings[this.index] = last;
        last.index = this.index;
      }
    }
    this.parent = null;
    this.index = -1;
  }
}
