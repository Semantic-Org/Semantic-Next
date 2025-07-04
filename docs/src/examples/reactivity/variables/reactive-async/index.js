import { Reaction, Signal } from '@semantic-ui/reactivity';

let number = new Signal(0);

// A reaction will always immediately run to determine
// Its reactive dependencies. This will log "0"
Reaction.create(() => {
  console.log(number.get());
});

// Any changes in the same code path from set() will batch
// This will only log "5"
[1, 2, 3, 4, 5].forEach(value => number.set(value));
