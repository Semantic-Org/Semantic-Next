# Semantic UI Build Scripts

This package contains the unified build system for Semantic UI components, bringing together the best aspects of the previous build systems.

### Component Builds

- `build-minified.js` - Creates minified ESM builds for components
- `build-browser.js` - Creates browser-optimized builds with dependencies
- `build-cdn.js` - Creates CDN-compatible builds with external imports

### Framework Builds

- `build-ui-framework.js` - Builds the main UI framework with components
- `build-ui-cdn.js` - Creates CDN-compatible builds for the UI framework
- `build-deps.js` - Builds component dependencies like CSS

## Output Structure

The build system generates a clean, optimized directory structure:

```
dist/
├── semantic-ui.js           # Main framework (unminified)
├── semantic-ui.js.map       # Source map
├── semantic-ui.min.js       # Main framework (minified)
├── semantic-ui.min.js.map   # Source map
├── semantic-ui.css          # Framework CSS (unminified)
├── semantic-ui.css.map      # Source map
├── semantic-ui.min.css      # Framework CSS (minified)
├── semantic-ui.min.css.map  # Source map
├── button.js                # Individual component (unminified)
├── button.min.js            # Individual component (minified)
└── ... (other components)

dist/bundle/                 # Bundled dependencies
├── button.js                # Individual component (unminified)
├── button.min.js            # Individual component (minified)
└── ... (other components)
```

dist/cdn/                    # CDN-compatible builds
├── button.js                # Individual component (unminified)
├── button.min.js            # Individual component (minified)
└── ... (other components)
```

## Usage

### Building Individual Components

The component build scripts are designed to be called from the component package's directory:

```js
// From a component's package.json
{
  "scripts": {
    "build:minified": "node ../../internal-packages/scripts/src/do-build-minified.js",
    "build:browser": "node ../../internal-packages/scripts/src/do-build-browser.js",
    "build:cdn": "node ../../internal-packages/scripts/src/do-build-cdn.js",
    "build": "npm run build:minified && npm run build:browser && npm run build:cdn"
  }
}
```

### Building the UI Framework

The UI framework build scripts are designed to be called from the root package's directory:

```js
// From the root package.json
{
  "scripts": {
    "build:deps": "node ./internal-packages/scripts/src/do-build-deps.js",
    "build:ui-framework": "node ./internal-packages/scripts/src/do-build-ui-framework.js",
    "build:ui-cdn": "node ./internal-packages/scripts/src/do-build-ui-cdn.js",
    "build": "npm run build:deps && npm run build:ui-framework && npm run build:ui-cdn"
  }
}
```
