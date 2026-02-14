import { defineComponent } from '@semantic-ui/component';
import css from './AILoader.css?raw';
import template from './AILoader.html?raw';

const NUM = 12;
const FRAME_DELAYS = [30, 110, 90, 70, 100, 80, 110, 70, 100, 90];

const defaultSettings = {
  size: 24,
  color: '#EAB59F',
  active: true,
};

const createComponent = ({ self, el, $, settings }) => ({
  ctx: null,
  baseColor: null,
  canvasSize: 0,
  rafId: null,
  frameIdx: 0,
  lengths: null,
  targetLengths: null,
  lastFrameTime: -9999,
  tendrilAngles: null,
  tendrilWidths: null,
  keyframes: null,

  initialize() {
    self.createTendrils();
    self.createKeyframes();
  },

  createTendrils() {
    self.tendrilAngles = Array.from({ length: NUM }, (_, i) => (i / NUM) * Math.PI * 2 - Math.PI / 2);
    self.tendrilWidths = Array.from({ length: NUM }, (_, i) => 0.6 + 0.8 * (0.5 + 0.5 * Math.sin(i * 2.3 + 0.7)));
  },

  createKeyframes() {
    self.keyframes = self.generateKeyframes();
  },

  generateKeyframes() {
    const frames = [];
    for (let f = 0; f < 10; f++) {
      const row = [];
      const pulseCenter = (f / 10) * NUM;
      for (let i = 0; i < NUM; i++) {
        let dist = Math.abs(i - pulseCenter);
        dist = Math.min(dist, NUM - dist);
        let extension;
        if (dist < 0.8) { extension = 1.0; }
        else if (dist < 1.5) { extension = 0.7 - (dist - 0.8) * 0.6; }
        else if (dist < 2.2) { extension = 0.28 - (dist - 1.5) * 0.3; }
        else { extension = 0; }
        const base = 0.75 + Math.sin(i * 3.1 + f * 0.7) * 0.02;
        const len = base + extension * 0.22;
        let dist2 = Math.abs(i - ((pulseCenter + 5.5) % NUM));
        dist2 = Math.min(dist2, NUM - dist2);
        const secondary = dist2 < 1.2 ? (1.2 - dist2) / 1.2 * 0.08 : 0;
        row.push(Math.min(1.0, len + secondary));
      }
      frames.push(row);
    }
    return frames;
  },

  parseColor(str) {
    const ctx = document.createElement('canvas').getContext('2d');
    ctx.fillStyle = str;
    const hex = ctx.fillStyle;
    return {
      r: parseInt(hex.slice(1, 3), 16),
      g: parseInt(hex.slice(3, 5), 16),
      b: parseInt(hex.slice(5, 7), 16),
    };
  },

  setupCanvas() {
    const canvas = $('canvas').get(0);
    if (!canvas) { return; }

    const size = Number(settings.size) || 16;
    const dpr = Math.min(window.devicePixelRatio || 1, 3);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';

    self.ctx = canvas.getContext('2d');
    self.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    self.canvasSize = size;

    const colorStr = settings.color || getComputedStyle(el).color;
    self.baseColor = self.parseColor(colorStr);

    self.frameIdx = Math.floor(Math.random() * 10);
    self.lengths = self.keyframes[self.frameIdx].slice();
    self.targetLengths = self.lengths.slice();
  },

  drawTendril(w, len) {
    const hw = w / 2;
    self.ctx.beginPath();
    self.ctx.arc(0, 0, hw, 0, Math.PI);
    self.ctx.lineTo(-hw, -(len - hw));
    self.ctx.arc(0, -(len - hw), hw, Math.PI, 0);
    self.ctx.lineTo(hw, 0);
    self.ctx.closePath();
  },

  render(now) {
    const delay = FRAME_DELAYS[self.frameIdx];
    if (now - self.lastFrameTime > delay) {
      self.frameIdx = (self.frameIdx + 1) % 10;
      self.targetLengths = self.keyframes[self.frameIdx].slice();
      self.lastFrameTime = now;
    }

    for (let i = 0; i < NUM; i++) {
      self.lengths[i] += (self.targetLengths[i] - self.lengths[i]) * 0.85;
    }

    const { ctx, canvasSize, baseColor, tendrilAngles, tendrilWidths } = self;
    const cx = canvasSize / 2;
    const cy = canvasSize / 2;
    const maxLen = canvasSize * 0.32;
    const tendrilW = canvasSize * 0.044;

    ctx.clearRect(0, 0, canvasSize, canvasSize);
    for (let i = 0; i < NUM; i++) {
      const lenNorm = self.lengths[i];
      const len = maxLen * lenNorm;
      const w = tendrilW * tendrilWidths[i];

      const bright = (lenNorm - 0.7) / 0.3;
      const r = Math.min(255, baseColor.r + bright * 15 | 0);
      const g = Math.min(255, baseColor.g + bright * 12 | 0);
      const b = Math.min(255, baseColor.b + bright * 10 | 0);

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(tendrilAngles[i]);
      self.drawTendril(w, len);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fill();
      ctx.restore();
    }

    self.rafId = requestAnimationFrame((t) => self.render(t));
  },

  startLoop() {
    if (self.rafId) { return; }
    self.rafId = requestAnimationFrame((t) => self.render(t));
  },

  stopLoop() {
    if (self.rafId) {
      cancelAnimationFrame(self.rafId);
      self.rafId = null;
    }
  },
});

const onRendered = ({ self, settings, reaction, isServer }) => {
  if (isServer) { return; }
  self.setupCanvas();
  reaction(() => {
    if (settings.active) {
      self.startLoop();
    }
    else {
      debugger;
      self.stopLoop();
    }
  });
};

const onDestroyed = ({ self }) => {
  self.stopLoop();
};

export const AILoader = defineComponent({
  tagName: 'ai-loader',
  template,
  css,
  defaultSettings,
  createComponent,
  onRendered,
  onDestroyed,
});
