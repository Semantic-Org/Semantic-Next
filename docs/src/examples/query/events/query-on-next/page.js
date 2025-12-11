import { $ } from '@semantic-ui/query';

const stepCount = $('.step').count();
let step = 1;

const runSteps = async () => {
  while (step <= stepCount) {
    await $('.next').onNext('click');
    $('.step').eq(step - 1).addClass('done');
    step++;
  }
  $('.next').addClass('disabled').text('Steps Complete');
};

runSteps();
