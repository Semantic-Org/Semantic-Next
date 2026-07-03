# CodePlayground

Interactive code sandboxes for docs pages, built on [playground-elements](https://github.com/google/playground-elements). Upstream is effectively frozen, so treat its behavior as fixed and work around it here.

## The pieces

| Piece | Role |
|---|---|
| `CodePlayground.js` | Full editor: file tabs, CodeMirror, LSP, preview |
| `../ExamplePreview/` | Chromeless variant: project + preview only, for embedding live examples outside docs pages |
| `../../helpers/playground.js` / `injections.js` | Resolve example files, inject import maps, SUI bundles, error interceptor, theme script |
| `lib/playground-worker-fix.js` | Dev-only `Worker` shim (see below) |
| `public/sandbox/` | Vendored copies of the playground service worker, its proxy page, and the compile worker + `internal/typescript.js`. Copied manually from `node_modules/playground-elements` on upgrade — the version hash inside the service worker must match the installed package or projects loop waiting for an update |

## Rough edges

### Multiple playgrounds on one page

Every `playground-project` spawns its own module worker whose entry imports the ~9MB `internal/typescript.js`. The dev server's transform pipeline inflates that to ~45MB per request, and when several workers race the uncached module graph at a cold page load, every worker after the first can die — silently, because playground-elements attaches no worker `onerror`. A dead compile worker produces the full cascade: build never emits, the service worker awaits files forever, the preview iframe never commits.

The shim in `lib/playground-worker-fix.js` redirects the worker to the static copy under `/sandbox/` in dev (static serving bypasses the transform) and logs worker boot failures. Production serves bundler-emitted assets and is unaffected.

**When previews are blank, check the start of the pipeline first:** `project._build.state()` stuck at `'active'` with zero settled files means the compile worker is the problem, and everything downstream (service worker, theme, iframe) is symptom. Checking downstream layers first costs hours.

### Service worker sessions

The sandbox service worker resolves each session's files through an in-memory deferred that a `playground-project` fulfills over a MessagePort. Two sharp corners:

- Worker restarts wipe the session map and kill the ports. A fetch that arrives while its deferred exists but is unsettled waits forever — the reconnect nudge is only sent when *no* deferred exists.
- An iframe whose navigation never commits is wedged: `location.reload()` on the initial empty document is a no-op, and further navigations queue behind the pending one. Recovery requires replacing the iframe node, not reloading it.

### File encoding for `sample/html`

`playground-project` reads file content from script `textContent` and decodes only `&lt;/` sequences. Ship html content raw with just closing tags escaped (`</` → `&lt;/`) — full `escapeHTML` produces documents that render as source text. See `getProjectFiles` in `../ExamplePreview/ExamplePreview.js`.

### Theme

Sandbox documents can't read the embedding page's theme from localStorage — pages like the homepage force a theme without persisting it. The injected head script (and each `page`-type example's own copy) inherits from `window.frameElement.ownerDocument` instead, falling back to localStorage when not framed.

### `playground-preview` sizing

The element's host styles are `display: flex; flex-direction: column`, and its inner `#content { flex: 1 }` supplies the iframe's height. Overriding the host to `display: block` collapses that chain and the iframe silently falls back to the 150px iframe default. Style around it; don't change its display.

### Package URLs

The sandbox import map and injected bundles resolve from `injections.js`: local dev serves `${SITE}/node_modules`, static builds serve `${SITE}/packages` (populated by `copy-docs-packages.js`), production uses the jsdelivr CDN. `SITE` must be a real deployable origin at build time — prebuilt CI deploys bake the branch alias in via the deploy workflow, since `VERCEL_URL` doesn't exist outside Vercel's own builders.
