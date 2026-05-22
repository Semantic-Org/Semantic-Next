# @semantic-ui/benchmark

Semantic UI's entry in [js-framework-benchmark][jsfb] (the "krausest" suite), and
the tooling to record and read manual runs of it.

[jsfb]: https://github.com/krausest/js-framework-benchmark

## Layout

```
src/                    the contestant: a keyed-table app, the workload under test
build.js, serve.js      build and serve the contestant for the benchmark runner
scripts/                record and read manual runs
krausest-history.json   the tracked signal: our median vs the fastest competitor,
                        per benchmark, per commit
krausest-runs/          raw per-framework medians, one file per commit
```

## Running the contestant

```
npm run dev        serve the contestant at http://localhost:8080
npm run build      production build
```

The benchmark runs from a js-framework-benchmark checkout that points at this
package (via the `js-framework-benchmark` field in `package.json`). See that
project's runner documentation for driving a full run.

## Recording a run

Krausest runs are manual. There is no CI for them: a full run takes around 50
minutes on an idle machine, and competitor numbers shift with browser and
framework versions. After a run, point the recorder at the runner's results
directory:

```
npm run record -- \
  --results /path/to/js-framework-benchmark/webdriver-ts/results \
  --wallclock-seconds 2970 \
  --chrome-version 148
```

It writes two things:

- `krausest-history.json`, the tracked signal. For each benchmark it stores our
  median divided by the fastest competitor's in the same run (the `ratio`) and
  which framework led. The ratio is what to watch across commits: it cancels the
  machine and version drift that makes raw milliseconds incomparable between runs.
- `krausest-runs/<sha>.json`, the raw medians for every framework, kept for
  inspecting a single run.

Entries are keyed by commit SHA (defaulting to `HEAD`); re-recording a SHA
replaces its entry. Commit before running so the SHA describes the measured code.

## Reading results

```
npm run report                latest run, our ratio to the fastest competitor
npm run report -- diff A B     per-benchmark ratio change between two commits
```

A ratio of `1.0` means we match the fastest framework on that benchmark; `2.0`
means twice its time. `diff` reports whether each gap closed or widened between
two commits.

For per-commit performance signal during development, use the CI tachometer suite
under `packages/*/bench/tachometer`, which runs automatically on pull requests.
