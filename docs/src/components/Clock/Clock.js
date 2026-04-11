import { defineComponent } from '@semantic-ui/component';
import { sum } from '@semantic-ui/utils';

import css from './Clock.css?raw';
import template from './Clock.html?raw';

const defaultState = {
  time: new Date(),
};

const createComponent = ({ self, state, interval }) => ({
  majorMarkers: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  minorMarkers: [1, 2, 3, 4],
  viewBox: '-50 -50 100 100',

  initialize() {
    self.startClock();
  },

  startClock: () => interval(() => state.time.now(), 1000),

  getTime() {
    const time = state.time.get();
    return {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds(),
    };
  },

  getMarkerRotation(name, ...offsets) {
    const offset = sum(offsets);
    const degreeMap = {
      minor: 6 * offset,
      major: 30 * (offset),
    };
    const degrees = degreeMap[name];
    return `rotate(${degrees})`;
  },

  getTimeRotation(name) {
    const { hours, minutes, seconds } = self.getTime();
    const degreeMap = {
      hour: 30 * hours + minutes / 2,
      minute: 6 * minutes + seconds / 10,
      second: 6 * seconds,
    };
    const degrees = degreeMap[name];
    return `rotate(${degrees})`;
  },
});

const Clock = defineComponent({
  tagName: 'ui-clock',
  createComponent,
  template,
  defaultState,
  css,
});

export default Clock;
export { Clock };
