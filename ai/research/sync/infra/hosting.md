# Hosting & deployment economics

The hosting reading of the data-sync cost model: where to run the sync server, what it
costs, what to recommend to self-hosting users, and what the economics of a managed
offering would be. Two layers live here. The **durable framing** (the cost surface, why
per-message billing is disqualified, the three rungs, the billing-unit logic) is
architecture-invariant and is the part to internalize. The **pricing snapshot** is a dated
point-in-time table; provider prices drift, so re-verify before any decision rests on a
number.

This is the economic consequence of the liveness model in [`storage-and-scale.md`](storage-and-scale.md)
(per-subscriber cost by liveness tier) and the scale shape it describes (stateless fan-out
workers tailing a durable change log). The dogfooding action plan derived from it lives at
[`../../plans/icebox/data-sync-dogfooding.md`](../../../plans/icebox/data-sync-dogfooding.md).

## The cost surface — four lines

A stateless fan-out worker tailing the change log has a COGS of four lines, priced per
host and classified by billing dimension:

1. **Worker compute.** One write costs one field-set-prefiltered selector match (a handful
   of channel instances per hot doc) plus N socket writes, serialized once. CPU scales with
   write-rate × fan-out, memory with held connections. Stateless, so horizontally scalable
   and scale-to-zero-friendly (any node answers any reconnect, no sticky sessions).
2. **Egress — the dominant line and the margin lever.** Fan-out is bandwidth-amplifying;
   serialize-once saves CPU, not bytes. Egress is liveness-tier-weighted per the table in
   `storage-and-scale.md`, with the `live`-routed ceiling at 5-10 KB/s/subscriber. At
   hyperscaler egress ($0.09/GB) this dominates the bill; on bundled-egress bare metal it
   nearly vanishes.
3. **Storage adapter.** The change log is the adapter's change stream (Postgres logical
   replication, Mongo change streams, libSQL replication, or a transactional outbox). A
   separate priced axis with its own billing unit per engine.
4. **Coordination.** Multi-node fan-out and the ephemeral tier ride Streams-protocol
   pub/sub (redis/valkey — valkey is the open continuation after the 2024 relicense); the
   log may be a stream on the same bus or the DB's CDC. Zero at single-node (the in-memory
   ring buffer).

## Per-message billing is architecturally disqualified

The design keeps authorization off the wire so a delta serializes once and the same bytes
fan to every subscriber. A per-message-billed transport charges for each fanned message, so
it taxes exactly the shared-fan-out economics the architecture is built on. The fan-out
multiplier is the proof, stated by a vendor (Pusher): **publish one message to 50
subscribers bills as 51 messages.** So AWS API Gateway WebSocket, Ably, and Pusher are out
for the server tier. Cloudflare Durable Objects is the one managed realtime platform that
is *not* per-message (no charge for outgoing WebSocket messages, no egress), so it competes
where the others cannot. The market is itself migrating off per-message toward per-user
units (PubNub moved to MAU), which is the same conclusion from the other side.

## The three rungs

**Build / dogfood (us).** Cheapest is a scale-to-zero compute host for bursty PR previews
plus a small always-on box for staging/prod, paired with the static front end and the
Deploy Bot. Fly.io is the pick: stopped Machines bill no CPU/RAM, and Fly Proxy
auto-stops/starts on traffic. The action plan is the icebox doc above.

**Provider (a managed offering, the Turso model).** Two infra paths. Bare metal
(Hetzner/OVH/Latitude) drives the egress line toward zero and is the margin play; Cloudflare
Durable Objects matches the egress floor with managed scale-to-zero via hibernation, at the
cost of a different runtime (a separate adapter, not the node reference server) and
wall-clock Duration billing. **Bet: bare metal as the default margin play, DO as a possible
zero-ops global tier.** The **billing unit should be per-MAU or per-seat, never
per-message** — the cost driver is live-delta-volume concentrated in a minority of
connections (the liveness table), so a flat per-user unit cross-subsidizes the read-mostly
majority and stays predictable. This is where Liveblocks (per-MAU) and Convex (per-seat)
landed, and what PubNub migrated to. Margin firms up once the final fleet's per-connection
vector is benched; with bare-metal egress at ~$1.25/TB or free, COGS is compute + Postgres
(both cheap), so a per-MAU price in the Liveblocks range clears a healthy gross margin.

**User self-host (the MIT path).** A recommendation matrix, the "deploy your sync backend"
docs page when packages land:

| tier | host | storage engine | notes |
|---|---|---|---|
| hobbyist | $5 VPS (Vultr/Hetzner) or Fly free | SQLite / in-memory adapter | single node, no coordination service, minutes to two browsers syncing |
| small-prod | Fly (always-on) or Railway | Neon (usage) or Fly MPG | one worker + managed Postgres, optional Upstash Redis |
| enterprise | bare metal (Hetzner/OVH) or own cloud | own Postgres / Mongo + a Streams-protocol bus (redis/valkey) | stateless-worker fleet + durable log; egress-free bare metal is the cost story |

Gotchas that ship with that page: WebSocket idle-timeouts (some hosts close long-lived
sockets), egress metering (fan-out is bandwidth-heavy on metered hosts), managed-Postgres
`wal_level=logical` availability (gates the change-log adapter, though it is broadly
available — see snapshot), and free-Postgres expiry.

---

## Pricing snapshot — current 2026-06-28, re-verify at decision time

Verification: **[verified]** survived a 3-vote adversarial research check; **[direct]**
primary vendor source, not independently re-verified. Provider pricing changes without
notice — treat this as a dated reference, not a live quote.

### Compute / WebSocket hosts

| host | billing | egress | notable |
|---|---|---|---|
| **Fly.io** [v] | per-compute; stopped Machines bill no CPU/RAM; Proxy auto-stop/start | metered | true scale-to-zero for previews; pin `min_machines_running>=1` for always-on prod |
| **Hetzner** [v] | dedicated/cloud | **1G uplink unlimited free**; 10G/Cloud 20 TB then €1 (~$1.20)/TB, outgoing only | the egress floor |
| **OVHcloud US** [v] | dedicated | **unlimited unmetered** (APAC excepted; 50% throttle QoS) | egress-free bare metal |
| **Latitude.sh** [v] | bare metal | 20 TB free/server, then ~$1.25/TB core regions | plan on the package rate, not the $10/TB penalty |
| **Vultr** [v] | VPS | 2 TB free/mo pooled, then $0.01/GB worldwide | cheap small-prod box |
| **Cloudflare DO** [v] | Duration $12.50/M GB-s (400k incl) + Requests $0.15/M (1M incl); **no egress** | **none** | not per-message (no charge for outgoing WS); hibernation decouples compute from connection count; different runtime |
| **Railway** [d] | Hobby $5 / Pro $20 base + usage ($20/vCPU-mo, $10/GB-mo) | metered | PR environments first-class, billed as usage |
| **Render** [d] | Web Starter $7 / Standard $25 | metered | preview envs first-class; Key Value (Redis) no free tier, $10/mo |

### Storage adapters

| engine | billing | entry / free | change-log |
|---|---|---|---|
| **Neon** Postgres [v] | usage CU-hour ($0.106 Launch / $0.222 Scale per CU-hr) + $0.35/GB-mo; suspended=$0 | Free 100 CU-hr + 0.5 GB | logical replication for all incl. free; **a connected consumer pins compute (no scale-to-zero); slots idle >~40h auto-dropped** |
| **Supabase** Postgres [v] | flat + compute add-ons ($25 Pro) | Free (~500 realtime conns) | user-created logical slots not free-blocked (only the managed Pipelines product is) |
| **Fly Managed Postgres** [d] | fixed plan ($38 Basic → $1,922) + $0.28/GB-mo | — | standard PG, co-locatable with the worker; `wal_level=logical` permission unverified |
| **AWS RDS** Postgres [v] | instance-hours | — | logical replication opt-in (param group + `rds.logical_replication=1` + reboot) |
| **Turso / libSQL** [v] | per-row-read + storage | Free $0 (5 GB, 500M reads) | libSQL replication (a different adapter shape than PG) |
| **MongoDB Atlas** [v] | Flex $8-30/mo / M10 ~$56.94/mo | M0 free (512 MB) | change streams on M0 free (db-namespace filter restriction) |
| **SQLite / in-memory** [v] | $0 | free | the hobbyist rung |

### Coordination & competitive billing units

- **Upstash Redis** [d] — PAYG $0.20/100K commands + $0.25/GB-mo (1 GB free); the multi-node
  log/pub-sub substrate. Zero at single-node.
- **Per-message platforms (disqualified, for the gap):** Pusher [v] ($49-$299 connection-capped
  tiers, the 51-message fan-out model), AWS API Gateway WS [d] ($1/M msg + $0.25/M conn-min),
  Ably [d] ($2.50/M msg).
- **Competitive billing units** [d] — per-seat (Convex $25/dev), per-MAU (Liveblocks, PubNub),
  per-row-read (PlanetScale, Turso), usage-compute (Neon, Supabase, Fly, Railway, Render),
  per-message (Ably, Pusher, API Gateway — disqualified). PartyKit folded into Cloudflare;
  Zero/Rocicorp ships self-host-only.

Sources behind these figures, by domain: fly.io, hetzner.com, latitude.sh,
ovhcloud.com, vultr.com, developers.cloudflare.com, neon.com, supabase.com, mongodb.com,
turso.tech, upstash.com, pusher.com, aws.amazon.com, ably.com, convex.dev, liveblocks.io,
planetscale.com.
