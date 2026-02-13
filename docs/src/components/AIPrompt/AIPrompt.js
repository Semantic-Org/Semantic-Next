import { defineComponent } from '@semantic-ui/component';
import { get } from '@semantic-ui/utils';

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

  maybeSubmitDisabled() {
    return state.hasPrompt.get()
      ? ''
      : 'disabled';
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

  typeDemoText() {
    //
  },

  runDemoStep() {
  },

  stopDemo() {
    //
  },

  async streamAPI(method) {
    const api = {
      token: '/api/token',
      generate: '/api/generate',
    };
    const url = get(api, method);
    const res = await fetch(url, {
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

  wait(ms) {
  },

  submit() {
  },
  // rest
});

const events = {
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
