import { $ } from '@semantic-ui/query';

const target = $('.target');
const clippingParent = target.clippingParent();

clippingParent.addClass('highlight');