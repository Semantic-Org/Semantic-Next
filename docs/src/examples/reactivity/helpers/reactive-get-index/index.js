// Helper: getIndex
import { flush, reaction, signal } from '@semantic-ui/reactivity';

const colors = signal(['red', 'green', 'blue', 'yellow']);

reaction(() => console.log('First color:', colors.getIndex(0)));
reaction(() => console.log('Third color:', colors.getIndex(2)));

// Change the first color
colors.setIndex(0, 'purple');
flush();

// Change the third color
colors.setIndex(2, 'orange');
flush();
