import { $ } from '@semantic-ui/query';
import { Reaction, Signal } from '@semantic-ui/reactivity';

// Create a signal for the count
const count = new Signal(0);

// Update the display whenever count changes
Reaction.create(() => {
  $('.count').text(count.get());
});

// Handle button clicks
$('.increment').on('click', () => {
  count.increment();
});

$('.decrement').on('click', () => {
  count.decrement();
});
