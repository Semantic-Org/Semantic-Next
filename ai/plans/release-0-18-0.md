# Release 0.18.0

## Goal

Ship the next tagged version of Semantic UI Next. The framework has accumulated significant work since 0.17.0 (November 2025) — compiler package extraction, native renderer + per-block decomposition, SSR + hydration adoption path, engine registry, signal-safety work-in-flight. Doc-completeness gates have stalled the release; this plan separates "ship the framework" from "complete every doc page" so the project resumes a release cadence.

## Stopping point

The release ships:

- Framework changes — compiler package, native renderer, blocks decomposition, SSR + hydration adoption, engine registry, expression evaluator improvements, query/utils additions.
- Docs as currently authored — framework guides, API reference, examples, learn lessons 1xx–2xx, playground, primitive Definition pages, homepage.
- Incomplete content hidden via menu trimming (PR #122 + a fresh audit pass).

Not gating on:

- Authored content for primitives/components/behaviors (ships in 0.19.0+ as written).
- Ecosystem guides, philosophy pages, advanced learn courses (ship as authored).
- Wrapper packages (post-value-schema, multi-release).

## Open decisions

1. **PR #150 (signal safety) inclusion.** Open with mixed perf results — bench bot showed gains on signal-internal benchmarks, regressions on `signal-reactive-list-replace-1000x1000` (+21%) and `remove-5-front` (+14%), and a stack of peak-regressions worth bisecting. Options: hold for 0.19.0 (safer; lets the perf story resolve); include in 0.18.0 (commits to the public `safety` preset API earlier). Default lean: hold unless the bench investigation closes cleanly before tagging.

## Implementation steps

1. **Fresh audit pass on `docs/shippable`** (~1–2h, agent). Walk current `menus.js`, `index.astro`, footer, start page; find stubs added since the original 2025-03-25 audit (archived). Apply the same menu-hide pattern as PR #122. Land as additional commits on the same branch.
2. **Merge PR #122** once the audit additions land.
3. **Changelog write-up** (~1h, pair). Summarize the 750+ commits since 0.17.0 into release-note narrative. User-facing categories: native renderer, SSR + hydration, engine architecture, compiler package, query/utils additions, new components/behaviors, doc improvements.
4. **Version bump + tag.** All `package.json` files in the workspace, plus root.
5. **Publish.** `npm publish` for changed packages; Vercel deploy for the docs site.
6. **Smoke test.** Install fresh in a side project, exercise the playground, confirm CDN endpoints serve the new versions.

## Dependencies

- PR #122 (`docs/shippable`) — open, addresses Tier 1 menu trimming from the original audit.
- Decision on PR #150 inclusion (see Open decisions).

## Status

`scoped` — implementation steps are concrete. One open decision (PR #150 inclusion) gates the version bump but doesn't gate the audit pass or PR #122 merge. Ready to execute the audit pass autonomously; the user makes the inclusion call.
