# CDN URL Structure and Import Map Design Evaluation

## 1. URL Structure

### The Core Tension

The existing plan inherits the jsdelivr convention: `cdn.semantic-ui.com/npm/@semantic-ui/core@0.18.0/dist/cdn/component.js`. This was chosen so switching from jsdelivr would be a domain-level find-and-replace. But that goal assumes a transitional period that doesn't apply here -- this is a fresh CDN for a framework that hasn't shipped its CDN format yet. There is no installed base of jsdelivr URLs to migrate from. The opportunity is to design the ideal URL structure without backward-compatibility constraints.

### Recommended Structure

**First-party (Semantic UI) packages -- clean, prominent:**

```
cdn.semantic-ui.com/@semantic-ui/core@0.18.0/semantic-ui.min.js
cdn.semantic-ui.com/@semantic-ui/component@0.18.0/component.min.js
cdn.semantic-ui.com/@semantic-ui/reactivity@0.18.0/reactivity.min.js
cdn.semantic-ui.com/@semantic-ui/utils@0.18.0/utils.min.js
```

**Third-party (hosted dependencies) -- utilitarian, namespaced:**

```
cdn.semantic-ui.com/vendor/lit@3.0.0/directive.js
cdn.semantic-ui.com/vendor/lit@3.0.0/directives/repeat.js
cdn.semantic-ui.com/vendor/tailwindcss-iso@1.0.6/dist/browser.min.js
cdn.semantic-ui.com/vendor/@lit/reactive-element@2.0.0/reactive-element.js
```

**Meta-files (import maps, loader, CSS):**

```
cdn.semantic-ui.com/importmap.js              # loader script
cdn.semantic-ui.com/importmap@0.18.0.json     # versioned import map
cdn.semantic-ui.com/importmap@latest.json      # alias
cdn.semantic-ui.com/semantic-ui@0.18.0.css     # framework stylesheet
cdn.semantic-ui.com/semantic-ui@latest.css      # alias
```

### Why This Structure

**No `/npm/` prefix.** The `/npm/` segment exists on jsDelivr/unpkg because they host multiple registries (npm, GitHub, WordPress). This CDN serves exactly one thing: Semantic UI and its dependencies. The prefix adds noise and teaches the wrong mental model -- that this is a general-purpose npm mirror. Removing it makes every URL shorter and more purposeful.

**No `/dist/cdn/` in the path.** The internal build artifact directory structure (`dist/cdn/component.min.js`) is an implementation detail. The CDN should serve the file at the path users think about: `@semantic-ui/component@0.18.0/component.min.js`. The Cloudflare Worker maps this to the actual file in R2 storage. The physical R2 key can be whatever you want (e.g., `packages/@semantic-ui/component/0.18.0/dist/cdn/component.min.js`). What matters is the public URL.

**`@` separator for version (not `/`).** `@semantic-ui/core@0.18.0` keeps the package identity and version as a single "unit" before the file path begins. It reads naturally (`core at version 0.18.0`) and matches the npm convention developers already know (`npm install @semantic-ui/core@0.18.0`). Compare:

- `@semantic-ui/core@0.18.0/component.min.js` -- version attached to package
- `@semantic-ui/core/0.18.0/component.min.js` -- version looks like a directory

The `@` form has a clear semantic: everything before the first `/` after the version is the package+version identifier. The `/` form makes version indistinguishable from a path segment without prior knowledge.

However, there is a reasonable counter-argument: `@` in a URL path is unusual and could confuse some tools. Deno's CDN uses `/` (`deno.land/x/module@version`), but esm.sh and unpkg use `@`. The convention is well-established enough that `@` is the safer choice for developer recognition.

**`/vendor/` namespace for third-party.** This accomplishes several things simultaneously:

1. **Visual hierarchy.** When a developer sees `cdn.semantic-ui.com/vendor/lit@3.0.0/...` in a network trace or import map, they immediately understand this is a dependency being hosted as a convenience, not a first-class SUI package.
2. **Cache partitioning.** The Worker can apply different cache headers to `/vendor/` paths (long `immutable` TTL, never changes) vs SUI paths (where `latest`/`canary` aliases need shorter TTLs).
3. **Future-proofing.** If you ever need to add a package at the top level (e.g., `@semantic-ui/icons`), there's zero risk of collision with a third-party package name.
4. **Routing clarity.** In the Cloudflare Worker, `if (path.startsWith('/vendor/'))` immediately partitions the logic.

The alternative is a flat namespace where `lit@3.0.0` and `@semantic-ui/core@0.18.0` live side by side. This is simpler but violates the stated goal that SUI packages should be first-class citizens with the cleanest URLs. Flat namespacing implicitly treats lit as a peer of SUI.

### URL Parsing Logic (Cloudflare Worker)

The Worker needs to parse three URL forms:

```
/@semantic-ui/{pkg}@{version}/{filepath}    --> R2: @semantic-ui/{pkg}/{version}/{filepath}
/vendor/{pkg}@{version}/{filepath}          --> R2: vendor/{pkg}/{version}/{filepath}
/vendor/@{scope}/{pkg}@{version}/{filepath} --> R2: vendor/@{scope}/{pkg}/{version}/{filepath}
/{meta-file}                                --> R2: meta/{meta-file}
```

The regex for extracting package+version from a scoped package path is slightly involved but well-trodden:

```js
// Matches: @scope/name@version or name@version
const PKG_RE = /^\/(?:vendor\/)?((?:@[^/]+\/)?[^@]+)@([^/]+)\/(.+)$/;
```

### Alternative Considered: jsdelivr-Compatible URLs

```
cdn.semantic-ui.com/npm/@semantic-ui/core@0.18.0/dist/cdn/semantic-ui.min.js
```

**Why I recommend against this:**

- The `/npm/` prefix and `/dist/cdn/` path are both meaningless to end users
- The "domain-level find-and-replace" benefit applies to a transition that won't happen -- the CDN format isn't deployed to jsdelivr yet, and once it deploys to the new CDN there's no reason to move back
- It makes import map entries significantly longer, making the getting-started experience worse
- It exposes internal build structure, which creates a contract you have to maintain forever

---

## 2. Getting Started HTML

### (a) Using Pre-Built Components

This is the user who wants buttons, modals, inputs -- the full Semantic UI design system. They import `core` and get everything.

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.semantic-ui.com/semantic-ui@0.18.0.css">
  <script src="https://cdn.semantic-ui.com/importmap.js"></script>
</head>
<body>

  <ui-button primary>Click Me</ui-button>

  <script type="module">
    import '@semantic-ui/core';
  </script>

</body>
</html>
```

**Three lines in `<head>`, one import, done.** The import map loader handles all resolution. The user writes `import '@semantic-ui/core'` and every component is registered.

If the user wants version pinning (production):

```html
<!DOCTYPE html>
<html>
<head>
  <link rel="stylesheet" href="https://cdn.semantic-ui.com/semantic-ui@0.18.0.css">
  <script type="importmap">
  {
    "imports": {
      "@semantic-ui/core": "https://cdn.semantic-ui.com/@semantic-ui/core@0.18.0/semantic-ui.min.js"
    }
  }
  </script>
</head>
<body>

  <ui-button primary>Click Me</ui-button>

  <script type="module">
    import '@semantic-ui/core';
  </script>

</body>
</html>
```

**Key design choices:**

- The import map only needs ONE entry (`@semantic-ui/core`). All internal cross-package imports are already rewritten to full CDN URLs inside the CDN format files. The user never maps `@semantic-ui/utils` or `lit` -- that's the whole point of the CDN format.
- The CSS is a separate `<link>` tag, not a JS import. This is intentional: CSS should load in parallel with JS, and there's no FOUC concern since web component styles are encapsulated. The framework CSS provides global tokens, reset, and theme values.
- The `importmap.js` loader fetches `latest` by default. For the "just trying it out" case, this is ideal. The static import map version is shown for production use.

### (b) Building Custom Components

This user wants `defineComponent` but not the pre-built UI components.

```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
  {
    "imports": {
      "@semantic-ui/component": "https://cdn.semantic-ui.com/@semantic-ui/component@0.18.0/component.min.js"
    }
  }
  </script>
</head>
<body>

  <current-time></current-time>

  <script type="module">
    import { defineComponent } from '@semantic-ui/component';

    defineComponent({
      tagName: 'current-time',
      template: `Time is <b>{formatDate time "h:mm:ss a"}</b>`,
      css: 'b { color: var(--primary-text-color); }',
      defaultState: { time: new Date() },
      onCreated({ state }) {
        setInterval(() => state.time.now(), 1000);
      }
    });
  </script>

</body>
</html>
```

**No CSS link needed** (component styles are self-contained). **No import map loader** (a single static mapping is simpler than fetching a JSON file). **One import map entry.**

### What Makes This Better Than the Existing Getting-Started

Compare the recommended import map entry:

```
"@semantic-ui/component": "https://cdn.semantic-ui.com/@semantic-ui/component@0.18.0/component.min.js"
```

vs. the current GH Pages version:

```
"@semantic-ui/component": "https://cdn.semantic-ui.com/@semantic-ui/component/0.18.0/src/index.js"
```

The recommended version:
1. Uses the CDN format (`.min.js` with rewritten imports), not the raw source (`src/index.js`)
2. Has a named entry point (`component.min.js`) that reads clearly
3. Uses `@version` which is immediately recognizable as a version specifier

---

## 3. Import Map Loader

### Should the Loader Use the Same URLs?

**Yes, absolutely.** The loader should resolve to exactly the same URLs as a hand-written import map. The principle: if a user starts with the loader and later switches to a static import map (for production), they should be able to copy-paste the resolved URLs without any change in behavior.

If the loader used a different URL scheme (e.g., unversioned paths that the Worker resolves to versioned files via redirect), you'd create two parallel URL universes:

- Loader universe: `cdn.semantic-ui.com/@semantic-ui/core/latest/semantic-ui.min.js`
- Static universe: `cdn.semantic-ui.com/@semantic-ui/core@0.18.0/semantic-ui.min.js`

These would resolve to the same file but be different URLs, defeating the browser's module deduplication (which is URL-identity-based). If any module was loaded via both paths, you'd get duplicate instantiation.

### Loader Design

The current loader fetches a JSON file and injects it as an import map. This has a fundamental sequencing problem: `<script type="module">` blocks in the HTML won't wait for the async fetch to complete. The existing code dispatches an `importmap-ready` event, but this forces users into callback-based initialization, which defeats the purpose of ES module ergonomics.

**Recommended approach: inline the import map in the loader script itself.**

The loader script at `cdn.semantic-ui.com/importmap.js` should not be a fetcher -- it should contain the import map data directly:

```js
// cdn.semantic-ui.com/importmap.js
// Auto-generated at publish time -- do not edit
(function() {
  const script = document.createElement('script');
  script.type = 'importmap';
  script.textContent = JSON.stringify({
    "imports": {
      "@semantic-ui/core": "https://cdn.semantic-ui.com/@semantic-ui/core@0.18.0/semantic-ui.min.js",
      "@semantic-ui/component": "https://cdn.semantic-ui.com/@semantic-ui/component@0.18.0/component.min.js"
    }
  });
  document.currentScript.after(script);
})();
```

This is synchronous: the import map is available before any `<script type="module">` in the document runs. No fetch, no race condition, no event listener ceremony. The file is regenerated at each publish with the correct version URLs baked in.

**Tradeoff:** The loader script is no longer cacheable independently of the version it points to. But since it's served at a stable URL (`importmap.js`) that resolves to `latest`, it should have a short cache TTL anyway. The file is tiny (< 1KB).

**Versioned loaders** could also be generated:

```
cdn.semantic-ui.com/importmap.js           # latest (short TTL)
cdn.semantic-ui.com/importmap@0.18.0.js    # pinned (immutable, long TTL)
cdn.semantic-ui.com/importmap@canary.js    # canary (short TTL)
```

This gives users the same `<script src="...">` convenience with version control.

### What the Import Map Contains

The import map only needs top-level entry points for packages users actually import by name. Since all internal cross-package references are already rewritten to full URLs in the CDN format files, the map is minimal:

```json
{
  "imports": {
    "@semantic-ui/core": "https://cdn.semantic-ui.com/@semantic-ui/core@0.18.0/semantic-ui.min.js",
    "@semantic-ui/component": "https://cdn.semantic-ui.com/@semantic-ui/component@0.18.0/component.min.js",
    "@semantic-ui/reactivity": "https://cdn.semantic-ui.com/@semantic-ui/reactivity@0.18.0/reactivity.min.js",
    "@semantic-ui/query": "https://cdn.semantic-ui.com/@semantic-ui/query@0.18.0/query.min.js",
    "@semantic-ui/templating": "https://cdn.semantic-ui.com/@semantic-ui/templating@0.18.0/templating.min.js",
    "@semantic-ui/renderer": "https://cdn.semantic-ui.com/@semantic-ui/renderer@0.18.0/renderer.min.js",
    "@semantic-ui/utils": "https://cdn.semantic-ui.com/@semantic-ui/utils@0.18.0/utils.min.js",
    "@semantic-ui/specs": "https://cdn.semantic-ui.com/@semantic-ui/specs@0.18.0/specs.min.js",
    "@semantic-ui/tailwind": "https://cdn.semantic-ui.com/@semantic-ui/tailwind@0.18.0/tailwind.min.js"
  }
}
```

Notice: no `lit`, no `tailwindcss-iso`, no `@lit/reactive-element`. Users never import those directly. They're resolved internally via the rewritten imports in the CDN format files.

This is a significant simplification over a typical import map that must map the entire dependency tree.

---

## 4. Versioning in URLs

### Version Formats

| Segment | Example URL | Cache-Control | Semantics |
|---|---|---|---|
| Exact version | `@semantic-ui/core@0.18.0/...` | `public, max-age=31536000, immutable` | Permanent, never changes |
| `latest` | `@semantic-ui/core@latest/...` | `public, max-age=300` (5 min) | Updated on each stable release |
| `canary` | `@semantic-ui/core@canary/...` | `public, max-age=60` (1 min) | Updated on each main merge |

### How `latest` and `canary` Should Work

**Option A: Redirect (302).**
`@semantic-ui/core@latest/semantic-ui.min.js` returns `302 Found` pointing to `@semantic-ui/core@0.18.0/semantic-ui.min.js`.

- Pro: Browser caches the resolved version URL immutably. Subsequent loads of the same page hit only the immutable URL.
- Pro: DevTools network tab shows the actual versioned URL, making debugging clear.
- Pro: Module identity is by the resolved URL, so `latest` and `0.18.0` resolve to the same module instance.
- Con: Extra round-trip on first load (the redirect).

**Option B: File copy (serve content directly).**
`@semantic-ui/core@latest/semantic-ui.min.js` serves the file content directly with a short cache TTL.

- Pro: One fewer round-trip.
- Con: If any internal import uses a `latest` URL and another uses a versioned URL, the browser treats them as different modules. This causes duplicate instantiation.
- Con: Short TTL means the file is re-fetched frequently even when the version hasn't changed.

**Recommendation: Option A (302 redirect).** The redirect approach is strictly superior for a module system where URL identity determines deduplication. The extra round-trip is negligible (it's a Cloudflare edge redirect, not an origin fetch) and only happens once per page load per alias.

The Worker logic is straightforward:

```js
if (version === 'latest' || version === 'canary') {
  const resolved = await getResolvedVersion(pkg, version); // KV lookup or header file
  return Response.redirect(`https://cdn.semantic-ui.com/${pkg}@${resolved}/${filepath}`, 302);
}
```

The version mapping (`latest -> 0.18.0`) can be stored in Cloudflare KV, a JSON file in R2, or even a static map in the Worker script itself (updated at deploy time).

### Version Ranges

Do **not** support semver ranges in URLs (e.g., `@semantic-ui/core@^0.18.0`). This creates ambiguity about which version resolves and breaks immutability guarantees. The CDN serves exact versions plus the two channel aliases (`latest`, `canary`). That's it.

### Versioning for Third-Party Packages

Third-party packages under `/vendor/` are always pinned to exact versions. There is no `latest` alias for third-party packages -- you don't control their release cadence. The version used is whatever's in the lockfile at the time of the SUI release.

```
cdn.semantic-ui.com/vendor/lit@3.0.0/directive.js       # exact, immutable
cdn.semantic-ui.com/vendor/lit@latest/...               # NOT supported
```

### CSS Versioning

The framework CSS follows the same pattern:

```
cdn.semantic-ui.com/semantic-ui@0.18.0.css    # immutable
cdn.semantic-ui.com/semantic-ui@latest.css     # 302 -> versioned
```

---

## 5. Prior Art

### esm.sh

**URL structure:** `esm.sh/@scope/package@version/path`

Worth borrowing:
- The `@version` inline syntax. It's the dominant convention across esm.sh, unpkg, and skypack. Users recognize it instantly.
- Serving ESM directly with import rewriting. esm.sh rewrites bare imports to full esm.sh URLs, which is exactly what SUI's CDN format does. The difference is SUI does this at build time (static files) while esm.sh does it on-the-fly.

Worth avoiding:
- esm.sh's query parameter features (`?bundle`, `?target=es2022`, `?external=react`). These are general-purpose CDN features that add complexity without value for a focused, single-framework CDN.
- The lack of visual distinction between first-party and third-party packages. Everything lives at the same path depth.

### unpkg

**URL structure:** `unpkg.com/package@version/file`

Worth borrowing:
- The simplicity. `unpkg.com/react@18.2.0/umd/react.production.min.js` -- three logical segments: package, version, file. No prefixes, no query parameters.
- The `@latest` alias with redirect semantics (returns 302 to the resolved version).

Worth avoiding:
- Serving raw npm tarballs. unpkg serves files exactly as published to npm, including `dist/`, `lib/`, `src/` paths. This exposes build tool internals. SUI's CDN should flatten these away.

### jsDelivr

**URL structure:** `cdn.jsdelivr.net/npm/@scope/package@version/file`

Worth borrowing:
- The `/npm/` prefix *conceptually* (it namespaces the registry source) -- but SUI doesn't need it since there's only one source.
- Permanent version URLs with proper cache headers.

Worth avoiding:
- The `/npm/` prefix itself. It's noise for a single-framework CDN.
- The API-based entrypoint resolution. SUI knows its own entry points at build time.
- The `data.jsdelivr.com` dependency for build-time resolution (already noted as a problem in the existing plan).

### Deno CDN / jsr.io

**URL structure:** `jsr.io/@scope/package/version/file` (note: `/` not `@` before version)

Worth noting:
- jsr uses `/version/` (slash-separated) rather than `@version`. This is cleaner for URL parsing but less recognizable to npm-trained developers.
- Deno's approach of serving TypeScript directly is interesting but not applicable here.

Worth avoiding:
- The `/version/` syntax. While technically cleaner for URL parsing, the `@` convention is so deeply embedded in the JavaScript ecosystem that deviating from it creates unnecessary cognitive friction.

### Skypack

**URL structure:** `cdn.skypack.dev/package@version`

Worth borrowing:
- The idea of a "pinned" URL and a "lookup" URL being different. Skypack had `cdn.skypack.dev/react` (lookup, resolves latest) and `cdn.skypack.dev/pin/react@v18.2.0-...` (pinned, immutable). SUI's `latest` alias with 302 redirect achieves the same thing more simply.

Worth avoiding:
- The hash-based pinning URLs (`/pin/react@v18.2.0-uGYaSdAoG3...`). These are opaque and debugging-hostile.
- Skypack is discontinued, which is itself a lesson: general-purpose ESM CDNs are hard to sustain. Building a focused, self-hosted CDN that serves only your own framework is a much more defensible position.

### What Emerges From the Survey

The JavaScript CDN ecosystem has converged on a few conventions:

1. **`@version` in the path** (esm.sh, unpkg, jsdelivr) -- the dominant pattern
2. **302 redirects for `latest`** (unpkg, jsdelivr) -- correct for module deduplication
3. **Immutable versioned URLs** (all of them) -- `Cache-Control: immutable`
4. **Single file entry points** (not directory resolution) -- explicit is better than implicit

The main divergence is in path prefixing. General-purpose CDNs need prefixes (`/npm/`, `/gh/`, `/pin/`) to namespace different sources. SUI's CDN does not.

The recommended structure borrows the strongest conventions (@ versioning, 302 redirects, immutable caching) while taking advantage of the focused scope (no `/npm/` prefix, `/vendor/` namespace for third-party, flattened file paths).

---

## Summary of Recommendations

| Decision | Recommendation |
|---|---|
| SUI package URL | `cdn.semantic-ui.com/@semantic-ui/{pkg}@{version}/{file}` |
| Third-party URL | `cdn.semantic-ui.com/vendor/{pkg}@{version}/{file}` |
| Version separator | `@` (npm convention) |
| Path prefix | None (no `/npm/`) |
| Internal paths | Flattened (no `/dist/cdn/` in URL) |
| `latest`/`canary` | 302 redirect to exact version |
| Cache headers | `immutable` for versioned, short TTL for aliases |
| Import map loader | Synchronous inline script (no fetch) |
| Import map content | SUI packages only (no third-party entries needed) |
| Getting started | 3 lines in `<head>` for full UI, 1 import map entry for custom components |
| Semver ranges | Not supported |
| Third-party `latest` | Not supported |
