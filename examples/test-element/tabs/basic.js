import { defineComponent } from '@semantic-ui/component';
import { Signal } from '@semantic-ui/reactivity';
import template from './basic.html?raw';
import css from './basic.css?raw';

const createComponent = ({ self, $, signal, findParent }) => ({
  date: signal(new Date()),
  slogan: signal(),
  second: signal(),
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
    self.date.value = new Date();
  },
  callParentMethod() {
    return findParent().getText();
  },
  calculateCurrentSeconds() {
    let date = self.date.get();
    let second = Math.abs(date.getSeconds()) % 10;
    self.second.set(second);
  },
  getFormattedText() {
    return `This is <b>bolded text</b> in a sentence`;
  },
  calculateCurrentSlogan() {
    let second = self.second.get();
    self.slogan.value = self.slogans[second];
  },
  echo(value) {
    return value;
  },
});

const onRendered = ({ self, reaction }) => {
  self.setCurrentDate();

  // update date every 1 sec
  self.interval = setInterval(self.setCurrentDate, 1000);

  // calculate seconds from date (reactive on date)
  reaction(self.calculateCurrentSeconds);

  // calculate slogan from seconds (reactive on seconds);
  reaction(self.calculateCurrentSlogan);
};

const onDestroyed = ({ self }) => {
  console.log('basic destroyed');
  clearInterval(self.interval);
};

const events = {
  'click button'({ event, self }) {
    console.log('button clicked');
  },
};

const basicTab = defineComponent({
  templateName: 'basic',
  createComponent,
  template,
  css,
  onCreated: () => console.log('on created basic'),
  onRendered,
  onDestroyed,
  events,
});
export { basicTab };
