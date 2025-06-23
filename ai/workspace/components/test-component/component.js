/**
 * Test Component for MCP Debugging Environment
 * Demonstrates various web component patterns and debugging scenarios
 */

class TestComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._counter = 0;
    this._isExpanded = false;
    this._theme = 'default';
    this._data = [];
    this._timerId = null;
  }

  static get observedAttributes() {
    return ['theme', 'disabled', 'auto-increment'];
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
    this.dispatchEvent(
      new CustomEvent('test-component-connected', {
        detail: { counter: this._counter },
        bubbles: true,
        composed: true,
      }),
    );

    // Auto-increment if enabled
    if (this.hasAttribute('auto-increment')) {
      this.startAutoIncrement();
    }
  }

  disconnectedCallback() {
    this.stopAutoIncrement();
    this.dispatchEvent(
      new CustomEvent('test-component-disconnected', {
        detail: { finalCounter: this._counter },
        bubbles: true,
        composed: true,
      }),
    );
  }

  attributeChangedCallback(name, oldValue, newValue) {
    switch (name) {
      case 'theme':
        this._theme = newValue || 'default';
        break;
      case 'disabled':
        this.disabled = newValue !== null;
        break;
      case 'auto-increment':
        if (newValue !== null) {
          this.startAutoIncrement();
        }
        else {
          this.stopAutoIncrement();
        }
        break;
    }

    if (this.shadowRoot) {
      this.render();
    }
  }

  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          padding: 20px;
          border: 2px solid var(--border-color, #ccc);
          border-radius: 8px;
          font-family: system-ui, -apple-system, sans-serif;
          transition: all 0.3s ease;
          background: var(--bg-color, white);
        }
        
        :host([theme="dark"]) {
          --border-color: #555;
          --bg-color: #2a2a2a;
          --text-color: white;
          --button-bg: #4a90e2;
        }
        
        :host([theme="accent"]) {
          --border-color: #ff6b6b;
          --bg-color: #fff5f5;
          --text-color: #333;
          --button-bg: #ff6b6b;
        }
        
        :host([disabled]) {
          opacity: 0.6;
          pointer-events: none;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 16px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--border-color, #eee);
        }
        
        .title {
          font-size: 18px;
          font-weight: 600;
          color: var(--text-color, #333);
        }
        
        .theme-badge {
          background: var(--button-bg, #007bff);
          color: white;
          padding: 4px 8px;
          border-radius: 4px;
          font-size: 12px;
          font-weight: 500;
        }
        
        .counter-section {
          background: var(--section-bg, #f8f9fa);
          padding: 16px;
          border-radius: 6px;
          margin-bottom: 16px;
          text-align: center;
        }
        
        .counter-display {
          font-size: 24px;
          font-weight: bold;
          color: var(--text-color, #333);
          margin-bottom: 12px;
        }
        
        .button-group {
          display: flex;
          gap: 8px;
          justify-content: center;
          flex-wrap: wrap;
        }
        
        button {
          background: var(--button-bg, #007bff);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          transition: all 0.2s ease;
        }
        
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
        }
        
        button:active {
          transform: translateY(0);
        }
        
        button:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .secondary {
          background: var(--secondary-bg, #6c757d);
        }
        
        .danger {
          background: var(--danger-bg, #dc3545);
        }
        
        .success {
          background: var(--success-bg, #28a745);
        }
        
        .expandable-section {
          border: 1px solid var(--border-color, #ddd);
          border-radius: 6px;
          overflow: hidden;
          margin-bottom: 16px;
        }
        
        .expand-header {
          background: var(--header-bg, #f1f3f4);
          padding: 12px 16px;
          cursor: pointer;
          display: flex;
          justify-content: space-between;
          align-items: center;
          user-select: none;
        }
        
        .expand-header:hover {
          background: var(--header-hover-bg, #e8eaed);
        }
        
        .expand-content {
          padding: 16px;
          display: ${this._isExpanded ? 'block' : 'none'};
          background: var(--content-bg, white);
        }
        
        .data-section {
          background: var(--code-bg, #f8f9fa);
          border: 1px solid var(--border-color, #e9ecef);
          border-radius: 4px;
          padding: 12px;
          margin: 8px 0;
        }
        
        .data-item {
          padding: 8px;
          margin: 4px 0;
          background: white;
          border-radius: 3px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .status-indicator {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: ${this._counter > 10 ? '#28a745' : this._counter > 5 ? '#ffc107' : '#dc3545'};
          margin-right: 8px;
        }
        
        .debug-info {
          font-family: 'Courier New', monospace;
          font-size: 12px;
          background: var(--debug-bg, #f8f9fa);
          padding: 8px;
          border-radius: 4px;
          margin-top: 12px;
          white-space: pre-line;
        }
        
        .slot-content {
          border: 2px dashed var(--border-color, #ccc);
          padding: 16px;
          border-radius: 6px;
          margin-top: 16px;
          min-height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-color, #666);
        }
        
        .auto-increment-indicator {
          display: ${this.hasAttribute('auto-increment') ? 'inline-block' : 'none'};
          background: #ffc107;
          color: #333;
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 10px;
          font-weight: 600;
          margin-left: 8px;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        .pulsing {
          animation: pulse 1s infinite;
        }
      </style>
      
      <div class="header">
        <div class="title">
          🧪 Test Component
          <span class="auto-increment-indicator">AUTO</span>
        </div>
        <div class="theme-badge">${this._theme}</div>
      </div>
      
      <div class="counter-section">
        <div class="counter-display">
          <span class="status-indicator"></span>
          Counter: ${this._counter}
        </div>
        <div class="button-group">
          <button id="increment-btn">Increment (+1)</button>
          <button id="increment-5-btn">Add 5</button>
          <button id="reset-btn" class="secondary">Reset</button>
          <button id="random-btn" class="success">Random</button>
          <button id="error-btn" class="danger">Trigger Error</button>
        </div>
      </div>
      
      <div class="expandable-section">
        <div class="expand-header" id="expand-header">
          <span>📊 Data & State (Click to ${this._isExpanded ? 'collapse' : 'expand'})</span>
          <span>${this._isExpanded ? '▲' : '▼'}</span>
        </div>
        <div class="expand-content">
          <div class="data-section">
            <strong>Internal State:</strong>
            <div class="data-item">
              <span>Counter: ${this._counter}</span>
              <span>Type: ${typeof this._counter}</span>
            </div>
            <div class="data-item">
              <span>Expanded: ${this._isExpanded}</span>
              <span>Theme: ${this._theme}</span>
            </div>
            <div class="data-item">
              <span>Data Items: ${this._data.length}</span>
              <span>Auto-increment: ${this.hasAttribute('auto-increment')}</span>
            </div>
          </div>
          
          <button id="add-data-btn" class="success">Add Random Data</button>
          <button id="clear-data-btn" class="danger">Clear Data</button>
          
          ${
      this._data.length > 0
        ? `
            <div class="data-section">
              <strong>Data Array:</strong>
              ${
          this._data.map((item, index) => `
                <div class="data-item">
                  <span>${index}: ${JSON.stringify(item)}</span>
                  <button class="danger remove-data" data-index="${index}">×</button>
                </div>
              `).join('')
        }
            </div>
          `
        : ''
    }
        </div>
      </div>
      
      <div class="slot-content">
        <slot>🎯 Slot content will appear here</slot>
      </div>
      
      <div class="debug-info">
Debug Info:
- Component ID: ${this.id || 'No ID set'}
- Classes: ${this.className || 'No classes'}
- Shadow DOM: ${this.shadowRoot ? 'Attached' : 'Not attached'}
- Connected: ${this.isConnected}
- Disabled: ${this.hasAttribute('disabled')}
- Render time: ${new Date().toLocaleTimeString()}
      </div>
    `;
  }

  setupEventListeners() {
    const shadowRoot = this.shadowRoot;

    // Increment button
    shadowRoot.getElementById('increment-btn')?.addEventListener('click', () => {
      this.increment();
    });

    // Increment by 5
    shadowRoot.getElementById('increment-5-btn')?.addEventListener('click', () => {
      this.increment(5);
    });

    // Reset button
    shadowRoot.getElementById('reset-btn')?.addEventListener('click', () => {
      this.reset();
    });

    // Random button
    shadowRoot.getElementById('random-btn')?.addEventListener('click', () => {
      this.setCounter(Math.floor(Math.random() * 100));
    });

    // Error button (for testing error handling)
    shadowRoot.getElementById('error-btn')?.addEventListener('click', () => {
      this.triggerError();
    });

    // Expand/collapse
    shadowRoot.getElementById('expand-header')?.addEventListener('click', () => {
      this.toggleExpanded();
    });

    // Add data button
    shadowRoot.getElementById('add-data-btn')?.addEventListener('click', () => {
      this.addRandomData();
    });

    // Clear data button
    shadowRoot.getElementById('clear-data-btn')?.addEventListener('click', () => {
      this.clearData();
    });

    // Remove data buttons
    shadowRoot.querySelectorAll('.remove-data').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = parseInt(e.target.dataset.index);
        this.removeData(index);
      });
    });
  }

  // Public API methods
  increment(amount = 1) {
    const oldValue = this._counter;
    this._counter += amount;
    this.render();
    this.dispatchEvent(
      new CustomEvent('counter-changed', {
        detail: {
          oldValue,
          newValue: this._counter,
          amount,
        },
        bubbles: true,
        composed: true,
      }),
    );
  }

  reset() {
    const oldValue = this._counter;
    this._counter = 0;
    this.render();
    this.dispatchEvent(
      new CustomEvent('counter-reset', {
        detail: { oldValue },
        bubbles: true,
        composed: true,
      }),
    );
  }

  setCounter(value) {
    const oldValue = this._counter;
    this._counter = value;
    this.render();
    this.dispatchEvent(
      new CustomEvent('counter-set', {
        detail: { oldValue, newValue: value },
        bubbles: true,
        composed: true,
      }),
    );
  }

  toggleExpanded() {
    this._isExpanded = !this._isExpanded;
    this.render();
    this.dispatchEvent(
      new CustomEvent('section-toggled', {
        detail: { expanded: this._isExpanded },
        bubbles: true,
        composed: true,
      }),
    );
  }

  addRandomData() {
    const newItem = {
      id: Date.now(),
      value: Math.floor(Math.random() * 1000),
      timestamp: new Date().toISOString(),
      type: ['string', 'number', 'boolean'][Math.floor(Math.random() * 3)],
    };

    this._data.push(newItem);
    this.render();
    this.dispatchEvent(
      new CustomEvent('data-added', {
        detail: { item: newItem, total: this._data.length },
        bubbles: true,
        composed: true,
      }),
    );
  }

  clearData() {
    const count = this._data.length;
    this._data = [];
    this.render();
    this.dispatchEvent(
      new CustomEvent('data-cleared', {
        detail: { clearedCount: count },
        bubbles: true,
        composed: true,
      }),
    );
  }

  removeData(index) {
    if (index >= 0 && index < this._data.length) {
      const removed = this._data.splice(index, 1)[0];
      this.render();
      this.dispatchEvent(
        new CustomEvent('data-removed', {
          detail: { item: removed, index, remaining: this._data.length },
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  startAutoIncrement() {
    this.stopAutoIncrement();
    this._timerId = setInterval(() => {
      this.increment();
    }, 2000);
    this.dispatchEvent(
      new CustomEvent('auto-increment-started', {
        bubbles: true,
        composed: true,
      }),
    );
  }

  stopAutoIncrement() {
    if (this._timerId) {
      clearInterval(this._timerId);
      this._timerId = null;
      this.dispatchEvent(
        new CustomEvent('auto-increment-stopped', {
          bubbles: true,
          composed: true,
        }),
      );
    }
  }

  triggerError() {
    this.dispatchEvent(
      new CustomEvent('error-triggered', {
        detail: {
          message: 'Intentional test error',
          timestamp: Date.now(),
          counter: this._counter,
        },
        bubbles: true,
        composed: true,
      }),
    );

    // Simulate an actual error for testing
    setTimeout(() => {
      throw new Error('Test component intentional error for debugging');
    }, 100);
  }

  // Getters for debugging
  get counter() {
    return this._counter;
  }

  get theme() {
    return this._theme;
  }

  get isExpanded() {
    return this._isExpanded;
  }

  get data() {
    return [...this._data]; // Return copy
  }

  get state() {
    return {
      counter: this._counter,
      theme: this._theme,
      expanded: this._isExpanded,
      dataCount: this._data.length,
      autoIncrement: this.hasAttribute('auto-increment'),
      disabled: this.hasAttribute('disabled'),
    };
  }
}

// Register the component
customElements.define('test-component', TestComponent);

// Export for module usage
export { TestComponent };
