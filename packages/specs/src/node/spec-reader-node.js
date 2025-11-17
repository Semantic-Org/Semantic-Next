import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { SpecReader as BaseSpecReader } from '../spec-reader.js';

export class SpecReader extends BaseSpecReader {
  writeComponentSpec(path, options = {}) {
    const { plural = this.plural, banner = '' } = options;

    mkdirSync(dirname(path), { recursive: true });

    const componentSpec = this.getWebComponentSpec(this.spec, { plural });

    let content = '';
    if (banner) {
      content += `${banner}\n`;
    }
    content += `// Auto-generated from spec\n`;
    content += `export default ${JSON.stringify(componentSpec, null, 2)};\n`;

    writeFileSync(path, content);
    return this;
  }

  writeSpecJSON(path) {
    mkdirSync(dirname(path), { recursive: true });

    const content = JSON.stringify(this.spec, null, 2) + '\n';
    writeFileSync(path, content);
    return this;
  }

  writeAll(basePath, options = {}) {
    this.writeComponentSpec(`${basePath}.component.js`, options);
    this.writeSpecJSON(`${basePath}.spec.json`);

    // If spec supports plural, generate plural component spec
    if (this.spec.supportsPlural) {
      const pluralOptions = { ...options, plural: true };
      const pluralName = this.spec.pluralTagName?.replace('ui-', '') || 'plural';
      const pluralPath = dirname(basePath) + '/' + pluralName + '.component.js';

      this.writeComponentSpec(pluralPath, pluralOptions);
    }

    return this;
  }
}

// Re-export everything from base module for convenience
export * from '../spec-reader.js';
