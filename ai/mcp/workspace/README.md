# AI Workspace - MCP Debugging Environment

Complete web component debugging environment with Model Context Protocol (MCP) tools for AI agents.

## 🎯 Features

- **MCP WebSocket Server** - Real-time communication between AI agents and browser
- **Shadow DOM-Aware Debugging** - Pierces web component boundaries 
- **Component Auto-Discovery** - Automatic registration and tracking
- **Real-Time Event Streaming** - Monitor component events as they happen
- **Code Execution in Context** - Run JavaScript in component scope
- **State Introspection** - Deep component state analysis
- **Mutation Tracking** - Track DOM changes over time
- **CSS Analysis** - Computed styles and custom properties inspection

## 🚀 Quick Start

### Start the Development Environment

```bash
npm run dev:workspace
```

This starts:
- **Web Server**: `http://localhost:8080`
- **MCP WebSocket**: `ws://localhost:8081`

### Access the Interface

- **Main Dashboard**: `http://localhost:8080/public/`
- **Component Tester**: `http://localhost:8080/public/component.html`
- **Test Component Demo**: `http://localhost:8080/public/component.html?name=test-component`

## 🛠️ MCP Tools for AI Agents

### Core Inspection Tools

#### `inspect_component`
Deep analysis of component structure, attributes, and shadow DOM.

```javascript
{
  "tool": "inspect_component",
  "params": {
    "selector": "#my-component",
    "depth": 3
  }
}
```

#### `execute_in_component`
Execute JavaScript code within component context.

```javascript
{
  "tool": "execute_in_component", 
  "params": {
    "selector": "test-component",
    "code": "return { counter: host.counter, state: host.state }"
  }
}
```

#### `monitor_events`
Real-time event monitoring with WebSocket streaming.

```javascript
{
  "tool": "monitor_events",
  "params": {
    "selector": "#demo-test",
    "events": ["click", "counter-changed", "section-toggled"]
  }
}
```

### Shadow DOM Tools

#### `query_shadow_dom`
Query elements within shadow DOM boundaries.

```javascript
{
  "tool": "query_shadow_dom",
  "params": {
    "selector": "test-component",
    "query": "button.increment-btn"
  }
}
```

#### `get_computed_styles`
Analyze CSS styles and custom properties.

```javascript
{
  "tool": "get_computed_styles",
  "params": {
    "selector": "test-component",
    "elementPath": ".counter-display"
  }
}
```

### State & History Tools

#### `get_component_state`
Retrieve component's internal state and methods.

```javascript
{
  "tool": "get_component_state",
  "params": {
    "selector": "#demo-test"
  }
}
```

#### `mutation_history`
Track recent DOM changes within components.

```javascript
{
  "tool": "mutation_history",
  "params": {
    "selector": "test-component",
    "count": 10
  }
}
```

#### `list_components`
Discover all web components on the page.

```javascript
{
  "tool": "list_components",
  "params": {}
}
```

## 🧩 Creating Components

### Standard Component Structure

```
ai/workspace/components/my-component/
├── component.js        # Main component definition
├── component.html      # Template (optional)
└── component.css       # Styles (optional)
```

### Example Component

```javascript
// component.js
class MyComponent extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    this._counter = 0;
  }
  
  connectedCallback() {
    this.render();
  }
  
  render() {
    this.shadowRoot.innerHTML = `
      <style>
        :host { display: block; padding: 1rem; }
        button { padding: 0.5rem 1rem; }
      </style>
      <div>
        <p>Counter: ${this._counter}</p>
        <button onclick="this.getRootNode().host.increment()">+</button>
      </div>
    `;
  }
  
  increment() {
    this._counter++;
    this.render();
    this.dispatchEvent(new CustomEvent('counter-changed', {
      detail: { value: this._counter },
      bubbles: true,
      composed: true
    }));
  }
  
  get counter() { return this._counter; }
}

customElements.define('my-component', MyComponent);
```

## 🔍 Debugging Workflow

### 1. Component Discovery
```javascript
// Find all components
await tools.list_components({});

// Inspect specific component  
await tools.inspect_component({
  selector: "my-component",
  depth: 2
});
```

### 2. Event Monitoring
```javascript
// Monitor user interactions
await tools.monitor_events({
  selector: "my-component", 
  events: ["click", "counter-changed"]
});

// Events stream to WebSocket automatically
```

### 3. State Analysis
```javascript
// Check component state
await tools.get_component_state({
  selector: "my-component"
});

// Execute custom code
await tools.execute_in_component({
  selector: "my-component",
  code: "return { counter: host.counter, methods: Object.getOwnPropertyNames(host.__proto__) }"
});
```

### 4. Style Debugging
```javascript
// Analyze computed styles
await tools.get_computed_styles({
  selector: "my-component",
  elementPath: "button"
});
```

### 5. Change Tracking
```javascript
// View recent mutations
await tools.mutation_history({
  selector: "my-component",
  count: 5
});
```

## 📡 WebSocket Communication

### Message Types

#### Tool Requests (Agent → Browser)
```javascript
{
  "type": "mcp-tool-request",
  "tool": "inspect_component",
  "params": { "selector": "my-component" },
  "id": "req-123"
}
```

#### Tool Responses (Browser → Agent)
```javascript
{
  "type": "mcp-tool-response", 
  "id": "req-123",
  "result": { /* tool output */ }
}
```

#### Event Streams (Browser → Agent)
```javascript
{
  "type": "event-triggered",
  "selector": "my-component",
  "event": "counter-changed",
  "detail": {
    "type": "counter-changed",
    "target": "MY-COMPONENT",
    "detail": { "value": 5 },
    "timestamp": 1640995200000
  }
}
```

## 🎯 Test Components

### Basic Test Component
- **Location**: `components/test-component/component.js`
- **Features**: Counter, themes, state management, events
- **Usage**: Perfect for learning MCP debugging

### Example Component
- **Location**: `components/example/component.js` 
- **Features**: Semantic UI integration, reactive templates
- **Usage**: Framework-specific patterns

## 🔧 Technical Architecture

### Debug Bridge (`debug-bridge.js`)
- Component auto-registration
- Shadow DOM traversal
- Event delegation and capture
- MCP tool request handling
- WebSocket communication

### MCP Server (`build-ai-workspace.js`)
- WebSocket server on port 8081
- Tool request routing
- Event broadcasting
- Connection management

### esbuild Integration
- Debug bridge injection
- Live reloading
- Module serving
- Development server

## 📚 Documentation References

- **MCP Tools Schema**: `/mcp-tools.js`
- **Component Guide**: `/ai/guides/component-generation-instructions.md`
- **Query System**: `/ai/specialized/query-system-guide.md`
- **Mental Model**: `/ai/foundations/mental-model.md`

## 🎮 Usage Examples

### Debug a Broken Component
```javascript
// 1. Find the component
const components = await tools.list_components({});

// 2. Inspect its structure
const structure = await tools.inspect_component({
  selector: "broken-component"
});

// 3. Monitor for errors
await tools.monitor_events({
  selector: "broken-component",
  events: ["error", "click", "change"]
});

// 4. Execute diagnostic code
const diagnostics = await tools.execute_in_component({
  selector: "broken-component", 
  code: `
    return {
      hasErrors: !!shadow.querySelector('.error'),
      eventListeners: getEventListeners ? getEventListeners(host) : 'Not available',
      attributes: [...host.attributes].map(a => ({name: a.name, value: a.value}))
    }
  `
});
```

### Performance Analysis
```javascript
// Monitor mutations for performance issues
const mutations = await tools.mutation_history({
  selector: "heavy-component",
  count: 20
});

// Check computed styles for layout issues  
const styles = await tools.get_computed_styles({
  selector: "heavy-component",
  elementPath: ".performance-critical-element"
});
```

---

## 🎉 Ready to Debug!

The MCP debugging environment provides comprehensive tools for AI agents to inspect, monitor, and debug web components with full shadow DOM support and real-time event streaming.

Start the server with `npm run dev:workspace` and begin debugging!