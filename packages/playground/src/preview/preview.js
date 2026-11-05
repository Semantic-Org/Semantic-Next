import { previewBridge, previewCommandType, previewMessageType } from './bridge.js';

/*
  PlaygroundPreview — binds a project to an iframe. Loads the session at an
  app path, follows the app's own navigations through the bridge the build
  injects, and reloads in place after every build, so an app that owns its
  urls comes back on the route it was on.

  A frame whose document never reported (a navigation that never committed,
  the missing-session page) is replaced rather than reloaded: a wedged iframe
  ignores reload and queues later navigations behind the pending one.
*/

// longer than the service worker's recovery hold (4s): a document that has not
// reported by then is treated as gone and the next reload replaces the frame
const loadTimeout = 6000;

export class PlaygroundPreview {
  constructor({ project, frame, path = '/' } = {}) {
    this.project = project;
    this.frame = frame;
    this.path = path;
    this.canGoBack = false;
    this.canGoForward = false;
    this.listeners = new Map();
    this.live = false; // the frame's document has reported through the bridge
    this.loading = false; // a load this preview started has not reported yet
    this.queued = false; // a reload asked for while loading
    this.rebuilding = false;
    this.loadTimer = undefined;
    this.unsubscribe = [
      project.on('buildDone', () => this.reload()),
      project.on('recovered', () => this.reload()),
    ];
    this.onMessage = (event) => this.receive(event);
    window.addEventListener('message', this.onMessage);
    // served documents need the bridge, which a plain project leaves out. a build
    // already started or done is redone, and its buildDone brings the first load
    if (!project.bridge) {
      project.bridge = previewBridge(project.sessionId);
      if (project.buildCounter > 0) {
        project.buildCoalesced();
        return;
      }
    }
    if (project.previewUrl) {
      this.reload();
    }
  }

  on(event, callback) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, new Set());
    }
    this.listeners.get(event).add(callback);
    return () => this.listeners.get(event)?.delete(callback);
  }

  emit(event, payload) {
    for (const callback of this.listeners.get(event) ?? []) {
      callback(payload);
    }
  }

  // the sandbox url of the current route, i.e. for an open-in-new-tab link
  get url() {
    return this.project.previewUrl ? toUrl(this.project.previewUrl, this.path) : undefined;
  }

  /*******************************
            Navigation
  *******************************/

  navigate(path) {
    this.path = path;
    if (this.live && !this.loading) {
      this.expectDocument();
      this.send({ command: 'navigate', url: this.url });
    }
    else {
      this.load();
    }
  }

  reload() {
    if (this.loading) {
      this.queued = true;
    }
    else if (this.live) {
      this.expectDocument();
      this.send({ command: 'reload' });
    }
    else {
      this.load();
    }
  }

  back() {
    this.send({ command: 'back' });
  }

  forward() {
    this.send({ command: 'forward' });
  }

  /* a fresh frame element at the current path, before the first build this is a no-op and buildDone returns here */
  load() {
    const url = this.url;
    if (!url) {
      return;
    }
    this.expectDocument();
    if (this.frame.isConnected && this.frame.src) {
      const frame = this.frame.cloneNode(false);
      frame.src = url;
      this.frame.replaceWith(frame);
      this.frame = frame;
    }
    else {
      this.frame.src = url;
    }
  }

  send(message) {
    this.frame.contentWindow?.postMessage({ type: previewCommandType, ...message }, '*');
  }

  /*******************************
            Document State
  *******************************/

  expectDocument() {
    this.live = false;
    this.loading = true;
    clearTimeout(this.loadTimer);
    this.loadTimer = setTimeout(() => this.settle(), loadTimeout);
  }

  settle() {
    clearTimeout(this.loadTimer);
    this.loading = false;
    if (this.queued) {
      this.queued = false;
      this.reload();
    }
  }

  receive({ data, source }) {
    if (!data || source !== this.frame.contentWindow || data.sessionId !== this.project.sessionId) {
      return;
    }
    if (data.type === 'sui-playground-session-missing') {
      clearTimeout(this.loadTimer);
      this.live = false;
      this.loading = false;
      this.queued = false;
      this.rebuild();
      return;
    }
    if (data.type !== previewMessageType) {
      return;
    }
    if (data.event === 'navigate') {
      this.path = toPath(this.project.previewUrl, data.href) ?? this.path;
      this.canGoBack = Boolean(data.canGoBack);
      this.canGoForward = Boolean(data.canGoForward);
      this.live = true;
      this.settle();
      this.emit('navigate', { path: this.path, canGoBack: this.canGoBack, canGoForward: this.canGoForward });
    }
    else if (data.event === 'error') {
      this.emit('error', { message: data.message });
    }
  }

  /* one rebuild per missing-session page, or a failing build loops message -> build -> 404 page -> message */
  async rebuild() {
    if (this.rebuilding) {
      return;
    }
    this.rebuilding = true;
    try {
      await this.project.build();
    }
    finally {
      this.rebuilding = false;
    }
  }

  /*******************************
             Teardown
  *******************************/

  destroy() {
    clearTimeout(this.loadTimer);
    window.removeEventListener('message', this.onMessage);
    for (const unsubscribe of this.unsubscribe) {
      unsubscribe();
    }
    this.listeners.clear();
  }
}

export const toUrl = (previewUrl, path) => `${previewUrl}${path.replace(/^\//, '')}`;

/* app path of a document url inside the session, undefined for one outside it */
export const toPath = (previewUrl, href) => {
  const url = new URL(href);
  const base = new URL(previewUrl, location.href);
  if (url.origin !== base.origin || !url.pathname.startsWith(base.pathname)) {
    return undefined;
  }
  return `/${url.pathname.slice(base.pathname.length)}${url.search}${url.hash}`;
};
