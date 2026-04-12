import { Reaction } from '@semantic-ui/reactivity';
import { Template } from '@semantic-ui/templating';
import { each, isPlainObject, isString } from '@semantic-ui/utils';
import { defineBlock } from '../define-block.js';
import { isItemContext } from './each.js';
import { registerBlock } from './registry.js';

/*

  {>templateName} subtemplate invocation. The snippet variant of the same
  syntax is NOT handled here — renderer.js forks snippet names to
  inlineSnippet before dispatching to this block, because snippets have
  no DynamicRegion, no reaction, no instance lifecycle.

  Template lifecycle: resolve name → lookup/instance → clone + initialize
  → render. Subsequent ticks re-evaluate the name; if it resolves to a
  different template, swap (destroy old, clone new); otherwise push new
  data into the existing instance via setDataContext + render.

  Two-level context use: create() receives dispatch-level bag and stashes
  renderer.evaluator / renderer.subTemplates / renderer.template /
  renderer.dataDep onto self. The 9-key author bag stays honest; subsequent
  hooks read from self.* rather than reaching through scope.

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

function resolveTemplate(nameExpr, data, self) {
  const templateOrName = self.evaluator.lookupExpressionValue(nameExpr, data);
  if (isString(templateOrName)) {
    return { template: self.subTemplates?.[templateOrName], templateName: templateOrName };
  }
  if (templateOrName instanceof Template) {
    return { template: templateOrName, templateName: templateOrName.templateName };
  }
  return { template: null, templateName: null };
}

function cloneInstance({ template, templateName, templateData, self }) {
  const instance = template.clone({
    templateName,
    subTemplates: self.subTemplates,
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

  create({ renderer }) {
    return {
      evaluator: renderer.evaluator,
      subTemplates: renderer.subTemplates,
      parentTemplate: renderer.template,
      dataDep: renderer.dataDep,
      currentTemplateID: null,
      currentInstance: null,
    };
  },

  render({ node, data, region, self }) {
    self.dataDep.depend();
    const { template, templateName } = resolveTemplate(node.name, data, self);
    const templateData = unpackNodeData(node, data, self.evaluator);

    if (!template) { return; }

    self.currentTemplateID = template.id;
    self.currentInstance = cloneInstance({ template, templateName, templateData, self });
    const fragment = self.currentInstance.render();
    region.setContent(fragment);
    attachToRenderRoot(self.currentInstance, region, self);
  },

  hydrate({ node, data, region, self }) {
    self.dataDep.depend();
    const { template, templateName } = resolveTemplate(node.name, data, self);
    const templateData = unpackNodeData(node, data, self.evaluator);

    if (!template) { return; }

    self.currentTemplateID = template.id;
    self.currentInstance = cloneInstance({ template, templateName, templateData, self });

    if (region.ownedNodes.length > 0) {
      const { entries } = self.currentInstance.renderer.buildHTMLString(self.currentInstance.ast);
      if (entries.length > 0) {
        const container = document.createDocumentFragment();
        for (const n of [...region.ownedNodes]) { container.appendChild(n); }
        self.currentInstance.renderer.hydrateMarkers(
          container,
          entries,
          self.currentInstance.renderer.data,
          self.currentInstance.renderer.scope,
        );
        const frag = document.createDocumentFragment();
        for (const n of [...container.childNodes]) { frag.appendChild(n); }
        region.anchor.after(frag);
        const collected = [];
        let sibling = region.anchor.nextSibling;
        while (sibling) {
          collected.push(sibling);
          sibling = sibling.nextSibling;
        }
        region.ownedNodes = collected;
      }
    }

    self.currentInstance.rendered = true;
    if (region.ownedNodes.length > 0) {
      attachToRenderRoot(self.currentInstance, region, self, { startNode: region.ownedNodes[0] });
    }
  },

  update({ node, data, region, self }) {
    self.dataDep.depend();
    const { template, templateName } = resolveTemplate(node.name, data, self);
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
