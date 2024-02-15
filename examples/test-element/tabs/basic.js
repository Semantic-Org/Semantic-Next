import { createComponent } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import css from './basic.css';
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
  setCurrentDate() {
    tpl.date.value = new Date();
  },
  callParentMethod() {
    return tpl.parent().getText();
  },
  calculateCurrentSeconds() {
    let date = tpl.date.get();
    let second = Math.abs(date.getSeconds()) % 10;
    tpl.second.set(second);
  },
  getFormattedText() {
    return `This is <b>bolded text</b> in a sentence`;
  },
  calculateCurrentSlogan() {
    let second = tpl.second.get();
    tpl.slogan.value = tpl.slogans[second];
  },
  echo(value) {
    return value;
  },
});

const onRendered = (tpl) => {
  tpl.setCurrentDate();

  // update date every 1 sec
  tpl.interval = setInterval(tpl.setCurrentDate, 1000);

  // calculate seconds from date (reactive on date)
  tpl.reaction(tpl.calculateCurrentSeconds);

  // calculate slogan from seconds (reactive on seconds);
  tpl.reaction(tpl.calculateCurrentSlogan);
};

const onDestroyed = (tpl) => {
  console.log('basic destroyed');
  clearInterval(tpl.interval);
};

const events = {
  'click button'(event, tpl) {
    console.log('button clicked');
  },
};

const basicTab = createComponent({
  templateName: 'basic',
  createInstance,
  template,
  css,
  onCreated: () => console.log('on created basic'),
  onRendered,
  onDestroyed,
  events,
});
export { basicTab };
