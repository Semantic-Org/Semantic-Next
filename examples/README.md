# @semantic-ui/examples

A walkthrough of [Semantic UI](https://next.semantic-ui.com) through working components. Each example is a complete, runnable web component — template, styles, behavior, and a host page that mounts it — built directly against the framework you'd install from npm.

The examples are sequenced from the smallest possible component to dense real-world patterns. Read them in order if you're learning the framework; jump to a specific one if you're looking for how to do a particular thing.

## Try it

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`. The landing page lists every example with a one-line description; each card links to a standalone page that mounts the component and shows the source.

You can also browse the examples on the [hosted docs site](https://next.semantic-ui.com).

## Reading an example

Each `src/<example-id>/` folder contains a self-contained component. The smallest, `minimal/`, looks like this:

```
minimal/
├── component.js       defineComponent({ tagName, template, css, ... })
└── page.html          a page that uses the component
```

Most examples split the template and styles into their own files and add a host page:

```
emoji-reactions/
├── component.js       defineComponent({ tagName, template, events, ... })
├── component.html     the template
├── component.css      shadow-scoped styles
└── page.html          a page that uses the component
```

Some add a `page.js` for page-level orchestration (e.g. configuring the component via `$(tag).settings({...})`) or a `page.css` for page-only styles. The `component.*` files are the example — the page files just put it on screen.

To copy an example into your own project, the `src/<example-id>/component.*` files are all you need; adjust the framework imports and drop the component into any HTML page.

## Contributing

The example sources are authored in the main repo under `docs/src/examples/` and mirrored here. To edit an example, change the file in `docs/src/examples/<example-id>/`. See [`scripts/README.md`](./scripts/README.md) for the build pipeline and curriculum authoring.

## License

MIT — see the repo root for full text.
