# Prior View: Hydration Critical Path

Written before reviewing agent reports.

## My current understanding

The hydration lifecycle does everything synchronously in one rAF callback: clone → initialize (createComponent, new Renderer, attachEvents, bindKeys, callParams) → hydrateMarkers → removeMarkers. This is the simplest correct implementation — it guarantees the component is fully functional when hydrate() returns.

## What I think the minimum synchronous set is

1. **Clone template + createComponent** — the component instance needs to exist because Astro's client entrypoint may forward complex props immediately after hydration, and those hit the settings proxy which needs the template to exist.

2. **Create Renderer + hydrateMarkers** — this is the core of hydration. Reactions must be wired so that programmatic setting changes (the nav-menu pattern where Astro pushes settings right after connectedCallback) trigger DOM updates.

3. **Everything else can be deferred** — attachEvents, bindKeys, removeMarkers, hashCode, the state-watching Reaction, callParams construction. Nobody types into an input or presses a key in the first 10ms.

## Where I'm uncertain

- **The state Reaction** created in initialize() that depends on every Signal — I'm not sure if this needs to fire synchronously. If a setting change during Astro prop forwarding triggers a state Signal, and the state Reaction isn't wired yet, does the component miss the update? I think the per-expression Reactions from hydrateMarkers would catch it independently, but I haven't verified.

- **callParams construction** — the `.bind()` calls are cheap individually but there are ~20 of them. More importantly, callParams is used by `Template.call()` which is called by `onCreated`. If we defer callParams, we defer onCreated, which might break components that set up client-side state in onCreated.

- **Whether Template.attach() can be split** — currently attach() does initialize() + attachEvents() + bindKeys() as one unit. Splitting it means either refactoring attach() to accept a "deferred" flag, or having hydrate() call the pieces directly instead of going through attach(). The latter is simpler but breaks the abstraction.

## What I'd do if I had to ship something today

Move removeMarkers to a rAF. That's 6ms for free with zero risk. Leave everything else synchronous until we have test coverage proving the deferred path is safe.
