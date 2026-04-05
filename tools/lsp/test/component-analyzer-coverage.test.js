import { resolve } from 'path';
import { describe, expect, it } from 'vitest';
import { analyzeComponent } from '../src/component-analyzer.js';

const root = resolve(import.meta.dirname, '../../..');

function analyze(relativePath) {
  return analyzeComponent(resolve(root, relativePath));
}

describe('ComponentAnalyzer — real-world coverage', () => {

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
      Edge cases: malformed/minimal input
  *******************************/

  describe('edge cases', () => {
    it('returns empty model for non-existent file', () => {
      expect(() => {
        analyzeComponent('/nonexistent/path.js');
      }).toThrow();
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
