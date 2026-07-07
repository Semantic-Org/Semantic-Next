# permissions and accounts

2026-06-29. the write-side authorization spec. it is the corpus member that extends Security Posture
and the Write Path `enforce` step onto identity, permissions, roles, and scope, and it builds on the
settled rulings (operations are authorized not edits, the resolved selector is the row rule, `private`
is the field floor) as their write-path counterpart. rungs 1-4 are specified, rungs 5-6 sketched.

## the two-layer model

permissions feel native here because they are an application of the framework's own primitives, not a
bolted-on auth service wired in from outside. a permission system is two layers and the framework
already owns one of them:

- **vocabulary** named permissions that derive from each other through the schema compute graph. this
  is `@semantic-ui/schema`, the compute engine this branch ships. a permission is a computed field, so
  "can publish" derives from "is editor or admin" the same way any computed field derives from its
  inputs. the vocabulary is a derivation graph, not a flat wall of toggles, which is the whole economy:
  a role is configured by toggling a few section roots and the graph cascades, and scope is a
  scoped-enum permission (`['subscribed', 'branch', 'all']`), never level-named columns.
- **enforcement** a `permit()` rule builder on collections that turns a verdict into an allow or deny
  at the write chokepoint.

so permissions are the compute engine plus one builder, not a new subsystem. the enforcement primitive
is a `permit()` rule builder on the collection (`Collection.permit([ops]).<condition>().apply()`,
conditions registered through a `defineCondition` method, deny-based under the hood, default-deny,
deny-wins, with identity-free built-ins like `never()` and the deep-path field-lists `onlyFields` /
`exceptFields`), and the economy is the derivation graph laid over it, expressed in our compute engine.

## governing principles

- **the gradient is the spec** the rung below never pays for the rung above. every graduation is
  additive: you import a package and add declarations, never rewrite what you already shipped.
- **the floor is always on** field-level protection ships in `schema` and is enforced on every write
  regardless of any opt-in lib. no configuration turns it off.
- **identity is not authorization** separate packages own these. one delegates identity, another owns
  authorization, and the line between them is drawn in the package map, not left implicit.
- **conditions are owned by whichever package owns the concept** the package that introduces a notion
  (login, ownership, a permission key, a scope) contributes the condition that reads it. no condition
  references a concept its package does not own.
- **enforce, not gate** the DB-op enforcement layer is "enforce": the functions are `enforceInsert` /
  `enforcePatch` (`packages/data/src/schema-binding.js:199`), which walk the touched-path set per Field
  descriptor. the `.ifX()` predicates are "conditions", an allow/deny construct is a "rule", the
  extension point is `defineCondition`. that is the whole vocabulary.

## the gradient

the gradient is the governing structure of this design, so the spec is ordered by it. earlier rungs
define later ones, and the shell / lib boundary is the lever: whatever has to stay out of the lean core
to protect rung-1 weight is exactly what the permissions lib picks up. read outward.

### rung 1: local table

packages: `@semantic-ui/data` (+ `@semantic-ui/schema`).

permission reality at this rung is the floor plus a bare shell, both native to a local collection with
no identity in play:

- **the floor** `private` and `serverOnly` field options ship in `schema` and are enforced at the
  `enforce` step on every write. mark a field `private` and it is protected from the first local todo,
  no opt-in.
- **the shell** the bare `permit()` builder is native to `Collection` with the identity-free
  conditions: `never()`, and the field allow / deny-lists `onlyFields` / `exceptFields` evaluated over
  the touched-path set the enforce step already produces.

so from the first local table `Todos.permit(['update']).allow().onlyFields([...])` holds, and a field
marked `private` never leaves. this matters beyond rung 1: a data layer with no visible security story
reads as a toy and evaluators bounce. the story is credible from the first table.

### rung 2: sync

packages: add `@semantic-ui/sync` + run `@semantic-ui/sync-server` (memory adapter, one node command).

same floor, same shell, now as the authoritative enforce at the server write chokepoint (`runMutator`).
`private` never crosses the wire because the authority runs server-side, not as a client courtesy.
writes are otherwise default-open, this is the hobby rung where sync works and nothing is locked down
yet.

### rung 3: login

packages: add `@semantic-ui/users` (first-party identity) OR a provider adapter exported as a subpath of
the same package (`import { ClerkAuth } from '@semantic-ui/users/clerk'`) behind the same `verifySession`
hook. identity now exists as `ctx.session`, resolved once at the `hello` handshake and pinned for the
connection. authorization is still default-open: logging in restricts nothing on its own. this is the
authN / authZ package line made physical, delegate identity (first-party or provider, same hook), own
authorization (a separate package, next rung). resolving the principal's permission set once at the
handshake rather than per write is what spares this design the per-write principal lookup the bolt-on era
paid on every mutation.

what `@semantic-ui/users` ships:

- **a `users` collection** a first-party synced collection: id, email, profile fields apps extend, the
  credential material as a `serverOnly` hash (never the password, never the wire), and once roles land
  the link to a permission group. it rides the same data / sync machinery as any app collection.
- **a `sessions` store** session records (token, userId, issuedAt, expiresAt), persisted so sessions
  survive restart and are revocable. the session token is what the client presents at the handshake
  `auth`, and this store is exactly what `server.revoke` and the expiry timer act on (see revocation).
- **credential flows** signup, login, logout, password reset, email verification, as server actions with
  server-side hashing.
- **the `verifySession` implementation** `@semantic-ui/users` is the first-party implementation of the
  `verifySession({ auth, request })` hook `sync-server` calls at the handshake: it resolves the presented
  token against the sessions store, checks expiry, and returns the principal as `ctx.session`. a provider
  adapter implements the same hook against the provider's token instead.
- **the reactive client surface** `session` / `user` reactive signals (the current principal) and
  `login()` / `logout()` / `signup()` calls. `user` is the signal the advisory checks (`field.canUpdate()`,
  `hasPermission`) read against.
- **`ifLoggedIn()`** the one condition it contributes, since identity is the concept it owns.

the authentication surface, sketched so it is scoped rather than assumed: every method converges on one
point, a session issued into the `sessions` store and a token the client presents for `verifySession` to
resolve, so the methods are the front door and the session is the back. the methods are email + password
(with verification and reset), federated / social (OAuth / OIDC, account-linking a social identity onto a
matching email), enterprise SSO (OIDC / SAML, org-scoped, belongs with the scope rung), and passwordless
(magic-link, passkeys / WebAuthn). v1 first-party ships the email + password baseline only: the richer
methods are provider-delegated behind the same `verifySession` seam, or named first-party extensions.
verification, reset, and magic-link send mail, so `users` also carries a pluggable email-delivery seam
(SMTP / SES / Resend), the same inversion-of-control shape as the storage adapter.

standing up the `users` and `sessions` tables is not the gap it first looked like: it rides the
provisioning primitive (see package map and seams), a small formalization of machinery the postgres
adapter already has. delegating to a provider sidesteps even that, since the provider owns the tables.

### rung 4: real gates

packages: add `@semantic-ui/permissions`.

this is where permissions get teeth. it is not where they debut (the floor and shell predate it by
three rungs), it extends the shell. its surface:

- **the composition engine** allow / deny rules resolved into a verdict: OR across allow rules,
  deny-wins over any allow, a collection tier and a global tier composing together, and the
  default-open / default-deny posture lever. permitted iff some allow fires and no deny fires.
- **the condition vocabulary + `defineCondition(name, fn)`** the standard library (`ifOwnsDoc`,
  ownership and current-value conditions) alongside the open extension point. conditions are deny-style
  predicates under the hood but authored allow-oriented, so the author writes what is permitted and the
  engine handles the polarity. this is `defineMethod`'s shape with the polarity inverted at the
  authoring surface.
- **the reactive advisory API** three surfaces, split by whether a check needs a doc. the doc-aware
  ones are author-wired reactive primitives: field-granular `field.canUpdate()` / `field.canRead()` on
  the schema Field is the everyday one (client advisory is always per-field, a form enables one input
  at a time), with op-level `Collection.can(op, doc)` / `Collection.<op>.allowed` above it for
  affordances like hiding a row's delete button. the doc-independent one is a registered global helper:
  `{#if hasPermission 'some_permission'}` returns the user's static permission boolean with no doc in
  scope (it reads the named-permission vocabulary, so it lands at the roles rung). the rule that
  separates them: an explicit-argument helper reading a user-level fact (`hasPermission 'x'`) is a clean
  global, an implicit-context helper that needs a doc it cannot see (`canEdit`) is not.
- **the authoritative server enforcement** the same rules plugged into the `enforce` step at
  `runMutator` as the authority. the client checks are advisory, this is the one that decides.
- **the isomorphism guarantee** one rule set, advisory on the client and authoritative on the server,
  with a conformance assertion that the two cannot drift apart.
- **auth-rejection + replay handling** a rule that denies an aged or replayed write produces a
  rejection-park, the retry-later vs discard-forever vocabulary. this is where auth meets conflict
  (below): a denied write is not always a permanent failure.
- **the global tier** org-wide allow / deny rules, and the fail-closed posture lever that flips the
  whole surface to default-deny.

#### read visibility is named channels, not per-subscriber projection

the read side resolves to a stated v1 position. `field.canRead()` is advisory and per-field on the
client, a form gating one input at a time. server-authoritative read-tiering is separate named channels
behind different auth gates (`records.summary` vs `records.admin`), never a per-subscriber projection
computed on a shared `(name, args)` instance: per-subscriber content on a shared stream is the WALRUS
failure class (amendment 1), and field projection stays part of channel identity (Security Posture). a
viewer reaches a channel only as declared args or as the join-time boolean its `permission` resolves
to, so role-tiered visibility is a channel choice, not a masking pass that degrades sharing.

#### where this is structurally better than the bolt-on era

three structural edges, all from owning the write path and the schema rather than wrapping a CRUD
library:

- **native deep-path field conditions** `enforcePatch` already walks the full dotted touched-path set
  and resolves the Field descriptor per path (`packages/data/src/schema-binding.js:199-256`), so
  deep-path allow / deny-lists are native, where the bolt-on era's field-list conditions gate only
  top-level fields and any deeper rule had to be hand-built. our enforce step resolves the descriptor at
  every depth as a side effect of how it already validates, no separate field-prefix matcher to maintain.
- **one authoritative chokepoint** `runMutator` (the `enforce` step) gates every write path, so there
  is no two-parallel-mechanisms situation the bolt-on era lived with (a declarative permit-chain beside
  imperative raw-write deny rules, two engines that had to agree). one place authorizes a write.
- **no per-write N+1** the principal's permission set resolves once at the `hello` handshake into
  `ctx.session`, not via a principal-and-permissions lookup on every write. the vocabulary is resolved
  state on the session, the enforce step reads it.

### rung 5: roles (sketch)

packages: add `@semantic-ui/roles` (named to read, not the jargon "rbac").

this is the named-permission vocabulary expressed as a schema compute graph, which is the whole
economy: permissions derive from each other through `computed` fields and their `deps` rather than
being enumerated flat. its pieces:

- **role groups + presets with provenance** a group forks from a preset, records its preset lineage,
  then owns its own values. the fork is a snapshot, not a live link, so editing the preset does not
  silently rewrite every group. the user-to-group link, by contrast, is live.
- **the derivation graph** permission keys computed from other keys via the schema compute engine, the
  same mechanism that lets a few dozen conditions cover a broad authorization surface.
- **the condition + helper** it contributes the `ifHasPermission(...)` condition and the
  `{#if hasPermission 'name'}` global template helper, since it owns the named-permission vocabulary
  both read.

### rung 6: multi-tenant scope (sketch)

packages: roles' scope tier, or its own `@semantic-ui/orgs` if it splits out.

scope is a single reference to a node in a generic resource hierarchy. it is deliberately not
level-named columns like `branch_ids`: depth is data, so adding a layer touches zero callsites. its
shape:

- **scope as data** one reference to a node in a generic hierarchy. the hierarchy's depth lives in the
  data, never in column names or callsite logic.
- **inheritance** grants inherit downward through the hierarchy.
- **records carry a scope fk** the pk = fk shape, a record's scope is a foreign key to its node.
- **resolution lives behind one primitive** record-scope composed with principal-scoped-grants resolves
  in one place, never inlined per-callsite, since callsite-inlined level-resolution was the root of the
  bolt-on era's biggest refactor. that single-primitive, never-name-a-level invariant is the fixed
  contract here.
- **the condition** it contributes `ifInScope(...)`.

## package map and seams

new packages:

- `@semantic-ui/users` (provider integrations are subpath exports of the same package, e.g.
  `@semantic-ui/users/clerk` exporting `ClerkAuth`, not separate packages)
- `@semantic-ui/permissions`
- `@semantic-ui/roles` (scope tier inside, or `@semantic-ui/orgs` if it splits)

dependency layering: `schema -> data -> { users, permissions } -> roles`.

seams added to existing packages are small and shipped in core, because the handshake is the highest
cost-to-change surface and deferring it is how a v1 / v2 protocol split happens:

- **sync-protocol** carries the auth + reauth frames and the auth-rejection codes, foundational rather
  than a later capability (see revocation).
- **sync-server** accepts a `verifySession` fn, pins `ctx.session`, runs a server-side token-expiry /
  downgrade timer, and exposes a hook in the `enforce` / `runMutator` write path that permission rules
  plug into. this is inversion of control, the same shape as a storage adapter.
- **data** exposes the `permit()` shell on `Collection`, and the `enforce` step already produces the
  touched-path set conditions read.
- **sync (client)** presents the token at handshake and reauth, and feeds the advisory checks.
- **storage adapter (provisioning)** the table-standup primitive is `ensureCollection(name, config)`, the
  postgres adapter's existing private `ensureTable` lifted into the adapter contract: postgres runs
  `CREATE TABLE IF NOT EXISTS` with columns derived from the schema (the flat-plus-jsonb ColumnMap),
  memory is a no-op since a collection is just a Map. it runs eagerly for every registered collection at
  `listen()`, so DDL errors surface at boot rather than on a user's first write, with the lazy first-op
  path as the fallback. it is idempotent and create-if-absent only: evolving an existing table is a
  migration, a separate primitive. brownfield (`manageTable: false`) means the layer never touches a table
  the app owns.

## authoring API

```
Collection.permit([ops]).allow().ifOwnsDoc('user_id')
Collection.permit([ops]).deny().ifSomething()
```

- `ops` is always an array, even for a single op.
- `.allow()` / `.deny()` set the rule's polarity. allow is the default, so `.allow()` may be implicit.
- `.ifX()` conditions are positive predicates, ANDed together: a rule fires when all of its conditions
  pass.
- the verdict: permitted iff (some allow rule fires) AND (no deny rule fires). deny-wins.
- the global tier is org-wide allow / deny composing the same way, deny-wins across tiers too.

## revocation

revocation is bounded by a server-owned expiry / downgrade timer plus a server-initiable reauth frame.
the client refresh schedule is an optimization on top of that bound, not the bound itself. revocation
latency is `<= min(explicit server.revoke, authExpiresIn)`, and the server owns the bound: a
server-side token-expiry / downgrade timer fires at `authExpiresIn`, forcing re-auth or downgrading the
principal and re-gating the subscription set, and a server-initiable reauth frame lets the server
demand a fresh credential rather than waiting on the client. a client-scheduled refresh would let a
revoked principal who controls the client never refresh and hold the socket for its lifetime, which is
why the deadline is server-enforced.

reactive authorization revocation is rejected, consistent with the non-reactive permissions ruling. a
channel re-evaluating its handler on every membership or permission change widens the settled ruling
(`sync-poc/ai/decisions.md` 7.4(b)) that deliberately deleted the reactive-on-permissions sub-problem
and healed mid-session permission change by resubscribe / reload. explicit `server.revoke` plus the
server-enforced timer bound the urgent cases without reopening it: revoking access is bounded by the
timer rather than unbounded, which is all the taxonomy demands.

## the conflict / park joint

this is the write-side member of the replay / park taxonomy (amendment 3). auth meets conflict at
replay, two cases kept distinct:

- **intermittent offline (the blip window)** seconds to a minute, must replay seamlessly. a token that
  expired in a tunnel re-auths on reconnect and the write replays with zero loss. the reauth frame and
  server-side timer make this case correct rather than lossy: the principal is the same, the credential
  is refreshed on reconnect, the outbox drains.
- **significant outage** the degenerate case, park-then-verify, where users already expect loss. an
  auth-rejected aged replay (the principal's permission revoked while they were gone) settles as a
  **rejection-park**, the retry-later vs discard-forever vocabulary: validation-shaped, content
  retained, edit-and-retry, never silently dropped. this is amendment 3's rejection-park class, which
  already names "permission revoked overnight" as its canonical instance, bound here to the auth
  machinery (the reauth frame, the expiry timer). nothing new on the wire, the outbox already carries
  the evidence.

## deferred and open

deliberate scope, marked the way the corpus marks `(open)`:

- **rungs 5-6 are sketched, not specified** roles and scope still need their data model pinned (the role /
  group / scope schemas, and how grants resolve). table-standup is no longer the blocker, it rides the
  provisioning primitive above. rung 6's resolution primitive is specified by its invariant (one place,
  never name a level), not its signature.
- **migrations are their own primitive** provisioning is create-if-absent only. evolving a live table (a
  new column on an existing `users` or app table) is a separate, deferred migration primitive, not folded
  into provisioning.
- **package naming** `users` vs `accounts`, and whether the scope tier splits out to `orgs`.
- **default posture per collection** default-open vs default-deny once `permissions` is present. leans
  default-open, with global-deny as the fail-closed lever.
- **the opener** `permit([ops])` vs dropping `permit` for `allow([ops])` / `deny([ops])`. leans keeping
  `permit`.
- **condition naming** `condition` vs `rule` for the construct word, and the verbose condition names
  (`ifCurrentFieldValueNotEquals` and its siblings are placeholders to wordsmith tighter).
- **scope token granularity** a scoped-enum (none / branch / all) vs a boolean, decided by the
  condition's role.
- **field-permission declaration** ride the schema's existing blackbox `meta:{}` field metadata, or a
  dedicated field-permission surface that `field.canRead()` / `canUpdate()` reads from.
