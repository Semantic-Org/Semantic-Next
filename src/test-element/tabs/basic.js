import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import template from './basic.html';

const createInstance = (tpl, $) => ({
  date: new ReactiveVar(new Date()),
  slogan: new ReactiveVar(),
  second: new ReactiveVar(),
  slogans: {
    0: 'Awesome',
    1: 'Amazing',
    2: 'Way to go',
    3: 'Whoopie',
    4: 'You are in the zone',
    5: 'I know you got this',
    6: 'You are great',
    7: 'Lucky number 7',
    8: 'Never again!',
    9: 'Number 9 for the win',
  },
  echo(value) {
    //console.log('tpl is', tpl);
    return value;
  }
});

const onRendered = (tpl) => {
  console.log('Basic tab onrendered called');
  tpl.interval = setInterval(() => {
    tpl.date.value = new Date();
  }, 1000);

  tpl.reaction((comp) => {
    let date = tpl.date.get();
    let second = Math.abs(date.getSeconds()) % 10;
    tpl.second.set(second);
  });

  tpl.reaction((comp) => {
    let second = tpl.second.get();
    tpl.slogan.value = tpl.slogans[second];
  });

};

const onDestroyed = (tpl) => {
  console.log('Basic tab ondestroyed called');
  clearInterval(tpl.interval);
};

const basicTab = createComponent({
  template,
  createInstance,
  onRendered,
  onDestroyed,
});

export { basicTab };
