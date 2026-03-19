import { defineComponent } from '@semantic-ui/component';
import { DocsSpecReader } from '@semantic-ui/specs';
import { each } from '@semantic-ui/utils';

import css from './SpecimenExplorer.css?raw';
import template from './SpecimenExplorer.html?raw';

import { Panel, Panels } from '@semantic-ui/core';
import CodeSample from '../CodeSample/CodeSample.js';
import { SimpleSelect } from './SimpleSelect.js';

const defaultSettings = {
  spec: '',
};

const defaultState = {
  selections: {},
  dialect: 'standard',
};

const createComponent = ({ self, state, settings, $ }) => ({
  reader: null,
  parsedSpec: null,

  dialectMenuItems: [
    { label: 'Standard', value: 'standard' },
    { label: 'Verbose', value: 'verbose' },
    { label: 'Classic', value: 'classic' },
  ],

  initialize() {
    const specJSON = settings.spec;
    if (!specJSON) {
      return;
    }
    self.parsedSpec = typeof specJSON === 'string' ? JSON.parse(specJSON) : specJSON;
    self.reader = new DocsSpecReader(self.parsedSpec);
  },

  getControlGroups() {
    if (!self.parsedSpec) {
      return [];
    }
    const spec = self.parsedSpec;
    const groups = [];
    const getAttr = (part) => part.attribute || part.name?.toLowerCase();

    // Types
    const typeControls = [];
    each(spec.types, (type) => {
      if (type.options?.length) {
        typeControls.push({
          type: 'radio',
          name: type.name,
          attribute: getAttr(type),
          options: type.options.map(opt => ({ name: opt.name || opt.value, value: opt.value })),
        });
      }
      else {
        typeControls.push({ type: 'checkbox', name: type.name, attribute: getAttr(type) });
      }
    });
    if (typeControls.length) {
      groups.push({ label: 'Types', controls: typeControls });
    }

    // States
    const stateControls = [];
    each(spec.states, (item) => {
      stateControls.push({ type: 'checkbox', name: item.name, attribute: getAttr(item) });
    });
    if (stateControls.length) {
      groups.push({ label: 'States', controls: stateControls });
    }

    // Content
    const contentControls = [];
    each(spec.content, (item) => {
      contentControls.push({
        type: 'text',
        name: item.name,
        attribute: getAttr(item),
        defaultValue: self.getDefaultContentValue(item),
        placeholder: item.name.toLowerCase(),
      });
    });
    if (contentControls.length) {
      groups.push({ label: 'Content', controls: contentControls });
    }

    // Variations
    const variationControls = [];
    each(spec.variations, (variation) => {
      if (variation.options?.length) {
        variationControls.push({
          type: 'radio',
          name: variation.name,
          attribute: getAttr(variation),
          options: variation.options.map(opt => ({ name: opt.name || opt.value, value: opt.value })),
        });
      }
      else {
        variationControls.push({ type: 'checkbox', name: variation.name, attribute: getAttr(variation) });
      }
    });
    if (variationControls.length) {
      groups.push({ label: 'Variations', controls: variationControls });
    }

    if (groups.length) {
      groups[groups.length - 1].last = true;
    }
    return groups;
  },

  getDefaultContentValue(contentItem) {
    if (contentItem.attribute === 'icon') { return 'star'; }
    if (contentItem.attribute === 'badge') { return '5'; }
    return contentItem.name.toLowerCase();
  },

  // Selection helpers
  isSelected(attribute, value) {
    return state.selections.get()[attribute] === value;
  },

  isNoneSelected(attribute) {
    return !state.selections.get()[attribute];
  },

  hasSelection(attribute) {
    const selections = state.selections.get();
    return attribute in selections && selections[attribute] !== undefined;
  },

  getSelection(attribute) {
    return state.selections.get()[attribute] || '';
  },

  setSelection(attribute, value) {
    const selections = { ...state.selections.get() };
    if (value === '' || value === undefined || value === false) {
      delete selections[attribute];
    }
    else {
      selections[attribute] = value;
    }
    state.selections.set(selections);
  },

  // Code generation
  getCodeOutput() {
    if (!self.reader) { return ''; }

    const selections = state.selections.get();
    const dialect = state.dialect.get();
    const reader = new DocsSpecReader(self.parsedSpec, { dialect });

    const modifiers = [];
    const innerHTML = (self.parsedSpec.examples?.defaultContent || self.parsedSpec.name || '').trim();

    each(selections, (value, attribute) => {
      // Skip slot-based content (not icon/badge which are attributes)
      const isContent = self.parsedSpec.content?.some(c => (c.attribute || c.name?.toLowerCase()) === attribute);
      if (isContent && attribute !== 'icon' && attribute !== 'badge') { return; }

      if (value === attribute || value === true) {
        modifiers.push(attribute);
      }
      else {
        modifiers.push(reader.getConciseModifier(attribute, value));
      }
    });

    return reader.getCodeFromModifiers(modifiers.join(' '), { html: innerHTML });
  },

  // Live preview
  updatePreview() {
    const frame = $('.component-frame').el();
    if (!frame || !self.parsedSpec) { return; }

    const tagName = self.parsedSpec.tagName;
    const selections = state.selections.get();

    // Create or reuse the live component
    let component = frame.querySelector(tagName);
    if (!component) {
      component = document.createElement(tagName);
      component.innerHTML = (self.parsedSpec.examples?.defaultContent || self.parsedSpec.name || '').trim();
      frame.innerHTML = '';
      frame.appendChild(component);
    }

    // Sync all spec attributes with current selections
    const allAttrs = self.getAllSpecAttributes();
    each(allAttrs, (attr) => {
      if (attr in selections) {
        const value = selections[attr];
        if (value === true || value === attr) {
          component.setAttribute(attr, '');
        }
        else {
          component.setAttribute(attr, value);
        }
      }
      else {
        component.removeAttribute(attr);
      }
    });
  },

  getAllSpecAttributes() {
    const spec = self.parsedSpec;
    if (!spec) { return []; }
    const attrs = [];
    const add = (item) => {
      const attr = item.attribute || item.name?.toLowerCase();
      if (attr) { attrs.push(attr); }
    };
    each(spec.types || [], add);
    each(spec.states || [], add);
    each(spec.content || [], add);
    each(spec.variations || [], add);
    return attrs;
  },
});

const events = {
  'change input[type="checkbox"]'({ self, data, event }) {
    if (event.target.checked) {
      self.setSelection(data.attribute, data.content ? data.value : data.attribute);
    }
    else {
      self.setSelection(data.attribute, undefined);
    }
  },

  'input input[data-text-input]'({ self, data, value }) {
    self.setSelection(data.attribute, value);
  },

  'change .dialect-menu'({ state, value }) {
    state.dialect.set(value);
  },
};

const onRendered = ({ self, reaction, state, isClient }) => {
  if (!isClient) { return; }
  reaction(() => {
    state.selections.get();
    self.updatePreview();
  });
};

const SpecimenExplorer = defineComponent({
  tagName: 'specimen-explorer',
  template,
  css,
  events,
  onRendered,
  createComponent,
  defaultSettings,
  defaultState,
  subTemplates: { SimpleSelect },
});

export default SpecimenExplorer;
export { SpecimenExplorer };
