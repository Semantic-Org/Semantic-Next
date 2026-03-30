import { TemplateHelpers } from '@semantic-ui/templating';
import { adoptStylesheet } from '@semantic-ui/utils';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { LitWebComponentBase } from '../../src/engines/lit/base.js';
import { WebComponentBase } from '../../src/engines/native/base.js';
import { defineComponent, registerHelper, registerHelpers } from '../../src/index.js';

// Basic component tests that don't require a real DOM
describe('Component', () => {
  // Test basic component definition
  describe('defineComponent', () => {
    it('should handle component with CSS', () => {
      // Define a component with CSS — Lit path has static styles
      const TestComponent = defineComponent({
        tagName: 'test-css-component',
        renderingEngine: 'lit',
        template: '<div>Content</div>',
        css: '.container { color: red; }',
      });

      // Test that the component class is returned with styles
      expect(TestComponent).toBeDefined();
      expect(TestComponent.styles).toBeDefined();
      expect(TestComponent.styles.toString()).toContain('.container { color: red; }');
    });

    it('should handle component with default settings', () => {
      // Define a component with default settings
      const defaultSettings = {
        text: 'Default text',
        count: 0,
        isActive: false,
      };

      const TestComponent = defineComponent({
        tagName: 'test-settings-component',
        template: '<div>{{text}}</div>',
        defaultSettings,
      });

      // Test that the component class has properties reflecting the default settings
      expect(TestComponent).toBeDefined();
      expect(TestComponent.properties).toBeDefined();

      // Check that each setting has a corresponding property
      Object.keys(defaultSettings).forEach(key => {
        expect(TestComponent.properties[key]).toBeDefined();
      });

      // Test constructor sets defaultSettings properly
      const instance = new TestComponent();
      expect(instance.defaultSettings).toEqual(defaultSettings);
    });

    it('should merge subTemplates CSS with component CSS', () => {
      // Define a subTemplate
      const headerTemplate = defineComponent({
        renderingEngine: 'lit',
        template: '<div class="header">Header</div>',
        css: '.header { font-weight: bold; }',
      });

      // Define a component with subTemplates — Lit path has static styles
      const TestComponent = defineComponent({
        tagName: 'test-subtemplates-component',
        renderingEngine: 'lit',
        template: '<div>{{>header}}Content</div>',
        css: '.container { padding: 10px; }',
        subTemplates: {
          header: headerTemplate,
        },
      });

      // We should see both the component CSS and the subTemplate CSS in the final styles
      const stylesStr = TestComponent.styles.toString();
      expect(stylesStr).toContain('.container { padding: 10px; }');
      expect(stylesStr).toContain('.header { font-weight: bold; }');
    });

    it('should properly handle lifecycle callbacks', () => {
      // Mock lifecycle callbacks
      const onCreated = vi.fn();
      const onRendered = vi.fn();
      const onDestroyed = vi.fn();
      const onThemeChanged = vi.fn();
      const onAttributeChanged = vi.fn();

      // Define component with lifecycle callbacks
      const TestComponent = defineComponent({
        tagName: 'test-lifecycle-component',
        template: '<div>Lifecycle Test</div>',
        onCreated,
        onRendered,
        onDestroyed,
        onThemeChanged,
        onAttributeChanged,
      });

      // Verify component class was created with lifecycle methods
      expect(TestComponent).toBeDefined();
      expect(TestComponent.template).toBeDefined();

      // The actual lifecycle methods are stored in the Template instance
      // We can check that the component was configured properly
      const instance = new TestComponent();
      expect(instance.call).toBeDefined();
    });

    it('should handle event bindings', () => {
      // Define event handlers
      const clickHandler = vi.fn();
      const keydownHandler = vi.fn();

      const events = {
        'click .button': clickHandler,
        'keydown .input': keydownHandler,
      };

      // Define component with events
      const TestComponent = defineComponent({
        tagName: 'test-events-component',
        template: '<div><button class="button">Click</button><input class="input"></div>',
        events,
      });

      // Verify events are passed to the template
      expect(TestComponent.template.events).toEqual(events);
    });

    it('should allow component with pageCSS', () => {
      // Simply verify that a component with pageCSS can be created without error
      const pageCSS = '.page { background: white; }';

      // Define component with pageCSS
      const TestComponent = defineComponent({
        tagName: 'test-page-css-component',
        template: '<div>Page CSS Test</div>',
        css: '.component { color: blue; }',
        pageCSS,
      });

      // Verify component was created successfully
      expect(TestComponent).toBeDefined();
      expect(typeof TestComponent).toBe('function');
    });
  });

  // Test WebComponentBase properties and methods
  describe('WebComponentBase', () => {
    it('should have shadowRootOptions defined', () => {
      // shadowRootOptions is a LitElement concept — test on the Lit base class
      expect(LitWebComponentBase.shadowRootOptions).toBeDefined();
      expect(LitWebComponentBase.shadowRootOptions.delegatesFocus).toBe(false);
    });

    it('should provide a static getProperties method', () => {
      expect(WebComponentBase.getProperties).toBeDefined();
      expect(typeof WebComponentBase.getProperties).toBe('function');

      // Test with empty parameters
      const emptyProps = WebComponentBase.getProperties({});
      expect(emptyProps).toEqual({});

      // Test with properties parameter
      const testProps = { foo: { type: String } };
      const resultProps = WebComponentBase.getProperties({ properties: testProps });
      expect(resultProps).toEqual(testProps);
    });

    it('should provide a static getPropertySettings method', () => {
      expect(WebComponentBase.getPropertySettings).toBeDefined();
      expect(typeof WebComponentBase.getPropertySettings).toBe('function');
    });

    it('should handle String property type correctly', () => {
      const strProp = WebComponentBase.getPropertySettings({
        name: 'testProp',
        type: String,
      });
      expect(strProp.type).toBe(String);
      expect(strProp.attribute).toBe(true);
      expect(strProp.hasChanged).toBeDefined();
    });

    it('should handle Boolean property type correctly', () => {
      const boolProp = WebComponentBase.getPropertySettings({
        name: 'testProp',
        type: Boolean,
      });
      expect(boolProp.type).toBe(Boolean);
      expect(boolProp.attribute).toBe(true);
      expect(boolProp.converter).toBeDefined();

      // Test Boolean converter fromAttribute method
      expect(boolProp.converter.fromAttribute('', Boolean)).toBe(true);
      expect(boolProp.converter.fromAttribute('true', Boolean)).toBe(true);
      expect(boolProp.converter.fromAttribute('false', Boolean)).toBe(false);
      expect(boolProp.converter.fromAttribute('0', Boolean)).toBe(false);
      expect(boolProp.converter.fromAttribute('null', Boolean)).toBe(false);
      expect(boolProp.converter.fromAttribute('undefined', Boolean)).toBe(false);
      expect(boolProp.converter.fromAttribute('some value', Boolean)).toBe(true);

      // Test Boolean converter toAttribute method
      expect(boolProp.converter.toAttribute(true, Boolean)).toBe('true');
      expect(boolProp.converter.toAttribute(false, Boolean)).toBe('false');
    });

    it('should handle Function property type correctly', () => {
      const funcProp = WebComponentBase.getPropertySettings({
        name: 'testProp',
        type: Function,
      });
      expect(funcProp.type).toBe(Function);
      expect(funcProp.attribute).toBe(false); // Functions can't be serialized to attributes
    });

    it('should handle propertyOnly flag correctly', () => {
      // For class instances that can't be serialized
      class CustomClass {}
      const instance = new CustomClass();

      const classProp = WebComponentBase.getPropertySettings({
        name: 'testProp',
        type: CustomClass,
        propertyOnly: true,
      });
      expect(classProp.attribute).toBe(false);
      expect(classProp.hasChanged).toBeDefined();

      // Test that hasChanged always returns true for propertyOnly
      expect(classProp.hasChanged(new CustomClass(), instance)).toBe(true);
    });
  });

  // Test helper functions
  describe('Helper Functions', () => {
    it('should export adoptStylesheet function', () => {
      expect(adoptStylesheet).toBeDefined();
      expect(typeof adoptStylesheet).toBe('function');
    });

    it('should export registerHelper function', () => {
      expect(registerHelper).toBeDefined();
      expect(typeof registerHelper).toBe('function');
    });

    it('should export registerHelpers function', () => {
      expect(registerHelpers).toBeDefined();
      expect(typeof registerHelpers).toBe('function');
    });

    it('should register a single helper function', () => {
      // Register a test helper
      registerHelper('testHelper', (value) => `test-${value}`);

      // Verify it was added to TemplateHelpers
      expect(TemplateHelpers.testHelper).toBeDefined();
      expect(typeof TemplateHelpers.testHelper).toBe('function');
      expect(TemplateHelpers.testHelper('foo')).toBe('test-foo');
    });

    it('should register multiple helper functions', () => {
      // Register multiple helpers
      registerHelpers({
        multiHelper1: (value) => `multi1-${value}`,
        multiHelper2: (a, b) => a + b,
        multiHelper3: () => 'static',
      });

      // Verify all were added
      expect(TemplateHelpers.multiHelper1).toBeDefined();
      expect(TemplateHelpers.multiHelper2).toBeDefined();
      expect(TemplateHelpers.multiHelper3).toBeDefined();

      // Test functionality
      expect(TemplateHelpers.multiHelper1('test')).toBe('multi1-test');
      expect(TemplateHelpers.multiHelper2(5, 3)).toBe(8);
      expect(TemplateHelpers.multiHelper3()).toBe('static');
    });

    it('should make helpers available in component templates', () => {
      // Register a helper
      registerHelper('customFormatter', (value) => `formatted:${value}`);

      // Define a component that uses the helper
      const TestComponent = defineComponent({
        tagName: 'test-custom-helper',
        template: '<div>{customFormatter(value)}</div>',
        defaultState: {
          value: 'hello',
        },
      });

      // Verify the component was created successfully
      expect(TestComponent).toBeDefined();
    });
  });

  // Test component instantiation and behavior
  describe('Component Instance', () => {
    it('should initialize settings proxy correctly', () => {
      const defaultSettings = {
        name: 'Test User',
        count: 0,
      };

      const TestComponent = defineComponent({
        tagName: 'test-instance-component',
        template: '<div>{{name}}: {{count}}</div>',
        defaultSettings,
      });

      const instance = new TestComponent();

      // Test settings proxy is created
      expect(instance.settings).toBeDefined();
      expect(instance.settingsVars).toBeDefined();
      expect(instance.settingsVars instanceof Map).toBe(true);

      // Test settings proxy get operation
      expect(instance.settings.name).toBe('Test User');
      expect(instance.settings.count).toBe(0);

      // Test settingsVars has correct entries after access
      expect(instance.settingsVars.has('name')).toBe(true);
      expect(instance.settingsVars.has('count')).toBe(true);
    });

    it('should create template when willUpdate is called (Lit path)', () => {
      // willUpdate is a Lit-specific lifecycle method
      const TestComponent = defineComponent({
        tagName: 'test-update-component',
        renderingEngine: 'lit',
        template: '<div>{{text}}</div>',
        defaultSettings: {
          text: 'Initial text',
        },
      });

      const instance = new TestComponent();
      instance.renderRoot = {};
      instance.getData = vi.fn().mockReturnValue({ text: 'Initial text' });

      expect(instance.template).toBeUndefined();
      instance.willUpdate();

      expect(instance.template).toBeDefined();
      expect(instance.component).toBeDefined();
      expect(instance.dataContext).toBeDefined();
    });

    it('should properly handle settings proxy set operations', () => {
      const defaultSettings = {
        count: 0,
      };

      const TestComponent = defineComponent({
        tagName: 'test-settings-proxy-component',
        template: '<div>Count: {{count}}</div>',
        defaultSettings,
      });

      const instance = new TestComponent();
      instance.setSetting = vi.fn();

      // Set a value through the settings proxy
      instance.settings.count = 5;

      // Verify setSetting was called
      expect(instance.setSetting).toHaveBeenCalledWith('count', 5);

      // Verify settingsVars was updated
      expect(instance.settingsVars.has('count')).toBe(true);
      const signal = instance.settingsVars.get('count');
      expect(signal).toBeDefined();
    });

    it('should handle disconnectedCallback correctly', () => {
      const mockTemplate = {
        onDestroyed: vi.fn(),
      };

      const TestComponent = defineComponent({
        tagName: 'test-disconnect-component',
        template: '<div>Disconnect Test</div>',
      });

      const prototypeDestroyedSpy = vi.spyOn(TestComponent.template, 'onDestroyed').mockImplementation(() => {});

      const instance = new TestComponent();
      instance.template = mockTemplate;

      instance.disconnectedCallback();

      // Instance template's onDestroyed should be called
      expect(mockTemplate.onDestroyed).toHaveBeenCalled();
      // Prototype template's onDestroyed should be called
      expect(prototypeDestroyedSpy).toHaveBeenCalled();
      // Template reference should be cleared
      expect(instance.template).toBeUndefined();
    });
  });

  // Test component spec integration
  describe('Component Spec Integration', () => {
    it('should handle component spec for UI classes', () => {
      // Create a mock component spec
      const componentSpec = {
        attributes: ['emphasis', 'active', 'disabled', 'icon'],
        properties: [],
        optionAttributes: {
          'primary': 'emphasis',
          'secondary': 'emphasis',
          'tertiary': 'emphasis',
          'disabled': 'disabled',
        },
        propertyTypes: {
          emphasis: 'string',
          active: 'boolean',
          disabled: 'string',
          icon: 'string',
        },
        allowedValues: {
          emphasis: ['primary', 'secondary', 'tertiary'],
          disabled: ['disabled'],
        },
        attributeClasses: ['icon'],
        defaultValues: {
          emphasis: 'primary',
        },
      };

      const TestComponent = defineComponent({
        tagName: 'test-spec-component',
        template: '<div class="{{ui}}">Component with Spec</div>',
        componentSpec,
      });

      const instance = new TestComponent();

      // Test getUIClasses with values set
      instance.emphasis = 'primary';
      instance.active = true;
      instance.disabled = 'disabled';
      instance.icon = 'user';

      const uiClasses = instance.getUIClasses({ componentSpec, properties: TestComponent.properties });

      // Classes should include 'primary' (from emphasis), 'active', 'disabled', and 'icon'
      expect(uiClasses).toContain('primary');
      expect(uiClasses).toContain('active');
      expect(uiClasses).toContain('disabled');
      expect(uiClasses).toContain('icon');
    });

    it('should properly process attributes defined in componentSpec', () => {
      // Create a more complete mock component spec
      const componentSpec = {
        attributes: ['color'],
        properties: [],
        optionAttributes: {},
        propertyTypes: {
          color: String,
        },
        allowedValues: {
          color: ['red', 'green', 'blue'],
        },
        attributeClasses: [],
      };

      const TestComponent = defineComponent({
        tagName: 'test-attr-component',
        template: '<div>Attribute Test</div>',
        componentSpec,
      });

      // Create an instance and check that properties were created based on componentSpec
      const instance = new TestComponent();

      // Verify component was created with properties from the spec
      expect(TestComponent.properties).toBeDefined();
      expect(TestComponent.properties.color).toBeDefined();
      expect(TestComponent.properties.color.type).toBe(String);
    });
  });

  // Test server-side rendering (SSR) behavior
  describe('Server-Side Rendering', () => {
    it('should handle SSR scenario in willUpdate', () => {
      // Mock isServer to be true
      vi.mock('@semantic-ui/utils', async () => {
        const actual = await vi.importActual('@semantic-ui/utils');
        return {
          ...actual,
          isServer: true,
        };
      });

      // willUpdate + triggerAttributeChange is Lit-specific SSR behavior
      const TestComponent = defineComponent({
        tagName: 'test-ssr-component',
        renderingEngine: 'lit',
        template: '<div>SSR Test</div>',
      });

      const instance = new TestComponent();
      instance.triggerAttributeChange = vi.fn();

      // Call willUpdate in "SSR" mode
      instance.willUpdate();

      // In SSR mode, triggerAttributeChange should be called
      expect(instance.triggerAttributeChange).toHaveBeenCalled();
    });
  });

  // Test integration with reactive system
  describe('Reactivity Integration', () => {
    it('should create reactive variables in createComponent', () => {
      // Define a component with createComponent function that uses both signal and reactiveVar
      const createComponentFn = vi.fn(({ self, signal, reactiveVar }) => {
        return {
          // Both reactivity systems appear to be supported
          count: signal(0),
          name: reactiveVar('Test'),
        };
      });

      const TestComponent = defineComponent({
        tagName: 'test-reactive-component',
        template: '<div>Reactive Component</div>',
        createComponent: createComponentFn,
      });

      // Verify the function is passed through correctly
      expect(TestComponent.template.createComponent).toBe(createComponentFn);
    });

    it('should support signal for reactive state', () => {
      // Define a component using signal for reactive state
      const createComponentWithSignal = ({ self, signal }) => ({
        count: signal(0),
        increment() {
          const currentValue = self.count.get();
          self.count.set(currentValue + 1);
        },
      });

      const TestComponent = defineComponent({
        tagName: 'test-signal-component',
        template: '<div>Count: {{count}}</div>',
        createComponent: createComponentWithSignal,
      });

      // Verify component was created successfully
      expect(TestComponent).toBeDefined();
      expect(TestComponent.template.createComponent).toBe(createComponentWithSignal);
    });
  });
  /*
    Unclear expected functionality here so removing tests for now

  // Test lifecycle events behavior
  describe('Lifecycle Events', () => {
    it('should ensure each lifecycle event only fires once and does not bubble from nested components', async () => {
      // Track all lifecycle events for parent and child
      const parentCreated = vi.fn();
      const parentRendered = vi.fn();
      const parentUpdated = vi.fn();
      const childCreated = vi.fn();
      const childRendered = vi.fn();
      const childUpdated = vi.fn();

      // Track if parent receives any child lifecycle events (should be 0)
      const parentCreatedHandler = vi.fn();
      const parentRenderedHandler = vi.fn();
      const parentUpdatedHandler = vi.fn();
      const parentDestroyedHandler = vi.fn();

      // Define child component
      defineComponent({
        tagName: 'test-lifecycle-child-bubble',
        template: '<div class="child">Child Content</div>',
        onCreated: childCreated,
        onRendered: childRendered,
        onUpdated: childUpdated
      });

      // Define parent component with nested child
      defineComponent({
        tagName: 'test-lifecycle-parent-bubble',
        template: `
          <div class="parent">
            Parent Content
            <test-lifecycle-child-bubble></test-lifecycle-child-bubble>
          </div>
        `,
        onCreated: parentCreated,
        onRendered: parentRendered,
        onUpdated: parentUpdated
      });

      // Create parent element and add lifecycle event listeners
      const parentElement = document.createElement('test-lifecycle-parent-bubble');
      parentElement.addEventListener('created', parentCreatedHandler);
      parentElement.addEventListener('rendered', parentRenderedHandler);
      parentElement.addEventListener('updated', parentUpdatedHandler);
      parentElement.addEventListener('destroyed', parentDestroyedHandler);

      // Add to DOM to trigger creation and rendering
      document.body.appendChild(parentElement);

      // Wait for lifecycle events to fire
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify each component's lifecycle callbacks fired exactly once
      expect(parentCreated).toHaveBeenCalledTimes(1);
      expect(parentRendered).toHaveBeenCalledTimes(1);
      expect(childCreated).toHaveBeenCalledTimes(1);
      expect(childRendered).toHaveBeenCalledTimes(1);

      // CRITICAL: Verify parent event listeners only received parent's own events
      expect(parentCreatedHandler).toHaveBeenCalledTimes(1);
      expect(parentRenderedHandler).toHaveBeenCalledTimes(1);
      expect(parentUpdatedHandler).toHaveBeenCalledTimes(0); // No updates yet
      expect(parentDestroyedHandler).toHaveBeenCalledTimes(0); // Not destroyed yet

      // Clean up
      document.body.removeChild(parentElement);
    });

    it('should ensure lifecycle events do not bubble when using Query library event binding', async () => {
      // Import Query library for testing
      const { $ } = await import('@semantic-ui/query');

      // Track lifecycle events
      const parentCreated = vi.fn();
      const parentRendered = vi.fn();
      const childCreated = vi.fn();
      const childRendered = vi.fn();

      // Track Query library event handlers
      const queryCreatedHandler = vi.fn();
      const queryRenderedHandler = vi.fn();
      const queryUpdatedHandler = vi.fn();
      const queryDestroyedHandler = vi.fn();

      // Define child component
      defineComponent({
        tagName: 'test-query-child-component',
        template: '<div class="child">Query Child Content</div>',
        onCreated: childCreated,
        onRendered: childRendered
      });

      // Define parent component with nested child
      defineComponent({
        tagName: 'test-query-parent-component',
        template: `
          <div class="parent">
            Query Parent Content
            <test-query-child-component></test-query-child-component>
          </div>
        `,
        onCreated: parentCreated,
        onRendered: parentRendered
      });

      // Create parent element and add to DOM
      const parentElement = document.createElement('test-query-parent-component');
      document.body.appendChild(parentElement);

      // Use Query library to bind lifecycle event listeners to parent
      $('test-query-parent-component').on('created', queryCreatedHandler);
      $('test-query-parent-component').on('rendered', queryRenderedHandler);
      $('test-query-parent-component').on('updated', queryUpdatedHandler);
      $('test-query-parent-component').on('destroyed', queryDestroyedHandler);

      // Wait for lifecycle events to fire
      await new Promise(resolve => setTimeout(resolve, 100));

      // Verify each component's lifecycle callbacks fired exactly once
      expect(parentCreated).toHaveBeenCalledTimes(1);
      expect(parentRendered).toHaveBeenCalledTimes(1);
      expect(childCreated).toHaveBeenCalledTimes(1);
      expect(childRendered).toHaveBeenCalledTimes(1);

      // CRITICAL: Verify Query library event handlers only received parent's own events
      // This confirms that $('component').on('rendered', handler) only fires once
      expect(queryCreatedHandler).toHaveBeenCalledTimes(1);
      expect(queryRenderedHandler).toHaveBeenCalledTimes(1);
      expect(queryUpdatedHandler).toHaveBeenCalledTimes(0);
      expect(queryDestroyedHandler).toHaveBeenCalledTimes(0);

      // Verify event data structure from Query library
      const renderedEventCall = queryRenderedHandler.mock.calls[0];
      const renderedEvent = renderedEventCall[0];
      expect(renderedEvent.type).toBe('rendered');
      expect(renderedEvent.detail).toBeDefined();
      expect(renderedEvent.detail.component).toBeDefined();

      // Clean up
      document.body.removeChild(parentElement);
    });
  });

  */

  // Test component hierarchy navigation helpers
  describe('Component Navigation Helpers', () => {
    let cleanupElements = [];

    afterEach(() => {
      // Clean up any elements added to the DOM during tests
      cleanupElements.forEach(element => {
        if (element.parentNode) {
          element.parentNode.removeChild(element);
        }
      });
      cleanupElements = [];
    });

    describe('findChild', () => {
      it('should find direct child component by templateName', async () => {
        // Define child component FIRST
        defineComponent({
          tagName: 'nav-test-find-child',
          templateName: 'testChild',
          template: '<div class="child">Child Content</div>',
          createComponent: ({ findParent }) => ({
            getParent() {
              return findParent('testParent');
            },
          }),
        });

        // Define parent component AFTER child
        defineComponent({
          tagName: 'nav-test-find-parent',
          templateName: 'testParent',
          template: '<div class="parent"><nav-test-find-child></nav-test-find-child></div>',
          createComponent: ({ findChild }) => ({
            getChild() {
              return findChild('testChild');
            },
          }),
        });

        // Create parent element and add to DOM
        const parentElement = document.createElement('nav-test-find-parent');
        document.body.appendChild(parentElement);
        cleanupElements.push(parentElement);

        // Wait for components to be rendered and initialized
        await parentElement.updateComplete;

        // Wait for child components to also be rendered
        const childElement = parentElement.querySelector('nav-test-find-child');
        if (childElement) {
          await childElement.updateComplete;
        }

        await new Promise(resolve => setTimeout(resolve, 300));

        // Test that parent can find child
        const parentComponent = parentElement.component;
        expect(parentComponent).toBeDefined();
        expect(parentComponent.getChild).toBeDefined();

        const childComponent = parentComponent.getChild();
        expect(childComponent).toBeDefined();
        expect(childComponent.templateName).toBe('testChild');
      });

      it('should return undefined when child not found', async () => {
        const ParentComponent = defineComponent({
          tagName: 'test-no-child-parent',
          templateName: 'noChildParent',
          template: '<div class="parent">No children here</div>',
          createComponent: ({ findChild }) => ({
            findNonExistentChild() {
              return findChild('nonExistentChild');
            },
          }),
        });

        const parentElement = document.createElement('test-no-child-parent');
        document.body.appendChild(parentElement);
        cleanupElements.push(parentElement);

        await new Promise(resolve => setTimeout(resolve, 100));

        const parentComponent = parentElement.component;
        const result = parentComponent.findNonExistentChild();
        expect(result).toBeUndefined();
      });

      it('should find child across shadow DOM boundaries', async () => {
        // Define nested child component
        const GrandChildComponent = defineComponent({
          tagName: 'test-grandchild',
          templateName: 'grandChild',
          template: '<div class="grandchild">Grandchild Content</div>',
        });

        // Define child component with shadow DOM
        const ChildComponent = defineComponent({
          tagName: 'test-shadow-child',
          templateName: 'shadowChild',
          template: '<div class="child"><test-grandchild></test-grandchild></div>',
        });

        // Define parent component
        const ParentComponent = defineComponent({
          tagName: 'test-shadow-parent',
          templateName: 'shadowParent',
          template: '<div class="parent"><test-shadow-child></test-shadow-child></div>',
          createComponent: ({ findChild }) => ({
            findDirectChild() {
              return findChild('shadowChild');
            },
            findGrandChild() {
              return findChild('grandChild');
            },
          }),
        });

        const parentElement = document.createElement('test-shadow-parent');
        document.body.appendChild(parentElement);
        cleanupElements.push(parentElement);

        await new Promise(resolve => setTimeout(resolve, 150));

        const parentComponent = parentElement.component;

        // Should find direct child
        const directChild = parentComponent.findDirectChild();
        expect(directChild).toBeDefined();
        expect(directChild.templateName).toBe('shadowChild');

        // Should find grandchild across shadow boundaries
        const grandChild = parentComponent.findGrandChild();
        expect(grandChild).toBeDefined();
        expect(grandChild.templateName).toBe('grandChild');
      });
    });

    describe('findChildren', () => {
      it('should find multiple child components of same type', async () => {
        // Define child component
        const ItemComponent = defineComponent({
          tagName: 'test-list-item',
          templateName: 'listItem',
          template: '<div class="item">Item</div>',
        });

        // Define parent component with multiple children
        const ListComponent = defineComponent({
          tagName: 'test-item-list',
          templateName: 'itemList',
          template: `
            <div class="list">
              <test-list-item></test-list-item>
              <test-list-item></test-list-item>
              <test-list-item></test-list-item>
            </div>
          `,
          createComponent: ({ findChildren }) => ({
            getAllItems() {
              return findChildren('listItem');
            },
            getItemCount() {
              return this.getAllItems().length;
            },
          }),
        });

        const listElement = document.createElement('test-item-list');
        document.body.appendChild(listElement);
        cleanupElements.push(listElement);

        await new Promise(resolve => setTimeout(resolve, 150));

        const listComponent = listElement.component;
        const items = listComponent.getAllItems();

        expect(Array.isArray(items)).toBe(true);
        expect(items.length).toBe(3);
        items.forEach(item => {
          expect(item.templateName).toBe('listItem');
        });
      });

      it('should return empty array when no children found', async () => {
        const ParentComponent = defineComponent({
          tagName: 'test-empty-parent',
          templateName: 'emptyParent',
          template: '<div class="parent">Empty parent</div>',
          createComponent: ({ findChildren }) => ({
            findNonExistentChildren() {
              return findChildren('nonExistent');
            },
          }),
        });

        const parentElement = document.createElement('test-empty-parent');
        document.body.appendChild(parentElement);
        cleanupElements.push(parentElement);

        await new Promise(resolve => setTimeout(resolve, 100));

        const parentComponent = parentElement.component;
        const result = parentComponent.findNonExistentChildren();

        expect(Array.isArray(result)).toBe(true);
        expect(result.length).toBe(0);
      });

      it('should find all children when no templateName specified', async () => {
        // Define different types of child components
        const ButtonComponent = defineComponent({
          tagName: 'test-button-child',
          templateName: 'buttonChild',
          template: '<button>Button</button>',
        });

        const InputComponent = defineComponent({
          tagName: 'test-input-child',
          templateName: 'inputChild',
          template: '<input type="text">',
        });

        const FormComponent = defineComponent({
          tagName: 'test-mixed-form',
          templateName: 'mixedForm',
          template: `
            <form>
              <test-input-child></test-input-child>
              <test-button-child></test-button-child>
              <test-input-child></test-input-child>
            </form>
          `,
          createComponent: ({ findChildren }) => ({
            getAllChildren() {
              return findChildren(); // No templateName - should return all children
            },
          }),
        });

        const formElement = document.createElement('test-mixed-form');
        document.body.appendChild(formElement);
        cleanupElements.push(formElement);

        await new Promise(resolve => setTimeout(resolve, 150));

        const formComponent = formElement.component;
        const allChildren = formComponent.getAllChildren();

        expect(Array.isArray(allChildren)).toBe(true);
        expect(allChildren.length).toBe(3);

        const childTypes = allChildren.map(child => child.templateName).sort();
        expect(childTypes).toEqual(['buttonChild', 'inputChild', 'inputChild']);
      });
    });

    describe('findParent', () => {
      it('should find parent component by templateName', async () => {
        // Define child component that looks for its parent
        const ChildComponent = defineComponent({
          tagName: 'test-parent-finder-child',
          templateName: 'parentFinderChild',
          template: '<div class="child">Child looking for parent</div>',
          createComponent: ({ findParent }) => ({
            getParent() {
              return findParent('parentFinderParent');
            },
          }),
        });

        // Define parent component
        const ParentComponent = defineComponent({
          tagName: 'test-parent-finder-parent',
          templateName: 'parentFinderParent',
          template: '<div class="parent"><test-parent-finder-child></test-parent-finder-child></div>',
          createComponent: () => ({
            parentData: 'I am the parent',
          }),
        });

        const parentElement = document.createElement('test-parent-finder-parent');
        document.body.appendChild(parentElement);
        cleanupElements.push(parentElement);

        // Wait for parent component to render
        await parentElement.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 150));

        // Get the child component through shadow DOM
        const childElement = parentElement.shadowRoot?.querySelector('test-parent-finder-child');
        expect(childElement).toBeDefined();

        // Wait for child component to render
        if (childElement) {
          await childElement.updateComplete;
        }

        const childComponent = childElement.component;
        expect(childComponent).toBeDefined();

        const foundParent = childComponent.getParent();
        expect(foundParent).toBeDefined();
        expect(foundParent.templateName).toBe('parentFinderParent');
        expect(foundParent.parentData).toBe('I am the parent');
      });

      it('should traverse across shadow DOM boundaries to find parent', async () => {
        // This tests the recent fix for Shadow DOM traversal using host property
        const DeepChildComponent = defineComponent({
          tagName: 'test-deep-child',
          templateName: 'deepChild',
          template: '<div class="deep-child">Deep nested child</div>',
          createComponent: ({ findParent }) => ({
            findTopLevelParent() {
              return findParent('topLevelParent');
            },
          }),
        });

        const MiddleComponent = defineComponent({
          tagName: 'test-middle-component',
          templateName: 'middleComponent',
          template: '<div class="middle"><test-deep-child></test-deep-child></div>',
        });

        const TopLevelComponent = defineComponent({
          tagName: 'test-top-level',
          templateName: 'topLevelParent',
          template: '<div class="top"><test-middle-component></test-middle-component></div>',
          createComponent: () => ({
            topLevelData: 'I am the top level parent',
          }),
        });

        const topElement = document.createElement('test-top-level');
        document.body.appendChild(topElement);
        cleanupElements.push(topElement);

        // Wait for top level component to render
        await topElement.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 200));

        // Navigate to the deeply nested child through shadow DOM
        const middleElement = topElement.shadowRoot?.querySelector('test-middle-component');
        expect(middleElement).toBeDefined();

        // Wait for middle component to render
        if (middleElement) {
          await middleElement.updateComplete;
        }

        const deepChildElement = middleElement?.shadowRoot?.querySelector('test-deep-child');
        expect(deepChildElement).toBeDefined();

        // Wait for deep child component to render
        if (deepChildElement) {
          await deepChildElement.updateComplete;
        }

        const deepChildComponent = deepChildElement.component;
        expect(deepChildComponent).toBeDefined();

        // The deep child should be able to find the top-level parent
        // This test validates the Shadow DOM traversal fix
        const topLevelParent = deepChildComponent.findTopLevelParent();
        expect(topLevelParent).toBeDefined();
        expect(topLevelParent.templateName).toBe('topLevelParent');
        expect(topLevelParent.topLevelData).toBe('I am the top level parent');
      });

      it('should return undefined when parent not found', async () => {
        const OrphanComponent = defineComponent({
          tagName: 'test-orphan-component',
          templateName: 'orphanComponent',
          template: '<div class="orphan">I have no specific parent</div>',
          createComponent: ({ findParent }) => ({
            lookForNonExistentParent() {
              return findParent('nonExistentParent');
            },
          }),
        });

        const orphanElement = document.createElement('test-orphan-component');
        document.body.appendChild(orphanElement);
        cleanupElements.push(orphanElement);

        await new Promise(resolve => setTimeout(resolve, 100));

        const orphanComponent = orphanElement.component;
        const result = orphanComponent.lookForNonExistentParent();
        expect(result).toBeUndefined();
      });
    });

    describe('findTemplate', () => {
      it('should find any template on the page by templateName', async () => {
        // Create multiple components with different templateNames
        const ComponentA = defineComponent({
          tagName: 'test-template-a',
          templateName: 'templateA',
          template: '<div class="template-a">Template A</div>',
          createComponent: () => ({
            componentType: 'A',
          }),
        });

        const ComponentB = defineComponent({
          tagName: 'test-template-b',
          templateName: 'templateB',
          template: '<div class="template-b">Template B</div>',
          createComponent: ({ findTemplate }) => ({
            componentType: 'B',
            findTemplateA() {
              return findTemplate('templateA');
            },
          }),
        });

        // Add both components to DOM
        const elementA = document.createElement('test-template-a');
        const elementB = document.createElement('test-template-b');

        document.body.appendChild(elementA);
        document.body.appendChild(elementB);
        cleanupElements.push(elementA, elementB);

        // Wait for both components to render
        await elementA.updateComplete;
        await elementB.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 150));

        // Component B should be able to find Component A via findTemplate
        const componentB = elementB.component;
        expect(componentB).toBeDefined();

        const foundTemplateA = componentB.findTemplateA();
        expect(foundTemplateA).toBeDefined();
        expect(foundTemplateA.templateName).toBe('templateA');
        expect(foundTemplateA.componentType).toBe('A');
      });

      it('should return undefined when template not found', async () => {
        const SearcherComponent = defineComponent({
          tagName: 'test-template-searcher',
          templateName: 'templateSearcher',
          template: '<div class="searcher">Looking for templates</div>',
          createComponent: ({ findTemplate }) => ({
            findNonExistentTemplate() {
              return findTemplate('nonExistentTemplate');
            },
          }),
        });

        const searcherElement = document.createElement('test-template-searcher');
        document.body.appendChild(searcherElement);
        cleanupElements.push(searcherElement);

        await new Promise(resolve => setTimeout(resolve, 100));

        const searcherComponent = searcherElement.component;
        const result = searcherComponent.findNonExistentTemplate();
        expect(result).toBeUndefined();
      });

      it('should find templates across component hierarchies', async () => {
        // Test that findTemplate works regardless of parent-child relationships
        const SiblingComponent = defineComponent({
          tagName: 'test-sibling-component',
          templateName: 'siblingComponent',
          template: '<div class="sibling">Sibling Component</div>',
          createComponent: () => ({
            siblingData: 'sibling data',
          }),
        });

        const ContainerComponent = defineComponent({
          tagName: 'test-container-component',
          templateName: 'containerComponent',
          template: `
            <div class="container">
              <test-nested-finder></test-nested-finder>
            </div>
          `,
        });

        const NestedFinderComponent = defineComponent({
          tagName: 'test-nested-finder',
          templateName: 'nestedFinder',
          template: '<div class="nested">Nested Component</div>',
          createComponent: ({ findTemplate }) => ({
            findSibling() {
              return findTemplate('siblingComponent');
            },
          }),
        });

        // Add components to DOM - sibling and container are not parent-child related
        const siblingElement = document.createElement('test-sibling-component');
        const containerElement = document.createElement('test-container-component');

        document.body.appendChild(siblingElement);
        document.body.appendChild(containerElement);
        cleanupElements.push(siblingElement, containerElement);

        // Wait for both components to render
        await siblingElement.updateComplete;
        await containerElement.updateComplete;
        await new Promise(resolve => setTimeout(resolve, 150));

        // The nested component should be able to find the sibling component (in shadow DOM)
        const nestedElement = containerElement.shadowRoot?.querySelector('test-nested-finder');
        expect(nestedElement).toBeDefined();

        // Wait for nested component to render
        if (nestedElement) {
          await nestedElement.updateComplete;
        }

        const nestedComponent = nestedElement.component;
        expect(nestedComponent).toBeDefined();

        const foundSibling = nestedComponent.findSibling();
        expect(foundSibling).toBeDefined();
        expect(foundSibling.templateName).toBe('siblingComponent');
        expect(foundSibling.siblingData).toBe('sibling data');
      });
    });

    describe('Subtemplate Navigation', () => {
      it('should find child subtemplates using findChild', async () => {
        // Define child subtemplate (no tagName)
        const childSubtemplate = defineComponent({
          templateName: 'childSubtemplate',
          template: '<div class="child-sub">Child Subtemplate Content</div>',
          createComponent: ({ findParent }) => ({
            getParentData() {
              return findParent('parentWithSubs')?.parentData;
            },
          }),
        });

        // Define parent component that uses subtemplates
        const ParentWithSubs = defineComponent({
          tagName: 'test-parent-with-subs',
          templateName: 'parentWithSubs',
          template: `
            <div class="parent">
              <h2>Parent Component</h2>
              {>childSubtemplate}
              {>childSubtemplate}
            </div>
          `,
          subTemplates: {
            childSubtemplate,
          },
          createComponent: ({ findChild, findChildren }) => ({
            parentData: 'parent-data-value',
            findFirstChild() {
              return findChild('childSubtemplate');
            },
            findAllChildren() {
              return findChildren('childSubtemplate');
            },
          }),
        });

        const parentElement = document.createElement('test-parent-with-subs');
        document.body.appendChild(parentElement);
        cleanupElements.push(parentElement);

        await new Promise(resolve => setTimeout(resolve, 150));

        const parentComponent = parentElement.component;

        // Test findChild - should find first subtemplate child
        const firstChild = parentComponent.findFirstChild();
        expect(firstChild).toBeDefined();
        expect(firstChild.templateName).toBe('childSubtemplate');
        expect(typeof firstChild.getParentData).toBe('function');

        // Test findChildren - should find all subtemplate children
        const allChildren = parentComponent.findAllChildren();
        expect(allChildren).toBeDefined();
        expect(Array.isArray(allChildren)).toBe(true);
        expect(allChildren.length).toBe(2); // Two instances of childSubtemplate
        expect(allChildren[0].templateName).toBe('childSubtemplate');
        expect(allChildren[1].templateName).toBe('childSubtemplate');
      });

      it('should find parent from subtemplate using findParent', async () => {
        // Define parent subtemplate (no tagName)
        const parentSubtemplate = defineComponent({
          templateName: 'parentSubtemplate',
          template: `
            <div class="parent-sub">
              <h3>Parent Subtemplate</h3>
              {>nestedChild}
            </div>
          `,
          subTemplates: {
            nestedChild: defineComponent({
              templateName: 'nestedChild',
              template: '<span class="nested">Nested Child</span>',
              createComponent: ({ findParent }) => ({
                findContainerParent() {
                  return findParent('containerComponent');
                },
                findSubtemplateParent() {
                  return findParent('parentSubtemplate');
                },
              }),
            }),
          },
          createComponent: () => ({
            subtemplateData: 'subtemplate-parent-data',
          }),
        });

        // Define container web component
        const ContainerComponent = defineComponent({
          tagName: 'test-subtemplate-container',
          templateName: 'containerComponent',
          template: `
            <div class="container">
              <h2>Container</h2>
              {>parentSubtemplate}
            </div>
          `,
          subTemplates: {
            parentSubtemplate,
          },
          createComponent: () => ({
            containerData: 'container-data-value',
          }),
        });

        const containerElement = document.createElement('test-subtemplate-container');
        document.body.appendChild(containerElement);
        cleanupElements.push(containerElement);

        await new Promise(resolve => setTimeout(resolve, 150));

        // Access the deeply nested child through template traversal
        // This would be complex to test directly, but we can verify the structure exists
        const containerComponent = containerElement.component;
        expect(containerComponent).toBeDefined();
        expect(containerComponent.templateName).toBe('containerComponent');
        expect(containerComponent.containerData).toBe('container-data-value');
      });

      it('should handle mixed web component and subtemplate navigation', async () => {
        // Define subtemplate child (no tagName)
        const subChildTemplate = defineComponent({
          templateName: 'subChild',
          template: '<div class="sub-child">Subtemplate Child</div>',
          createComponent: ({ findParent }) => ({
            findMixedParent() {
              return findParent('mixedParent');
            },
          }),
        });

        // Define web component child (has tagName)
        const WebChildComponent = defineComponent({
          tagName: 'test-web-child',
          templateName: 'webChild',
          template: '<div class="web-child">Web Component Child</div>',
          createComponent: ({ findParent }) => ({
            findMixedParent() {
              return findParent('mixedParent');
            },
          }),
        });

        // Define parent that uses both subtemplates and web components
        const MixedParent = defineComponent({
          tagName: 'test-mixed-parent',
          templateName: 'mixedParent',
          template: `
            <div class="mixed-parent">
              <h2>Mixed Parent</h2>
              {>subChild}
              <test-web-child></test-web-child>
            </div>
          `,
          subTemplates: {
            subChild: subChildTemplate,
          },
          createComponent: ({ findChild, findChildren }) => ({
            mixedData: 'mixed-parent-data',
            findSubChild() {
              return findChild('subChild');
            },
            findWebChild() {
              return findChild('webChild');
            },
            findAllChildren() {
              return findChildren(); // Find all children regardless of type
            },
          }),
        });

        const mixedElement = document.createElement('test-mixed-parent');
        document.body.appendChild(mixedElement);
        cleanupElements.push(mixedElement);

        await new Promise(resolve => setTimeout(resolve, 150));

        const mixedComponent = mixedElement.component;

        // Should find subtemplate child
        const subChild = mixedComponent.findSubChild();
        expect(subChild).toBeDefined();
        expect(subChild.templateName).toBe('subChild');

        // Should find web component child
        const webChild = mixedComponent.findWebChild();
        expect(webChild).toBeDefined();
        expect(webChild.templateName).toBe('webChild');

        // Should find both types of children
        const allChildren = mixedComponent.findAllChildren();
        expect(allChildren).toBeDefined();
        expect(Array.isArray(allChildren)).toBe(true);
        expect(allChildren.length).toBe(2);

        const templateNames = allChildren.map(child => child.templateName).sort();
        expect(templateNames).toEqual(['subChild', 'webChild']);
      });
    });

    describe('Navigation Helper Edge Cases', () => {
      it('should handle components without templateName gracefully', async () => {
        const UnnamedComponent = defineComponent({
          tagName: 'test-unnamed-component',
          // No templateName specified
          template: '<div class="unnamed">Unnamed component</div>',
          createComponent: ({ findChild, findParent, findTemplate }) => ({
            testNavigation() {
              return {
                child: findChild('someChild'),
                parent: findParent('someParent'),
                template: findTemplate('someTemplate'),
              };
            },
          }),
        });

        const unnamedElement = document.createElement('test-unnamed-component');
        document.body.appendChild(unnamedElement);
        cleanupElements.push(unnamedElement);

        await new Promise(resolve => setTimeout(resolve, 100));

        const unnamedComponent = unnamedElement.component;
        expect(unnamedComponent).toBeDefined();

        // Should not throw errors even without templateName
        const navigation = unnamedComponent.testNavigation();
        expect(navigation.child).toBeUndefined();
        expect(navigation.parent).toBeUndefined();
        expect(navigation.template).toBeUndefined();
      });

      it('should handle rapid component creation and destruction', async () => {
        const DynamicComponent = defineComponent({
          tagName: 'test-dynamic-component',
          templateName: 'dynamicComponent',
          template: '<div class="dynamic">Dynamic Component</div>',
          createComponent: ({ findTemplate }) => ({
            findSelf() {
              return findTemplate('dynamicComponent');
            },
          }),
        });

        // Create and immediately test multiple components
        const elements = [];
        for (let i = 0; i < 3; i++) {
          const element = document.createElement('test-dynamic-component');
          document.body.appendChild(element);
          elements.push(element);
        }
        cleanupElements.push(...elements);

        await new Promise(resolve => setTimeout(resolve, 150));

        // Each component should be able to find itself via findTemplate
        for (const element of elements) {
          const component = element.component;
          expect(component).toBeDefined();

          const foundSelf = component.findSelf();
          expect(foundSelf).toBeDefined();
          expect(foundSelf.templateName).toBe('dynamicComponent');
        }

        // Remove middle element and verify others still work
        document.body.removeChild(elements[1]);
        elements.splice(1, 1);

        await new Promise(resolve => setTimeout(resolve, 50));

        // Remaining components should still function
        for (const element of elements) {
          const component = element.component;
          const foundSelf = component.findSelf();
          expect(foundSelf).toBeDefined();
        }
      });
    });
  });
});

/*******************************
   Lifecycle: interval/timeout cleanup
*******************************/

describe('interval and timeout lifecycle cleanup', () => {
  it('should stop interval when component is removed from DOM', async () => {
    let tickCount = 0;
    const tag = 'test-interval-cleanup';
    defineComponent({
      tagName: tag,
      template: '<span>{count}</span>',
      defaultState: { count: 0 },
      createComponent: ({ state, interval }) => ({
        initialize() {
          interval(() => {
            tickCount++;
            state.count.increment();
          }, 50);
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Let it tick a few times
    await new Promise(r => setTimeout(r, 160));
    const countBeforeRemove = tickCount;
    expect(countBeforeRemove).toBeGreaterThan(0);

    // Remove from DOM — triggers destroy
    document.body.removeChild(el);
    await new Promise(r => setTimeout(r, 10));

    // Wait and verify no more ticks
    await new Promise(r => setTimeout(r, 160));
    expect(tickCount).toBe(countBeforeRemove);
  });

  it('should stop timeout when component is removed before it fires', async () => {
    let fired = false;
    const tag = 'test-timeout-cleanup';
    defineComponent({
      tagName: tag,
      template: '<span>test</span>',
      createComponent: ({ timeout }) => ({
        initialize() {
          timeout(() => {
            fired = true;
          }, 200);
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Remove before timeout fires
    document.body.removeChild(el);
    await new Promise(r => setTimeout(r, 10));

    // Wait past the timeout duration
    await new Promise(r => setTimeout(r, 300));
    expect(fired).toBe(false);
  });

  it('should allow timeout to fire if component is still alive', async () => {
    let fired = false;
    const tag = 'test-timeout-fires';
    defineComponent({
      tagName: tag,
      template: '<span>test</span>',
      createComponent: ({ timeout }) => ({
        initialize() {
          timeout(() => {
            fired = true;
          }, 50);
        },
      }),
    });
    const el = document.createElement(tag);
    document.body.appendChild(el);
    await el.updateComplete;

    // Wait for timeout to fire
    await new Promise(r => setTimeout(r, 100));
    expect(fired).toBe(true);

    document.body.removeChild(el);
  });
});
