# @semantic-ui/server

Framework-agnostic server-side rendering for Semantic UI. Render components to Declarative Shadow DOM on any server or build step. The rendered HTML self-hydrates when the component's JavaScript loads in the browser.

## Install

```bash
npm install @semantic-ui/server
```

## Render a component

```js
import { render } from '@semantic-ui/server';
import { Button } from '@semantic-ui/core';

const html = render(Button, { emphasis: 'primary' }, { slots: { default: 'Click me' } });
// <ui-button emphasis="primary"><template shadowrootmode="open">...</template>Click me</ui-button>
```

Pass a registered tag name instead of a class:

```js
import '@semantic-ui/core/button'; // registers <ui-button>
const html = render('ui-button', { emphasis: 'primary' });
```

## Render a whole page

`renderHTML` expands every registered Semantic UI tag in an HTML string and leaves everything else alone. Use it with any templating engine that emits `<ui-*>` tags.

```js
import { renderHTML } from '@semantic-ui/server';
import '@semantic-ui/core/button';

const page = renderHTML('<main><ui-button>Save</ui-button></main>');
```

## With Express

```js
import express from 'express';
import { render } from '@semantic-ui/server';
import { Button } from '@semantic-ui/core';

const app = express();
app.get('/', (req, res) => {
  res.type('html').send(`<!doctype html><html><body>
    ${render(Button, {}, { slots: { default: 'Hello' } })}
    <script type="module" src="/client.js"></script>
  </body></html>`);
});
```

The `<script>` loads the component runtime, which hydrates the server-rendered DSD in place.

## With Hono or any Fetch-based runtime

`render` returns a string, so web-standard runtimes (Hono, Deno, Bun, edge) work the same way through a `Response`:

```js
import { Hono } from 'hono';
import { render } from '@semantic-ui/server';
import { Button } from '@semantic-ui/core';

const app = new Hono();
app.get('/', (c) => c.html(render(Button, {}, { slots: { default: 'Hello' } })));
```

Fastify and a plain `node:http` server work the same way.

## API

- `render(component, props?, { slots?, hydrate? })` — render one component (class or registered tag) to a DSD string
- `renderHTML(html, { hydrate? })` — expand every registered Semantic UI tag in an HTML string
- `getComponent`, `hasComponent`, `registerComponent` — registry helpers re-exported from `@semantic-ui/component`

`hydrate` defaults to `true`. Pass `false` to mark output static (an `ssr` attribute) so it is never claimed by the client runtime.

## Props across the boundary

String, boolean, and number props round-trip through HTML attributes. Plain objects serialize as JSON attributes. Functions and live object identity cannot cross as attributes — for rich data, embed it as JSON the component reads on hydrate, or set it as a property on the client after load.
