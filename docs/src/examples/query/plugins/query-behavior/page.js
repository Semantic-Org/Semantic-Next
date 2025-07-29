import { $ } from '@semantic-ui/query';
import './query-tooltip.js';

// Initialize tooltips with different settings
$('.box').first().tooltip({
  title: 'First Box',
  content: 'Tooltip with title and content'
});

$('.box').eq(1).tooltip({
  content: 'Simple tooltip content only'
});

$('.box').last().tooltip({
  content: 'Uses data attributes from HTML'
});
