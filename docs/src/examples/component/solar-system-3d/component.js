import { defineComponent, getText } from '@semantic-ui/component';
import { vertSrc, fragSrc, compile } from './webgl.js';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  speed: 0.5,
  showOrbits: true,
  coolSun: false,
  visible: [1, 1, 1, 1, 1, 1, 1, 1],
};

const defaultState = {
  frame: 0,
};

const events = {
  'global resize window'({ self }) {
    self.resize();
  },
};

const createComponent = ({ self, $, settings, state, reaction }) => ({
  gl: null,
  prog: null,
  loc: {},
  startTime: 0,

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
      visible: Array.from({ length: 8 }, (_, i) =>
        gl.getUniformLocation(prog, `u_visible[${i}]`)
      ),
    };

    self.resize();
    self.startTime = performance.now();
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

    const elapsed = (performance.now() - self.startTime) / 1000;
    const loc = self.loc;

    gl.uniform1f(loc.time, elapsed * settings.speed);
    gl.uniform2f(loc.resolution, gl.canvas.width, gl.canvas.height);
    gl.uniform1f(loc.showOrbits, settings.showOrbits ? 1.0 : 0.0);
    gl.uniform1f(loc.coolSun, settings.coolSun ? 1.0 : 0.0);

    const vis = settings.visible || [1, 1, 1, 1, 1, 1, 1, 1];
    for (let i = 0; i < 8; i++) {
      gl.uniform1f(loc.visible[i], vis[i] ?? 1.0);
    }

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
  events,
  defaultSettings,
  defaultState,
  onRendered,
});
