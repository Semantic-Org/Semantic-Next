import { $ } from '@semantic-ui/query';

// Bind to container only - shows bubbling behavior
$('.container').on('click', function(event) {
  const details = [
    `Event Type: ${event.type}`,
    `Event Target: ${event.target.className || event.target.tagName.toLowerCase()}`,
    `Event Target Data: ${event.target.dataset.name}`,
    `Coordinates: ${event.clientX}, ${event.clientY}`,
    ``,
    `'this' Context (listener attached to):`,
    `  Element: ${this.className}`,
    `  Data Name: ${this.dataset.name}`,
    ``,
    `Same as target: ${this === event.target ? 'YES' : 'NO'}`,
    `Why: ${this === event.target ? 'Clicked directly' : 'Event bubbled up from child'}`,
  ].join('\n');

  $('.output').text(details);
});
