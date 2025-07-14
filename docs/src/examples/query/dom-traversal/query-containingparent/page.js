import { $ } from '@semantic-ui/query';

const target = $('.target');
const containingParent = target.containingParent();

containingParent.addClass('highlight');