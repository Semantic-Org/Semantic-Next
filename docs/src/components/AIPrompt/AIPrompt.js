import { formatCode, highlightCode, ready as highlighterReady } from '@helpers/highlight/client.js';
import { defineComponent } from '@semantic-ui/component';
import { getJSON, wait } from '@semantic-ui/utils';

// web components
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

const defaultState = {
  demoMode: false,
  submitted: false,
  hasPrompt: false,
  hasResults: false,

  isThinking: false,
  cotVisible: false,
  cotText: '',

  note: '',
  token: null,
  previewHTML: '',
  codeHTML: '',
};

const createComponent = ({ self, $, settings, state }) => ({
  apiBase: 'https://ai.semantic-ui.com',
  syntax: 'succinct',
  streaming: false,
  demoAborted: false,
  controller: null,
  currentHTML: '',
  promptHistory: [],
  completedSteps: 0,

  initialize() {
    if (settings.steps.length) {
      self.startDemo();
    }
  },

  getHint() {
    return state.demoMode.get() ? settings.demoHint : settings.liveHint;
  },

  promptClass: () => ({
    live: !state.demoMode.get(),
    results: state.hasResults.get(),
  }),

  barClass: () => ({
    submitted: state.submitted.get(),
  }),

  isLive() {
    return !state.demoMode.get();
  },

  focusPrompt() {
    $('.input').focus();
  },

  clearPrompt() {
    $('.input').val('');
  },

  startStreaming() {
    self.clearPrompt();
    self.streaming = true;
    self.results = '';
    state.submitted.set(true);
    state.note.clear();
  },

  endStreaming() {
    self.streaming = false;
    state.submitted.set(false);
    self.focusPrompt();
  },

  startThinking(text = 'Thinking...') {
    state.isThinking.set(true);
    state.cotVisible.set(true);
    state.cotText.set(text);
  },

  endThinking(text) {
    state.isThinking.set(false);
    if (text !== undefined) {
      state.cotText.set(text);
    }
  },

  getPrompt() {
    return $('.input').val();
  },

  setPrompt(val = '') {
    $('.input').val(val);
  },

  setNote(note) {
    state.note.set(note);
  },

  setCode(html, { isComplete = false, prompt } = {}) {
    // only allow html from server
    if (!self.isHTML(html)) {
      return;
    }

    state.hasResults.set(true);
    console.log('set code to', html);
    state.codeHTML.set(highlightCode(html));

    if (isComplete) {
      self.currentHTML = html;
      self.promptHistory.push({ prompt, html });
      console.log('set final code to', html);
      state.previewHTML.set(html);
      self.endThinking();
    }
  },

  clearCode() {
    state.codeHTML.clear();
    state.previewHTML.clear();
  },

  async submit() {
    const prompt = self.getPrompt();
    if (!prompt || self.streaming) {
      return;
    }

    // begin receiving streamed results
    self.startStreaming();

    // announce we're thinking even though no cot yet
    self.startThinking();

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
        if (done) {
          break;
        }

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
            self.setNote(data.text);
          }
          else if (data.type === 'html') {
            console.log(data);
            // bail early if the first thing returned isnt html
            // this happens if the ai doesnt do the right thing
            if (!self.results && !self.isHTML(data.text)) {
              isValidHTML = false;
            }
            self.results += data.text;
            if (isValidHTML) {
              self.setCode(self.results);
            }
          }
          else if (data.type === 'done') {
            const currentHTML = formatCode(self.results);
            if (!isValidHTML) {
              self.clearCode();
              self.setNote('No valid HTML was returned');
              break;
            }
            self.setCode(currentHTML, {
              isComplete: true,
              prompt,
            });
          }
          else if (data.type === 'error') {
            self.setNote(`Error: ${data.text}`);
            throw new Error(data.text);
          }
        }
      }
    }
    catch (err) {
      self.endThinking();
      self.setNote(`Error: ${err.message}`);
    }
    finally {
      self.endStreaming();
    }
  },

  isHTML(text) {
    return text?.trimStart().startsWith('<');
  },

  // demo
  startDemo() {
    self.controller = new AbortController();
    state.demoMode.set(true);
  },

  wait(ms) {
    return wait(ms, { abortController: self.controller });
  },

  async typeText(text) {
    const input = $('.input').el();
    input.value = '';
    for (const char of text) {
      if (self.isLive()) { return; }
      input.value += char;
      await self.wait(40 + Math.random() * 30);
    }
  },

  async runDemoStep(step) {
    if (self.isLive()) { return; }
    state.submitted.set(false);
    $('.input').el().value = '';

    await self.typeText(step.prompt);
    if (self.isLive()) { return; }

    await self.wait(400);
    if (self.isLive()) { return; }

    state.submitted.set(true);
    state.isThinking.set(true);
    state.cotVisible.set(true);
    state.cotText.set(step.cot);

    await self.wait(800 + Math.random() * 400);
    if (self.isLive()) { return; }

    state.isThinking.set(false);
    state.hasResults.set(true);
    state.previewHTML.set(step.html);
    state.codeHTML.set(highlightCode(step.code));
    self.completedSteps++;
    self.currentHTML = step.html;
  },

  async runDemo() {
    const steps = settings.steps;
    for (let i = 0; i < steps.length; i++) {
      if (self.isLive()) { break; }
      await self.runDemoStep(steps[i]);
      if (self.isLive()) { break; }
      if (i < steps.length - 1) {
        await self.wait(1200);
        if (self.isLive()) { break; }
        self.clearPrompt();
        await self.wait(600);
        if (self.isLive()) { break; }
      }
    }
    self.goLive();
  },

  goLive() {
    const steps = settings.steps;
    self.promptHistory = steps.slice(0, self.completedSteps).map(s => ({
      prompt: s.prompt,
      html: s.html,
    }));
    self.stopDemo();
    self.clearPrompt();
    state.demoMode.set(false);
  },

  stopDemo() {
    self?.controller.abort();
  },
});

const onRendered = async ({ isServer, self, settings, state }) => {
  if (isServer) {
    return;
  }
  await highlighterReady;
  if (settings.steps.length) {
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
