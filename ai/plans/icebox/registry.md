# Registry

> **Status:** Draft (workspace) — workshop pending, not yet on the roadmap.
> **Goal:** SUI registry for components and behaviors with runtime + compile-time consumption, an open author namespace, and an editorial canonical layer above it.
> **Roadmap home:** Post-Phase 4. Almost certainly post-Phase 5.

---

## What this is

A registry that lets anyone publish a SUI component or behavior to a single canonical infrastructure, where the published artifact is immediately consumable two ways:

1. **Runtime** — `<script src="cdn.semantic-ui.com/load" components="standard" community="jlukic/clock"></script>` and `<jlukic-clock>` works on the page. No build step on either side.
2. **Compile-time** — `import { Clock } from '@sui-hub/jlukic-clock'`, or via the canonical alias `@sui-hub/clock` if editorially promoted.

Above the open author namespace sits an editorial curation layer: SUI editorial chooses canonical implementations of common concepts (`clock`, `date-picker`, `tree-view`, etc.) and aliases them to a specific author/version. Authors retain attribution; the canonical layer is reversible.

## Why this is a meaningful endeavor

The registry isn't another component marketplace. It's the structural combination that doesn't currently exist:

- **No build step on either side.** SUI is runtime-only; CDN distribution and importmap resolution are already built. Authors don't bundle. Consumers don't bundle.
- **Curated canonical layer over an open namespace.** Other registries are flat-namespace and uncurated (npm) or curated but not distributed (shadcn). A Linux-distro-style curation pattern over an open author namespace is structurally distinct.
- **Auto-publish on acceptance.** Validation pass = component is live on CDN seconds later. Velocity matches npm; quality signal matches HF.

The thesis is that runtime-shipping plus curation are the levers that unlock community contribution as a viral growth path for SUI. Without them, a registry is "yet another marketplace"; with them, it's a meaningfully different artifact.

## Vocabulary

Packages are "components" and "behaviors." Author identity is conveyed by the `author/name` namespacing and profile UI, not by labeling artifacts as "community." The registry is "the registry."

This is intentional cognitive overhead reduction. An `<jlukic-clock>` on the page should feel like a first-class component, not a second-class community artifact. npm doesn't say "community packages." HF doesn't say "community models." Neither should we.

The one place a separating axis is meaningful is **canonical** vs **registry** — used in editorial contexts to distinguish first-party canonical primitives (the ~80 in `ai/research/components/`) from registry-published work. "Official" vs "community" is the wrong axis; "canonical" vs "registry" is the right one.

---

## Prerequisites

This work is bottom-of-the-stack on existing infrastructure. The following must exist:

- **Phase 4a — Eyes-gate render tool.** The validation sandbox. Without it, there's no way to mechanically verify a submitted component renders cleanly. The registry's validation pipeline is the same engine.
- **Phase 5 — Wrappers.** React/Vue/Svelte/Solid consumers reach registry components via the wrapper architecture. The npm publish path needs wrappers to serve the majority of the audience.
- **Phase 3 — Token finalization.** CSS audits in the validation pipeline depend on a stable token vocabulary. Finalizing tokens before opening the registry avoids retrofitting community CSS later.
- **SUI CLI (currently unscoped).** The registry depends on a CLI surface for `publish`, `add`, `search`, `login`. The full CLI is its own sibling-track plan; the registry plan defines the minimum surface it needs but does not own the broader CLI scope.

---

## Locked-in design

These decisions are settled and should not be relitigated by the executing agent.

### Identity and namespacing

- Two-segment registry IDs: `author/name`. GitHub username drives the author segment.
- GitHub OAuth is the identity layer. No separate password/email management. 2FA piggybacks on GitHub.
- Author namespace is the only publishing surface. Authors cannot publish bare names like `clock`.
- Canonical short names exist only as editorial aliases over already-published author packages.

### Distribution shape

One source, two outputs. Authors publish a canonical shape (`.js` + `.html` + `.css` with `getText`-style runtime fetching). The acceptance pipeline emits both:

- **Runtime variant** — canonical files served as-is at the CDN. The `.js` file uses `getText` to fetch sibling files. Consumed via script tag.
- **Compile-time variant** — bundled single JS with HTML/CSS inlined as string literals. Consumed via `npm install`.

The transformation between them is mechanical (AST-level rewrite of `getText('./foo.html')` calls into inlined string literals). The pipeline that already produces `dist/cdn/` and `dist/bundle/` for canonical packages extends to the registry namespace as a configuration delta.

### Trust axes

Two orthogonal axes:

- **Verified** — automated checks pass. Required for npm publish. CDN-publishable in either state.
- **Canonical** — editorial alias chosen for a generic name. Independent of verification (in practice, only verified packages get canonized).

A package is `unverified, not canonical` (CDN-only, partial-pass), `verified, not canonical` (CDN + npm, automated-clean), or `verified, canonical` (CDN + npm + canonical alias, editorial-promoted). `unverified, canonical` is structurally not allowed.

### Tag namespacing

Tag names are artifact-internal. Registry IDs are scoped. Consumer-side aliasing handles the rare conflict case via the loader's `as` syntax. There is no global-tag-namespace concern at the registry level; do not relitigate this.

### npm scope

`@sui-hub` is the primary registry scope. Short, evocative of the model-hub framing the project is structurally porting from HF, distinct from `@semantic-ui` (preserves blast-radius isolation between framework and registry), and a unified scope handles both components and behaviors without forcing a category split at the npm layer.

First-party framework packages remain at `@semantic-ui`. Defensive scopes claimed alongside: `@sui-components`, `@sui-ui`, `@sui-behaviors`, `@sui-registry`. These are reserved against future hijack but not actively used as publishing surfaces unless strategy shifts.

---

## Open decisions (for resolution before or during build)

- **Loader attribute name.** `community="..."` was the working name during workshop but conflicts with the vocabulary cleanup. Likely candidates: `registry="..."`, `packages="..."`, `addons="..."`, or fold into `components="..."` with namespace detection. Bikeshedding is fine; pick before website ships.
- **Canonical alias versioning policy.** Pin to specific versions (proposed — editorial deliberately advances) vs auto-track latest stable from the chosen author (faster but couples canonical stability to one author's release discipline). Default to pin.
- **Free-tier quotas.** Concrete numbers TBD. Ballpark: max packages per author, max size per package, max monthly egress before throttle.
- **Editorial cadence and process for canonical promotion.** Probably starts ad-hoc; formalizes once volume justifies. Documented criteria reduces bias-accusation surface.

---

## Phase 1 — Submission + CDN (the data plane)

**What this earns.** A standalone-shippable registry. Author publishes; package is live on CDN in seconds; consumer reaches it via one script-tag attribute. This phase alone is a working registry — every later phase stacks on it.

**Substantial moving parts.**

- *Identity service.* GitHub OAuth flow that mints registry accounts. Username = author segment. 2FA verified at link time via GitHub API. No separate password/email management.
- *Publishing API.* Per-author API tokens, scoped to publish actions, revocable from web UI. Standard bearer-token pattern.
- *R2 storage layout.* Author-namespaced paths under a registry namespace in R2. Version-immutable. Content-addressable hashes per artifact for integrity verification by the loader.
- *Submission pipeline.* Two entry surfaces:
  - CLI publish (uploads from a local directory or repo)
  - URL-paste publish via website (web form takes a gist or repo file URL, system fetches)

  Both feed the same validation pipeline. The URL-paste path is the friction-zero option for vibes contributors.
- *Validation pipeline.* Three stages:
  - **Static analysis** — parse JS, find `defaultSettings`/`defaultState`/`events`/`dispatchEvent` call sites, declared dependencies, dynamic imports. Produces a SpecReader-shaped manifest entry.
  - **Runtime introspection** — mount the component in the eyes-gate sandbox, capture observed attributes, settings proxy, dispatched events. Reconciles against static analysis.
  - **CSS audit** — verify token usage; flag hardcoded values; check for declared page-scope mutation.
  - On full pass → `verified` tier. On partial pass → `unverified` with specific failures listed in manifest. On hard fail → reject with surfaced reasons.
- *Loader extension.* The existing `cdn.semantic-ui.com/load` script gains an attribute (name TBD, see Open decisions) that takes a comma-separated list of `author/name` IDs, optionally with `as alias` suffix for tag rewrite. Loader fetches and registers.
- *Per-author quotas.* Max packages, max size per package, max monthly egress, max publishes per day. Cuts spam vectors.

**Where this touches existing systems.**

- Reuses the eyes-gate render machinery from Phase 4a as the validation sandbox
- Reuses the CDN combo-endpoint pattern (Worker generates a re-export module from a comma-separated request) for multi-package fetches
- Reuses the version-aliasing pattern from canonical packages (`@latest`, `@canary`, immutable exact versions)
- Reuses the vendor-package pattern when a registry component declares a third-party dep that should be bundled (rare; most third-party deps are externalized and consumer-installed)
- Extends SpecReader's introspection logic to non-spec packages via static + runtime adapters

**Open questions for the executing agent.**

- Whether to support submission of pre-bundled components vs. requiring source-shape submission. Source-shape is preferred for static analysis fidelity and the runtime/compile-time emission split.
- Default cache TTLs for registry packages. `@canary` 60s mirrors core; immutable versions inherit yearly. Per-author canary?
- Hash algorithm and verification placement (loader-side vs Worker-side). SHA-256 with loader-side verification is simplest.
- How partial-pass validation surfaces specific check failures in the manifest (warning codes vs free-text reasons).

**Risks.**

- Spam-publishing under free tier (mitigated by per-author quotas + GitHub identity gate)
- Malicious payloads (mitigated by validation sandbox running in your environment, not author's CI — never trust self-attested validation)
- Cost spiral from high-egress packages (mitigated by per-author monthly egress caps)

---

## Phase 2 — Website (the bulk of the project)

**What this earns.** The discovery and install surface. Most contributors and consumers come in here. This is most of the calendar.

**Substantial moving parts.**

- *Manifest aggregator.* Per-package manifest entries from validation pipeline + author profile data + tier flags + canonical alias map → unified queryable index. Static-generated, refreshed on each publish.
- *Browse UI.*
  - Search across name, description, tags, author
  - Filters that match how people actually pick: deps (none / primitives only / wraps a third-party lib / behaviors), complexity tier, verified vs unverified, has live preview, tags, recently updated, most downloaded
  - Auto-generated cards: name, description, author with avatar, screenshot, dependency graph, install snippet, tier badge
  - **Live playground preview iframe** — same engine as the validation sandbox; click a package, see it run on the page. This is the differentiator vs HF (which can't render models on a card the way components render on a card).
  - Per-package detail pages: full manifest surface, all examples, version history, download stats, related/similar packages
  - Author profile pages: GitHub-shaped — avatar, bio (from GitHub), all packages, downloads aggregated, joined date
- *Install instructions per consumption shape.* Card and detail pages surface both:
  - Runtime — copyable script-tag fragment with the right attribute
  - Compile-time — copyable `npm install` line and `import` example
  - Both pre-filled with version pin
- *MCP integration.* Existing MCP tools extended: `list_components` includes registry packages alongside canonical primitives. `get_component` resolves either path. Agents searching the SUI MCP find canonical and registry artifacts in one query.

**Where this touches existing systems.**

- Sibling section in `docs/` or new sibling site (decision deferred to executing agent)
- Reuses the playground engine for live previews
- Extends the existing MCP server's component lookup to include registry data
- Uses the same auto-generated screenshot pipeline that powers playground examples

**Open questions for the executing agent.**

- Sibling site vs new section in `docs/`. Sibling site is operationally cleaner (different deploy cadence, different audience surface) but doubles infra. Probably starts as new section; spins out later if traffic justifies.
- Search backend. Lightweight (Pagefind-style local index) vs server-side (Algolia, Meilisearch). Volume-dependent; start with Pagefind, the docs site already uses it.
- Whether canonical aliases surface as primary browse view (yes by default) and how prominent the open author namespace should be (filter / second tab / scroll-below).
- Social signals: stars, downloads, "trending." Worth shipping at v1 vs adding post-launch. Probably v1; download counts are free, stars are GitHub-shaped and authors expect them.

**Risks.**

- Underestimating the scope. This is the biggest single piece of work in the project — most of the calendar.
- Browse UX that feels like a corporate marketplace rather than a maker community. The HF aesthetic — author-forward, content-forward, technically detailed — is the model. Avoid Material-Design-marketplace.
- Search relevance. Median search is "I need a date picker that works"; results need to surface working components fast, not a flood of half-finished forks.

---

## Phase 3 — CLI

**What this earns.** Terminal-side authoring and consumption. Mirrors shadcn's `npx shadcn-ui add button` flow, which is most of why shadcn caught on.

**Surface (registry-relevant minimum).**

- `sui login` — GitHub OAuth flow, stores token locally
- `sui publish [path]` — uploads a directory or single file URL to staging, runs validation, returns the registry URL on accept
- `sui add <id>` — dual-mode:
  - Detects compile-time project (presence of `package.json`, bundler config) → runs `npm install @sui-hub/...`
  - Detects runtime project (no bundler, plain HTML) → writes the script-tag fragment to a default index file or copies it to clipboard
- `sui search <term>` — terminal-side search with same filters as web UI, ranked results
- `sui list` — list installed registry packages in current project
- `sui upgrade <id>` — bump pin to latest matching version; respect verified-only constraint when set

**Where this touches existing systems.**

- Auth flow shares identity service with the website
- Search hits the same manifest aggregator as the website
- Publish hits the same validation pipeline as the website's URL-paste form

**Open questions for the executing agent.**

- Whether the CLI is a thin wrapper around HTTP endpoints or has its own bundled logic. Thin wrapper preferred — server holds authority, CLI updates without forcing user reinstall.
- Project-type detection heuristics for `add`. Probably: `package.json` exists + `vite`/`webpack`/`rollup`/`esbuild`/`parcel` in deps → compile-time. Otherwise → runtime.
- npm package name for the CLI itself (`@semantic-ui/cli`? `@sui/cli`?). Likely resolved alongside the registry npm scope question.

**Sibling track relationship.** A fuller SUI CLI is its own scoped plan with broader capabilities (project scaffolding, dev server controls, build orchestration). The registry plan owns only the surfaces it needs — `publish`, `add`, `search`, `login`. The broader CLI plan owns the rest.

**Risks.**

- Shipping the CLI before the website is risky (no browse → discoverability is poor). Shipping the website without the CLI is fine for v1 (script-tag is the primary install path).
- DX needs to match shadcn's. Anything less and the CLI is a checkbox feature that doesn't drive adoption.

---

## Phase 4 — npm publication (the stability layer)

**What this earns.** Compile-time consumption for React/Vue/Svelte/Solid consumers. The permanent, immutable, audit-trail-bearing layer.

**Substantial moving parts.**

- *Scope claim.* Complete. `@sui-hub` is primary; `@sui-components`, `@sui-ui`, `@sui-behaviors`, `@sui-registry` are reserved as defensives. Org registration is the structural claim; placeholder packages are optional polish if an empty scope page becomes a communication concern.
- *Bot publisher.* Granular access token issued to a bot account. 2FA on the bot's GitHub-tied identity. Token rotation hygiene baked into ops.
- *Per-package npm shape.* Author-namespaced package (`@sui-hub/jlukic-clock`) is the canonical npm publish target. One npm package per registry package per version.
- *Re-export shape for canonical aliases.* `@sui-hub/clock` is a separate npm package — five-line re-export, version-pinned to whatever editorial promoted. Repointing the canonical alias = republishing a new version of the alias package with a new pinned dependency.
- *Tier gate.* Only `verified` packages publish to npm. CDN handles `unverified` exclusively. This is the structural mitigation for npm scope reputation risk.
- *package.json generation.* Manifest fields → package.json fields. Authors don't author package.json; system generates it.

**Where this touches existing systems.**

- Reuses the compile-time variant emitted by the Phase 1 acceptance pipeline
- Reuses the manifest as the source of truth for package metadata

**Open questions for the executing agent.**

- Versioning policy: does an author's patch bump auto-publish to npm, or wait for verified re-validation? Auto-publish on verified is cleanest; unverified packages don't reach npm.
- What happens when a previously-verified package fails validation on a new version? Hold at last verified npm version; surface failure in registry; let author fix.
- Pre-claim npm scopes before Phase 1 ships? Yes, regardless of build phase. Squatting risk is non-zero.

**Risks.**

- npm scope reputation blowback if a malicious package sneaks past validation. Tier gate is structural mitigation; validation rigor is operational.
- npm publish rate limits at high volume (undocumented, ~100/hour for free orgs). Batch publishes and queue if exceeded.
- Token compromise. Standard rotation hygiene, scoped tokens, 2FA on the bot identity.

---

## Phase 5 — Curation (editorial)

**What this earns.** The differentiator. SUI editorial chooses canonical implementations of common concepts; consumers reaching for `clock` get the editorial pick.

**Substantial moving parts.**

- *Canonical alias map.* Manifest field: `clock → jlukic/clock@1.1.0`. Pinned to a specific version, editorially advanced.
- *Promotion workflow.* Editorial-side tooling to inspect a package, mark it as the canonical alias for a generic name, repoint when a better implementation emerges. Probably starts as a database row + git-tracked yaml file; formalizes if volume justifies.
- *Browse UI integration.* Canonical aliases surface as primary results in browse. Author-namespaced versions appear as "by jlukic" attribution beside the canonical name. Other implementations of the same concept are reachable but de-prioritized.
- *Repointing semantics.* When `clock` repoints from `jlukic/clock@1.1.0` to `alice/clock@2.0.0`:
  - Existing pinned consumers (using a specific version of the canonical alias) keep resolving to jlukic's version
  - New consumers reaching for the canonical alias get alice's version
  - jlukic's package keeps existing as `@sui-hub/jlukic-clock`; nothing is deleted or renamed
- *npm publication of alias packages.* Each canonical alias publishes its own npm package via the re-export shape (Phase 4). Repointing = republish of the alias package with a new pinned dependency.

**Where this touches existing systems.**

- Curation workflow is editorial process work, not technical infrastructure. Tooling can be lightweight (yaml + scripts) at v1.
- Browse UI surfaces aliases distinctly; minor UI work.
- npm side gets the re-export pattern (already covered in Phase 4).

**Open questions for the executing agent.**

- How aliases are versioned (pin vs follow-latest). Pin is safer; that's the proposed default.
- How conflicts surface (two implementations of equal merit). Probably: editorial picks one; the other stays accessible at its author namespace; "alternatives" surface in browse on the canonical alias's detail page.
- Editorial cadence and reviewer pool. Starts as just the maintainer; expands once volume justifies.
- Documented criteria for promotion (download volume, code quality signal, maintenance signal, pattern alignment). Reduces bias-accusation surface.

**Risks.**

- Editorial bandwidth. Selective promotion (~50–100 canonical aliases at maturity, not thousands) is the structural mitigation.
- Bias accusations. Documented criteria + transparent process help.
- Author resentment when a canonical alias repoints away. Communication and attribution preservation are the mitigations — the original author's package still exists, still works, still gets attributed in browse.

---

## Phase 6 — Behaviors registry (parallel)

**What this earns.** Distribution surface for `registerBehavior` artifacts. Plugin world, separate from components.

**Substantial moving parts.**

Same submission pipeline, same CDN namespace pattern, same tier system, same curation pattern, same CLI surface. What differs:

- Different MCP tools (`list_behaviors`, `get_behavior`)
- Different consumption surface in install snippets (`$el.behaviorName({...})` vs `<my-tag>`)
- Different validation rules (no Shadow DOM concerns; Query-only deps; behavior-specific introspection of `setup` / `createBehavior` / events / mutations / namespace)
- Different filters in browse (no "wraps a lib" / "primitive composition" filters; instead "lifecycle hooks", "mutation observers", etc.)
- Sibling main nav section in browse UI

**Sequencing.** Can ship in parallel with Phase 1 (same pipeline) or after (same pipeline plus delta). Most efficient is parallel — the validation pipeline is component-shape vs behavior-shape, with shared core. Behaviors typically ship later in calendar because volume is lower and the pipeline shaping benefits from settling components first.

**Risks.**

- Conflating components and behaviors in UX. They're qualitatively different concepts; the browse UX must reinforce the distinction. Sibling-section nav, not a tab inside one section.

---

## Sequencing notes

- **Phase 1 + minimum CLI publish ship together.** The data plane is one piece — submission pipeline + CDN distribution + a way for authors to actually upload. Without the CLI, the registry is web-form-only at v1, which is acceptable but not ideal.
- **Phase 2 (website) follows or overlaps Phase 1.** Most of the calendar. Browse and install UX is what most people see.
- **Phase 3 (full CLI surface) overlaps with Phase 2.** `sui add` and `sui search` need browse infra to be useful end-to-end.
- **Phase 4 (npm) lights up once `verified` tier exists.** Probably mid-Phase 1 build.
- **Phase 5 (curation) turns on when editorial bandwidth is ready.** No technical blocker after Phase 2.
- **Phase 6 (behaviors) parallels Phase 1.** Same pipeline core.

Phases 2–6 are independently optional in the sense that Phase 1 alone is a working registry. In practice they all ship.

---

## Risks and mitigations (top-level)

| Risk | Mitigation |
|---|---|
| npm scope reputation blowback | Tier-gate npm publish; verified-only |
| Spam abuse of free CDN tier | Per-author quotas + GitHub identity gate |
| Editorial bandwidth for curation | Selective promotion (~50–100 aliases at maturity) |
| Squatting under flat names | Author-namespaced publishing eliminates the abuse class |
| Underestimating website scope | Plan accordingly; this is the bulk of calendar |
| CLI DX falling short of shadcn | Match shadcn's `add` flow specifically; that's the bar |
| Tag name collision | Consumer-side `as` aliasing in loader; closed concern |
| Malicious payloads slipping past validation | Validation runs in your sandbox, not author's CI; never trust self-attested validation |

---

## Reference touchpoints

Existing infrastructure this work builds on. Executing agents should read each before scoping their phase:

- **Eyes-gate render tool** — roadmap Phase 4a (`mcp-playground-rendering`). Validation sandbox.
- **CDN tooling** — `tools/cdn/` and `tools/cdn/README.md`. Combo endpoints, version aliases, vendor packages, `/load` script. The registry CDN is a configuration delta on this.
- **SpecReader** — `packages/specs/src/spec-reader.js`. The introspection-target shape for registry manifests. Static + runtime adapters produce the same shape for non-spec packages.
- **Loader script** — `/load` endpoint at the CDN. Extension point for the registry attribute.
- **MCP server** — extended with registry tools; current tools provide the model.
- **Wrapper architecture** — roadmap Phase 5. npm consumption path for non-vanilla stacks.
- **Token system** — roadmap Phase 3 (`token-finalization`). CSS audit reference vocabulary.
- **Playground engine** — live preview source for browse UI cards.

---

## Distinguishing claim

Every existing component marketplace is npm-shaped (flat names, first-come-wins, uncurated) or shadcn-shaped (copy-paste source, no distribution). This is the first that is both immediately runnable (no build step) and editorially curated (canonical aliases over an open author namespace) — a structural port of the Linux-distro curation pattern into a domain that hasn't tried it.

The bet is that this combination is the structural lever that makes community contribution a viral growth path for SUI rather than a feature checkbox.
