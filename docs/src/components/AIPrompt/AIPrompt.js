import { defineComponent } from '@semantic-ui/component';
import { each, get } from '@semantic-ui/utils';

// handle client side highlighting
import '@javascript/client-highlight.js';

// load wc
import { AILoader } from '@components/AILoader/AILoader.js';
import { UIButton } from '@semantic-ui/core';

import css from './AIPrompt.css?raw';
import template from './AIPrompt.html?raw';

const defaultSettings = {
  demoHint: 'Click to try it yourself',
  hint: 'Enter your prompt below',
  demoSteps: [],
};

const defaultState = {
  demoMode: false,
  hasPrompt: false,
  hasResults: false,
};

// wait might get moved to utils so should be generic
const wait = (ms) =>
  new Promise(resolve => {
    const id = setTimeout(() => {
      resolveWait = null;
      resolve();
    }, ms);
    resolveWait = () => {
      clearTimeout(id);
      resolve();
    };
  });

const createComponent = ({ $, settings, state, reaction }) => ({
  apiBase: 'https://ai.semantic-ui.com',

  // last result returned from api
  lastResult: null,

  initialize() {
    // allow demo mode
    if (settings.demoSteps.length) {
      state.demoMode.set(true);
    }
  },

  calculateDemo() {
    reaction(() => {
      const demoMode = state.demoMode.get();
      if (!demoMode) {
        self.stopDemo();
        self.enablePrompt();
      }
    });
  },

  promptClass() {
    return {
      live: state.demoMode.get() === false,
    };
  },

  canSubmit() {
    return state.hasPrompt.get();
  },

  maybeResultsVisible() {
    return state.hasResults.get();
  },

  clearPrompt() {
    return $('.prompt input').val('');
  },

  enablePrompt() {
    // allow user input
  },

  async typeDemoText() {
    const prompt = $('.prompt input').el();
    //
    prompt.value = '';
    for (const char of text) {
      if (demoAborted) { return; }
      promptInput.value += char;
      await wait(40 + Math.random() * 30);
    }
  },

  runDemoStep() {
  },

  stopDemo() {
    // resolve wait etc
  },

  async streamAPI(method) {
    const api = {
      token: '/api/token',
      generate: '/api/generate',
    };
    const url = get(api, method);
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        token,
        prompt,
        currentHTML,
        promptHistory,
        component: 'button',
        syntax: 'succinct',
      }),
    });
    // rest
  },

  submit() {
  },
  // rest
});

const events = {
  'mousedown .prompt input'({ $, state, value }) {
    if (!value || state.demoMode.get()) {
      return;
    }
    // rest
  },
  'input .prompt input'({ $, state, value }) {
    // rest
  },
  'mouseup .prompt input'({ $, state, value }) {
    // rest
  },
  'focus .prompt input'({ state }) {
    state.demoMode.set(false);
  },
};

const keys = {
  'enter'({ self }) {
    if (!$(document.activeElement).is('.prompt input')) {
      return;
    }
    self.submit();
  },
};

export const AIPrompt = defineComponent({
  tagName: 'ai-prompt',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  onRendered,
  onDestroyed,
  events,
  keys,
});
