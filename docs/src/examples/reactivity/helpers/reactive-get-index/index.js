// Helper: getIndex
import { Reaction, Signal } from '@semantic-ui/reactivity';

const colors = new Signal(['red', 'green', 'blue', 'yellow']);

Reaction.create(() => console.log('First color:', colors.getIndex(0)));
Reaction.create(() => console.log('Third color:', colors.getIndex(2)));

// Change the first color
colors.setIndex(0, 'purple');
Reaction.flush();

// Change the third color
colors.setIndex(2, 'orange');
Reaction.flush();
