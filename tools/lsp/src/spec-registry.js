/*
  Indexes all Semantic UI component specs for HTML attribute completions.
  Reads both .component.js (structural) and .spec.json (semantic metadata).

  Isomorphic — all file I/O goes through an injected resolver.
*/

export class SpecRegistry {
  constructor() {
    this.specs = new Map(); // tagName → SpecInfo
  }

  /*
    Scans a project root for spec files and indexes them by tag name.
    resolver: { glob(pattern, root), readFile(path), exists(path) }
  */
  scan(projectRoot, resolver) {
    if (!resolver) { return; }

    const componentFiles = resolver.glob('**/specs/*.component.js', projectRoot);

    for (const componentFile of componentFiles) {
      try {
        const source = resolver.readFile(componentFile);
        this.indexSpec(source, componentFile, resolver);
      }
      catch (e) {
        // Skip malformed spec files
      }
    }
  }

  /*
    Indexes a single .component.js file and its corresponding .spec.json.
    Takes source text and file path. Resolver is used to look up companion .spec.json.
  */
  indexSpec(componentSource, componentFilePath, resolver) {
    const compiled = this.readComponentSpec(componentSource);
    if (!compiled?.tagName) { return; }

    // Look for corresponding .spec.json
    let sourceSpec = null;
    if (resolver) {
      const dir = pathDirname(componentFilePath);
      const prefix = pathBasename(componentFilePath).replace('.component.js', '');
      const specJsonPath = pathJoin(dir, `${prefix}.spec.json`);
      if (resolver.exists(specJsonPath)) {
        sourceSpec = this.readSpecJson(resolver.readFile(specJsonPath));
      }
    }

    const info = {
      tagName: compiled.tagName,
      filePath: componentFilePath,

      // Structural (from compiled spec)
      attributes: compiled.attributes || [],
      allowedValues: compiled.allowedValues || {},
      optionAttributes: compiled.optionAttributes || {},
      propertyTypes: compiled.propertyTypes || {},
      defaultValues: compiled.defaultValues || {},
      content: compiled.content || [],
      types: compiled.types || [],
      variations: compiled.variations || [],
      states: compiled.states || [],
      settings: compiled.settings || [],
      attributeClasses: compiled.attributeClasses || [],

      // Semantic (from source spec JSON — may be null)
      name: sourceSpec?.name || null,
      description: sourceSpec?.description || null,
      uiType: sourceSpec?.uiType || null,
      attributeInfo: sourceSpec ? this.buildAttributeInfo(sourceSpec) : new Map(),
    };

    this.specs.set(compiled.tagName, info);
  }

  /*
    Parses a .component.js source string (JSON-like ES module default export).
  */
  readComponentSpec(source) {
    // Strip leading comments before the export
    source = source.replace(/^\/\/[^\n]*\n/gm, '');
    // .component.js files are `export default { ... }` with JSON-compatible content
    const match = source.match(/export\s+default\s+({[\s\S]*})\s*;?\s*$/);
    if (!match) { return null; }
    try {
      return JSON.parse(match[1]);
    }
    catch {
      return null;
    }
  }

  /*
    Parses a .spec.json source string.
  */
  readSpecJson(source) {
    try {
      return JSON.parse(source);
    }
    catch {
      return null;
    }
  }

  /*
    Builds a Map of attribute name → rich metadata from the source spec JSON.
    Covers content, types, states, variations, and settings sections.
  */
  buildAttributeInfo(spec) {
    const info = new Map();
    const sections = ['content', 'types', 'states', 'variations', 'settings'];

    for (const section of sections) {
      const items = spec[section];
      if (!Array.isArray(items)) { continue; }

      for (const item of items) {
        const attr = item.attribute || item.name?.toLowerCase();
        if (!attr) { continue; }

        const optionInfo = new Map();
        if (item.options) {
          for (const opt of item.options) {
            const value = opt.value;
            if (value) {
              optionInfo.set(String(value), {
                name: opt.name || null,
                description: opt.description || null,
                exampleCode: opt.exampleCode || null,
              });
            }
          }
        }

        info.set(attr, {
          name: item.name || null,
          description: item.description || null,
          usageLevel: item.usageLevel ?? 3,
          exampleCode: item.exampleCode || null,
          section,
          optionInfo,
        });
      }
    }

    return info;
  }

  /*
    Indexes a pre-parsed component spec object directly.
    Use when the spec is already a JS object (e.g., imported from @semantic-ui/core).
    Optional sourceSpec provides rich metadata (descriptions, examples).
  */
  indexParsedSpec(compiled, sourceSpec = null) {
    if (!compiled?.tagName) { return; }
    const info = {
      tagName: compiled.tagName,
      filePath: null,
      attributes: compiled.attributes || [],
      allowedValues: compiled.allowedValues || {},
      optionAttributes: compiled.optionAttributes || {},
      propertyTypes: compiled.propertyTypes || {},
      defaultValues: compiled.defaultValues || {},
      content: compiled.content || [],
      types: compiled.types || [],
      variations: compiled.variations || [],
      states: compiled.states || [],
      settings: compiled.settings || [],
      attributeClasses: compiled.attributeClasses || [],
      name: sourceSpec?.name || null,
      description: sourceSpec?.description || null,
      uiType: sourceSpec?.uiType || null,
      attributeInfo: sourceSpec ? this.buildAttributeInfo(sourceSpec) : new Map(),
    };
    this.specs.set(compiled.tagName, info);
  }

  /*
    Returns spec info for a tag name, or null if not found.
  */
  get(tagName) {
    return this.specs.get(tagName) || null;
  }

  /*
    Returns all registered tag names.
  */
  getTagNames() {
    return [...this.specs.keys()];
  }
}

// Minimal path ops — no 'path' import needed
function pathDirname(p) { const i = p.lastIndexOf('/'); return i > 0 ? p.substring(0, i) : '/'; }
function pathBasename(p) { return p.substring(p.lastIndexOf('/') + 1); }
function pathJoin(dir, file) { return dir.endsWith('/') ? dir + file : dir + '/' + file; }
