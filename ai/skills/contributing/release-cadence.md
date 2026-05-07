---
title: Release Cadence
description: How to publish a tagged release of Semantic UI Next — branch and version invariants, pre-tag verification, npm publish ordering, deploy mechanics, rollback. The canonical procedure that release plans (e.g. release-0-18-0.md) instantiate against a specific version.
keywords: [release, publish, npm, tag, deploy, vercel, cdn, canary, staging, jsdelivr, version bump, changelog, smoke test, rollback, workspace deps]
audience: contributing
skill: release-cadence
type: skill
---

# Release Cadence

> **Skill:** `release-cadence`
> **Purpose:** The canonical procedure for shipping a tagged release. Specific releases follow this shape with version-specific details filled in.

---

**Golden rule: Cadence over completeness. Ship the framework when it works; hide unfinished docs rather than gating on them.**

The framework lives in `packages/`. Docs live in `docs/`. These are coupled at the version layer (the docs site is versioned with the framework) but not at the readiness layer — incomplete docs should be hidden via menu trimming, not block a release. A six-month gap between releases is more costly than a release that ships with hidden Tier-2 component pages.

---

## The Mental Model

Three states of "the framework," not one:

| Surface | Where it lives | How it updates | What it represents |
|---|---|---|---|
| `main` | This repo | Every commit | The next-release-in-progress |
| `staging.semantic-ui.com` | Vercel preview | Every main commit | The next release as docs (canary playground via `cdn.semantic-ui.com/<pkg>@canary`) |
| `next.semantic-ui.com` + npm `@latest` | Vercel production + npm | On tag push | The published release |

**Version-on-main is honest.** `package.json` on `main` reads `0.X.0` while the latest published is `0.(X-1).0`. Main *is* `0.X.0`-in-progress. The tag promotes it.

This is different from projects that keep main at the last-published version and bump in the release commit. Don't change it. The honest version-on-main convention means workspace dep ranges (`^0.18.0`) resolve correctly against in-development packages without a special "next" branch.

---

## What Gates a Release

| Gates | Doesn't gate |
|---|---|
| Framework code works | Every primitive having a full guide |
| Docs that are *visible* are accurate | Ecosystem guides being complete |
| Test suite passes | Wrapper packages being ready |
| Build artifacts produce clean `dist/` for every published package | Bench history showing zero regressions (track regressions separately) |
| CHANGELOG section exists for the version | Philosophy pages being written |
| The shippable audit was done | Tier-2/Tier-3 component pages being authored |

The "shippable audit" pattern: walk the four user-landing surfaces (`docs/src/menus.js`, `docs/src/pages/index.astro`, the site footer, the start page); hide stubs via menu trimming following the precedent in PR #122. Every release re-runs this audit against whatever was added since.

---

## The Sequence

Five sessions across an active release. Don't break session 4 (publish) — it's a single sitting because the tag-then-publish window leaves a tagged-but-unpublished state if interrupted, which downstream `npm install`s would resolve to broken.

### Session 1 — Shippable audit + PR for menu trimming (~2h, agent)

Walk the four landing surfaces. Find stubs added since the last audit. Apply the same hide-via-menu pattern. Land as commits on the same branch the menu-trimming PR is open against (typically `docs/shippable`). Merge once additions land.

### Session 2 — Open-decision resolution + changelog finalization (~2-3h, pair)

**Open decisions.** Anything still open that gates the version goes here. Common shape:
- Pending PR with mixed signals (perf regressions, API risk) — decide include vs defer.
- Astro/integration version coupling — bump alongside framework or independent cadence?
- Tag format inconsistencies — confirm the convention.

**Changelog finalization.** `CHANGELOG.md` is the live "What's New?" page (`@layouts/Guide.astro` frontmatter). It's already partially drafted by the time you reach this step — features and fixes accumulate in it during the release cycle. Finalize:

- Dedup any duplicate `### <Section>` headers introduced as different contributors added entries.
- Fill the date stamp (the placeholder is typically `xx.xx.xxxx`).
- Add a one-paragraph narrative header at the top of the section. Lead with the load-bearing themes — what changed about *the framework*, not what changed about *the repo*. Internal refactors don't belong here; user-facing behavior changes do.
- Spot-audit against `git log v0.(X-1).0..HEAD` for user-facing changes the draft missed.

```
✅ "Renderer is now native-by-default. Lit becomes an optional engine via opt-in import."
❌ "Removed renderer.js (1696 → 577 lines) and split into per-block files."
```

### Session 3 — Wire/verify staging canary playground (~1-2h, agent)

The canary CDN (`cdn.semantic-ui.com/<pkg>@canary`) is overwritten on every main merge with 60s TTL. The docs-site importmap on staging should consume it so the playground exercises main-HEAD. See `staging-canary-playground.md` for the wiring.

This session is the pre-tag smoke surface. Hit `staging.semantic-ui.com/playground`, exercise primitives, confirm the framework actually renders end-to-end *against the code about to be published*. Cheaper than discovering an export gap or broken bundle after the deprecate-and-patch cycle has started.

### Session 4 — Version sweep + build + tests + tag + publish (~2h, pair)

Single sitting. The order matters; each step gates the next:

1. **Version sweep.** Confirm all framework packages and root sit at the target version. Bump integrations (`integrations/astro`) if they ship coupled to the framework version. Verify `internal-packages/*` are intentional.

2. **Build artifacts.** `npm install && npm run build` from clean. Confirm `dist/` outputs for every published package and the umbrella `@semantic-ui/core` bundle.

3. **Run the full test suite.** `npm test` from root. Zero failures.

4. **Tag.** `v0.X.0` annotated tag with the changelog narrative as the body. Push the tag — this is what triggers `next.semantic-ui.com` deploy and the production CDN upload.

5. **Publish to npm.** Run `npm run publish` from root (orchestrates via `scripts/publish.js`). The script is responsible for ordering — read it before re-deriving by hand. The underlying workspace dep DAG it must respect:

```
utils                         (zero deps)
  ↓
reactivity, query, specs      (depend only on utils)
  ↓
compiler                      (depends on utils)
  ↓
renderer                      (depends on reactivity, utils)
  ↓
templating                    (depends on compiler, renderer, reactivity, query, utils)
  ↓
component                     (depends on templating, renderer, reactivity, query, utils)
  ↓
tailwind                      (depends on component, utils)
  ↓
@semantic-ui/core             (umbrella)
  ↓
@semantic-ui/astro            (and other integrations, after framework settles)
```

A package depending on `^0.X.0` of a sibling that hasn't published yet will fail `npm install` for users. If `scripts/publish.js` doesn't already enforce this order, fix the script — don't work around it manually.

6. **GitHub Release.** Point at the tag with the curated changelog narrative.

### Session 5 — Smoke test + housekeeping (~1h, pair)

Three production surfaces:

- `next.semantic-ui.com` — verify the tag-triggered deploy landed. Hit homepage, primitive Definition page, a guide, the playground (now hits jsDelivr `@0.X.0`, not canary).
- CDN endpoints — confirm the new version is served at versioned URLs (`tools/cdn` conventions).
- Fresh install — `npm i @semantic-ui/core@0.X.0` in a scratch project, register a primitive, render it. Catches missing `dist/` artifacts and broken `exports` maps.

Housekeeping:

- Move the active release plan to `ai/plans/archive/`. Fill in `## Completion` with estimated vs actual hours and the tag SHA.
- Remove the entry from `ROADMAP.md` "Do Next."
- Bump root `version` on `main` to `0.(X+1).0` so staging starts representing the next cycle.
- If completing this release unblocked anything (e.g. publish-pipeline plans), promote those from blocked sections.

---

## Deploy Mechanics

`main` deploys to `staging.semantic-ui.com` on every commit (Vercel detects branch, runs preview build with `VERCEL_ENV=preview`).

A pushed tag deploys `next.semantic-ui.com` (Vercel production with `VERCEL_ENV=production`) **and** triggers the CI publish pipeline:
- npm publish (per session 4 ordering)
- `tools/cdn` upload to R2 (versioned + `@latest` alias updated)
- Worker deploy (`tools/cdn/worker/index.js`) if it changed

CI uploads `@canary` on every main merge separately. Both `@canary` and tagged versions live in R2; aliases (`@latest`) are 302 redirects served by the Worker.

The npm publish is what jsDelivr serves from. `cdn.jsdelivr.net/npm/@semantic-ui/core@0.X.0/+esm` becomes available once npm has indexed the publish (usually within a minute). The production docs site importmap pins to jsDelivr — kept there because jsDelivr is free for OSS and acts as redundant origin to the SUI-controlled `cdn.semantic-ui.com`.

---

## At 1.0 — Domain Promotion

When 1.0 ships, the domain layout shifts:

- `next.semantic-ui.com` (current production) → `semantic-ui.com` (the canonical production surface).
- `staging.semantic-ui.com` stays as staging (no change).
- Classic SUI (the original framework, pre-rewrite) moves to a separate subdomain — likely `classic.semantic-ui.com` (TBD).

This is a 1.0-only event. Pre-1.0 releases continue to deploy at `next.semantic-ui.com`. The promotion is a manual ops step at 1.0 release time, not an automated tag-deploy effect.

---

## Risk and Rollback

| Failure | Response |
|---|---|
| Bad publish (broken `dist/`, missing exports) | `npm deprecate <pkg>@<ver> "use 0.X.1"`. Patch and republish as `0.X.1`. **Never `npm unpublish`** — it breaks downstream lockfiles. |
| Bad tag deploy (broken docs at `next.semantic-ui.com`) | Tag `v0.X.1` immediately with the fix; let `next.semantic-ui.com` redeploy from there. Force-moving the tag (`git tag -f` + `git push --force-with-lease`) is destructive — needs explicit user authorization. |
| Workspace dep mismatch (a published package references an unpublished sibling) | Republish the missing sibling, then republish the broken package as a patch. Verify by removing `node_modules` and re-installing from the published versions in a scratch project. |
| Canary CDN downtime mid-session-3 | Fall back to `isStaticBuild` mode (self-host bundles from `dist/bundle/`). Don't block the release on canary infrastructure. |
| Test suite reveals a regression mid-session-4 | Stop. Don't tag. Fix on `main`, redo session 3 (canary playground catches up automatically), retry session 4. The publish window is the discipline — leaving a tagged-but-unpublished or partially-published state is the failure mode to avoid. |

The silent killer is workspace dep mismatch. Always verify the publish ordering against the actual `dependencies` of each `package.json` before session 4.

---

## What Belongs in CHANGELOG.md

The CHANGELOG is the live "What's New?" docs page. It speaks to *consumers* of the published packages, not contributors to the repo.

```
✅ User-facing API additions (new helpers, new directives, new behaviors)
✅ Bug fixes that change observable behavior
✅ Breaking changes (always called out explicitly)
✅ Performance changes a consumer can feel
✅ New packages or split packages
❌ Internal refactors (e.g. "split renderer.js into per-block files")
❌ Test infrastructure changes
❌ AI harness / skill / agent-tooling changes
❌ Bench history archival
```

Voice: short bullets, lead with category (`**Feature**`, `**Bug**`, `**Breaking**`, `**Enhancement**`). Link to the relevant docs page when the change has a documented surface. The narrative header at the top of each version section sets the framing — the bullets fill in the details.

---

## What's *Not* a Release

A release is the publishing event, not the work. The roadmap is organized by phases of work; releases are the publishing rhythm those phases land into. Some releases land an entire phase publicly (e.g. 0.18.0 ships Phase 0 — Renderer Architecture). Others ship a slice of a phase. Don't confuse the two:

- **Phase complete** = the work is done internally.
- **Release shipped** = downstream consumers can `npm install` it.

A phase isn't truly complete to outside observers until a release ships it. That's why long gaps between releases create the illusion of stalled work even when active development continues.

---

## Framework Policy

Policies that govern releases and the framework's contract with consumers.

### Performance Gate

Tachometer determines significance via its own CI-overlap math — a regression is reported when HEAD's CI lower bound exceeds candidate-peak's CI upper bound (non-overlapping). Any tachometer-significant finding requires explicit acknowledgment in the PR (not silently ignored) and is **blocking on the user** until resolved — bisect, accept with rationale, or revert.

No fixed percentage thresholds. The bench bot's `REGRESSED` status is the gate; the user decides whether a specific regression is acceptable for the release. PR #150's mixed results during 0.18.0 are the canonical example of how this plays out.

### Deprecation (Pre-1.0)

Pre-1.0, breaking changes ship in minor releases (0.18.0 → 0.19.0) without a formal deprecation cycle, with explicit changelog callouts and migration notes when the change requires consumer action.

Post-1.0, deprecations get one minor cycle of advance notice (deprecated in 1.X, removed in 1.(X+1)) before removal. Breaking changes outside the deprecation cycle require a major version bump.

The pre-1.0 freedom reflects that the framework is still iterating on core contracts (Value Schema, Signal Performance, Naming Conventions). Once those land and 1.0 ships, the deprecation cycle starts.

### Version Skew

All `@semantic-ui/*` packages publish at the same version per release. Consumers should:

- Pin via the umbrella `@semantic-ui/core` (single dep, one resolved version), or
- Pin all `@semantic-ui/*` packages to the same version explicitly.

Mixing versions across packages (e.g. `@semantic-ui/component@0.18.0` with `@semantic-ui/reactivity@0.19.0`) is unsupported. The packages share runtime invariants — Signal protocol, render-pipeline contracts, expression evaluator — that aren't versioned independently. Consumers who mix versions are responsible for any breakage that results.

### Browser Support

The framework targets the **last 2 versions of Chrome, Firefox, and Safari**. Edge follows Chrome (Chromium-based, same cadence). No IE11.

Safari occasionally lags newer CSS features (e.g. `@scope` adoption is delayed in Safari relative to Chrome/Firefox). Where Safari lacks a feature SUI uses, that feature is treated as progressive enhancement — graceful fallback on Safari, full behavior on Chrome/Firefox. Light DOM Pre-Render (Phase 1, plan `1b`) is one example.

Mobile: latest Safari (iOS) and latest Chrome (Android). Same last-2 policy.

---

## Quick Reference

```bash
# Pre-release check — what's pending since last release
git log "v$(npm view @semantic-ui/core version)..HEAD" --oneline | wc -l

# Sweep versions across the workspace (handled by wireit dep on prepublishOnly)
npm run update-version

# Build + test before tagging
npm install && npm run build && npm test

# Tag (annotated, with narrative as body)
git tag -a v0.X.0 -m "<changelog narrative>"
git push origin v0.X.0

# Publish — root script orchestrates dep ordering
npm run publish

# Smoke test
npm view @semantic-ui/core@0.X.0 version    # confirms publish landed
curl -I https://cdn.semantic-ui.com/core@0.X.0
curl -s https://next.semantic-ui.com/ | head -20

# Post-release main bump (edit package.json files to next minor, commit)
# Convention: Chore: Bump to 0.(X+1).0
```

| What | Where |
|---|---|
| Active release plan | `ai/plans/release-0-X-0.md` |
| Archived release plans | `ai/plans/archive/release-*.md` |
| Changelog (= live docs page) | `CHANGELOG.md` |
| Shippable audit pattern | PR #122 (precedent) |
| CDN canary infrastructure | `tools/cdn/README.md` |
| Staging canary wire-up | `ai/plans/staging-canary-playground.md` |

---

## Related Skills

| Skill | Use when... |
|---|---|
| **Manage Roadmap** (`manage-roadmap`) | Adding a release plan to ROADMAP.md, archiving completed plans, reorganizing priorities. |
| **Author Pull Requests** (`author-pull-requests`) | Writing the menu-trimming PR (session 1) or any release-prep PR. |
| **Build System** (`build-system`) | Debugging failed `dist/` outputs in session 4. |
