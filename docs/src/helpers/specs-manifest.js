export async function getSpecsManifestData() {
  const allSpecs = import.meta.glob('../../../src/primitives/**/specs/*.spec.json', {
    eager: true,
  });

  const specs = Object.entries(allSpecs).map(([path, module]) => {
    const spec = module.default;

    const match = path.match(/\/([^/]+)\.spec\.json$/);
    const slug = match ? match[1] : path;

    const specString = JSON.stringify(spec);
    const tokens = Math.ceil(specString.length / 4);

    return {
      id: slug,
      path: `/content/specs/${slug}.json`,
      name: spec.name || slug,
      tagName: spec.tagName || '',
      description: spec.description || '',
      uiType: spec.uiType || '',
      supportsPlural: spec.supportsPlural || false,
      pluralTagName: spec.pluralTagName || null,
      typesCount: spec.types?.length || 0,
      statesCount: spec.states?.length || 0,
      variationsCount: spec.variations?.length || 0,
      settingsCount: spec.settings?.length || 0,
      contentCount: spec.content?.length || 0,
      tokens,
    };
  });

  return specs;
}

export function buildFullManifest(specs) {
  return {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalSpecs: specs.length,
    totalTokens: specs.reduce((sum, s) => sum + s.tokens, 0),
    specs,
  };
}

export function buildMarkdownManifest(specs) {
  const lines = specs.map(s => `* ${s.id} - ${s.name}`);
  return `# Component Specs\n\n${specs.length} components\n\nFetch JSON: /content/specs/{id}.json\n\n${
    lines.join('\n')
  }\n`;
}

export function buildSlimManifest(specs) {
  return {
    schemaVersion: 1,
    generated: new Date().toISOString(),
    totalSpecs: specs.length,
    totalTokens: specs.reduce((sum, s) => sum + s.tokens, 0),
    specs: specs.map(({ id, path, name, tokens }) => ({
      id,
      path,
      name,
      tokens,
    })),
  };
}
