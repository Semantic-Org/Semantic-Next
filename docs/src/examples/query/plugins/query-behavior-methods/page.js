import { $ } from '@semantic-ui/query';

$('.box').tally();

// a string first argument dispatches to a method instead of initializing
$('.add').on('click', () => $('.box').tally('add'));

// 'get count' resolves to getCount, one value when both agree, an array when they differ
$('.read').on('click', () => {
  $('.value').text(JSON.stringify($('.box').tally('get count')));
});

// 'set step' resolves to setStep, changing the same setting without a rebuild
$('.step').on('click', () => $('.box').tally('set step', 10));

// any call without a method name runs reinitialize(), which destroys the instance and builds a new one
$('.rebuild').on('click', () => $('.box').tally({ step: 10 }));
