import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { each, fatal, isPlainObject, isString } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { isItemContext } from '../reactive-context.js';
import { registerBlock } from './registry.js';

/*

  {>name} template invocation. Handles BOTH snippets and subtemplates —
  the kind is determined at first render by checking renderer.snippets[name]
  and locked on self.kind for the lifetime of the block instance. Per
  the documented constraint (plan §dynamic template names), name must
  resolve consistently to one kind; kind-swapping mid-life is undefined
  behavior and we honor the first-resolved kind.

  Two branches:
  • snippet     — inline expansion. No own scope (uses parent), no
                  instance, no DynamicRegion needed beyond the anchor
                  region defineBlock provides. Inner expressions track
                  their own deps via the snippet-arg proxy. update is
                  a no-op (snippets are one-shot at mount).
  • subtemplate — full Template lifecycle: clone, initialize, render,
                  attach. Updates re-evaluate name + blob, swap instance
                  if name changed.

  Snippets and subtemplates share the same data-propagation primitive:
  a lazy-getter Proxy fronting the parent context (buildArgsProxy).
  Each reactiveData entry becomes a getter that calls
  evaluator.lookupExpressionValue at access time, so source-signal deps
  register on whichever Reaction is current at that read — the binding's
  own Reaction. Per-key isolation is structural: a binding that reads
  proxy.label registers labelVal; a sibling binding reading proxy.status
  registers statusVal; mutating labelVal wakes only the label binding.

  Subtemplates carry the lifecycle layer (clone, createComponent, settings,
  onCreated/etc.) on top of this same propagation. The proxy is installed
  as the subtemplate's `data` BEFORE initialize() runs so that closures
  captured by createComponent see the proxy and route through it on
  later reads. createComponent is invoked nonreactively so setup-time
  reads of data.foo don't pollute the parent's outer Reaction with
  source-signal deps.

  Blob `data={...}` (string or object literal) keeps the eager,
  bumpDataVersion-fanout path documented as coarse-by-design.

  Two-level context use: create() receives dispatch-level bag and stashes
  renderer.evaluator / renderer.subTemplates / renderer.snippets /
  renderer.template / renderer.dataDep onto self.

*/

function unpackBlobData(node, data, evaluator) {
  let blobData = {};
  if (!node.data) { return blobData; }
  if (isString(node.data)) {
    const evaluated = evaluator.lookupExpressionValue(node.data, data);
    if (isPlainObject(evaluated)) {
      blobData = { ...blobData, ...evaluated };
    }
    return blobData;
  }
  if (isPlainObject(node.data)) {
    // Inside {#each}, read reactively so item-signal mutations propagate
    // into subtemplate data. Outside each, static data={} stays non-reactive.
    const inItemContext = isItemContext(data);
    each(node.data, (expr, key) => {
      blobData[key] = inItemContext
        ? evaluator.lookupExpressionValue(expr, data)
        : Reaction.nonreactive(() => evaluator.lookupExpressionValue(expr, data));
    });
  }
  return blobData;
}

// Lazy-getter Proxy used by both snippets and subtemplates. Each
// reactiveData entry (and each entry of a literal node.data object for
// snippets) becomes a getter that calls
// evaluator.lookupExpressionValue at access time. Source-signal deps
// register on whichever Reaction is current at that read, so a
// binding's Reaction subscribes directly to its inputs — per-key
// isolation is structural, not mediated by an intermediate Dep layer.
//
// The Proxy target is a small holder object (target / allGetters /
// getterKeys); the trap handler is module-scoped (ARGS_HANDLER) so V8
// sees the same handler shape across every subtemplate / snippet
// mount and can establish monomorphic inline caches at the trap
// dispatch sites. With per-call closure-captured handlers V8 falls
// back to polymorphic dispatch, which is what made bulk-add-500 /
// filter-cycle-20 regress when the lazy proxy moved onto the
// subtemplate path.
//
// has / ownKeys / getOwnPropertyDescriptor make declared keys visible
// to `prop in proxy`, Object.keys, and descriptor-aware spreads (extend
// uses Object.getOwnPropertyDescriptor and re-defines as a getter — so
// descriptor-style copies preserve laziness).
//
// defineProperty / deleteProperty / getPrototypeOf forward to
// holder.target so callers that mutate the proxy via descriptor APIs
// (e.g. Template.overlaySettingsSignals) hit the underlying data
// object, not the holder.

// No-op setter included in the getter descriptor so `extend`-style
// copies (Object.defineProperty against this descriptor) accept
// assignment when overlays write the same key. Writes are absorbed;
// subsequent reads still resolve through the lazy getter.
const ABSORB_SET = () => {};

const ARGS_HANDLER = {
  get(holder, prop) {
    if (typeof prop === 'symbol') { return holder.target[prop]; }
    const getter = holder.allGetters[prop];
    if (getter !== undefined) { return getter(); }
    return holder.target[prop];
  },
  set(holder, prop, value) {
    if (prop in holder.allGetters) { return true; }
    holder.target[prop] = value;
    return true;
  },
  has(holder, prop) {
    return (prop in holder.allGetters) || (prop in holder.target);
  },
  ownKeys(holder) {
    const ownKeys = Reflect.ownKeys(holder.target);
    const merged = [...holder.getterKeys];
    for (const key of ownKeys) {
      if (!(key in holder.allGetters)) { merged.push(key); }
    }
    return merged;
  },
  getOwnPropertyDescriptor(holder, prop) {
    const getter = holder.allGetters[prop];
    if (getter !== undefined) {
      return { configurable: true, enumerable: true, get: getter, set: ABSORB_SET };
    }
    return Object.getOwnPropertyDescriptor(holder.target, prop);
  },
  defineProperty(holder, prop, descriptor) {
    return Reflect.defineProperty(holder.target, prop, descriptor);
  },
  deleteProperty(holder, prop) {
    return delete holder.target[prop];
  },
  getPrototypeOf(holder) {
    return Reflect.getPrototypeOf(holder.target);
  },
};

function buildArgsProxy({ node, parentData, evaluator, target }) {
  const allGetters = Object.create(null);

  if (node.data) {
    if (isString(node.data)) {
      const evaluated = evaluator.lookupExpressionValue(node.data, parentData);
      if (isPlainObject(evaluated)) {
        each(evaluated, (val, key) => {
          allGetters[key] = () => val;
        });
      }
    }
    else if (isPlainObject(node.data)) {
      each(node.data, (expr, key) => {
        allGetters[key] = () => evaluator.lookupExpressionValue(expr, parentData);
      });
    }
  }
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      allGetters[key] = () => evaluator.lookupExpressionValue(expr, parentData);
    });
  }

  const getterKeys = Object.keys(allGetters);
  // Empty-args fast path — no-arg snippet invocations (`{>name}`) skip
  // the Proxy entirely and use the parent data context directly.
  if (getterKeys.length === 0) { return target; }

  return new Proxy({ target, allGetters, getterKeys }, ARGS_HANDLER);
}

// Read name nonreactively for kind detection so name changes (which
// shouldn't change kind per the documented constraint) don't fire the
// outer reaction unnecessarily for snippet-kind blocks. Subtemplate
// name reactivity is handled separately inside the subtemplate branch
// where it's needed for instance swap.
function detectKind({ node, data, self }) {
  if (self.kind !== null) { return self.kind; }
  const name = Reaction.nonreactive(() => self.evaluator.lookupExpressionValue(node.name, data));
  if (name == null || name === '') { return null; }
  self.kind = self.snippets[name] ? 'snippet' : 'subtemplate';
  return self.kind;
}

function resolveSubtemplate(nameExpr, data, self) {
  const templateOrName = self.evaluator.lookupExpressionValue(nameExpr, data);
  if (isString(templateOrName)) {
    return { template: self.subTemplates?.[templateOrName], templateName: templateOrName };
  }
  if (templateOrName instanceof Template) {
    return { template: templateOrName, templateName: templateOrName.templateName };
  }
  return { template: null, templateName: null };
}

function resolveSnippet(nameExpr, data, self) {
  const name = self.evaluator.lookupExpressionValue(nameExpr, data);
  if (!isString(name)) { return null; }
  return self.snippets[name] || null;
}

// Build the subtemplate's lazy-getter proxy and clone the Template
// against it. The proxy is installed BEFORE initialize() runs so that
// closures captured by createComponent (e.g. methods that read
// `data.foo` later) capture the proxy itself — subsequent reads route
// through the lazy getter and register source-signal deps on the
// caller's Reaction.
//
// Initialize is wrapped in Reaction.nonreactive so synchronous reads
// of data.foo from inside createComponent or onCreated do not register
// source-signal deps on the parent's outer Reaction. Reads from later
// binding-Reaction context still register normally — the wrap only
// silences the setup path.
function cloneInstance({ template, templateName, templateData, self, parentData, node }) {
  const instance = template.clone({
    templateName,
    data: templateData,
    parentTemplate: self.parentTemplate,
    renderingEngine: 'native',
  });
  if (self.parentTemplate?.element) { instance.setElement(self.parentTemplate.element); }
  if (self.parentTemplate) { instance.setParent(self.parentTemplate); }

  // For reactiveData subtemplates, install the lazy proxy as the
  // instance's data ref. The proxy's target is the seeded blob already
  // on instance.data, so non-arg keys (state, instance overlay added
  // during initialize, blob keys) resolve via fall-through.
  if (node?.reactiveData) {
    const proxy = buildArgsProxy({ node, parentData, evaluator: self.evaluator, target: instance.data });
    instance.data = proxy;
  }

  Reaction.nonreactive(() => instance.initialize());
  return instance;
}

function attachToRenderRoot(instance, region, self, { startNode } = {}) {
  const renderRoot = self.parentTemplate?.element?.renderRoot;
  if (!renderRoot) { return; }
  instance.attach(renderRoot, {
    parentNode: region.parentNode,
    startNode: startNode || region.anchor,
    endNode: region.endAnchor || region.getLastNode(),
  });
}

// Settings mirror — when a reactiveData key matches one of the
// subtemplate's declared defaultSettings entries, route per-key
// updates into the settings Proxy too. The settings Proxy holds its
// own per-key Signals (createSubtemplateSettings in templating); a
// write fires the Signal, so closures reading `settings.foo` track
// that Signal and wake when it notifies. Without this, settings-keyed
// closures stay stale because the data-side proxy doesn't touch them.
//
// Allocates a child scope + one Reaction only when the subtemplate
// actually has overlap between reactiveData and defaultSettings;
// pure-data subtemplates pay nothing.
function setupSettingsMirror({ node, data, scope, region, self }) {
  if (!node.reactiveData) { return; }
  const defaultSettings = self.currentInstance.defaultSettings;
  const settingsProxy = self.currentInstance.settings;
  if (!settingsProxy || !defaultSettings) { return; }

  const settingsKeys = [];
  each(node.reactiveData, (_, key) => {
    if (key in defaultSettings) { settingsKeys.push(key); }
  });
  if (settingsKeys.length === 0) { return; }

  self.settingsScope = scope.child();
  self.settingsScope.reaction(region.anchor, () => {
    for (const key of settingsKeys) {
      const expr = node.reactiveData[key];
      settingsProxy[key] = self.evaluator.lookupExpressionValue(expr, data);
    }
  }, { message: 'subtemplate-settings' });
}

function teardownSettingsMirror(self) {
  if (self.settingsScope) {
    self.settingsScope.dispose();
    self.settingsScope = null;
  }
}

function clearInstance(self, region) {
  if (self.currentInstance) {
    self.currentInstance.onDestroyed();
    self.currentInstance = null;
    self.currentTemplateID = null;
    teardownSettingsMirror(self);
    region.clear();
  }
}

// Template.render walks the subtemplate's data via assignInPlace during
// setDataContext / renderer.setData. For reactiveData paths the data is
// a lazy-getter proxy whose reads register source-signal deps on the
// active Reaction. Wrap the call so those reads don't register on the
// block's outer Reaction — bindings inside the subtemplate register
// their own deps via the proxy at evaluation time.
function renderInstance(instance, node, blobData) {
  if (node.reactiveData) {
    return Reaction.nonreactive(() => instance.render(blobData));
  }
  return instance.render(blobData);
}

const templateBlock = defineBlock({
  name: 'template',
  syntax: (node) => `{> ${node.name}}`,

  create({ renderer }) {
    return {
      evaluator: renderer.evaluator,
      subTemplates: renderer.subTemplates,
      snippets: renderer.snippets,
      parentTemplate: renderer.template,
      dataDep: renderer.dataDep,
      kind: null,
      currentTemplateID: null,
      currentInstance: null,
      settingsScope: null,
    };
  },

  render({ node, data, region, scope, renderAST, self, isSVG }) {
    const kind = detectKind({ node, data, self });
    if (kind === null) { return; }

    if (kind === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
      const snippetData = buildArgsProxy({ node, parentData: data, evaluator: self.evaluator, target: data });
      const fragment = renderAST({ ast: snippet.content, data: snippetData, scope, isSVG });
      region.setContent(fragment);
      return;
    }

    self.dataDep.depend();
    const { template, templateName } = resolveSubtemplate(node.name, data, self);
    const blobData = unpackBlobData(node, data, self.evaluator);
    if (!template) { return; }

    self.currentTemplateID = template.id;
    self.currentInstance = cloneInstance({
      template,
      templateName,
      templateData: blobData,
      self,
      parentData: data,
      node,
    });
    setupSettingsMirror({ node, data, scope, region, self });
    // Template.render's setData chain reads through the data proxy; for
    // the per-key path those reads must not register source-signal deps
    // on this block's outer Reaction. Bindings inside the subtemplate
    // register on source signals through their own Reactions.
    const fragment = renderInstance(self.currentInstance, node);
    region.setContent(fragment);
    attachToRenderRoot(self.currentInstance, region, self);
  },

  hydrate({ node, data, region, scope, hydrateInto, self }) {
    const kind = detectKind({ node, data, self });
    if (kind === null) { return; }

    if (kind === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
      const snippetData = buildArgsProxy({ node, parentData: data, evaluator: self.evaluator, target: data });
      if (region.ownedNodes.length > 0) {
        // Snippet args reactivity is anchored on the block scope; a child
        // would dispose with the next region.clear() and break arg reactivity.
        hydrateInto({ innerAST: snippet.content, data: snippetData, asChild: false });
      }
      return;
    }

    self.dataDep.depend();
    const { template, templateName } = resolveSubtemplate(node.name, data, self);
    const blobData = unpackBlobData(node, data, self.evaluator);
    if (!template) { return; }

    self.currentTemplateID = template.id;
    self.currentInstance = cloneInstance({
      template,
      templateName,
      templateData: blobData,
      self,
      parentData: data,
      node,
    });
    setupSettingsMirror({ node, data, scope, region, self });

    if (region.ownedNodes.length > 0) {
      self.currentInstance.renderer.hydrateInto({
        region,
        innerAST: self.currentInstance.ast,
        data: self.currentInstance.renderer.data,
        scope: self.currentInstance.renderer.scope,
        asChild: false,
      });
    }

    self.currentInstance.markRendered();
    if (region.ownedNodes.length > 0) {
      attachToRenderRoot(self.currentInstance, region, self, { startNode: region.ownedNodes[0] });
    }
  },

  update({ node, data, region, scope, self }) {
    // Snippets are one-shot at mount — name reactivity at the outer level
    // is documented as undefined (kind shouldn't change), and inner
    // expression reactivity is handled by the snippet-arg proxy's lazy
    // getters via per-marker Reactions wired during render/hydrate.
    if (self.kind === 'snippet') { return; }

    self.dataDep.depend();
    const { template, templateName } = resolveSubtemplate(node.name, data, self);
    const blobData = unpackBlobData(node, data, self.evaluator);

    if (!template) {
      clearInstance(self, region);
      return;
    }

    if (template.id !== self.currentTemplateID) {
      if (self.currentInstance) { self.currentInstance.onDestroyed(); }
      teardownSettingsMirror(self);
      self.currentTemplateID = template.id;
      self.currentInstance = cloneInstance({
        template,
        templateName,
        templateData: blobData,
        self,
        parentData: data,
        node,
      });
      setupSettingsMirror({ node, data, scope, region, self });
      const fragment = renderInstance(self.currentInstance, node);
      region.setContent(fragment);
      attachToRenderRoot(self.currentInstance, region, self);
    }
    else {
      // Same template — push blob data only. reactiveData propagation
      // happens through the lazy proxy reads inside the subtemplate's
      // bindings, not through this update path.
      self.currentInstance.setDataContext(blobData, { rerender: false });
      renderInstance(self.currentInstance, node, blobData);
    }
  },

  destroy({ self }) {
    // Snippets have no instance to destroy — region.clear() handles DOM,
    // inner reactions registered against parent scope auto-dispose.
    // settingsScope is a child of the block's scope; its Reactions
    // dispose when the block scope's onDispose runs after this hook.
    if (self.currentInstance) {
      self.currentInstance.onDestroyed();
      self.currentInstance = null;
    }
    self.settingsScope = null;
  },

  evaluateText({ node, data, renderer }) {
    const templateName = renderer.evaluator.lookupExpressionValue(node.name, data);
    const snippet = renderer.snippets[templateName];
    if (snippet) {
      return renderer.evaluateRawTextNodes(snippet.content, data);
    }
    return '';
  },
});

registerBlock('template', templateBlock);

export default templateBlock;
