# Deploy bot

Deploys a PR's targets on a label and reports them in one comment by **Semantic
Deploy Bot**. It's the deploy member of the CI suite (performance 📊, bundle 📦,
heap 🧠): same GitHub App and avatar identity, same sticky single comment.

The bot owns *deploying a PR*, not one provider. Today it deploys the docs site
and the MCP server on Vercel. The comment names no provider, so a target moving
to another host (a websocket sync server, say) changes only the URL.

## Labels

A deploy runs only when a maintainer adds the matching label. That gate keeps
every PR push from spending build minutes, and keeps the spend a human decision.

| label | target |
|---|---|
| `Preview` | the docs site |
| `Preview MCP` | the MCP server |

Adding a label deploys. Pushing more commits while labeled redeploys. Removing it
stops further deploys. Only people with write access can label.

## The comment

One row per target. `🟢 Ready` carries a `Preview` link (the exact URL sits in
the footer so the link columns stay fixed-width), the `logs` column links the
Actions run, and `⚪ NA` is a target this PR didn't request. While a deploy is in flight the
table shows start time, an ETA, and the expected build time (median of recent
deploys, hidden until a few runs seed it). All times are US Eastern.

## How it runs

Forks are out of scope. A deploy needs the Vercel token in the same job that
builds PR code, so deploys are restricted to in-repo branches (`head.repo` is
this repo), whose authors have write access. Fork PRs get no deploy.

Two workflows, three jobs:

- **`pr-deploy.yml`** (on a labeled `pull_request`)
  - `announce` posts the Building comment. It holds the bot token but runs no PR
    code, rendering from `main`'s reporter against the event, and estimates the
    ETA from recent run durations via the Actions API.
  - `docs` and `mcp` each deploy their target with the Vercel token and
    `contents: read` only (no comment token), and upload a facts file. `docs`
    builds in the runner (`vercel build` on Node 22.x to match the project) and
    ships the output with `--prebuilt`, so Vercel spends no build minutes on it.
    `mcp` still builds remotely.
- **`pr-deploy-report.yml`** (on `workflow_run` completion) renders the final
  comment from the facts and posts it under the bot, editing the Building comment
  in place.

The suite's rule holds: the job that runs PR code (`docs` or `mcp`) never holds
the comment token, and the jobs that hold the token (`announce`, the report) run
no PR code and render from `main`. The one place the deploy bot can't honor the
measurement bots' "no secret near PR code" split is the deploy itself, which is
why it's fenced to in-repo branches.

### Author neutrality

`announce` and the report job check out `main` and render from `main`'s copy of
`tools/ci/deploy/`, so a PR can't reshape the comment that describes its own
deploy. Until the deploy tooling and the bot secrets exist on `main`, the comment
jobs stay inert (the deploy jobs still run, a self-test).

## Setup (one time)

1. Create a GitHub App **Semantic Deploy Bot**.
   - Repository permissions: **Pull requests: Read & write**, **Contents: Read**.
   - Upload `avatar.png` as the App's logo (a placeholder ships here, replace it
     with a logo in the suite family).
   - Install it on the repository.
2. Add repository secrets:
   - `SEMANTIC_DEPLOY_BOT_CLIENT_ID`
   - `SEMANTIC_DEPLOY_BOT_PRIVATE_KEY` (full PEM)
   - The Vercel secrets already exist: `VERCEL_TOKEN`, `VERCEL_ORG_ID`,
     `VERCEL_DOCS_PROJECT_ID`, `VERCEL_MCP_PROJECT_ID`.
3. Create the labels `Preview` and `Preview MCP`, kept out of the auto-labeler so
   they stay a manual gate.
4. Automatic Git deployments are off for both Vercel projects: the docs project
   (Root Directory `./`) via the root `vercel.json`, and the MCP project via
   `tools/mcp/vercel.json`. The only previews are the ones this bot makes.

## Running locally

```sh
# a finished run: feed it target facts
mkdir -p /tmp/facts/docs
echo '{"id":"docs","status":"ready","url":"https://example.vercel.app"}' > /tmp/facts/docs/docs.json
node tools/ci/deploy/reporter.js --mode final --facts /tmp/facts \
  --sha "$(git rev-parse HEAD)" --repo Semantic-Org/Semantic-Next \
  --run-url https://github.com/x/y/actions/runs/1 --run-id 1 --out /tmp/report
cat /tmp/report/comment.md

# an in-flight run
node tools/ci/deploy/reporter.js --mode deploying --targets docs \
  --started 2026-06-28T00:10:00Z --build-seconds 180 \
  --sha "$(git rev-parse HEAD)" --repo Semantic-Org/Semantic-Next \
  --run-url https://github.com/x/y/actions/runs/1 --run-id 1 --out /tmp/report
cat /tmp/report/comment.md
```

## Files

| file | role |
|---|---|
| `targets.js` | the deploy targets, in display order |
| `reporter.js` | CLI: facts (or in-flight timing) into `comment.md` + `preview-report.json` |
| `write-facts.sh` | turns a deploy step's captured output into a target's facts file |
| `reporter.test.js` | `node --test` suite for the rendering and state logic |
| `avatar.png` | the bot's avatar (placeholder) |

## Known limits

- **mcp still builds remotely.** The docs deploy builds in CI and ships prebuilt
  output, so Vercel spends no build minutes on it. The mcp deploy still builds on
  Vercel (prebuilt for its serverless-function build is unverified), a later
  follow-up.
- **Whole-run ETA.** The estimate is the median of recent run wall-clocks, not
  per-target. Fine while docs is the common case, per-target is a later
  refinement.
