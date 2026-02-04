import { mkdirSync, writeFileSync } from 'fs';
import { dirname } from 'path';
import { SpecReader as BaseSpecReader } from './spec-reader.js';

// Re-export all shared terms and helpers
export * from './helpers.js';
export * from './icon.js';
export * from './states/index.js';
export * from './types/index.js';
export * from './variations/index.js';

// Server-specific version of SpecReader with file system operations
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
  }

  writeTestFromSpec(path, options = {}) {
    const spec = this.spec;
    const componentSpec = this.getTestFromSpec(spec);

    mkdirSync(dirname(path), { recursive: true });

    let content = `// Auto-generated test spec\n`;
    content += `export default ${JSON.stringify(componentSpec, null, 2)};\n`;

    writeFileSync(path, content);
  }
}
