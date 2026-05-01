// Stub rendering engine for Template tests that don't need real DOM
// rendering. The Template's `initialize()` requires an engine to instantiate
// the Renderer class. Tests targeting Template's internal contracts (data
// context construction, callback params, lifecycle hook firing, etc.)
// don't need to verify renderer output — they just need the engine to
// satisfy the construction contract.
//
// Pass via `new Template({ renderingEngine: stubEngine, ... })`. Template's
// engine resolution (template.js:271-273) accepts an inline object,
// bypassing the registry entirely — no global state changes per test.

class StubRenderer {
  constructor({ ast, data, template, subTemplates, helpers, receivesData }) {
    this.ast = ast;
    this.data = data;
    this.template = template;
    this.subTemplates = subTemplates;
    this.helpers = helpers;
    this.receivesData = receivesData;
    this.dataVersion = 0;
    this.renderCalls = 0;
    this.setDataCalls = 0;
    this.bumpDataVersionCalls = 0;
  }

  setData(data) {
    this.data = data;
    this.setDataCalls++;
  }

  render() {
    this.renderCalls++;
    // Return a no-op DocumentFragment if document is available (browser/jsdom),
    // otherwise an empty object that satisfies the contract for node tests.
    if (typeof document !== 'undefined') {
      return document.createDocumentFragment();
    }
    return { childNodes: [] };
  }

  bumpDataVersion() {
    this.dataVersion++;
    this.bumpDataVersionCalls++;
  }

  buildHTMLString() {
    return { entries: [], html: '' };
  }

  notifyUpdate() {
    // no-op — Template's update reaction calls this; stub records nothing
  }

  hydrateMarkers() {
    // no-op — hydration path
  }
}

class StubServerRenderer extends StubRenderer {
  // Server renderer is a separate class but the contract overlaps for tests
  // that only need the engine to resolve and the renderer to instantiate.
}

export const stubEngine = {
  renderer: StubRenderer,
  serverRenderer: StubServerRenderer,
};

// Convenience factory for tests that want a fresh stub renderer reference
// to assert against (e.g., "render was called once after first attach").
export function makeStubEngine() {
  // Returns a fresh engine object so multiple Templates in one test get
  // independent renderer instances. Call counts are per-instance, not shared.
  return {
    renderer: StubRenderer,
    serverRenderer: StubServerRenderer,
  };
}

// Re-export the renderer classes for tests that want to introspect call
// counts after an action.
export { StubRenderer, StubServerRenderer };
