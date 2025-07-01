/**
 * MCP Tool Definitions for Web Component Debugging
 * These schemas define the available debugging tools for AI agents
 */

export const debugTools = {
  inspect_component: {
    description: "Inspect a web component's structure, attributes, shadow DOM, and current state",
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description:
            "CSS selector, component ID, or tag name to find the component. Examples: '#my-component', 'ui-dropdown', '.my-class'",
        },
        depth: {
          type: 'number',
          description: 'How deep to traverse shadow DOM tree (default: 3, max recommended: 5)',
          default: 3,
          minimum: 1,
          maximum: 10,
        },
      },
      required: ['selector'],
    },
    examples: [
      {
        description: 'Inspect a component by ID',
        parameters: { selector: '#main-dropdown', depth: 2 },
      },
      {
        description: 'Deep inspection of component structure',
        parameters: { selector: 'test-component', depth: 4 },
      },
    ],
  },

  execute_in_component: {
    description:
      "Execute JavaScript code within a component's context with access to shadow DOM and component internals",
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Component selector to execute code within',
        },
        code: {
          type: 'string',
          description:
            'JavaScript code to execute. Available variables: host (component element), shadow (shadowRoot), $ (shadow-aware query), $$ (query all), document (shadow document), console',
        },
      },
      required: ['selector', 'code'],
    },
    examples: [
      {
        description: "Check component's internal counter value",
        parameters: {
          selector: '#counter-component',
          code: "host.counter || host._counter || 'Counter not found'",
        },
      },
      {
        description: 'Find all buttons in shadow DOM',
        parameters: {
          selector: 'ui-modal',
          code: "$$('button').length",
        },
      },
      {
        description: "Get component's current state",
        parameters: {
          selector: 'test-component',
          code: '({ counter: host.counter, shadowHTML: shadow.innerHTML.length, classList: [...host.classList] })',
        },
      },
    ],
  },

  monitor_events: {
    description: 'Start monitoring specific events on a component. Events will be streamed in real-time via WebSocket',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Component selector to monitor',
        },
        events: {
          type: 'array',
          items: { type: 'string' },
          description: 'Array of event names to monitor. Common events: click, change, input, custom events',
        },
      },
      required: ['selector', 'events'],
    },
    examples: [
      {
        description: 'Monitor user interactions',
        parameters: {
          selector: '#interactive-component',
          events: ['click', 'mouseover', 'focus'],
        },
      },
      {
        description: 'Monitor custom component events',
        parameters: {
          selector: 'ui-dropdown',
          events: ['selection-changed', 'dropdown-opened', 'dropdown-closed'],
        },
      },
    ],
  },

  get_computed_styles: {
    description: 'Get computed CSS styles for a component or element within its shadow DOM',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Component selector',
        },
        elementPath: {
          type: 'string',
          description:
            "Optional CSS selector for element within component's shadow DOM. If not provided, styles of the component itself are returned",
        },
      },
      required: ['selector'],
    },
    examples: [
      {
        description: "Get component's own styles",
        parameters: { selector: 'test-component' },
      },
      {
        description: 'Get styles of button inside component',
        parameters: {
          selector: 'test-component',
          elementPath: 'button',
        },
      },
      {
        description: 'Get styles of specific element',
        parameters: {
          selector: 'ui-modal',
          elementPath: '.modal-header .close-button',
        },
      },
    ],
  },

  mutation_history: {
    description: "Get recent DOM mutations within a component's shadow DOM for debugging dynamic changes",
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Component selector',
        },
        count: {
          type: 'number',
          description: 'Number of recent mutations to retrieve (default: 10, max: 50)',
          default: 10,
          minimum: 1,
          maximum: 50,
        },
      },
      required: ['selector'],
    },
    examples: [
      {
        description: 'Get last 5 DOM changes',
        parameters: { selector: 'dynamic-component', count: 5 },
      },
      {
        description: 'Get full mutation history',
        parameters: { selector: 'test-component', count: 50 },
      },
    ],
  },

  list_components: {
    description: 'List all web components currently on the page with their basic information',
    parameters: {
      type: 'object',
      properties: {},
      additionalProperties: false,
    },
    examples: [
      {
        description: 'Get overview of all components',
        parameters: {},
      },
    ],
  },

  query_shadow_dom: {
    description: "Query for elements within a component's shadow DOM using CSS selectors",
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Component selector',
        },
        query: {
          type: 'string',
          description: "CSS selector to find elements within the component's shadow DOM",
        },
      },
      required: ['selector', 'query'],
    },
    examples: [
      {
        description: 'Find all buttons in component',
        parameters: {
          selector: 'ui-modal',
          query: 'button',
        },
      },
      {
        description: 'Find elements with specific class',
        parameters: {
          selector: 'test-component',
          query: '.interactive-element',
        },
      },
      {
        description: 'Find form inputs',
        parameters: {
          selector: 'ui-form',
          query: 'input, select, textarea',
        },
      },
    ],
  },

  get_component_state: {
    description: "Get a component's internal state, properties, and available methods for debugging",
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Component selector',
        },
      },
      required: ['selector'],
    },
    examples: [
      {
        description: "Get component's current state",
        parameters: { selector: 'stateful-component' },
      },
      {
        description: 'Check component properties and methods',
        parameters: { selector: '#dynamic-widget' },
      },
    ],
  },

  take_screenshot: {
    description:
      'Get component dimensions and position information (note: actual screenshot requires additional libraries)',
    parameters: {
      type: 'object',
      properties: {
        selector: {
          type: 'string',
          description: 'Component selector',
        },
      },
      required: ['selector'],
    },
    examples: [
      {
        description: 'Get component layout info',
        parameters: { selector: 'ui-modal' },
      },
    ],
  },
};

/**
 * Tool usage guidelines for AI agents
 */
export const usageGuidelines = {
  debugging_workflow: [
    "1. Start with 'list_components' to see all available components",
    "2. Use 'inspect_component' to understand structure and current state",
    "3. Use 'execute_in_component' to test specific functionality",
    "4. Monitor behavior with 'monitor_events' for interactive debugging",
    "5. Check styling issues with 'get_computed_styles'",
    "6. Track dynamic changes with 'mutation_history'",
  ],

  best_practices: {
    selectors: [
      'Use specific selectors when possible (IDs or tag names)',
      "For custom components, use tag names like 'ui-dropdown' or 'test-component'",
      "Fallback to class selectors '.my-component' if needed",
    ],

    code_execution: [
      'Keep executed code simple and focused',
      'Use the provided context variables (host, shadow, $, $$)',
      'Return serializable data (avoid circular references)',
      'Use console.log for debugging output',
    ],

    event_monitoring: [
      'Start with common events: click, change, input',
      'Add custom component events based on component documentation',
      'Monitor for short periods to avoid overwhelming the system',
    ],
  },

  common_patterns: {
    finding_components: 'list_components() → inspect_component(selector)',
    debugging_interactions: "monitor_events(selector, ['click']) → execute_in_component(selector, code)",
    styling_issues: 'inspect_component(selector) → get_computed_styles(selector, elementPath)',
    state_debugging: "get_component_state(selector) → execute_in_component(selector, 'return host.someProperty')",
  },
};

/**
 * Event types that components commonly emit
 */
export const commonEvents = {
  user_interactions: [
    'click',
    'dblclick',
    'mousedown',
    'mouseup',
    'mouseover',
    'mouseout',
    'focus',
    'blur',
    'keydown',
    'keyup',
    'input',
    'change',
    'submit',
  ],

  semantic_ui_components: [
    'selection-changed',
    'item-selected',
    'dropdown-opened',
    'dropdown-closed',
    'modal-opened',
    'modal-closed',
    'tab-changed',
    'accordion-expanded',
    'form-validated',
    'field-changed',
    'button-clicked',
  ],

  lifecycle_events: [
    'component-created',
    'component-rendered',
    'component-destroyed',
    'state-changed',
    'settings-updated',
    'data-loaded',
  ],
};

export default debugTools;
