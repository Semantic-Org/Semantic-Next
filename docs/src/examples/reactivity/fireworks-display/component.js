// click ellipsus to show imports /* playground-fold */
// click ellipsus to show imports
// click canvas to continuously launch rockets /* playground-fold */
import { defineComponent, getText } from '@semantic-ui/component';
import { generateID } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');
/* playground-fold-end */

/* playground-fold-end */

const defaultState = {
  particles: [],
  emitter: {
    active: false,
    x: 0,
    y: 0,
    lastEmission: 0,
  },
};

const defaultSettings = {
  rocketSpeed: 300,        // upward speed in pixels/second
  rocketTimer: 1.5,        // base seconds until explosion
  rocketTimerVariance: 0.5,  // variance in explosion timer (seconds)
  sparkCount: 30,          // sparks per explosion
  sparkSpeed: 200,         // base spark speed
  sparkSpeedVariance: 50,
  gravity: 200,            // gravity acceleration in pixels/second^2
  fadeRate: 0.8,           // alpha fade per second
  minAlpha: 0,             // minimum alpha value before removal
  emitRate: 10,             // rockets per second when pointer is down,
  maxLaunchHeight: 0.5     // max height you can launch a rocket from
};

const createComponent = ({ self, $, reaction, settings, state }) => ({

  render: { lastTime: 0, fps: 0 },

  startAnimation() {
    self.render.lastTime = performance.now() * 0.001;
    reaction(() => {
      state.emitter.get();
      state.particles.get();
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

    const emitter = state.emitter.get();
    if (emitter.active) {
      self.emitRocket(deltaTime);
    }

    self.updateParticles(deltaTime);
    self.draw();
  },

  emitRocket(deltaTime) {
    let emitter = state.emitter.get();
    emitter.lastEmission += deltaTime;
    if (emitter.lastEmission >= 1 / settings.emitRate) {
      const canvas = self.getCanvas();
      // Adjust launchY so rockets start near the bottom of the canvas
      const launchX = emitter.x;
      const launchY = Math.max(emitter.y, canvas.height * settings.maxLaunchHeight);
      const rocket = self.createRocket({ x: launchX, y: launchY });
      const currentParticles = state.particles.peek();
      state.particles.set([...currentParticles, rocket]);
      emitter.lastEmission = 0;
    }
    state.emitter.set(emitter);
  },

  updateParticles(deltaTime) {
    const canvas = self.getCanvas();
    const currentParticles = state.particles.peek();
    let newParticles = [];

    currentParticles.forEach(particle => {
      if (particle.type === 'rocket') {
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.timer -= deltaTime;
        if (particle.timer <= 0) {
          const sparks = self.explodeRocket(particle);
          newParticles.push(...sparks);
        }
        else if (particle.y > 0) {
          newParticles.push(particle);
        }
      }
      else if (particle.type === 'spark') {
        particle.vy += settings.gravity * deltaTime;
        particle.x += particle.vx * deltaTime;
        particle.y += particle.vy * deltaTime;
        particle.alpha -= settings.fadeRate * deltaTime;
        if (
          particle.alpha > settings.minAlpha &&
          particle.x >= 0 &&
          particle.x <= canvas.width &&
          particle.y >= 0 &&
          particle.y <= canvas.height
        ) {
          newParticles.push(particle);
        }
      }
    });
    state.particles.set(newParticles);
  },

  draw() {
    const canvas = self.getCanvas();
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    state.particles.peek().forEach(particle => {
      if (particle.type === 'rocket') {
        self.drawRocket(particle, ctx);
      }
      else if (particle.type === 'spark') {
        self.drawSpark(particle, ctx);
      }
    });
  },

  drawRocket(rocket, ctx) {
    ctx.save();
    ctx.fillStyle = `hsl(${rocket.color.h}, ${rocket.color.s}%, ${rocket.color.l}%)`;
    ctx.beginPath();
    ctx.arc(rocket.x, rocket.y, 3, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  drawSpark(spark, ctx) {
    ctx.save();
    ctx.globalAlpha = spark.alpha;
    ctx.fillStyle = `hsl(${spark.color.h}, ${spark.color.s}%, ${spark.color.l}%)`;
    ctx.beginPath();
    ctx.arc(spark.x, spark.y, 2, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  },

  createRocket({ x, y }) {
    const randomInRange = (avg, variance) =>
      avg + (Math.random() - 0.5) * 2 * variance;
    return {
      _id: generateID(),
      type: 'rocket',
      x,
      y,
      vx: randomInRange(0, 30), // slight horizontal variation
      vy: -settings.rocketSpeed,
      // Randomize the timer so that rockets explode at different heights
      timer: randomInRange(settings.rocketTimer, settings.rocketTimerVariance),
      color: self.getRandomColor(),
    };
  },

  explodeRocket(rocket) {
    const sparks = [];
    for (let i = 0; i < settings.sparkCount; i++) {
      const angle = Math.random() * 2 * Math.PI;
      const speed =
        settings.sparkSpeed +
        (Math.random() - 0.5) * 2 * settings.sparkSpeedVariance;
      sparks.push({
        _id: generateID(),
        type: 'spark',
        x: rocket.x,
        y: rocket.y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        alpha: 1,
        color: rocket.color,
      });
    }
    return sparks;
  },

  getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    const saturation = 80;
    const lightness = 50 + Math.random() * 10;
    return { h: hue, s: saturation, l: lightness };
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

const onRendered = ({ self, state, settings }) => {
  self.startAnimation();
};

const events = {
  'pointerdown canvas'({ self, event, state, $ }) {
    let emitter = state.emitter.get();
    const pos = self.getPointerPosition(event);
    emitter.x = pos.x;
    emitter.y = pos.y;
    emitter.active = true;
    state.emitter.set(emitter);
  },
  'pointermove canvas'({ self, event, state, $ }) {
    let emitter = state.emitter.get();
    const pos = self.getPointerPosition(event);
    emitter.x = pos.x;
    emitter.y = pos.y;
    emitter.active = true;
    state.emitter.set(emitter);
  },
  'pointerup, mouseleave canvas'({ self, state }) {
    let emitter = state.emitter.get();
    emitter.active = false;
    state.emitter.set(emitter);
  },
  'touchstart, touchmove canvas'({event}) {
    // prevent highlight/scroll on mobile
    event.preventDefault();
  },
};

export const FireworksDisplay = defineComponent({
  tagName: 'fireworks-display',
  template,
  css,
  createComponent,
  onRendered,
  events,
  defaultState,
  defaultSettings,
});
