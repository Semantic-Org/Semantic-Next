import { defineComponent } from '@semantic-ui/component';
import { PlaygroundProject } from '@semantic-ui/playground';

import css from './ExamplePreview.css?raw';
import template from './ExamplePreview.html?raw';

const defaultSettings = {
  // file object keyed by filename; ignored when a shared project is passed
  files: {},

  // a shared PlaygroundProject (e.g. from a surrounding editor); omit to own one
  project: null,

  sandboxURL: '/sandbox',

  // the document the preview navigates to
  htmlFile: 'page.html',
};

const defaultState = {
  loading: true,
};

const createComponent = ({ self, settings, state, $, isServer }) => ({
  initialize() {
    if (isServer) {
      return;
    }
    self.ownsProject = !settings.project;
    self.project = settings.project ?? new PlaygroundProject({
      files: settings.files,
      sandboxUrl: settings.sandboxURL.endsWith('/') ? settings.sandboxURL : `${settings.sandboxURL}/`,
    });
    self.unsubscribe = [
      self.project.on('buildDone', () => self.showPreview()),
      self.project.on('recovered', () => self.reload()),
    ];
    if (self.ownsProject) {
      self.project.build();
    }
    else if (self.project.previewUrl) {
      self.showPreview();
    }
  },

  getPreviewURL() {
    return `${self.project.previewUrl}${settings.htmlFile}`;
  },

  showPreview() {
    state.loading.set(false);
    self.replaceFrame();
  },

  /*
    Replacement, not reload — an iframe whose navigation never committed is
    wedged: location.reload() on the initial empty document is a no-op and
    later navigations queue behind the pending one.
  */
  replaceFrame() {
    const content = $('.content').el();
    if (!content) {
      return;
    }
    const previous = $('.content iframe').el();
    const iframe = document.createElement('iframe');
    iframe.setAttribute('part', 'iframe');
    iframe.setAttribute('title', 'Example preview');
    iframe.src = self.getPreviewURL();
    previous?.remove();
    content.appendChild(iframe);
  },

  reload() {
    if (!state.loading.get()) {
      self.replaceFrame();
    }
  },
});

const events = {
  'global message window'({ self, event }) {
    if (
      event.data?.type === 'sui-playground-session-missing'
      && event.data.sessionId === self.project?.sessionId
    ) {
      self.project.build().then(() => self.replaceFrame());
    }
  },
};

const onThemeChanged = ({ self }) => {
  self.reload();
};

const onDestroyed = ({ self }) => {
  self.unsubscribe?.forEach(unsubscribe => unsubscribe());
  if (self.ownsProject) {
    self.project?.destroy();
  }
};

const ExamplePreview = defineComponent({
  tagName: 'example-preview',
  template,
  css,
  defaultSettings,
  defaultState,
  createComponent,
  events,
  onThemeChanged,
  onDestroyed,
});

export default ExamplePreview;
export { ExamplePreview };
