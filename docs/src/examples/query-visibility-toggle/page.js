import { $ } from '@semantic-ui/query';
import { isArray } from '@semantic-ui/utils';

// Toggle panels
$('.toggle-panels').on('click', () => {
  $('.panel').toggle();
});

// Toggle notification
$('.toggle-notification').on('click', () => {
  $('.notification').toggle();
});

// Toggle sidebar
$('.toggle-sidebar').on('click', () => {
  $('.sidebar').toggle();
});

// Toggle grid (requires CSS analysis to work properly)
$('.toggle-grid').on('click', () => {
  $('.grid-container').toggle();
  console.log('Grid toggled with CSS analysis');
});

// Toggle all elements with CSS analysis (default)
$('.toggle-all').on('click', () => {
  const $elements = $('.elements > *');
  $elements.toggle();

  // Show which elements are now visible
  const $visible = $elements.filter((el) => $(el).isVisible());
  const visibleCount = isArray($visible) ? $visible.length : ($visible.length || 0);
  console.log(`Toggled all elements (with CSS analysis): ${visibleCount} visible`);
});

// Toggle all with fast calculation (may not work correctly for CSS-defined display)
$('.toggle-fast').on('click', () => {
  const $elements = $('.elements > *');
  $elements.toggle({ calculate: false });

  // Show which elements are now visible
  const $visible = $elements.filter((el) => $(el).isVisible());
  const visibleCount = isArray($visible) ? $visible.length : ($visible.length || 0);
  console.log(`Toggled all elements (fast mode): ${visibleCount} visible`);
  console.log('Note: Fast mode may not correctly handle CSS-defined display values');
});

// Log initial state
console.log('Toggle example loaded. Try toggling the grid with both modes to see the difference.');
