// Context: Debugging what triggered reactions
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const userCount = signal(0);

// Reaction that debugs what caused it to run
reaction((computation) => {
  console.log('Users online:', userCount.get());
  console.log('Caused by:', computation.context?.action);
});

// Different actions add context to identify the cause
userCount.addContext({ action: 'userLogin', userId: 123 });
userCount.set(1);
flush();

userCount.addContext({ action: 'userLogout', userId: 456 });
userCount.set(0);
flush();

userCount.addContext({ action: 'bulkImport', count: 50 });
userCount.set(50);
flush();
