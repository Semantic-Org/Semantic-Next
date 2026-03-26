import { fetchJson, type FetchResult, findSpec, listSpecs, type SpecItem } from './cache.js';

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

export interface ComponentIndex {
  tagName: string;
  name: string;
  description: string;
  pluralTagName: string | null;
}

// Spec cache for fetched full specs
const specCache = new Map<string, ComponentSpec>();

export function listComponents(): SpecItem[] {
  return listSpecs();
}

export async function getComponent(query: string): Promise<FetchResult<{ resolved: string; spec: ComponentSpec; }>> {
  const specItem = findSpec(query);

  if (!specItem) {
    return {
      success: false,
      error: `Component not found: ${query}`,
      url: '',
    };
  }

  // Check cache first
  if (specCache.has(specItem.id)) {
    return {
      success: true,
      data: { resolved: specItem.id, spec: specCache.get(specItem.id)! },
      url: specItem.path,
    };
  }

  // Fetch from docs server
  const result = await fetchJson<ComponentSpec>(specItem.path);

  if (!result.success) {
    return {
      success: false,
      error: result.error,
      url: result.url,
    };
  }

  // Cache the spec
  specCache.set(specItem.id, result.data!);

  return {
    success: true,
    data: { resolved: specItem.id, spec: result.data! },
    url: result.url,
  };
}

export async function getComponentWithChildren(query: string): Promise<
  FetchResult<{
    resolved: string;
    spec: ComponentSpec;
    children: ComponentSpec[];
  }>
> {
  const result = await getComponent(query);

  if (!result.success) {
    return result as FetchResult<{ resolved: string; spec: ComponentSpec; children: ComponentSpec[]; }>;
  }

  const { resolved, spec } = result.data!;
  const children: ComponentSpec[] = [];
  const foundIds = new Set<string>();

  // Find child components from parent's content array (subcomponent entries)
  const content = spec.content as Array<{ subcomponent?: string; tagName?: string; }> | undefined;
  if (content) {
    for (const entry of content) {
      if (entry.subcomponent === 'true' && entry.tagName) {
        // Find the spec item for this tag
        const childSpecItem = findSpec(entry.tagName);
        if (childSpecItem && !foundIds.has(childSpecItem.id)) {
          const childResult = await getComponent(entry.tagName);
          if (childResult.success) {
            children.push(childResult.data!.spec);
            foundIds.add(childSpecItem.id);
          }
        }
      }
    }
  }

  // Also find components that reference this as parentTag
  const allSpecs = listSpecs();
  for (const specItem of allSpecs) {
    if (foundIds.has(specItem.id)) { continue; }

    const childResult = await getComponent(specItem.id);
    if (childResult.success) {
      const childSpec = childResult.data!.spec;
      const parentTag = (childSpec as { parentTag?: string; }).parentTag;
      if (parentTag === spec.tagName) {
        children.push(childSpec);
        foundIds.add(specItem.id);
      }
    }
  }

  return {
    success: true,
    data: { resolved, spec, children },
    url: result.url,
  };
}
