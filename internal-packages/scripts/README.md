# Semantic UI Build Scripts

This package contains the unified build system for Semantic UI components, bringing together the best aspects of the previous build systems.

## Architecture

The build system is designed with the following architecture:

1. **Core Build Functionality** - Common utilities and configurations shared across all build types
2. **Component-Level Builds** - Specialized builds for individual packages
3. **Framework-Level Builds** - Builds for the main UI framework
4. **CDN Builds** - Special builds optimized for CDN distribution

## Available Build Scripts

### Core Utilities

- `config.js` - Common configuration used across all build scripts
- `log.js` - Logging utilities with support for ESBuild plugins
- `index.js` - Main exports for all build functions

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
├── global.css               # Alias for semantic-ui.css
├── global.min.css           # Alias for semantic-ui.min.css
├── theme.css                # Theme CSS (unminified)
├── theme.min.css            # Theme CSS (minified)
├── button.js                # Individual component (unminified)
├── button.min.js            # Individual component (minified)
├── button/                  # Component directory
│   ├── index.js             # Re-export (unminified)
│   └── index.min.js         # Re-export (minified)
├── card.js                  # Individual component
├── card.min.js              # Individual component (minified)
├── card/                    # Component directory
│   ├── index.js             # Re-export (unminified)
│   └── index.min.js         # Re-export (minified)
└── ... (other components)

dist/cdn/                    # CDN-compatible builds
├── semantic-ui.js           # Main framework (unminified)
├── semantic-ui.min.js       # Main framework (minified)
├── semantic-ui.css          # Framework CSS (unminified)
├── semantic-ui.min.css      # Framework CSS (minified)
├── global.css               # Alias for semantic-ui.css
├── global.min.css           # Alias for semantic-ui.min.css
├── theme.css                # Theme CSS (unminified)
├── theme.min.css            # Theme CSS (minified)
├── button.js                # Individual component (unminified)
├── button.min.js            # Individual component (minified)
├── button/                  # Component directory
│   ├── index.js             # Re-export (unminified)
│   └── index.min.js         # Re-export (minified)
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

## Customization

Each build script accepts various options for customization:

- `outDir` - Output directory
- `minify` - Whether to minify files
- `sourcemap` - Whether to generate source maps
- `watch` - Whether to watch for changes

See each script's documentation for more details on available options.

## Development

To extend the build system:

1. Add new utilities in `src/utils/`
2. Add new build scripts in `src/tasks/`
3. Add CLI entry points in `src/`
4. Update exports in `package.json`

## License

MIT