import { createComponent} from '@semantic-ui/component';
import { sum } from '@semantic-ui/utils';

import css from './component.css?raw';
import template from './component.html?raw';
const state = {
  time: new Date(),
};

const createInstance = ({tpl, state}) => ({
  majorMarkers: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55],
  minorMarkers: [1, 2, 3, 4],
  initialize() {
    tpl.interval = tpl.startClock();
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
  getMarkerRotation(name, ...offsets) {
    const offset = sum(offsets);
    const degreeMap = {
      minor: 30 * offset,
      major: 6 * (offset),
    };
    const degrees = degreeMap[name];
    return `rotate(${degrees})`;
  },
  getTimeRotation(name) {
    const { hours, minutes, seconds } = tpl.getTime();
    const degreeMap = {
      hour: 30 * hours + minutes / 2,
      minute: 6 * minutes + seconds / 10,
      second: 6 * seconds
    };
    const degrees = degreeMap[name];
    return `rotate(${degrees})`;
  }
});

const onDestroyed = ({tpl}) => {
  clearInterval(tpl.interval);
};

export const UIClock = createComponent({
  tagName: 'ui-clock',
  createInstance,
  template,
  state,
  css,
  onDestroyed
});
