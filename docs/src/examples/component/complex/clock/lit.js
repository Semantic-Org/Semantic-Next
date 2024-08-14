import {LitElement, html, css} from 'lit';
import {customElement, property} from 'lit/decorators.js';
import {repeat} from 'lit/directives/repeat.js';

@customElement("ui-clock")
export class UIClock extends LitElement {

  @property({type: Date})
  time?: date;

  static styles = css`
    svg {
      width: 100%;
      height: 100%;
    }

    :not(svg) {
      transform-origin: 0 0;
    }

    .clock-face {
      stroke: #333;
      fill: white;
    }

    .minor {
      stroke: #999;
      stroke-width: 0.5;
    }

    .major {
      stroke: #333;
      stroke-width: 1;
    }

    .hour {
      stroke: #333;
    }

    .minute {
      stroke: #666;
    }

    .second,
    .second-counterweight {
      stroke: rgb(180, 0, 0);
    }

    .second-counterweight {
      stroke-width: 3;
    }
  `;

  constructor() {
   super();
   this.time = new Date();
   this.interval = this.startClock();
  }

  render() {
    return html`
      <svg viewBox="-50 -50 100 100">
      <circle class="clock-face" r="48" />

      <!-- markers -->
      ${repeat(this.majorMarkers, (marker) => marker, (minute, index) => html`
        <line class="major" y1="35" y2="45" transform="${this.getMarkerRotation('major', minute)}"></line>
        ${repeat(this.minorMarkers, (marker) => marker, (offset, index) => html`
          <line class="minor" y1="42" y2="45" transform="${this.getMarkerRotation('minor', minute, offset)}"></line>
        `)}
      `)}


      <!-- hour hand -->
      <line class="hour" y1="2" y2="-20" transform="${this.getTimeRotation('hour')}"></line>

      <!-- minute hand -->
      <line class="minute" y1="4" y2="-30" transform="${this.getTimeRotation('minute')}"></line>

      <!-- second hand -->
      <g transform="${this.getTimeRotation('second')}">
        <line class="second" y1="10" y2="-38"></line>
        <line class="second-counterweight" y1="10" y2="2"></line>
      </g>
    </svg>

    `;
  }

  startClock = () => setInterval(() => {
    this.time = new Date();
  }, 1000);

  getTime() {
    const time = this.time;
    return {
      hours: time.getHours(),
      minutes: time.getMinutes(),
      seconds: time.getSeconds()
    };
  }

  getMarkerRotation(name, ...offsets) {
    const offset = this.sum(offsets);
    const degreeMap = {
      minor: 30 * offset,
      major: 6 * (offset),
    };
    const degrees = degreeMap[name];
    console.log(name, degrees);
    return `rotate(${degrees})`;
  }

  sum(values) {
    return values.reduce((acc, num) => acc + num, 0);
  }

  getTimeRotation(name) {
    const { hours, minutes, seconds } = this.getTime();
    const degreeMap = {
      hour: 30 * hours + minutes / 2,
      minute: 6 * minutes + seconds / 10,
      second: 6 * seconds
    };
    const degrees = degreeMap[name];
    return `rotate(${degrees})`;
  }

  majorMarkers = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55];
  minorMarkers = [1, 2, 3, 4];

}
