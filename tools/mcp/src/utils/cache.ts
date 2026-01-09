import { each, weightedObjectSearch } from '@semantic-ui/utils';
import { ensureConfigReady, getDocsBaseUrl } from '../config.js';

// Content item interfaces
export interface SpecItem {
  type: 'spec';
  id: string;
  path: string;
  name: string;
  tokens: number;
}

export interface ExampleItem {
  type: 'example';
  id: string;
  path: string;
  title: string;
  tokens: number;
  category?: string;
}

export interface ContextItem {
  type: 'context';
  path: string;
  title: string;
  tokens: number;
  audience: 'ui' | 'framework' | 'contributing' | 'research';
}

export interface DocItem {
  type: 'doc';
  path: string;
  url: string;
  title: string;
  tokens: number;
  package?: string;
  methods?: string[];
}

export type ContentItem = SpecItem | ExampleItem | ContextItem | DocItem;

// Cache state
interface ContentCache {
  specs: SpecItem[];
  examples: ExampleItem[];
  context: ContextItem[];
  docs: DocItem[];
  ready: boolean;
  lastUpdated: number;
}

const cache: ContentCache = {
  specs: [],
  examples: [],
  context: [],
  docs: [],
  ready: false,
  lastUpdated: 0,
};

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

async function fetchWithTimeout(url: string, timeout = 30000): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    return await fetch(url, { signal: controller.signal });
  }
  finally {
    clearTimeout(timeoutId);
  }
}

async function fetchManifest<T>(endpoint: string): Promise<T | null> {
  const baseUrl = getDocsBaseUrl();
  const fullUrl = `${baseUrl}${endpoint}`;
  console.error(`[semantic-ui-mcp] Fetching manifest: ${fullUrl}`);
  try {
    const response = await fetchWithTimeout(fullUrl);
    if (!response.ok) {
      console.error(`[semantic-ui-mcp] Failed to fetch ${endpoint}: ${response.status}`);
      return null;
    }
    const data = await response.json() as T;
    console.error(`[semantic-ui-mcp] Got manifest ${endpoint}: ${JSON.stringify(data).slice(0, 100)}...`);
    return data;
  }
  catch (error) {
    console.error(`[semantic-ui-mcp] Error fetching ${endpoint}:`, error instanceof Error ? error.message : error);
    return null;
  }
}

export async function initCache(): Promise<void> {
  // Ensure config is ready before fetching
  await ensureConfigReady();

  const now = Date.now();

  // Skip if cache is still fresh
  if (cache.ready && (now - cache.lastUpdated) < CACHE_TTL) {
    return;
  }

  console.error('[semantic-ui-mcp] Initializing content cache...');

  const [specsManifest, examplesManifest, contextManifest, docsManifest] = await Promise.all([
    fetchManifest<{ specs: Omit<SpecItem, 'type'>[]; }>('/content/specs/index.min.json'),
    fetchManifest<{ examples: Omit<ExampleItem, 'type'>[]; }>('/content/examples/index.min.json'),
    fetchManifest<{ pages: Omit<ContextItem, 'type'>[]; }>('/content/ai/index.min.json'),
    fetchManifest<{ pages: Omit<DocItem, 'type'>[]; }>('/content/docs/index.min.json'),
  ]);

  const failed: string[] = [];

  if (specsManifest?.specs) {
    cache.specs = specsManifest.specs.map(s => ({ ...s, type: 'spec' as const }));
  }
  else {
    failed.push('specs');
  }

  if (examplesManifest?.examples) {
    cache.examples = examplesManifest.examples.map(e => ({ ...e, type: 'example' as const }));
  }
  else {
    failed.push('examples');
  }

  if (contextManifest?.pages) {
    cache.context = contextManifest.pages.map(c => ({ ...c, type: 'context' as const }));
  }
  else {
    failed.push('context');
  }

  if (docsManifest?.pages) {
    cache.docs = docsManifest.pages.map(d => ({ ...d, type: 'doc' as const }));
  }
  else {
    failed.push('docs');
  }

  cache.ready = true;
  cache.lastUpdated = now;

  if (failed.length > 0) {
    console.error(`[semantic-ui-mcp] WARNING: Failed to load manifests: ${failed.join(', ')}`);
    console.error(`[semantic-ui-mcp] Some tools may return empty results. Check if the docs server is running.`);
  }

  console.error(
    `[semantic-ui-mcp] Cache initialized: ${cache.specs.length} specs, ${cache.examples.length} examples, ${cache.context.length} context docs, ${cache.docs.length} user docs`,
  );
}

export function isCacheReady(): boolean {
  return cache.ready;
}

// List functions
export function listSpecs(): SpecItem[] {
  return cache.specs;
}

export function listExamples(category?: string): ExampleItem[] {
  if (category) {
    return cache.examples.filter(e => e.category === category);
  }
  return cache.examples;
}

export function listContext(audience?: 'ui' | 'framework' | 'contributing' | 'research'): ContextItem[] {
  if (audience) {
    return cache.context.filter(c => c.audience === audience);
  }
  return cache.context;
}

export function listDocs(): DocItem[] {
  return cache.docs;
}

// Search function
export interface SearchOptions {
  type?: 'spec' | 'example' | 'context' | 'doc';
  audience?: 'ui' | 'framework' | 'contributing' | 'research';
  category?: string;
  limit?: number;
}

export function search(query: string, options: SearchOptions = {}): ContentItem[] {
  const { type, audience, category, limit = 20 } = options;

  // Build the search pool
  let pool: ContentItem[] = [];

  if (!type || type === 'spec') {
    pool = pool.concat(cache.specs);
  }
  if (!type || type === 'example') {
    const examples = category
      ? cache.examples.filter(e => e.category === category)
      : cache.examples;
    pool = pool.concat(examples);
  }
  if (!type || type === 'context') {
    const context = audience
      ? cache.context.filter(c => c.audience === audience)
      : cache.context;
    pool = pool.concat(context);
  }
  if (!type || type === 'doc') {
    pool = pool.concat(cache.docs);
  }

  if (!query) {
    return pool.slice(0, limit);
  }

  const results = weightedObjectSearch(query, pool, {
    propertiesToMatch: ['title', 'name', 'id', 'path', 'category', 'audience'],
    matchAllWords: true,
  }) as ContentItem[];

  return results.slice(0, limit);
}

// Fetch result types for better error reporting
export interface FetchResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  url: string;
}

// Fetch actual content
export async function fetchContent(path: string): Promise<FetchResult<string>> {
  const baseUrl = getDocsBaseUrl();
  const fullUrl = `${baseUrl}${path}`;

  try {
    const response = await fetchWithTimeout(fullUrl);
    if (!response.ok) {
      const error = `HTTP ${response.status}: ${response.statusText}`;
      console.error(`[semantic-ui-mcp] Failed to fetch content: ${error} - ${fullUrl}`);
      return { success: false, error, url: fullUrl };
    }
    const data = await response.text();
    return { success: true, data, url: fullUrl };
  }
  catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[semantic-ui-mcp] Error fetching content: ${errorMsg} - ${fullUrl}`);
    return { success: false, error: errorMsg, url: fullUrl };
  }
}

export async function fetchJson<T>(path: string): Promise<FetchResult<T>> {
  const baseUrl = getDocsBaseUrl();
  const fullUrl = `${baseUrl}${path}`;

  try {
    const response = await fetchWithTimeout(fullUrl);
    if (!response.ok) {
      const error = `HTTP ${response.status}: ${response.statusText}`;
      console.error(`[semantic-ui-mcp] Failed to fetch JSON: ${error} - ${fullUrl}`);
      return { success: false, error, url: fullUrl };
    }
    const data = await response.json() as T;
    return { success: true, data, url: fullUrl };
  }
  catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    console.error(`[semantic-ui-mcp] Error fetching JSON: ${errorMsg} - ${fullUrl}`);
    return { success: false, error: errorMsg, url: fullUrl };
  }
}

// Extract a specific section from markdown by heading name
export function extractMarkdownSection(markdown: string, sectionName: string): string | null {
  const lines = markdown.split('\n');
  const normalizedName = sectionName.toLowerCase().replace(/[^a-z0-9]/g, '');

  let startIndex = -1;
  let startLevel = 0;
  let endIndex = lines.length;

  // Find the heading that matches the section name
  each(lines, (line, i) => {
    const headingMatch = line.match(/^(#{1,6})\s+[`']?(\w+)[`']?/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingName = headingMatch[2].toLowerCase().replace(/[^a-z0-9]/g, '');

      if (startIndex === -1 && headingName === normalizedName) {
        startIndex = i as number;
        startLevel = level;
      }
      else if (startIndex !== -1 && level <= startLevel) {
        endIndex = i as number;
        return false; // break
      }
    }
  });

  if (startIndex === -1) {
    return null;
  }

  return lines.slice(startIndex, endIndex).join('\n').trim();
}

// Find item by path or id
export function findSpec(query: string): SpecItem | undefined {
  const normalized = query.toLowerCase().trim();
  return cache.specs.find(s =>
    s.id === normalized
    || s.name.toLowerCase() === normalized
    || s.path === query
  );
}

export function findExample(query: string): ExampleItem | undefined {
  const normalized = query.toLowerCase().trim();
  return cache.examples.find(e =>
    e.id === normalized
    || e.title.toLowerCase() === normalized
    || e.path === query
  );
}

export function findContext(query: string): ContextItem | undefined {
  // Support both full path and shorthand (e.g., "framework/reactivity")
  const normalized = query.startsWith('/content/ai/')
    ? query
    : `/content/ai/${query}.md`;

  return cache.context.find(c => c.path === normalized);
}

export function findDoc(query: string): DocItem | undefined {
  // Support both full path and shorthand (e.g., "guides/reactivity/signals")
  const normalized = query.startsWith('/content/docs/')
    ? query
    : `/content/docs/${query}.md`;

  return cache.docs.find(d => d.path === normalized);
}

// API lookup - search docs by method name
export function searchApi(method: string, pkg?: string): DocItem | null {
  // Filter to docs with methods
  let candidates = cache.docs.filter(d => d.methods && d.methods.length > 0);

  // Filter by package if specified
  if (pkg) {
    candidates = candidates.filter(d => d.package === pkg);
  }

  if (candidates.length === 0) {
    return null;
  }

  // Use weighted search prioritizing methods field
  const results = weightedObjectSearch(method, candidates, {
    propertiesToMatch: ['methods', 'title', 'package'],
    matchAllWords: false,
  }) as DocItem[];

  return results[0] || null;
}
