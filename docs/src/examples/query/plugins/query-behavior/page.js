import { $, Query } from '@semantic-ui/query';
import './query-tooltip.js';

console.log($.fn.tooltip);
console.log('is it equal', $.fn === Query.prototype);
console.log('outer tooltip is', Query.prototype.tooltip);

$('.box').tooltip();
