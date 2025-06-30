/**
 * Debug Bridge - Browser-side debugging infrastructure for web components
 * Provides MCP tool interface for component inspection and manipulation
 */
window.__debugBridge = {
  ws: null,
  componentRegistry: new WeakMap(),
  eventListeners: new Map(),
  mutationObservers: new Map(),

  connect(url) {
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      console.log('🔗 Debug bridge connected to MCP server');
    };

    this.ws.onmessage = async (event) => {
      const { type, tool, params, id } = JSON.parse(event.data);

      if (type === 'mcp-tool-request') {
        console.log(`🛠️ Executing tool: ${tool}`, params);
        try {
          const result = await this.handleToolRequest(tool, params);
          this.ws.send(JSON.stringify({
            type: 'mcp-tool-response',
            id,
            result,
          }));
        }
        catch (error) {
          this.ws.send(JSON.stringify({
            type: 'mcp-tool-response',
            id,
            error: {
              message: error.message,
              stack: error.stack,
              params,
            },
          }));
        }
      }
    };

    this.ws.onerror = (error) => {
      console.error('❌ Debug bridge WebSocket error:', error);
    };

    // Auto-register components
    this.setupComponentTracking();
  },

  setupComponentTracking() {
    // Intercept customElements.define to track new component types
    const originalDefine = customElements.define;
    customElements.define = function(name, constructor, options) {
      console.log(`📝 Registering component type: ${name}`);
      originalDefine.call(this, name, constructor, options);

      // Track all existing instances
      setTimeout(() => {
        document.querySelectorAll(name).forEach(el => {
          window.__debugBridge.registerComponent(el);
        });
      }, 0);
    };

    // Monitor for new component instances
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.tagName.includes('-')) {
            this.registerComponent(node);
          }
          // Also check for nested components
          if (node.nodeType === 1 && node.querySelectorAll) {
            node.querySelectorAll('*').forEach(child => {
              if (child.tagName.includes('-')) {
                this.registerComponent(child);
              }
            });
          }
        });
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Register existing components
    document.querySelectorAll('*').forEach(el => {
      if (el.tagName.includes('-')) {
        this.registerComponent(el);
      }
    });
  },

  registerComponent(element) {
    if (this.componentRegistry.has(element)) { return; }

    console.log(`🧩 Registering component instance: ${element.tagName.toLowerCase()}`);

    const componentData = {
      tagName: element.tagName.toLowerCase(),
      shadowRoot: element.shadowRoot,
      attributes: [...element.attributes].map(a => ({
        name: a.name,
        value: a.value,
      })),
      properties: {},
      events: [],
      mutations: [],
      registeredAt: Date.now(),
    };

    this.componentRegistry.set(element, componentData);

    // Set up mutation observer for shadow DOM
    if (element.shadowRoot) {
      const observer = new MutationObserver((mutations) => {
        const data = this.componentRegistry.get(element);
        if (data) {
          data.mutations.push(...mutations.map(m => ({
            type: m.type,
            target: m.target.tagName || m.target.nodeName,
            timestamp: Date.now(),
            addedNodes: m.addedNodes.length,
            removedNodes: m.removedNodes.length,
            attributeName: m.attributeName,
            oldValue: m.oldValue,
          })));

          // Keep only last 50 mutations
          if (data.mutations.length > 50) {
            data.mutations = data.mutations.slice(-50);
          }
        }
      });

      observer.observe(element.shadowRoot, {
        childList: true,
        attributes: true,
        characterData: true,
        subtree: true,
        attributeOldValue: true,
        characterDataOldValue: true,
      });

      this.mutationObservers.set(element, observer);
    }
  },

  async handleToolRequest(tool, params) {
    switch (tool) {
      case 'inspect_component':
        return this.inspectComponent(params.selector, params.depth);

      case 'execute_in_component':
        return this.executeInComponent(params.selector, params.code);

      case 'monitor_events':
        return this.monitorEvents(params.selector, params.events);

      case 'get_computed_styles':
        return this.getComputedStyles(params.selector, params.elementPath);

      case 'mutation_history':
        return this.getMutationHistory(params.selector, params.count);

      case 'list_components':
        return this.listComponents();

      case 'query_shadow_dom':
        return this.queryShadowDOM(params.selector, params.query);

      case 'get_component_state':
        return this.getComponentState(params.selector);

      case 'take_screenshot':
        return this.takeScreenshot(params.selector);

      default:
        throw new Error(`Unknown tool: ${tool}`);
    }
  },

  // Enhanced $ function with shadow DOM piercing
  $(selector, root = document) {
    // If it's already an element, return it
    if (selector instanceof Element) { return selector; }

    // Try normal query first
    let element = root.querySelector(selector);
    if (element) { return element; }

    // Deep search through shadow DOMs
    const walker = document.createTreeWalker(
      root,
      NodeFilter.SHOW_ELEMENT,
      {
        acceptNode: (node) => {
          if (node.shadowRoot) {
            const found = node.shadowRoot.querySelector(selector);
            if (found) {
              element = found;
              return NodeFilter.FILTER_REJECT;
            }
          }
          return NodeFilter.FILTER_SKIP;
        },
      },
    );

    while (walker.nextNode() && !element) {
      // Walker handles the traversal
    }

    return element;
  },

  inspectComponent(selector, depth = 3) {
    const element = this.$(selector);
    if (!element) { throw new Error(`Component not found: ${selector}`); }

    const data = this.componentRegistry.get(element);
    if (!data) {
      // Register it now if not already registered
      this.registerComponent(element);
    }

    const result = {
      tagName: element.tagName.toLowerCase(),
      id: element.id,
      classes: [...element.classList],
      attributes: [...element.attributes].map(a => ({
        name: a.name,
        value: a.value,
      })),
      properties: this.getComponentProperties(element),
      shadowRoot: null,
      lightDOM: this.serializeDOM(element, Math.min(depth, 2)),
      boundingRect: element.getBoundingClientRect(),
      registeredEvents: data ? data.events.length : 0,
      mutationCount: data ? data.mutations.length : 0,
    };

    if (element.shadowRoot && depth > 0) {
      result.shadowRoot = this.serializeDOM(element.shadowRoot, depth - 1);
    }

    return result;
  },

  executeInComponent(selector, code) {
    const element = this.$(selector);
    if (!element) { throw new Error(`Component not found: ${selector}`); }

    // Create safe execution context
    const context = {
      host: element,
      shadow: element.shadowRoot,
      $: (sel) => this.$(sel, element.shadowRoot || element),
      $$: (sel) => {
        const results = [];
        if (element.shadowRoot) {
          results.push(...element.shadowRoot.querySelectorAll(sel));
        }
        results.push(...element.querySelectorAll(sel));
        return results;
      },
      document: element.shadowRoot || document,
      getComputedStyle: window.getComputedStyle.bind(window),
      console: {
        log: (...args) => {
          console.log('[Component Execution]', ...args);
          return args;
        },
      },
    };

    // Execute with error handling
    try {
      const fn = new Function(...Object.keys(context), `"use strict"; return (${code})`);
      return fn(...Object.values(context));
    }
    catch (error) {
      throw new Error(`Execution failed: ${error.message}`);
    }
  },

  monitorEvents(selector, events) {
    const element = this.$(selector);
    if (!element) { throw new Error(`Component not found: ${selector}`); }

    const key = `${selector}:${events.join(',')}`;

    // Remove existing listeners
    if (this.eventListeners.has(key)) {
      const oldListeners = this.eventListeners.get(key);
      oldListeners.forEach(({ event, handler }) => {
        element.removeEventListener(event, handler);
      });
    }

    // Add new listeners
    const listeners = events.map(event => {
      const handler = (e) => {
        const eventData = {
          type: 'event-triggered',
          selector,
          event,
          detail: {
            type: e.type,
            target: e.target.tagName || e.target.nodeName,
            currentTarget: e.currentTarget.tagName || e.currentTarget.nodeName,
            composed: e.composed,
            bubbles: e.bubbles,
            detail: e.detail,
            timestamp: Date.now(),
            path: e.composedPath ? e.composedPath().map(n => n.tagName || n.nodeName).slice(0, 5) : [],
          },
        };

        console.log('📡 Event captured:', eventData);

        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.ws.send(JSON.stringify(eventData));
        }
      };

      element.addEventListener(event, handler, true);
      return { event, handler };
    });

    this.eventListeners.set(key, listeners);
    return { status: 'monitoring', events, selector, listenersActive: listeners.length };
  },

  getComputedStyles(selector, elementPath) {
    const component = this.$(selector);
    if (!component) { throw new Error(`Component not found: ${selector}`); }

    let element = component;

    // Navigate to specific element within shadow DOM
    if (elementPath) {
      if (component.shadowRoot) {
        element = component.shadowRoot.querySelector(elementPath);
      }
      else {
        element = component.querySelector(elementPath);
      }
      if (!element) { throw new Error(`Element not found: ${elementPath}`); }
    }

    const computed = window.getComputedStyle(element);
    const styles = {};

    // Get relevant computed styles (not all 300+ properties)
    const importantProps = [
      'display',
      'position',
      'width',
      'height',
      'margin',
      'padding',
      'border',
      'background',
      'color',
      'font-family',
      'font-size',
      'font-weight',
      'z-index',
      'opacity',
      'transform',
      'transition',
      'box-shadow',
      'border-radius',
      'overflow',
      'visibility',
    ];

    importantProps.forEach(prop => {
      styles[prop] = computed.getPropertyValue(prop);
    });

    // Get CSS custom properties
    const customProps = {};
    for (let i = 0; i < computed.length; i++) {
      const prop = computed[i];
      if (prop.startsWith('--')) {
        customProps[prop] = computed.getPropertyValue(prop);
      }
    }

    return {
      selector,
      elementPath,
      tagName: element.tagName.toLowerCase(),
      styles,
      customProperties: customProps,
      boundingBox: element.getBoundingClientRect(),
    };
  },

  getMutationHistory(selector, count = 10) {
    const element = this.$(selector);
    if (!element) { throw new Error(`Component not found: ${selector}`); }

    const data = this.componentRegistry.get(element);
    if (!data) { throw new Error(`Component not registered: ${selector}`); }

    return {
      selector,
      mutations: data.mutations.slice(-count),
      total: data.mutations.length,
      registeredAt: data.registeredAt,
    };
  },

  listComponents() {
    const components = [];

    document.querySelectorAll('*').forEach(el => {
      if (el.tagName.includes('-')) {
        const data = this.componentRegistry.get(el);
        components.push({
          tagName: el.tagName.toLowerCase(),
          id: el.id || null,
          classes: [...el.classList],
          hasShadowRoot: !!el.shadowRoot,
          isRegistered: !!data,
          boundingRect: el.getBoundingClientRect(),
        });
      }
    });

    return {
      total: components.length,
      components,
    };
  },

  queryShadowDOM(selector, query) {
    const component = this.$(selector);
    if (!component) { throw new Error(`Component not found: ${selector}`); }

    if (!component.shadowRoot) {
      throw new Error(`Component has no shadow root: ${selector}`);
    }

    const elements = [...component.shadowRoot.querySelectorAll(query)];

    return {
      selector,
      query,
      found: elements.length,
      elements: elements.map(el => ({
        tagName: el.tagName.toLowerCase(),
        id: el.id || null,
        classes: [...el.classList],
        attributes: [...el.attributes].map(a => ({ name: a.name, value: a.value })),
        textContent: el.textContent.trim().substring(0, 100),
        boundingRect: el.getBoundingClientRect(),
      })),
    };
  },

  getComponentState(selector) {
    const element = this.$(selector);
    if (!element) { throw new Error(`Component not found: ${selector}`); }

    // Try to get component state through common patterns
    const state = {
      properties: this.getComponentProperties(element),
      attributes: [...element.attributes].map(a => ({ name: a.name, value: a.value })),
      internalState: null,
      methods: [],
    };

    // Look for common state patterns
    if (element._state) { state.internalState = element._state; }
    if (element.state) { state.internalState = element.state; }
    if (element.data) { state.internalState = element.data; }

    // Get available methods
    const proto = Object.getPrototypeOf(element);
    Object.getOwnPropertyNames(proto).forEach(name => {
      if (
        typeof element[name] === 'function'
        && !name.startsWith('_')
        && name !== 'constructor'
        && !['addEventListener', 'removeEventListener', 'dispatchEvent'].includes(name)
      ) {
        state.methods.push(name);
      }
    });

    return state;
  },

  takeScreenshot(selector) {
    const element = this.$(selector);
    if (!element) { throw new Error(`Component not found: ${selector}`); }

    // Basic implementation - would need html2canvas for actual screenshots
    const rect = element.getBoundingClientRect();

    return {
      selector,
      boundingBox: {
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height,
        right: rect.right,
        bottom: rect.bottom,
      },
      viewport: {
        width: window.innerWidth,
        height: window.innerHeight,
      },
      note: 'For actual screenshots, html2canvas library would be needed',
    };
  },

  // Helper methods
  serializeDOM(root, maxDepth, currentDepth = 0) {
    if (currentDepth >= maxDepth) { return { type: 'truncated', maxDepthReached: true }; }

    const children = [];
    for (const child of root.children || []) {
      children.push({
        tagName: child.tagName.toLowerCase(),
        id: child.id || null,
        classes: [...child.classList],
        attributes: [...child.attributes].map(a => ({
          name: a.name,
          value: a.value,
        })),
        textContent: child.textContent ? child.textContent.trim().substring(0, 100) : '',
        children: this.serializeDOM(child, maxDepth, currentDepth + 1),
      });
    }

    return {
      type: root.nodeType === 11 ? 'shadow-root' : 'element',
      childCount: children.length,
      children,
    };
  },

  getComponentProperties(element) {
    const props = {};
    const proto = Object.getPrototypeOf(element);

    // Get all property descriptors
    Object.getOwnPropertyNames(proto).forEach(name => {
      if (name === 'constructor') { return; }

      try {
        const descriptor = Object.getOwnPropertyDescriptor(proto, name);
        if (descriptor && (descriptor.get || descriptor.value !== undefined)) {
          const value = element[name];

          // Only include serializable values
          if (
            typeof value === 'string'
            || typeof value === 'number'
            || typeof value === 'boolean'
            || value === null
            || value === undefined
          ) {
            props[name] = value;
          }
          else if (typeof value === 'object' && value !== element) {
            props[name] = '[Object]';
          }
          else if (typeof value === 'function') {
            props[name] = '[Function]';
          }
        }
      }
      catch (e) {
        // Some properties might throw
        props[name] = '[Error accessing property]';
      }
    });

    return props;
  },
};

// Auto-connect when script loads
document.addEventListener('DOMContentLoaded', () => {
  console.log('🚀 Debug bridge initializing...');

  // Make $ function globally available
  window.$ = window.__debugBridge.$.bind(window.__debugBridge);

  console.log('✅ Debug bridge ready');
});
