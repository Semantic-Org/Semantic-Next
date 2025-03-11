/**
 * @vitest-environment jsdom
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { defineComponent } from '../../src/index.js';

// This test file provides basic DOM integration tests that can be run in JSDOM
// Full browser integration tests should be added with Playwright or similar

describe('Component DOM Integration Tests', () => {
  // Clean up the DOM after each test
  afterEach(() => {
    document.body.innerHTML = '';
    vi.restoreAllMocks();
  });
  
  it('should properly define a custom element', () => {
    // Define a simple component
    const TestComponent = defineComponent({
      tagName: 'test-basic-element',
      template: '<div class="content">Hello World</div>'
    });
    
    // Verify the component class was defined
    expect(TestComponent).toBeDefined();
    expect(customElements.get('test-basic-element')).toBe(TestComponent);
    
    // Create an instance
    const element = document.createElement('test-basic-element');
    expect(element.tagName.toLowerCase()).toBe('test-basic-element');
  });
  
  it('should have the right component structure', () => {
    // Create a component with a template and properties
    const TestComponent = defineComponent({
      tagName: 'test-structure-element',
      template: '<div>{{text}}</div>',
      defaultSettings: {
        text: 'Test Text'
      }
    });
    
    // Create an instance and check its structure
    const element = new TestComponent();
    
    // Component should have the default settings
    expect(element.defaultSettings).toBeDefined();
    expect(element.defaultSettings.text).toBe('Test Text');
    
    // Component should have a settings proxy
    expect(element.settings).toBeDefined();
    expect(element.settings.text).toBe('Test Text');
  });
  
  it('should handle event bindings in component definition', () => {
    // Create a mock event handler
    const clickHandler = vi.fn();
    
    // Define a component with events
    defineComponent({
      tagName: 'test-events-element',
      template: '<button class="btn">Click Me</button>',
      events: {
        'click .btn': clickHandler
      }
    });
    
    // Verify the component was registered
    const TestComponent = customElements.get('test-events-element');
    expect(TestComponent).toBeDefined();
    
    // Create an instance
    const element = new TestComponent();
    
    // The events should be passed to the template
    expect(TestComponent.template.events['click .btn']).toBe(clickHandler);
  });
  
  it('should support reactive state in component definition', () => {
    // Mock a simple signal-like function
    const mockSignal = vi.fn((initialValue) => ({
      get: () => initialValue,
      set: vi.fn()
    }));
    
    // Define a component with createComponent function
    const createComponentFn = vi.fn(({ self, signal = mockSignal }) => ({
      count: signal(0),
      increment() {
        const current = self.count.get();
        self.count.set(current + 1);
      }
    }));
    
    // Define component
    const TestComponent = defineComponent({
      tagName: 'test-reactive-element',
      template: '<div>{{count}}</div>',
      createComponent: createComponentFn
    });
    
    // Create an instance
    const element = new TestComponent();
    
    // Verify the createComponent function was stored on the component's template
    expect(TestComponent.template.createComponent).toBe(createComponentFn);
    
    // In a real browser, the component would instantiate and use the reactive state
    // For JSDOM tests, we can only verify the structure is in place
  });
  
  it('should support lifecycle callback definition', () => {
    // Define lifecycle functions
    const onCreated = vi.fn();
    const onRendered = vi.fn();
    const onDestroyed = vi.fn();
    
    // Define component with lifecycle hooks
    const TestComponent = defineComponent({
      tagName: 'test-lifecycle-element',
      template: '<div>Lifecycle Test</div>',
      onCreated,
      onRendered,
      onDestroyed
    });
    
    // In JSDOM, we can't easily test the actual lifecycle behavior
    // But we can verify the component structure includes the lifecycle functions
    expect(TestComponent).toBeDefined();
    
    // Create an instance
    const element = new TestComponent();
    
    // Verify the component has a call method to invoke lifecycle callbacks
    expect(typeof element.call).toBe('function');
  });
});