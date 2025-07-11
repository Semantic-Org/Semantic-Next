import { $ } from '@semantic-ui/query';
import './query-mask-input.js';

$('.alpha').maskInput({ type: 'alpha' });
$('.numeric').maskInput({ type: 'numeric' });
$('.alphanumeric').maskInput({ type: 'alphanumeric' });
$('.three').maskInput({ type: /3/ });
