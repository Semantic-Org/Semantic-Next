import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { each, fatal, isPlainObject, isString, keys } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { isItemContext } from './each.js';
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
                  attach. Updates re-evaluate name, swap instance if it
                  changed, otherwise push new data via setDataContext.

  Two-level context use: create() receives dispatch-level bag and stashes
  renderer.evaluator / renderer.subTemplates / renderer.snippets /
  renderer.template / renderer.dataDep onto self. The 9-key author bag
  stays honest; subsequent hooks read from self.* rather than reaching
  through scope.

*/

function unpackNodeData(node, data, evaluator) {
  let templateData = {};
  if (node.data) {
    if (isString(node.data)) {
      const evaluated = evaluator.lookupExpressionValue(node.data, data);
      if (isPlainObject(evaluated)) {
        templateData = { ...templateData, ...evaluated };
      }
    }
    else if (isPlainObject(node.data)) {
      // Inside {#each}, read reactively so item-signal mutations propagate
      // into subtemplate data. Outside each, static data={} stays non-reactive.
      const inItemContext = isItemContext(data);
      each(node.data, (expr, key) => {
        templateData[key] = inItemContext
          ? evaluator.lookupExpressionValue(expr, data)
          : Reaction.nonreactive(() => evaluator.lookupExpressionValue(expr, data));
      });
    }
  }
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      templateData[key] = evaluator.lookupExpressionValue(expr, data);
    });
  }
  return templateData;
}

// Snippet-arg overlay proxy. Args become lazy getters that re-evaluate
// against the parent data context at access time, tracking the same
// Signal deps a fresh-render snippet would. The has/ownKeys/descriptor
// traps make `prop in snippetData` and Object.keys() see the args.
function buildSnippetProxy(node, data, evaluator) {
  const staticGetters = {};
  const reactiveGetters = {};

  if (node.data) {
    if (isString(node.data)) {
      const evaluated = evaluator.lookupExpressionValue(node.data, data);
      if (isPlainObject(evaluated)) {
        each(evaluated, (val, key) => {
          staticGetters[key] = () => val;
        });
      }
    }
    else if (isPlainObject(node.data)) {
      each(node.data, (expr, key) => {
        staticGetters[key] = () => evaluator.lookupExpressionValue(expr, data);
      });
    }
  }
  if (node.reactiveData) {
    each(node.reactiveData, (expr, key) => {
      reactiveGetters[key] = () => evaluator.lookupExpressionValue(expr, data);
    });
  }

  const allGetters = { ...staticGetters, ...reactiveGetters };
  const getterKeys = keys(allGetters);

  return new Proxy(data, {
    get(target, prop) {
      if (typeof prop === 'symbol') { return target[prop]; }
      if (prop in allGetters) { return allGetters[prop](); }
      return target[prop];
    },
    has(target, prop) {
      return (prop in allGetters) || (prop in target);
    },
    ownKeys(target) {
      return [...new Set([...getterKeys, ...Reflect.ownKeys(target)])];
    },
    getOwnPropertyDescriptor(target, prop) {
      if (prop in allGetters) {
        return { configurable: true, enumerable: true, get: allGetters[prop] };
      }
      return Object.getOwnPropertyDescriptor(target, prop);
    },
  });
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

function clearInstance(self, region) {
  if (self.currentInstance) {
    self.currentInstance.onDestroyed();
    self.currentInstance = null;
    self.currentTemplateID = null;
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
    };
  },

  render({ node, data, region, scope, renderAST, self, isSVG }) {
    const kind = detectKind({ node, data, self });
    if (kind === null) { return; }

    if (kind === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
      const snippetData = buildSnippetProxy(node, data, self.evaluator);
      const fragment = renderAST({ ast: snippet.content, data: snippetData, scope, isSVG });
      region.setContent(fragment);
      return;
    }

    self.dataDep.depend();
    const { template, templateName } = resolveSubtemplate(node.name, data, self);
    const templateData = unpackNodeData(node, data, self.evaluator);
    if (!template) { return; }

    self.currentTemplateID = template.id;
    self.currentInstance = cloneInstance({ template, templateName, templateData, self });
    const fragment = self.currentInstance.render();
    region.setContent(fragment);
    attachToRenderRoot(self.currentInstance, region, self);
  },

  hydrate({ node, data, region, hydrateInto, self }) {
    const kind = detectKind({ node, data, self });
    if (kind === null) { return; }

    if (kind === 'snippet') {
      const snippet = resolveSnippet(node.name, data, self);
      if (!snippet) { fatal(`Snippet name resolved to a missing snippet`); }
      const snippetData = buildSnippetProxy(node, data, self.evaluator);
      if (region.ownedNodes.length > 0) {
        // Snippet args reactivity is anchored on the block scope; a child
        // would dispose with the next region.clear() and break arg reactivity.
        hydrateInto({ innerAST: snippet.content, data: snippetData, asChild: false });
      }
      return;
    }

    self.dataDep.depend();
    const { template, templateName } = resolveSubtemplate(node.name, data, self);
    const templateData = unpackNodeData(node, data, self.evaluator);
    if (!template) { return; }

    self.currentTemplateID = template.id;
    self.currentInstance = cloneInstance({ template, templateName, templateData, self });

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

  update({ node, data, region, self }) {
    // Snippets are one-shot at mount — name reactivity at the outer level
    // is documented as undefined (kind shouldn't change), and inner
    // expression reactivity is handled by the snippet-arg proxy's lazy
    // getters via per-marker Reactions wired during render/hydrate.
    if (self.kind === 'snippet') { return; }

    self.dataDep.depend();
    const { template, templateName } = resolveSubtemplate(node.name, data, self);
    const templateData = unpackNodeData(node, data, self.evaluator);

    if (!template) {
      clearInstance(self, region);
      return;
    }

    if (template.id !== self.currentTemplateID) {
      if (self.currentInstance) { self.currentInstance.onDestroyed(); }
      self.currentTemplateID = template.id;
      self.currentInstance = cloneInstance({ template, templateName, templateData, self });
      const fragment = self.currentInstance.render();
      region.setContent(fragment);
      attachToRenderRoot(self.currentInstance, region, self);
    }
    else {
      self.currentInstance.setDataContext(templateData, { rerender: false });
      self.currentInstance.render(templateData);
    }
  },

  destroy({ self }) {
    // Snippets have no instance to destroy — region.clear() handles DOM,
    // inner reactions registered against parent scope auto-dispose.
    if (self.currentInstance) {
      self.currentInstance.onDestroyed();
      self.currentInstance = null;
    }
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
