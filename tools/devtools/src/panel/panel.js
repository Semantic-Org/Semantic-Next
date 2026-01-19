import { MessageSources, MessageTypes } from '../shared/constants.js';
import { TreeView } from './components/tree-view.js';

// Panel state
let port = null;
let treeView = null;
let selectedNodeId = null;
let componentTree = null;

// DOM elements
const statusEl = document.getElementById('status');
const treeViewEl = document.getElementById('tree-view');
const refreshBtn = document.getElementById('refresh-btn');
const inspectorPlaceholder = document.getElementById('inspector-placeholder');
const inspectorContent = document.getElementById('inspector-content');
const elementSummary = document.getElementById('element-summary');
const elementDetails = document.getElementById('element-details');
const breadcrumb = document.getElementById('selected-element');

// Initialize connection to service worker
function initConnection() {
  try {
    port = chrome.runtime.connect({ name: MessageSources.PANEL });
  }
  catch (e) {
    // Extension context invalidated (extension was reloaded)
    statusEl.textContent = 'Extension reloaded - close and reopen DevTools';
    return;
  }

  port.onMessage.addListener(handleMessage);

  port.onDisconnect.addListener(() => {
    console.log('Disconnected from service worker');
    statusEl.textContent = 'Disconnected';
    // Only retry if context is still valid
    if (chrome.runtime?.id) {
      setTimeout(initConnection, 1000);
    }
    else {
      statusEl.textContent = 'Extension reloaded - close and reopen DevTools';
    }
  });

  // Send init message with tab ID
  port.postMessage({
    type: MessageTypes.PANEL_INIT,
    tabId: chrome.devtools.inspectedWindow.tabId,
  });

  statusEl.textContent = 'Connecting...';
}

// Handle messages from bridge
function handleMessage(message) {
  switch (message.type) {
    case MessageTypes.BRIDGE_READY:
      statusEl.textContent = 'Ready';
      requestComponentTree();
      break;

    case MessageTypes.COMPONENT_TREE:
      componentTree = message.tree;
      renderTree(message.tree);
      statusEl.textContent = `${countNodes(message.tree)} nodes`;
      break;

    case MessageTypes.TREE_UPDATED:
      componentTree = message.tree;
      renderTree(message.tree);
      break;

    case MessageTypes.INSPECTED_ELEMENT:
      renderInspectedElement(message.data);
      break;

    default:
      console.log('Unknown message type:', message.type);
  }
}

// Send message to bridge
function sendToBridge(type, payload = {}) {
  if (port) {
    port.postMessage({ type, ...payload });
  }
}

// Request component tree from bridge
function requestComponentTree() {
  sendToBridge(MessageTypes.GET_COMPONENT_TREE);
}

// Count total nodes in tree
function countNodes(nodes) {
  let count = 0;
  function traverse(nodeList) {
    for (const node of nodeList) {
      count++;
      if (node.children) {
        traverse(node.children);
      }
    }
  }
  traverse(nodes || []);
  return count;
}

// Render the component tree
function renderTree(tree) {
  if (!treeView) {
    treeView = new TreeView(treeViewEl, {
      onSelect: handleNodeSelect,
      onHover: handleNodeHover,
      onHoverEnd: handleNodeHoverEnd,
    });
  }
  treeView.render(tree);
}

// Handle node selection
function handleNodeSelect(node) {
  selectedNodeId = node.id;

  // Update breadcrumb
  breadcrumb.textContent = buildBreadcrumb(node);

  // Request full element data
  sendToBridge(MessageTypes.GET_INSPECTED_ELEMENT, { id: node.id });
}

// Handle node hover
function handleNodeHover(node) {
  sendToBridge(MessageTypes.HIGHLIGHT_ELEMENT, { id: node.id });
}

// Handle node hover end
function handleNodeHoverEnd() {
  sendToBridge(MessageTypes.CLEAR_HIGHLIGHT);
}

// Build breadcrumb string for selected element
function buildBreadcrumb(node) {
  if (!node) { return 'No element selected'; }

  let parts = [];
  let current = node;

  // Walk up to find ancestors (simplified - just show tag)
  parts.unshift(formatNodeForBreadcrumb(current));

  return parts.join(' > ');
}

// Format node for breadcrumb display
function formatNodeForBreadcrumb(node) {
  if (node.nodeType === 'text') { return '"..."'; }
  if (node.nodeType === 'comment') { return '<!--...-->'; }
  return `<${node.tagName || 'unknown'}>`;
}

// Render inspected element details
function renderInspectedElement(data) {
  if (!data || data.error) {
    inspectorPlaceholder.style.display = 'flex';
    inspectorContent.style.display = 'none';
    return;
  }

  inspectorPlaceholder.style.display = 'none';
  inspectorContent.style.display = 'block';

  // Element summary
  elementSummary.innerHTML = `
    <div style="color: ${
    data.isSUI ? 'var(--sui-component-color)' : 'var(--dom-element-color)'
  }; font-weight: 600; margin-bottom: 4px;">
      &lt;${data.tagName}&gt;
    </div>
    ${data.isSUI ? '<span style="color: var(--text-secondary);">Semantic UI Component</span>' : ''}
  `;

  // Element details
  let detailsHtml = '';

  // Attributes
  if (data.attributes && Object.keys(data.attributes).length > 0) {
    detailsHtml += `
      <div class="inspector-section">
        <div class="inspector-section-header">Attributes</div>
        <div class="inspector-section-content">
          <table class="property-table">
            ${
      Object.entries(data.attributes).map(([name, value]) => `
              <tr>
                <td class="property-name">${escapeHtml(name)}</td>
                <td class="property-value">${escapeHtml(value)}</td>
              </tr>
            `).join('')
    }
          </table>
        </div>
      </div>
    `;
  }

  // Settings (SUI only)
  if (data.settings) {
    detailsHtml += `
      <div class="inspector-section">
        <div class="inspector-section-header">Settings</div>
        <div class="inspector-section-content">
          <table class="property-table">
            ${
      Object.entries(data.settings.current || {}).map(([name, value]) => {
        const defaultVal = data.settings.defaults?.[name];
        const isModified = JSON.stringify(value) !== JSON.stringify(defaultVal);
        return `
                <tr>
                  <td class="property-name">${escapeHtml(name)}</td>
                  <td class="property-value ${isModified ? 'modified' : ''}">${formatValue(value)}</td>
                </tr>
              `;
      }).join('')
    }
          </table>
        </div>
      </div>
    `;
  }

  // State (SUI only)
  if (data.state && Object.keys(data.state).length > 0) {
    detailsHtml += `
      <div class="inspector-section">
        <div class="inspector-section-header">State</div>
        <div class="inspector-section-content">
          <table class="property-table">
            ${
      Object.entries(data.state).map(([name, value]) => `
              <tr>
                <td class="property-name">${escapeHtml(name)}</td>
                <td class="property-value">${formatValue(value)}</td>
              </tr>
            `).join('')
    }
          </table>
        </div>
      </div>
    `;
  }

  // Methods (SUI only)
  if (data.methods && data.methods.length > 0) {
    detailsHtml += `
      <div class="inspector-section">
        <div class="inspector-section-header">Methods</div>
        <div class="inspector-section-content">
          ${data.methods.map(m => `<div style="color: var(--text-secondary);">${escapeHtml(m)}()</div>`).join('')}
        </div>
      </div>
    `;
  }

  // Computed styles
  if (data.computedStyles) {
    detailsHtml += `
      <div class="inspector-section">
        <div class="inspector-section-header">Computed Styles</div>
        <div class="inspector-section-content">
          <table class="property-table">
            ${
      Object.entries(data.computedStyles).map(([name, value]) => `
              <tr>
                <td class="property-name">${escapeHtml(name)}</td>
                <td class="property-value">${escapeHtml(value)}</td>
              </tr>
            `).join('')
    }
          </table>
        </div>
      </div>
    `;
  }

  elementDetails.innerHTML = detailsHtml || '<p style="color: var(--text-muted);">No additional details</p>';
}

// Format value for display
function formatValue(value) {
  if (value === undefined) { return '<span style="color: var(--text-muted);">undefined</span>'; }
  if (value === null) { return '<span style="color: var(--text-muted);">null</span>'; }
  if (typeof value === 'string') { return `"${escapeHtml(value)}"`; }
  if (typeof value === 'boolean') { return `<span style="color: #569cd6;">${value}</span>`; }
  if (typeof value === 'number') { return `<span style="color: #b5cea8;">${value}</span>`; }
  if (Array.isArray(value)) { return `Array(${value.length})`; }
  if (typeof value === 'object') { return `{${Object.keys(value).length} keys}`; }
  return String(value);
}

// Escape HTML for safe display
function escapeHtml(str) {
  const div = document.createElement('div');
  div.textContent = String(str);
  return div.innerHTML;
}

// Event listeners
refreshBtn.addEventListener('click', requestComponentTree);

// Apply DevTools theme
function applyTheme() {
  const theme = chrome.devtools?.panels?.themeName || 'default';
  document.documentElement.setAttribute('data-theme', theme === 'dark' ? 'dark' : 'light');
}

// Initialize
applyTheme();
initConnection();

// Listen for panel shown event from devtools.js
window.addEventListener('message', (event) => {
  if (event.data?.type === 'PANEL_SHOWN') {
    requestComponentTree();
  }
});
