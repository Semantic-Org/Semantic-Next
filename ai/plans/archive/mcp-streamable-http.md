# MCP Streamable HTTP Deployment

## Context
The Semantic UI MCP server currently uses stdio transport, meaning each Claude instance spawns its own process. When multiple agents run concurrently, they all hit the local Astro dev server simultaneously, causing HTTP 500 errors. For production distribution, the MCP should be a hosted HTTP service at `mcp.semantic-ui.com` — the same model used by Sentry, Stripe, and GitHub.

## Architecture

```
Production:
  Claude Tab 1 ─┐
  Claude Tab 2 ──┼── HTTP ──→ mcp.semantic-ui.com ──→ next.semantic-ui.com (static)
  Claude Tab N ─┘

Contributors (unchanged):
  Claude Tab ── stdio ──→ local MCP process ──→ localhost (Astro dev)
```

## End-user configuration
```
claude mcp add --transport http semantic-ui https://mcp.semantic-ui.com/mcp
```

## Design Decisions
- **Stateless mode** (`sessionIdGenerator: undefined`, `enableJsonResponse: true`) — no session state, pure request/response, ideal for serverless
- **Vercel deployment** — `tools/mcp/` deployed as a Vercel serverless function
- **Monorepo stays** — Vercel supports deploying a subdirectory; framework packages come from npm at build time
- **Stdio preserved** — contributors still use stdio for local dev with `node tools/mcp/dist/index.js`

## Implementation Steps

### Step 1: Add HTTP entrypoint for Vercel
Create `src/http.ts` — a Vercel serverless function handler that:
- Creates the McpServer (same tool definitions as index.ts)
- Uses `StreamableHTTPServerTransport` in stateless mode with JSON responses
- Handles POST/GET/DELETE on `/mcp` endpoint
- Sets CORS headers for cross-origin access

Refactor: Extract server setup (tool definitions) from `index.ts` into `src/server.ts` so both stdio and HTTP entrypoints share the same McpServer configuration.

### Step 2: Vercel project config
- `vercel.json` in `tools/mcp/` with root directory config and function routing
- `api/mcp.ts` (or equivalent) wiring the handler to Vercel's function API
- Environment: `SEMANTIC_UI_DOCS_URL` defaults to `https://next.semantic-ui.com`

### Step 3: Deploy and test
- Deploy to Vercel with a stable preview URL
- Point `SEMANTIC_UI_DOCS_URL` at a preview deployment of the docs branch
- Test with `claude mcp add --transport http` and verify all tools work
- Confirm concurrent multi-tab access works without errors

### Step 4: Caching layer (if needed)
- In-memory cache on the Vercel function instance (warm starts reuse it)
- Manifests cached with 5-10 min TTL (already implemented)
- Content responses cached with longer TTL since production content is static
- Evaluate if Vercel KV or edge caching is needed based on cold start performance

## File Changes

### New files
- `src/server.ts` — Shared McpServer setup (extracted from index.ts)
- `src/http.ts` — HTTP transport entrypoint for Vercel
- `api/mcp.ts` — Vercel serverless function route
- `vercel.json` — Vercel deployment config

### Modified files
- `src/index.ts` — Import server setup from server.ts, keep stdio transport
- `src/config.ts` — Default to production URL in HTTP mode
- `package.json` — Add vercel build script if needed

### Unchanged
- `src/utils/cache.ts` — Works as-is for both transports
- `src/utils/specs.ts` — Pure logic, transport-agnostic
