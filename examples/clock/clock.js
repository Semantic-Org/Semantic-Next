import { defineComponent } from '@semantic-ui/component';
import { sum } from '@semantic-ui/utils';

import css from './clock.css';
import template from './clock.html';

const state = {
  time: new Date(),
};

const createComponent = ({self, state}) => ({
  majorMarkers: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  minorMarkers: [1, 2, 3, 4],
  initialize() {
    self.interval = self.startClock();
  },
  startClock: () => setInterval(() => state.time.now(), 1000),
  getTime() {
    const time = state.time.get();
    return {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds()
    };
  },
  getRotation(name, ...offsets) {
    const offset = sum(offsets);
    const { hours, minutes, seconds } = self.getTime();
    const degreeMap = {
      minorAxis: 30 * offset,
      majorAxis: 6 * (offset),
      hourHand: 30 * hours + minutes / 2,
      minuteHand: 6 * minutes + seconds / 10,
      secondHand: 6 * seconds
    };
    const degrees = degreeMap[name];
    return `rotate(${degrees})`;
  }
});

const onDestroyed = ({self}) => {
  clearInterval(self.interval);
};

const onRendered = ({ $ }) => {
};

const UIClock = defineComponent({
  tagName: 'ui-clock',
  createComponent,
  template,
  state,
  css,
  onRendered,
  onDestroyed
});

export { UIClock };
