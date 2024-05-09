import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { each, generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({tpl, $, onCreated}) => ({
  balls: new ReactiveVar([]),
  clock: new ReactiveVar(0),

  startClock() {
    tpl.tick();
    each(tpl.balls.get(), tpl.calculateBall);
    tpl.draw();
  },

  getCanvas() {
    return $('canvas').get(0);
  },

  tick() {
    const t = tpl.clock.get() + 1;
    tpl.clock.set(t);

    each(tpl.balls.get(), (ball) => {
      const ballData = ball.get();
      ballData.t = t;
      ball.set(ballData);
    });

    const frame = 1000 / 60;
    setTimeout(tpl.tick, frame);
  },

  createBall({x, y}) {
    const ball = new ReactiveVar({
      _id: generateID(),
      x,
      y,
      radius: Math.random() * 20 + 10,
      color: `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`,
      vx: Math.random() * 400 - 2,
      vy: Math.random() * 400 - 2,
      t: tpl.clock.get()
    });
    console.log(ball instanceof ReactiveVar);
    tpl.balls.push(ball);
    console.log(ball[0] instanceof ReactiveVar);
  },

  calculateBall() {
    tpl.reaction(() => {
      const ballData = ball.get();

      // Update ball position
      ballData.x += ballData.vx * t;
      ballData.y += ballData.vy * t;

      // Check for collision with walls
      const canvas = tpl.getCanvas();
      if (ballData.x + ballData.radius > canvas.width || ballData.x - ballData.radius < 0) {
        ballData.vx = -ballData.vx;
      }
      if (ballData.y + ballData.radius > canvas.height || ballData.y - ballData.radius < 0) {
        ballData.vy = -ballData.vy;
      }
      console.log('setting ball to', ballData);
      ball.set(ballData);
    });
  },

  drawBall(ball) {
    const canvas = tpl.getCanvas();
    const ctx = canvas.getContext(`2d`);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  },

  draw() {
    const canvas = tpl.getCanvas();
    const ctx = canvas.getContext(`2d`);

    tpl.reaction(comp => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      each(tpl.balls.get(), (ball) => {
        tpl.drawBall(ball.get());
      });
    });
  },

});

const events = {
  'click canvas'({tpl, event}) {
    const canvas = tpl.getCanvas();
    const rect = canvas.getBoundingClientRect();
    tpl.createBall({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }
};

const onRendered = ({tpl}) => {
  tpl.startClock();
};

createComponent({
  tagName: 'ball-simulation',
  template,
  css,
  createInstance,
  onRendered,
  events,
});
g
