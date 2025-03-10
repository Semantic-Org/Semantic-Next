import { defineComponent, getText } from '@semantic-ui/component';
import { each, clone, generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultState = {
  balls: [],
  time: 0,
};

/*
  This animation loop uses the time as the main source of reactivity
  you can see this is driven by
  reaction(() => self.updateBallPosition(ball));

  which has a reactive reference to state.time()
*/

const createComponent = ({self, $, reaction, signal, state}) => ({

  startTime() {
    self.tick();
  },

  getCanvas() {
    return $('canvas').get(0);
  },

  tick() {
    state.lastTime = state.time.get();
    state.time.increment();
    // schedule next tick in 1 frame (144fps)
    const frame = 1000 / 144;
    setTimeout(self.tick, frame);
  },

  createBalls(count) {
    while(count--) {
      self.createBall({x: 250, y: 250});
    }
  },

  createBall({x, y}) {

    // create ball
    const ball = signal({
      _id: generateID(),
      x,
      y,
      radius: Math.random() * 15 + 10,
      color: `oklch(
        ${Math.random() + 0.5}
        ${Math.random()} ${Math.random() * 255} /
        ${Math.random() * 50 + 50}%
      )`,
      vx: Math.random() * 1.2,
      vy: Math.random() * 1.2,
    });


    // we add it to balls array
    state.balls.push(ball);

    // we setup a reaction so it updates as time changes
    reaction(() => self.updateBallPosition(ball));
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
    const canvas = self.getCanvas();
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
    const canvas = self.getCanvas();
    const ctx = canvas.getContext(`2d`);
    reaction(comp => {
      const balls = state.balls.get();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      each(balls, (ball) => {
        const ballData = ball.get();
        self.drawBall(ballData);
      });
    });
  },

  drawBall(ball) {
    const canvas = self.getCanvas();
    const ctx = canvas.getContext(`2d`);
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
  },

  getPointerPosition(event) {
    const canvas = this.getCanvas();
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

});

const onRendered = ({self}) => {
  self.startTime();
  self.draw();
  self.createBalls(25);
};

const events = {
  'pointerdown canvas'({self, event}) {
    const position = self.getPointerPosition(event);
    self.createBall(position);
  },
  'touchstart, touchmove canvas'({event}) {
    // prevent highlight/scroll on mobile
    event.preventDefault();
  },
};

export const BallSimulation = defineComponent({
  tagName: 'ball-simulation',
  template,
  css,
  createComponent,
  onRendered,
  events,
  defaultState
});
