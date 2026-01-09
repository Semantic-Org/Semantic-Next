// Base URL configuration for fetching docs
// Priority: SEMANTIC_UI_DOCS_URL > localhost > dev.semantic-ui.com > production

// Accept self-signed certs for local development
// Chrome cert trust doesn't extend to Node.js - it uses system CA store
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const PRODUCTION_URL = 'https://next.semantic-ui.com';
const DEV_URL = 'https://dev.semantic-ui.com';
const LOCALHOST_URL = 'https://localhost';

let baseUrl = PRODUCTION_URL;
let initPromise: Promise<void> | null = null;

// Initialize with explicit env var or default
if (process.env.SEMANTIC_UI_DOCS_URL) {
  baseUrl = process.env.SEMANTIC_UI_DOCS_URL.replace(/\/$/, '');
}

async function tryFetch(url: string): Promise<boolean> {
  console.error(`[semantic-ui-mcp] Trying ${url}...`);
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const testUrl = `${url}/content/ai/manifest.json`;
    console.error(`[semantic-ui-mcp] Fetching ${testUrl}`);
    const response = await fetch(testUrl, {
      signal: controller.signal,
    });

    clearTimeout(timeout);
    console.error(`[semantic-ui-mcp] ${url} responded with ${response.status}`);
    return response.ok;
  }
  catch (err) {
    console.error(`[semantic-ui-mcp] ${url} failed:`, err instanceof Error ? err.message : err);
    return false;
  }
}

async function detectServer(): Promise<void> {
  // Skip if explicit URL provided
  if (process.env.SEMANTIC_UI_DOCS_URL) {
    console.error('[semantic-ui-mcp] Using env URL', baseUrl);
    return;
  }

  // Try localhost first (fastest for local dev)
  if (await tryFetch(LOCALHOST_URL)) {
    baseUrl = LOCALHOST_URL;
    console.error('[semantic-ui-mcp] Localhost detected, using', LOCALHOST_URL);
  }
  // Then try dev.semantic-ui.com
  else if (await tryFetch(DEV_URL)) {
    baseUrl = DEV_URL;
    console.error('[semantic-ui-mcp] Dev server detected, using', DEV_URL);
  }
  // Fall back to production
  else {
    console.error('[semantic-ui-mcp] Using production', PRODUCTION_URL);
  }
}

export async function ensureConfigReady(): Promise<void> {
  if (!initPromise) {
    initPromise = detectServer();
  }
  await initPromise;
}

export function getDocsBaseUrl(): string {
  return baseUrl;
}

export function isDevMode(): boolean {
  return baseUrl.includes('dev.semantic-ui.com') || baseUrl.includes('localhost');
}
