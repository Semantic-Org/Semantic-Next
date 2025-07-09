import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { adoptStylesheet } from '../../src/helpers/adopt-stylesheet.js';
import { defineComponent, WebComponentBase } from '../../src/index.js';

// Basic component tests that don't require a real DOM
describe('Component', () => {
  // Test basic component definition
  describe('defineComponent', () => {
    it('should handle component with CSS', () => {
      // Define a component with CSS
      const TestComponent = defineComponent({
        tagName: 'test-css-component',
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
        template: '<div class="header">Header</div>',
        css: '.header { font-weight: bold; }',
      });

      // Define a component with subTemplates
      const TestComponent = defineComponent({
        tagName: 'test-subtemplates-component',
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
      expect(TestComponent.name).toBe('UIWebComponent');
    });
  });

  // Test WebComponentBase properties and methods
  describe('WebComponentBase', () => {
    it('should have shadowRootOptions defined', () => {
      expect(WebComponentBase.shadowRootOptions).toBeDefined();
      expect(WebComponentBase.shadowRootOptions.delegatesFocus).toBe(false);
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
        type: String
      });
      expect(strProp.type).toBe(String);
      expect(strProp.attribute).toBe(true);
      expect(strProp.hasChanged).toBeDefined();
    });

    it('should handle Boolean property type correctly', () => {
      const boolProp = WebComponentBase.getPropertySettings({
        name: 'testProp',
        type: Boolean
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
        type: Function
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
        propertyOnly: true
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

    it('should create template when willUpdate is called', () => {
      // Define component
      const TestComponent = defineComponent({
        tagName: 'test-update-component',
        template: '<div>{{text}}</div>',
        defaultSettings: {
          text: 'Initial text',
        },
      });

      // Create a component instance
      const instance = new TestComponent();

      // Mock necessary properties and methods
      instance.renderRoot = {};
      instance.getData = vi.fn().mockReturnValue({ text: 'Initial text' });

      // Initially template should be undefined
      expect(instance.template).toBeUndefined();

      // Call willUpdate
      instance.willUpdate();

      // Now template should be defined
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
      // Create mock template with onDestroyed method
      const mockTemplate = {
        onDestroyed: vi.fn(),
      };

      const TestComponent = defineComponent({
        tagName: 'test-disconnect-component',
        template: '<div>Disconnect Test</div>',
      });

      // Setup spies
      const superDisconnectSpy = vi.spyOn(WebComponentBase.prototype, 'disconnectedCallback').mockImplementation(
        () => {},
      );
      const litTemplateDestroyedSpy = vi.spyOn(TestComponent.template, 'onDestroyed').mockImplementation(() => {});

      const instance = new TestComponent();
      instance.template = mockTemplate;

      // Call disconnectedCallback
      instance.disconnectedCallback();

      // Verify super.disconnectedCallback was called
      expect(superDisconnectSpy).toHaveBeenCalled();

      // Verify both template instance and prototype onDestroyed methods were called
      expect(mockTemplate.onDestroyed).toHaveBeenCalled();
      expect(litTemplateDestroyedSpy).toHaveBeenCalled();
    });
  });

  // Test component spec integration
  describe('Component Spec Integration', () => {
    it('should handle component spec for UI classes', () => {
      // Create a mock component spec
      const componentSpec = {
        attributes: ['emphasis', 'active', 'disabled', 'icon'],
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

      const TestComponent = defineComponent({
        tagName: 'test-ssr-component',
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

});
