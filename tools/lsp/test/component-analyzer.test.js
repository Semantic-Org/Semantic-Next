import { readFileSync } from 'fs';
import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { analyzeComponent } from '../src/component-analyzer.js';

const root = resolve(import.meta.dirname, '../../..');

function analyze(relativePath) {
  const filePath = resolve(root, relativePath);
  return analyzeComponent(readFileSync(filePath, 'utf8'), filePath);
}

describe('ComponentAnalyzer', () => {
  /*******************************
      Spec-driven Primitives
  *******************************/

  describe('button (spec-driven)', () => {
    const model = analyze('src/primitives/button/button.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('ui-button');
    });

    it('extracts template path', () => {
      expect(model.templatePath).toContain('button.html');
    });

    it('extracts spec path', () => {
      expect(model.specPath).toContain('button.component');
    });

    it('extracts createComponent methods', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('isIconBefore');
      expect(names).toContain('performAction');
      expect(names).toContain('getForm');
      expect(names).toContain('isDisabled');
    });

    it('extracts method parameters', () => {
      const isSubmitKey = model.instance.find(m => m.name === 'isSubmitKey');
      expect(isSubmitKey.params).toHaveLength(1);
      expect(isSubmitKey.params[0].name).toBe('keyCode');
    });

    it('extracts events', () => {
      expect(model.events).toContain('click .button');
      expect(model.events).toContain('keydown .button');
      expect(model.events).toContain('touchstart .button');
    });
  });

  describe('input (has state)', () => {
    const model = analyze('src/primitives/input/input.js');

    it('extracts defaultState', () => {
      const focused = model.state.find(s => s.name === 'focused');
      expect(focused).toBeTruthy();
      expect(focused.inferredType).toBe('boolean');
      expect(focused.defaultValue).toBe(false);
    });

    it('extracts methods with various patterns', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('initialize');
      expect(names).toContain('hasValue');
      expect(names).toContain('setValue');
      // debounced arrow function property
      expect(names).toContain('setValueDebounced');
    });
  });

  describe('menu (complex, self-referential)', () => {
    const model = analyze('src/primitives/menu/menu.js');

    it('extracts all methods', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('setValue');
      expect(names).toContain('selectValue');
      expect(names).toContain('getMenuItems');
      expect(names).toContain('getActiveIndex');
      expect(names).toContain('getItemByValue');
      expect(names.length).toBeGreaterThanOrEqual(10);
    });

    it('extracts negative number state', () => {
      const activeIndex = model.state.find(s => s.name === 'activeIndex');
      expect(activeIndex.inferredType).toBe('number');
      expect(activeIndex.defaultValue).toBe(-1);
    });

    it('extracts deep event DSL', () => {
      expect(model.events).toContain('deep click menu-item');
    });
  });

  /*******************************
      Import Resolution
  *******************************/

  describe('import resolution', () => {
    it('resolves ?raw template imports', () => {
      const model = analyze('src/primitives/button/button.js');
      expect(model.templatePath).toContain('button.html');
    });

    it('resolves componentSpec imports', () => {
      const model = analyze('src/primitives/button/button.js');
      expect(model.specPath).toContain('button.component');
    });
  });

  /*******************************
      Components with various export styles
  *******************************/

  describe('modal (named export, default params)', () => {
    const model = analyze('src/primitives/modal/modal.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('ui-modal');
    });

    it('extracts methods with default parameter values', () => {
      const show = model.instance.find(m => m.name === 'show');
      expect(show).toBeTruthy();
      expect(show.params).toHaveLength(1);
      expect(show.params[0].name).toBe('callback');
    });

    it('extracts hide method', () => {
      const hide = model.instance.find(m => m.name === 'hide');
      expect(hide).toBeTruthy();
    });
  });

  describe('label (empty createComponent body)', () => {
    const model = analyze('src/primitives/label/label.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('ui-label');
    });

    it('returns empty instance methods for empty body', () => {
      expect(model.instance).toEqual([]);
    });

    it('resolves template path', () => {
      expect(model.templatePath).toContain('label.html');
    });
  });

  describe('card (empty createComponent with destructured param)', () => {
    const model = analyze('src/primitives/card/card.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('ui-card');
    });

    it('returns empty instance for empty body', () => {
      expect(model.instance).toEqual([]);
    });
  });

  /*******************************
      Components with settings and state
  *******************************/

  describe('copy-button (component with defaultSettings and defaultState)', () => {
    const model = analyze('src/components/copy-button/copy-button.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('copy-button');
    });

    it('extracts defaultSettings with various types', () => {
      const text = model.settings.find(s => s.name === 'text');
      expect(text).toBeTruthy();
      expect(text.inferredType).toBe('string');
      expect(text.defaultValue).toBe('');

      const resetDelay = model.settings.find(s => s.name === 'resetDelay');
      expect(resetDelay).toBeTruthy();
      expect(resetDelay.inferredType).toBe('number');
      expect(resetDelay.defaultValue).toBe(2000);

      const tooltip = model.settings.find(s => s.name === 'tooltip');
      expect(tooltip).toBeTruthy();
      expect(tooltip.inferredType).toBe('boolean');
      expect(tooltip.defaultValue).toBe(true);
    });

    it('extracts nested object settings as type "object"', () => {
      const tooltipSettings = model.settings.find(s => s.name === 'tooltipSettings');
      expect(tooltipSettings).toBeTruthy();
      expect(tooltipSettings.inferredType).toBe('object');
    });

    it('extracts defaultState', () => {
      const copied = model.state.find(s => s.name === 'copied');
      expect(copied).toBeTruthy();
      expect(copied.inferredType).toBe('boolean');
      expect(copied.defaultValue).toBe(false);
    });

    it('extracts instance methods', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('getIcon');
      expect(names).toContain('copy');
    });
  });

  describe('global-search (complex component with many methods)', () => {
    const model = analyze('src/components/global-search/global-search.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('global-search');
    });

    it('extracts large state object', () => {
      const stateNames = model.state.map(s => s.name);
      expect(stateNames).toContain('rawResults');
      expect(stateNames).toContain('results');
      expect(stateNames).toContain('displayResults');
      expect(stateNames).toContain('selectedIndex');
      expect(stateNames).toContain('searchTerm');
      expect(stateNames).toContain('noResults');
      expect(stateNames).toContain('modalOpen');
    });

    it('infers types for various state defaults', () => {
      const rawResults = model.state.find(s => s.name === 'rawResults');
      expect(rawResults.inferredType).toBe('array');
      expect(rawResults.defaultValue).toEqual([]);

      const selectedIndex = model.state.find(s => s.name === 'selectedIndex');
      expect(selectedIndex.inferredType).toBe('number');
      expect(selectedIndex.defaultValue).toBe(0);

      const searchTerm = model.state.find(s => s.name === 'searchTerm');
      expect(searchTerm.inferredType).toBe('string');

      const noResults = model.state.find(s => s.name === 'noResults');
      expect(noResults.inferredType).toBe('boolean');
    });

    it('handles undefined default value', () => {
      const selectedResult = model.state.find(s => s.name === 'selectedResult');
      expect(selectedResult).toBeTruthy();
      // undefined is not a Literal, so it is inferred as any
      expect(selectedResult.defaultValue).toBeUndefined();
    });

    it('extracts settings with string defaults', () => {
      const baseURL = model.settings.find(s => s.name === 'baseURL');
      expect(baseURL).toBeTruthy();
      expect(baseURL.inferredType).toBe('string');
      expect(baseURL.defaultValue).toBe('/');
    });

    it('extracts many instance methods', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('initialize');
      expect(names).toContain('openModal');
      expect(names).toContain('hideModal');
      expect(names).toContain('calculateLoadSearch');
      expect(names).toContain('calculateResults');
      expect(names).toContain('highlightMatch');
      expect(names).toContain('mapResult');
      expect(names).toContain('selectPrevious');
      expect(names).toContain('selectNext');
      expect(names).toContain('visitResult');
    });

    it('extracts method parameters', () => {
      const highlightMatch = model.instance.find(m => m.name === 'highlightMatch');
      expect(highlightMatch.params).toHaveLength(2);
      expect(highlightMatch.params[0].name).toBe('text');
      expect(highlightMatch.params[1].name).toBe('searchTerm');
    });
  });

  /*******************************
      Robustness with getText patterns
  *******************************/

  describe('todo-list (getText import pattern)', () => {
    const model = analyze('docs/src/examples/component/todo-list/component.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('todo-app');
    });

    it('resolves getText template path', () => {
      // getText('./component.html') should be detected
      expect(model.templatePath).toContain('component.html');
    });

    it('extracts subTemplates', () => {
      expect(model.subTemplates).toHaveProperty('todoItem');
    });

    it('extracts state', () => {
      const names = model.state.map(s => s.name);
      expect(names).toContain('todos');
      expect(names).toContain('filter');
      expect(names).toContain('editingId');
    });

    it('infers null state as null type', () => {
      const editingId = model.state.find(s => s.name === 'editingId');
      expect(editingId.inferredType).toBe('null');
      expect(editingId.defaultValue).toBe(null);
    });

    it('extracts all methods from complex createComponent', () => {
      const names = model.instance.map(m => m.name);
      expect(names).toContain('initialize');
      expect(names).toContain('loadTodos');
      expect(names).toContain('hasTodos');
      expect(names).toContain('filteredTodos');
      expect(names).toContain('activeCount');
      expect(names).toContain('addTodo');
      expect(names).toContain('toggleTodo');
      expect(names).toContain('toggleAll');
      expect(names).toContain('deleteTodo');
      expect(names).toContain('saveTodo');
      expect(names).toContain('clearCompleted');
    });

    it('extracts method with parameter', () => {
      const addTodo = model.instance.find(m => m.name === 'addTodo');
      expect(addTodo.params).toHaveLength(1);
      expect(addTodo.params[0].name).toBe('title');

      const saveTodo = model.instance.find(m => m.name === 'saveTodo');
      expect(saveTodo.params).toHaveLength(2);
    });
  });

  describe('subtemplates example (getText + subTemplates)', () => {
    const model = analyze('docs/src/examples/templates/subtemplates/component.js');

    it('extracts tagName', () => {
      expect(model.tagName).toBe('ui-table');
    });

    it('extracts subTemplates', () => {
      expect(model.subTemplates).toHaveProperty('row');
    });

    it('extracts createComponent non-function returns', () => {
      // createComponent returns {rows: [...]}, a non-function property
      const rows = model.instance.find(m => m.name === 'rows');
      expect(rows).toBeTruthy();
      expect(rows.params).toEqual([]);
    });
  });

  /*******************************
      Edge Cases
  *******************************/

  describe('edge cases', () => {
    it('handles component with createComponent that has methods', () => {
      const model = analyze('src/primitives/divider/divider.js');
      expect(model.tagName).toBeTruthy();
      // divider has methods — that's fine, just verify it doesn't crash
      expect(Array.isArray(model.instance)).toBe(true);
    });

    it('returns empty model for unparseable source', () => {
      const model = analyzeComponent('this is not valid JS }{}{', '/nonexistent/path.js');
      expect(model.filePath).toBe('/nonexistent/path.js');
      expect(model.tagName).toBeNull();
      expect(model.instance).toEqual([]);
    });

    it('handles divider (simple component with methods)', () => {
      const model = analyze('src/primitives/divider/divider.js');
      expect(model.tagName).toBe('ui-divider');

      const names = model.instance.map(m => m.name);
      expect(names).toContain('hasContent');
      expect(names).toContain('getDividerClasses');
      expect(names).toContain('getOrientation');
      expect(names).toContain('getAriaProp');
    });

    it('handles method with a single param name extraction', () => {
      const model = analyze('src/primitives/divider/divider.js');
      const getAriaProp = model.instance.find(m => m.name === 'getAriaProp');
      expect(getAriaProp.params).toHaveLength(1);
      expect(getAriaProp.params[0].name).toBe('propName');
    });

    it('handles spinner (minimal component)', () => {
      const model = analyze('src/primitives/spinner/spinner.js');
      expect(model.tagName).toBe('ui-spinner');
      expect(model.instance).toEqual([]);
    });

    it('all primitives can be analyzed without crashing', () => {
      const primitives = [
        'button', 'card', 'container', 'divider', 'icon',
        'image', 'input', 'label', 'menu', 'modal',
        'rail', 'segment', 'spinner', 'table',
      ];
      for (const name of primitives) {
        const model = analyze(`src/primitives/${name}/${name}.js`);
        expect(model.tagName, `${name} should have tagName`).toBeTruthy();
        expect(Array.isArray(model.instance), `${name} instance should be array`).toBe(true);
        expect(Array.isArray(model.state), `${name} state should be array`).toBe(true);
        expect(Array.isArray(model.settings), `${name} settings should be array`).toBe(true);
      }
    });
  });
});
