# Semantic UI CDN

This is the CDN for [Semantic UI Next](https://github.com/semantic-org/semantic-ui-next).

## Usage

You can import packages directly from this CDN in your web applications:

```html
<script type="module">
  import { createSignal } from 'https://cdn.semantic-ui.com/@semantic-ui/reactivity/0.10.0-test2/index.js';
</script>
```

## Import Maps

For a better developer experience, use our import maps:

```html
<script type="importmap" src="https://cdn.semantic-ui.com/importmap-latest.json"></script>
<script type="module">
  import { createSignal } from '@semantic-ui/reactivity';
  
  // Your code here
</script>
```

You can also use a specific version:

```html
<script type="importmap" src="https://cdn.semantic-ui.com/importmap-0.10.0-test2.json"></script>
```

## Available Versions

Each package is versioned independently. The core package is currently at version 0.10.0-test2.

## Documentation

For full documentation, visit [semantic-ui.com](https://semantic-ui.com).