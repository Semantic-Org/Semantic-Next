import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { each, extend, fatal, isPlainObject, isString } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { isItemContext } from '../reactive-context.js';
import { registerBlock } from './registry.js';

/*

  {>name} template invocation. Handles BOTH snippets and subtemplates —
  the templateType is determined at first render by checking
  renderer.snippets[name] and locked on self.templateType for the
  lifetime of the block instance. Per the documented constraint (plan
  §dynamic template names), name must resolve consistently to one
  templateType; templateType-swapping mid-life is undefined behavior
  and we honor the first-resolved value.

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
  a lazy-getter record (buildArgsRecord) — a plain object inheriting
  from the parent context, with declared keys defined as native ES
  getter descriptors. Each reactiveData entry's getter calls
  evaluator.lookupExpressionValue at access time, so source-signal deps
  register on whichever Reaction is current at that read — the binding's
  own Reaction. Per-key isolation is structural: a binding that reads
  record.label registers labelVal; a sibling binding reading record.status
  registers statusVal; mutating labelVal wakes only the label binding.

  Subtemplates carry the lifecycle layer (clone, createComponent, settings,
  onCreated/etc.) on top of this same propagation. The record is installed
  as the subtemplate's `data` BEFORE initialize() runs so that closures
  captured by createComponent see it and route through the getters on
  later reads. createComponent is invoked nonreactively so setup-time
  reads of data.foo don't pollute the parent's outer Reaction with
  source-signal deps.

  Blob `data={...}` (string or object literal) keeps the eager,
  bumpDataVersion-fanout path documented as coarse-by-design.

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

// Lazy-getter record used by both snippets and subtemplates. Each
// reactiveData entry (and each entry of a literal node.data object for
// snippets) becomes a native ES getter descriptor on a flat plain
// object. Source-signal deps register on whichever Reaction is current
// at the read, so a binding's Reaction subscribes directly to its
// inputs — per-key isolation is structural, not mediated by an
// intermediate Dep layer.
//
// Shape: a fresh `{}` (proto = Object.prototype) with target's own
// descriptors copied in via `extend`, then declared getters defined
// on top. Every record built for the same template node ends up with
// the same own-property progression in the same order, so V8
// consolidates them into one hidden class. The IC at every binding's
// `data[token]` read site stays monomorphic across all records in an
// each-block iteration. A prototype-chain shape off the target's
// identity splits records into per-target hidden classes, so we copy
// descriptors onto a flat record instead.
//
// Why descriptors instead of a Proxy: a Proxy's get trap is a function
// call into module code on every property read. Native getter
// descriptors compile to the same hidden-class IC as a plain property
// access — V8 inlines them. The trap surface that a Proxy would carry
// (has / ownKeys / getOwnPropertyDescriptor / set / defineProperty /
// deleteProperty / getPrototypeOf) collapses into the language
// semantics: `in` checks own properties, `Object.keys` returns own
// enumerables, `extend` (utils/objects.js) is descriptor-aware and
// copies the get/set pair intact.
//
// Why `extend(record, target)` over `Object.assign(record, target)`:
// extend is descriptor-aware. If target itself carries a getter (e.g.
// nested subtemplate, or component-level `darkMode`), Object.assign
// would invoke and snapshot the value. extend copies the descriptor,
// preserving laziness. For non-getter target keys both produce the
// same result.
//
// Absorb-set semantics: declared keys carry `set: () => {}` so that
// `record.foo = x` is silently absorbed. The settingsScope-mirror path
// writes Signal references onto the subtemplate's `settings` proxy
// directly, not through this record, so absorb-set does not interfere
// with overlay propagation.

const ABSORB_SET = () => {};

function buildArgsRecord({ node, parentData, evaluator, target }) {
  // Declared-key collection. Two flavors: static (eager value) and
  // expression (lazy lookup). Parallel arrays avoid an object allocation
  // per declared key.
  let keys = null;
  let kinds = null; // 's' = static, 'e' = expression
  let values = null; // static value or expression token

  const declare = (key, kind, val) => {
    if (keys === null) {
      keys = [];
      kinds = [];
      values = [];
    }
    keys.push(key);
    kinds.push(kind);
    values.push(val);
  };

  if (node.data) {
    if (isString(node.data)) {
      const evaluated = evaluator.lookupExpressionValue(node.data, parentData);
      if (isPlainObject(evaluated)) {
        each(evaluated, (val, key) => declare(key, 's', val));
      }
    }
    else if (isPlainObject(node.data)) {
      each(node.data, (expr, key) => declare(key, 'e', expr));
    }
  }
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => declare(key, 'e', expr));
  }

  // Empty-args fast path — no-arg snippet invocations (`{>name}`) skip
  // the wrapper entirely and use the parent data context directly.
  if (keys === null) { return target; }

  // Flat record with shared Object.prototype proto. extend copies
  // target's own descriptors (preserving any getters) before declared
  // getters land on top, so every record built for the same node ends
  // up with the same own-property shape.
  const record = {};
  extend(record, target);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    const val = values[i];
    Object.defineProperty(record, key, {
      configurable: true,
      enumerable: true,
      get: kinds[i] === 's'
        ? () => val
        : () => evaluator.lookupExpressionValue(val, parentData),
      set: ABSORB_SET,
    });
  }
  return record;
}

// Read name reactively only while templateType is still null so the outer
// Reaction wakes when a data-driven name finally resolves. Once locked,
// the early return short-circuits before any read — so post-lock name
// changes don't fire the outer reaction (templateType is documented as
// stable per name, swapping it mid-life is undefined). Subtemplate name
// reactivity for instance swap is handled separately in the subtemplate
// branch.
function detectTemplateType({ node, data, self }) {
  if (self.templateType !== null) { return self.templateType; }
  const name = self.evaluator.lookupExpressionValue(node.name, data);
  if (name == null || name === '') { return null; }
  self.templateType = self.snippets[name] ? 'snippet' : 'subtemplate';
  return self.templateType;
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

// Mount the snippet's content into the region. Tracks the snippet on
// self.currentSnippet so subsequent updates can compare identity and
// remount on swap.
function mountSnippet({ node, data, region, scope, renderAST, isSVG, self }) {
  const snippet = resolveSnippet(node.name, data, self);
  if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
  self.currentSnippet = snippet;
  const snippetData = buildArgsRecord({ node, parentData: data, evaluator: self.evaluator, target: data });
  region.setContent(renderAST({ ast: snippet.content, data: snippetData, scope, isSVG }));
}

// Build the subtemplate's lazy-getter record and clone the Template
// against it. The record is installed BEFORE initialize() runs so that
// closures captured by createComponent (e.g. methods that read
// `data.foo` later) capture the record itself — subsequent reads route
// through the lazy getters and register source-signal deps on the
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

  // For reactiveData subtemplates, install the lazy-getter record as
  // the instance's data ref. `target: instance.data` seeds the record
  // with the blob's own descriptors via `extend`, so blob keys read
  // through the same record alongside the declared reactiveData getters.
  if (node?.reactiveData) {
    const record = buildArgsRecord({ node, parentData, evaluator: self.evaluator, target: instance.data });
    instance.data = record;
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
// a lazy-getter record whose reads register source-signal deps on the
// active Reaction. Wrap the call so those reads don't register on the
// block's outer Reaction — bindings inside the subtemplate register
// their own deps via the record at evaluation time.
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
      templateType: null,
      currentTemplateID: null,
      currentSnippet: null,
      currentInstance: null,
      settingsScope: null,
    };
  },

  render({ node, data, region, scope, renderAST, self, isSVG }) {
    const templateType = detectTemplateType({ node, data, self });
    if (templateType === null) { return; }

    if (templateType === 'snippet') {
      mountSnippet({ node, data, region, scope, renderAST, isSVG, self });
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
    const fragment = renderInstance(self.currentInstance, node);
    region.setContent(fragment);
    attachToRenderRoot(self.currentInstance, region, self);
  },

  hydrate({ node, data, region, scope, hydrateInto, self }) {
    const templateType = detectTemplateType({ node, data, self });
    if (templateType === null) { return; }

    if (templateType === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
      self.currentSnippet = snippet;
      const snippetData = buildArgsRecord({ node, parentData: data, evaluator: self.evaluator, target: data });
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

  update({ node, data, region, scope, renderAST, self, isSVG }) {
    // First render/hydrate may have seen a null name (e.g. data-driven
    // {>template name=which} with which=null until state settles). Re-detect
    // now so the snippet branch isn't silently skipped on later resolution.
    if (self.templateType === null) {
      const detected = detectTemplateType({ node, data, self });
      if (detected === null) { return; }
      // detected is now locked on self.templateType — fall through.
    }

    // Snippet path: same-type swap (snippet→snippet) is supported by
    // comparing snippet identity. Cross-type swap is structurally impossible
    // (a name can't be both a snippet and a subtemplate). Inner expression
    // reactivity is handled by the snippet-arg proxy's lazy getters via
    // per-marker Reactions wired during render/hydrate.
    if (self.templateType === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (snippet === self.currentSnippet) { return; }
      mountSnippet({ node, data, region, scope, renderAST, isSVG, self });
      return;
    }

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
      // Same template — `instance.render(blobData)` merges blobData into
      // the instance's dataContext via additionalData, then setDataContext
      // assigns the full result onto this.data. A separate setDataContext
      // call here would be a destructive partial sync (small source vs full
      // target → assignInPlace deletes everything not in blobData), only
      // for render() to immediately re-assign the full set.
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
