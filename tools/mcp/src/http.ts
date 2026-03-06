/*
 * Deploying an MCP server on Vercel (Node.js runtime)
 * ====================================================
 *
 * TRANSPORT: Use StreamableHTTPServerTransport (Node.js), NOT
 * WebStandardStreamableHTTPServerTransport. Vercel's Node.js runtime passes
 * IncomingMessage/ServerResponse despite what the function signature suggests.
 * The Web Standard transport expects Request objects with Headers.get(),
 * .text(), and absolute URLs — Vercel's req has none of these. We tried:
 *   1. Patching req.headers with Object.defineProperty → silently broke
 *   2. Reconstructing a new Request() → req.url is relative ("/mcp"), fails
 *   3. Reading body with for-await-of on the stream → hangs (see below)
 *   4. Edge runtime (real Web Standard Request) → no dynamic eval (new Function)
 * The Node.js transport wraps the Web Standard one via @hono/node-server and
 * handles conversion internally.
 *
 * PARSED BODY: Vercel pre-reads the request body before your handler runs.
 * The IncomingMessage stream is already consumed. If the transport tries to
 * read it via Node.js stream APIs (req.on('data')), it hangs forever with
 * no error — just a 504 timeout after 300 seconds. The fix is the third
 * argument to handleRequest: transport.handleRequest(req, res, parsedBody).
 * Vercel exposes the pre-parsed body as req.body. This parameter exists in
 * the SDK for middleware environments (Express body-parser, Vercel, etc.)
 * that consume the body before the transport sees it.
 *
 * BUILD: esbuild bundles this into a single api/mcp.js file (see build.js).
 * Vercel's own TS compilation choked on the framework packages — they use
 * ESM export maps without "type": "module" which works at runtime but
 * confuses Vercel's bundler. Pre-bundling with esbuild sidesteps this.
 *
 * STATELESS: sessionIdGenerator: undefined, enableJsonResponse: true.
 * Each request creates a fresh McpServer + transport. The manifest cache
 * is shared across warm invocations via module-level state.
 */

import { StreamableHTTPServerTransport } from '@modelcontextprotocol/sdk/server/streamableHttp.js';
import type { IncomingMessage, ServerResponse } from 'node:http';

import { createServer } from './server.js';
import { initCache } from './utils/cache.js';

let initialized = false;

async function ensureInitialized(): Promise<void> {
  if (!initialized) {
    await initCache();
    initialized = true;
  }
}

const CORS_HEADERS: Record<string, string> = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, MCP-Session-Id, MCP-Protocol-Version',
  'Access-Control-Expose-Headers': 'MCP-Session-Id',
};

function setCorsHeaders(res: ServerResponse): void {
  for (const [key, value] of Object.entries(CORS_HEADERS)) {
    res.setHeader(key, value);
  }
}

export default async function handler(req: IncomingMessage, res: ServerResponse): Promise<void> {
  setCorsHeaders(res);

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  await ensureInitialized();

  // Stateless: new server + transport per request to avoid race conditions
  const server = createServer();
  const transport = new StreamableHTTPServerTransport({
    sessionIdGenerator: undefined,
    enableJsonResponse: true,
  });

  await server.connect(transport);

  // Vercel pre-parses the request body — pass it through so the transport
  // doesn't try to read from the already-consumed stream.
  const parsedBody = (req as unknown as { body?: unknown; }).body;
  await transport.handleRequest(req, res, parsedBody);
}
