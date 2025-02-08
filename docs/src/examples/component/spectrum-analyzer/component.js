import { defineComponent, getText } from '@semantic-ui/component';

const css = await getText('./component.css');
const template = await getText('./component.html');

const defaultSettings = {
  colors: ['blue', 'purple', 'green', 'red', 'orange', 'teal']
};

const defaultState = {
  isRunning: false,
  colorIndex: 0
};

const createComponent = ({ self, state, $, el, settings }) => ({

  getColor() {
    return settings.colors[state.colorIndex.value];
  },

  async startAnalyzer() {
    if (!self.audioContext) {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
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
    const barWidth = width / self.analyser.frequencyBinCount;

    context.clearRect(0, 0, width, height);

    // Get the computed color value from the current theme variable
    const colorVar = `--${self.getColor()}`;
    const okLCHColor = $(el).computedStyle(colorVar);
    const rgb = self.convertToRGB(okLCHColor);

    self.dataArray.forEach((value, i) => {
      const x = i * barWidth;
      const barHeight = (value / 255) * height;
      const y = height - barHeight;

      // Create gradient for each bar using computed color and proper alpha
      const gradient = context.createLinearGradient(x, y, x, height);

      // Get RGB components and create more vibrant gradient
      if (rgb) {
        const {r, g, b} = rgb;
        gradient.addColorStop(0, `rgb(${r}, ${g}, ${b})`); // Full color at top
        gradient.addColorStop(0.7, `rgba(${r}, ${g}, ${b}, 0.5)`); // Maintain more color intensity
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0.1)`); // Fade out at bottom
      }

      context.fillStyle = gradient;
      context.fillRect(x, y, barWidth - 1, barHeight);
    });
  },

  changeColor() {
    const nextIndex = (state.colorIndex.get() + 1) % settings.colors.length;
    state.colorIndex.set(nextIndex);
  },

  // convert oklch to rgb for canvas since canvas does not support
  convertToRGB(str) {
    const m = str.match(/oklch\(\s*([\d.]+)\s+([\d.]+)\s+([\d.]+)\s*\)/i)
    if (!m) return null
    const [ , L, C, h ] = m.map(Number),
          rad = h * Math.PI / 180,
          a = Math.cos(rad) * C,
          b = Math.sin(rad) * C,
          L_ = L + 0.3963377774 * a + 0.2158037573 * b,
          M_ = L - 0.1055613458 * a - 0.0638541728 * b,
          S_ = L - 0.0894841775 * a - 1.2914855480 * b,
          l = L_ * L_ * L_,
          m_ = M_ * M_ * M_,
          s = S_ * S_ * S_,
          rLin = 4.0767416621 * l - 3.3077115913 * m_ + 0.2309699292 * s,
          gLin = -1.2684380046 * l + 2.6097574011 * m_ - 0.3413193965 * s,
          bLin = -0.0041960863 * l - 0.7034186147 * m_ + 1.7076147010 * s,
          // Clamp values to [0,1] to avoid negatives (out‐of‐gamut)
          clamp = x => Math.max(0, Math.min(x, 1)),
          gamma = c => c <= 0.0031308 ? 12.92 * c : 1.055 * Math.pow(c, 1/2.4) - 0.055
    return {
      r: Math.round(gamma(clamp(rLin)) * 255),
      g: Math.round(gamma(clamp(gLin)) * 255),
      b: Math.round(gamma(clamp(bLin)) * 255)
    }
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
