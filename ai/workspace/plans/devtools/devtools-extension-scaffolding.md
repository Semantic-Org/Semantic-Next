# SUI DevTools Extension: Scaffolding & Build Configuration

> **Chrome Extension Setup Guide for Manifest V3**
>
> This document covers project structure, manifest configuration, bundling strategy, and Chrome Web Store requirements for the SUI DevTools extension.

---

## Document Relationship

This is the third document in the SUI DevTools documentation set:

| Document | Purpose |
|----------|---------|
| **`sui-devtools-proposal.md`** | Architecture, design rationale, UI specifications |
| **`sui-devtools-build-plan.md`** | Implementation details, API references, phased development |
| **`sui-devtools-scaffolding.md`** (this) | Project setup, bundling, Chrome extension configuration |

---

## Table of Contents

1. [Manifest V3 Requirements](#manifest-v3-requirements)
2. [Project Structure](#project-structure)
3. [Manifest Configuration](#manifest-configuration)
4. [Bundling Strategy](#bundling-strategy)
5. [DevTools Panel Architecture](#devtools-panel-architecture)
6. [Page Context Injection](#page-context-injection)
7. [Messaging Architecture](#messaging-architecture)
8. [Build Scripts](#build-scripts)
9. [Development Workflow](#development-workflow)
10. [Chrome Web Store Compliance](#chrome-web-store-compliance)

---

## Manifest V3 Requirements

### Key MV3 Constraints

| Constraint | Impact on DevTools Extension |
|------------|------------------------------|
| **No remote code execution** | All code must be bundled in extension package |
| **Service worker (not background page)** | No persistent state, must handle wake/sleep |
| **Stricter CSP** | Cannot use `eval()`, inline scripts limited |
| **`chrome.scripting` API** | Replaces `chrome.tabs.executeScript()` |

### What This Means for Us

1. **Bundle everything**: `@semantic-ui/reactivity` must be bundled into bridge script
2. **Service worker for messaging**: Route messages between panel ↔ content script
3. **Use `world: "MAIN"`**: For bridge script to access page's `window` and component instances
4. **Web accessible resources**: Bridge script must be declared to allow injection

---

## Project Structure

```
sui-devtools/
├── manifest.json                 # Extension manifest (MV3)
├── package.json                  # Node dependencies & scripts
├── tsconfig.json                 # TypeScript config (optional)
├── esbuild.config.js             # Build configuration
│
├── src/
│   ├── devtools/
│   │   ├── devtools.html         # DevTools entry point
│   │   └── devtools.js           # Creates panel
│   │
│   ├── panel/
│   │   ├── panel.html            # Panel UI
│   │   ├── panel.js              # Panel logic (imports components)
│   │   ├── panel.css             # Panel styles
│   │   └── components/
│   │       ├── tree-view.js      # Component tree
│   │       ├── tabs.js           # Tab container
│   │       ├── styles-tab.js     # Styles inspector
│   │       ├── developer-tab.js  # Developer inspector
│   │       └── events-tab.js     # Events inspector
│   │
│   ├── background/
│   │   └── service-worker.js     # Message routing
│   │
│   ├── content/
│   │   ├── content-script.js     # Injected into page (isolated world)
│   │   └── bridge.js             # Injected into page (MAIN world)
│   │
│   └── shared/
│       ├── constants.js          # Message types, shared constants
│       ├── messaging.js          # Message utilities
│       └── specs/                # Bundled SUI specs (generated)
│           └── index.js
│
├── dist/                         # Build output
│   ├── manifest.json
│   ├── devtools/
│   ├── panel/
│   ├── background/
│   ├── content/
│   │   ├── content-script.js     # Bundled
│   │   └── bridge.js             # Bundled IIFE
│   └── icons/
│
├── scripts/
│   ├── build.js                  # Main build script
│   ├── build-specs.js            # Bundle SUI specs
│   └── watch.js                  # Dev mode with file watching
│
├── icons/
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
│
└── test/
    ├── fixtures/                 # Test HTML pages
    │   ├── basic.html
    │   ├── nested.html
    │   └── complex.html
    └── manual-test-checklist.md
```

---

## Manifest Configuration

### Complete manifest.json

```json
{
  "manifest_version": 3,
  "name": "Semantic UI DevTools",
  "version": "1.0.0",
  "description": "Developer tools for debugging Semantic UI web components",
  
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  
  "devtools_page": "devtools/devtools.html",
  
  "background": {
    "service_worker": "background/service-worker.js",
    "type": "module"
  },
  
  "content_scripts": [
    {
      "matches": ["<all_urls>"],
      "js": ["content/content-script.js"],
      "run_at": "document_idle",
      "all_frames": true
    }
  ],
  
  "permissions": [
    "scripting",
    "activeTab"
  ],
  
  "host_permissions": [
    "<all_urls>"
  ],
  
  "web_accessible_resources": [
    {
      "resources": ["content/bridge.js"],
      "matches": ["<all_urls>"]
    }
  ]
}
```

### Manifest Fields Explained

| Field | Purpose |
|-------|---------|
| `devtools_page` | Entry point when DevTools opens; loads our panel |
| `background.service_worker` | Handles messaging between contexts |
| `background.type: "module"` | Allows ES module imports in service worker |
| `content_scripts` | Auto-injected script for page communication |
| `permissions.scripting` | Required for `chrome.scripting.executeScript()` |
| `host_permissions` | Required to inject scripts into pages |
| `web_accessible_resources` | Makes bridge.js loadable from page context |

---

## Bundling Strategy

### Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Build Pipeline                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  src/content/bridge.js                                       │
│       │                                                      │
│       ▼ esbuild (bundle + IIFE)                             │
│  ┌─────────────────────────────────────┐                    │
│  │ dist/content/bridge.js              │                    │
│  │ - @semantic-ui/reactivity inlined   │                    │
│  │ - Self-contained IIFE               │                    │
│  │ - ~10KB gzipped                     │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
│  src/panel/*.js                                              │
│       │                                                      │
│       ▼ esbuild (bundle + ESM)                              │
│  ┌─────────────────────────────────────┐                    │
│  │ dist/panel/panel.js                 │                    │
│  │ - All components bundled            │                    │
│  │ - Specs inlined                     │                    │
│  └─────────────────────────────────────┘                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Why esbuild?

| Tool | Speed | Config | Output Formats | Our Choice |
|------|-------|--------|----------------|------------|
| **esbuild** | ⚡ Fastest | Minimal | ESM, IIFE, CJS | ✅ Yes |
| Rollup | Medium | Medium | All | Good alternative |
| Webpack | Slower | Complex | All | Overkill |
| Vite | Fast | Medium | ESM-focused | Good for dev |

### Critical: Bridge Script Bundling

The bridge script **must** be bundled as an IIFE (Immediately Invoked Function Expression) because:

1. It runs in page context via `<script>` tag injection
2. Page context doesn't support ES modules from extensions
3. All dependencies must be self-contained

```javascript
// esbuild config for bridge.js
{
  entryPoints: ['src/content/bridge.js'],
  bundle: true,
  format: 'iife',           // Critical: must be IIFE
  globalName: '__SUI_DEVTOOLS_BRIDGE__',
  outfile: 'dist/content/bridge.js',
  minify: process.env.NODE_ENV === 'production',
  sourcemap: process.env.NODE_ENV !== 'production',
}
```

### Package Dependencies

```json
{
  "name": "sui-devtools",
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "build": "node scripts/build.js",
    "build:specs": "node scripts/build-specs.js",
    "watch": "node scripts/watch.js",
    "clean": "rm -rf dist"
  },
  "devDependencies": {
    "esbuild": "^0.20.0"
  },
  "dependencies": {
    "@semantic-ui/reactivity": "^1.0.0"
  }
}
```

**Note**: `@semantic-ui/reactivity` is a runtime dependency because it gets bundled into bridge.js.

---

## DevTools Panel Architecture

### How DevTools Extensions Work

```
┌─────────────────────────────────────────────────────────────┐
│ Chrome DevTools Window                                       │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ devtools.html (loaded per DevTools instance)          │   │
│  │                                                       │   │
│  │  <script src="devtools.js">                          │   │
│  │    chrome.devtools.panels.create(                    │   │
│  │      "Semantic UI",    // Tab name                   │   │
│  │      "icon32.png",     // Tab icon                   │   │
│  │      "panel/panel.html" // Panel content             │   │
│  │    );                                                │   │
│  │  </script>                                           │   │
│  └──────────────────────────────────────────────────────┘   │
│                    │                                         │
│                    ▼                                         │
│  ┌──────────────────────────────────────────────────────┐   │
│  │ panel.html (our actual UI)                            │   │
│  │                                                       │   │
│  │  - Component tree                                    │   │
│  │  - Inspector tabs                                    │   │
│  │  - Communicates via chrome.runtime                   │   │
│  └──────────────────────────────────────────────────────┘   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### devtools.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
</head>
<body>
  <script src="devtools.js"></script>
</body>
</html>
```

### devtools.js

```javascript
// Create the panel when DevTools opens
chrome.devtools.panels.create(
  "Semantic UI",           // Panel title (shown in tab)
  "icons/icon32.png",      // Panel icon
  "panel/panel.html",      // Panel content page
  (panel) => {
    // Panel created callback
    panel.onShown.addListener((panelWindow) => {
      // Panel is now visible
      // panelWindow is the window object of panel.html
      panelWindow.postMessage({ type: 'PANEL_SHOWN' }, '*');
    });
    
    panel.onHidden.addListener(() => {
      // Panel is now hidden
    });
  }
);
```

### panel.html

```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" href="panel.css">
</head>
<body>
  <div id="app">
    <div id="tree-container"></div>
    <div id="inspector-container"></div>
  </div>
  <script type="module" src="panel.js"></script>
</body>
</html>
```

---

## Page Context Injection

### The Challenge

DevTools extensions run in an **isolated context** and cannot directly access:
- Page's `window` object
- DOM element properties like `el.component`
- SUI component instances

### Solution: Bridge Script in MAIN World

```
┌─────────────────────────────────────────────────────────────┐
│ Page Context (MAIN World)                                    │
│                                                              │
│  window.__SUI_DEVTOOLS__ = { ... }   ◄── bridge.js          │
│  el.component                         ◄── SUI components    │
│  el.template.state                    ◄── Reactive state    │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│ Content Script Context (Isolated World)                      │
│                                                              │
│  content-script.js                                           │
│  - Relays messages via postMessage                          │
│  - Cannot access window.__SUI_DEVTOOLS__                    │
│                                                              │
└─────────────────────────────────────────────────────────────┘
        │
        │ chrome.runtime.sendMessage()
        ▼
┌─────────────────────────────────────────────────────────────┐
│ Service Worker                                               │
│                                                              │
│  Routes messages to correct DevTools panel                   │
│                                                              │
└─────────────────────────────────────────────────────────────┘
        │
        │ chrome.runtime.sendMessage()
        ▼
┌─────────────────────────────────────────────────────────────┐
│ DevTools Panel                                               │
│                                                              │
│  panel.js - Renders UI, sends commands                       │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

### Injection Methods (MV3)

**Method 1: Script Tag Injection (Recommended)**

Content script injects bridge as a `<script>` tag pointing to web-accessible resource:

```javascript
// content-script.js
function injectBridge() {
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content/bridge.js');
  script.onload = () => script.remove();  // Clean up
  (document.head || document.documentElement).appendChild(script);
}

// Inject as early as possible
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectBridge);
} else {
  injectBridge();
}
```

**Method 2: chrome.scripting.executeScript (Alternative)**

From service worker, for dynamic injection:

```javascript
// service-worker.js
chrome.scripting.executeScript({
  target: { tabId: tabId },
  files: ['content/bridge.js'],
  world: 'MAIN',  // Critical: inject into page context
  injectImmediately: true,
});
```

### Why Method 1 is Preferred

| Aspect | Script Tag | executeScript |
|--------|------------|---------------|
| Timing control | ✅ DOMContentLoaded | ⚠️ Depends on when called |
| Works on page load | ✅ Yes | ⚠️ Requires trigger |
| Service worker state | ✅ Independent | ⚠️ Requires worker to be awake |
| Simplicity | ✅ Simple | ⚠️ More coordination needed |

---

## Messaging Architecture

### Four-Context Communication

```
┌─────────────┐     postMessage      ┌─────────────┐
│   Bridge    │◄────────────────────►│  Content    │
│ (MAIN world)│                      │   Script    │
└─────────────┘                      └─────────────┘
                                            │
                                            │ chrome.runtime
                                            ▼
┌─────────────┐     chrome.runtime   ┌─────────────┐
│   Panel     │◄────────────────────►│  Service    │
│             │                      │   Worker    │
└─────────────┘                      └─────────────┘
```

### Message Types

```javascript
// shared/constants.js
export const MessageTypes = {
  // Panel → Bridge (commands)
  GET_COMPONENT_TREE: 'GET_COMPONENT_TREE',
  GET_COMPONENT_DATA: 'GET_COMPONENT_DATA',
  SELECT_COMPONENT: 'SELECT_COMPONENT',
  UPDATE_ATTRIBUTE: 'UPDATE_ATTRIBUTE',
  START_PICKER: 'START_PICKER',
  START_STATE_OBSERVATION: 'START_STATE_OBSERVATION',
  STOP_STATE_OBSERVATION: 'STOP_STATE_OBSERVATION',
  
  // Bridge → Panel (events)
  COMPONENT_TREE: 'COMPONENT_TREE',
  COMPONENT_DATA: 'COMPONENT_DATA',
  STATE_UPDATE: 'STATE_UPDATE',
  ELEMENT_PICKED: 'ELEMENT_PICKED',
  COMPONENTS_CHANGED: 'COMPONENTS_CHANGED',
  
  // Internal
  PANEL_INIT: 'PANEL_INIT',
  BRIDGE_READY: 'BRIDGE_READY',
};
```

### Service Worker Implementation

```javascript
// background/service-worker.js

// Track connections from DevTools panels
const panelConnections = new Map();  // tabId -> port

// Handle connections from DevTools panels
chrome.runtime.onConnect.addListener((port) => {
  if (port.name !== 'sui-devtools-panel') return;
  
  let tabId = null;
  
  port.onMessage.addListener((message) => {
    // First message should identify the tab
    if (message.type === 'PANEL_INIT') {
      tabId = message.tabId;
      panelConnections.set(tabId, port);
      return;
    }
    
    // Forward to content script
    if (tabId) {
      chrome.tabs.sendMessage(tabId, message);
    }
  });
  
  port.onDisconnect.addListener(() => {
    if (tabId) {
      panelConnections.delete(tabId);
      // Notify content script to cleanup
      chrome.tabs.sendMessage(tabId, { type: 'PANEL_CLOSED' });
    }
  });
});

// Handle messages from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const tabId = sender.tab?.id;
  if (!tabId) return;
  
  // Forward to panel if connected
  const port = panelConnections.get(tabId);
  if (port) {
    port.postMessage(message);
  }
});
```

### Content Script Implementation

```javascript
// content/content-script.js

// Inject bridge into page context
function injectBridge() {
  if (document.querySelector('script[data-sui-devtools]')) return;
  
  const script = document.createElement('script');
  script.src = chrome.runtime.getURL('content/bridge.js');
  script.dataset.suiDevtools = 'true';
  script.onload = () => script.remove();
  (document.head || document.documentElement).appendChild(script);
}

// Relay messages from bridge to service worker
window.addEventListener('message', (event) => {
  if (event.source !== window) return;
  if (!event.data || event.data.source !== 'sui-devtools-bridge') return;
  
  chrome.runtime.sendMessage(event.data.payload);
});

// Relay messages from service worker to bridge
chrome.runtime.onMessage.addListener((message) => {
  window.postMessage({
    source: 'sui-devtools-content',
    payload: message,
  }, '*');
});

// Initialize
injectBridge();
```

### Bridge Script Implementation

```javascript
// content/bridge.js (bundled with @semantic-ui/reactivity)
import { Reaction } from '@semantic-ui/reactivity';

(function() {
  'use strict';
  
  // Prevent double initialization
  if (window.__SUI_DEVTOOLS__) return;
  
  const bridge = {
    // Element registry
    elementRegistry: new WeakMap(),
    elementById: new Map(),
    nextId: 1,
    
    // State observation
    stateReactions: new Map(),
    
    // Detection
    isSUIComponent(el) {
      return el?.nodeType === Node.ELEMENT_NODE && 
             el?.component !== undefined;
    },
    
    // ... (other methods from build plan)
  };
  
  // Listen for commands from content script
  window.addEventListener('message', (event) => {
    if (event.source !== window) return;
    if (!event.data || event.data.source !== 'sui-devtools-content') return;
    
    const { type, ...payload } = event.data.payload;
    
    switch (type) {
      case 'GET_COMPONENT_TREE':
        bridge.sendToPanel('COMPONENT_TREE', bridge.getComponentTree());
        break;
      case 'GET_COMPONENT_DATA':
        bridge.sendToPanel('COMPONENT_DATA', bridge.getComponentData(payload.id));
        break;
      // ... handle other message types
    }
  });
  
  // Send messages to content script (which forwards to panel)
  bridge.sendToPanel = (type, data) => {
    window.postMessage({
      source: 'sui-devtools-bridge',
      payload: { type, ...data },
    }, '*');
  };
  
  // Expose for debugging
  window.__SUI_DEVTOOLS__ = bridge;
  
  // Notify that bridge is ready
  bridge.sendToPanel('BRIDGE_READY', {});
})();
```

---

## Build Scripts

### Main Build Script

```javascript
// scripts/build.js
import * as esbuild from 'esbuild';
import { copyFileSync, mkdirSync, rmSync, existsSync } from 'fs';
import { dirname, join } from 'path';

const isProd = process.env.NODE_ENV === 'production';

// Clean dist
if (existsSync('dist')) {
  rmSync('dist', { recursive: true });
}
mkdirSync('dist', { recursive: true });

// Build configurations
const configs = [
  // Bridge script - IIFE for page context injection
  {
    entryPoints: ['src/content/bridge.js'],
    bundle: true,
    format: 'iife',
    outfile: 'dist/content/bridge.js',
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },
  
  // Content script - IIFE (content scripts can't use ESM)
  {
    entryPoints: ['src/content/content-script.js'],
    bundle: true,
    format: 'iife',
    outfile: 'dist/content/content-script.js',
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },
  
  // Service worker - ESM (supported in MV3)
  {
    entryPoints: ['src/background/service-worker.js'],
    bundle: true,
    format: 'esm',
    outfile: 'dist/background/service-worker.js',
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },
  
  // Panel - ESM (loaded in panel.html as type="module")
  {
    entryPoints: ['src/panel/panel.js'],
    bundle: true,
    format: 'esm',
    outfile: 'dist/panel/panel.js',
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },
  
  // DevTools entry - IIFE
  {
    entryPoints: ['src/devtools/devtools.js'],
    bundle: true,
    format: 'iife',
    outfile: 'dist/devtools/devtools.js',
    minify: isProd,
    sourcemap: !isProd,
    target: 'es2020',
  },
];

// Build all
await Promise.all(configs.map(config => esbuild.build(config)));

// Copy static files
const staticFiles = [
  ['manifest.json', 'dist/manifest.json'],
  ['src/devtools/devtools.html', 'dist/devtools/devtools.html'],
  ['src/panel/panel.html', 'dist/panel/panel.html'],
  ['src/panel/panel.css', 'dist/panel/panel.css'],
  ['icons/icon16.png', 'dist/icons/icon16.png'],
  ['icons/icon32.png', 'dist/icons/icon32.png'],
  ['icons/icon48.png', 'dist/icons/icon48.png'],
  ['icons/icon128.png', 'dist/icons/icon128.png'],
];

for (const [src, dest] of staticFiles) {
  mkdirSync(dirname(dest), { recursive: true });
  copyFileSync(src, dest);
}

console.log('Build complete!');
```

### Specs Bundle Script

```javascript
// scripts/build-specs.js
import { writeFileSync, mkdirSync } from 'fs';

// Import all specs from @semantic-ui/core
import * as Specs from '@semantic-ui/core/specs';

// Build lookup by tagName
// Duck type: full specs have exportName, component specs don't
const fullSpecsByTag = {};

for (const spec of Object.values(Specs)) {
  if (spec?.exportName) {
    fullSpecsByTag[spec.tagName] = spec;
  }
}

// Write bundled specs
mkdirSync('src/shared/specs', { recursive: true });
writeFileSync(
  'src/shared/specs/index.js',
  `// Auto-generated - do not edit
export default ${JSON.stringify(fullSpecsByTag, null, 2)};
`
);

console.log(`Bundled ${Object.keys(fullSpecsByTag).length} full specs`);
```

### Watch Script (Development)

```javascript
// scripts/watch.js
import * as esbuild from 'esbuild';
// ... same configs as build.js but with ctx.watch()

const contexts = await Promise.all(
  configs.map(config => esbuild.context(config))
);

await Promise.all(contexts.map(ctx => ctx.watch()));

console.log('Watching for changes...');
```

---

## Development Workflow

### Initial Setup

```bash
# Clone/create project
mkdir sui-devtools && cd sui-devtools

# Initialize
npm init -y
npm install --save-dev esbuild
npm install @semantic-ui/reactivity

# Create directory structure
mkdir -p src/{devtools,panel/components,background,content,shared/specs}
mkdir -p icons test/fixtures scripts

# Build specs (requires access to @semantic-ui/core)
npm run build:specs

# Build extension
npm run build
```

### Load Extension in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `dist/` folder
5. Open DevTools on any page → "Semantic UI" tab should appear

### Development Cycle

```bash
# Terminal 1: Watch for changes
npm run watch

# After making changes:
# 1. Go to chrome://extensions/
# 2. Click refresh icon on your extension
# 3. Close and reopen DevTools (for panel changes)
# 4. Refresh the inspected page (for content script changes)
```

### Debugging

| Context | How to Debug |
|---------|--------------|
| **Panel** | Right-click panel → "Inspect" opens DevTools-on-DevTools |
| **Service Worker** | chrome://extensions/ → click "Service worker" link |
| **Content Script** | Page's DevTools → Sources → Content scripts |
| **Bridge Script** | Page's DevTools → Console (runs in page context) |

---

## Chrome Web Store Compliance

### MV3 Policy Requirements

1. **All code must be bundled** - No remote code execution
2. **No `eval()` or `new Function()`** - esbuild handles this correctly
3. **Minimal permissions** - Only request what you need
4. **Clear description** - Explain what the extension does

### Permissions Justification

| Permission | Justification |
|------------|---------------|
| `scripting` | Required to inject bridge script into page context |
| `activeTab` | Access to current tab for DevTools integration |
| `<all_urls>` (host) | DevTools must work on any website using SUI |

### Privacy Considerations

- Extension only activates when DevTools is open
- No data collection or external communication
- All processing happens locally
- No persistent storage of page data

### Checklist Before Publishing

- [ ] All code bundled (no external scripts)
- [ ] Manifest version is 3
- [ ] Icons in all required sizes (16, 32, 48, 128)
- [ ] Description clearly explains functionality
- [ ] Screenshots of extension in action
- [ ] Privacy policy (if required)
- [ ] Test on multiple sites with SUI components

---

## Summary

### Key Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Bundler | esbuild | Fast, simple, good IIFE support |
| Bridge format | IIFE | Required for page context injection |
| Panel format | ESM | Modern, supports dynamic imports |
| Injection method | Script tag | Reliable, early execution |
| State observation | Bundled Reaction | True reactivity, small size |

### Build Output

```
dist/
├── manifest.json                 # 1 KB
├── devtools/
│   ├── devtools.html            # < 1 KB
│   └── devtools.js              # < 1 KB
├── panel/
│   ├── panel.html               # < 1 KB
│   ├── panel.css                # ~5 KB
│   └── panel.js                 # ~50 KB (with specs)
├── background/
│   └── service-worker.js        # ~2 KB
├── content/
│   ├── content-script.js        # ~1 KB
│   └── bridge.js                # ~15 KB (with Reaction)
└── icons/                       # ~10 KB total

Total: ~85 KB unpacked, ~30 KB compressed
```

### Next Steps

1. Create project structure
2. Implement build scripts
3. Follow `sui-devtools-build-plan.md` for Phase 1
4. Test, iterate, refine
