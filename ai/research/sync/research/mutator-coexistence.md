# mutators: the coexistence amendment — patch-plane default, server authority opt-in

> drafted 2026-07-11 from the adjudication dialogue, for the maintainer to review, edit, and
> carry into the corpus under his name. proposes amending the conflict-model row (plan
> decision 1) and the mutator registration semantics. pattern language throughout; ready to
> travel.

## the probe that opened it

the shipped kernel implements mutators as Meteor's method-stub model with the names changed
(the conflict-model row says so verbatim): the body runs twice — a client simulation for
latency, an authoritative server re-execution — and rebase replays pending mutators over
fresh server state. the maintainer's concept was never that: mutators as a low-ceremony,
collection-colocated way of writing `todos.addTodo('Buy ham')` — cousins of helpers, named
for callsite legibility, client-executed, with the resulting doc transformation shipping as
a patch. the tell that these are different architectures: a body like
`async (doc) => { const foo = await getSomeValue(); ... }` with a client-side await simply
cannot re-execute on a server. one model or the other had to give — and the answer turned
out to be neither.

## the two arguments that broke stub-only

**1. client CRUD makes field-level permission rules mandatory anyway.** the design ships
`Todos.update(id, { $set })` as a first-class, client-callable, ambient operation. anyone
can invoke it from a dev console — so field-level allow/deny-class write rules are not
optional and not "unwritable": they are structurally required the moment client CRUD
exists, and per-field permission files are the tractable shape for writing them: the rule sits
next to the field it guards, so the write surface stays greppable instead of scattering across
callbacks. what actually died in the Meteor era was ad-hoc callback validation
of arbitrary modifiers plus insecure-by-default culture — and the corpus permission engine
(boot-legible `permit()` rules, composition, deny-wins, conditions that read the doc at the
enforce step) is the repair of that failure, not its return. consequence: **patch-shipping
mutators add zero new security surface.** they are exactly as trustworthy as the CRUD they
organize, gated by the same plane that must exist regardless. the stub model's security
argument never differentiated mutators; it only ever described a posture (deny raw CRUD,
allow named verbs) — real, but narrow, and an opt-in concern.

**2. colocation and enumerability are the concept's purpose.** a freestanding
`const addTodo = ...` helper over CRUD has the same trust profile — but it scatters. the
registry is the point: `console.log(Todos.mutators)` enumerates the verbs of the
collection — what a client can do, optimistically, without server gating — as a readable
contract. legibility is the design's constant objective, and a registry of anonymous
helpers is not a registry.

## the trackWrites geometry

the kernel's own primitive settles which model is native. `Signal.mutate(fn)` runs the body
through `trackWrites` and captures the changed paths — and the mutator contract is defined
as that contract lifted to docs. so the machinery for turning a mutator body into a patch
IS the reactive layer's core idiom, and the entire fork reduces to one question: **which
seat runs trackWrites** — the client (capture the writes, ship the patch) or the server
(re-run the body, capture for fan-out). both are the same primitive in different seats.

## the coexistence design

ceremony rises exactly with trust, and the trust posture is readable at the registration
site:

```js
mutators: {
  // rung 1 — function-shaped: the default. client-executed once, client context and
  // async welcome, trackWrites captures, the patch ships. gated by the collection
  // permission plane + the doc contract, like the CRUD it organizes.
  addTodo(doc, taskName) {
    analytics.track(taskName);
    doc.taskName = taskName;
  },

  // rung 2 — config-shaped with the server flag: the graduated stub. the single body is
  // isomorphic (it ships as its own simulation) and re-executes authoritatively; args are
  // the wire contract. effects are server-authored — a tampered client can call the verb,
  // never forge the outcome.
  markPaid: {
    args: {},
    server: true,            // flag name open — `serverOnly` collides with field vocabulary
    mutate(doc) { ... },
  },

  // rung 3 — the split form: prediction ships, authority hides. for server bodies that
  // touch anything client-unsafe. the shared def carries only the simulation; the real
  // body late-attaches in a server-only module (module-graph separation, the same
  // syntactic boundary as actions — a client handle has no registration verb).
  settle: {
    args: {},
    server: true,
    simulate(doc) { doc.status = 'settled'; },   // provisional; authority's values win
  },
  // server file:  Landings.mutator('settle', { mutate(doc) { env.KEY; ... } });
}
// rung 4 is an action: no prediction at all, awaited, ledgered.
```

**the sorting criterion is optimism, and it teaches itself:** if you can honestly predict
it, it can be a mutator; if you can't — money, external calls, secrets — it's an action.
the env-key question and the optimism question are the same question: the thing that needs
the secret was never predictable, so it was never a mutator. mutators can optimistically
update; actions cannot — that IS the split.

## the simulate slot (rung 3's special property)

an authored, disposable prediction — the developer declares "here's what to show during the
wait," knowing the authority will land differently, and that is fine BY CONSTRUCTION: the
client invariant is synced ⊕ pending, predictions live as a copy-on-write overlay that is
never merged into truth, confirmation removes the entry and visible state re-derives.
chained pending writes self-heal because replay re-EXECUTES the remaining simulations over
fresh confirmed state — predictions are re-derived at every rebase, never compounded.
divergence is a rendering concern, never a consistency one. no surveyed ecosystem framework
offers an explicit optimism escape valve like this; it turns long-wait UX (slow external
settlement, batch operations) into an authorable surface.

## what server re-execution still uniquely buys (the honest residue)

- **the graduated-trust posture**: denying raw CRUD wholesale while allowing named verbs
  whose effects cannot be forged. rung 2 exists precisely for this. the open question is
  how often optimistic-AND-unforgeable is really demanded in one op.
- **read-modify-write beyond patch operators**: `doc.count += 1` as a value patch loses
  concurrent updates. two mitigations short of rung 2: operational patch vocabulary
  (`$inc`-class modifiers — open call below), and the contract's own stated semantic that
  same-path concurrency is last-write-wins at the server anyway.
- server-authored values (timestamps, derived fields) do NOT require rung 2: write-path
  computed fields stamp them under server authority regardless of which rung wrote.

## the law that fell out

**args are required exactly where args are the wire contract.** rung-2 mutators and actions
ship args and nothing else stands behind them: required unless `unsafe: true`, greppable
waiver. rung-1 mutators ship a patch the doc contract and permission plane already gate:
args schemas are pure callsite ergonomics, optional. the requirement follows the wire.

## wire and naming notes

- rung-1 mutator calls carry a patch, not args — they can ride the existing patch frame;
  the open question is attribution (naming which verb produced the patch, for audit and
  permission conditions that key on the operation).
- flag naming open: `server:` / `authority: 'server'` / `secure:` — `serverOnly` is taken
  by field-visibility vocabulary.
- rejected along the way, for the record: proxy-based client namespaces (a Proxy answering
  `console.log` with a blackbox violates enumerability-as-contract); manual client-side
  action declaration (replaced by the structural registration manifest — server-published
  contract at handshake, structure never values).

## open calls for corpus adjudication

1. the flag name (above).
2. operational patch vocabulary (`$inc`-class) in the rung-1 wire form: yes/no/deferred.
3. does rung 1 ship in 1.0 alongside rung 2, or does the stub remain sole until the patch
   plane lands? (the coexistence design is additive; rung 2 is what exists today.)
4. rebase entry semantics for rung-1 pending writes: re-run the body over fresh state
   (the client holds it; self-healing, recommended) vs re-apply the captured patch.
5. attribution on the patch frame (wire note above).
