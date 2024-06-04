import { $, $$ } from '@semantic-ui/query';

const $match1 = $('.match');
const $match2 = $$('.match');

$('.matches .native').text(`$ matches ${$match1.count()} elements`);
$('.matches .shadow').text(`$$ matches ${$match2.count()} elements`);





