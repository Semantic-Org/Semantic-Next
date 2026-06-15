# @semantic-ui/server

Server-render Semantic UI components to Declarative Shadow DOM on any server or build step. The output self-hydrates when the component JavaScript loads in the browser. Pure string work, no DOM shim, so it runs in Node, Bun, Deno, or at the edge.

## Install

```bash
npm install @semantic-ui/server
```

## Expand a page

`renderHTML` takes an HTML string, expands every registered tag into DSD, and leaves the rest of the markup alone. Write your own tags, render the page, ship pre-rendered shadow content.

```js
import { renderHTML } from '@semantic-ui/server';
import './components/index.js'; // registers <my-button>, <app-card>, ...

const page = renderHTML('<main><my-button>Save</my-button></main>');
// <main><my-button><template shadowrootmode="open">...</template>Save</my-button></main>
```

A tag expands once its component is registered. Importing the module that calls `defineComponent` does that. First-party components register the same way:

```js
import '@semantic-ui/core/button'; // registers <ui-button>
```

Components authored with inline template and css strings register on import in Node. If yours use `?raw` template imports, register them through a bundler integration like [`@semantic-ui/vite`](../vite).

## Render one component

`render` takes a component and props and returns its DSD string. Use it to drop a single component into a larger template.

```js
import { render } from '@semantic-ui/server';
import { Button } from '@semantic-ui/core';

const html = render(Button, { emphasis: 'primary' }, { slots: { default: 'Click me' } });
// <ui-button emphasis="primary"><template shadowrootmode="open">...</template>Click me</ui-button>
```

Pass a registered tag name instead of a class:

```js
import '@semantic-ui/core/button';
const html = render('ui-button', { emphasis: 'primary' });
```

## With Express

```js
import express from 'express';
import { renderHTML } from '@semantic-ui/server';
import './components/index.js';

const app = express();
app.get('/', (req, res) => {
  res.type('html').send(renderHTML(`<!doctype html><html><body>
    <my-button>Hello</my-button>
    <script type="module" src="/client.js"></script>
  </body></html>`));
});
```

The `<script>` loads the component runtime, which hydrates the server-rendered DSD in place.

## With Hono or any Fetch-based runtime

`renderHTML` returns a string, so web-standard runtimes (Hono, Deno, Bun, edge) work the same through a `Response`. Fastify and a plain `node:http` server too.

```js
import { Hono } from 'hono';
import { renderHTML } from '@semantic-ui/server';
import './components/index.js';

const app = new Hono();
app.get('/', (c) => c.html(renderHTML('<my-button>Hello</my-button>')));
```

## API

- `renderHTML(html, { hydrate? })` — expand every registered tag in an HTML string
- `render(component, props?, { slots?, hydrate? })` — render one component (class or registered tag) to a DSD string
- `getComponent`, `hasComponent`, `registerComponent` — registry helpers re-exported from `@semantic-ui/component`

`hydrate` defaults to `true`. Pass `false` to mark output static (an `ssr` attribute) so the client runtime never claims it.

## Props across the boundary

String, boolean, and number props round-trip through HTML attributes. Plain objects serialize as JSON attributes. Functions and live object identity cannot cross as attributes. For rich data, embed it as JSON the component reads on hydrate, or set it as a property on the client after load.
