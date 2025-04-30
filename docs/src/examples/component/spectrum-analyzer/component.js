import { defineComponent, getText } from '@semantic-ui/component';
import { oklchToRgb, memoize } from '@semantic-ui/utils';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  colors: ['blue', 'purple', 'green', 'red', 'orange', 'teal'],
  fftSize: 2048,
};

const defaultState = {
  isRunning: false,
  colorIndex: 0,
};

const createComponent = ({ self, state, $, el, settings }) => ({

  async startAnalyzer() {
    if (!self.audioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = settings.fftSize;
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const source = audioContext.createMediaStreamSource(stream);
        source.connect(analyser);

        self.audioContext = audioContext;
        self.analyser = analyser;
        self.dataArray = new Uint8Array(analyser.frequencyBinCount);

        state.isRunning.set(true);
        self.draw();
      }
      catch (err) {
        console.error('Error accessing microphone:', err);
      }
    }
    else {
      state.isRunning.set(true);
      self.draw();
    }
  },

  stopAnalyzer() {
    state.isRunning.set(false);
    if (self.animationFrame) {
      cancelAnimationFrame(self.animationFrame);
    }
  },

  draw() {
    if (!state.isRunning.get()) {
      return;
    }

    self.animationFrame = requestAnimationFrame(() => self.draw());
    self.analyser.getByteFrequencyData(self.dataArray);

    const canvas = $('canvas').el();
    const context = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const binCount = self.analyser.frequencyBinCount;
    if (!binCount) return;
    const barWidth = width / binCount;

    context.clearRect(0, 0, width, height);

    const { r, g, b } = self.getColor(state.colorIndex.get());

    self.dataArray.forEach((value, i) => {
      const x = i * barWidth;
      const barHeight = (value / 255) * height;
      if (!Number.isFinite(barHeight) || barHeight < 0) {
        return;
      }
      const y = height - barHeight;

      const gradient = context.createLinearGradient(x, y, x, height);
      gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`);
      gradient.addColorStop(0.1, `rgba(${r}, ${g}, ${b}, 1)`);
      gradient.addColorStop(0.2, `rgba(${r}, ${g}, ${b}, 0)`);
      gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.2)`);
      context.fillStyle = gradient;

      //prevent negative bar width if calculated width is < 0.
      const effectiveWidth = Math.max(1, barWidth);
      context.fillRect(x, y, effectiveWidth, barHeight);
    });
  },

  // get the computed color value from the current theme variable
  // we only need to look this up once so lets memoize
  getColor: memoize((index) => {
    const colorName = settings.colors[index];
    const colorVar = `--${colorName}`;
    const okLCHColor = $(el).computedStyle(colorVar);
    const rgb = oklchToRgb(okLCHColor);
    return rgb;
  }),

  changeColor() {
    const nextIndex = (state.colorIndex.get() + 1) % settings.colors.length;
    state.colorIndex.set(nextIndex);
  },

});

const events = {
  'click .start'({ self, state }) {
    if (state.isRunning.get()) {
      self.stopAnalyzer();
    }
    else {
      self.startAnalyzer();
    }
  },
  'click .change'({ self }) {
    self.changeColor();
  },
};

defineComponent({
  tagName: 'spectrum-analyzer',
  template,
  css,
  events,
  defaultState,
  defaultSettings,
  createComponent,
});
