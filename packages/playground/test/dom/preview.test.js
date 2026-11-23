import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { previewCommandType, previewMessageType } from '../../src/preview/bridge.js';
import { PlaygroundPreview, toPath, toUrl } from '../../src/preview/preview.js';

const previewUrl = '/sandbox/sui-playground-v1/abc/';

/* a project stub with the surface the preview uses: events, previewUrl, sessionId, bridge, builds */
const createProject = ({ built = true, bridge = true } = {}) => {
  const listeners = new Map();
  return {
    sessionId: 'abc',
    bridge: bridge ? '<script>bridge</script>' : '',
    buildCounter: built ? 1 : 0,
    previewUrl: built ? previewUrl : undefined,
    on(event, callback) {
      listeners.set(event, callback);
      return () => listeners.delete(event);
    },
    emit(event) {
      listeners.get(event)?.();
    },
    build: vi.fn(async () => ({ files: [] })),
    buildCoalesced: vi.fn(),
  };
};

const mount = () => {
  const frame = document.createElement('iframe');
  frame.title = 'preview';
  document.body.appendChild(frame);
  return frame;
};

/* a bridge message as the frame's document would post it */
const report = (preview, data) => {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: { type: previewMessageType, sessionId: 'abc', ...data },
      source: preview.frame.contentWindow,
    }),
  );
};

const arrive = (preview, path) => {
  report(preview, { event: 'navigate', href: `http://localhost:3000${previewUrl}${path.slice(1)}`, canGoBack: true });
};

const commands = (preview) => {
  const spy = vi.spyOn(preview.frame.contentWindow, 'postMessage');
  return () => spy.mock.calls.map(([message]) => message);
};

let preview;

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  preview?.destroy();
  document.body.innerHTML = '';
  vi.useRealTimers();
});

describe('PlaygroundPreview', () => {
  it('loads the session root once the project has built', () => {
    const frame = mount();
    preview = new PlaygroundPreview({ project: createProject(), frame });
    expect(frame.src).toBe(`http://localhost:3000${previewUrl}`);
    expect(preview.url).toBe(previewUrl);
  });

  it('turns the project bridge on, rebuilding a project that already built', () => {
    const project = createProject({ bridge: false });
    const frame = mount();
    preview = new PlaygroundPreview({ project, frame });
    expect(project.bridge).toContain(`sessionId: "abc"`);
    expect(project.buildCoalesced).toHaveBeenCalledTimes(1);
    // the rebuild's buildDone brings the first load, bridged
    expect(frame.src).toBe('');
    project.emit('buildDone');
    expect(preview.frame.src).toBe(`http://localhost:3000${previewUrl}`);
  });

  it('leaves an unbuilt project to its first build after turning the bridge on', () => {
    const project = createProject({ bridge: false, built: false });
    preview = new PlaygroundPreview({ project, frame: mount() });
    expect(project.bridge).toContain('sui-playground-preview');
    expect(project.buildCoalesced).not.toHaveBeenCalled();
  });

  it('waits for the first build before loading', () => {
    const project = createProject({ built: false });
    const frame = mount();
    preview = new PlaygroundPreview({ project, frame, path: '/team/acme' });
    expect(frame.src).toBe('');
    project.previewUrl = previewUrl;
    project.emit('buildDone');
    expect(preview.frame.src).toBe(`http://localhost:3000${previewUrl}team/acme`);
  });

  it('follows the app through its own navigations', () => {
    preview = new PlaygroundPreview({ project: createProject(), frame: mount() });
    const seen = [];
    preview.on('navigate', (event) => seen.push(event));
    arrive(preview, '/team/acme?tab=members');
    expect(preview.path).toBe('/team/acme?tab=members');
    expect(preview.url).toBe(`${previewUrl}team/acme?tab=members`);
    expect(seen).toEqual([{ path: '/team/acme?tab=members', canGoBack: true, canGoForward: false }]);
  });

  it('ignores messages from other frames and other sessions', () => {
    preview = new PlaygroundPreview({ project: createProject(), frame: mount() });
    const other = mount();
    const seen = [];
    preview.on('navigate', (event) => seen.push(event));
    window.dispatchEvent(
      new MessageEvent('message', {
        data: {
          type: previewMessageType,
          sessionId: 'abc',
          event: 'navigate',
          href: 'http://localhost:3000/elsewhere',
        },
        source: other.contentWindow,
      }),
    );
    report(preview, { sessionId: 'xyz', event: 'navigate', href: `http://localhost:3000${previewUrl}team/acme` });
    expect(seen).toEqual([]);
    expect(preview.path).toBe('/');
  });

  it('reloads a live document in place after a build', () => {
    const project = createProject();
    preview = new PlaygroundPreview({ project, frame: mount() });
    const frame = preview.frame;
    arrive(preview, '/team/acme');
    const sent = commands(preview);
    project.emit('buildDone');
    expect(sent()).toEqual([{ type: previewCommandType, command: 'reload' }]);
    expect(preview.frame).toBe(frame);
  });

  it('replaces a frame that already holds a document, keeping its attributes', () => {
    const frame = mount();
    frame.src = 'about:blank';
    preview = new PlaygroundPreview({ project: createProject(), frame, path: '/team/acme' });
    expect(preview.frame).not.toBe(frame);
    expect(frame.isConnected).toBe(false);
    expect(preview.frame.isConnected).toBe(true);
    expect(preview.frame.title).toBe('preview');
    expect(preview.frame.src).toBe(`http://localhost:3000${previewUrl}team/acme`);
  });

  it('defers a reload asked for while a document is loading', () => {
    const project = createProject();
    preview = new PlaygroundPreview({ project, frame: mount() });
    arrive(preview, '/');
    const sent = commands(preview);
    project.emit('buildDone');
    project.emit('buildDone');
    expect(sent()).toHaveLength(1);
    arrive(preview, '/');
    expect(sent()).toHaveLength(2);
  });

  it('treats a document that never reports as gone', () => {
    const project = createProject();
    preview = new PlaygroundPreview({ project, frame: mount() });
    arrive(preview, '/team/acme');
    const frame = preview.frame;
    project.emit('buildDone');
    vi.advanceTimersByTime(7000);
    project.emit('buildDone');
    expect(preview.frame).not.toBe(frame);
    expect(preview.frame.src).toBe(`http://localhost:3000${previewUrl}team/acme`);
  });

  it('sends navigation commands to a live document', () => {
    preview = new PlaygroundPreview({ project: createProject(), frame: mount() });
    arrive(preview, '/');
    const sent = commands(preview);
    preview.back();
    preview.forward();
    preview.navigate('/team/globex');
    expect(sent()).toEqual([
      { type: previewCommandType, command: 'back' },
      { type: previewCommandType, command: 'forward' },
      { type: previewCommandType, command: 'navigate', url: `${previewUrl}team/globex` },
    ]);
    expect(preview.path).toBe('/team/globex');
  });

  it('rebuilds once for a missing-session page', async () => {
    const project = createProject();
    preview = new PlaygroundPreview({ project, frame: mount() });
    const missing = () => report(preview, { type: 'sui-playground-session-missing' });
    missing();
    missing();
    await vi.runAllTimersAsync();
    expect(project.build).toHaveBeenCalledTimes(1);
  });

  it('reports runtime errors from the app', () => {
    preview = new PlaygroundPreview({ project: createProject(), frame: mount() });
    const seen = [];
    preview.on('error', (event) => seen.push(event));
    report(preview, { event: 'error', message: 'boom' });
    expect(seen).toEqual([{ message: 'boom' }]);
  });

  it('stops listening on destroy', () => {
    const project = createProject();
    preview = new PlaygroundPreview({ project, frame: mount() });
    const seen = [];
    preview.on('navigate', (event) => seen.push(event));
    preview.destroy();
    arrive(preview, '/team/acme');
    project.emit('buildDone');
    expect(seen).toEqual([]);
    expect(preview.path).toBe('/');
  });
});

describe('preview paths', () => {
  it('maps between app paths and session urls', () => {
    expect(toUrl(previewUrl, '/team/acme?x=1#top')).toBe(`${previewUrl}team/acme?x=1#top`);
    expect(toUrl(previewUrl, '/')).toBe(previewUrl);
    expect(toPath(previewUrl, `http://localhost:3000${previewUrl}team/acme?x=1#top`)).toBe('/team/acme?x=1#top');
    expect(toPath(previewUrl, `http://localhost:3000${previewUrl}`)).toBe('/');
  });

  it('has no path for a document outside the session', () => {
    expect(toPath(previewUrl, 'http://localhost:3000/sandbox/sui-playground-v1/other/')).toBeUndefined();
    expect(toPath(previewUrl, `https://elsewhere.test${previewUrl}`)).toBeUndefined();
  });
});
