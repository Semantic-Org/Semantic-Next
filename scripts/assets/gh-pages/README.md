# Semantic UI Next - CDN

This repository hosts the CDN for Semantic UI Next, providing direct access to versioned packages.

## CDN Usage

All packages are available at [https://cdn.semantic-ui.com/](https://cdn.semantic-ui.com/)

### Direct Import

Import packages directly with specific versions:

```html
<script type="module">
  import { createSignal } from 'https://cdn.semantic-ui.com/@semantic-ui/reactivity/0.9.4/index.js';
</script>
```

### Using Import Maps

For a better developer experience, use our import maps:

```html
<!-- Latest version -->
<script type="importmap" src="https://cdn.semantic-ui.com/importmap-latest.json"></script>

<!-- Or specific version -->
<script type="importmap" src="https://cdn.semantic-ui.com/importmap-0.9.4.json"></script>

<script type="module">
  // Now you can import without version numbers or full URLs
  import { createSignal } from '@semantic-ui/reactivity';
  import { query } from '@semantic-ui/query';
  
  // Your code here
</script>
```

## Available Packages

- @semantic-ui/core
- @semantic-ui/reactivity
- @semantic-ui/query
- @semantic-ui/templating
- @semantic-ui/utils
- @semantic-ui/component
- @semantic-ui/renderer
- @semantic-ui/specs

## Structure

- Each package is organized by version: `/@semantic-ui/[package]/[version]/`
- Import maps:
  - Latest: `/importmap-latest.json`
  - Versioned: `/importmap-[version].json`

## Documentation

For full documentation, visit [semantic-ui.com](https://semantic-ui.com).