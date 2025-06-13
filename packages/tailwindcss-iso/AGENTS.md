# Agent Memory & Project Architecture

This document outlines the core architectural decisions and technical implementation details for the `tailwindcss-iso` package, an isomorphic Tailwind CSS compiler.

## 1. Primary Goal & Core Problem

The primary objective is to create a utility that can compile Tailwind CSS from a string of content within any JavaScript environment, both on the server (Node.js) and in the browser.

This addresses a significant gap in the standard Tailwind CSS tooling:

* **Browser Limitations**: The official Tailwind JIT/CDN build works by observing the live DOM. There is no standard tool for compiling a string of arbitrary HTML/JS content to CSS purely in client-side JavaScript.

* **Engine Constraints**: Tailwind's high-performance scanning engine, Oxide, is written in Rust and utilizes multi-threading. Standard WebAssembly (WASM) runtimes in web browsers do not support multi-threading, making a direct port impossible.

* **Environment Mismatch**: Node.js packages (`@tailwindcss/node`, `@tailwindcss/oxide`) rely on native APIs like `fs` and `path`, which will fail if included in a browser build.

## 2. Architectural Solution: Isomorphic by Design

To solve these problems, the package was designed to be "isomorphic," with two distinct execution paths that are resolved at build time, not runtime.

### 2.1. Conditional Exports: The Keystone

The entire architecture hinges on the `"exports"` map in `package.json`.

```json
"exports": {
  ".": {
    "types": "./types/index.d.ts",
    "browser": "./src/browser/index.js",
    "node": "./src/server/index.js",
    "default": "./src/server/index.js"
  },
  "./browser": {
    "types": "./types/index.d.ts",
    "default": "./src/browser/index.js"
  },
  "./server": {
    "types": "./types/index.d.ts",
    "default": "./src/server/index.js"
  }
}
```

This design provides:
- **Automatic Environment Detection**: Bundlers and Node.js automatically select the correct implementation
- **Explicit Override Options**: Developers can force browser or server implementations via `/browser` and `/server` endpoints
- **Build-Time Resolution**: Prevents Node.js-specific code from being included in browser bundles

### 2.2. The Server-Side Path (`src/server/`)

* **Implementation**: Uses the official `@tailwindcss/node` and `@tailwindcss/oxide` packages for maximum performance
* **Execution**: Leverages native Rust binaries provided by `@tailwindcss/oxide`
* **Files**: 
  - `src/server/index.js` - Main exports
  - `src/server/generate-tailwind-css.js` - CSS generation using native engine
  - `src/server/get-tailwind-classes.js` - Class extraction using native scanner

### 2.3. The Browser-Side Path (`src/browser/`)

This path required a custom solution to overcome browser limitations.

* **Custom WASM Build**: A custom, single-threaded version of the Oxide engine compiled to WebAssembly, stored in `src/browser/oxide/`
* **Lazy Loading**: WASM module loaded dynamically via `import()` for performance optimization
* **Bundled Base Styles**: Tailwind's base CSS files imported as raw text using bundler `?raw` feature
* **Files**:
  - `src/browser/index.js` - Main exports
  - `src/browser/generate-tailwind-css.js` - CSS generation using WASM engine
  - `src/browser/get-tailwind-classes.js` - Class extraction using WASM scanner
  - `src/browser/load-tailwind-css.js` - Stylesheet loading for browser environment
  - `src/browser/oxide/` - WASM binaries and TypeScript definitions

## 3. API Design

The public API is consistent across both environments:

### Core Functions

* **`generateTailwindCSS({ content, css, importCSS, candidates })`**: Compiles Tailwind CSS from content string
* **`getTailwindClasses({ content, returnPositions })`**: Extracts candidate classes from content
* **`loadTailwindCSS(id, base)`**: (Browser only) Loads Tailwind stylesheets

### Environment-Specific Imports

```javascript
// Automatic environment detection
import { generateTailwindCSS } from 'tailwindcss-iso';

// Force browser engine (WASM)
import { generateTailwindCSS } from 'tailwindcss-iso/browser';

// Force server engine (Native)
import { generateTailwindCSS } from 'tailwindcss-iso/server';
```

## 4. Implementation Details

### WASM Integration (Browser)

The browser implementation uses a specially compiled single-threaded version of Tailwind's Oxide scanner:

```javascript
// Dynamic WASM loading
const wasmModule = await import('./oxide/tailwindcss_oxide.js');
await wasmModule.default();
const Scanner = wasmModule.WasmScanner;
```

### Performance Considerations

* **Server**: Native Rust performance with multi-threading support
* **Browser**: Single-threaded WASM with lazy loading to minimize bundle impact
* **Memory**: Automatic cleanup and garbage collection for both environments

### Error Handling

Both implementations provide consistent error handling:
- WASM loading failures in browser
- Missing optional dependencies in Node.js
- Invalid content or configuration parameters

## 5. Package Structure

```
tailwindcss-iso/
├── src/
│   ├── browser/
│   │   ├── index.js                 # Browser exports
│   │   ├── generate-tailwind-css.js # CSS generation (WASM)
│   │   ├── get-tailwind-classes.js  # Class extraction (WASM)
│   │   ├── load-tailwind-css.js     # Stylesheet loading
│   │   └── oxide/                   # WASM binaries
│   └── server/
│       ├── index.js                 # Server exports
│       ├── generate-tailwind-css.js # CSS generation (Native)
│       └── get-tailwind-classes.js  # Class extraction (Native)
├── types/
│   └── index.d.ts                   # TypeScript definitions
└── package.json                     # Conditional exports configuration
```

This architecture ensures the package works reliably across all JavaScript environments while providing optimal performance for each platform.