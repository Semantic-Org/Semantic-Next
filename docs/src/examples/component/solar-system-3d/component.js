import { defineComponent, getText } from '@semantic-ui/component';
import { vertSrc, fragSrc, compile } from './webgl.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

// Days elapsed from J2000 epoch (Jan 1 2000 12:00 UTC) to a given date
const J2000 = Date.UTC(2000, 0, 1, 12);
const msPerDay = 86400000;
const daysFromJ2000 = (date) => (date.getTime() - J2000) / msPerDay;

const defaultSettings = {
  speed: 0.5,
  daysPerSecond: 36.5,
  showOrbits: true,
  coolSun: false,
  date: null,
  visible: [1, 1, 1, 1, 1, 1, 1, 1],
};

const defaultState = {
  frame: 0,
  simDate: new Date(),
};

const keys = {
  'o'({ settings }) {
    settings.showOrbits = !settings.showOrbits;
  },
  's'({ settings }) {
    settings.coolSun = !settings.coolSun;
  },
  'space'({ settings }) {
    settings.speed = settings.speed ? 0 : 0.5;
  },
  'r'({ self }) {
    self.pointer = { x: 0, y: 0 };
    self.velocity = { x: 0, y: 0 };
  },
  '=, +'({ settings }) {
    settings.speed = Math.min(settings.speed * 1.2, 5);
  },
  '-, _'({ settings }) {
    settings.speed = Math.max(settings.speed / 1.2, 0.05);
  },
};

const events = {
  'global resize window'({ self }) {
    self.resize();
  },
  'pointerdown canvas'({ self, event, target }) {
    self.dragging = true;
    self.lastPointer = { x: event.clientX, y: event.clientY };
    target.setPointerCapture(event.pointerId);
  },
  'pointermove canvas'({ self, event }) {
    if (!self.dragging) return;
    const dx = event.clientX - self.lastPointer.x;
    const dy = event.clientY - self.lastPointer.y;
    self.velocity.x = dx * -0.005;
    self.velocity.y = dy * -0.003;
    self.pointer.x += self.velocity.x;
    self.pointer.y += self.velocity.y;
    self.pointer.y = Math.max(-0.5, Math.min(0.5, self.pointer.y));
    self.lastPointer = { x: event.clientX, y: event.clientY };
  },
  'pointerup canvas'({ self }) {
    self.dragging = false;
    self.lastPointer = null;
  },
};

const createComponent = ({ self, $, settings, state, reaction }) => ({
  gl: null,
  prog: null,
  loc: {},
  simDays: 0,
  lastFrame: 0,
  startTime: 0,
  pointer: { x: 0, y: 0 },
  velocity: { x: 0, y: 0 },
  dragging: false,
  lastPointer: null,

  initWebGL() {
    const canvas = $('canvas').el();
    const gl = canvas.getContext('webgl', {
      alpha: false,
      antialias: false,
      depth: false,
      preserveDrawingBuffer: false,
    });
    if (!gl) return;
    self.gl = gl;

    const vs = compile(gl, gl.VERTEX_SHADER, vertSrc);
    const fs = compile(gl, gl.FRAGMENT_SHADER, fragSrc);
    if (!vs || !fs) return;

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);
    gl.useProgram(prog);
    self.prog = prog;

    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1,-1, 1,-1, -1,1, 1,1]), gl.STATIC_DRAW);
    const aPos = gl.getAttribLocation(prog, 'a_pos');
    gl.enableVertexAttribArray(aPos);
    gl.vertexAttribPointer(aPos, 2, gl.FLOAT, false, 0, 0);

    self.loc = {
      time: gl.getUniformLocation(prog, 'u_time'),
      resolution: gl.getUniformLocation(prog, 'u_resolution'),
      showOrbits: gl.getUniformLocation(prog, 'u_showOrbits'),
      coolSun: gl.getUniformLocation(prog, 'u_coolSun'),
      wallTime: gl.getUniformLocation(prog, 'u_wallTime'),
      pointer: gl.getUniformLocation(prog, 'u_pointer'),
      visible: Array.from({ length: 8 }, (_, i) =>
        gl.getUniformLocation(prog, `u_visible[${i}]`)
      ),
    };

    self.resize();
    self.startTime = performance.now();
    self.lastFrame = self.startTime;
    // Start from the configured date or today, measured in days from J2000
    const startDate = settings.date || new Date();
    self.simDays = daysFromJ2000(startDate);
  },

  startAnimation() {
    reaction(() => {
      state.frame.get();
      requestAnimationFrame(self.render);
    });
  },

  resize() {
    const gl = self.gl;
    const canvas = gl.canvas;
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.ceil(rect.width * dpr);
    canvas.height = Math.ceil(rect.height * dpr);
    gl.viewport(0, 0, canvas.width, canvas.height);
  },

  render() {
    const gl = self.gl;
    if (!gl) return;

    const now = performance.now();
    const dt = (now - self.lastFrame) / 1000;
    self.lastFrame = now;
    self.simDays += dt * settings.daysPerSecond * settings.speed;

    const loc = self.loc;

    gl.uniform1f(loc.time, self.simDays);
    gl.uniform1f(loc.wallTime, (now - self.startTime) / 1000);
    state.simDate.set(new Date(J2000 + self.simDays * msPerDay));
    gl.uniform2f(loc.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(loc.showOrbits, settings.showOrbits ? 1.0 : 0.0);
    gl.uniform1f(loc.coolSun, settings.coolSun ? 1.0 : 0.0);

    const vis = settings.visible || [1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0; i < 8; i++) {
      gl.uniform1f(loc.visible[i], vis[i] ?? 1.0);
    }

    // Apply momentum decay when not dragging
    if (!self.dragging) {
      self.pointer.x += self.velocity.x;
      self.pointer.y += self.velocity.y;
      self.velocity.x *= 0.95;
      self.velocity.y *= 0.95;
      // Clamp elevation
      self.pointer.y = Math.max(-0.5, Math.min(0.5, self.pointer.y));
    }
    gl.uniform2f(loc.pointer, self.pointer.x, self.pointer.y);

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    state.frame.increment();
  },
});

const onRendered = ({ self, isClient }) => {
  if (!isClient) return;
  self.initWebGL();
  self.startAnimation();
};

export const SolarSystem3D = defineComponent({
  tagName: 'solar-system-3d',
  template,
  css,
  createComponent,
  keys,
  events,
  defaultSettings,
  defaultState,
  onRendered,
});
