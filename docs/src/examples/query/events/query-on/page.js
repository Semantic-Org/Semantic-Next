import { $ } from '@semantic-ui/query';

const updateLog = (message) => {
  $('.log').text(message);
};

// Single event
$('.simple').on('click', (event) => {
  updateLog(`Click event triggered`);
});

// Pointer events
$('.hover')
  .on('pointerenter', (event) => {
    updateLog(`Pointer entered: ${event.type}`);
  })
  .on('pointerleave', (event) => {
    updateLog(`Pointer left: ${event.type}`);
  });

// Multiple event types in one call
$('.multiple').on('pointerdown pointerup', (event) => {
  updateLog(`Event: ${event.type} triggered`);
});
