// Context: Debugging what triggered reactions
import { Reaction, Signal } from '@semantic-ui/reactivity';

const userCount = new Signal(0);

// Reaction that debugs what caused it to run
Reaction.create((reaction) => {
  console.log('Users online:', userCount.get());
  console.log('Caused by:', reaction.context?.action);
});

// Different actions add context to identify the cause
userCount.addContext({ action: 'userLogin', userId: 123 });
userCount.set(1);
Reaction.flush();

userCount.addContext({ action: 'userLogout', userId: 456 });
userCount.set(0);
Reaction.flush();

userCount.addContext({ action: 'bulkImport', count: 50 });
userCount.set(50);
Reaction.flush();
