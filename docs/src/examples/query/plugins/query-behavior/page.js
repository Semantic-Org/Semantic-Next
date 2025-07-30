import { $ } from '@semantic-ui/query';
import './query-tooltip.js';

// Precedent for plugin Settings are:
// 1. Plugin Default
// 2. Settings Object
// 3. Specified in Data Attribute
$('.box').tooltip({
  title: 'Setting Title',
  content: 'Setting Content'
});

