# Release 0.18.0

## Goal

Ship the next tagged version of Semantic UI Next. The framework has accumulated significant work since 0.17.0 (November 2025) — compiler package extraction, native renderer + per-block decomposition, SSR + hydration adoption path, engine registry, signal-safety work-in-flight. Doc-completeness gates have stalled the release; this plan separates "ship the framework" from "complete every doc page" so the project resumes a release cadence.

## Deploy mechanics (context)

`main` deploys to `staging.semantic-ui.com` on every commit. A git tag deploys `next.semantic-ui.com` (the public docs surface) and is the gate for npm publish. That's why workspace package.jsons on `main` already read `0.18.0` — main *is* 0.18.0-in-progress; the tag promotes it.

## Stopping point

The release ships:

- Framework changes — compiler package, native renderer, blocks decomposition, SSR + hydration adoption, engine registry, expression evaluator improvements, query/utils additions.
- Docs as currently authored — framework guides, API reference, examples, learn lessons 1xx–2xx, playground, primitive Definition pages, homepage.
- Incomplete content hidden via menu trimming (PR #122 + a fresh audit pass).
- `@semantic-ui/astro` bumped to `0.18.0` alongside framework packages so version messaging is uniform.

Not gating on:

- Authored content for primitives/components/behaviors (ships in 0.19.0+ as written).
- Ecosystem guides, philosophy pages, advanced learn courses (ship as authored).
- Wrapper packages (post-value-schema, multi-release).

## Open decisions

1. **PR #150 (signal safety) inclusion.** Open with mixed perf results — bench bot showed gains on signal-internal benchmarks, regressions on `signal-reactive-list-replace-1000x1000` (+21%) and `remove-5-front` (+14%), and a stack of peak-regressions worth bisecting. Options: hold for 0.19.0 (safer; lets the perf story resolve); include in 0.18.0 (commits to the public `safety` preset API earlier). Default lean: hold unless the bench investigation closes cleanly before tagging.

Resolved during scoping:

- **Tag format** — `v0.18.0`. Matches the historical convention (`v0.6.1`…`v0.9.4`); the orphaned `vundefined` tag is a separate cleanup.
- **Astro version** — bumps to `0.18.0` alongside framework packages.
- **Changelog approach** — dedup + curate from the existing draft; date stamp; one-paragraph narrative header summarizing themes; audit against `git log` for missed user-facing changes.
- **Shippable audit scope** — `docs/src/menus.js`, `docs/src/pages/index.astro`, the site footer, and the start page. Mirrors PR #122's pattern.

## Implementation steps

1. **Shippable audit pass** (~1–2h, agent). Walk the four surfaces: `menus.js`, `index.astro`, footer, start page. Find stubs added since the original 2025-03-25 audit. Apply the same menu-hide pattern as PR #122. Land as additional commits on `docs/shippable`.

2. **Merge PR #122** once the audit additions land.

3. **Resolve PR #150.** Either close the bench investigation and merge, or punt to 0.19.0 and document the deferral.

4. **Finalize CHANGELOG.md** (~1h, pair). The 0.18.0 section is already drafted; finalize:
   - Dedup the duplicate `### Reactivity` and `### Templates` headers — merge bullets under one section each.
   - Replace `xx.xx.xxxx` with the tag date.
   - Add a one-paragraph narrative header at the top of the section. Themes to lead with: native renderer (default engine, per-block runtime, SSR + hydration), engine registry + Lit-as-optional, compiler package extraction, query/utils additions, signal API additions (`depend`, `notify`, `hasDependents`, prototype-getter brand fixes).
   - Spot-audit against `git log v0.16.2..HEAD` (or earliest 0.17 commit boundary if v0.17.0 was untagged) for user-facing changes the draft missed. Internal refactors and harness work don't belong here.
   - Verify the page still renders cleanly via the Astro Guide layout — it's the live "What's New?" doc.

5. **Wire the staging canary playground** (~1–2h, agent). See [staging-canary-playground.md](staging-canary-playground.md). Slotted here on purpose — adds an `isStagingBuild` mode to `docs/src/pages/examples/importmap.json.js` pointing at `cdn.semantic-ui.com/<pkg>@canary`. Once it deploys, `staging.semantic-ui.com/playground` becomes a real pre-tag smoke surface running main-HEAD code. The next session uses it to verify the framework works end-to-end *before* publishing to npm — cheaper than discovering an export gap or broken bundle after the deprecate-and-patch cycle has started.

6. **Version sweep.** Confirm all 9 framework packages and root sit at `0.18.0`. Bump `integrations/astro` from `0.1.0` to `0.18.0`. Verify `internal-packages/*` versions are intentional (private packages don't publish but should still version-bump if they're part of the dep graph). Run the existing `update-version` script if it exists; otherwise hand-edit and re-run `npm install` to refresh the lockfile.

7. **Build artifacts.** Run the full build from clean — `npm install && npm run build` (or whatever `prepublishOnly` exercises). Confirm `dist/` outputs exist for every published package and the umbrella `@semantic-ui/core` bundle. Smoke-test bundle size against last release if there's a baseline.

8. **Run the full test suite.** `npm test` from root. Zero failures, zero skipped that weren't skipped before. Bench history doesn't gate the release but a clean test run does.

9. **Tag `v0.18.0`.** Annotated tag with the changelog narrative as the message body. Push the tag — this is what triggers the `next.semantic-ui.com` deploy.

10. **Publish to npm.** Use the existing `publish` script. Order matters because of workspace deps:
   - `utils` first
   - `reactivity`, `query`, `specs` (depend only on utils)
   - `compiler` (depends on utils)
   - `renderer` (depends on reactivity, utils)
   - `templating` (depends on compiler, renderer, reactivity, query, utils)
   - `component` (depends on templating, renderer, reactivity, query, utils)
   - `tailwind` (depends on component, utils)
   - `@semantic-ui/core` umbrella last
   - `@semantic-ui/astro` separately, after framework packages settle

11. **GitHub Release.** Create a release pointing at `v0.18.0` with the curated changelog narrative. This is also where users get notified — the release-note voice should match the in-repo `CHANGELOG.md`.

12. **Smoke test.** The staging canary playground (wired up in step 5) gave pre-tag verification; this confirms the *production* surfaces:
    - `next.semantic-ui.com` — verify the tag-triggered deploy landed and pages render. Hit homepage, a primitive Definition page, a guide, the playground (which now hits jsDelivr `@0.18.0` rather than `cdn.semantic-ui.com/@canary`).
    - CDN endpoints — confirm the new version is served at the versioned URLs (per `tools/cdn` conventions).
    - Fresh install — `npm i @semantic-ui/core@0.18.0` in a scratch project, register a primitive, verify it renders. Catches missing `dist/` artifacts and broken `exports` maps before users do.

13. **Post-release housekeeping.**
    - Move this plan to `ai/plans/archive/release-0-18-0.md`, fill in the `## Completion` section with estimated vs actual hours and the tag SHA.
    - Update `ROADMAP.md` to remove the release entry and bump anything that was waiting on it.
    - Bump root `version` on `main` to `0.19.0` so staging starts representing the next cycle.

## Risk + rollback

- **Bad publish.** npm packages are immutable but can be deprecated and republished as a patch (`0.18.1`) within minutes. Don't `npm unpublish` — it breaks downstream lockfiles. If a published package has a broken `dist/`, deprecate it with a message pointing at the patch version and ship the fix.
- **Bad tag deploy.** `next.semantic-ui.com` shows broken docs. Move the tag to the previous good commit (`git tag -f v0.18.0 <sha> && git push --force-with-lease origin v0.18.0`) — this is risky and needs explicit user authorization. Safer alternative: tag `v0.18.1` immediately with the fix; let `next.semantic-ui.com` redeploy from there.
- **Workspace dep mismatch.** A package depending on `^0.18.0` of a sibling that hasn't published yet will fail `npm install` for users. The publish-order list in step 9 mitigates this; verify each `dependencies` block in `package.json` references either workspace `*` (resolved at publish time) or `^0.18.0` consistently.

## Sessions (estimated)

1. Shippable audit pass + merge PR #122 (~2h, agent)
2. PR #150 resolution + changelog finalization (~2–3h, pair)
3. Wire staging canary playground (~1–2h, agent) — gates the publish session by giving it a working pre-tag playground
4. Version sweep + build + tests + tag + publish (~2h, pair) — single sitting; don't break this up
5. Smoke test + housekeeping (~1h, pair)

## Dependencies

- PR #122 (`docs/shippable`) — open, addresses Tier 1 menu trimming from the original audit.
- Decision on PR #150 inclusion (see Open decisions).

## Status

`scoped` — implementation steps are concrete, open decisions narrowed to PR #150 inclusion. Ready to execute the audit pass and changelog finalization autonomously; the user makes the PR #150 inclusion call and runs the actual `npm publish` and tag push.
