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
  description?: string;
  tokens: number;
  audience: 'ui' | 'framework' | 'contributing' | 'research';
  skill?: string;
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

interface ManifestResult<T> {
  data: T | null;
  error?: string;
  url: string;
}

async function fetchManifest<T>(endpoint: string): Promise<ManifestResult<T>> {
  const baseUrl = getDocsBaseUrl();
  const fullUrl = `${baseUrl}${endpoint}`;

  try {
    const response = await fetchWithTimeout(fullUrl);
    if (!response.ok) {
      return { data: null, error: `HTTP ${response.status}`, url: fullUrl };
    }
    const data = await response.json() as T;
    return { data, url: fullUrl };
  }
  catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    return { data: null, error: msg, url: fullUrl };
  }
}

export async function initCache(): Promise<void> {
  await ensureConfigReady();

  const now = Date.now();

  // Skip if cache is still fresh
  if (cache.ready && (now - cache.lastUpdated) < CACHE_TTL) {
    return;
  }

  const [specsResult, examplesResult, contextResult, docsResult] = await Promise.all([
    fetchManifest<{ specs: Omit<SpecItem, 'type'>[]; }>('/content/specs/index.min.json'),
    fetchManifest<{ examples: Omit<ExampleItem, 'type'>[]; }>('/content/examples/index.min.json'),
    fetchManifest<{ pages: Omit<ContextItem, 'type'>[]; }>('/content/ai/index.min.json'),
    fetchManifest<{ pages: Omit<DocItem, 'type'>[]; }>('/content/docs/index.min.json'),
  ]);

  const errors: string[] = [];

  if (specsResult.data?.specs) {
    cache.specs = specsResult.data.specs.map(s => ({ ...s, type: 'spec' as const }));
  }
  else {
    errors.push(`specs: ${specsResult.error} (${specsResult.url})`);
  }

  if (examplesResult.data?.examples) {
    cache.examples = examplesResult.data.examples.map(e => ({ ...e, type: 'example' as const }));
  }
  else {
    errors.push(`examples: ${examplesResult.error} (${examplesResult.url})`);
  }

  if (contextResult.data?.pages) {
    cache.context = contextResult.data.pages.map(c => ({ ...c, type: 'context' as const }));
  }
  else {
    errors.push(`context: ${contextResult.error} (${contextResult.url})`);
  }

  if (docsResult.data?.pages) {
    cache.docs = docsResult.data.pages.map(d => ({ ...d, type: 'doc' as const }));
  }
  else {
    errors.push(`docs: ${docsResult.error} (${docsResult.url})`);
  }

  cache.ready = true;
  cache.lastUpdated = now;

  if (errors.length === 4) {
    console.error(`[semantic-ui-mcp] ERROR: Could not load any manifests from ${getDocsBaseUrl()}`);
    console.error(`[semantic-ui-mcp] The server may be down or the content API endpoints don't exist.`);
    each(errors, err => console.error(`  - ${err}`));
  }
  else if (errors.length > 0) {
    console.error(`[semantic-ui-mcp] WARNING: Some manifests failed to load:`);
    each(errors, err => console.error(`  - ${err}`));
  }
  else {
    console.error(
      `[semantic-ui-mcp] Loaded: ${cache.specs.length} specs, ${cache.examples.length} examples, ${cache.context.length} context, ${cache.docs.length} docs`,
    );
  }
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

// Skill functions
export function listSkills(): ContextItem[] {
  return cache.context.filter(c => c.skill);
}

export function findSkill(name: string): ContextItem | undefined {
  return cache.context.find(c => c.skill === name);
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
    propertiesToMatch: ['title', 'name', 'id', 'path', 'category', 'audience', 'methods', 'package'],
    matchAllWords: false,
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

// Skill mappings for link rewriting
const SKILL_MAPPINGS: Record<string, string> = {
  'utils': 'utils',
  'reactivity': 'reactivity',
  'query': 'query',
  'templating': 'templating',
  'component': 'component',
  'creating-components': 'creating-components',
  'best-practices': 'best-practices',
  'theming': 'theming',
  'css': 'css',
  'design-tokens': 'design-tokens',
  'html': 'html',
  'markup': 'markup',
  'behaviors': 'behaviors',
  'plugins-and-behaviors': 'behaviors',
  'primitives': 'primitives',
  'using-primitives': 'primitives',
  'parent-child': 'parent-child',
  'portaling': 'portaling',
  'mental-model': 'mental-model',
  'authoring-components': 'web-components',
};

// Rewrite markdown links to MCP tool suggestions
export function rewriteMarkdownLinks(content: string, sourcePath?: string): string {
  // Match markdown links: [text](url)
  return content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, text, url) => {
    // Skip external URLs and anchors
    if (url.startsWith('http') || url.startsWith('#')) {
      return match;
    }

    // Resolve relative paths if we have a source path
    let resolvedUrl = url;
    if (sourcePath && (url.startsWith('./') || url.startsWith('../'))) {
      const sourceDir = sourcePath.substring(0, sourcePath.lastIndexOf('/'));
      resolvedUrl = resolvePath(sourceDir, url);
    }

    // Pattern: /ai/framework/*.md or /content/ai/framework/*.md
    const frameworkMatch = resolvedUrl.match(/(?:\/content)?\/ai\/framework\/([^/.]+)(?:\.md)?/);
    if (frameworkMatch) {
      const name = frameworkMatch[1];
      const skill = SKILL_MAPPINGS[name];
      if (skill) {
        return `${text} (\`use_skill: ${skill}\`)`;
      }
      return `${text} (\`get_context: framework/${name}\`)`;
    }

    // Pattern: /ai/ui/*.md
    const uiMatch = resolvedUrl.match(/(?:\/content)?\/ai\/ui\/([^/.]+)(?:\.md)?/);
    if (uiMatch) {
      const name = uiMatch[1];
      const skill = SKILL_MAPPINGS[name];
      if (skill) {
        return `${text} (\`use_skill: ${skill}\`)`;
      }
      return `${text} (\`get_context: ui/${name}\`)`;
    }

    // Pattern: /ai/contributing/*.md
    const contribMatch = resolvedUrl.match(/(?:\/content)?\/ai\/contributing\/([^/.]+)(?:\.md)?/);
    if (contribMatch) {
      return `${text} (\`get_context: contributing/${contribMatch[1]}\`)`;
    }

    // Pattern: /docs/src/pages/docs/api/*.mdx or /content/docs/api/*.md
    const apiMatch = resolvedUrl.match(/(?:\/content)?\/docs\/(?:src\/pages\/)?(?:docs\/)?api\/([^)]+?)(?:\.mdx?)?$/);
    if (apiMatch) {
      return `${text} (\`get_user_doc: api/${apiMatch[1]}\`)`;
    }

    // Pattern: /docs/src/pages/docs/guides/*.mdx
    const guideMatch = resolvedUrl.match(
      /(?:\/content)?\/docs\/(?:src\/pages\/)?(?:docs\/)?guides\/([^)]+?)(?:\.mdx?)?$/,
    );
    if (guideMatch) {
      return `${text} (\`get_user_doc: guides/${guideMatch[1]}\`)`;
    }

    // Keep original if no pattern matches
    return match;
  });
}

// Simple path resolution for relative paths
function resolvePath(base: string, relative: string): string {
  const baseParts = base.split('/').filter(Boolean);
  const relativeParts = relative.split('/');

  for (const part of relativeParts) {
    if (part === '..') {
      baseParts.pop();
    }
    else if (part !== '.') {
      baseParts.push(part);
    }
  }

  return '/' + baseParts.join('/');
}

// Fetch actual content
export async function fetchContent(path: string, rewriteLinks = true): Promise<FetchResult<string>> {
  const baseUrl = getDocsBaseUrl();
  const fullUrl = `${baseUrl}${path}`;

  try {
    const response = await fetchWithTimeout(fullUrl);
    if (!response.ok) {
      const error = `HTTP ${response.status}: ${response.statusText}`;
      console.error(`[semantic-ui-mcp] Failed to fetch content: ${error} - ${fullUrl}`);
      return { success: false, error, url: fullUrl };
    }
    let data = await response.text();

    // Rewrite markdown links to MCP tool suggestions
    if (rewriteLinks && (path.endsWith('.md') || path.includes('/ai/'))) {
      data = rewriteMarkdownLinks(data, path);
    }

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
  const normalizedName = sectionName.toLowerCase();

  let startIndex = -1;
  let startLevel = 0;
  let endIndex = lines.length;

  each(lines, (line, i) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const headingText = headingMatch[2].toLowerCase();

      // Check if heading starts with the method name
      if (startIndex === -1 && headingText.startsWith(normalizedName)) {
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

// Related content interface
export interface Related {
  examples?: string[];
  skills?: string[];
  docs?: string[];
}

// Normalization helpers for convention-based linking
function methodToKebab(method: string): string {
  // weightedObjectSearch → weightedobjectsearch
  return method.toLowerCase();
}

function packageToSkill(pkg: string): string {
  // @semantic-ui/utils → utils
  return pkg.replace('@semantic-ui/', '');
}

function extractFunctionFromExampleId(id: string): string | null {
  // utils-weightedobjectsearch → weightedobjectsearch
  // Skip common prefixes
  const prefixes = ['utils-', 'query-', 'reactivity-', 'templating-', 'component-'];
  for (const prefix of prefixes) {
    if (id.startsWith(prefix)) {
      return id.slice(prefix.length);
    }
  }
  return null;
}

// Find related content for a doc (API doc)
export function findRelatedForDoc(doc: DocItem): Related {
  const related: Related = {};

  // Find examples where ID contains any method name (kebab-case)
  if (doc.methods && doc.methods.length > 0) {
    const matchingExamples: string[] = [];
    for (const method of doc.methods) {
      const kebab = methodToKebab(method);
      for (const example of cache.examples) {
        if (example.id.includes(kebab) && !matchingExamples.includes(example.id)) {
          matchingExamples.push(example.id);
        }
      }
    }
    if (matchingExamples.length > 0) {
      related.examples = matchingExamples;
    }
  }

  // Find skill matching package name
  if (doc.package) {
    const skillName = packageToSkill(doc.package);
    const skill = cache.context.find(c => c.skill === skillName);
    if (skill) {
      related.skills = [skillName];
    }
  }

  return related;
}

// Find related content for an example
export function findRelatedForExample(example: ExampleItem): Related {
  const related: Related = {};

  // Extract function name from example ID
  const funcName = extractFunctionFromExampleId(example.id);
  if (funcName) {
    // Find docs whose methods[] includes the function name
    const matchingDocs: string[] = [];
    for (const doc of cache.docs) {
      if (doc.methods) {
        for (const method of doc.methods) {
          if (methodToKebab(method) === funcName) {
            // Convert path to shorthand: /content/docs/api/utils/objects.md → api/utils/objects
            const shortPath = doc.path
              .replace('/content/docs/', '')
              .replace('.md', '');
            if (!matchingDocs.includes(shortPath)) {
              matchingDocs.push(shortPath);
            }
          }
        }
      }
    }
    if (matchingDocs.length > 0) {
      related.docs = matchingDocs;
    }
  }

  return related;
}

// Find related content for a component spec
export function findRelatedForSpec(componentId: string): Related {
  const related: Related = {};

  // Find examples whose ID contains component name
  const componentName = componentId.toLowerCase();
  const matchingExamples: string[] = [];

  for (const example of cache.examples) {
    const exampleId = example.id.toLowerCase();
    // Match component name at start, end, or as separate word (with hyphen)
    if (
      exampleId.startsWith(componentName + '-')
      || exampleId.endsWith('-' + componentName)
      || exampleId.includes('-' + componentName + '-')
      || exampleId === componentName
    ) {
      matchingExamples.push(example.id);
    }
  }

  if (matchingExamples.length > 0) {
    related.examples = matchingExamples;
  }

  return related;
}
