import { createComponent, getText } from '@semantic-ui/component';
import { each, clone, generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const state = {
  balls: [],
  time: 0,
};

const createInstance = ({tpl, $, reaction, reactiveVar, state}) => ({

  startTime() {
    tpl.tick();
  },

  getCanvas() {
    return $('canvas').get(0);
  },

  tick() {
    state.lastTime = state.time.get();
    state.time.increment();
    // schedule next tick in 1 frame (144fps)
    const frame = 1000 / 144;
    setTimeout(tpl.tick, frame);
  },

  createBalls(count) {
    while(count--) {
      tpl.createBall({x: 250, y: 250});
    }
  },

  createBall({x, y}) {

    // create ball
    const ball = reactiveVar({
      _id: generateID(),
      x,
      y,
      radius: Math.random() * 15 + 10,
      color: `oklch(
        ${Math.random() + 0.5}
        ${Math.random()} ${Math.random() * 255} /
        ${Math.random() * 50 + 50}%
      )`,
      vx: Math.random() * 3,
      vy: Math.random() * 3,
    });


    // we add it to balls array
    state.balls.push(ball);

    // we setup a reaction so it updates as time changes
    reaction(() => tpl.updateBallPosition(ball));
  },

  updateBallPosition(ball) {

    // check time reactively
    const t = state.time.get() - state.lastTime;

    // get current position non-reactively
    const ballData = ball.peek();

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
    // update ball
    ball.set(ballData);
  },

  draw() {
    const canvas = tpl.getCanvas();
    const ctx = canvas.getContext(`2d`);
    reaction(comp => {
      const balls = state.balls.get();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      each(balls, (ball) => {
        const ballData = ball.get();
        tpl.drawBall(ballData);
      });
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

});

const onRendered = ({tpl}) => {
  tpl.startTime();
  tpl.draw();
  tpl.createBalls(25);
};

const events = {
  'pointerdown canvas'({tpl, event}) {
    const canvas = tpl.getCanvas();
    const rect = canvas.getBoundingClientRect();
    tpl.createBall({
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    });
  }
};

export const BallSimulation = createComponent({
  tagName: 'ball-simulation',
  template,
  css,
  createInstance,
  onRendered,
  events,
  state
});
