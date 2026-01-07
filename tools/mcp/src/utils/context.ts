import { existsSync, readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface ContextDocument {
  id: string;
  path: string;
  category: 'foundation' | 'specialized' | 'package' | 'workflow' | 'reference';
  tags: string[];
  recommendedOrder?: number;
  approxTokens: number;
  dependsOn?: string[];
  description?: string;
}

export interface ContextManifest {
  schemaVersion: number;
  documents: ContextDocument[];
}

export interface ContextListItem {
  id: string;
  category: string;
  tags: string[];
  approxTokens: number;
  description?: string;
}

// Load bundled context data
const manifestPath = join(__dirname, '../data/context-manifest.json');
const docsPath = join(__dirname, '../data/context-docs.json');

let manifest: ContextManifest | null = null;
let docs: Record<string, string> = {};

if (existsSync(manifestPath) && existsSync(docsPath)) {
  manifest = JSON.parse(readFileSync(manifestPath, 'utf-8')) as ContextManifest;
  docs = JSON.parse(readFileSync(docsPath, 'utf-8')) as Record<string, string>;
}

// Build lookup maps
const docById = new Map<string, ContextDocument>();
const docsByTag = new Map<string, ContextDocument[]>();
const docsByCategory = new Map<string, ContextDocument[]>();

if (manifest) {
  for (const doc of manifest.documents) {
    docById.set(doc.id, doc);

    // Index by tags
    for (const tag of doc.tags) {
      if (!docsByTag.has(tag)) {
        docsByTag.set(tag, []);
      }
      docsByTag.get(tag)!.push(doc);
    }

    // Index by category
    if (!docsByCategory.has(doc.category)) {
      docsByCategory.set(doc.category, []);
    }
    docsByCategory.get(doc.category)!.push(doc);
  }
}

export function isContextAvailable(): boolean {
  return manifest !== null;
}

export function listContext(options?: {
  category?: string;
  tag?: string;
}): ContextListItem[] {
  if (!manifest) { return []; }

  let documents = manifest.documents;

  if (options?.category) {
    documents = docsByCategory.get(options.category) || [];
  }

  if (options?.tag) {
    const tagged = docsByTag.get(options.tag) || [];
    if (options?.category) {
      const taggedIds = new Set(tagged.map(d => d.id));
      documents = documents.filter(d => taggedIds.has(d.id));
    }
    else {
      documents = tagged;
    }
  }

  return documents.map(doc => ({
    id: doc.id,
    category: doc.category,
    tags: doc.tags,
    approxTokens: doc.approxTokens,
    ...(doc.description && { description: doc.description }),
  }));
}

export function getContext(id: string): {
  document: ContextDocument;
  content: string;
} | null {
  const doc = docById.get(id);
  if (!doc) { return null; }

  const content = docs[id];
  if (!content) { return null; }

  return { document: doc, content };
}

export function searchContext(query: string): ContextListItem[] {
  if (!manifest) { return []; }

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
  if (terms.length === 0) { return []; }

  const results: Array<{ doc: ContextDocument; score: number; }> = [];

  for (const doc of manifest.documents) {
    let score = 0;

    for (const term of terms) {
      // Check id
      if (doc.id.toLowerCase().includes(term)) { score += 3; }

      // Check tags
      for (const tag of doc.tags) {
        if (tag.toLowerCase().includes(term)) { score += 2; }
      }

      // Check description
      if (doc.description?.toLowerCase().includes(term)) { score += 1; }

      // Check category
      if (doc.category.toLowerCase().includes(term)) { score += 1; }
    }

    if (score > 0) {
      results.push({ doc, score });
    }
  }

  return results
    .sort((a, b) => b.score - a.score)
    .map(r => ({
      id: r.doc.id,
      category: r.doc.category,
      tags: r.doc.tags,
      approxTokens: r.doc.approxTokens,
      ...(r.doc.description && { description: r.doc.description }),
    }));
}

export function getCategories(): string[] {
  return Array.from(docsByCategory.keys()).sort();
}

export function getTags(): string[] {
  return Array.from(docsByTag.keys()).sort();
}
