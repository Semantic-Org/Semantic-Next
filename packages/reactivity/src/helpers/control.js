import { isEqual } from '@semantic-ui/utils';
import { Dependency } from '../dependency.js';
import { Reaction } from '../reaction.js';
import { Scheduler } from '../scheduler.js';

export const nonreactive = (func) => {
  const previousReaction = Scheduler.current;
  Scheduler.current = null;
  try {
    return func();
  }
  finally {
    Scheduler.current = previousReaction;
  }
};

export const guard = (compute, equalCheck = isEqual) => {
  if (!Scheduler.current) {
    return compute();
  }
  const dep = new Dependency();
  let value, newValue;
  dep.depend();
  const guardReaction = new Reaction(() => {
    newValue = compute();
    if (!guardReaction.firstRun && !equalCheck(newValue, value)) {
      dep.changed();
    }
    value = newValue;
  });
  Scheduler.current.onCleanup(() => guardReaction.stop());
  guardReaction.run();
  return newValue;
};

export const currentReaction = () => Scheduler.current;
