import { Reaction } from './reaction.js';

export class Dependency {
  constructor() {
    this.subscribers = new Set();
  }

  depend() {
    if (Reaction.current) {
      this.subscribers.add(Reaction.current);
      Reaction.current.dependencies.add(this);
    }
  }

  changed(context) {
    this.subscribers.forEach((subscriber) => subscriber.invalidate(context));
  }

  cleanUp(reaction) {
    this.subscribers.delete(reaction);
  }

  unsubscribe(reaction) {
    this.subscribers.delete(reaction);
  }
}
