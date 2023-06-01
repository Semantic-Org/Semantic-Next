/*
  Create a variable that will trigger
  any reactive context to rerun when 'get'
  is called
*/

class ReactiveVar {
  constructor(initialValue, equalsFunc) {
    this.value = initialValue;
    this.equalsFunc = equalsFunc || ((a, b) => a === b);
    this.dependents = new Set();
  }

  get() {
    track(this);
    return this.value;
  }

  set(newValue) {
    if (!this.equalsFunc(this.value, newValue)) {
      this.value = newValue;
      trigger(this);
    }
  }
}


/*
  Handle tracking callbacks for reactivity
*/

const reactionStack = [];

function track(reactiveVar) {
  if (reactionStack.length > 0) {
    const currentReaction = reactionStack[reactionStack.length - 1];
    reactiveVar.dependents.add(currentReaction);
    currentReaction.dependencies = currentReaction.dependencies || new Set();
    currentReaction.dependencies.add(reactiveVar);
  }
}

function trigger(reactiveVar) {
  for (const reaction of reactiveVar.dependents) {
    reaction();
  }
}


/*
  Create a function that will re-run
  if reactive variables change
*/
function CreateReaction(callback) {
  let firstRun = true;

  const reaction = () => {
    reactionStack.push(reaction);
    callback(reaction);
    reactionStack.pop();
    firstRun = false;
  };

  reaction.stop = () => {
    if (reaction.dependencies) {
      for (const dep of reaction.dependencies) {
        dep.dependents.delete(reaction);
      }
    }
  };

  reaction.firstRun = firstRun;

  return reaction;
}


/*
  Create a function that will not re-run
  if reactive variables change, even if in a reactive context
*/
function AvoidReaction(callback) {
  const currentReaction = reactionStack.pop();
  const result = callback();
  if (currentReaction) {
    reactionStack.push(currentReaction);
  }
  return result;
}


export {
  ReactiveVar,
  CreateReaction,
  AvoidReaction
};
