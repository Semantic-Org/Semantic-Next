# Agent Memory & Project Architecture

This document outlines the core architectural decisions and technical implementation details for the `@semantic-ui/tailwind` package, an isomorphic Tailwind CSS compiler.

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
    "browser": "./src/browser.js",
    "node": "./src/server.js",
    "default": "./src/server.js"
  }
}
```

This is the most critical piece of the design. It instructs bundlers (like Vite, Webpack) and the Node.js runtime which file to use as the entry point based on the environment. This prevents Node.js-specific code from ever being included in a browser bundle, avoiding build-time errors. A runtime check (e.g., `if (isServer)`) is insufficient because bundlers would still try to resolve and bundle both paths.

### 2.2. The Server-Side Path (`src/server.js`)

* **Implementation**: This path is straightforward. It uses the official `@tailwindcss/node` and `@tailwindcss/oxide` packages.

* **Execution**: It leverages the native Rust binaries provided by `@tailwindcss/oxide` for maximum performance in the Node.js environment.

* **File**: `src/generator-server.js` contains this logic.

### 2.3. The Browser-Side Path (`src/browser.js`)

This path required a more custom solution to overcome the browser's limitations.

* **Custom WASM Build**: A custom, single-threaded version of the Oxide engine was compiled to WebAssembly. This allows the high-performance Rust-based scanner to run safely in any modern browser. The resulting files are stored in `/browser-wasm`.

* **Lazy Loading**: The WASM module and its JavaScript glue code are loaded dynamically and asynchronously using `import()`. This is a crucial performance optimization, ensuring the WASM binary (which can be sizable) is only fetched and compiled when `generateTailwindCSS` is actually called, not on initial page load.

* **Bundled Base Styles**: The browser cannot access the file system to read Tailwind's base CSS files (`preflight.css`, etc.). To solve this, the `generator-browser.js` file imports these styles as raw text using a bundler feature (`?raw`). This effectively embeds the CSS content into the final JavaScript bundle, making it available at runtime without `fs` access.

* **File**: `src/generator-browser.js` contains this logic.

## 3. API Design

The public API is designed to be simple and consistent across both environments.

* **Primary Function (`generateTailwindCSS`)**: The core function of the package, focused on the primary use case of compiling CSS from a string.

* **Secondary Plugin (`TailwindPlugin`)**: A higher-order function that wraps `generateTailwindCSS` for the specific use case of transforming a component definition object, as used in the new Semantic UI project.

* **Shared Utilities**: Simple, environment-agnostic utilities like `scanner.js` are shared between both server and browser paths.
