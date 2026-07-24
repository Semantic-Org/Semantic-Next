# Data Sync Dogfooding — preview / staging / prod hosting

## Goal

Run the data-sync WebSocket backend in real environments so sync changes can be smoke
tested against a real client and a real storage adapter, as cheaply as an open-source
project with a few maintainers can afford. Three environments: a per-PR preview (bursty,
torn down), an always-on staging on merge to `main`, and prod on a tagged release. The
host and storage choices and their economics are settled in
[`../../research/sync/infra/hosting.md`](../../research/sync/infra/hosting.md); this plan is
the action path that lands them, built on the **Deploy Bot** that already exists.

## Why icebox (the gate)

This cannot execute until the reference sync server is a package in this repo. The five
sync packages (`sync-server`, `sync`, `sync-protocol`, `schema`, `data`) are being
fast-iterated in the sibling `sync-poc` repo right now (the Postgres adapter is the current
work there) and migrate to `next` once stable. **The WS deploy lands after that
migration** — there is nothing here to deploy until it does. So this plan activates when
(a) the sync packages have migrated to `next` with a one-command server start, and (b) the
Deploy Bot (branch `build/deploy-bot`) has merged to `main` and its App + secrets are live.
Until then the design is captured here so it isn't re-derived.

## The reality this builds on

The Deploy Bot (`tools/ci/deploy/`, `.github/workflows/pr-deploy.yml` +
`pr-deploy-report.yml`) already owns *deploying a PR*, not one provider. Its README names
this exact case: "a target moving to another host (a websocket sync server, say) changes
only the URL." A target is one entry in `tools/ci/deploy/targets.js` (`{ id: 'docs' }`,
`{ id: 'mcp' }`) plus a deploy job that writes a facts file; the comment grows a row
automatically. Adding sync is the same shape with two differences the existing targets do
not have: it needs **teardown** (a container app and a database branch do not auto-expire
the way Vercel previews do) and a **URL rendezvous** (the docs preview's sync demos must
point at the matching backend).

## Design — a `sync` deploy target

1. **`targets.js`:** add `{ id: 'sync' }`. The reporter renders a `sync` row in the comment
   with no other change.
2. **Label:** `Preview Sync` (the bot's manual gate, kept out of the auto-labeler like the
   others). In-repo branches only, inherited from the bot's fork fence — the deploy job
   holds the Fly and Neon tokens beside PR code, so forks get no sync preview.
3. **Deploy job in `pr-deploy.yml`:** on the `Preview Sync` label, deploy the WS worker to
   **Fly.io** as `sync-pr-<PR#>` (scale-to-zero: `min_machines_running = 0`, so an idle
   preview costs ~nothing) and create a **Neon branch** `pr-<PR#>` for its Postgres adapter.
   Write the live URL to the target's facts file via `write-facts.sh`. The job holds the Fly
   + Neon tokens and `contents: read` only, never the comment token (the suite's split).
4. **URL rendezvous:** deterministic naming (`sync-pr-<PR#>.fly.dev`) lets the docs deploy
   inject `PUBLIC_SYNC_URL` at build time without waiting on the sync job, so the static
   preview's sync demos hit the matching backend.
5. **Teardown (the new piece):** a job on `pull_request: [closed]` (and on `unlabeled`)
   destroys the Fly app and drops the Neon branch. Mandatory — unlike Vercel, neither
   auto-GCs, so without it idle apps and orphan branches accumulate. Scale-to-zero saves the
   compute cost of forgetting, not the app-count and branch sprawl.

## Per-environment storage adapter

| env | trigger | WS worker | Postgres |
|---|---|---|---|
| preview | `Preview Sync` label | Fly `sync-pr-N`, scale-to-zero | Neon branch `pr-N`, dropped on close |
| staging | merge to `main` | Fly, always-on (`min_machines_running >= 1`) | Neon main branch, or co-located Fly MPG |
| prod | tagged release (`v*`, via `release-deploy.yml`) | Fly, always-on + redundant | Neon Scale or Fly MPG, backups |

A Neon branch per PR exercises the **real Postgres adapter** (logical-replication change
log), not a memory stand-in, and costs ~$0 idle (scale-to-zero applies between smoke tests
when no consumer is attached). For staging/prod a connected change-log consumer pins Neon
compute active (no scale-to-zero, ~$19/mo at 0.25 CU) or co-locate **Fly Managed Postgres**
($38/mo) with the worker — choose on DX vs latency, both support logical replication. The
adapter must ack slot progress within ~40h or Neon drops the slot (a design note, not a
blocker). No Redis at any of these tiers: single-node uses the in-memory ring buffer; Redis
(Upstash) only enters when we start exercising multi-node fan-out.

## Open questions

- **Per-PR teardown trigger.** `closed` + `unlabeled` covers it, but a stale-app sweep
  (cron over `sync-pr-*` apps with no open PR) is worth considering as a backstop.
- **Fly MPG `wal_level=logical`.** Verify Fly Managed Postgres permits a persistent logical
  replication slot before relying on it for staging/prod; Neon is the fallback. (The one
  storage item the research left unverified.)
- **Multi-node smoke tests.** When the stateless-worker fleet + change-log model is
  exercised, staging gains an Upstash Redis (log + presence pub/sub) and a second Fly
  Machine — out of scope for the first cut, named so it isn't a surprise.
- **Does staging share prod's database or get its own?** Own database (or Neon project) is
  the safe default; revisit if seeding cost argues otherwise.

## Status

Initial scope. Iceboxed on a hard dependency: the sync server must be a package in `next`
and the Deploy Bot must be live on `main` first. Economics and host/storage choices are
settled in the corpus hosting doc; what remains is the target wiring and the teardown job,
both small once the gate clears.
