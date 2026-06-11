# Scenario II — The Hobbyist (Equal Constitutional Standing)

Status: **proposed — awaiting confirmation.** This document has equal standing with [`scenario.md`](scenario.md). Protocol-mandatory machinery must justify itself against *both* scenarios, and **features this persona doesn't need must cost this persona nothing** — no bytes, no concepts, no setup steps. The majority of adopters live here. Open source is built on hobbyists being happy, and the easy case must be fast and painless or the hard case never gets its chance.

## The Persona

A weekend project, a classroom exercise, an agent-authored microapp, an internal tool for five people. One person (or one agent) building something small that should feel magical: two browsers open, a checkbox flips in both. They will not read a protocol spec. They will not run Redis. They will not configure postgres. They may never run `npm install`.

## The Stack

- **CDN, no build** — the `<script src=".../load">` tag rung. No bundler, which means **no glob loader exists**: the inline `mutators:`/`methods:` config form is this persona's path, and it must remain fully capable.
- Or: one `npm create` away from a running sync app. Either way: **minutes from empty file to two browsers syncing** is the bar.
- Server: one command, one file. `memoryStorage()` for play, a single-file adapter (JSON or SQLite — five functions) for persistence that survives restart. No external services, ever, at this rung.
- Deployment: a $5 VPS, a free-tier container, a laptop. **Single node, always** — which resolves the multi-node question for this rung by decree.

## The App Shape

- 1-3 collections, tens to low thousands of docs, whole-collection channels. No projections, no role tiers, no search indexes — the table filter is `array.filter` over the synced set.
- Auth: none, or one shared secret, or "whoever has the URL." The `can()` hook defaults to allow.
- Schema: optional to start. A schemaless collection syncs plain JSON and works; schema arrives when the app earns it (the gradient's first rung is no schema at all).
- Concurrency: usually one user, sometimes a handful. Conflict UX is irrelevant — last-write-wins everywhere is correct here, and reload-heals-everything is an acceptable answer to every soft fail.

## The Bars (the counting metrics)

| Metric | Bar |
|---|---|
| Time to first realtime | minutes (~), empty file → two browsers syncing |
| Concepts before first sync | ≤3: collection, subscribe, mutator (~) |
| Setup steps | script tag + one server command (~) |
| Client bundle (sync layer) | small enough to not embarrass the CDN rung (~, number TBD) |
| Server deps | zero beyond Node (~) |
| Config required | none — every knob has a hobbyist-correct default |

## What This Persona Never Sees (and must never pay for)

Projections and role tiers, search index factories, conflict surfaces and parking queues, per-path evidence, CDC and the god-eye, migration tooling, multi-tab leader complexity beyond it-just-working, txid machinery, epoch bumps, capability negotiation. Every one of these must be tree-shaken, defaulted away, or server-tier-absent at this rung. **The hard fails still bind** — silent data loss is equally unacceptable at small scale — but the conversion machinery is simpler: the outbox, the reload, and honest last-write-wins cover this persona's entire failure model.

## The Constitutional Function

When a design argument says "the scenario demands it," ask *which one*. Enterprise machinery justifies against scenario.md; its cost-to-the-hobbyist justifies against this document. A mechanism that serves neither is a glass bead. A mechanism that serves one must be free for the other. Where the two scenarios genuinely conflict, the answer is a tier or a default — never a tax on the small to fund the large.
