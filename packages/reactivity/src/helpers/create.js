import { Reaction } from '../reaction.js';
import { Signal } from '../signal.js';

export const signal = (initialValue, options) => new Signal(initialValue, options);

export const reaction = (callback, options = {}) => {
  const thisReaction = new Reaction(callback, options);
  if (options.firstRun !== false) {
    thisReaction.run();
  }
  return thisReaction;
};
