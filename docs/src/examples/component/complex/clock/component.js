import { createComponent, getText } from '@semantic-ui/component';
import { sum, range } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

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
  getRotation(name, ...offsets) {
    const offset = sum(offsets);
    const { hours, minutes, seconds } = tpl.getTime();
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

const onDestroyed = ({tpl}) => {
  clearInterval(tpl.interval);
};

const onRendered = ({ $ }) => {
};

createComponent({
  tagName: 'ui-clock',
  createInstance,
  template,
  state,
  css,
  onRendered,
  onDestroyed
});
