import { defineComponent, getText } from '@semantic-ui/component';
import { each, generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');


/*
  This animation loop uses the ball position as the main source of reactivity
  updating the positions using requestAnimationFrame as the browser will permit
  the animation loop to update the view

  The reactivity occurs in updateBalls()
  and the reaction is in startAnimation()
*/

const state = {
  balls: [],
};

const settings = {
  count: 0, // initial ball count
  radius: 3, // average ball radius
  velocity: 100, // average ball velocity
  emitRate: 2, // rate which balls are emitted from pointer
  saturationDecay: 500, // how quickly ball saturation decays after collision
  lightnessDecay: 20, // how quickly ball lightness decays after collission
  minSaturation: 1, // min saturation of ball
  minLightness: 10, // min lightness of ball
  radiusVariance: 1, // variance in ball radius
  velocityVariance: 100, // variance in ball velocity
  speed: 1, // relative speed of entire animation
};

const createComponent = ({self, $, reaction, settings, state}) => ({

  emitter: { active: false, x: 0, y: 0 },
  render: { lastTime: 0, fps: 0 },

  startAnimation() {
    self.render.lastTime = performance.now() * 0.001;

    // this is the main render loop, it does not need to call itself
    // as the reactivity handles rerendering
    reaction(() => {
      state.balls.get(); // reactive source
      requestAnimationFrame(self.animate);
    });
  },

  getCanvas() {
    return $('canvas').get(0);
  },

  animate(currentTime) {
    currentTime *= 0.001;
    const deltaTime = currentTime - self.render.lastTime;
    self.render.lastTime = currentTime;

    let fps = 1 / deltaTime;
    if(fps !== Infinity) {
      self.render.fps = 1 / deltaTime;
    }

    if (self.emitter.active) {
      self.emitBalls();
    }

    self.updateBalls(deltaTime);
    self.draw();

  },

  emitBalls() {
    const newBalls = [];
    for (let i = 0; i < settings.emitRate; i++) {
      newBalls.push(self.createBall({
        x: self.emitter.x,
        y: self.emitter.y
      }));
    }
    const currentBalls = state.balls.peek();
    state.balls.set([...currentBalls, ...newBalls]);
  },

  createBall({x, y}) {
    const randomInRange = (average, variance) => {
      const value = average + (Math.random() - 0.5) * 2 * variance;
      return (value < 1) ? 1 : value;
    };
    const angle = Math.random() * 2 * Math.PI;
    const speed = randomInRange(settings.velocity, settings.velocityVariance);
    return {
      _id: generateID(),
      x,
      y,
      radius: randomInRange(settings.radius, settings.radiusVariance),
      color: self.getRandomColor(),
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
    deltaTime = deltaTime * settings.speed;

    const canvas = self.getCanvas();
    const currentBalls = state.balls.peek();
    const updatedBalls = currentBalls.map(ball =>
      self.pipe(ball,
        b => self.decayColor(b, deltaTime),
        b => self.updatePosition(b, deltaTime),
        b => self.checkWalls(b, canvas)
      )
    );

    self.checkCollisions(updatedBalls);
    state.balls.set(updatedBalls);
  },

  pipe(initialValue, ...fns) {
    return fns.reduce((value, fn) => fn(value), initialValue);
  },

  decayColor(ball, deltaTime) {
    return {
      ...ball,
      saturation: Math.max(
        settings.minSaturation,
        ball.saturation - settings.saturationDecay * deltaTime
      ),
      color: {
        ...ball.color,
        l: Math.max(
          settings.minLightness,
          ball.color.l - settings.lightnessDecay * deltaTime
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

    // left/right
    if (x + radius > canvas.width || x - radius < 0) {
      vx = -vx;
      x = Math.max(radius, Math.min(canvas.width - radius, x));
    }
    // top/bottom wall
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
          self.handleCollision(ball1, ball2, dx, dy, distance);
        }
      });
    });
  },

  handleCollision(ball1, ball2, dx, dy, distance) {
    // Revive colors
    ball1.color = self.getRandomColor();
    ball2.color = self.getRandomColor();
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
    const canvas = self.getCanvas();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    each(state.balls.peek(), (ball) => {
      self.drawBall(ball);
    });

    self.drawFPS(ctx);
  },

  drawBall(ball) {
    const canvas = self.getCanvas();
    const ctx = canvas.getContext('2d');
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fillStyle = `hsl(${ball.color.h}, ${ball.saturation}%, ${ball.color.l}%)`;
    ctx.fill();
    ctx.closePath();
  },

  drawFPS(ctx) {
    const canvas = self.getCanvas();
    ctx.fillStyle = 'white';
    ctx.font = '12px Arial';
    ctx.textAlign = 'right';
    let fps = Math.round(self.render.fps);
    if(fps < 100) {
      fps = `0${fps}`;
    }
    ctx.fillText(`FPS: ${fps}`, canvas.width - 10, canvas.height - 10);
  },

});

const onRendered = ({state, data, settings, self}) => {
  const canvas = self.getCanvas();
  const initialBalls = [];
  for (let i = 0; i < settings.count; i++) {
    initialBalls.push(self.createBall({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height
    }));
  }
  state.balls.set(initialBalls);

  self.draw();
  self.startAnimation();
};

const events = {
  'pointerdown canvas'({self, event}) {
    const canvas = self.getCanvas();
    const rect = canvas.getBoundingClientRect();
    self.emitter.x = (event.clientX - rect.left);
    self.emitter.y = (event.clientY - rect.top);
    self.emitter.active = true;
  },
  'pointermove canvas'({self, event}) {
    if (self.emitter.active) {
      const canvas = self.getCanvas();
      const rect = canvas.getBoundingClientRect();
      self.emitter.x = (event.clientX - rect.left);
      self.emitter.y = (event.clientY - rect.top);
    }
  },
  'pointerup, pointerleave canvas'({self}) {
    self.emitter.active = false;
  },
  'change input.speed'({value, settings}) {
    settings.speed = value / 100;
  }
};

export const BallSimulation = defineComponent({
  tagName: 'ball-simulation',
  template,
  css,
  createComponent,
  onRendered,
  events,
  state,
  settings
});
