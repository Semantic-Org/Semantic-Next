import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { each, fatal, isPlainObject, isString } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { isItemContext, ReactiveDataContext } from '../reactive-context.js';
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
                  if name changed. ReactiveData propagation does NOT go
                  through update — see setupReactiveSubtemplate.

  Subtemplate reactiveData uses a per-key path independent of update's
  outer Reaction. setupReactiveSubtemplate wraps the subtemplate's
  renderer.data in a ReactiveDataContext and registers one Reaction per
  reactiveData entry on a child scope (self.reactiveDataScope). Each
  Reaction tracks one source expression and pushes via ctx.setKey when
  it fires. Subscribers reading proxy.fooKey only re-evaluate when
  fooKey's per-key Signal notifies — bumpDataVersion fanout is bypassed
  for reactiveData. Blob `data={...}` keeps the bumpDataVersion path:
  blob writes are wholesale-replacement by contract, so the coarse
  fanout there is intentional.

  Two-level context use: create() receives dispatch-level bag and stashes
  renderer.evaluator / renderer.subTemplates / renderer.snippets /
  renderer.template / renderer.dataDep onto self. The author bag stays
  honest; subsequent hooks read from self.* rather than reaching through
  scope.

*/

function unpackBlobData(node, data, evaluator) {
  let blobData = {};
  if (!node.data) { return blobData; }
  if (isString(node.data)) {
    const evaluated = evaluator.lookupExpressionValue(node.data, data);
    if (isPlainObject(evaluated)) {
      blobData = { ...blobData, ...evaluated };
    }
  }
  else if (isPlainObject(node.data)) {
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

// Snippet-arg context. Wraps the parent data in a ReactiveDataContext and
// registers one Reaction per arg. Each Reaction evaluates its source
// expression in the parent's data context and pushes via setKey, so the
// snippet body's per-arg reads track only that arg's per-key Signal.
//
// writeToParent stays off — snippet's parent is the surrounding data
// context, which is shared across sibling snippet invocations. Writing
// would cross-contaminate.
//
// The Reactions live on the block's scope directly (no child scope) —
// snippets are one-shot at mount, no instance swap, so the block's own
// scope dispose is sufficient teardown.
function buildSnippetContext(node, data, evaluator, scope, region) {
  // No-arg snippets skip the per-key infrastructure entirely. Inline
  // expansion against parent data is cheaper than allocating a Map +
  // Dependency + Proxy per invocation when there are no args to track.
  // Caller falls through to using parent data directly when this returns
  // null.
  if (!node.data && !node.reactiveData) {
    return null;
  }

  const context = new ReactiveDataContext(data);

  // Single Reaction handles every arg — both `data={...}` and
  // `key=expr` forms. setKey's per-key isEqual gate keeps per-key
  // isolation at the binding layer. One Reaction allocation per snippet
  // invocation regardless of arg count.
  if (node.data || node.reactiveData) {
    scope.reaction(region.anchor, () => {
      if (node.data) {
        if (isString(node.data)) {
          const evaluated = evaluator.lookupExpressionValue(node.data, data);
          if (isPlainObject(evaluated)) {
            each(evaluated, (val, key) => {
              context.setKey(key, val);
            });
          }
        }
        else if (isPlainObject(node.data)) {
          each(node.data, (expr, key) => {
            const value = evaluator.lookupExpressionValue(expr, data);
            context.setKey(key, value);
          });
        }
      }
      if (node.reactiveData) {
        each(node.reactiveData, (expr, key) => {
          const value = evaluator.lookupExpressionValue(expr, data);
          context.setKey(key, value);
        });
      }
    }, { message: 'snippet-args' });
  }

  return context;
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

function cloneInstance({ template, templateName, templateData, self }) {
  const instance = template.clone({
    templateName,
    data: templateData,
    parentTemplate: self.parentTemplate,
    renderingEngine: 'native',
  });
  if (self.parentTemplate?.element) { instance.setElement(self.parentTemplate.element); }
  if (self.parentTemplate) { instance.setParent(self.parentTemplate); }
  instance.initialize();
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

// Wrap the freshly-cloned subtemplate instance's renderer.data in a
// ReactiveDataContext and register one Reaction per reactiveData entry.
// Each Reaction evaluates its source expression in the parent's data
// context and pushes via ctx.setKey. The Reaction's firstRun seeds the
// per-key Signal (Reaction-context contained — source signals register
// as deps of THIS Reaction, not the block's outer Reaction); subsequent
// fires push new values that subscribers reading proxy.key see via
// per-key notify.
//
// The Reactions live on a child scope (self.reactiveDataScope) so a
// template swap can dispose them with one call without disturbing the
// block's own scope or its outer Reaction.
function setupReactiveSubtemplate({ node, data, scope, region, self }) {
  // No reactiveData — naive subtemplate path. Skip the per-key
  // infrastructure entirely; renderer.data stays the original ref and
  // expressions inside the subtemplate flow through dataDep/render
  // unchanged. Critical for mount-cost-sensitive cases like
  // bench-todo's bulk-add-500 when subtemplates without reactive args
  // are common.
  if (!node.reactiveData) { return; }

  // writeToParent: true syncs reactiveData values back into currentInstance.data
  // so closures that captured `data` at createComponent time (e.g. methods
  // doing `data.todo.completed`) see current values. The parent here is the
  // subtemplate's own data ref, not shared, so the write is safe.
  self.reactiveContext = new ReactiveDataContext(self.currentInstance.data, { writeToParent: true });
  self.currentInstance.renderer.data = self.reactiveContext.proxy;
  self.currentInstance.renderer.evaluator.setData(self.reactiveContext.proxy);

  // When a reactiveData key matches one of the subtemplate's declared
  // defaultSettings entries, route the value through the existing settings
  // Proxy too. The settings Proxy maintains its own per-key Signals
  // (createSubtemplateSettings in template.js); writing settings[key] = value
  // fires that signal, so closures capturing `{ settings }` and reading
  // settings[key] track the correct Signal and re-fire when it notifies.
  // Without this, per-key updates would land in reactiveContext but never
  // reach the settings Signal, leaving settings-bound closures stale.
  const defaultSettings = self.currentInstance.defaultSettings;
  const settingsProxy = self.currentInstance.settings;
  const mirrorToSettings = (key, value) => {
    if (settingsProxy && defaultSettings && key in defaultSettings) {
      settingsProxy[key] = value;
    }
  };

  // Single Reaction for all reactiveData entries. The Reaction tracks every
  // source signal across all entries and re-evaluates them on any change.
  // setKey's per-key isEqual gate notifies only the keys whose values
  // actually changed, so per-key isolation at the binding layer is
  // preserved. The trade is one Reaction allocation per subtemplate
  // (down from N), at the cost of re-evaluating unchanged sibling
  // expressions when one source fires — cheap when sources are simple
  // identifier/dotted-path lookups.
  self.reactiveDataScope = scope.child();
  self.reactiveDataScope.reaction(region.anchor, () => {
    each(node.reactiveData, (expr, key) => {
      const value = self.evaluator.lookupExpressionValue(expr, data);
      self.reactiveContext.setKey(key, value);
      mirrorToSettings(key, value);
    });
  }, { message: 'subtemplate-args' });
}

function teardownReactiveSubtemplate(self) {
  if (self.reactiveDataScope) {
    self.reactiveDataScope.dispose();
    self.reactiveDataScope = null;
  }
  if (self.reactiveContext) {
    self.reactiveContext.dispose();
    self.reactiveContext = null;
  }
}

function clearInstance(self, region) {
  if (self.currentInstance) {
    self.currentInstance.onDestroyed();
    self.currentInstance = null;
    self.currentTemplateID = null;
    teardownReactiveSubtemplate(self);
    region.clear();
  }
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
      reactiveContext: null,
      reactiveDataScope: null,
    };
  },

  render({ node, data, region, scope, renderAST, self, isSVG }) {
    const kind = detectKind({ node, data, self });
    if (kind === null) { return; }

    if (kind === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
      const snippetContext = buildSnippetContext(node, data, self.evaluator, scope, region);
      const snippetData = snippetContext ? snippetContext.proxy : data;
      const fragment = renderAST({ ast: snippet.content, data: snippetData, scope, isSVG });
      region.setContent(fragment);
      return;
    }

    self.dataDep.depend();
    const { template, templateName } = resolveSubtemplate(node.name, data, self);
    const blobData = unpackBlobData(node, data, self.evaluator);
    if (!template) { return; }

    self.currentTemplateID = template.id;
    self.currentInstance = cloneInstance({ template, templateName, templateData: blobData, self });
    setupReactiveSubtemplate({ node, data, scope, region, self });
    const fragment = self.currentInstance.render();
    region.setContent(fragment);
    attachToRenderRoot(self.currentInstance, region, self);
  },

  hydrate({ node, data, region, scope, hydrateInto, self }) {
    const kind = detectKind({ node, data, self });
    if (kind === null) { return; }

    if (kind === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
      const snippetContext = buildSnippetContext(node, data, self.evaluator, scope, region);
      const snippetData = snippetContext ? snippetContext.proxy : data;
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
    self.currentInstance = cloneInstance({ template, templateName, templateData: blobData, self });
    setupReactiveSubtemplate({ node, data, scope, region, self });

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
      teardownReactiveSubtemplate(self);
      self.currentTemplateID = template.id;
      self.currentInstance = cloneInstance({ template, templateName, templateData: blobData, self });
      setupReactiveSubtemplate({ node, data, scope, region, self });
      const fragment = self.currentInstance.render();
      region.setContent(fragment);
      attachToRenderRoot(self.currentInstance, region, self);
    }
    else {
      // Same template — push only blob data. ReactiveData propagation
      // happens through the per-key Reactions in self.reactiveDataScope,
      // not through this update path.
      self.currentInstance.setDataContext(blobData, { rerender: false });
      self.currentInstance.render(blobData);
    }
  },

  destroy({ self }) {
    // Snippets have no instance to destroy — region.clear() handles DOM,
    // inner reactions registered against parent scope auto-dispose.
    // reactiveDataScope is a child of the block's scope; its Reactions
    // dispose when the block scope's onDispose runs after this hook.
    if (self.currentInstance) {
      self.currentInstance.onDestroyed();
      self.currentInstance = null;
    }
    if (self.reactiveContext) {
      self.reactiveContext.dispose();
      self.reactiveContext = null;
    }
    self.reactiveDataScope = null;
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
