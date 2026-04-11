# MCP Playground Rendering

## Goal

Add an MCP tool that accepts component code from an AI agent and renders it in the browser via the existing playground infrastructure. This enables an iterative design loop: the AI writes code, sees the rendered result via Chrome DevTools MCP, and refines — all without human intervention.

Secondary goal: support shareable short URLs for playground links via Vercel KV, so AI-generated examples can be shared with humans.

## Design / Implementation

### Phase 1: Hash-Based Playground URLs (done)

Playground links now use `#` fragment encoding instead of `?` query parameters. This removes all server/proxy URL length limits since fragments are purely client-side. The existing fflate compression + base64 pipeline is preserved.

**Completed:**
- `link-encoder.js` — `getPlaygroundLink` writes to `#`, `readPlaygroundLink` reads from `#`
- `playground.js` — same changes to duplicated functions
- `playground/index.astro` — reads `window.location.hash`
- CDN links updated to `cdn.semantic-ui.com/css@{channel}` and `core@{channel}` with environment-aware channel selection (`latest` on production, `canary` elsewhere)

### Phase 2: MCP `render_component` Tool

Add a new tool to `tools/mcp/src/server.ts` that:

1. Accepts component code (HTML, or HTML+JS+CSS) from the calling agent
2. Builds the files object using the same structure as `getCodePlaygroundLink`
3. Compresses via the same fflate + base64 pipeline
4. Returns a playground URL with the hash-encoded payload

The URL targets the docs site (local or deployed, depending on `config.ts` base URL detection). The calling agent then uses Chrome DevTools MCP to navigate to the URL and take a screenshot.

**Key decisions:**
- The tool should accept either raw HTML (simple case — wraps with SUI boilerplate) or a files object (advanced case — multi-file component)
- The compression/encoding must be identical to what `readPlaygroundLink` expects on the client side — reuse or port `encodeObject` from `link-encoder.js`
- The tool returns the URL as text — it does NOT open a browser. The agent decides what to do with the URL.

**Implementation steps:**
1. Port `encodeObject` and `makeBase64UrlSafe` to Node (replace `btoa` with `Buffer.from().toString('base64')`, fflate works in Node already)
2. Register `render_component` tool in `server.ts` with schema: `{ code: string, files?: Record<string, { contentType: string, content: string }> }`
3. Build URL using docs base from `config.ts` + `#files=` + encoded payload
4. Return the URL in the tool response

### Phase 3: Vercel KV Short URLs

Add a storage layer for persistent, shareable playground URLs.

1. Add a Vercel serverless function at `docs/api/playground/store.js` that:
   - Accepts POST with files object
   - Generates a content-addressable ID (hash of the compressed payload)
   - Stores in Vercel KV with configurable TTL (default 30 days)
   - Returns the short ID

2. Add a Vercel serverless function at `docs/api/playground/[id].js` that:
   - Looks up the ID in Vercel KV
   - Returns the files object as JSON

3. Update `playground/index.astro` to check for `?id=` parameter:
   - If present, fetch files from `/api/playground/{id}`
   - Otherwise, read from hash fragment as usual

4. Optionally add a `share_playground` MCP tool that stores the current playground state and returns the short URL.

## Open Questions

- **KV TTL policy:** Should shared playgrounds expire? 30 days default with option for permanent? This affects cost.
- **KV authentication:** Should the store endpoint require an API key, or is content-addressable hashing sufficient to prevent abuse?
- **Rate limiting:** Does the store endpoint need rate limiting beyond what Vercel provides by default?

## Dependencies

None — this work is independent of the main roadmap. Phase 1 is already complete.

## Status

- Phase 1: Complete (hash URLs + CDN link updates)
- Phase 2: Not started (initial scope)
- Phase 3: Not started (initial scope)
