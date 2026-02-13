import { formatCode, ready as highlighterReady } from '@javascript/client-highlight.js';
import { defineComponent } from '@semantic-ui/component';
import { getJSON } from '@semantic-ui/utils';

import { AILoader } from '@components/AILoader/AILoader.js';
import { UIButton } from '@semantic-ui/core';

import css from './AIPrompt.css?raw';
import template from './AIPrompt.html?raw';

const defaultSettings = {
  demoHint: 'Click to try it yourself',
  liveHint: 'Enter your prompt below',
  placeholder: 'Describe a button...',
  maxLength: 150,
  steps: [],
  primitive: 'button',
};

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

let resolveWait = null;

const defaultState = {
  demoMode: false,
  submitted: false,
  hasPrompt: false,
  hasResults: false,
  isThinking: false,
  cotVisible: false,
  cotText: '',
  previewHTML: '',
  codeHTML: '',
  note: '',
  token: null,
};

const createComponent = ({ self, $, settings, state }) => ({
  apiBase: 'https://ai.semantic-ui.com',
  syntax: 'succinct',
  streaming: false,
  demoAborted: false,
  currentHTML: '',
  promptHistory: [],
  completedSteps: 0,

  currentHint() {
    return state.demoMode.get() ? settings.demoHint : settings.liveHint;
  },

  hintClass() {
    return { live: !state.demoMode.get() };
  },

  barClass() {
    return { submitted: state.submitted.get() };
  },

  cotClass() {
    return { visible: state.cotVisible.get() };
  },

  resultsClass() {
    return { visible: state.hasResults.get() };
  },

  noteClass() {
    return { visible: !!state.note.get() };
  },

  cannotSubmit() {
    return !state.hasPrompt.get();
  },

  isLive() {
    return !state.demoMode.get();
  },

  async typeText(text) {
    const input = $('.input').el();
    input.value = '';
    for (const char of text) {
      if (self.isLive()) { return; }
      input.value += char;
      await wait(40 + Math.random() * 30);
    }
  },

  async runDemoStep(step) {
    if (self.isLive()) { return; }
    state.submitted.set(false);
    $('.input').el().value = '';

    await self.typeText(step.prompt);
    if (self.isLive()) { return; }

    await wait(400);
    if (self.isLive()) { return; }

    state.submitted.set(true);
    state.isThinking.set(true);
    state.cotVisible.set(true);
    state.cotText.set(step.cot);

    await wait(800 + Math.random() * 400);
    if (self.isLive()) { return; }

    state.isThinking.set(false);
    state.cotVisible.set(false);
    state.hasResults.set(true);
    state.previewHTML.set(step.html);
    state.codeHTML.set(formatCode(step.code));
    self.completedSteps++;
    self.currentHTML = step.html;
  },

  clearPrompt() {
    $('.input').val('');
  },

  async runDemo() {
    const steps = settings.steps;
    await wait(1500);
    for (let i = 0; i < steps.length; i++) {
      if (self.isLive()) { break; }
      await self.runDemoStep(steps[i]);
      if (self.isLive()) { break; }
      if (i < steps.length - 1) {
        await wait(1200);
        if (self.isLive()) { break; }
        state.cotVisible.set(false);
        state.cotText.set('');
        self.clearPrompt();
        await wait(600);
        if (self.isLive()) { break; }
      }
    }
    self.goLive();
  },

  stopDemo() {
    if (resolveWait) {
      resolveWait();
      resolveWait = null;
    }
  },

  goLive() {
    const steps = settings.steps;
    self.promptHistory = steps.slice(0, self.completedSteps).map(s => ({
      prompt: s.prompt,
      html: s.html,
    }));
    self.clearPrompt();
    state.demoMode.set(false);
  },

  async submit() {
    const input = $('.input').el();
    const prompt = input.value.trim();
    if (!prompt || self.streaming) { return; }

    self.streaming = true;
    state.submitted.set(true);
    state.isThinking.set(true);
    state.cotVisible.set(true);
    state.cotText.set('Thinking...');
    state.note.set('');
    input.value = '';
    input.disabled = true;
    state.hasPrompt.set(false);

    let htmlAccum = '';
    let isValidHTML = true;

    try {
      let token = self.token;
      if (!token) {
        const response = await getJSON(`${self.apiBase}/api/token`, { method: 'POST' });
        if (response.error) {
          throw new Error(response.error);
        }
        self.token = response.token;
        token = response.token;
      }

      const res = await fetch(`${self.apiBase}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          token,
          prompt,
          currentHTML: self.currentHTML,
          promptHistory: self.promptHistory,
          component: settings.primitive,
          syntax: self.syntax,
        }),
      });

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Request failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) { break; }

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (!line.startsWith('data: ')) { continue; }
          const data = JSON.parse(line.slice(6));

          if (data.type === 'cot') {
            state.cotText.set(data.text);
          }
          else if (data.type === 'note') {
            state.note.set(data.text);
          }
          else if (data.type === 'html') {
            htmlAccum += data.text;
            state.hasResults.set(true);
            state.codeHTML.set(formatCode(htmlAccum));
          }
          else if (data.type === 'done') {
            const trimmed = htmlAccum.trim();
            if (!trimmed.includes('<')) {
              // API returned plain text, not HTML — show as note instead
              state.codeHTML.set('');
              state.previewHTML.set('');
              state.note.set(trimmed || 'No valid HTML was returned');
              break;
            }
            self.currentHTML = trimmed;
            state.previewHTML.set(self.currentHTML);
            state.codeHTML.set(formatCode(self.currentHTML));
            self.promptHistory.push({ prompt, html: self.currentHTML });
            state.hasResults.set(true);
            state.isThinking.set(false);
          }
          else if (data.type === 'error') {
            throw new Error(data.text);
          }
        }
      }
    }
    catch (err) {
      state.cotText.set('Error: ' + err.message);
      state.isThinking.set(false);
      setTimeout(() => state.cotVisible.set(false), 3000);
    }
    finally {
      self.streaming = false;
      input.disabled = false;
      state.submitted.set(false);
      input.focus();
    }
  },
});

const onRendered = async ({ isServer, self, settings, state }) => {
  if (isServer) {
    return;
  }
  await highlighterReady;
  console.log(settings.steps);
  if (settings.steps.length) {
    state.demoMode.set(true);
    self.runDemo();
  }
};

const onDestroyed = ({ self }) => {
  self.stopDemo();
};

const events = {
  'input .input'({ state, value }) {
    state.hasPrompt.set(!!value);
  },
  'focus .input'({ self, state }) {
    if (!state.demoMode.get()) { return; }
    self.stopDemo();
    self.goLive();
  },
  'click .submit'({ self }) {
    self.submit();
  },
};

const keys = {
  'enter'({ self, $, el }) {
    if (!$(document.activeElement).is(el)) { return; }
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
