// Bridge script - runs in page context (MAIN world)
// Has access to window, DOM elements, and SUI component instances

(function() {
  'use strict';

  // Prevent double initialization
  if (window.__SUI_DEVTOOLS__) { return; }

  const BRIDGE_SOURCE = 'sui-devtools-bridge';
  const CONTENT_SOURCE = 'sui-devtools-content';

  // Message types (duplicated here since we can't import in IIFE)
  const MessageTypes = {
    GET_COMPONENT_TREE: 'GET_COMPONENT_TREE',
    GET_INSPECTED_ELEMENT: 'GET_INSPECTED_ELEMENT',
    HIGHLIGHT_ELEMENT: 'HIGHLIGHT_ELEMENT',
    CLEAR_HIGHLIGHT: 'CLEAR_HIGHLIGHT',
    UPDATE_FILTER_SETTINGS: 'UPDATE_FILTER_SETTINGS',
    LOG_TO_CONSOLE: 'LOG_TO_CONSOLE',
    COMPONENT_TREE: 'COMPONENT_TREE',
    INSPECTED_ELEMENT: 'INSPECTED_ELEMENT',
    TREE_UPDATED: 'TREE_UPDATED',
    BRIDGE_READY: 'BRIDGE_READY',
    PANEL_CLOSED: 'PANEL_CLOSED',
  };

  const bridge = {
    // Node registry (WeakMap for GC-friendly stable IDs)
    nodeRegistry: new WeakMap(),
    nodesById: new Map(),
    nextId: 1,

    // Filtering settings
    filterSettings: {
      hideCommentNodes: true,
      hideWrapperElements: true,
      hideScripts: true,
      hideStyles: true,
      hideEmptyText: true,
      hideHead: true,
    },

    // Known wrapper elements to filter
    wrapperElements: new Set([
      'astro-island',
      'astro-slot',
      'astro-static-slot',
    ]),

    // Elements whose children (especially text) should never be shown
    opaqueElements: new Set([
      'script',
      'style',
      'noscript',
    ]),

    // Highlight overlay element
    highlightOverlay: null,

    // Tree observer
    treeObserver: null,

    // Get or create stable ID for a node
    getOrCreateId(node) {
      let id = this.nodeRegistry.get(node);
      if (!id) {
        id = `node-${this.nextId++}`;
        this.nodeRegistry.set(node, id);
        this.nodesById.set(id, node);

        // Cleanup on destroy for SUI components
        if (this.isSUIComponent(node)) {
          node.addEventListener('destroyed', () => {
            this.nodesById.delete(id);
          }, { once: true });
        }
      }
      return id;
    },

    // Find node by ID
    findNodeById(id) {
      return this.nodesById.get(id);
    },

    // Detection - SUI components have a static `template` property on their constructor
    isSUIComponent(el) {
      return el?.nodeType === Node.ELEMENT_NODE
        && el?.constructor?.template !== undefined;
    },

    // Check if node should be filtered (hidden by default)
    shouldFilter(node, parentTagName = null) {
      const { filterSettings } = this;

      // Comment nodes (Lit markers)
      if (node.nodeType === Node.COMMENT_NODE) {
        return filterSettings.hideCommentNodes;
      }

      // Text nodes
      if (node.nodeType === Node.TEXT_NODE) {
        // Always hide text inside opaque elements (script, style, etc.)
        if (parentTagName && this.opaqueElements.has(parentTagName)) {
          return true;
        }
        // Filter if empty/whitespace
        return filterSettings.hideEmptyText && !node.textContent.trim();
      }

      // Element nodes
      if (node.nodeType === Node.ELEMENT_NODE) {
        const tagName = node.tagName.toLowerCase();

        // Head element
        if (tagName === 'head' && filterSettings.hideHead) {
          return true;
        }

        // Scripts
        if (tagName === 'script' && filterSettings.hideScripts) {
          return true;
        }

        // Styles
        if (tagName === 'style' && filterSettings.hideStyles) {
          return true;
        }

        // Known wrapper elements
        if (this.wrapperElements.has(tagName) && filterSettings.hideWrapperElements) {
          return true;
        }
      }

      return false;
    },

    // Build full DOM tree with SUI components highlighted
    getComponentTree() {
      // Start from <html> element
      const html = document.documentElement;
      const root = this.buildTreeNode(html, 0, null);
      return root ? [root] : [];
    },

    buildTreeNode(node, depth, parentTagName) {
      if (!node) { return null; }

      const nodeType = node.nodeType;
      const isElement = nodeType === Node.ELEMENT_NODE;
      const isText = nodeType === Node.TEXT_NODE;
      const isComment = nodeType === Node.COMMENT_NODE;

      // Skip nodes we don't handle
      if (!isElement && !isText && !isComment) { return null; }

      const isSUI = isElement && this.isSUIComponent(node);
      const tagName = isElement ? node.tagName.toLowerCase() : null;
      const filtered = this.shouldFilter(node, parentTagName);

      // For opaque elements (script, style), don't traverse children at all
      if (isElement && this.opaqueElements.has(tagName)) {
        return {
          id: this.getOrCreateId(node),
          nodeType: 'element',
          tagName,
          displayName: tagName,
          isSUI: false,
          hasChildren: false,
          hasShadow: false,
          depth,
          filtered,
          children: undefined,
        };
      }

      // Build child nodes
      let children = [];

      if (isElement) {
        // Shadow DOM children first
        if (node.shadowRoot) {
          for (const shadowChild of node.shadowRoot.childNodes) {
            const childNode = this.buildTreeNode(shadowChild, depth + 1, tagName);
            if (childNode) {
              childNode.inShadow = true;
              children.push(childNode);
            }
          }
        }

        // Light DOM children
        for (const child of node.childNodes) {
          const childNode = this.buildTreeNode(child, depth + 1, tagName);
          if (childNode) { children.push(childNode); }
        }
      }

      return {
        id: this.getOrCreateId(node),
        nodeType: isElement ? 'element' : (isText ? 'text' : 'comment'),
        tagName,
        displayName: this.getDisplayName(node),
        isSUI,
        hasChildren: children.length > 0,
        hasShadow: isElement && !!node.shadowRoot,
        depth,
        textPreview: isText ? node.textContent.trim().slice(0, 50) : undefined,
        filtered,
        attributes: isElement ? this.getTreeAttributes(node) : undefined,
        children: children.length > 0 ? children : undefined,
      };
    },

    // Get key attributes for tree display (id, class, and a few important ones)
    getTreeAttributes(el) {
      const attrs = {};
      // Priority attributes to show in tree
      const priorityAttrs = ['id', 'class', 'src', 'href', 'name', 'type', 'slot'];

      for (const name of priorityAttrs) {
        if (el.hasAttribute(name)) {
          let value = el.getAttribute(name);
          // Truncate long values
          if (value.length > 50) {
            value = value.slice(0, 50) + '…';
          }
          attrs[name] = value;
        }
      }
      return Object.keys(attrs).length > 0 ? attrs : undefined;
    },

    getDisplayName(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent.trim();
        return text ? `"${text.slice(0, 30)}${text.length > 30 ? '...' : ''}"` : '#text';
      }
      if (node.nodeType === Node.COMMENT_NODE) {
        return '#comment';
      }

      const el = node;

      // For SUI components, prefer spec name
      if (this.isSUIComponent(el) && el.componentSpec?.name) {
        return el.componentSpec.name;
      }

      // For SUI components without spec name, convert tag: ui-button -> Button
      if (this.isSUIComponent(el)) {
        return el.tagName.toLowerCase()
          .replace(/^ui-/, '')
          .replace(/-./g, m => m[1].toUpperCase())
          .replace(/^./, m => m.toUpperCase());
      }

      // Regular DOM element
      return el.tagName.toLowerCase();
    },

    // Get full data for inspected element
    getInspectedElement(id) {
      const node = this.findNodeById(id);
      if (!node) { return null; }

      // For non-element nodes, return minimal info
      if (node.nodeType !== Node.ELEMENT_NODE) {
        return {
          id,
          nodeType: node.nodeType === Node.TEXT_NODE ? 'text' : 'comment',
          textContent: node.textContent,
        };
      }

      const el = node;
      const isSUI = this.isSUIComponent(el);

      if (isSUI && el.template?.destroyed) {
        return { error: 'Component destroyed' };
      }

      return {
        id,
        tagName: el.tagName.toLowerCase(),
        isSUI,
        settings: isSUI ? this.extractSettings(el) : null,
        state: isSUI ? this.extractState(el) : null,
        methods: isSUI ? this.extractMethods(el) : null,
        spec: isSUI ? this.extractSpecInfo(el) : null,
        handlers: isSUI ? this.extractHandlers(el) : null,
        attributes: this.extractAttributes(el),
        computedStyles: this.extractComputedStyles(el),
      };
    },

    extractSettings(el) {
      const defaults = el.defaultSettings || {};
      const current = el.getSettings?.() || {};
      return { defaults, current };
    },

    extractState(el) {
      const state = el.template?.state || {};
      const result = {};
      for (const [key, signal] of Object.entries(state)) {
        if (signal?.get) {
          try {
            result[key] = signal.get();
          }
          catch (e) {
            result[key] = '[error reading]';
          }
        }
      }
      return result;
    },

    extractMethods(el) {
      const component = el.component;
      if (!component) { return []; }

      const methods = [];
      const keys = Object.keys(component);

      for (const key of keys) {
        if (typeof component[key] === 'function' && !key.startsWith('_')) {
          methods.push(key);
        }
      }

      return methods;
    },

    extractSpecInfo(el) {
      const spec = el.componentSpec;
      if (!spec) { return null; }

      return {
        types: spec.types || [],
        variations: spec.variations || [],
        states: spec.states || [],
        events: spec.events || [],
      };
    },

    extractHandlers(el) {
      const template = el.template;
      if (!template) { return null; }

      return {
        events: template.events ? Object.keys(template.events) : [],
        keys: template.keys ? Object.keys(template.keys) : [],
      };
    },

    extractAttributes(el) {
      const attrs = {};
      for (const attr of el.attributes) {
        attrs[attr.name] = attr.value;
      }
      return attrs;
    },

    extractComputedStyles(el) {
      const computed = getComputedStyle(el);
      return {
        display: computed.display,
        position: computed.position,
        width: computed.width,
        height: computed.height,
      };
    },

    // Highlight element on page
    highlightElement(id) {
      const el = this.findNodeById(id);

      if (!this.highlightOverlay) {
        this.highlightOverlay = document.createElement('div');
        this.highlightOverlay.id = 'sui-devtools-highlight';
        this.highlightOverlay.style.cssText = `
          position: fixed;
          pointer-events: none;
          z-index: 2147483646;
          background: rgba(99, 102, 241, 0.1);
          border: 2px solid rgba(99, 102, 241, 0.8);
          border-radius: 2px;
          transition: all 0.05s ease-out;
        `;
        document.body.appendChild(this.highlightOverlay);
      }

      if (el && el.nodeType === Node.ELEMENT_NODE) {
        const rect = el.getBoundingClientRect();
        this.highlightOverlay.style.display = 'block';
        this.highlightOverlay.style.top = `${rect.top}px`;
        this.highlightOverlay.style.left = `${rect.left}px`;
        this.highlightOverlay.style.width = `${rect.width}px`;
        this.highlightOverlay.style.height = `${rect.height}px`;
      }
      else {
        this.highlightOverlay.style.display = 'none';
      }
    },

    clearHighlight() {
      if (this.highlightOverlay) {
        this.highlightOverlay.style.display = 'none';
      }
    },

    // Log component to console
    logToConsole(id) {
      const el = this.findNodeById(id);
      if (!el) {
        console.log('Element not found');
        return;
      }

      const isSUI = this.isSUIComponent(el);

      console.group(`%c${el.tagName.toLowerCase()}`, 'color: #6366f1; font-weight: bold');
      console.log('Element:', el);

      if (isSUI) {
        console.log('Component:', el.component);
        console.log('State:', el.template?.state);
        console.log('Settings:', el.settings);
        console.log('Spec:', el.componentSpec);
      }

      console.groupEnd();

      // Store as $sui0 for easy access
      window.$sui0 = el;
      console.log('%c→ Also available as $sui0', 'color: #888');
    },

    // Update filter settings
    setFilterSettings(settings) {
      this.filterSettings = { ...this.filterSettings, ...settings };
    },

    // Start observing DOM for tree updates
    startTreeObservation() {
      if (this.treeObserver) { return; }

      this.treeObserver = new MutationObserver((mutations) => {
        let needsUpdate = false;

        for (const mutation of mutations) {
          if (mutation.type === 'childList') {
            for (const node of [...mutation.addedNodes, ...mutation.removedNodes]) {
              if (node.nodeType === Node.ELEMENT_NODE) {
                needsUpdate = true;
                break;
              }
            }
          }
          if (needsUpdate) { break; }
        }

        if (needsUpdate) {
          clearTimeout(this.treeObserver._updateTimeout);
          this.treeObserver._updateTimeout = setTimeout(() => {
            this.sendToPanel(MessageTypes.TREE_UPDATED, { tree: this.getComponentTree() });
          }, 100);
        }
      });

      this.treeObserver.observe(document.body, {
        childList: true,
        subtree: true,
      });
    },

    // Send message to panel via content script
    sendToPanel(type, data = {}) {
      window.postMessage({
        source: BRIDGE_SOURCE,
        payload: { type, ...data },
      }, '*');
    },

    // Handle messages from panel
    handleMessage(message) {
      switch (message.type) {
        case MessageTypes.GET_COMPONENT_TREE:
          this.sendToPanel(MessageTypes.COMPONENT_TREE, { tree: this.getComponentTree() });
          break;

        case MessageTypes.GET_INSPECTED_ELEMENT:
          this.sendToPanel(MessageTypes.INSPECTED_ELEMENT, {
            data: this.getInspectedElement(message.id),
          });
          break;

        case MessageTypes.HIGHLIGHT_ELEMENT:
          this.highlightElement(message.id);
          break;

        case MessageTypes.CLEAR_HIGHLIGHT:
          this.clearHighlight();
          break;

        case MessageTypes.UPDATE_FILTER_SETTINGS:
          this.setFilterSettings(message.settings);
          break;

        case MessageTypes.LOG_TO_CONSOLE:
          this.logToConsole(message.id);
          break;

        case MessageTypes.PANEL_CLOSED:
          this.clearHighlight();
          break;
      }
    },
  };

  // Listen for messages from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) { return; }
    if (!event.data || event.data.source !== CONTENT_SOURCE) { return; }

    bridge.handleMessage(event.data.payload);
  });

  // Expose bridge for debugging
  window.__SUI_DEVTOOLS__ = bridge;

  // Start tree observation
  bridge.startTreeObservation();

  // Notify that bridge is ready
  bridge.sendToPanel(MessageTypes.BRIDGE_READY, {});

  console.log('%cSUI DevTools%c bridge initialized', 'color: #6366f1; font-weight: bold', 'color: inherit');
})();
