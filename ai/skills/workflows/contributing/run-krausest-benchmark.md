---
title: Run Krausest Benchmark
description: Workflow for running the official js-framework-benchmark (krausest) keyed comparison for Semantic UI against peer frameworks, then recording the run into the tracked history under tools/benchmark. Covers locating or cloning the benchmark repo, wiring the contestant, running the full suite unattended, and appending the result.
keywords: [krausest, js-framework-benchmark, benchmark, keyed, comparison, performance, contestant, puppeteer, webdriver-ts, krausest-history, wallclock]
audience: contributing
type: workflow
workflow: run-krausest-benchmark
---

# AI Workflow: Run Krausest Benchmark

**Run the official cross-framework krausest comparison and record it into the tracked history.**

This workflow measures how Semantic UI performs on the [js-framework-benchmark](https://github.com/krausest/js-framework-benchmark) keyed suite against peer frameworks, then appends one entry to the history store in `tools/benchmark/`. The contestant source lives in this repo at `tools/benchmark/`; the benchmark harness lives in a separate `js-framework-benchmark` checkout on the user's machine.

**Golden rule: gather everything in step 1 and confirm once, then run unattended on a silent machine. Any command run during the measured run contaminates it — the machine stays idle until the results land. The numbers are only meaningful relative to the peers measured in the same run, never as absolute milliseconds across runs.**

The full run takes roughly **45–90 minutes**. It is a long, machine-occupying action: confirm scope before launching, never launch speculatively.

---

## What this produces

A new entry in two files under `tools/benchmark/`:

- `krausest-history.json` — the tracked signal: per benchmark, Semantic UI's median relative to the fastest peer in that same run.
- `krausest-runs/<sha>.json` — raw medians for every framework in the run.

The workflow is **done when those entries are written** and `krausest-report.js` shows the run.

---

## Anti-patterns to avoid

| Anti-pattern | Why it ruins the run | Do instead |
|---|---|---|
| Running builds, tests, or browsing during the measured run | Background CPU contention skews every number | Finish all setup in steps 2–4; the machine is idle through step 5 |
| Launching the full suite to "see what happens" | It's a ~1h machine-occupying job | Confirm scope in step 1; smoke-test in step 4 first |
| Running on a dirty working tree | The recorded SHA no longer describes the code measured | Commit before launching; nothing enforces this |
| Comparing absolute ms between two runs | Machine/Chrome/peer-version drift makes absolutes incomparable | Compare the *ratio to peers*, which the store records as primary |
| Assuming a benchmark-repo path | Paths are per-user | Ask or discover in step 1 |

---

## Step 1 — Locate the harness and confirm scope (the only interactive step)

Gather everything here so steps 2–6 run without further input.

**Find the `js-framework-benchmark` checkout.** Do not assume a path.

1. Ask the user where their `js-framework-benchmark` checkout is, or
2. search likely locations (`~`, `~/dev`, `~/src`, `~/code`, `~/projects`) for a directory containing `webdriver-ts/` and `frameworks/keyed/`, then
3. if none exists, offer to clone it fresh into a user-chosen directory (default: the user's home):

```bash
git clone https://github.com/krausest/js-framework-benchmark "$DIR/js-framework-benchmark"
cd "$DIR/js-framework-benchmark" && npm ci && npm run install-local
```

**Confirm the comparison set with the user.** A sensible apples-to-apples default for Semantic UI (a web-component framework with fine-grained reactivity) is its closest peers — fine-grained / signals / web-component frameworks such as `solid`, `svelte`, `vue`, `react-hooks`, `lit`. Resumability frameworks (e.g. `qwik`) are a different architectural category; include them only if the user wants that comparison. Let the user adjust the set.

**Confirm the run conditions** in plain language before proceeding:

- the machine will be left idle for ~45–90 minutes,
- this repo's working tree is committed (so the recorded SHA is accurate),
- which frameworks will be compared.

When the user confirms, proceed unattended.

---

## Step 2 — Ensure the Semantic UI contestant exists in the checkout

The contestant lives at `frameworks/keyed/semantic-ui/`. A fresh upstream clone will not have it — create it. `<sui-repo>` is the absolute path to this repository.

`frameworks/keyed/semantic-ui/dist/main.js` is a **symlink** to the monorepo's built bundle:

```bash
mkdir -p frameworks/keyed/semantic-ui/dist
ln -sf <sui-repo>/tools/benchmark/dist/main.js frameworks/keyed/semantic-ui/dist/main.js
```

`frameworks/keyed/semantic-ui/index.html`:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <title>Semantic UI (keyed)</title>
  <link href="/css/currentStyle.css" rel="stylesheet" />
</head>
<body>
  <div id="main"><bench-app></bench-app></div>
  <script type="module" src="dist/main.js"></script>
</body>
</html>
```

`frameworks/keyed/semantic-ui/package.json` (the `build-prod` is a no-op because the bundle is symlinked from the monorepo):

```json
{
  "name": "js-framework-benchmark-semantic-ui",
  "version": "1.0.0",
  "private": true,
  "type": "module",
  "js-framework-benchmark": {
    "frameworkVersionFromPackage": "@semantic-ui/component",
    "frameworkHomeURL": "https://next.semantic-ui.com/",
    "useShadowRoot": true,
    "language": "JavaScript"
  },
  "scripts": { "build-prod": "echo 'Bundle symlinked from semantic-ui monorepo'" }
}
```

---

## Step 3 — Build the contestant and the comparison field

**Build the Semantic UI bundle** (the symlink target). esbuild bundles `@semantic-ui/*` from source, so whatever is in the working tree is what gets measured:

```bash
cd <sui-repo>/tools/benchmark && npm run build   # writes dist/main.js
```

**Build each comparison framework** that has no `dist/` yet:

```bash
cd <benchmark-repo>/frameworks/keyed/<framework> && npm install && npm run build-prod
```

---

## Step 4 — Smoke test (catch breakage before the long run)

Start the harness server and confirm the runner drives a browser and the Semantic UI contestant validates — before committing an hour to it.

```bash
cd <benchmark-repo> && npm start          # serves on :8080; wait until it responds
cd webdriver-ts && npm run bench -- --headless --framework keyed/semantic-ui --benchmark 01_
```

✅ A `cpu` result JSON is written under `webdriver-ts/results/` (a written cpu result means the contestant passed validation), no `SessionNotCreatedError`.

❌ `SessionNotCreatedError: ...only supports Chrome version N`: a chromedriver/Chrome mismatch. The default runner is **Puppeteer** (its own bundled Chrome), so this usually only bites selenium/tachometer paths — but if it does surface, align chromedriver to the system Chrome major version: `cd webdriver-ts && npm install chromedriver@<major> --no-save`.

---

## Step 5 — Run the full suite unattended, timed

Launch the confirmed frameworks headless and capture wallclock. **Run nothing else on the machine until it finishes.**

```bash
cd <benchmark-repo>/webdriver-ts
START=$(date +%s)
npm run bench -- --headless --framework keyed/solid keyed/svelte keyed/vue keyed/react-hooks keyed/lit keyed/semantic-ui
echo "bench wallclock: $(( $(date +%s) - START ))s"
```

Run it as a background job and wait for completion rather than polling — polling commands are themselves contamination. Note the wallclock seconds; they go into the record.

The official results table (`npm run results`) is optional and may fail on pre-existing TypeScript errors in the harness — it is not the tracked signal. The JSON store written in step 6 is.

---

## Step 6 — Record the run into tools/benchmark (the finish line)

Append the run to the history store. The recorder reads the harness `results/` dir, computes each benchmark's ratio to the fastest peer, and writes both the primary history and the raw medians.

```bash
cd <sui-repo>
node tools/benchmark/append-krausest-run.js \
  --results <benchmark-repo>/webdriver-ts/results \
  --wallclock-seconds <n> \
  --chrome-version <version the run used>
node tools/benchmark/krausest-report.js          # confirm the entry
```

The recorder is idempotent on SHA (re-running replaces, never duplicates) and takes `--sha`/`--msg` (default: this repo's git HEAD). **The workflow is complete when `krausest-history.json` and `krausest-runs/<sha>.json` carry the new entry.**

To compare two recorded runs later: `node tools/benchmark/krausest-report.js diff <shaA> <shaB>`.

---

## Quick Reference

```bash
# 1. confirm path + frameworks + idle machine + committed tree  (interactive)
# 2. contestant (only if missing): symlink dist/main.js, add index.html + package.json
# 3. build
cd <sui-repo>/tools/benchmark && npm run build
cd <benchmark-repo>/frameworks/keyed/<fw> && npm install && npm run build-prod   # per missing fw
# 4. server + smoke test
cd <benchmark-repo> && npm start
cd webdriver-ts && npm run bench -- --headless --framework keyed/semantic-ui --benchmark 01_
# 5. full run (idle machine, ~45-90 min)
cd webdriver-ts && START=$(date +%s) && npm run bench -- --headless --framework keyed/<...> ; echo "$(( $(date +%s)-START ))s"
# 6. record
node <sui-repo>/tools/benchmark/append-krausest-run.js --results <benchmark-repo>/webdriver-ts/results --wallclock-seconds <n> --chrome-version <v>
```

---

## Related Skills

| Skill | Command | Use when... |
|-------|---------|-------------|
| **Improve Performance** | `use_skill('improve-performance')` | Auditing/optimizing a package with tachometer as the in-repo measurement standard |
| **Autoresearch Perf** | `use_skill('autoresearch-perf')` | Investigating where time goes before optimizing |
