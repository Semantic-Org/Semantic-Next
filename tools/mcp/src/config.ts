// Base URL configuration for fetching docs
// End users: Always use production (next.semantic-ui.com)
// Contributors: Can use local dev server when running from monorepo

import { existsSync } from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';

const PRODUCTION_URL = 'https://next.semantic-ui.com';
const DEV_URL = 'https://dev.semantic-ui.com';
const LOCALHOST_URL = 'https://localhost';

// Detect if running from monorepo by checking for dev cert
const __dirname = dirname(fileURLToPath(import.meta.url));
const certPath = resolve(__dirname, '../../../docs/cert/dev.semantic-ui.com.pem');
const isMonorepo = existsSync(certPath);

// Trust self-signed certs only when running from monorepo (local dev)
if (isMonorepo) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  console.error('[semantic-ui-mcp] Running from monorepo, local dev mode enabled');
}

let baseUrl = PRODUCTION_URL;
let initPromise: Promise<void> | null = null;

// Initialize with explicit env var or default
if (process.env.SEMANTIC_UI_DOCS_URL) {
  baseUrl = process.env.SEMANTIC_UI_DOCS_URL.replace(/\/$/, '');
}

async function tryFetch(url: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    const testUrl = `${url}/content/ai/manifest.json`;
    const response = await fetch(testUrl, { signal: controller.signal });

    clearTimeout(timeout);
    return response.ok;
  }
  catch {
    return false;
  }
}

async function detectServer(): Promise<void> {
  // Skip if explicit URL provided
  if (process.env.SEMANTIC_UI_DOCS_URL) {
    console.error('[semantic-ui-mcp] Using env URL', baseUrl);
    return;
  }

  // Only try local servers if running from monorepo
  if (isMonorepo) {
    if (await tryFetch(LOCALHOST_URL)) {
      baseUrl = LOCALHOST_URL;
      console.error('[semantic-ui-mcp] Localhost detected, using', LOCALHOST_URL);
      return;
    }
    if (await tryFetch(DEV_URL)) {
      baseUrl = DEV_URL;
      console.error('[semantic-ui-mcp] Dev server detected, using', DEV_URL);
      return;
    }
  }

  // Use production (default for end users, fallback for contributors)
  console.error('[semantic-ui-mcp] Using production', PRODUCTION_URL);
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
