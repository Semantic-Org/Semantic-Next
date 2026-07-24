# Data Sync Layer

## Goal

A realtime data layer for the framework: in-memory reactive collections queried locally, field-granular deltas pushed live over a cursor-core protocol, optimistic mutations that survive reload. Collections, schemas, mutators/actions, publications, search indexes, drafts and forms — the full vertical from wire to input primitive.

## Design

The complete design corpus lives at [`ai/research/data-sync/`](../../research/data-sync/) — plan with decision record, two ground-truth scenarios, wire protocol and its five-voice review, API steelmen (todomvc, invoices-table), vetting reports, and the research pass that grounded it. Gate verdict: revise-then-build, R2 rulings folded in.

## Sequencing

Ships post-1.0, after the component catalog — long simmer intended. The schema language ships first as [`schema-package`](../schema-package.md) (Phase 2, gates Value Schema interop). Remaining pre-build gates per the corpus: protocol v2 synthesis, the invoice-editor steelman + API reference, and the two Tier-1 spikes (rebase×scheduler, query-registry bench).

## Status

Iceboxed by design, not by doubt — design substantially complete, deliberately simmering until post-1.0.
