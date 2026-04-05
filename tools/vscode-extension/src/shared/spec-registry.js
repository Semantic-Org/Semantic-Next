import { existsSync, readFileSync } from 'fs';
import { globSync } from 'glob';
import { basename, dirname, resolve } from 'path';

/*
  Indexes all Semantic UI component specs for HTML attribute completions.
  Reads both .component.js (structural) and .spec.json (semantic metadata).
*/

export class SpecRegistry {
  constructor() {
    this.specs = new Map(); // tagName → SpecInfo
  }

  /*
    Scans a project root for spec files and indexes them by tag name.
  */
  scan(projectRoot) {
    const componentFiles = globSync('**/specs/*.component.js', {
      cwd: projectRoot,
      absolute: true,
      ignore: ['**/node_modules/**'],
    });

    for (const componentFile of componentFiles) {
      try {
        this.indexSpec(componentFile);
      }
      catch (e) {
        // Skip malformed spec files
      }
    }
  }

  /*
    Indexes a single .component.js file and its corresponding .spec.json.
  */
  indexSpec(componentFilePath) {
    const compiled = this.readComponentSpec(componentFilePath);
    if (!compiled?.tagName) { return; }

    // Look for corresponding .spec.json
    const dir = dirname(componentFilePath);
    const prefix = basename(componentFilePath).replace('.component.js', '');
    const specJsonPath = resolve(dir, `${prefix}.spec.json`);
    const sourceSpec = existsSync(specJsonPath) ? this.readSpecJson(specJsonPath) : null;

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
    Reads and parses a .component.js file (JSON-like ES module default export).
  */
  readComponentSpec(filePath) {
    let source = readFileSync(filePath, 'utf8');
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
    Reads and parses a .spec.json file.
  */
  readSpecJson(filePath) {
    try {
      return JSON.parse(readFileSync(filePath, 'utf8'));
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
