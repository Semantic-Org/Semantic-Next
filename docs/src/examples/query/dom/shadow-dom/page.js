import { $, $$ } from '@semantic-ui/query';

const $match1 = $('.match');
const $match2 = $$('.match');

$('test-element').on('rendered', () => {
  const $match3 = $$('.match');

  $('.matches .native').text(`$ matches ${$match1.count()} elements`);
  $('.matches .shadow.pre').text(`$$ before render matches ${$match2.count()} elements`);
  $('.matches .shadow.post').text(`$$ after render matches ${$match3.count()} elements`);
});


