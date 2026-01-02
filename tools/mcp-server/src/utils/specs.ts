import { readFileSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export interface ComponentIndex {
  tagName: string;
  name: string;
  description: string;
  pluralTagName: string | null;
}

export interface ComponentSpec {
  tagName: string;
  name: string;
  description: string;
  pluralTagName?: string;
  content?: unknown[];
  types?: unknown[];
  states?: unknown[];
  variations?: unknown[];
  settings?: unknown[];
  events?: unknown[];
  [key: string]: unknown;
}

// Load bundled data
const specsData = JSON.parse(
  readFileSync(join(__dirname, '../data/specs.json'), 'utf-8'),
) as Record<string, ComponentSpec>;

const indexData = JSON.parse(
  readFileSync(join(__dirname, '../data/index.json'), 'utf-8'),
) as ComponentIndex[];

// Build lookup maps
const specsByTag = new Map<string, ComponentSpec>();
const specsByName = new Map<string, ComponentSpec>();
const aliases = new Map<string, string>();

for (const [tagName, spec] of Object.entries(specsData)) {
  specsByTag.set(tagName, spec);
  specsByName.set(spec.name.toLowerCase(), spec);

  // Add aliases without ui- prefix
  if (tagName.startsWith('ui-')) {
    aliases.set(tagName.slice(3), tagName);
  }

  // Add lowercase name as alias
  aliases.set(spec.name.toLowerCase(), tagName);
}

export function listComponents(): ComponentIndex[] {
  return indexData;
}

export function getComponent(query: string): { resolved: string; spec: ComponentSpec; } | null {
  const normalized = query.toLowerCase().trim();

  // Try exact tag match
  if (specsByTag.has(normalized)) {
    return { resolved: normalized, spec: specsByTag.get(normalized)! };
  }

  // Try with ui- prefix
  const withPrefix = `ui-${normalized}`;
  if (specsByTag.has(withPrefix)) {
    return { resolved: withPrefix, spec: specsByTag.get(withPrefix)! };
  }

  // Try alias lookup
  if (aliases.has(normalized)) {
    const tagName = aliases.get(normalized)!;
    return { resolved: tagName, spec: specsByTag.get(tagName)! };
  }

  // Try name match
  if (specsByName.has(normalized)) {
    const spec = specsByName.get(normalized)!;
    return { resolved: spec.tagName, spec };
  }

  return null;
}

export function getComponentWithChildren(query: string): {
  resolved: string;
  spec: ComponentSpec;
  children: ComponentSpec[];
} | null {
  const result = getComponent(query);
  if (!result) { return null; }

  const children: ComponentSpec[] = [];
  const foundTags = new Set<string>();

  // Find child components from parent's content array (subcomponent entries)
  const content = result.spec.content as Array<{ subcomponent?: string; tagName?: string; }> | undefined;
  if (content) {
    for (const entry of content) {
      if (entry.subcomponent === 'true' && entry.tagName) {
        const childSpec = specsByTag.get(entry.tagName);
        if (childSpec && !foundTags.has(entry.tagName)) {
          children.push(childSpec);
          foundTags.add(entry.tagName);
        }
      }
    }
  }

  // Also find components that reference this as parentTag
  for (const spec of Object.values(specsData)) {
    const parentTag = (spec as { parentTag?: string; }).parentTag;
    if (parentTag === result.resolved && !foundTags.has(spec.tagName)) {
      children.push(spec);
      foundTags.add(spec.tagName);
    }
  }

  return { ...result, children };
}
