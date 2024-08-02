import { createComponent, getText } from '@semantic-ui/component';
import { each, generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const state = {
  balls: [],
};

const createInstance = ({tpl, $, reaction, reactiveVar, state}) => ({

  emitter: {
    rate: 2, // balls per second
    active: false,
    x: 0,
    y: 0,
  },

  ball: {
    initialCount: 80,
    r: { average: 3, variance: 1 },
    v: { average: 100, variance: 100 },
    saturation: {
      decayRate: 200,
      min: 1
    },
    lightness: {
      decayRate: 20,
      min: 15,
    },
  },

  render: {
    lastTime: 0,
    fps: 0,
  },

  startAnimation() {
    tpl.render.lastTime = performance.now() * 0.001;
    requestAnimationFrame(tpl.animate);
  },

  getCanvas() {
    return $('canvas').get(0);
  },

  animate(currentTime) {
    currentTime *= 0.001;
    const deltaTime = currentTime - tpl.render.lastTime;
    tpl.render.lastTime = currentTime;

    tpl.render.fps = 1 / deltaTime;

    if (tpl.emitter.active) {
      tpl.emitBalls();
    }

    tpl.updateBalls(deltaTime);
    tpl.draw();

    requestAnimationFrame(tpl.animate);
  },

  emitBalls() {
    const newBalls = [];
    for (let i = 0; i < tpl.emitter.rate; i++) {
      newBalls.push(tpl.createBall({
        x: tpl.emitter.x,
        y: tpl.emitter.y
      }));
    }
    const currentBalls = state.balls.peek();
    state.balls.set([...currentBalls, ...newBalls]);
  },

  createBall({x, y}) {
    const { ball } = tpl;
    const randomInRange = (average, variance) => average + (Math.random() - 0.5) * 2 * variance;

    const angle = Math.random() * 2 * Math.PI;
    const speed = randomInRange(ball.v.average, ball.v.variance);

    return {
      _id: generateID(),
      x,
      y,
      radius: randomInRange(ball.r.average, ball.r.variance),
      color: tpl.getRandomColor(),
      saturation: 100, // Start at full saturation
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
    };
  },

  getRandomColor() {
    const hue = Math.random() * 360;
    const lightness = 40 + Math.random() * 20;  // 40-60%
    return { h: hue, s: 100, l: lightness }; // Start with full saturation
  },

  updateBalls(deltaTime) {
    const canvas = tpl.getCanvas();
    const currentBalls = state.balls.peek();
    const updatedBalls = currentBalls.map(ball =>
      tpl.pipe(ball,
        b => tpl.decayColor(b, deltaTime),
        b => tpl.updatePosition(b, deltaTime),
        b => tpl.checkWalls(b, canvas)
      )
    );

    tpl.checkCollisions(updatedBalls);

    state.balls.set(updatedBalls);
  },

  pipe(initialValue, ...fns) {
    return fns.reduce((value, fn) => fn(value), initialValue);
  },

  decayColor(ball, deltaTime) {
    return {
      ...ball,
      saturation: Math.max(
        tpl.ball.saturation.min,
        ball.saturation - tpl.ball.saturation.decayRate * deltaTime
      ),
      color: {
        ...ball.color,
        l: Math.max(
          tpl.ball.lightness.min,
          ball.color.l - tpl.ball.lightness.decayRate * deltaTime
        )
      }
    };
  },

  updatePosition(ball, deltaTime) {
    return {
      ...ball,
      x: ball.x + ball.vx * deltaTime,
      y: ball.y + ball.vy * deltaTime
    };
  },

  checkWalls(ball, canvas) {
    let { x, y, vx, vy, radius } = ball;

    if (x + radius > canvas.width || x - radius < 0) {
      vx = -vx;
      x = Math.max(radius, Math.min(canvas.width - radius, x));
    }
    if (y + radius > canvas.height || y - radius < 0) {
      vy = -vy;
      y = Math.max(radius, Math.min(canvas.height - radius, y));
    }

    return { ...ball, x, y, vx, vy };
  },

  checkCollisions(balls) {
    each(balls, (ball1, i) => {
      each(balls.slice(i + 1), ball2 => {
        const dx = ball2.x - ball1.x;
        const dy = ball2.y - ball1.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < ball1.radius + ball2.radius) {
          tpl.handleCollision(ball1, ball2, dx, dy, distance);
        }
      });
    });
  },

  handleCollision(ball1, ball2, dx, dy, distance) {
    // Revive colors
    ball1.color = tpl.getRandomColor();
    ball2.color = tpl.getRandomColor();
    ball1.saturation = 100;
    ball2.saturation = 100;

    // Collision physics
    const angle = Math.atan2(dy, dx);
    const sin = Math.sin(angle);
    const cos = Math.cos(angle);

    // Rotate velocities
    const vx1 = ball1.vx * cos + ball1.vy * sin;
    const vy1 = ball1.vy * cos - ball1.vx * sin;
    const vx2 = ball2.vx * cos + ball2.vy * sin;
    const vy2 = ball2.vy * cos - ball2.vx * sin;

    // Swap velocities
    ball1.vx = vx2 * cos - vy1 * sin;
    ball1.vy = vy1 * cos + vx2 * sin;
    ball2.vx = vx1 * cos - vy2 * sin;
    ball2.vy = vy2 * cos + vx1 * sin;

    // Move balls apart
    const overlap = (ball1.radius + ball2.radius - distance) / 2;
    ball1.x -= overlap * cos;
    ball1.y -= overlap * sin;
    ball2.x += overlap * cos;
    ball2.y += overlap * sin;
  },

  draw() {
    const canvas = tpl.getCanvas();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    each(state.balls.peek(), (ball) => {
      tpl.drawBall(ball);
    });

    tpl.drawFPS(ctx);
  },

  drawBall(ball) {
    const canvas = tpl.getCanvas();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${ball.color.h}, ${ball.saturation}%, ${ball.color.l}%)`;
    ctx.fill();
    ctx.closePath();
  },

  drawFPS(ctx) {
    const canvas = tpl.getCanvas();
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`FPS: ${Math.round(tpl.render.fps)}`, canvas.width - 10, canvas.height - 10);
  },

});

const onRendered = ({state, tpl}) => {
  const canvas = tpl.getCanvas();
  const initialBalls = [];
  for (let i = 0; i < tpl.ball.initialCount; i++) {
    initialBalls.push(tpl.createBall({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    }));
  }
  state.balls.set(initialBalls);

  tpl.draw();
  tpl.startAnimation();
};

const events = {
  'mousedown canvas'({tpl, event}) {
    const canvas = tpl.getCanvas();
    const rect = canvas.getBoundingClientRect();
    tpl.emitter.x = (event.clientX - rect.left);
    tpl.emitter.y = (event.clientY - rect.top);
    tpl.emitter.active = true;
  },

  'mousemove canvas'({tpl, event}) {
    if (tpl.emitter.active) {
      const canvas = tpl.getCanvas();
      const rect = canvas.getBoundingClientRect();
      tpl.emitter.x = (event.clientX - rect.left);
      tpl.emitter.y = (event.clientY - rect.top);
    }
  },

  'mouseup, mouseleave canvas'({tpl}) {
    tpl.emitter.active = false;
  },
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
