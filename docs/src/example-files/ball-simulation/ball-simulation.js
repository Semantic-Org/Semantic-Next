import { createComponent, getText } from '@semantic-ui/component';
import { ReactiveVar } from '@semantic-ui/reactivity';
import { generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const createInstance = ({tpl, $, onCreated}) => ({
  balls: [],
  clock: new ReactiveVar(0),
  frameDuration: 1000 / 60, // 60 FPS

  getCanvas() {
    return $('canvas').get(0);
  },

  createBall(event) {
    const canvas = tpl.getCanvas();
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const radius = Math.random() * 20 + 10;
    const color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
    const ball = {
      _id: generateID(),
      x,
      y,
      radius,
      color,
      vx: Math.random() * 400 - 2,
      vy: Math.random() * 400 - 2
    };
    tpl.balls.push(ball);
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

  updateBall(ball, index, delta) {
    const canvas = tpl.getCanvas();
    const newX = ball.x + ball.vx * delta;
    const newY = ball.y + ball.vy * delta;

    // Check for collision with walls
    if (newX + ball.radius > canvas.width || newX - ball.radius < 0) {
      ball.vx = -ball.vx;
    }
    if (newY + ball.radius > canvas.height || newY - ball.radius < 0) {
      ball.vy = -ball.vy;
    }

    // Update ball position
    ball.x = newX;
    ball.y = newY;

    // Check for collision with other balls
    for (let i = index + 1; i < tpl.balls.length; i++) {
      const otherBall = tpl.balls[i];
      const dx = otherBall.x - ball.x;
      const dy = otherBall.y - ball.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < ball.radius + otherBall.radius) {
        // Calculate collision normal
        const normalX = dx / distance;
        const normalY = dy / distance;

        // Calculate relative velocity
        const relVelX = ball.vx - otherBall.vx;
        const relVelY = ball.vy - otherBall.vy;

        // Calculate dot product of relative velocity and collision normal
        const dotProduct = relVelX * normalX + relVelY * normalY;

        // Calculate collision impulse
        const impulse = 2 * dotProduct / (ball.radius + otherBall.radius);

        // Update ball velocities
        ball.vx -= impulse * normalX * otherBall.radius;
        ball.vy -= impulse * normalY * otherBall.radius;
        otherBall.vx += impulse * normalX * ball.radius;
        otherBall.vy += impulse * normalY * ball.radius;
      }
    }

    tpl.balls[index] = ball;
  },

  animate(timestamp) {
    if (!tpl.lastTimestamp) {
      tpl.lastTimestamp = timestamp;
    }

    const delta = timestamp - tpl.lastTimestamp;

    if (delta >= tpl.frameDuration) {
      const canvas = tpl.getCanvas();
      const ctx = canvas.getContext(`2d`);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      tpl.balls.forEach((ball, index) => {
        tpl.drawBall(ball);
        tpl.updateBall(ball, index, delta / 1000); // Convert delta to seconds
      });

      tpl.lastTimestamp = timestamp;
    }

    requestAnimationFrame(tpl.animate);
  }

});

const events = {
  'click canvas'({tpl, event}) {
    tpl.createBall(event);
  }
};

const onRendered = ({tpl}) => {
  requestAnimationFrame(tpl.animate);
};

createComponent({
  tagName: 'ball-simulation',
  template,
  css,
  createInstance,
  onRendered,
  events,
});
