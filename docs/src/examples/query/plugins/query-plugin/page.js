import { $ } from '@semantic-ui/query';
import './mask-input-plugin.js';

$('.alpha').maskInput({ type: 'alpha' });
$('.numeric').maskInput({ type: 'numeric' });
$('.alphanumeric').maskInput({ type: 'alphanumeric' });
$('.three').maskInput({ type: /3/ });
